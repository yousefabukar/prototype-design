use super::utils::JsMutex;
use super::RUNTIME;
use crate::error::ContainerError;
use crate::image::ContainerImg;
use neon::prelude::*;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;

type JsImgPtr = JsBox<Arc<JsMutex<ContainerImg>>>;

impl Finalize for ContainerImg {
    fn finalize<'a, C: Context<'a>>(self, _: &mut C) {
        RUNTIME.spawn(async move {
            #[cfg(debug_assertions)]
            self.cleanup()
                .await
                .expect("Cleanup of image extraction failed");

            #[cfg(not(debug_assertions))]
            let _ = self.cleanup().await;
        });
    }
}

pub struct JsContainerImg;

impl JsContainerImg {
    pub fn js_new(mut ctx: FunctionContext) -> JsResult<JsImgPtr> {
        let path = PathBuf::from(ctx.argument::<JsString>(0)?.value(&mut ctx));
        Ok(ctx.boxed(Arc::new(JsMutex(Mutex::new(ContainerImg::new(path))))))
    }

    pub fn extract(mut ctx: FunctionContext) -> JsResult<JsPromise> {
        let img = (**ctx.this::<JsImgPtr>()?).clone();

        let channel = ctx.channel();
        let (deferred, promise) = ctx.promise();

        RUNTIME.spawn(async move {
            let ex = img.lock().await.extract();

            deferred.settle_with(&channel, move |mut ctx| {
                if let Err(error) = ex {
                    ctx.throw_error(error.to_string())
                } else {
                    Ok(ctx.undefined())
                }
            });
        });

        Ok(promise)
    }

    pub fn verify(mut ctx: FunctionContext) -> JsResult<JsPromise> {
        let img = (**ctx.this::<JsImgPtr>()?).clone();

        let channel = ctx.channel();
        let (deferred, promise) = ctx.promise();

        RUNTIME.spawn(async move {
            let ex = img.lock().await.verify().await;

            deferred.settle_with(
                &channel,
                move |mut ctx| Ok(ctx.boolean(ex.unwrap_or(false))),
            );
        });

        Ok(promise)
    }
}

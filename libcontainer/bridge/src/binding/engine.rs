use super::parse::FromObject;
use super::utils::JsMutex;
use super::RUNTIME;
use crate::engine::ContainerEngine;
use crate::error::ContainerError;
use crate::image::ContainerImg;
use crate::service::ContainerManagerProxy;
use neon::prelude::*;
use shared::engine::ContainerHandle;
use shared::image::{ImageManifest, ImageOptions, TestOutput};
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;
use zbus::Connection;

type JsContainerPtr<'a> = JsBox<Arc<JsMutex<ContainerEngine<'a>>>>;

impl Finalize for ContainerEngine<'static> {
    fn finalize<'a, C: Context<'a>>(self, _: &mut C) {
        RUNTIME.spawn(async move {
            #[cfg(debug_assertions)]
            self.cleanup()
                .await
                .expect("Cleanup of container engine failed");

            #[cfg(not(debug_assertions))]
            let _ = self.cleanup().await;
        });
    }
}

pub struct JsContainerEngine;

impl JsContainerEngine {
    pub fn js_new(mut ctx: FunctionContext) -> JsResult<JsPromise> {
        let opts = {
            let js_val = ctx.argument::<JsObject>(0)?;
            ImageOptions::from_js(&mut ctx, js_val)?
        };
        let img = (**ctx.argument::<JsBox<ContainerImg>>(0)?).clone();

        let channel = ctx.channel();
        let (deferred, promise) = ctx.promise();

        RUNTIME.spawn(async move {
            let maybe = async move {
                let conn = Connection::session().await?;
                let proxy = ContainerManagerProxy::new(&conn).await?;

                let engine = ContainerEngine::new(proxy, opts, img).await?;

                Ok::<_, ContainerError>(Arc::new(JsMutex(Mutex::new(engine))))
            }
            .await;

            deferred.settle_with(&channel, move |mut ctx| match maybe {
                Ok(value) => Ok(ctx.boxed(value)),
                Err(e) => ctx.throw_error(e.to_string()),
            })
        });

        Ok(promise)
    }

    pub fn set_submission(mut ctx: FunctionContext) -> JsResult<JsPromise> {
        let engine_ptr = (**ctx.this::<JsContainerPtr>()?).clone();
        let path = PathBuf::from(ctx.argument::<JsString>(0)?.value(&mut ctx));

        let channel = ctx.channel();
        let (deferred, promise) = ctx.promise();

        RUNTIME.spawn(async move {
            let res = engine_ptr.lock().await.set_submission(path).await;

            deferred.settle_with(&channel, move |mut ctx| {
                if let Err(e) = res {
                    ctx.throw_error(e.to_string())
                } else {
                    Ok(ctx.undefined())
                }
            });
        });

        Ok(promise)
    }
}

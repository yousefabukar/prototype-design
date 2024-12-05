use super::RUNTIME;
use crate::image::ContainerImg;
use neon::prelude::*;
use std::path::PathBuf;

impl Finalize for ContainerImg {
    fn finalize<'a, C: Context<'a>>(self, _: &mut C) {
        let _ = self.cleanup();
    }
}

pub struct JsContainerImg;

impl JsContainerImg {
    pub fn js_new(mut ctx: FunctionContext) -> JsResult<JsBox<ContainerImg>> {
        let path = PathBuf::from(ctx.argument::<JsString>(0)?.value(&mut ctx));
        Ok(ctx.boxed(ContainerImg::new(path)))
    }

    pub fn extract(mut ctx: FunctionContext) -> JsResult<JsPromise> {
        let mut img = (**ctx.this::<JsBox<ContainerImg>>()?).clone();

        let channel = ctx.channel();
        let (resolve, promise) = ctx.promise();

        RUNTIME.spawn(async move {
            let ex = img.extract();

            resolve.settle_with(&channel, move |mut ctx| {
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
        let mut img = (**ctx.this::<JsBox<ContainerImg>>()?).clone();

        let channel = ctx.channel();
        let (resolve, promise) = ctx.promise();

        RUNTIME.spawn(async move {
            let ex = img.verify();

            resolve.settle_with(
                &channel,
                move |mut ctx| Ok(ctx.boolean(ex.unwrap_or(false))),
            );
        });

        Ok(promise)
    }
}

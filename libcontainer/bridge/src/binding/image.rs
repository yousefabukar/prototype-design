use neon::prelude::*;

use crate::image::ContainerImg;
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
        let img = ctx.this::<JsBox<ContainerImg>>()?;
        todo!()
    }
}

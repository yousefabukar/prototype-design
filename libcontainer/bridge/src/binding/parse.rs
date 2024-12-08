use std::path::PathBuf;

use neon::prelude::*;
use shared::image::ImageOptions;

macro_rules! get_type {
    ($ctx: expr, $obj: expr, $target: ty, $key: expr) => {
        $obj.get::<$target, _, _>($ctx, $key)?.value($ctx)
    };
}

pub trait FromObject {
    fn from_js(ctx: &mut FunctionContext, obj: Handle<'_, JsObject>) -> NeonResult<Self>
    where
        Self: Sized;
}

impl FromObject for ImageOptions {
    fn from_js(ctx: &mut FunctionContext, obj: Handle<'_, JsObject>) -> NeonResult<Self> {
        Ok(ImageOptions {
            cpus: get_type!(ctx, obj, JsNumber, "cpus") as u8,
            mem: get_type!(ctx, obj, JsNumber, "cpus") as u64,
            manifest_path: PathBuf::from(get_type!(ctx, obj, JsString, "manifestPath")),
        })
    }
}

use neon::prelude::*;
use shared::image::ImageOptions;
use shared::image::TestOutput;
use std::path::PathBuf;

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

pub trait ToObject<'a> {
    fn to_js<T: Value, C: Context<'a>>(self, ctx: &mut C) -> NeonResult<Handle<'a, T>>;
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

impl<'a> ToObject<'a> for TestOutput {
    fn to_js<T: Value, C: Context<'a>>(self, ctx: &mut C) -> NeonResult<Handle<'a, T>> {
        let passed = ctx.boolean(self.passed);
        let weight = ctx.number(self.weight);

        let obj = JsObject::new(ctx);
        obj.set(ctx, "passed", passed)?;
        obj.set(ctx, "weight", weight)?;

        obj.downcast_or_throw(ctx)
    }
}

impl<'a> ToObject<'a> for Vec<TestOutput> {
    fn to_js<T: Value, C: Context<'a>>(self, ctx: &mut C) -> NeonResult<Handle<'a, T>> {
        let arr = JsArray::new(ctx, self.len());

        for (idx, test) in self.into_iter().enumerate() {
            let value = test.to_js::<JsObject, C>(ctx)?;
            arr.set(ctx, idx as u32, value)?;
        }

        arr.downcast_or_throw(ctx)
    }
}

#![warn(clippy::todo, clippy::dbg_macro, clippy::unwrap_used)]

mod engine;
mod error;
mod image;
mod service;

use neon::prelude::*;

const MANIFEST_URI: &str = "/root/manifest.json";

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node"))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("hello", hello)?;
    Ok(())
}

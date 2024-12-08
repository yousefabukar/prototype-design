#![warn(clippy::todo, clippy::dbg_macro, clippy::unwrap_used)]

mod binding;
mod engine;
mod error;
mod image;
mod service;
mod utils;

use binding::engine::JsContainerEngine;
use binding::image::JsContainerImg;
use neon::prelude::*;

#[neon::main]
fn main(mut ctx: ModuleContext) -> NeonResult<()> {
    ctx.export_function("binding__containerimg_new", JsContainerImg::js_new)?;
    ctx.export_function("binding__containerimg_extract", JsContainerImg::extract)?;
    ctx.export_function("binding__containerimg_verify", JsContainerImg::verify)?;

    ctx.export_function("binding__containerengine_new", JsContainerEngine::js_new)?;
    ctx.export_function(
        "binding__containerengine_waitcompletion",
        JsContainerEngine::wait_for_completion,
    )?;
    ctx.export_function(
        "binding__containerengine_testoutput",
        JsContainerEngine::test_output,
    )?;

    Ok(())
}

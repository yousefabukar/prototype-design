#![warn(clippy::todo, clippy::dbg_macro, clippy::unwrap_used)]

mod binding;
mod engine;
mod error;
mod image;
mod service;

use binding::image::JsContainerImg;
use neon::prelude::*;

#[neon::main]
fn main(mut ctx: ModuleContext) -> NeonResult<()> {
    ctx.export_function("binding__containerimg_new", JsContainerImg::js_new)?;
    ctx.export_function("binding__containerimg_extract", JsContainerImg::extract)?;
    ctx.export_function("binding__containerimg_verify", JsContainerImg::verify)?;

    Ok(())
}

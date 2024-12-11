use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use zbus::zvariant::Type;

pub const MANIFEST_URI: &str = "/var/fncs/manifest.json";

#[derive(Type, Serialize, Deserialize)]
pub struct ImageOptions {
    pub cpus: u8,
    pub mem: u64,
}

#[derive(Type, Serialize, Deserialize)]
pub struct ImageManifest {
    pub extraction_dir: PathBuf,
    pub test_script: PathBuf,
    pub test_manifest: PathBuf,
}

#[derive(Type, Serialize, Deserialize)]
pub struct TestOutput {
    pub passed: bool,
    pub weight: u32,
}

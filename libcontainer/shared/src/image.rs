use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use zbus::zvariant::Type;

#[derive(Type, Serialize, Deserialize)]
pub struct ImageOptions {
    pub cpus: u8,
    pub mem: u64,
    pub manifest_path: PathBuf,
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
    pub weight: usize,
}

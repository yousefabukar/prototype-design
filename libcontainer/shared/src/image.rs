use serde::{Deserialize, Serialize};
use std::path::PathBuf;

pub struct ImageOptions {
    pub cpus: u8,
    pub mem: usize,
    pub manifest_path: PathBuf,
}

#[derive(Serialize, Deserialize)]
pub struct ImageManifest {
    pub extraction_dir: PathBuf,
    pub test_script: PathBuf,
    pub test_manifest: PathBuf,
}

#[derive(Serialize, Deserialize)]
pub struct TestManifest {
    pub output: String,
    pub tests: Vec<TestOutput>,
}

#[derive(Serialize, Deserialize)]
pub struct TestOutput {
    pub passed: bool,
    pub weight: usize,
}

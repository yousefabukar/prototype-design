use crate::error::EngineError;
use shared::image::{ImageManifest, ImageOptions};
use std::path::PathBuf;
use tokio::fs;
use tokio::process::{Child, Command};

pub struct ContainerEngine {
    proc: Child,
}

impl ContainerEngine {
    pub async fn new(opts: ImageOptions, img_path: PathBuf) -> Result<Self, EngineError> {
        let manifest: ImageManifest = serde_json::from_slice(
            &fs::read(&opts.manifest_path)
                .await
                .map_err(|_| EngineError::FileNotFound)?,
        )?;

        let proc = Command::new("systemd-nspawn")
            .args([
                "-D",
                img_path.to_str().ok_or(EngineError::PathStr)?,
                opts.manifest_path.to_str().ok_or(EngineError::PathStr)?,
            ])
            .spawn()
            .map_err(|_| EngineError::SpawnFailure);

        todo!()
    }

    pub fn is_finished(&self) -> bool {
        self.proc.id().is_none()
    }
}

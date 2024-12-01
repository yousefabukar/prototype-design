use crate::error::EngineError;
use shared::image::ImageOptions;
use std::path::PathBuf;
use tokio::process::{Child, Command};

pub struct ContainerEngine {
    proc: Child,
}

impl ContainerEngine {
    pub async fn new(opts: ImageOptions, img_path: PathBuf) -> Result<Self, EngineError> {
        let proc = Command::new("systemd-nspawn")
            .args([
                "-D",
                img_path.to_str().ok_or(EngineError::PathStr)?,
                opts.manifest_path.to_str().ok_or(EngineError::PathStr)?,
            ])
            .spawn()?;

        todo!()
    }

    pub fn is_finished(&self) -> bool {
        self.proc.id().is_none()
    }
}

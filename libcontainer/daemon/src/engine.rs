use crate::error::EngineError;
use crate::sys::SchedulerIface;
use shared::image::{ImageManifest, ImageOptions, TestManifest};
use std::path::PathBuf;
use tokio::fs;
use tokio::process::{Child, Command};

pub struct ContainerEngine {
    proc: Child,
    img_path: PathBuf,
    manifest: ImageManifest,
}

impl ContainerEngine {
    pub async fn new(opts: ImageOptions, img_path: PathBuf) -> Result<Self, EngineError> {
        let manifest: ImageManifest = serde_json::from_slice(
            &fs::read(&opts.manifest_path)
                .await
                .map_err(|_| EngineError::FileNotFound)?,
        )?;

        SchedulerIface::set_max_mem(opts.mem)?;

        let proc = Command::new("systemd-nspawn")
            .args([
                "-D",
                img_path.to_str().ok_or(EngineError::PathStr)?,
                manifest.test_script.to_str().ok_or(EngineError::PathStr)?,
            ])
            .spawn()
            .map_err(|_| EngineError::SpawnFailure)?;

        SchedulerIface::set_max_cpus(proc.id().ok_or(EngineError::SpawnFailure)?, opts.cpus)?;

        Ok(ContainerEngine {
            proc,
            img_path,
            manifest,
        })
    }

    pub fn is_finished(&self) -> bool {
        self.proc.id().is_none()
    }

    pub async fn test_output(&self) -> Result<TestManifest, EngineError> {
        let path = self.img_path.join(&self.manifest.test_manifest);

        Ok(serde_json::from_slice(
            &fs::read(path)
                .await
                .map_err(|_| EngineError::FileNotFound)?,
        )?)
    }
}

use crate::error::EngineError;
use crate::sys::SchedulerIface;
use shared::image::MANIFEST_URI;
use shared::image::{ImageManifest, ImageOptions, TestOutput};
use shared::join_img_abs;
use std::path::PathBuf;
use std::process::Stdio;
use tokio::fs;
use tokio::process::{Child, Command};

pub struct ContainerEngine {
    proc: Option<Child>,
    img_path: PathBuf,
    manifest: ImageManifest,
}

impl ContainerEngine {
    pub async fn new(opts: ImageOptions, img_path: PathBuf) -> Result<Self, EngineError> {
        let manifest_uri = PathBuf::from(MANIFEST_URI);

        let manifest: ImageManifest = serde_json::from_slice(
            &fs::read(join_img_abs!(img_path, manifest_uri))
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
            .stdout(Stdio::piped())
            .spawn()
            .map_err(|_| EngineError::SpawnFailure)?;

        SchedulerIface::set_max_cpus(proc.id().ok_or(EngineError::SpawnFailure)?, opts.cpus)?;

        Ok(ContainerEngine {
            proc: Some(proc),
            img_path,
            manifest,
        })
    }

    pub async fn wait_for_completion(&mut self) -> Result<String, EngineError> {
        Ok(String::from_utf8_lossy(
            &self
                .proc
                .take()
                .ok_or(EngineError::Runtime(
                    "Process is not available. Did you run the same function twice?",
                ))?
                .wait_with_output()
                .await
                .map_err(|_| {
                    EngineError::Runtime("Failed to read standard output from subprecess")
                })?
                .stdout,
        )
        .to_string())
    }

    pub async fn test_output(self) -> Result<Vec<TestOutput>, EngineError> {
        if let Some(proc) = self.proc.as_ref() {
            if proc.id().is_some() {
                return Err(EngineError::Runtime(
                    "Attempted to get the test output while the process is still running.",
                ));
            }
        }

        let path = join_img_abs!(self.img_path, self.manifest.test_manifest);

        Ok(serde_json::from_slice(
            &fs::read(path)
                .await
                .map_err(|_| EngineError::FileNotFound)?,
        )?)
    }
}

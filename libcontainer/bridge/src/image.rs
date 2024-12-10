use crate::error::ContainerError;
use shared::image::{ImageManifest, MANIFEST_URI};
use shared::join_img_abs;
use std::env;
use std::fs::File;
use std::path::PathBuf;
use tar::Archive;
use uuid::Uuid;

#[derive(Clone)]
pub struct ContainerImg {
    pub(super) path: PathBuf,
    original_path: Option<PathBuf>,
}

impl ContainerImg {
    pub fn new(path: PathBuf) -> Self {
        ContainerImg {
            path,
            original_path: None,
        }
    }

    pub fn extract(&mut self) -> Result<(), ContainerError> {
        let target_dir = env::temp_dir().join(Uuid::new_v4().to_string());

        let archive_ptr = File::open(&self.path).map_err(|_| ContainerError::FileNotFound)?;

        let mut archive = Archive::new(archive_ptr);
        archive
            .unpack(&target_dir)
            .map_err(|_| ContainerError::ExtractionFailure)?;

        self.original_path.replace(self.path.clone());
        self.path = target_dir;
        Ok(())
    }

    pub async fn verify(&mut self) -> Result<bool, ContainerError> {
        if !self.path.is_dir() {
            return Ok(false);
        }

        let Ok(manifest) = self.read_manifest().await else {
            return Ok(false);
        };

        Ok(join_img_abs!(self.path, manifest.test_script).is_file()
            && !join_img_abs!(self.path, manifest.extraction_dir).exists()
            && !join_img_abs!(self.path, manifest.test_manifest).exists())
    }

    pub async fn cleanup(self) -> Result<(), ContainerError> {
        tokio::fs::remove_dir_all(self.path)
            .await
            .map_err(|_| ContainerError::FileNotFound)
    }

    pub async fn read_manifest(&self) -> Result<ImageManifest, ContainerError> {
        let manfiest_bytes = {
            let rel_manfiest = PathBuf::from(MANIFEST_URI);
            let manfiest_uri = join_img_abs!(self.path, rel_manfiest);
            tokio::fs::read(manfiest_uri)
                .await
                .map_err(|_| ContainerError::FileNotFound)?
        };

        serde_json::from_slice(&manfiest_bytes).map_err(|_| ContainerError::FileNotFound)
    }

    pub(super) fn create_copy(&self) -> Result<ContainerImg, ContainerError> {
        let mut new_img = ContainerImg {
            path: self
                .original_path
                .clone()
                .ok_or(ContainerError::FileNotFound)?,
            original_path: None,
        };

        new_img.extract()?;

        Ok(new_img)
    }
}

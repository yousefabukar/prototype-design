use crate::error::ContainerError;
use crate::utils;
use flate2::read::GzDecoder;
use shared::image::ImageManifest;
use shared::join_img_abs;
use std::env;
use std::fs::File;
use std::path::PathBuf;
use tar::Archive;
use tokio::fs;
use uuid::Uuid;

const MANIFEST_URI: &str = "/root/manifest.json";

#[derive(Clone)]
pub struct ContainerImg {
    pub(super) path: PathBuf,
}

impl ContainerImg {
    pub fn new(path: PathBuf) -> Self {
        ContainerImg { path }
    }

    pub fn extract(&mut self) -> Result<(), ContainerError> {
        let target_dir = env::temp_dir().join(Uuid::new_v4().to_string());

        let archive_ptr = File::open(&self.path).map_err(|_| ContainerError::FileNotFound)?;
        let decoder = GzDecoder::new(archive_ptr);

        let mut archive = Archive::new(decoder);
        archive
            .unpack(&target_dir)
            .map_err(|_| ContainerError::ExtractionFailure)?;

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
        fs::remove_dir_all(self.path)
            .await
            .map_err(|_| ContainerError::FileNotFound)
    }

    pub async fn read_manifest(&self) -> Result<ImageManifest, ContainerError> {
        let manfiest_bytes = {
            let rel_manfiest = PathBuf::from(MANIFEST_URI);
            let manfiest_uri = join_img_abs!(self.path, rel_manfiest);
            fs::read(manfiest_uri)
                .await
                .map_err(|_| ContainerError::FileNotFound)?
        };

        serde_json::from_slice(&manfiest_bytes).map_err(|_| ContainerError::FileNotFound)
    }

    pub async fn create_copy(&self) -> Result<Self, ContainerError> {
        let target_dir = env::temp_dir().join(Uuid::new_v4().to_string());
        utils::copy_dir(&self.path, &target_dir)
            .await
            .map_err(|_| ContainerError::CopyFailure)?;

        Ok(ContainerImg { path: target_dir })
    }
}

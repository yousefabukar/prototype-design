use crate::error::ContainerError;
use flate2::read::GzDecoder;
use shared::image::ImageManifest;
use shared::join_img_abs;
use std::env;
use std::fs::{self, File};
use std::path::PathBuf;
use tar::Archive;
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

    pub fn verify(&mut self) -> Result<bool, ContainerError> {
        if !self.path.is_dir() {
            return Ok(false);
        }

        let manfiest_bytes = {
            let rel_manfiest = PathBuf::from(MANIFEST_URI);
            let manfiest_uri = join_img_abs!(self.path, rel_manfiest);
            fs::read(manfiest_uri).map_err(|_| ContainerError::FileNotFound)?
        };

        let Ok(manifest): Result<ImageManifest, _> = serde_json::from_slice(&manfiest_bytes) else {
            return Ok(false);
        };

        Ok(join_img_abs!(self.path, manifest.test_script).is_file()
            && !join_img_abs!(self.path, manifest.extraction_dir).exists()
            && !join_img_abs!(self.path, manifest.test_manifest).exists())
    }

    pub fn cleanup(self) -> Result<(), ContainerError> {
        fs::remove_dir_all(self.path).map_err(|_| ContainerError::FileNotFound)
    }
}

use crate::error::ContainerError;
use flate2::read::GzDecoder;
use std::env;
use std::fs::File;
use std::path::PathBuf;
use tar::Archive;
use uuid::Uuid;

pub struct ContainerImg {
    path: PathBuf,
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
            .unpack(env::temp_dir().join(&target_dir))
            .map_err(|_| ContainerError::ExtractionFailure)?;

        self.path = target_dir;
        Ok(())
    }
}

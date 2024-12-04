use crate::error::ContainerError;
use crate::image::ContainerImg;
use crate::service::ContainerManagerProxy;
use flate2::read::GzDecoder;
use shared::engine::ContainerHandle;
use shared::image::ImageOptions;
use std::env;
use std::fs::File;
use std::path::PathBuf;
use std::sync::OnceLock;
use tar::Archive;
use tokio::fs::{self};
use uuid::Uuid;
use zbus::Connection;

static DBUS_CONN: OnceLock<Connection> = OnceLock::new();

pub struct ContainerEngine {
    handle: ContainerHandle,
    img: ContainerImg,
    assignment_path: Option<PathBuf>,
}

impl ContainerEngine {
    pub async fn new(
        proxy: ContainerManagerProxy<'_>,
        opts: ImageOptions,
        img: ContainerImg,
    ) -> Result<Self, ContainerError> {
        let handle = proxy.new_container(opts, img.path.clone()).await?;

        Ok(ContainerEngine {
            handle,
            img,
            assignment_path: None,
        })
    }

    pub async fn set_submission(&mut self, path: PathBuf) -> Result<(), ContainerError> {
        let new_path = env::temp_dir().join(Uuid::new_v4().to_string());

        {
            let archive_ptr = File::open(path).map_err(|_| ContainerError::FileNotFound)?;
            let decoder = GzDecoder::new(archive_ptr);

            let mut archive = Archive::new(decoder);
            archive
                .unpack(&new_path)
                .map_err(|_| ContainerError::ExtractionFailure)?;
        }

        {
            let Some(old_path) = self.assignment_path.replace(new_path) else {
                return Ok(());
            };

            fs::remove_dir_all(old_path)
                .await
                .map_err(|_| ContainerError::FileNotFound)?;
        }

        Ok(())
    }
}

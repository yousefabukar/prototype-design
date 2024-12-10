use crate::error::ContainerError;
use crate::image::ContainerImg;
use crate::service::ContainerManagerProxy;
use flate2::read::GzDecoder;
use shared::image::ImageOptions;
use shared::join_img_abs;
use shared::{engine::ContainerHandle, image::TestOutput};
use std::fs::File;
use std::path::PathBuf;
use tar::Archive;

pub struct ContainerEngine<'a> {
    handle: ContainerHandle,
    img: ContainerImg,
    proxy: ContainerManagerProxy<'a>,
}

impl<'a> ContainerEngine<'a> {
    pub async fn new(
        proxy: ContainerManagerProxy<'a>,
        opts: ImageOptions,
        base_img: ContainerImg,
        submission_path: PathBuf,
    ) -> Result<Self, ContainerError> {
        let handle = proxy.new_container(opts, base_img.path.clone()).await?;

        let img = base_img.create_copy()?;

        let engine_ptr = ContainerEngine { handle, img, proxy };
        engine_ptr.extract_submission(submission_path).await?;

        Ok(engine_ptr)
    }

    async fn extract_submission(&self, path: PathBuf) -> Result<(), ContainerError> {
        let target_path = self.img.read_manifest().await?.extraction_dir;
        let target_path = join_img_abs!(self.img.path, target_path);

        {
            let archive_ptr = File::open(path).map_err(|_| ContainerError::FileNotFound)?;
            let decoder = GzDecoder::new(archive_ptr);

            let mut archive = Archive::new(decoder);
            archive
                .unpack(&target_path)
                .map_err(|_| ContainerError::ExtractionFailure)?;
        }

        Ok(())
    }

    pub async fn wait_for_output(&self) -> Result<String, ContainerError> {
        Ok(self.proxy.wait_for_completion(self.handle.clone()).await?)
    }

    pub async fn test_output(&self) -> Result<Vec<TestOutput>, ContainerError> {
        Ok(self.proxy.test_output(self.handle.clone()).await?)
    }

    pub async fn cleanup(self) -> Result<(), ContainerError> {
        self.img.cleanup().await?;
        Ok(())
    }
}

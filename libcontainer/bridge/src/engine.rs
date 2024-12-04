use crate::error::ContainerError;
use crate::image::ContainerImg;
use crate::service::ContainerManagerProxy;
use shared::engine::ContainerHandle;
use shared::image::ImageOptions;
use std::path::PathBuf;
use std::sync::OnceLock;
use zbus::Connection;

static DBUS_CONN: OnceLock<Connection> = OnceLock::new();

pub struct ContainerEngine {
    handle: ContainerHandle,
    img: ContainerImg,
}

impl ContainerEngine {
    pub async fn new(
        proxy: ContainerManagerProxy<'_>,
        opts: ImageOptions,
        img: ContainerImg,
    ) -> Result<Self, ContainerError> {
        let handle = proxy.new_container(opts, img.path.clone()).await?;
        Ok(ContainerEngine { handle, img })
    }
}

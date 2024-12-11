use shared::engine::ContainerHandle;
use shared::error::ServiceError;
use shared::image::{ImageOptions, TestOutput};
use std::path::PathBuf;
use zbus::proxy;

#[proxy(
    interface = "libcontainer.daemon",
    default_service = "libcontainer.daemon",
    default_path = "/libcontainer/daemon"
)]
pub trait ContainerManager {
    async fn new_container(
        &self,
        opts: ImageOptions,
        img_path: PathBuf,
    ) -> Result<ContainerHandle, ServiceError>;

    async fn wait_for_completion(&self, handle: ContainerHandle) -> Result<String, ServiceError>;
    async fn test_output(&self, handle: ContainerHandle) -> Result<Vec<TestOutput>, ServiceError>;
}

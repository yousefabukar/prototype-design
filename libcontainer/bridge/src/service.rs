use shared::engine::ContainerHandle;
use shared::error::ServiceError;
use zbus::{proxy, Connection};

#[proxy(
    interface = "libcontainer.daemon",
    default_service = "libcontainer.daemon",
    default_path = "/libcontainer/daemon"
)]
trait ContainerManager {
    pub async fn new_container(
        &self,
        opts: ImageOptions,
        img_path: PathBuf,
    ) -> Result<ContainerHandle, ServiceError>;

    pub async fn wait_for_completion(
        &self,
        handle: ContainerHandle,
    ) -> Result<String, ServiceError>;

    pub async fn test_output(
        &self,
        handle: ContainerHandle,
    ) -> Result<Vec<TestOutput>, ServiceError>;
}

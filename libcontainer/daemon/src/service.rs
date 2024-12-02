use crate::engine::ContainerEngine;
use crate::error::{EngineError, LockExt};
use shared::engine::ContainerHandle;
use shared::error::ServiceError;
use shared::image::{ImageOptions, TestOutput};
use std::collections::HashMap;
use std::path::PathBuf;
use std::str::FromStr;
use std::sync::OnceLock;
use tokio::sync::Mutex;
use uuid::Uuid;
use zbus::interface;

static CONTAINERS: OnceLock<Mutex<HashMap<Uuid, ContainerEngine>>> = OnceLock::new();

pub struct ContainerManager;

impl ContainerManager {
    pub fn init() -> Result<(), EngineError> {
        CONTAINERS
            .set(Mutex::new(HashMap::new()))
            .map_err(|_| EngineError::SyncError)
    }
}

#[interface(name = "libcontainer.daemon")]
impl ContainerManager {
    pub async fn new_container(
        &self,
        opts: ImageOptions,
        img_path: PathBuf,
    ) -> Result<ContainerHandle, ServiceError> {
        let container_id = Uuid::new_v4();

        let container = ContainerEngine::new(opts, img_path).await?;
        CONTAINERS.try_get().await?.insert(container_id, container);

        Ok(ContainerHandle(container_id.to_string()))
    }

    pub async fn wait_for_completion(
        &self,
        handle: ContainerHandle,
    ) -> Result<String, ServiceError> {
        let mut guard = CONTAINERS.try_get().await?;
        let container = guard
            .get_mut(&Uuid::from_str(&handle.0).map_err(|_| ServiceError::IdParse)?)
            .ok_or(ServiceError::InvalidId)?;

        Ok(container.wait_for_completion().await?)
    }

    pub async fn test_output(
        &self,
        handle: ContainerHandle,
    ) -> Result<Vec<TestOutput>, ServiceError> {
        let mut guard = CONTAINERS.try_get().await?;
        let container = guard
            .remove(&Uuid::from_str(&handle.0).map_err(|_| ServiceError::IdParse)?)
            .ok_or(ServiceError::InvalidId)?;

        Ok(container.test_output().await?)
    }
}

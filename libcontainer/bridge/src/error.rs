use shared::error::ServiceError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ContainerError {
    #[error("The libcontainer daemon process panicked: {0}")]
    EngineService(ServiceError),
}

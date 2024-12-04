use shared::error::ServiceError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ContainerError {
    #[error("The libcontainer daemon process panicked: {0}")]
    EngineService(ServiceError),
    #[error("Invalid file location specified - file not found")]
    FileNotFound,
    #[error("Failed to unpack archive")]
    ExtractionFailure,
}

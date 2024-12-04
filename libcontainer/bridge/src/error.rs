use shared::error::ServiceError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ContainerError {
    #[error("The libcontainer daemon process panicked: {0}")]
    EngineService(#[from] ServiceError),
    #[error("Invalid file location specified - file not found")]
    FileNotFound,
    #[error("Failed to unpack archive")]
    ExtractionFailure,
    #[error("Failed to connect to dbus service: {0}")]
    ConnErr(#[from] zbus::Error),
    #[error("Attempted to run tests on a submission which hasn't been imported.")]
    NoSubmission,
    #[error("Failed to run async task at runtime: {0}")]
    TokioTask(#[from] tokio::task::JoinError),
}

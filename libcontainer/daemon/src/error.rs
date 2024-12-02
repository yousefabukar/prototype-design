use shared::error::ServiceError;
use std::sync::{Mutex, MutexGuard, OnceLock};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum EngineError {
    #[error("Failed to convert path to string")]
    PathStr,
    #[error("Failed to spawn container runtime")]
    SpawnFailure,
    #[error("Failed to read file - image is likely invalid")]
    FileNotFound,
    #[error("Failed to parse manifest file")]
    Parse(#[from] serde_json::Error),
    #[error("Error in system call")]
    NixSys(#[from] nix::Error),
    #[error("An error occurred in the runtime process: {0}")]
    Runtime(&'static str),
    #[error("Failed to synchronise running containers")]
    SyncError,
}

pub trait LockExt<T> {
    fn try_get(&self) -> Result<MutexGuard<T>, EngineError>;
}

impl<T> LockExt<T> for OnceLock<Mutex<T>> {
    fn try_get(&self) -> Result<MutexGuard<T>, EngineError> {
        self.get()
            .ok_or(EngineError::SyncError)?
            .lock()
            .map_err(|_| EngineError::SyncError)
    }
}

impl From<EngineError> for ServiceError {
    fn from(value: EngineError) -> Self {
        ServiceError::Engine(value.to_string())
    }
}

use shared::error::ServiceError;
use std::sync::OnceLock;
use thiserror::Error;
use tokio::sync::{Mutex, MutexGuard};

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
    async fn try_get<'a>(&'a self) -> Result<MutexGuard<'a, T>, EngineError>
    where
        T: 'a;
}

impl<T> LockExt<T> for OnceLock<Mutex<T>> {
    async fn try_get<'a>(&'a self) -> Result<MutexGuard<'a, T>, EngineError>
    where
        T: 'a,
    {
        Ok(self.get().ok_or(EngineError::SyncError)?.lock().await)
    }
}

impl From<EngineError> for ServiceError {
    fn from(value: EngineError) -> Self {
        ServiceError::Engine(value.to_string())
    }
}

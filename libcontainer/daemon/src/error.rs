use thiserror::Error;

#[derive(Debug, Error)]
pub enum EngineError {
    #[error("Failed to convert path to string")]
    PathStr,
    #[error("Failed to spawn container runtime")]
    SpawnFailure(#[from] tokio::io::Error),
}

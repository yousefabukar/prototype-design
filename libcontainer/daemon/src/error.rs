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
}

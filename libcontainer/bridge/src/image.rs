use crate::error::ContainerError;
use std::path::PathBuf;

pub struct ContainerImg {
    path: PathBuf,
}

impl ContainerImg {
    pub fn new(path: PathBuf) -> Self {
        ContainerImg { path }
    }

    pub fn extract(&mut self) -> Result<(), ContainerError> {
        todo!()
    }
}

use serde::{Deserialize, Serialize};
use zbus::zvariant::Type;

#[derive(Serialize, Deserialize, Type)]
pub struct ContainerHandle(pub String);

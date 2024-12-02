use serde::Serialize;
use zbus::zvariant::Type;

#[derive(Serialize, Type)]
pub struct ContainerHandle(pub String);

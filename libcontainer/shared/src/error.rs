use zbus::DBusError;

#[derive(Debug, DBusError)]
#[zbus(prefix = "libcontainer.daemon")]
pub enum ServiceError {
    #[zbus(error)]
    Service(zbus::Error),
    Engine(String),
}

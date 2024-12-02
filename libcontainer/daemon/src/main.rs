#![warn(clippy::todo, clippy::dbg_macro, clippy::unwrap_used)]

mod engine;
mod error;
mod service;
mod sys;

use nix::unistd::{self, Uid};
use service::ContainerManager;
use std::future::pending;
use zbus::connection::Builder;

#[tokio::main]
async fn main() {
    if !Uid::current().is_root() {
        panic!(
            "The libcontainer daemon has not been run as root. \
            Please run the daemon with root permissions and then try again.
For more information, please see https://github.com/yousefabukar/prototype-design/tree/main\
    /libcontainer#structure-of-the-engine"
        )
    }

    let runtime = ContainerManager::new().expect("Failed to initialise the container runtime");

    unistd::seteuid(Uid::from_raw(1000)).expect("Failed to set local user permissions");

    async {
        let _conn = Builder::address("unix:path=/run/user/1000/bus")?
            .name("libcontainer.daemon")?
            .serve_at("/libcontainer/daemon", runtime)?
            .build()
            .await?;

        println!(
            "The libcontainer daemon dbus service is now running at\
            /libcontainer/daemon (libcontainer.daemon).
You may now use libcontainer bridge."
        );

        unistd::seteuid(Uid::from_raw(0)).expect("Failed to switch back to root permissions");

        pending::<()>().await;

        Ok::<(), zbus::Error>(())
    }
    .await
    .expect("Failed to initialise dbus service");
}

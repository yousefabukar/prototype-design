#![warn(clippy::todo, clippy::dbg_macro, clippy::unwrap_used)]

mod engine;
mod error;
mod service;
mod sys;

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

    async {
        let _conn = Builder::session()?
            .name("libcontainer.daemon")?
            .serve_at("/libcontainer/daemon", runtime)?
            .build()
            .await?;

        println!("The libcontainer daemon dbus service is now running at /libcontainer/daemon (libcontainer.daemon).
You may now use libcontainer bridge.");

        pending::<()>().await;

        Ok::<(), zbus::Error>(())
    }
    .await
    .expect("Failed to initialise dbus service");
}

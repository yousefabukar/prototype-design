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

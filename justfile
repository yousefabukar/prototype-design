# Check prerequisites for running FNCS (run this first) 
check-deps:
    node -v > /dev/null
    npm -v > /dev/null
    cargo --version > /dev/null
    systemd-nspawn --version > /dev/null

# Build libcontainer in debug mode (useful for testing)
build-rust-debug:
    mkdir libcontainer/build/artefact
    cd libcontainer && cargo build
    cp libcontainer/target/debug/daemon libcontainer/build/artefact/daemon
    cp libcontainer/target/debug/libbridge.so libcontainer/build/artefact/build.node

# Build libcontainer in release mode
build-rust-release:
    mkdir libcontainer/build/artefact
    cd libcontainer && cargo build --release
    cp libcontainer/target/release/daemon libcontainer/build/artefact/daemon
    cp libcontainer/target/release/libbridge.so libcontainer/build/artefact/build.node

# Run unit tests for libcontainer
test-rust:
    cd libcontainer && cargo test

# Install npm dependencies for app and sever
build-js:
    cd app && npm install
    cd server && npm install

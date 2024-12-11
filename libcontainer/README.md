# libcontainer

## What is this?
This is the custom container engine used by the automatic code testing system.

## Structure of the engine
The engine is split into two three components: `daemon`, `bridge` and `shared`.

`daemon` is a root daemon which handles the management of containers and running of tests. `daemon` must be run as root as it utilises `systemd-nspawn` internally, which must also be run as root. `daemon` will initialise and run the container and execute the tests, before returning any output.

`bridge` is the Node.js bridge which allows the server to communicate with `libcontainer`. Internally, `daemon` will start and listen on a `dbus` service, which `bridge` will connect to and communicate over. Javascript bindings to `bridge` are made available with [neon](https://neon-rs.dev/). `bridge` is also responsible for other utility functions, such as ensuring an image file is valid before passing it to `daemon`.

As the name may suggest, `shared` is merely for holding shared internal structures between `daemon` and `bridge`.


## Documentation
Documentation for `libcontainer` is held in the [GitHub Wiki](https://github.com/yousefabukar/prototype-design/wiki).

To view documentation for the Javascript bindings to `libcontainer`, see [this wiki page](https://github.com/yousefabukar/prototype-design/wiki/libcontainer:-Using-libcontainer-from-Node.js). To see how to create your own image for use with `libcontainer`, see [this wiki page](https://github.com/yousefabukar/prototype-design/wiki/libcontainer:-Creating-an-image).

## Building libcontainer

libcontainer uses the [`just`](https://just.systems/) command runner as the base of its build system. To build libcontainer, you will first need to [install `just`](https://github.com/casey/just?tab=readme-ov-file#installation).

From the **root** directory (the one above this one), you can run `just -l` to view available recipes:
```
Available recipes:
    build-js           # Install npm dependencies for app and sever
    build-rust-debug   # Build libcontainer in debug mode (useful for testing)
    build-rust-release # Build libcontainer in release mode
    check-deps         # Check prerequisites for running FNCS (run this first)
    test-rust          # Run unit tests for libcontainer
```

To build libcontainer, you will need a Rust toolchain installed. Moreover, libcontainer uses `systemd-nspawn` as its base, and you will thus need [systemd](https://en.wikipedia.org/wiki/Systemd) installed as your init system on your Linux machine. This should be the case for the **vast majority** of modern Linux installations. You will also need Node and npm for the web part of FNCS. You can check your prerequisites by running `just check-deps`.

Once everything has passed, you can simply run `just build-rust-release` to build libcontainer in the `release` profile. The `daemon` executable will then be in the `libcontainer/build/artefact` folder. You can then use libcontainer from Node by requiring the `libcontainer/build` directory (assuming you are in the root directory), like so:

```javascript
const { ContainerEngine, ContainerImage } = require('./libcontainer/build');
```

If you intend to develop on libcontainer itself, you can run `just build-rust-debug` to build libcontainer in the `debug` profile.
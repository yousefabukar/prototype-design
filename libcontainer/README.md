# libcontainer

## What is this?
This is the custom container engine used by the automatic code testing system.

## Structure of the engine
The engine is split into two main components: `daemon` and `bridge`.

`daemon` is a root daemon which handles the management of containers and running of tests. `daemon` must be run as root as it utilises `systemd-nspawn` internally, which must also be run as root. `daemon` will initialise and run the container and execute the tests, before returning any output.

`bridge` is the Node.js bridge which allows the server to communicate with `libcontainer`. Internally, `daemon` will listen a `dbus` service, which `bridge` will connect to and communicate over. Javascript bindings to `bridge` are made available with [neon](https://neon-rs.dev/).


## Documentation
Documentation for `libcontainer` is held in the [GitHub Wiki](https://github.com/yousefabukar/prototype-design/wiki).

To view documentation for the Javascript bindings to `libcontainer`, see [this wiki page](https://github.com/yousefabukar/prototype-design/wiki/libcontainer:-Using-libcontainer-from-Node.js). To see how to create your own image for use with `libcontainer`, see [this wiki page](https://github.com/yousefabukar/prototype-design/wiki/libcontainer:-Creating-an-image).
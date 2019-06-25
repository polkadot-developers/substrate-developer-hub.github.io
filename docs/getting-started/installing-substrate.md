---
title: "Installing Substrate"
---

Following ways to install Substrate assume you are running Mac OS, Arch, or a Debian-based OS like Ubuntu. For Windows users, you can try it [here](https://github.com/paritytech/substrate#612-windows).

## Fast Installation

If you plan to create your own blockchain, then run this simple one-liner:

```bash
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

This command will install the [substrate-up](https://github.com/paritytech/substrate-up) commands for creating your own nodes and modules.

This is the most common way to start your Substrate's journey.

## Full Installation

If you want to experience the latest Substrate's features and **have a good internet connection**, then run command:

```bash
curl https://getsubstrate.io -sSf | bash
```

This command will:
* Install latest [subkey](https://github.com/paritytech/substrate/tree/master/subkey) which generate or restore the keys used for Substrate chains.
* Install latest Substrate [node](https://github.com/paritytech/substrate/tree/master/node) for you to have a taste of all the available Substrate's features.
* Install the [substrate-up](https://github.com/paritytech/substrate-up) scripts for quickly creating your own nodes and modules.

It will take 20 ~ 40 minutes to finish, depends on your hardware and network connection. Once it is done, check that Substrate is properly installed by running `substrate --version`. You should see something like this:
```
$ substrate --version
substrate 2.0.0-6f0d28863-x86_64-macos
```

If you get that, then you're ready to proceed!

## Manual Build

If you want to hack on Substrate itself, or manually build the node, you can get the code with
```
git clone https://github.com/paritytech/substrate.git
```

Then you can build the node with
```
# Update your rust toolchain
./scripts/init.sh

# Build the wasm runtime
./scripts/build.sh

# Build the native node
cargo build
```

You can also build the `subkey` tool with
```
cargo build -p subkey
```
More information is available in the [project readme](https://github.com/paritytech/substrate/#substrate).

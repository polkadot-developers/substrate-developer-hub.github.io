---
title: "Installing Substrate"
---

Here are instructions to install Substrate for Mac OS, Arch, or a Debian-based OS like Ubuntu. For Windows users, you can try it [here](https://github.com/paritytech/substrate#612-windows).

## Fast Installation

If you want to start building on Substrate quickly, then run this simple one-liner:

```bash
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

This command will install all the dependencies required to build a Substrate node, such as: Rust, OpenSSL, CMake, LLVM, and other prerequisites. It will also install the [Substrate scripts](getting-started/using-the-substrate-scripts.md), simplifying the process for creating your own nodes and modules.

## Full Installation

In addition to all of the items installed via the fast installation, the full installation will also install two Substrate binaries to your computer:

* [subkey](https://github.com/paritytech/substrate/tree/master/subkey): a command line utility that generates or restores Substrate keys.
* [Substrate node](https://github.com/paritytech/substrate/tree/master/node): a copy of the main node included with Substrate, allowing you to easily connect to the Substrate test-net.

You can do the full installation by omitting the `--fast` flag:

```bash
curl https://getsubstrate.io -sSf | bash
```

Once it is done, check that the Substrate node is properly installed by checking its version:

```bash
$ substrate --version
substrate 2.0.0-6f0d28863-x86_64-macos
```

You can do the same with Subkey:

```bash
$ subkey --version
subkey 2.0.0
```

## Manual Build

If you want to hack on Substrate itself, or manually build the node, you can clone the Substrate repository with:

```bash
git clone https://github.com/paritytech/substrate.git
```

Then you can build the node with

```bash
# Update your rust toolchain
./scripts/init.sh

# Build the wasm runtime
./scripts/build.sh

# Build the native node
cargo build
```

You can also build the `subkey` tool with

```bash
cargo build -p subkey
```

More information is available in the [project readme](https://github.com/paritytech/substrate/#substrate).

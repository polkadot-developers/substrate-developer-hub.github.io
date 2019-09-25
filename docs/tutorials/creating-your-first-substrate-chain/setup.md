---
title: Setup Your Computer
---

Normally we would teach you more about the Substrate blockchain framework and the Proof of Existence blockchain you will be building. However, setting up your computer for Substrate development can take a while. 

To optimize your time, we will have you start the setup process, and while things are compiling, we will then tell you more about everything we are doing.

## Prerequisites

To develop on Substrate, your computer needs some prerequisites to establish a working development environment.

> **Note:** This is probably the hardest part of this tutorial, so don't let this discourage you.

### Substrate Development

If you are using a Unix based machine (Linux, MacOS), we have created a simple one-liner to get all of those prerequisites installed for you:

```bash
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

> If you want to see specifically what this script does just visit: https://getsubstrate.io

It will automatically install:

* [CMake](https://cmake.org/install/)
* [pkg-config](https://www.freedesktop.org/wiki/Software/pkg-config/)
* [OpenSSL](https://www.openssl.org/)
* [Git](https://git-scm.com/downloads)
* [Rust](https://www.rust-lang.org/tools/install)

If you are using Windows and do not have the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10), the process is a bit harder, but well documented [here](getting-started.md).

### Front-End Development

This tutorial also uses a custom ReactJS front-end which we will modify for interacting with our custom Substrate blockchain.

To use the front-end project, you need to install [Yarn](https://yarnpkg.com/lang/en/docs/install/), which may also require you separately install [`Node.js`](https://nodejs.org/en/download/).

## Compiling Substrate

We have created simple template projects to help you get started building on Substrate.

1. Clone the Substrate Node Template

    ```bash
    git clone https://github.com/substrate-developer-hub/substrate-node-template
    cd substrate-node-template/
    ```

2. Initialize your Wasm build environment

    ```bash
    # Update Rust
    rustup update nightly
    rustup update stable

    # Add Wasm target
    rustup target add wasm32-unknown-unknown --toolchain nightly

    # Install `wasm-gc` to slim Wasm binaries
    cargo +nightly install --git https://github.com/alexcrichton/wasm-gc --force
    ```

3. Compile your Substrate node

    ```bash
    cargo build --release
    ```

This final compilation can take up to 15 minutes depending on your computer hardware. In that time, read the next section to learn more about Substrate.

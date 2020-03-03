---
title: Set Up Your Computer
id: version-pre-v2.0-3e65111-setup
original_id: setup
---

Normally we would teach you more about the Substrate blockchain development framework, however, setting up your computer for Substrate development can take a while.

To optimize your time, we will have you start the setup process. In the next section, while things
are compiling, you will learn more about Substrate and what we are building.

## Prerequisites

To develop on Substrate, your computer needs some prerequisites to establish a working development
environment.

> **Note:** Setting up your computer is probably the hardest part of this tutorial, so don't let
> this discourage you.

### Substrate Development

If you are using a Unix-based machine (Linux, MacOS), we have created a simple one-liner to get all
of those prerequisites installed for you:

```bash
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

> **Note:** If you did not have Rust installed prior to running this script, make sure to add `cargo` to your `PATH` or restart your terminal before continuing (command given in last line of the script output).

<details>
<summary>Learn what this script does.</summary>

> **Note:** If you want to see specifically what this script does just visit:
> https://getsubstrate.io

It will automatically install:

* [CMake](https://cmake.org/install/)
* [pkg-config](https://www.freedesktop.org/wiki/Software/pkg-config/)
* [OpenSSL](https://www.openssl.org/)
* [Git](https://git-scm.com/downloads)
* [Rust](https://www.rust-lang.org/tools/install)

</details>

If you are using Windows and do not have the [Windows Subsystem for
Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10), the process is a bit harder, but
well documented [here](overview/getting-started.md).

## Compiling Substrate

Once the prerequisites are installed, you need to set up the skeleton for our project. The Substrate Node
Template serves as a good starting point for building on Substrate.

1. Clone the Substrate Node Template (version `pre-2.0-3e6511`) and create a branch for your work.

    ```bash
    git clone -b pre-v2.0-3e65111 --depth 1 https://github.com/substrate-developer-hub/substrate-node-template
    ```

2. Initialize your WebAssembly build environment

    ```bash
    # Update Rust
    rustup update nightly
    rustup update stable

    # Add Wasm target
    rustup target add wasm32-unknown-unknown --toolchain nightly
    ```

3. Compile your Substrate node

    ```bash
    cd substrate-node-template/
    git checkout -b my-first-substrate-chain
    cargo build --release
    ```

This final compilation can take up to 25 minutes depending on your hardware. In that time,
read the next section to learn more about Substrate.

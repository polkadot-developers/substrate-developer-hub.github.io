---
title: Set Up Your Computer
---

Normally we would teach you more about the Substrate blockchain development framework, however,
setting up your computer for Substrate development can take a while.

To optimize your time, we will have you start the setup process. In the next section, while things
are compiling, you will learn more about Substrate and what we are building.

## Prerequisites

To develop on Substrate, your computer needs some prerequisites to establish a working development
environment.

> Setting up your computer is probably the hardest part of this tutorial, so don't let this
> discourage you.

### Substrate Development

If you are using a Unix-based machine (Linux, MacOS), we have created a simple one-liner to get all
of those prerequisites installed for you:

```bash
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

> If you did not have Rust installed prior to running this script, make sure to add restart your
> terminal before continuing (command given in last line of the script output).

<details>
<summary>Learn what this script does.</summary>

> You can view the source code for this script by visiting
> [https://getsubstrate.io](https://getsubstrate.io) in your browser.

It will automatically install:

- [CMake](https://cmake.org/install/)
- [pkg-config](https://www.freedesktop.org/wiki/Software/pkg-config/)
- [OpenSSL](https://www.openssl.org/)
- [Git](https://git-scm.com/downloads)
- [Rust](https://www.rust-lang.org/tools/install)

</details>

If you are using Windows and do not have the
[Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10), the
process is a bit harder, but well documented [here](../../knowledgebase/getting-started/windows-users).

## Compiling Substrate

Once the prerequisites are installed, you need to set up the skeleton for our project. The Substrate
Node Template serves as a good starting point for building on Substrate.

1. Clone the Substrate Node Template (version `v2.0.0-rc4`).

   ```bash
   	git clone -b v2.0.0-rc4 --depth 1 https://github.com/substrate-developer-hub/substrate-node-template
   ```

2. Initialize your WebAssembly build environment

   ```bash
   # Load settings into the current shell script if you can't use rustup command
   # If you've run this before, you don't need to run it again. But doing so is harmless.
   source ~/.cargo/env

   # Update Rust
   rustup update nightly
   rustup update stable

   # Add Wasm target
   rustup target add wasm32-unknown-unknown --toolchain nightly
   ```

3. Create a branch for your work and Compile your Substrate node

   ```bash
   cd substrate-node-template/
   git checkout -b my-first-substrate-chain
   cargo build --release
   ```

This final compilation can take up to 25 minutes depending on your hardware. So don't wait before
moving on to the next steps.

## Front-End

In order to interact with your node, you will be running a local instance of
[the Substrate Developer Hub Front-End Template](https://github.com/substrate-developer-hub/substrate-front-end-template),
which requires you to have [Node.js](https://nodejs.org/) installed on your computer. You may want
to use the time that your node is compiling to ensure that your development environment is prepared
with these dependencies.

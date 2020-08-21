---
title: Set Up Your Computer
---

Normally, we would teach you more about the Substrate blockchain development framework, however,
setting up your computer for Substrate development can take a while.

To optimize your time, we will have you start the setup process. While things are compiling, you can
continue to the next section to learn more about Substrate and what we are building.

## Prerequisites

You will probably need to do some set-up to prepare your computer for Substrate development.

### Substrate Development

If you are using a Unix-based machine (Linux, MacOS), we have created a simple one-liner to help you
set up your computer:

```bash
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

> If you did not have Rust installed prior to running this script, make sure to restart your
> terminal before continuing.

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
process is a bit harder, but well documented
[here](../../knowledgebase/getting-started/windows-users).

## Compiling Substrate

Once the prerequisites are installed, you can use Git to clone the Substrate Developer Hub Node
Template, which serves as a good starting point for building on Substrate.

1. Clone the Node Template (version `v2.0.0-rc6`).

   ```bash
   	git clone -b v2.0.0-rc6 --depth 1 https://github.com/substrate-developer-hub/substrate-node-template
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

3. Compile the Node Template

   ```bash
   cd substrate-node-template/
   cargo build --release
   ```

The time required for the compilation step depends on the hardware you're using. Don't wait before
moving on.

## Install the Front-End Template

This tutorial uses a ReactJS front-end template to allow you to interact with the Substrate-based
blockchain node that you should have started compiling in the previous step. You can use this same
front-end template to create UIs for your own projects in the future.

To use the front-end template, you need [Yarn](https://yarnpkg.com), which itself requires
[Node.js](https://nodejs.org/). If you don't have these tools, you may install them from these
instructions:

- [Install Node.js](https://nodejs.org/en/download/)
- [Install Yarn](https://yarnpkg.com/lang/en/docs/install/)

Now you can proceed to set up the front-end template with these commands.

```bash
# Clone the code from github
git clone -b v2.0.0-rc5 --depth 1 https://github.com/substrate-developer-hub/substrate-front-end-template

# Install the dependencies
cd substrate-front-end-template
yarn install
```

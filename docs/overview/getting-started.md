---
id: getting-started
title: Getting Started
---

This page has everything you need to get started building with Substrate.

## Get Help

Substrate is a bleeding edge blockchain development framework, and as a result, you may encounter some breaking changes or issues along the way.

Know that we are very happy to help you get started building with Substrate, so if you encounter any issues, simply reach out to us by:

* [Opening an issue on GitHub](https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/issues/new)
* [Chatting with us on Riot](https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org)

## Prerequisites

To develop in the Substrate ecosystem, you must set up your developer environment. Depending on your operating system, these instructions may be different.

### Debian

Run:

```bash
sudo apt install -y cmake pkg-config libssl-dev git gcc build-essential clang libclang-dev
```

### macOS

Install the [Homebrew package manager](https://brew.sh/), then run:

```bash
brew install openssl cmake llvm
```

### Windows

Because Windows installation instructions vary widely from standard unix-like operating systems, we have separated the setup instructions to their own comprehensive section at the bottom of this page.

Go to: [Getting Started on Windows](#getting-started-on-windows)

## Rust Developer Environment

Substrate uses the Rust programming language. You should [install Rust](https://www.rust-lang.org/tools/install) using `rustup`:

```
curl https://sh.rustup.rs -sSf | sh
```

Then make sure that you are using the latest Rust stable by default:

```
rustup default stable
```

### Wasm Compilation

Substrate uses WebAssembly (Wasm), and you will need to configure your Rust compiler to use `nightly` to support this build target.

Run the following:

```bash
rustup install nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
# Install `wasm-gc`. It's useful for slimming down Wasm binaries.
cargo +nightly install --git https://github.com/alexcrichton/wasm-gc --force
```

### Rustup Update

Substrate always uses the latest version of Rust stable and nightly for compilation. To ensure your Rust compiler is always up to date, you should run:

```
rustup update
```

This may even solve compilation issues you face when working with Substrate.

## Front-End Developer Environment

Substrate uses Yarn for all of it's front-end development needs. Visit the [install instructions](https://yarnpkg.com/en/docs/install) for Yarn to set up your computer.

Make sure you have the latest stable version of Node.js (`>= 10.16.3`) and Yarn (`>= 1.19.0`).

## Get the Source

Depending on what you are looking to build, there are some different starting points for Substrate development.

> **Note:** You can add the `--help` flag to any command to see additional options.

### Substrate

The main Substrate project contains all core libraries which power Substrate-based chains, a pre-built node for running the Substrate testnet, and a key generation utility called Subkey.

This starting point makes sense if you plan to contribute to the Substrate project or if you want to run the Substrate testnet or Subkey.

Get the project at:

```
https://github.com/paritytech/substrate
```

Build the project with:

```bash
cargo build --release
```

Test the project with:

```
cargo test --all
```

Start the Substrate node with:

```bash
./target/release/substrate
```

#### Install the Substrate Node Locally

You can install the Substrate node binary locally for easy access to running a node.

In the Substrate project folder, run:

```
cargo install --force --path ./ substrate
```

You can then run this generated binary with:

```bash
substrate
```

#### Install Subkey Locally

You can install the Subkey binary locally for easy access to this utility.

In the Substrate project folder, run:

```bash
cargo install --force --path ./bin/utils/subkey subkey
```

You can then run this generated binary with:

```bash
subkey
```

### Substrate Node Template

We provide a minimal working Substrate node meant for the development of new Substrate blockchains.

Get the project at:

```
https://github.com/substrate-developer-hub/substrate-node-template
```

Build the project with:

```bash
cargo build --release
```

Purge any existing developer node state with:

```bash
# You will be prompted to type `y` to delete the database
./target/release/node-template purge-chain --dev
```

Start a developer node with:

```bash
./target/release/node-template --dev
```

### Substrate Front-End Template

We provide a minimal working Substrate front-end, built with ReactJS and the Polkadot-JS API. This project is meant for quick and easy development of custom user interfaces.

Get the project at:

```
https://github.com/substrate-developer-hub/substrate-front-end-template
```

Install the node dependencies with:

```bash
yarn install
```

Run the front end with:

```bash
yarn start
```

Connect to the front-end at [`localhost:8000`](http://localhost:8000).

> **Note:** You need to have a local Substrate node running to interact with this UI.

## Interact with Substrate

The fastest way to interact with any local or public Substrate network is to visit Polkadot-JS Apps:

[https://polkadot.js.org/apps/](https://polkadot.js.org/apps/)

You can find the docs for the Polkadot-JS ecosystem at:

[https://polkadot.js.org/](https://polkadot.js.org/)

## Getting Started On Windows

If you are trying to set up a Windows computer to build Substrate, do the following:

1. Download and install "Build Tools for Visual Studio:"

    * You can get it at this link: https://aka.ms/buildtools.
    * Run the installation file: `vs_buildtools.exe`.
    * Ensure the "Windows 10 SDK" component is included when installing the Visual C++ Build Tools.
    * Restart your computer.

2. Install Rust:

    * Detailed instructions are provided by the [Rust Book](https://doc.rust-lang.org/book/ch01-01-installation.html#installing-rustup-on-windows).
        * Download from: https://www.rust-lang.org/tools/install.
        * Run the installation file: `rustup-init.exe`.

            > Note that it should **not** prompt you to install `vs_buildtools` since you did it in step 1.

        * Choose "Default Installation."
        * To get started, you need Cargo's bin directory (`%USERPROFILE%\.cargo\bin`) in your PATH environment variable. Future applications will automatically have the correct environment, but you may need to restart your current shell.

3. Run these commands in Command Prompt (`CMD`) to set up your Wasm Build Environment:

    ```bash
    rustup update nightly
    rustup update stable
    rustup target add wasm32-unknown-unknown --toolchain nightly
    ```

4. Install `wasm-gc`, which is used to slim down Wasm files:

    ```bash
    cargo install --git https://github.com/alexcrichton/wasm-gc --force
    ```

5. Install LLVM: https://releases.llvm.org/download.html

6. Install OpenSSL with `vcpkg`:

    ```bash
    mkdir C:\Tools
    cd C:\Tools
    git clone https://github.com/Microsoft/vcpkg.git
    cd vcpkg
    .\bootstrap-vcpkg.bat
    .\vcpkg.exe install openssl:x64-windows-static
    ```

7. Add OpenSSL to your System Variables using PowerShell:

    ```powershell
    $env:OPENSSL_DIR = 'C:\Tools\vcpkg\installed\x64-windows-static'
    $env:OPENSSL_STATIC = 'Yes'
    [System.Environment]::SetEnvironmentVariable('OPENSSL_DIR', $env:OPENSSL_DIR, [System.EnvironmentVariableTarget]::User)
    [System.Environment]::SetEnvironmentVariable('OPENSSL_STATIC', $env:OPENSSL_STATIC, [System.EnvironmentVariableTarget]::User)
    ```

8. Finally, install `cmake`: https://cmake.org/download/

You can now jump back to [Get the Source](#get-the-source) to learn how to download and compile Substrate!

## Next Steps

TODO

---
title: Installation
---

This page will guide you through the steps needed to prepare a computer for Substrate development.
Since Substrate is built with [the Rust programming language](https://www.rust-lang.org/), the first
thing you will need to do is prepare the computer for Rust development - these steps will vary based
on the computer's operating system. Once Rust is configured, you will use its toolchains to interact
with Rust projects; the commands for Rust's toolchains will be the same for all supported,
Unix-based operating systems.

## Unix-Based Operating Systems

Substrate development is easiest on Unix-based operating systems like macOS or Linux. The examples
in the Substrate [Tutorials](../../../../tutorials) and [Recipes](https://substrate.dev/recipes/)
use Unix-style terminals to demonstrate how to interact with Substrate from the command line.

### macOS

Open the Terminal application and execute the following commands:

```bash
# Install Homebrew if necessary https://brew.sh/
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

# Make sure Homebrew is up-to-date, install openssl and cmake
brew update
brew install openssl cmake
```

### Ubuntu/Debian

Use a terminal shell to execute the following commands:

```bash
sudo apt update
# May prompt for location information
sudo apt install -y cmake pkg-config libssl-dev git build-essential clang libclang-dev curl libudev-dev
```

### Arch Linux

Run these commands from a terminal:

```bash
pacman -Syu --needed --noconfirm cmake gcc openssl-1.0 pkgconf git clang
export OPENSSL_LIB_DIR="/usr/lib/openssl-1.0"
export OPENSSL_INCLUDE_DIR="/usr/include/openssl-1.0"
```

## Windows

Please refer to the separate [guide for Windows users](windows-users.md).

## Rust Developer Environment

This guide uses [`rustup`](https://rustup.rs/) to help manage the Rust toolchain. First install and
configure `rustup`:

```bash
# Install
curl https://sh.rustup.rs -sSf | sh
# Configure
source ~/.cargo/env
```

Configure the Rust toolchain to default to the latest stable version:

```bash
rustup default stable
```

### WebAssembly Compilation

Substrate uses [WebAssembly](https://webassembly.org/) (Wasm) to produce portable blockchain
runtimes. You will need to configure your Rust compiler to use
[`nightly` builds](https://doc.rust-lang.org/book/appendix-07-nightly-rust.html) to allow you to
compile Substrate runtime code to the Wasm target.

#### Rust Nightly Toolchain

Developers building with Substrate should use a specific Rust nightly version that is known to be
compatible with the version of Substrate they are using; this version will vary from project to
project and different projects may use different mechanisms to communicate this version to
developers. For instance, the Polkadot client specifies this information in its
[release notes](https://github.com/paritytech/polkadot/releases). The Substrate Node Template uses
an
[init script](https://github.com/substrate-developer-hub/substrate-node-template/blob/master/scripts/init.sh)
and
[Makefile](https://github.com/substrate-developer-hub/substrate-node-template/blob/master/Makefile)
to specify the Rust nightly version and encapsulate the following steps. Use Rustup to install the
correct nightly:

```bash
rustup install nightly-<yyyy-MM-dd>
```

#### Wasm Toolchain

Now, configure the nightly version to work with the Wasm compilation target:

```bash
rustup target add wasm32-unknown-unknown --toolchain nightly-<yyyy-MM-dd>
```

#### Specifying Nightly Version

Use the `WASM_BUILD_TOOLCHAIN` environment variable to specify the Rust nightly version a Substrate
project should use for Wasm compilation:

```bash
WASM_BUILD_TOOLCHAIN=nightly-<yyyy-MM-dd> cargo build --release
```

Note that this only builds _the runtime_ with the specified nightly. The rest of project will be
compiled with the default toolchain, i.e. the latest installed stable toolchain.

#### Latest Nightly for Substrate `master`

Developers that are building Substrate _itself_ should always use the latest bug-free versions of
Rust stable and nightly. This is because the Substrate codebase follows the tip of Rust nightly,
which means that changes in Substrate often depend on upstream changes in the Rust nightly compiler.
To ensure your Rust compiler is always up to date, you should run:

```bash
rustup update
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

**It may be necessary to occasionally rerun `rustup update`** if a change in the upstream Substrate
codebase depends on a new feature of the Rust compiler.

#### Downgrading Rust Nightly

If your computer is configured to use the latest Rust nightly and you would like to downgrade to a
specific nightly version, follow these steps:

```sh
rustup uninstall nightly
rustup install nightly-<yyyy-MM-dd>
rustup target add wasm32-unknown-unknown --toolchain nightly-<yyyy-MM-dd>
```

## Test Your Set-Up

The best way to ensure that you have successfully prepared a computer for Substrate development is
to follow the steps in our first tutorial,
[Create Your First Substrate Chain](../../tutorials/create-your-first-substrate-chain/).

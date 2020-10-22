---
title: Installation
---

This page will guide you through the steps needed to prepare a computer for Substrate development.
Since Substrate is built with [the Rust programming language](https://www.rust-lang.org/), the first
thing you will need to do is prepare the computer for Rust development - these steps will vary based
on the computer's operating system. Then, you can use the helpful utilities from the Rust toolchain
to configure the Rust development environment - these steps will be the same for all the
(Unix-based) operating systems discussed on this page.

## Operating System-Dependent Set-Up

Follow the steps for your computer's operating system before installing and configuring the Rust
toolchain.

### Unix-Based Operating Systems

Substrate development is easiest on Unix-based operating systems, like macOS or Linux. The examples
in the Substrate [Tutorials](../../../../tutorials) and [Recipes](https://substrate.dev/recipes/)
use Unix-style terminals to demonstrate how to interact with Substrate from the command line.

#### macOS

Open the Terminal application and execute the following commands:

```bash
# Install Homebrew if necessary https://brew.sh/
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

# Make sure Homebrew is up-to-date and install some dependencies
brew update
brew install openssl cmake
```

#### Ubuntu/Debian

Use your favorite terminal shell to execute the following commands:

```bash
sudo apt update
# May prompt for location information
sudo apt install -y cmake pkg-config libssl-dev git build-essential clang libclang-dev curl
```

#### Arch Linux

Run these commands from a terminal:

```bash
pacman -Syu --needed --noconfirm cmake gcc openssl-1.0 pkgconf git clang
export OPENSSL_LIB_DIR="/usr/lib/openssl-1.0"
export OPENSSL_INCLUDE_DIR="/usr/include/openssl-1.0"
```

### Windows

Please refer to the separate [guide for Windows users](windows-users.md).

## Rust Developer Environment

This guide uses [`rustup`](https://rustup.rs/) to help manage the Rust toolchain; first, install and
configure `rustup`:

```bash
# Install
curl https://sh.rustup.rs -sSf | sh
# Add the rust compiler and other tools to your PATH.
# Make sure to add this to your shell startup script, too.
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
compile Rust code to the Wasm target.

#### Rust Nightly Toolchain

Developers that are building _with_ Substrate (as opposed to the developers building Substrate
_itself_) should use a specific Rust nightly version that is known to be compatible with the version
of Substrate they are using. Use Rustup to install the correct nightly:

```bash
rustup install nightly-<yyyy-MM-dd>
```

#### Wasm Toolchain

Now, configure the nightly version to work with the Wasm compilation target:

```bash
rustup target add wasm32-unknown-unknown --toolchain nightly-<yyyy-MM-dd>
```

#### Specifying Nightly Version

If you are working with a Substrate-based project that does not include a toolchain file, you can
use the Rust build and package manager, [Cargo](https://doc.rust-lang.org/cargo/), to specify a
nightly version:

```bash
cargo +nightly-<yyyy-MM-dd> ...
```

#### Latest Nightly

Developers that are building Substrate _itself_ should always uses the latest version of Rust stable
and nightly for compilation. To ensure your Rust compiler is always up to date, you should run:

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

```bash
rustup uninstall nightly
rustup install nightly-<yyyy-MM-dd>
rustup target add wasm32-unknown-unknown --toolchain nightly-<yyyy-MM-dd>
```

## Test Your Set-Up

The best way to ensure that you have successfully prepared a computer for Substrate development is
to follow the steps in our first tutorial,
[Create Your First Substrate Chain](../../tutorials/create-your-first-substrate-chain/).

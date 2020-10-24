---
title: Installation
---

This page will guide you through the steps needed to prepare a computer for Substrate development.
As Substrate is built with [the Rust programming language](https://www.rust-lang.org/), the first
thing you will need to do is prepare the development enviroment, these steps will vary based
on the computer's operating system. You can utilize helpful utilities from the Rust toolchain
to configure the Rust development environment. 

### Unix-Based Operating Systems

Substrate development is optimized for Unix-based operating systems like macOS or Linux. The examples
in the Substrate [Tutorials](../../../../tutorials) and [Recipes](https://substrate.dev/recipes/)
use the terminal to demonstrate how to interact with Substrate from the command line.

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

This guide uses [`rustup`](https://rustup.rs/) to help manage the Rust toolchain. First install and
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
[`nightly` builds](https://doc.rust-lang.org/book/appendix-07-nightly-rust.html) to allow
compiled substrate compatible runtimes to Wasm.

#### Rust Nightly Toolchain

Because the nightly toolchain is a moving target and receives daily changes the chance
that some of them break the substrate build from time to time is non-negligible.

Therefore it is advised to use a fixed nightly version rather than the latest one to
build the runtime. You can install a specific version using this command:

```bash
rustup install nightly-<yyyy-MM-dd>
```

---
**NOTE**
Due to a regression in the rust compiler, using the newest rust nightly for compiling
the runtime will result in compilation errors. Therefore, it is advised to use the
following version until this issue is resolved:

```bash
rustup install nightly-2020-10-06
```

---

#### Wasm Toolchain

Now, configure the choosen nightly version to work with the Wasm compilation target:

```bash
rustup target add wasm32-unknown-unknown --toolchain nightly-<yyyy-MM-dd>
```

#### Specifying Nightly Version

When a Substrate based project builds its included runtime it picks the latest
installed nightly version by default. If the nightly version is incompatible
you can override that decision by setting the `WASM_BUILD_TOOLCHAIN` environment variable
when building the project by using the following command:

```bash
WASM_BUILD_TOOLCHAIN=nightly-<yyyy-MM-dd> cargo build
```

Note that this builds only the runtime with the specified toolchain. The rest of project will
be compiled with your default toolchain, which is usually the latest installed stable toolchain.

#### Latest Nightly

If you want to build the runtime with the latest nightly compiler which should **generally** be
possible you can install the unspecific `nightly` toolchain:

```bash
rustup install nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

This toolchain is not tied to a specific version and will be updated just as the
`stable` toolchain:

```bash
rustup update
```

## Tips

**It may be necessary to occasionally rerun `rustup update`** if a change in the upstream Substrate
codebase depends on the most recent version of the Rust compiler.

## Test Your Set-Up

The best way to ensure that you have successfully prepared a computer for Substrate development is
to follow the steps in our first tutorial,
[Create Your First Substrate Chain](../../tutorials/create-your-first-substrate-chain/).

## Build with Nix shell

Nix is a package manager for many different types of projects, including those based on Rust. Using Nix makes developers confident that the compilation output of their substrate-based projects is reliable and reproducible. Find more benefits on the [Nix website] (https://nixos.org/).

### Steps to use Nix shell

#### Install Nix

Run the following command on a Unix based operating system:
```shell
sh <(curl -L https://nixos.org/nix/install) --daemon
```

#### Verify that Nix was properly installed

```shell
nix-env --version
```

You should see an output like: `nix-env (Nix) 2.3.7`.

#### How to use

If you are using `substrate` or `substrate-node-template`, the `shell.nix` file should already be in the project's root directory.

```shell
cd substrate-node-template # or substrate

nix-shell # start the nix shell environment by using dependencies in file `shell.nix`, it may take some time if this's your first time.
```

#### Run cargo commands in the nix shell


```shell
cargo build --release # build the project

./target/release/node-template # run the compiled binary
```

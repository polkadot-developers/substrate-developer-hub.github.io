---
title: Installation
---

## Fast Installation

Install all the required dependencies with a single command. (Be patient, this can take up to 30
minutes)

```bash
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

## Manual Installation

### Debian

Run:

```bash
sudo apt install -y cmake pkg-config libssl-dev git gcc build-essential clang libclang-dev
```

### MacOS

Install the [Homebrew package manager](https://brew.sh/), then run:

```bash
brew install openssl cmake llvm
```

## Rust Developer Environment

Substrate uses the Rust programming language. You should
[install Rust](https://www.rust-lang.org/tools/install) using `rustup`:

```
curl https://sh.rustup.rs -sSf | sh
```

Then make sure that you are using the latest Rust stable by default:

```
rustup default stable
```

### Wasm Compilation

Substrate uses WebAssembly (Wasm), and you will need to configure your Rust compiler to use
`nightly` to support this build target.

Run the following:

```bash
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

### Rustup Update

Substrate always uses the latest version of Rust stable and nightly for compilation. To ensure your
Rust compiler is always up to date, you should run:

```
rustup update
```

This may even solve compilation issues you face when working with Substrate.

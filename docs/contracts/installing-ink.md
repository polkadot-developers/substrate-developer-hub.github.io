---
title: "Installing ink!"
---

On this page, we will show you how to set up your computer to build ink! Wasm smart contracts.

## Rust

ink! is based on the Rust programming language, and thus you will need to also set up your computer for Rust development. If you have followed the [instructions to install Substrate](getting-started/installing-substrate.md), then you should be good to go.

## Wasm Utilities

Smart contracts in Substrate are compiled to WebAssembly (Wasm). To manipulate these files for use on Substrate, you will need to install some Wasm utilities:

* [Wabt](https://github.com/WebAssembly/wabt)
* [Parity wasm-utils](https://github.com/paritytech/wasm-utils)

Depending on your operating system, the installation instruction may be different:

**Linux**:

```
apt install wabt
cargo install pwasm-utils-cli --bin wasm-prune
```

**Mac OS**:

```bash
brew install wabt
cargo install pwasm-utils-cli --bin wasm-prune
```

We will be using `wasm2wat` (wabt), `wat2wasm` (wabt), and `wasm-prune` (wasm-utils) later in the guide.

## ink! CLI

The final tool we will be installing is the ink! command line utility which will make setting up Substrate smart contract projects easier.

You can install the utility using Cargo with:

```bash
cargo install --force --git https://github.com/paritytech/ink cargo-contract
```

You can then use `cargo contract --help` to start exploring the commands made available to you.  
> **Note**: The ink! CLI is under heavy development and many of its commands are not implemented, yet!

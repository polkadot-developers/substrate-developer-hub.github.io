---
title: "Cargo Contract: The ink! CLI"
---

To help simplify the process of creating ink! projects, we provide `cargo contract`: an ink! CLI.

> Note: The ink! CLI is under heavy development and **most** of its commands are not implemented, yet!

## Installation

You can install this `cargo contract` utility using Cargo:

```bash
cargo install --force --git https://github.com/paritytech/ink cargo-contract
```

You can then use `cargo contract --help` to start exploring the commands made available to you.

## Creating an ink! Project

We are going to use the ink! CLI to generate the files we need for a Substrate smart contract project.

Make sure you are in your working directory, and then run:

```bash
cargo contract new <name>
```

This command will create a new project folder with the specified name which will contain [the following files](https://github.com/paritytech/ink/tree/master/cli/template):

```
flipper
|
+-- .cargo
|   |
|   +-- config      <-- Compiler Configuration (Safe Math Flag)
|
+-- src
|   |
|   +-- lib.rs      <-- Contract Source Code
|
+-- build.sh        <-- Wasm Build Script
|
+-- rust-toolchain  <-- Rust Version Used
|
+-- Cargo.toml
|
+-- .gitignore
```

### Rust Toolchain

In order to reduce the negative effects of breaking changes in Rust, your generated ink! project will be tied to a specific nightly version of the compiler using the [`rust-toolchain`](https://github.com/paritytech/ink/blob/master/cli/template/rust-toolchain) file. This means that you also need to make sure that you have the `wasm32-unknown-unknown` installed for this specific compiler version, or else you will get an error like:

```bash
error[E0463]: can't find crate for `core`
  |
  = note: the `wasm32-unknown-unknown` target may not be installed
```

To resolve this error, you should check the rust version being used in the `rust-toolchain` file, and run the following:

```bash
rustup install <version>
rustup target add wasm32-unknown-unknown --toolchain <version>
```

### Cargo Config

Your generated ink! project will contain a [`/.cargo/config`](https://github.com/paritytech/ink/blob/master/cli/template/.cargo/config) file which is used to set `rustflags` for the project.

One important setting to call out is `overflow-checks=on` which tells the rust compiler to panic in the case of unintended overflows. This means that contract math is inherently "safe" from all overflow and underflow behaviors without the need for supplemental libraries.

### The Flipper Contract Template

The ink CLI automatically generates the [source code for the "Flipper" contract](https://github.com/paritytech/ink/blob/master/cli/template/src/lib.rs) as a template for you to hack on.

The Flipper contract is nothing more than a `bool` which gets flipped from true to false through the `flip()` function. If you want to understand how this contract was built from scratch, take a look at [Creating Your First Contract](tutorials/creating-your-first-contract.md).

### Wasm Build Script

The ink! CLI also generates a build script called [`build.sh`](https://github.com/paritytech/ink/blob/master/cli/template/build.sh). This file is used to help you compile your contract source code to Wasm. It depends on the various Wasm utilities you installed to set up the ink! environment.

You simply run:

```bash
./build.sh
```

If all went well, you should see a `target` folder being created with 4 relevant files corresponding to the steps in the script:

```
target
├── flipper.wasm
├── flipper.wat
├── flipper-fixed.wat
└── flipper-pruned.wasm
```

The final, optimized `flipper-pruned.wasm` file is what we will actually deploy to our Substrate chain.
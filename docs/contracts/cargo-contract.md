---
title: "Cargo Contract: The ink! CLI"
---

To help simplify the process of creating ink! projects, we provide `cargo contract`: an ink! CLI.

> Note: The ink! CLI is under heavy development and most of its commands are not implemented, yet!

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
cargo contract new flipper
```

This command will create a new project folder named `flipper` which will contain the following files:

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
+-- rust-toolchain
|
+-- Cargo.toml
|
+-- .gitignore
```

## The Flipper Contract Template

The ink CLI automatically generates the source code for the "Flipper" contract, which is about the simplest "smart" contract you can build. You can take a sneak peak as to what will come by looking at the source code here:

[Flipper Example Source Code](https://github.com/paritytech/ink/blob/master/examples/lang/flipper/src/lib.rs)

The Flipper contract is nothing more than a `bool` which gets flipped from true to false through the `flip()` function. We won't go so deep into the details of this source code because we will be walking you through the steps to build a more advanced contract!

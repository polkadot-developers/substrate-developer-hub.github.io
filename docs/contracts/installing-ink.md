## Prerequisites

To follow this guide, you will need to set up some stuff on your computer.

### Substrate
To get started, you need to make sure your computer is set up to build and run Substrate.

If you are using OSX or most popular Linux distros, you can do that with a simple one-liner:

```bash
curl https://getsubstrate.io -sSf | bash
```

In addition to installing prerequisite libraries, this command will also install the `substrate` command to your path so that you can start a substrate node easily.

If you are using another operating system, like Windows, follow the installation instructions on the [Substrate readme](https://github.com/paritytech/substrate#61-hacking-on-substrate).

### Wasm Utilities

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

### ink! CLI

The final tool we will be installing is the ink! command line utility which will make setting up Substrate smart contract projects easier.

You can install the utility using Cargo with:

```bash
cargo install --force --git https://github.com/paritytech/ink cargo-contract
```

You can then use `cargo contract --help` to start exploring the commands made available to you.  
> **Note**: The ink! CLI is under heavy development and many of its commands are not implemented, yet!

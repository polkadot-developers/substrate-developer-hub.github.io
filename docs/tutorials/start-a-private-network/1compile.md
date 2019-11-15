---
title: Compiling the Tools
---

Substrate does not (yet) offer binary installation packages, so it must be compiled from source, which can be a time-consuming process. Commits go into the [Substrate repository](https://github.com/paritytech/substrate) regularly and it is wise that everyone participating in this network have the same version of substrate to guarantee success. In this tutorial, we'll be using commit `7d7e74fb` because it is the same commit that [Substrate Package](https://github.com/substrate-developer-hub/substrate-package/) uses in version 1.5.0.

```bash
# Install rust prerequisites
curl https://getsubstrate.io -sSf | bash -s -- --fast

# Download the Substrate code
git clone https://github.com/paritytech/substrate
cd substrate

# Switch to the proper commit
git checkout 7d7e74fb
```

The repository includes a utility called `subkey` which we'll optionally use to generate and inspect keypairs. Let's compile it first. The `--force` option means that we'll install this version by overriding the previously installed version.
```bash
# Compile subkey
cargo install --force --path subkey subkey
```

Now let's compile the actual blockchain node that we'll be running. Because Substrate is a framework, most real-world blockchains that use it will write custom runtime code. There are [other tutorials](/tutorials/) that cover that process in detail. Luckily the Substrate repository itself already comes with two ready-to-run node environments. The first lives in the `node` directory and includes many features to be a practical blockchain. In fact it looks quite similar to [Polkadot](https://polkadot.network) which is also built on Substrate. The second is a more minimal runtime that lives in the `node-template` directory. We'll be using the node template in this tutorial because of its simplicity and because it is the usual starting point when writing your own custom runtime.

```bash
# Switch to node-template directory
cd node-template

# Ensure your Rust toolchain is up to date
./scripts/init.sh

# Compile the node-template
cargo build --release
```

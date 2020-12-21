---
title: Creating The Nicks Pallet
---

Before we write the storage migration we will create the basis for the migration by running an
adjusted version of the node template that includes an adjusted version of the Nicks pallet.
The only difference in the pallet compared to vanilla Substrate is that we change the storage name
to `MyNicks`.

## Getting the Modified Node Template

+ check out the node template at "insert migration tutorial branch here"
+ compile with
```bash
WASM_BUILD_TOOLCHAIN=nightly-2020-10-05 cargo build --release
```
+ purge for good measure
```bash
./target/release/node-template purge-chain
```
+ run with
```bash
# Run a node in development mode
./target/release/node-template --dev
```
to get the state set up (note that we do note want a temporary node with `--tmp` because we want state to migrate)

## Creating the Storage Entries to Migrate


In your web browser, navigate to
[https://polkadot.js.org/apps/#/settings?rpc=ws://127.0.0.1:9944](https://polkadot.js.org/apps/#/settings?rpc=ws://127.0.0.1:9944).

> Some browsers, notably Firefox, will not connect to a local node from a https website. An easy
> work around is to try another browser, like Chromium. Alternatively
> [host this interface locally](https://github.com/polkadot-js/apps#development).


+ Go to Dev > Extrinsic
+ select nicks > setname and set the following names
  + Alice -> "alice nick"
  + Bob -> "bob nick"
  + Alice Stash -> "stash"

---
title: F.A.Q.
---

This page will answer a number of common questions you may have when starting to build smart
contracts with Substrate.

## ink! F.A.Q.

### What is the difference between memory and storage?

In ink! we refer `memory` to being the computer memory that is commonly known to programmers while
with `storage` we refer to the contract instance's memory. The `storage` is backed up by the runtime
in a database. Accesses to it are considered to be slow.

### How do I run tests?

When building a smart contract with ink, you can define a set of tests.

For example, in the minimal
[flipper contract](https://github.com/paritytech/ink/blob/master/examples/flipper/lib.rs),
you can find a small test at the bottom of the contract.

To run this test, type the following command:

```bash
cargo +nightly test
```

## Contracts Pallet

### How do I add the Contracts pallet to my custom chain?

You can follow
[our guide here](../../tutorials/add-contracts-pallet) for instructions to add the Contracts pallet
and other FRAME pallets to your blockchain runtime.

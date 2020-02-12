---
title: ink! FAQ
id: version-pre-v2.0-3e65111-faq
original_id: faq
---

This page will answer a number of common questions you may have when starting to build smart contracts for Substrate.

## ink! FAQ

### How do I use `env` in non-message functions?

Currently, ink! hides some special details about calling messages that allows users to easily work with the environment like `env.caller()`. However, this support only works for message functions; those which are `pub(external)`.

To use the `env` module in `non-message` functions, the user has to add an additional argument to their function declaration.

* For `&self` methods, you must include `env: &ink_model::EnvHandler`.
* For `&mut self` methods, you must include `env: &mut ink_model::EnvHandler`.

Additionally, you need to pass this `env` variable from your message function to your non-message function. Look at [examples/lang/events](https://github.com/paritytech/ink/blob/master/examples/lang/events/src/lib.rs) to see how this is done.

### What is the difference between memory and storage?

In ink! we refer `memory` to being the computer memory that is commonly known to programmers while with `storage` we refer to the contract instance's memory. The `storage` is backed up by the runtime in a data base. Accesses to it are considered to be slow.

#### Example

While a `storage::Vec<T>` stores every of its elements in a different cell in the contract storage, a `storage::Value<memory::Vec<T>>` would store all elements (and a length info) in a single cell. Smart contract writers can use this to optimize for certain use cases. Using a `storage::Value<memory::Vec<T>>` could probably be more efficient for a small amount of elements in the `memory::Vec<T>`. We advise to use the more general `storage::Vec` for storing information on the contract instance.

### What is the test environment?

ink provides a test environment ([test_env](https://github.com/paritytech/ink/blob/master/core/src/env/test_env.rs)) which is used to emulate contract execution off-chain. This can be enabled by the crate feature `test-env` and is mainly useful for running tests off-chain.

See [running off-chain tests](#running-off-chain-tests) for more information.

### How do I run off-chain tests?

When building a smart contract with ink, you can define a set of tests that can be run using the off-chain test environment.

For example, in the minimal [flipper contract](https://github.com/paritytech/ink/blob/master/examples/lang/flipper/src/lib.rs), you can find a small off-chain test at the bottom of the contract.

To run this test, type the following command:

```bash
cargo test
```

## Contracts Module

### How do I add the Contracts module to my custom chain?

You can follow [our guide here](tutorials/adding-a-module-to-your-runtime.md) for instructions to add the Contracts module and other SRML modules to your blockchain runtime.

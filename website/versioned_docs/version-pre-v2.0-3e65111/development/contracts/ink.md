---
title: ink! Development
id: version-pre-v2.0-3e65111-ink
original_id: ink
---

ink! is a [Rust](https://www.rust-lang.org/)-based embedded domain specific language
([eDSL](https://wiki.haskell.org/Embedded_domain_specific_language)) for writing
[WebAssembly](https://webassembly.org/) smart contracts specifically for the [SRML Contracts
module](conceptual/runtime/contracts/contracts_module.md).

ink! is still under development, so the documentation for using it is sparse. However, on this page
you will find the best resources to get you started building ink! contracts right away.

## Tutorials

The ink! project maintains an up-to-date tutorial teaching all the basics of developing on ink!.

**This is the best way to get start learning the language today.**

<a class="btn btn-secondary primary-color text-white"
href="https://substrate.dev/substrate-contracts-workshop/">Start the ink! tutorial!</a>

You will learn how to:

* Set up your computer to build and deploy ink! smart contracts.
* Learn the basics of ink! by creating an incrementer contract.
* Learn more advance tricks by developing an ERC20 contract.

## Example Contracts

ink! provides a [set of example smart
contracts](https://github.com/paritytech/ink/tree/master/examples/lang2) that can help you
understand how it is similar and different to other smart contract languages.

This includes:

* [A Flipper Contract](https://github.com/paritytech/ink/tree/master/examples/lang2/flipper/)
* [An Incrementer
  Contract](https://github.com/paritytech/ink/tree/master/examples/lang2/incrementer/)
* [An ERC20 Contract](https://github.com/paritytech/ink/tree/master/examples/lang2/erc20/)
* [A Delegator Contract](https://github.com/paritytech/ink/tree/master/examples/lang2/delegator/)

## FAQ

Here are some answers to frequently asked questions developers have while building on ink!.

### What is the difference between memory and storage?

In ink!, `memory` refers to computer memory, while `storage` refers to the on-chain storage used by
a contract instance. `memory` is temporary and only lasts until the contract execution is done,
while `storage` is persistent and lasts over many contract executions. The contract `storage` is
built on top of the runtime storage, and access is considered to be slow.

#### Example

While a `storage::Vec<T>` stores all of its elements in different cells in the contract storage, a
`storage::Value<memory::Vec<T>>` would store all elements (and a length info) in a single cell.
Smart contract developers can use this to optimize for certain use cases. For example, using a
`storage::Value<memory::Vec<T>>` would probably be more efficient for storing a small amount of
elements in the `memory::Vec<T>`. In general, we recommend using the more general `storage::Vec` for
storing information on the contract instance.

### What is the test environment?

ink! provides a test environment
([test_env](https://github.com/paritytech/ink/blob/master/core/src/env/test_env.rs)) which is used
to emulate contract execution off-chain. This can be enabled by the crate feature `test-env` and is
mainly used for running tests off-chain.

### How do I run off-chain tests?

When building a smart contract with ink!, you can define a set of tests that can be run using the
off-chain test environment.

For example, in the minimal [flipper
contract](https://github.com/paritytech/ink/blob/master/examples/lang2/flipper/src/lib.rs), you can
find a small off-chain test at the bottom of the contract.

You should run this test just like you would any other Rust test:

```bash
cargo test
```

## Get Help

Join the growing community of ink! smart contract developers:

* Ask development questions on [StackOverflow](https://stackoverflow.com/questions/tagged/ink) with
  the `ink` tag.
* Join the live chat in the [Smart Contracts & Parity
  ink!](https://riot.im/app/#/room/!tYUCYdSvSYPMjWNDDD:matrix.parity.io) on Riot.
* Report bugs, make feature requests, and ask technical questions on the [ink!
  GitHub](https://github.com/paritytech/ink).


## Next Steps

### Learn More

* Learn more about the design philosophy of [ink! in our conceptual
  documentation](conceptual/runtime/contracts/ink.md).

* Learn more about the [SRML Contracts module](conceptual/runtime/contracts/contracts_module.md).

### Examples

* Follow a [tutorial to add this SRML Contracts module to your Substrate
  runtime](tutorials/adding-a-module-to-your-runtime.md).

### References

- Visit the [ink! repository for additional docs and to look at the
  source](https://github.com/paritytech/ink).

- Visit the reference docs for the [ink! abi](https://paritytech.github.io/ink/ink_abi/).

- Visit the reference docs for the [ink! core](https://paritytech.github.io/ink/ink_core/).

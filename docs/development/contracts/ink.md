---
title: ink!
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
* [An ERC721 Contract](https://github.com/paritytech/ink/tree/master/examples/lang/erc721/)
* [A Delegator Contract](https://github.com/paritytech/ink/tree/master/examples/lang2/delegator/)

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

- Visit the reference docs for the [ink! model](https://paritytech.github.io/ink/ink_model/).

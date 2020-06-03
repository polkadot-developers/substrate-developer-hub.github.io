---
title: Overview
---

This page is the top level entry point into the Substrate documentation.

Substrate is a blockchain development framework with a completely generic State Transition Function
(STF) and composable components for consensus, networking, and configuration.

Despite being "completely generic", it comes with both standards and conventions - particularly with
the Substrate runtime module library (a.k.a [FRAME](./runtime/frame)) - regarding the underlying
data-structures that power the STF, thereby making rapid blockchain development a reality.

## Usage

Substrate is designed to be used in one of three ways:

1. **With the Substrate Node**: You can run the pre-designed Substrate Node and configure it with a
   genesis block that includes the default node runtime. In this case, you just need to configure a
   JSON file and launch your own blockchain. This affords you the least amount of customization,
   only allowing you to change the genesis parameters of the included runtime modules such as:
   balances, staking, block-period, fees, governance, etc... For a tutorial on doing this, see
   [Start a Private Network with Substrate](https://substrate.dev/docs/en/next/tutorials/start-a-private-network/).

2. **With the Substrate FRAME**: You can easily create your own custom blockchain using the FRAME.
   This affords you a very large amount of freedom over your own blockchain's logic, letting you
   change datatypes, compose the library of modules, and add your own custom modules. Almost any
   blockchain can be made within FRAME, and the true power of Substrate lies here. If you want to
   dive right in, see the tutorial for
   [creating your first Substrate chain](https://substrate.dev/docs/en/next/tutorials/create-your-first-substrate-chain/).

3. **With the Substrate Core**: The entire FRAME can be ignored, and the entire runtime can be
   designed and implemented from scratch. This could be done in _any language_ that can target
   WebAssembly. If the runtime can be made to be compatible with the abstract block authoring logic
   of the Substrate node, then you can simply construct a new genesis block from your Wasm blob and
   launch your chain with the existing Rust-based Substrate client. If not, then you will need to
   alter the client's block authoring logic, and potentially even alter the header and block
   serialization formats. In terms of development effort, this is by far the most difficult way to
   use Substrate, but also gives you the most freedom to innovate.

## Next Steps

### Learn More

- View our developer documentation for
  [using the FRAME for module development](../runtime/frame).

### Examples

- Follow our
  [tutorial to create your first custom blockchain with Substrate](https://substrate.dev/docs/en/next/tutorials/create-your-first-substrate-chain/).

- Follow our
  [tutorial to start a private network with Substrate](https://substrate.dev/docs/en/next/tutorials/start-a-private-network/).

- Follow our
  [tutorial to build your first Substrate app](https://substrate.dev/docs/en/next/tutorials/build-a-dapp).

### References

- Check out [Rust reference documentation](https://crates.parity.io).

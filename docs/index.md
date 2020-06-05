---
title: Overview
---

This page is the top level entry point into the Substrate documentation.

> **Some Expertise Needed**
>
>In order to get the most out of Substrate, you should have a good knowledge of blockchain concepts
>and basic cryptography. Terminology like header, block, client, hash, transaction and signature
>should be familiar. At present you will need a working knowledge of Rust to be able to do any
>significant customization/adaption of Substrate (though eventually, we aim for this not to be the
>case).

Substrate is a blockchain development framework with a completely generic State Transition Function
([STF](knowledgebase/getting-started/glossary#stf-state-transition-function)) and modular components for consensus, networking,
and configuration.

Despite being "completely generic", it comes with both standards and conventions - particularly with
the Substrate runtime module library (a.k.a [FRAME](knowledgebase/runtime/frame.md)) - regarding the underlying
data-structures that power the STF, thereby making rapid blockchain development a reality.

## Usage

![Technical Freedom vs Development Ease](assets/technical-freedom.png)

Substrate is designed to be used in one of three ways:

1. **With the Substrate Node**: You can run the pre-designed Substrate Node and configure it with a
   genesis block that includes the default node runtime. In this case, you just need to configure a
   JSON file and launch your own blockchain. This affords you the least amount of customization,
   only allowing you to change the genesis parameters of the included runtime modules such as:
   balances, staking, block-period, fees, governance, etc... For a tutorial on doing this, see
   [Start a Private Network with Substrate](tutorials/start-a-private-network/index.md).

2. **With the Substrate FRAME**: You can easily create your own custom blockchain using the FRAME. This affords
   you a very large amount of freedom over your own blockchain's logic, letting you change
   datatypes, select from the library of modules, and add your own custom modules. Much can be
   changed without touching the block-authoring logic since it is directed through on-chain logic.
   If this is the case, then the existing Substrate binary can be used for block authoring and
   syncing. If the block authoring logic needs to be modified, then a new block-authoring binary
   must be built as a separate project and used by validators. This is how the Polkadot relay chain
   is built and should suffice for almost all needs in the near future. For a tutorial on this, see
   [creating your first Substrate chain](tutorials/create-your-first-substrate-chain/index.md).

3. **With the Substrate Core**: The entire [FRAME](knowledgebase/runtime/frame.md) can be ignored, and
   the entire runtime can be designed and implemented from scratch. This could be done in _any
   language_ that can target WebAssembly. If the runtime can be made to be compatible with the
   abstract block authoring logic of the Substrate node, then you can simply construct a new genesis
   block from your Wasm blob and launch your chain with the existing Rust-based Substrate client. If
   not, then you will need to alter the client's block authoring logic, and potentially even
   alter the header and block serialization formats. In terms of development effort, this is by
   far the most difficult way to use Substrate, but also gives you the most freedom to innovate.

## Next Steps

### Learn More

- View our developer documentation for [using the FRAME for module
  development](knowledgebase/runtime/frame.md).

### Examples

- Follow our [tutorial to create your first custom blockchain with
  Substrate](tutorials/create-your-first-substrate-chain/).

- Follow our [tutorial to start a private network with
  Substrate](tutorials/start-a-private-network/).

- Follow our [tutorial to add a runtime module to your Substrate
  runtime](tutorials/add-a-pallet-to-your-runtime/).

### References

- Check out [Rust reference documentation](https://crates.parity.io).

---
title: Overview
---

Welcome to the wonderful world of blockchain development with Substrate! This is the Substrate Knowledge Base, the
official documentation hub for Substrate developers. The purpose of this resource is to help readers understand the intricacies of blockchain development with Substrate. This guide is broken down into several sections that
explain the principles and design decisions that Substrate is built on as well as the specific skills needed to be an
effective Substrate blockchain developer.

> **Some Expertise Needed**
>
> In order to get the most out of Substrate, you should have a good knowledge of computer science and basic blockchain
> concepts. Terminology like header, block, client, hash, transaction and signature should be familiar. Substrate is
> built on the Rust programming language, which makes use of novel design patterns to enable development of code that is
> safe and fast. Although you don't need to know Rust to get started with Substrate, a good understanding of Rust will
> allow you to become a better Substrate developer. Check out [the excellent resources](https://www.rust-lang.org/learn)
> provided by the Rust community to build your Rust development skills.

Substrate takes a modular approach to blockchain development and defines a rich set of primitives that allows developers
to make use of powerful, familiar programming idioms.

## Usage

Substrate is designed to be used in one of three ways:

1. **With the Substrate Node**: You can run the pre-designed
   [Substrate Node](https://github.com/paritytech/substrate/tree/master/bin/node) and
   [configure](https://github.com/paritytech/substrate/blob/master/bin/node/cli/src/chain_spec.rs) its genesis block. In
   this case, you just need to supply a JSON file and launch your own blockchain. The JSON file allows you to configure
   the genesis state of the modules that compose the Substrate Node's runtime, such as: Balances, Staking, and Sudo. You
   can learn more about running a Substrate node in the
   [Create Your First Substrate Chain](tutorials/create-your-first-substrate-chain) and
   [Start a Private Network](tutorials/start-a-private-network/index.md) tutorials.

2. **With Substrate FRAME**: You can easily create your own custom runtime using [FRAME](knowledgebase/runtime/frame.md)
   (Framework for Runtime Aggregation of Modularized Entities), which is what is used to build the Substrate Node. This
   affords you a large amount of freedom over your blockchain's logic, and allows you to configure data types, select
   from a library of modules (called "pallets"), and even add your own custom pallets. The
   [Substrate Developer Hub Node Template](https://github.com/substrate-developer-hub/substrate-node-template) is a
   helpful starting point for projects like this. To learn more, see the tutorials to
   [Build a dApp](tutorials/build-a-dapp) and [Add a Pallet](tutorials/add-a-pallet).

3. **With Substrate Core**: The entire FRAME system can be ignored, and the runtime can be designed and implemented from
   scratch. This could be done in _any language_ that can target [WebAssembly](https://webassembly.org/). If the runtime
   can be made to be compatible with the abstract block authoring logic of the Substrate node, then you can simply
   construct a new genesis block from your Wasm blob and launch your chain with the existing Rust-based Substrate
   client. If not, then you will need to alter the client's block authoring logic, and potentially even alter the header
   and block serialization formats. In terms of development effort, this is by far the most difficult way to use
   Substrate, but also gives you the most freedom to innovate.

Substrate allows developers to make choices between technical freedom and ease of development in every step of their design decisions. The diagram below illustrates the nature of this flexibility.

![Technical Freedom vs Development Ease](assets/technical-freedom.png)

## Next Steps

### Learn More

- Refer to the developer documentation for the [FRAME system for runtime development](knowledgebase/runtime).
- Learn how to create rich client applications for any Substrate-based chain by using the
  [Polkadot-JS](knowledgebase/integrate/polkadot-js) family of libraries.
- Dive deep into advanced topics, like Substrate's [SCALE encoding](knowledgebase/advanced/codec),
  [consensus mechanisms](knowledgebase/advanced/consensus), [cryptography](knowledgebase/advanced/cryptography), and
  [storage implementation](knowledgebase/advanced/storage).

### Examples

- Follow our [tutorials](../../tutorials) to learn about building and running blockchains with Substrate and FRAME.
- Refer to [Substrate Recipes](https://substrate.dev/recipes/) to find complete working examples that demonstrate
  solutions to common problems.

### References

- Check out the [Rust reference documentation](https://substrate.dev/rustdocs) that ships with the Substrate code base.

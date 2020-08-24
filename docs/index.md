---
title: Overview
---

Welcome to the wonderful world of blockchain development with Substrate! This is the Substrate Knowledge Base, the
official documentation hub for Substrate developers. The purpose of this resource is to help readers understand the
multi-disciplinary field of blockchain development with Substrate. This guide is broken down into several sections that
explain the principles and design decisions that Substrate is built on as well as the specific skills needed to to be an
effective Substrate blockchain developer.

> **Some Expertise Needed**
>
> In order to get the most out of Substrate, you should have a good knowledge of computer science and basic blockchain
> concepts. Terminology like header, block, client, hash, transaction and signature should be familiar. Substrate is
> built on the Rust programming language, which makes use of novel design patterns to enable development of code that is
> safe and fast. Although you don't need to know Rust to get started with Substrate, a good understanding of Rust will
> allow you to be a better Substrate developer. Check out [the excellent resources](https://www.rust-lang.org/learn)
> provided by the Rust community to build your Rust development skills.

Substrate takes a modular approach to blockchain development and defines a rich set of primitives that allows developers
to make use of powerful, familiar programming idioms.

## Architecture

![Substrate Client Architecture](assets/substrate-arch.png)

The Substrate client is an application that runs a Substrate-based blockchain node - it consists of several components
that include, but are not limited to, the following:

- **Storage** is used to persist the evolving state of the decentralized system represented by a blockchain. The
  blockchain network allows participants to reach trustless [consensus](knowledgebase/advanced/consensus) about the
  state of storage. Substrate ships with a simple and highly efficient
  [key-value storage mechanism](knowledgebase/advanced/storage).
- **Runtime** logic defines how blocks are processed, including state transition logic. In Substrate, runtime code is
  compiled to [Wasm](knowledgebase/getting-started/glossary#webassembly-wasm) and becomes part of the blockchain's
  storage state - this enables one of the defining features of a Substrate-based blockchain:
  [forkless runtime upgrades](knowledgebase/advanced/executor#forkless-runtime-upgrades). Substrate clients may also
  include a "native runtime" that is compiled for the same platform as the client itself (as opposed to Wasm). The
  component of the client that dispatches calls to the runtime is known as the
  [executor](knowledgebase/advanced/executor) and it selects between the native code and interpreted Wasm. Although the
  native runtime may offer a performance advantage, the executor will select to interpret the Wasm runtime if it
  implements a newer [version](knowledgebase/advanced/executor#runtime-versioning).
- **Peer-to-peer network** capabilities allow the client to communicate with other network participants. Substrate uses
  [the `libp2p` network stack](https://libp2p.io/).
- **Consensus** engines provide logic that allows network participants to agree on the state of the blockchain.
  Substrate makes it possible to supply custom consensus engines and also ships with several consensus mechanisms that
  have been built on top of [Web3 Foundation research](https://w3f-research.readthedocs.io/en/latest/index.html).
- **RPC** (remote procedure call) capabilities allow blockchain users to interact with the network. Substrate provides
  HTTP and WebSocket RPC servers.
- **Telemetry** metrics are exposed by way of an embedded [Prometheus](https://prometheus.io/) server.

## Usage

![Technical Freedom vs Development Ease](assets/technical-freedom.png)

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
   (Framework for Runtime Aggregation of Modularized Entities), which is the method used by the Substrate Node. This
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
- Refer to the [Substrate Recipes](https://substrate.dev/recipes/) to find complete working examples that demonstrate
  solutions to common problems.

### References

- Check out the [Rust reference documentation](https://substrate.dev/rustdocs) that ships with the Substrate code base.

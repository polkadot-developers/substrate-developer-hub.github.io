---
title: Overview
id: version-pre-2.0-index
original_id: index
---

## Substrate Runtime

The runtime contains the business logic that will define your blockchain's behavior,
a.k.a. the state transition function.

The Substrate runtime is composed of a set of modules (called pallets) and 
support libraries that make blockchain runtime development as flexible and 
easy as possible. 
You can think of these pallets as individual pieces of logic which define what 
your blockchain can do!

![Runtime Composition](assets/runtime.png)

For example,
If you want to add smart contract functionality to your blockchain, you simply need to include the
[Contracts](https://substrate.dev/rustdocs/master/pallet_contracts/index.html) pallet.


### Learn More

- Follow a [tutorial to develop your first Substrate 
chain](tutorials/creating-your-first-substrate-chain/index.md).

- Follow a [tutorial to add a pallet to your Substrate
runtime](tutorials/adding-a-module-to-your-runtime.md).

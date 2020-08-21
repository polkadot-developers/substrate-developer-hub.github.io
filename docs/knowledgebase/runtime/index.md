---
title: Overview
---

## Substrate Runtime

The runtime contains the business logic that will define your blockchain's behavior, a.k.a. its
state transition function. The runtime will define the storage items and functions that users can
dispatch.

Substrate provides a set of modules, called pallets, that can be composed and configured. Substrate
also provides the support libraries necessary to let these pallets interact with the client. Each
pallet contains domain-specific logic and storage items. At the runtime level, you can add your own
pallets by using the standard pallet interfaces and access the public methods and traits of other
pallets.

The entire set of pallets and support libraries is called _FRAME._ FRAME interacts with the client
by implementing the traits in _primitives._

![Runtime Composition](assets/frame-runtime.png)

For example, if you want to add smart contract functionality to your blockchain, you simply need to
include the [Contracts](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_contracts/index.html) pallet.
Adding this pallet will expose the smart contract interface so that users can deploy smart contracts
that execute in Wasm.

Because Substrate can execute a runtime in both native and Wasm, anything that you write in FRAME
can be upgraded without a hard fork.

### Learn More

- Follow a
  [tutorial to develop your first Substrate chain](../../tutorials/create-your-first-substrate-chain/).
- Follow a
  [tutorial to add a pallet to your Substrate runtime](../../tutorials/add-a-pallet/).

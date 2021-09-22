---
title: Frontier Architecture Diagrams
---

## Frontier Overview & Architecture Diagrams

Here are a few helpful diagrams to help illustrate how the Frontier EVM and Ethereum RPC plug into
your Substrate FRAME runtime.

### EVM Pallet Runtime Configuration

The Ethereum Virtual Machine (EVM) is a sandboxed virtual stack machine that is implemented in the
EVM pallet. The EVM is responsible for executing Ethereum contract bytecode of smart contracts,
typically written in a high level language like Solidity, then compiled to EVM bytecode.

![architecture diagram](assets/tutorials/frontier/pallet-evm.png)

### Ethereum Pallet

The Ethereum pallet is responsible for storing Ethereum-formatted blocks, transaction receipts, and transaction statuses.

![architecture diagram](assets/tutorials/frontier/pallet-ethereum.png)

### Wrapping Ethereum Transactions

When a user submits a raw Ethereum transaction, we need to convert it into a Substrate transaction. The conversion is simple. We just wrap the raw transaction in a call the `pallet_ethereum`'s `transact` extrinsic. This is done in the runtime.

> Note that Ethereum Accounts and Substrate accounts in this template are not directly compatible
> for using keys. For an explainer on this, please see the
> [Moonbean documentain on EVM&Substrate Accounts](https://docs.moonbeam.network/learn/unified-accounts/#substrate-evm-compatible-blockchain)

### Ethereum Specific Runtime APIs & RPCs

Our runtime is storing all the ethereum-formatted information that may be queried, thus we need a
way for the RPC server to call into the runtime and retrieve that information. This is done through
runtime APIs & RPCs.

![architecture diagram](assets/tutorials/frontier/rpc.png)

Further reading:

- [Recipe about Runtime APIs](https://substrate.dev/recipes/runtime-api.html)
- [Recipe about Custom RPCs](https://substrate.dev/recipes/custom-rpc.html)
- RPCs in Frontier: [fc-rpc](https://github.com/paritytech/frontier/tree/master/client/rpc)
  and [fc-rpc-core](https://github.com/paritytech/frontier/blob/master/client/rpc-core/)

### Frontier Block Import

![architecture diagram](assets/tutorials/frontier/block-import.png)

Further reading:

- [Block import pipeline docs](../../knowledgebase/advanced/block-import)
- [Frontier consensus code](https://github.com/paritytech/frontier/tree/master/primitives/consensus)

---
title: Off-Chain Features
---

## Overview

There is often a need to query and/or process off-chain data before it can be included in the
on-chain state. The conventional way of doing this is through oracles. Oracles are external services
that typically listen to blockchain events and trigger tasks accordingly. When these tasks complete,
their results are submitted back to the blockchain using transactions. While this approach works, it
still has several flaws with respect to security, scalability, and infrastructure efficiency.

To make the off-chain data integration secure and more efficient, Substrate provides off-chain
features:

- **Off-Chain Worker (OCW)** subsystem allows execution of long-running and possibly non-
  deterministic tasks (e.g. web requests, encryption/decryption and signing of data, random number
  generation, CPU-intensive computations, enumeration/aggregation of on-chain data, etc.) that could
  otherwise require longer than the block execution time.

- **Off-Chain Storage** offers storage that is local to a Substrate node that can be accessed both
  by off-chain workers (both read and write access) and on-chain logic (write access via off-chain
  indexing but not read access). This is great for different worker threads to communicate to each
  others and for storing user- / node-specific data that does not require consensus over the whole
  network.

- **Off-Chain Indexing** allows the runtime, if opted-in, to write directly to the off-chain storage
  independently from OCWs. This serves as a local/temporary storage for on-chain logic and
  complement to its on-chain state.

Off-chain features run in their own Wasm execution environment outside of the Substrate runtime.
This separation of concerns makes sure that block production is not impacted by long-running
off-chain tasks. However, as the off-chain features are declared in the same code as the runtime,
they can easily access on-chain state for their computations.

![Off-chain Workers](assets/off-chain-workers-v2.png)

## Off-Chain Workers

Off-chain workers have access to extended APIs for communicating with the external world:

- Ability to
  [submit transactions](https://substrate.dev/rustdocs/latest/sp_runtime/offchain/trait.TransactionPool.html)
  (either signed or unsigned) to the chain to publish computation results [[1]](#example-txs).
- A fully-featured HTTP client allowing the worker to access and fetch data from external services [[2]](#example-http).
- Access to the local keystore to sign and verify statements or transactions.
- An additional, local
  [key-value database](https://substrate.dev/rustdocs/latest/sp_runtime/offchain/trait.OffchainStorage.html)
  shared between all off-chain workers [[3]](#example-off-chain-storage).
- A secure, local entropy source for random number generation.
- Access to the node's precise
  [local time](https://substrate.dev/rustdocs/latest/sp_runtime/offchain/struct.Timestamp.html).
- The ability to sleep and resume work.

OCWs can be initiated from within a special function in your runtime implementation,
[`fn offchain_worker(block: T::BlockNumber)`](https://substrate.dev/rustdocs/latest/frame_support/traits/trait.OffchainWorker.html).
communicate results back to the chain, off-chain workers can submit signed or unsigned transactions
to be included in subsequent blocks.

Note that the results from off-chain workers are not subject to regular transaction verification. A
verification mechanism (e.g. voting, averaging, checking sender signatures, or simply "trusting")
should be implemented to determine what information gets into the chain.

## Off-Chain Storage

As its name indicated, the storage is not stored on-chain. It can be accessed by off-chain worker
threads (both read and write access) and on-chain logic (write only, refer to off-chain indexing
below). This storage is not populated among the blockchain network and does not need to have
consensus computation over it.

As an off-chain worker thread is being spawned off during each block import, there could be more
than one off-chain worker thread running at any given time. So, similar to any multi-threaded
programming environment, there are also utilities to
[mutex lock](<https://en.wikipedia.org/wiki/Lock_(computer_science)>) the storage when accessing
them for data consistency.

Off-chain storage serves as a bridge for various off-chain worker threads to communicate to each
others and between off-chain and on-chain logics. It can also be read using remote procedure calls
(RPC) so it fits the use case of storing indefinitely growing data without over-consuming the
on-chain storage.

[Check here for a concrete example of using off-chain storage](#example-off-chain-storage).

## Off-Chain Indexing

Storage in the context of blockchain is mostly about on-chain state. But it is expensive (as it is
populated to each node in the network) and not recommended for historical or user-generated data
which grow indefinitely over time.

We have off-chain storage for this purpose. In addition of being accessible by OCWs, Substrate also
includes a feature called "off-chain indexing" allowing the runtime to write directly to the
off-chain storage independently from OCWs. Nodes have to opt-in for persistency of this data via
`--enable-offchain-indexing` flag when starting up the Substrate node.

Unlike OCWs, which are not executed during initial blockchain synchronization, off-chain indexing is
populating the storage every time a block is processed, so the data is always consistent and will be
exactly the same for every node with indexing enabled.

[Check here for a concrete example of using off-chain indexing](#example-off-chain-indexing).

## Learn More

To look at concrete examples of off-chain workers and how to use them in runtime development,
refer to the following sections in Substrate Recipes:

- <span id="example-txs">[Submit signed and unsigned transactions from off-chain workers back on-chain](https://substrate.dev/recipes/off-chain-workers/transactions.html)</span>
- <span id="example-http">[Fetch external data using HTTP requests and parse JSON responses](https://substrate.dev/recipes/off-chain-workers/http-json.html)</span>
- <span id="example-off-chain-storage">[Store result in off-chain worker local storage](https://substrate.dev/recipes/off-chain-workers/storage.html)</span>
- <span id="example-off-chain-indexing">[Example of off-chain indexing](https://substrate.dev/recipes/off-chain-workers/indexing.html)

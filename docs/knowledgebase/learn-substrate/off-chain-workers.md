---
title: Off-Chain Workers
---

## Overview

There is often a need to query and/or process off-chain data before it can be included in the
on-chain state. The conventional way of doing this is through oracles. Oracles are external services
that typically listen to blockchain events and trigger tasks accordingly. When these tasks complete,
their results are submitted back to the blockchain using transactions. While this approach works, it
still has several flaws with respect to security, scalability, and infrastructure efficiency.

To make the off-chain data integration secure and more efficient, Substrate provides off-chain
workers. The off-chain worker (OCW) subsystem allows execution of long-running and possibly non-
deterministic tasks (e.g. web requests, encryption/decryption and signing of data, random number
generation, CPU-intensive computations, enumeration/aggregation of on-chain data, etc.) that could
otherwise require longer than the block execution time.

Off-chain workers have their own Wasm execution environment outside of the Substrate runtime. This
separation of concerns is to make sure that the block production is not impacted by the long-running
tasks. However, as the off-chain workers are declared in the same code as the runtime, they can
easily access on-chain state for their computations.

![Off-chain Workers](assets/off-chain-workers-v2.png)

## APIs

Off-chain workers have access to extended APIs for communicating with the external world:

- Ability to submit transactions (either signed or unsigned) to the chain to publish computation
  results.
- A fully-featured HTTP client allowing the worker to access and fetch data from external services.
- Access to the local keystore to sign and verify statements or transactions.
- An additional, local key-value database shared between all off-chain workers.
- A secure, local entropy source for random number generation.
- Access to the node's precise local time and the ability to sleep and resume work.

OCWs can be initiated from within a special function in your runtime implementation,
`fn offchain_worker(block: T::BlockNumber)`. The function is executed after each block import. To
communicate results back to the chain, off-chain workers can submit signed or unsigned transactions
to be included in subsequent blocks.

Note that the results from off-chain workers are not subject to regular transaction verification. A
verification mechanism (e.g. voting, averaging, checking sender signatures, or simply "trusting")
should be implemented to determine what information gets into the chain.

For more information on how to use off-chain workers in your next runtime development project,
please refer to our [Development Guide](../runtime/off-chain-workers).

# Off-Chain Indexing

Storage in the context of blockchain is mostly about on-chain state. But it is expensive (as 
it is populated to each node in the network) and not recommended for historical or user-generated 
data which grow indefinitely over time.

Luckily every Substrate node comes with off-chain database also. One of the main use cases is to be
used together with off-chain workers mentioned above. In addition, Substrate also includes a feature
called "off-chain indexing", which allows the runtime to write directly to the off-chain database
independently from OCWs. Nodes have to opt-in for persistency of this data via 
`--enable-offchain-indexing` flag when starting up the Substrate node.

Unlike OCWs, which are not executed during initial blockchain synchronization, off-chain indexing is 
populating the database every time a block is processed, so the data is always consistent and will
be exactly the same for every node with indexing enabled.

Off-chain database can be read using remote procedure calls (RPC) so it fits the use case of storing
indefinitely growing data without over-consuming the on-chain storage.

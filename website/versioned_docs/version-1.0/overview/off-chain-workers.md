---
title: Off-Chain Workers
id: version-1.0-off-chain-workers
original_id: off-chain-workers
---

There is often a need to query and/or process off-chain data before it can be included in the on-chain state. The conventional way of doing this is through oracles. Oracles are external services that typically listen to blockchain events and trigger tasks accordingly. When these tasks complete, their result is submitted back to the blockchain using transactions. While this approach works, it still has several flaws with respect to security, scalability, and infrastructure efficiency.

## Overview

To make the off-chain data integration secure and more efficient, Substrate provides off-chain workers. The off-chain worker subsystem allows execution of long-running and possibly non-deterministic tasks (e.g. web requests, encryption/decryption and signing of data, random number generation, CPU-intensive computations, enumeration/aggregation of on-chain data, etc.) which could otherwise require longer than the block execution time.

Off-chain workers have their own Wasm execution environment outside of the Substrate runtime. This separation of concerns is to make sure that the block production is not impacted by the long-running tasks. However, as the off-chain workers are declared in the same code as the runtime, they can easily access on-chain state for their computations.

Off-chain workers can be initiated from within a special function in the runtime modules - `offchain_worker(_n: T::BlockNumber)`. The function is executed after block import. To communicate results back to the chain, off-chain workers can submit extrinsics that are later included in subsequent blocks.

It is to be noted that the results from off-chain workers are not subject to regular consensus. An on-chain verification mechanism (e.g. voting, averaging, challenging or simply "trusting") should be implemented to determine what information gets into the chain.

The following diagram depicts how off-chain workers work within the Substrate node:

![Off-chain Workers](/docs/assets/off-chain-workers-v1.png)

## Off-Chain Worker APIs

The following APIs are planned to be supported by off-chain workers:

1. Local storage - get and set
2. HTTP requests
3. Random seed generation
4. Timestamp
5. Sleep

**Note:** Some of these APIs are still under development. More information and usage documentation will be published as and when the APIs are available for use.

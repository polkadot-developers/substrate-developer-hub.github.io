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

![Off-chain Workers](/docs/assets/off-chain-workers.png)

## Off-Chain Worker vs Oracles

Here are some of the advantages of using off-chain workers in comparison to using external oracles:

1. Off-chain workers, being part of the Substrate node, provide more decentralization as compared to a centralized oracle service.
2. With a sandboxed Wasm execution environment, off-chain workers are fully secure while still providing seamless integration with the runtime using extrinsics.
3. No need for maintaining external "glue" services and infrastructure. This reduces maintenance and infrastructure costs for the node operators.
4. Off-chain workers' code is also stored on-chain, which allows off-chain logic updates via standard governance mechanism and seamless upgrades (using Wasm execution fallback logic).

## Off-Chain Worker APIs

The following APIs are planned to be supported by off-chain workers:

1. Encryption and decryption
2. Signing
3. Local storage - get and set
4. HTTP requests
5. Key generation
6. Random number generation
7. Timestamp

**Note:** Some of these APIs are still under development. More information and usage documentation will be published as and when the APIs are available for use.

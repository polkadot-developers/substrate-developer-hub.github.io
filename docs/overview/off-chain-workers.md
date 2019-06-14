---
title: "Substrate Off-chain Workers"
---

Many a times, there is a need of querying and/or processing of off-chain data before it can be included into the on-chain state. The conventional way of doing this is through oracles. Oracles are external services which, typically, listen to blockchain events and trigger tasks accordingly. When these tasks running inside the oracle complete, their result is submitted back to the blockchain using transactions. While this approach works, it still has several flaws w.r.t. security, scalability and infrastructure efficiency.

To make the off-chain data integration secure and more efficient, Substrate includes off-chain workers. The off-chain worker subsystem allows execution of long-running tasks (web requests, encryption/decryption and signing of data, random number generation, etc.) which would require longer than the block execution time. 

The off-chain workers have their own Wasm execution environment outside of the Substrate runtime. This separation of concerns is to make sure that the block production is not impacted by the long-running tasks. The communication between the off-chain workers and the Substrate runtime is done using `InherentData`. When a task in the off-chain worker completes execution, its result can be submitted back to the runtime using `InherentData`.

The following diagram depicts how off-chain workers work within the Substrate node:

![Off-chain Workers](/docs/assets/off-chain-workers.png)

Here are some of the advantages of using off-chain workers in comparison to using external oracles:

1. Off-chain workers, being part of the Substrate node, provide more decentralization as compared to a centralized oracle service.
2. With a sandboxed Wasm execution environment, off-chain workers are fully secure while still providing seamless integration with the runtime using `InherentData`.
3. No need for maintaining external "glue" services and infrastructure. This reduces maintenance and infrastructure costs for the node operators.

The following APIs are planned to be supported by off-chain workers:

1. Encryption and Decryption
2. Signing
3. Local storage - Get and Set
4. HTTP Requests

**Note:** Some of these APIs are still under development. More information and usage documentation will be available as and when the APIs are available for use.

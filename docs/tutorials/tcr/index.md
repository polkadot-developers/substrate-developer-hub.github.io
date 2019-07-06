---
title: "Introduction"
---

This is an intermediate level guide to help you get started with building complex DAppChains using the Substrate framework. If you are new to Substrate, we recommend you first start with any of the following beginner level tutorials to have the basic concepts covered.

1. [Creating a Custom Substrate chain](tutorials/creating-your-first-substrate-chain.md) - Fast paced, brief tutorial.
2. [Substrate Collectables Tutorial](https://substrate-developer-hub.github.io/substrate-collectables-workshop/) - Detailed tutorial and covers more concepts in depth (highly recommended).

Once you have finished one of these tutorials, you are good to go with this guide.

## What does this guide cover?

This guide is intended for blockchain developers who want to build an _end-to-end_ DAppChain solution using Substrate. This guide covers the following topics as part of building a simple Token Curated Registry, as an example.

While the guide covers some of the TCR concepts in brief, if interested, you can [get a primer on TCRs](https://www.gautamdhameja.com/token-curated-registries-explain-eli5-a5d4cce0ddbe/). The full [TCR 1.0 paper](https://medium.com/@ilovebagels/token-curated-registries-1-0-61a232f8dac7) is also available.

The code for the sample TCR runtime covered in this guide is available in the [Substrate-TCR GitHub repository](https://github.com/substrate-developer-hub/substrate-tcr/).

The guide is divided into the following five parts.

* **PART 1:** [Building the TCR Substrate runtime](building-the-substrate-tcr-runtime.md)
    * How to use other SRML modules in custom runtime modules
    * How to use complex types in runtime storage
    * How to use genesis config for Substrate modules
    * How and when to use runtime events

* **PART 2:** [Unit testing the TCR module](unit-testing-the-tcr-runtime-module.md)
    * How to mock the runtime
    * How to mock genesis config
    * How to write unit tests for runtime module functions

* **PART 3:** [Building a UI for Substrate TCR runtime](building-a-ui-for-the-tcr-runtime.md)
    * How to connect to the Substrate node using the [Polkadot JS API](https://polkadot.js.org/api/)
    * How to bind complex types
    * How to subscribe to on-chain state updates

* **PART 4:** [Building event-based off-chain storage for querying and analysis](building-an-event-based-off-chain-storage.md)
    * How to listen to Substrate runtime events
    * How to sync on-chain data with an off-chain storage

* **PART 5:** [Best practices](tcr-best-practices.md)
    * Avoiding economic vulnerability in runtime modules
    * Error handling - Never Panic!
    * When to update state (doing enough checks)

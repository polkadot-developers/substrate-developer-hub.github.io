---
title: "Introduction"
id: version-pre-v2.0-3e65111-substrate-front-end-index
original_id: substrate-front-end-index
---

This is a beginner-level guide to help you get started with building the front-end of a decentralized application (later called DApp) on top of a Substrate-based blockchain using the [Polkadot-js API](https://github.com/polkadot-js). This tutorial does not require any previous knowledge about the Substrate framework or Rust language. It does, however, require knowledge of JavaScript as well as a basic knowledge of the React framework.

## What does this guide cover?

This tutorial is for front-end developers who want to be guided through the use of the [Polkadot-js API](https://github.com/polkadot-js) and the best practices for UI development on top of a Substrate-based chain. The goal is to build an application that lets you display users' accounts, see their balances, and send funds between accounts. The code for this application is available in the [`substrate-front-end` repo](https://github.com/substrate-developer-hub/substrate-front-end).

If you run into a problem following this tutorial or find anything that is not working as expected, please reach out on [Riot](https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org), submit an issue/PR to this doc by clicking on *Edit* at the top-right corner of any article, or submit an issue/PR for the code in the [`substrate-front-end` repo](https://github.com/substrate-developer-hub/substrate-front-end/issues/new).

The guide is divided into the following parts:

* **PART 1:** [Connect to a node and display basic information](part-1-connect-to-a-node.md)
    * Framework and tools
    * Connect to a node
    * Display node information

* **PART 2:** [Query and display balances](part-2-query-balances.md)
    * Get testing accounts
    * Query and display Alice's balance
    * Query and display all balances
    * Good to know

* **PART 3:** [Transfer funds](part-3-transfer-funds.md)
    * Transfer funds between accounts
    * Good to know

* **PART 4:** [Use external accounts](part-4-use-external-accounts.md)
    * Install an extension to manage accounts
    * Display externally-injected accounts
    * Adapt our `Transfer` component
    * Good to know
    * Going further: Extract the send button into its own component


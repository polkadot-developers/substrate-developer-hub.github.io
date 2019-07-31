---
title: "Introduction"
---

This is a beginner level guide to help you get started with building a basic decentralized application (later called DApp) on top of the Substrate based blockchain, using [polkadot{.js} api (aka polkadot-js api)](https://github.com/polkadot-js). This tutorial does not require any previous knowledge about the Substrate framework or rust language, it does, however, require knowledge of Javascript as well a basic knowledge of the React framework.

## What does this guide cover?

This tutorial is for front-end developers who want to be guided towards the use of the [Polkadot JS API](https://github.com/polkadot-js) and the best practices for UI development on top of a Substrate based chain. The goal is to build an application that allows to display a users accounts, to see their balances and finally to send funds between accounts. The code for this application is available in the [`basic-dapp` repo](https://github.com/substrate-developer-hub/basic-dapp).

If you run into problem following this tutorial, or find anything that is not working as expected, please reach out on [Riot](https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org), submit an issue/PR to this doc by clicking on *Edit* at the top right end corner of any article, or submit an issue/PR for the code in the [`basic-dapp` repo](https://github.com/substrate-developer-hub/basic-dapp/issues/new) :)

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
    
* **PART 4:** [Use external account](part-4-use-external-accounts.md)
    * Install an extension to manage accounts
    * Display externally injected accounts
    * Adapt our `Transfer` component
    * Good to know
    * Getting further: Extract the send button into its own component


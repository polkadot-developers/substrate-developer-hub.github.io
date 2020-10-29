---
title: Introduction
---

In this tutorial, you will learn how to build a permissioned network with Substrate by using [node-authorization pallet](https://docs.rs/pallet-node-authorization/2.0.0/pallet_node_authorization/). This tutorial should take you about **1 hour** to complete. 

> You are probably already familiar with public or permissionless blockchain, where everyone is free to join the network by runing a node. In a permissioned network, only authorized nodes are allowed to perform specific activities, like validate blocks and propagate transactions. I hold the belief that blockchain is still in early adoption, and permissioned blockchain is important to highly regulated market, which can bring transparent rules and execution at certain degree.

Before play with this tutorial, we expect that:

* You have completed the [Build a PoE Decentralized Application Tutorial](https://substrate.dev/docs/en/tutorials/build-a-dapp/).
* You are familiar with the [P2P Networking](https://wiki.polkadot.network/docs/en/maintain-guides-how-to-setup-sentry-node#p2p-networking) in Substrate.

If you run into an issue on this tutorial, **we are here to help!** You can [ask a question on Stack Overflow](https://stackoverflow.com/questions/tagged/substrate) and use the `substrate` tag or contact us on
[Element](https://app.element.io/#/room/!HzySYSaIhtyWrwiwEV:matrix.org).

## What you will be doing

Before we even get started, let's lay out what we are going to do over the course of this tutorial.
We will:

2. Modify the Node Template project to add [node-authorization pallet](https://docs.rs/pallet-node-authorization/2.0.0/pallet_node_authorization/).
3. Launch multiple nodes and authorize new nodes to join the network by calling the dispatchable calls provided by node-authorization pallet.

Sound reasonable? Good, then let's begin!

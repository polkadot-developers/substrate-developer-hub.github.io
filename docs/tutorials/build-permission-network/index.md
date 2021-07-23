---
title: Introduction
---

In this tutorial, you will learn how to build a permissioned network with Substrate by using
[node-authorization pallet](https://docs.rs/pallet-node-authorization/3.0.0/pallet_node_authorization/).
This tutorial should take you about **1 hour** to complete. 

 You are probably already familiar with public or *permissionless* blockchain, where everyone
 is free to join the network by running a node. In a permissioned network, only authorized
 nodes are allowed to perform specific activities, like validate blocks and propagate
 transactions. Some examples of where permissioned blockchains may be desired:
 - Private (or consortium) networks
 - Highly regulated data environments (healthcare, B2B ledgers, etc.)
 - Testing pre-public networks at scale

Before you start, we expect that:

* You have completed the 
[Build a PoE Decentralized Application Tutorial](https://substrate.dev/docs/en/tutorials/build-a-dapp/).
* You are conceptually familiar with
[P2P Networking](https://wiki.polkadot.network/docs/faq#what-is-libp2p) in Substrate.
    * We suggest to complete the [Private Network Tutorial](../start-a-private-network/index)
      to get experience with this first (not required). 

If you run into an issue on this tutorial, **we are here to help!** You can [ask a question on Stack Overflow](https://stackoverflow.com/questions/tagged/substrate) and use the `substrate` tag or contact us on
[Element](https://matrix.to/#/#substrate-technical:matrix.org).

## What you will be doing

1. Modify the Node Template project to add 
[node-authorization pallet](https://docs.rs/pallet-node-authorization/3.0.0/pallet_node_authorization/).
2. Launch multiple nodes and authorize new nodes to join the network by calling
the dispatchable calls provided by node-authorization pallet.

Sound fun? Great! Let's begin!

---
title: Background Information
---

In this section we will teach you about the Substrate blockchain development framework. The Node
Template that you are currently developing is built from this framework.

## Background on Blockchains

Blockchain development is hard.

Blockchain networks are composed of individual **nodes** that are connected together on a
peer-to-peer (P2P) network. Nodes are the individual computers on a network running the blockchain
software that makes everything work.

To function, a blockchain node needs:

- A Database
- P2P Networking
- A Consensus Engine
- Transaction Handling
- A State Transition Function
- and more...

These technologies span a huge breadth of computer science, and thus usually require expert teams to
develop. As a result, most blockchain projects are _not_ developed from the ground up. Instead,
these projects are forked from already existing blockchain repositories. For instance:

- The Bitcoin repository was forked to create: Litecoin, ZCash, Namecoin, Bitcoin Cash, etc...
- The Ethereum repository was forked to create: Quorem, POA Network, KodakCoin, Musicoin, etc...

![Blockchain Project Repository Forks](assets/tutorials/first-chain/forks.png)

Building blockchains in this way has serious limitations as these existing platform were not
designed with modification in mind.

## Substrate

Substrate is an **open source**, **modular**, and **extensible** framework for building blockchains.

Substrate has been designed from the ground up to provide a flexible framework for innovators to
design and build their next blockchain network. It provides all the core components you need to
build a customized blockchain node.

### Substrate Node Template

We provide an out-of-the-box working Substrate-based node in the form of the Node Template, which
should be compiling as you read this. Without making any changes, you and your friends could share
this node template and create a working blockchain network with a cryptocurrency and everything!

We will teach you how to use this node in "development" mode, which allows you to run a network with
a single node, and have some pre-configured user accounts with funds.

---
title: Background Information
---

# The Substrate Package

As we briefly mentioned above, the Substrate Package contains everything you need to start hacking on Substrate. More specifically it contains 3 different templates:

* [Substrate Module Template](https://github.com/substrate-developer-hub/substrate-module-template/)
* [Substrate Node Template](https://github.com/substrate-developer-hub/substrate-node-template/)
* [Substrate UI Template](https://github.com/substrate-developer-hub/substrate-ui-template/)

These templates are all individual git repositories, and work together to provide a cohesive set of tools for Substrate development.

[image here of all the parts coming together]

## Substrate Node Template

As you can see the Substrate Node Template sits at the center of this package.

A distributed blockchain system is composed of **nodes**, which is software that run on separate computers and communicate to one another forming a decentralized network.

The Substrate Node Template is an out-of-the-box working blockchain node built for easy modification. Without making any changes, you and your friends could share this node template and create a working blockchain network with a cryptocurrency and everything!

We will teach you how to use this node in "developer" mode, which allows you to run a network with a single node, and have some pre-configured user accounts with funds.

## Substrate Module Template

What makes Substrate so special is the ease at which you can compose the logic for your blockchain's underlying state transition function. This is _not_ the same as building smart contract's on top of modern blockchain systems. Whereas smart contracts are intentionally sandboxed from the internal workings of a blockchain, with Substrate, you have **full control** over how your blockchain operates.

[ image of smart contract versus module ]

We call this state transition function the **Substrate Runtime**, and it is composed of runtime modules. You can think of these runtime modules as individual pieces of logic which define what your blockchain can do! Substrate provides you with a number of pre-built runtime modules collected in the **Substrate Runtime Module Library** (SRML).

[ image of runtime composition ]

For example, the [Balances](https://substrate.dev/rustdocs/master/srml_balances/index.html) module controls the underlying currency of your blockchain by managing the _balance_ of all the accounts in your system. If you want to add smart contract functionality to your blockchain, you simply need to include the [Contracts](https://substrate.dev/rustdocs/master/srml_contracts/index.html) module. Even things like on-chain governance can be added to your blockchain by including modules like [Democracy](https://substrate.dev/rustdocs/master/srml_democracy/index.html), [Elections](https://substrate.dev/rustdocs/master/srml_elections/index.html), and [Collective](https://substrate.dev/rustdocs/master/srml_collective/index.html).

The goal of this tutorial is to teach you how to create your own Substrate Runtime Module which will be included in your custom blockchain!

## Substrate UI Template

Finally, to interact with your blockchain, we provide a simple [React](https://reactjs.org/) based user interface which uses the [**Polkadot.js API**](https://github.com/polkadot-js/api/). Even though this library is labeled "Polkadot", it is built to be flexible and work with any Substrate based chain, like the one we will have you build. This tutorial will not go into too much detail about building a custom UI, but we will have you interact with your blockchain using this.

# Proof Of Existence Chain

Let's talk about what you will be building in this tutorial. From [Wikipedia](https://en.wikipedia.org/wiki/Proof_of_Existence): 

> Proof of Existence is an online service that verifies the existence of computer files as of a specific time via timestamped transactions in the bitcoin blockchain.

As mentioned, the Proof of Existence service was originally created on top of the Bitcoin blockchain. However, this functionality is [not properly supported](https://en.bitcoin.it/wiki/OP_RETURN) by the Bitcoin protocol, and the existing service uses more of a hack on top of other Bitcoin functions.

Introducing new functionality to a blockchain like Bitcoin is incredibly difficult since it is designed for a single 


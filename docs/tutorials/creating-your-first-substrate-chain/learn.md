---
title: Background Information
---

In this section we will teach you about the Substrate blockchain development
framework.

## Background on Blockchains

Blockchain development is hard.

Blockchain networks are composed of individual **nodes** that are connected
together on a peer-to-peer (P2P) network. Nodes are the individual computers on
a network running the blockchain software that makes everything work.

To function, a blockchain node needs:

* A Database
* P2P Networking
* A Consensus Engine
* Transaction Handling
* A State Transition Function
* and more...

These technologies span a huge breadth of computer science, and thus usually
require expert teams to develop. As a result, most blockchain projects are _not_
developed from the ground up. Instead they are forked from already existing
blockchains. For instance:

* Bitcoin was forked to create: Litecoin, ZCash, Namecoin, Bitcoin Cash, etc...
* Ethereum was forked to create: Quorem, POA Network, KodakCoin, etc...

![](assets/forks.png)

Building blockchains in this way has serious limitations as these existing
platform were not designed to be modified.

## Substrate

Substrate is an **open source**, **modular**, and **extensible** framework for
building blockchains.

Substrate has been designed from the ground up to provide a flexible framework
for innovators to design and build their next blockchain network. It provides
all the core components you need to build a customized blockchain node.

### Substrate Node Template

We provide an out-of-the-box working Substrate node in the form of the
`substrate-node-template`, which should be compiling as you read this. Without
making any changes, you and your friends could share this node template and
create a working blockchain network with a cryptocurrency and everything!

We will teach you how to use this node in "developer" mode, which allows you to
run a network with a single node, and have some pre-configured user accounts
with funds.

### Substrate Runtime Module Template

The Substrate framework puts an emphasis on making it easy to design custom
block execution logic, a.k.a. the state transition function of the blockchain.
We call this part of Substrate the **runtime**.

The Substrate runtime is composed of runtime modules. You can think of these
runtime modules as individual pieces of logic which define what your blockchain
can do! Substrate provides you with a number of pre-built runtime modules
collected in the **Substrate Runtime Module Library** (SRML).

![Runtime Composition](assets/runtime.png)

For example, the SRML includes a
[Balances](https://substrate.dev/rustdocs/master/srml_balances/index.html)
module that controls the underlying currency of your blockchain by managing the
_balance_ of all the accounts in your system. 

If you want to add smart contract functionality to your blockchain, you simply
need to include the
[Contracts](https://substrate.dev/rustdocs/master/srml_contracts/index.html)
module.

Even things like on-chain governance can be added to your blockchain by
including modules like
[Democracy](https://substrate.dev/rustdocs/master/srml_democracy/index.html),
[Elections](https://substrate.dev/rustdocs/master/srml_elections/index.html),
and
[Collective](https://substrate.dev/rustdocs/master/srml_collective/index.html).

The goal of this tutorial is to teach you how to create your own Substrate
runtime module which will be included in your custom blockchain! The
`substrate-node-template` comes with a template module that we will build your
custom logic on top of.

## Proof Of Existence Chain

The custom logic we will add to your Substrate runtime is a Proof of Existence
module. From [Wikipedia](https://en.wikipedia.org/wiki/Proof_of_Existence): 

> Proof of Existence is an online service that verifies the existence of
> computer files as of a specific time via timestamped transactions in the
> bitcoin blockchain.

Rather than uploading the entire file to the blockchain to "prove its
existence", users submit a [hash of the
file](https://en.wikipedia.org/wiki/File_verification), known as a file digest
or checksum. These digests are powerful because huge files can be uniquely
represented by a small hash value, which is efficient for storing on the
blockchain. Any user with the original file can prove that this file matches the
one on the blockchain by simply recomputing the hash of the file and compare it
with the hash stored on chain.

To add to this, blockchain systems also provide a robust account system. So when
a file digest is stored on the blockchain, we can also which user uploaded that
digest. This allows that user to later prove that they were the original person
to claim the file.

[ image ]

Our Proof of Existence module will expose two callable functions:

* `make_claim` - Which allows a user to claim the existence of a file by
  uploading a file digest.

* `revoke_claim` - Which allows the current owner of a claim to revoke their
  ownership.

We will only need to store information about the proofs that have been claimed,
and who made those claims.

Sounds easy enough?

If your node is finished compiling, then you are ready to move to the next
section where we will interact with your Substrate node template!

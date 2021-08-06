---
title: Introduction
---

[Frontier](https://github.com/paritytech/frontier) is a set of modules to build an **Ethereum-compatible blockchain with Substrate**.

This tutorial explains the concepts and demonstrates the steps necessary to build an Ethereum-compatible chain using Frontier.

## Template Solution and Reference

> This tutorial is presently _not up to date!_ While it is still a good reference, it relays
> incomplete and sometimes incorrect information based an older version of the base substrate node
> template. It is thus _highly_ encouraged to generate your own template based of whatever commit
> you desire from frontier itself to start working with many of the core features of Frontier
> installed and enabled.

### Frontier Template

To get a Frontier template to start, you are encouraged to generate your own. There also exists a
github based template that is available for major Frontier releases to use.

#### Generation Script

You can generate a version of the Frontier template by running the
[generation script](https://github.com/paritytech/frontier/blob/master/.maintain/node-template-release.sh)
included in Frontier. This can be done starting at **any commit within frontier** to get a specific version/tag.

```bash
# from the top working dir of Frontier:
cd .maintain/
# set the *full file name with .tar.gz extension* for your output file
./node-template-release.sh TEMPLATE.tar.gz
# Note the file will be placed in the top level working dir of frontier
# Move the archive to wherever you like...
tar xvzf TEMPLATE.tar.gz
# this unpacks into `frontier-node-template` with all your files
cd frontier-node-template
# build the template
cargo build --release
```

### Github Template

The Substrate Develper Hub has generated the template using the
[included release guide](https://github.com/paritytech/frontier/blob/master/docs/node-template-release.md)
, and intends to update with major releases of Frontier moving forward.

You can `use` the pre-generated template or `fork` it from here:
https://github.com/substrate-developer-hub/frontier-node-template/ .

## Before You Begin

You should have completed _at least_ the following three Substrate tutorials before attempting this tutorial:

- [Create Your First Substrate Chain](../../tutorials/create-your-first-substrate-chain/)
- [Add a Pallet to Your Runtime](../../tutorials/add-a-pallet/)
- [Build a PoE Decentralized Application](../../tutorials/build-a-dapp/)

Before attempting this tutorial, you should be familiar with the concepts listed below:

- Launching a Substrate chain
- Submitting extrinsics
- Adding, Removing, and configuring pallets in a runtime
- Ethereum and EVM basics
- Pallet design

Additional supplemental learning resources are recommended throughout the tutorial.

## Maintenance

This tutorial was donated to Substrate Developer Hub by the [Moonbeam](https://moonbeam.network/) team, and made public in hopes that it will be useful.

If you do encounter issues when following this tutorial, please [file a bug](https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/issues/new) on github.

## Contact

Reach out to Substrate Developer Hub team at:

- [Subport - Substrate Support](https://github.com/paritytech/subport)
- [Element (Substrate Technical channel)](https://matrix.to/#/#substrate-technical:matrix.org)
- [Element (Moonbeam channel)](https://matrix.to/#/#moonbeam:matrix.org) - channel to contact the original author of this repository

---
title: "Initialize Your Blockchain"
---

Although Substrate has provided all the components to build a blockchain, as a developer you still need to assemble the pieces you needed.

To ease the life for beginners, Substrate offers two kinds of build-in nodes to do the assembly work:
* [Template Node](https://github.com/paritytech/substrate/tree/v1.0/node-template): includes the minimum components to have a taste around blockchain.
* [Node](https://github.com/paritytech/substrate/tree/v1.0/node): includes most of the components to let you try all the Substrate build-in features.

A node (aka peer-to-peer node or full node) usually serves as a reference implementation for blockchain specification. You can think of it as a backend service in traditional web, but in a decentralized way.

Here we are using **Template Node** with [`substrate-up`](https://github.com/paritytech/substrate-up) scripts. To use these scripts, make sure you have completed the [Fast Installation](getting-started/installing-substrate.md#fast-installation) section.

> These scripts update from time to time, so before you run them locally, make sure they are up to date by running:
> ```bash
> git clone https://github.com/paritytech/substrate-up
> cd substrate-up
> cp -a substrate-* ~/.cargo/bin
> cp -a polkadot-* ~/.cargo/bin
> ```

## Initialize your node

There is a `substrate-node-new` script in `substrate-up` which downloads and compiles a copy of the **Template Node**. This gives you a ready-to-hack Substrate node with a template runtime module.

Run the `substrate-node-new` command with the following parameters:

```bash
substrate-node-new <node-name> <author>
```

Where:

* `<node-name>` is the name for your Substrate runtime. This is a _required_ parameter.

* `<author>` shows the people or team who maintains this node runtime. This is a _required_ parameter.

Once you run the `substrate-node-new` command, it will take a few minutes (depending on your hardware) to finish compilation.

## Start your node

Assume your node name is `demo-node`, run your node with following command:
```bash
cd demo-node
./target/release/demo-node --dev
```

You should be able to see outputs in terminal similar to following contents:
```text
2019-07-27 18:03:45 Substrate Node
2019-07-27 18:03:45   version 1.0.0-2857a44-x86_64-macos
2019-07-27 18:03:45   by demo-author, 2017, 2018
2019-07-27 18:03:45 Chain specification: Development
2019-07-27 18:03:45 Node name: safe-tin-6167
2019-07-27 18:03:45 Roles: AUTHORITY
2019-07-27 18:03:45 Initializing Genesis block/state (state: 0x79b0…3c01, header-hash: 0xacb5…bb17)
2019-07-27 18:03:45 Loaded block-time = 10 seconds from genesis on first-launch
2019-07-27 18:03:45 Best block: #0
2019-07-27 18:03:45 Using default protocol ID "sup" because none is configured in the chain specs
2019-07-27 18:03:45 Local node identity is: QmZH4oHKH4nwaP4apeYCM7EJXkxAjv4AqnJt29MrMNhWBV
2019-07-27 18:03:45 Libp2p => Random Kademlia query has yielded empty results
2019-07-27 18:03:46 Listening for new connections on 127.0.0.1:9944.
2019-07-27 18:03:46 Using authority key 5FA9nQDVg267DEd8m1ZypXLBnvN7SFxYwV7ndqSYGiN9TTpu
2019-07-27 18:03:48 Libp2p => Random Kademlia query has yielded empty results
2019-07-27 18:03:49 Accepted a new tcp connection from 127.0.0.1:62636.
2019-07-27 18:03:50 Starting consensus session on top of parent 0xacb55b52944dff23e2aa99326cc20b1f9c091556516d15db9ffcffd7d159bb17
2019-07-27 18:03:50 Prepared block for proposing at 1 [hash: 0x2d84be81477309b475af22c457f850174c498d1b0d19032f18fe7f7656233dad; parent_ha
sh: 0xacb5…bb17; extrinsics: [0xb1d4…9362]]
2019-07-27 18:03:50 Pre-sealed block for proposal at 1. Hash now 0x1d70dc9d4299519880cc5824cee49ffa0c5a74ec5a9bb238012ae5ff65055302, previ
ously 0x2d84be81477309b475af22c457f850174c498d1b0d19032f18fe7f7656233dad.
2019-07-27 18:03:50 Imported #1 (0x1d70…5302)
2019-07-27 18:03:50 Idle (0 peers), best: #1 (0x1d70…5302), finalized #0 (0xacb5…bb17), ⬇ 0 ⬆ 0
```
The outputs show us some important information like:
* Chain specification: `Development`. Here we are using build-in dev mode chain spec.
* Node identity: `QmZH4oHKH4nwaP4apeYCM7EJXkxAjv4AqnJt29MrMNhWBV`, will probably be different in your outputs.
* Authority key: `5FA9nQDVg267DEd8m1ZypXLBnvN7SFxYwV7ndqSYGiN9TTpu`, which is the validator's public key.
* WebSocket RPC endpoint: `127.0.0.1:9944`.
* Current block: `best: #1 (0x1d70…5302)`.
* Current finalized block: `finalized #0 (0xacb5…bb17)`. It always shows `0` because Template Node doesn't pre-include [GRANDPA finality gadget](https://wiki.polkadot.network/en/latest/polkadot/learn/consensus/#what-is-grandpababe).

> Substrate conforms the design of Polkadot's **hybrid consensus** which splits the finality gadget from the block production, refer [here](https://wiki.polkadot.network/en/latest/polkadot/learn/consensus/) for more information.

Now you already have a working "blockchain" maintained by only one node. Let's see how can we interact with it.

## Interact with your node

There is a pre-build [Polkadot/Substrate UI](https://github.com/polkadot-js/apps) to help you interact with Substrate blockchain. You can choose to use it in local machine by following its instruction, or simply visit this public host [web page](https://polkadot.js.org/apps).

In the **Settings** page, configure `remote node` to be `127.0.0.1:9944`. After saving the new configuration, you should be able to see other items in the sidebar. 

Go to **Extrinsics** page:
* choose `ALICE` account. This account is hard-coded in the genesis block configuration, automatically pre-funded with currency, and serves as a "super user" to your blockchain.
* configure **submit the following extrinsic** to be `template` `doSomething(something)`, 
* configure **something** to be any integer you want,
* click **Submit Transaction**. After a few seconds, you will notice the success events showing up.

Then, go to **Chain state** page:
* configure **selected state query** to be `template` `something(): Option<u32>`
* click the plus button, you should be able to see the number you just input.

Now you have interacted with your node successfully. Get yourself familiar with all the pages and enjoy your first blockchain!

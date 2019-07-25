---
title: "Initialize your blockchain"
---

Although Substrate has provided all the components to build a blockchain, as a developer you still need to assemble the pieces you needed. To ease the life for beginners, Substrate offers two kinds of build-in nodes to do the assembly work:
* [Template Node](https://github.com/paritytech/substrate/tree/v1.0/node-template): includes the minimum components to have a taste around blockchain.
* [Node](https://github.com/paritytech/substrate/tree/v1.0/node): includes most of the components to let you try all Substrate build-in features.
 
Here we are using **Template Node** with [`substrate-up`](https://github.com/paritytech/substrate-up) scripts. To use these scripts, make sure you have completed the [Fast Installation](getting-started/installing-substrate.md#fast-installation) section.

> Notes: These scripts update from time to time, so before you run them locally, make sure they are up to date by running:
> ```bash
> git clone https://github.com/paritytech/substrate-up
> cp -a substrate-up/substrate-* ~/.cargo/bin
> cp -a substrate-up/polkadot-* ~/.cargo/bin
> ```

## Initialize your new blockchain

There is a `substrate-node-new` script in `substrate-up` which downloads and compiles a copy of the **Template Node**. This gives you a ready-to-hack Substrate node with a template runtime module.

Run the `substrate-node-new` command with the following parameters:

```bash
substrate-node-new <node-name> <author>
```

Where:

* `<node-name>` is the name for your Substrate runtime. This is a _required_ parameter.

* `<author>` shows the people or team who maintains this node runtime. This is a _required_ parameter.

Once you run the `substrate-node-new` command, it will take a few minutes (depending on your hardware) to finish compilation.

> Notes: If you encounter any failure with dependency issue, have a look at this [issue](https://github.com/substrate-developer-hub/substrate-package/issues/9) TODO  

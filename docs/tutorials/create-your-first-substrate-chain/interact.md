---
title: Interacting with Your Node
---

Now that your node has finished compiling, let's show you how everything works out of the box.

## Starting Your Node

Run the following commands to start your node:

```bash
# Purge chain cleans up any old data from running a `dev` node in the past
# You will be prompted to type `y`
./target/release/node-template purge-chain --dev

# Run your actual node in "development" mode
./target/release/node-template --dev
```

You should see something like this if your node is running successfully:

```
$ ./target/release/node-template --dev

2020-07-24 18:58:37 Running in --dev mode, RPC CORS has been disabled.
2020-07-24 18:58:37 Substrate Node
2020-07-24 18:58:37 ✌️  version 2.0.0-rc5-3b3d098-x86_64-linux-gnu
2020-07-24 18:58:37 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-07-24 18:58:37 📋 Chain specification: Development
2020-07-24 18:58:37 🏷  Node name: rapid-north-7569
2020-07-24 18:58:37 👤 Role: AUTHORITY
2020-07-24 18:58:37 💾 Database: RocksDb at /home/parity/.local/share/node-template/chains/dev/db
2020-07-24 18:58:37 ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-07-24 18:58:38 🔨 Initializing Genesis block/state (state: 0xcd6c…da59, header-hash: 0x48c6…7b40)
2020-07-24 18:58:38 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-07-24 18:58:38 ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-07-24 18:58:38 📦 Highest known block at #0
2020-07-24 18:58:38 Using default protocol ID "sup" because none is configured in the chain specs
2020-07-24 18:58:38 🏷  Local node identity is: 12D3KooWCJV1L6dEdRxE9HQnYzrNb3zTui2nWeKBDZUKsEyp8Qt7 (legacy representation: Qmct61NrFJjCU4ACCAqZRgyR4gdtaUVuFSNTfXUC8tzCBT)
2020-07-24 18:58:38 〽️ Prometheus server started at 127.0.0.1:9615
2020-07-24 18:58:42 🙌 Starting consensus session on top of parent 0x48c610ed625f896bbc1b358c71f1b3fa00b37efbe4b7d3be4d1f9e21596f7b40
2020-07-24 18:58:42 🎁 Prepared block for proposing at 1 [hash: 0x00da96dcbcfecec889a28dccf8dc330cd7eb18075d2b567362d33a21bd9d9300; parent_hash: 0x48c6…7b40; extrinsics (1): [0x9a36…f631]]
2020-07-24 18:58:42 🔖 Pre-sealed block for proposal at 1. Hash now 0x6a90b5e8f2ef8f271dde10a0d48ec15879792fa3654a883add9cdf954d996a9a, previously 0x00da96dcbcfecec889a28dccf8dc330cd7eb18075d2b567362d33a21bd9d9300.
2020-07-24 18:58:42 ✨ Imported #1 (0x6a90…6a9a)
2020-07-24 18:58:43 💤 Idle (0 peers), best: #1 (0x6a90…6a9a), finalized #0 (0x48c6…7b40), ⬇ 0 ⬆ 0
2020-07-24 18:58:48 🙌 Starting consensus session on top of parent 0x6a90b5e8f2ef8f271dde10a0d48ec15879792fa3654a883add9cdf954d996a9a
2020-07-24 18:58:48 🎁 Prepared block for proposing at 2 [hash: 0xee1bb2c0127aeac6d381e31af51bc3a55a8f4c354cfb12a2d329a29e0ed7cd9e; parent_hash: 0x6a90…6a9a; extrinsics (1): [0x46bd…9dc0]]
2020-07-24 18:58:48 🔖 Pre-sealed block for proposal at 2. Hash now 0xdcd41fb9f39431a996fa2e06cfd8f48aad402830651613653c22d5d73f33087c, previously 0xee1bb2c0127aeac6d381e31af51bc3a55a8f4c354cfb12a2d329a29e0ed7cd9e.
2020-07-24 18:58:48 ✨ Imported #2 (0xdcd4…087c)
2020-07-24 18:58:48 💤 Idle (0 peers), best: #2 (0xdcd4…087c), finalized #0 (0x48c6…7b40), ⬇ 0 ⬆ 0
2020-07-24 18:58:53 💤 Idle (0 peers), best: #2 (0xdcd4…087c), finalized #0 (0x48c6…7b40), ⬇ 0 ⬆ 0
2020-07-24 18:58:54 🙌 Starting consensus session on top of parent 0xdcd41fb9f39431a996fa2e06cfd8f48aad402830651613653c22d5d73f33087c
2020-07-24 18:58:54 🎁 Prepared block for proposing at 3 [hash: 0x6b0e9d9c53714213e89bc76d55cc44f7bb7ede82a219ee050e6c8b80df7ddb1f; parent_hash: 0xdcd4…087c; extrinsics (1): [0xc30e…dfd5]]
2020-07-24 18:58:54 🔖 Pre-sealed block for proposal at 3. Hash now 0x606b6cf3e914916407f21a1d85ac7dcce91aa290588f80fe0a74d9953ea3dfd5, previously 0x6b0e9d9c53714213e89bc76d55cc44f7bb7ede82a219ee050e6c8b80df7ddb1f.
2020-07-24 18:58:54 ✨ Imported #3 (0x606b…dfd5)
2020-07-24 18:58:58 💤 Idle (0 peers), best: #3 (0x606b…dfd5), finalized #1 (0x6a90…6a9a), ⬇ 0 ⬆ 0
```

If the number after `finalized:` is increasing, your blockchain is producing new blocks and reaching
consensus about the state they describe!

## Start the Front-End

To interact with your local node, we will use
[the Substrate Developer Hub Front-End Template](https://github.com/substrate-developer-hub/substrate-front-end-template),
which is a collection of UI components that have been designed with common use cases in mind.

To get started with the Front-End Template, clone its repository and
[follow the simple steps to run it locally](https://github.com/substrate-developer-hub/substrate-front-end-template#using-the-template).

## Interact

Once the Front-End Template is running and loaded in your browser at
[http://localhost:8000/](http://localhost:8000/), take a moment to explore its components. At the
top, you will find lots of helpful information about the chain to which you're connected as well as
an account selector that will let you control the account you use to perform on-chain operations.

![Chain Data & Account Selector](assets/tutorials/first-chain/chain-data.png)

There is also a table that lists
[the well-known test accounts](../../knowledgebase/integrate/subkey#well-known-keys) that you have access to. Some,
like Alice and Bob, already have funds!

![Account Table](assets/tutorials/first-chain/accts-prefunded.png)

Beneath the account table there is a Transfer component that you can use to transfer funds from
one account to another. Take note of the info box that describes the precision used by the Front-End
Template; you should transfer at least `1000000000000` to make it easy for you to observe the
changes you're making.

![Balance Transfer](assets/tutorials/first-chain/apps-transfer.png)

Notice that the table of accounts is dynamic and that the account balances are updated as soon as
the transfer is processed.

### Runtime Metadata

The Front-End Template exposes many helpful features and you should explore all of them while you're
connected to a local development node. One good way to get started is by clicking the "Show
Metadata" button at the top of the template page and reviewing
[the metadata that your runtime exposes](../../knowledgebase/runtime/metadata).

![Metadata JSON](assets/tutorials/first-chain/metadata.png)

### Pallet Interactor & Events

You can use the runtime metadata to discover a runtime's capabilities. The Front-End Template
provides a helpful Pallet Interactor component that provides several mechanisms for interacting with
a Substrate runtime.

![Pallet Interactor & Events](assets/tutorials/first-chain/interactor-events.png)

[Extrinsics](../../knowledgebase/learn-substrate/extrinsics) are the runtime's callable functions; if you are
already familiar with blockchain concepts, you can think of them as transactions for now. The Pallet
Interactor allows you to submit [unsigned](../../knowledgebase/learn-substrate/extrinsics#unsigned-transactions) or
[signed](../../knowledgebase/learn-substrate/extrinsics#signed-transactions) extrinsics and also provides a button
that makes it easy to invoke an extrinsic by way of
[the `sudo` function from the Sudo pallet](https://substrate.dev/rustdocs/v2.0.0-rc5/pallet_sudo/enum.Call.html#variant.sudo).

You can select Query interactions to read
[the values present in your runtime's storage](../../knowledgebase/runtime/storage). The RPC and Constant options
provide additional mechanisms for runtime interaction.

Like many blockchains, Substrate chains use [events](../../knowledgebase/runtime/events) to report the results of
asynchronous operations. If you have already used the Front-End Template to perform a balance
transfer as described above, you should see an event for the transfer in the Event component next to
the Pallet Interactor.

## Next Steps

This is the end of your journey to launching your first blockchain with Substrate.

You have launched a working Substrate-based blockchain, attached a user interface to that chain, and
made token transfers among users. We hope you'll continue learning about Substrate.

Your next step may be:

- Decentralize your network with more nodes in the
  [Start a Private Network](../start-a-private-network/) tutorial.
- Add custom functionality in the [Build a dApp](../build-a-dapp/) tutorial.

If you experienced any issues with this tutorial or want to provide feedback, feel free to
[open a GitHub issue](https://github.com/substrate-developer-hub/tutorials/issues/new) or reach out
on [Riot](https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org).

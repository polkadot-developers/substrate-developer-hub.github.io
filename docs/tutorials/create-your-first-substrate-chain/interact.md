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

2020-06-10 11:55:17 Running in --dev mode, RPC CORS has been disabled.
2020-06-10 11:55:17 Substrate Node
2020-06-10 11:55:17 ✌️  version 2.0.0-rc3-7b4bbbc-x86_64-linux-gnu
2020-06-10 11:55:17 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-06-10 11:55:17 📋 Chain specification: Development
2020-06-10 11:55:17 🏷  Node name: scintillating-legs-6454
2020-06-10 11:55:17 👤 Role: AUTHORITY
2020-06-10 11:55:17 💾 Database: RocksDb at /home/dan/.local/share/node-template/chains/dev/db
2020-06-10 11:55:17 ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-06-10 11:55:17 🔨 Initializing Genesis block/state (state: 0x8304…c1cb, header-hash: 0xc90c…ab71)
2020-06-10 11:55:17 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-06-10 11:55:17 ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-06-10 11:55:17 📦 Highest known block at #0
2020-06-10 11:55:17 Using default protocol ID "sup" because none is configured in the chain specs
2020-06-10 11:55:17 🏷  Local node identity is: 12D3KooWMaPpCv7hp7wArmG6cAuyz8HXqD88zKNvVQ34CoCJsXmX (legacy representation: QmfHEbdmVZHCBwKJFvczRt5owAzEbtF7Ao7oPQLvBq645c)
2020-06-10 11:55:17 〽️ Prometheus server started at 127.0.0.1:9615
2020-06-10 11:55:18 🙌 Starting consensus session on top of parent 0xc90c17cdaf35c1959765037041a89ef8fd0aa7844e868c42329f9a23ed13ab71
2020-06-10 11:55:18 🎁 Prepared block for proposing at 1 [hash: 0x872efe1495dc97f8a56bee8d38eb7392c472f9fca1caa2f27575699c85859c8e; parent_hash: 0xc90c…ab71; extrinsics (1): [0xa37c…78a3]]
2020-06-10 11:55:18 🔖 Pre-sealed block for proposal at 1. Hash now 0x5e6e22a6dc07d9bc652d51fcf33b9547d7cee0b51c8f0bccf8407848599e6f18, previously 0x872efe1495dc97f8a56bee8d38eb7392c472f9fca1caa2f27575699c85859c8e.
2020-06-10 11:55:18 ✨ Imported #1 (0x5e6e…6f18)
2020-06-10 11:55:22 💤 Idle (0 peers), best: #1 (0x5e6e…6f18), finalized #0 (0xc90c…ab71), ⬇ 0 ⬆ 0
2020-06-10 11:55:24 🙌 Starting consensus session on top of parent 0x5e6e22a6dc07d9bc652d51fcf33b9547d7cee0b51c8f0bccf8407848599e6f18
2020-06-10 11:55:24 🎁 Prepared block for proposing at 2 [hash: 0xbeb4b804784d7e2b3b1e257838f79c156e8bf1490741612dce839745b635f050; parent_hash: 0x5e6e…6f18; extrinsics (1): [0x39f0…7b9b]]
2020-06-10 11:55:24 🔖 Pre-sealed block for proposal at 2. Hash now 0x89869e2ba9cbe1758233642edc202877aed329d0f85f72373703ac79ecee870d, previously 0xbeb4b804784d7e2b3b1e257838f79c156e8bf1490741612dce839745b635f050.
2020-06-10 11:55:24 ✨ Imported #2 (0x8986…870d)
2020-06-10 11:55:27 💤 Idle (0 peers), best: #2 (0x8986…870d), finalized #0 (0xc90c…ab71), ⬇ 0 ⬆ 0
2020-06-10 11:55:30 🙌 Starting consensus session on top of parent 0x89869e2ba9cbe1758233642edc202877aed329d0f85f72373703ac79ecee870d
2020-06-10 11:55:30 🎁 Prepared block for proposing at 3 [hash: 0xadcf0b9641bd1f26b69cefebf411e21827e7ed65278b281e5310d89484731ee2; parent_hash: 0x8986…870d; extrinsics (1): [0x7f7d…c90c]]
2020-06-10 11:55:30 🔖 Pre-sealed block for proposal at 3. Hash now 0x3b2ad852981a2f58c37db2b414589a35725f77ce84a67697c54a2b93e03547b2, previously 0xadcf0b9641bd1f26b69cefebf411e21827e7ed65278b281e5310d89484731ee2.
2020-06-10 11:55:30 ✨ Imported #3 (0x3b2a…47b2)
2020-06-10 11:55:32 💤 Idle (0 peers), best: #3 (0x3b2a…47b2), finalized #1 (0x5e6e…6f18), ⬇ 0 ⬆ 0
2020-06-10 11:55:36 🙌 Starting consensus session on top of parent 0x3b2ad852981a2f58c37db2b414589a35725f77ce84a67697c54a2b93e03547b2
2020-06-10 11:55:36 🎁 Prepared block for proposing at 4 [hash: 0x409ef58d3272976d04b1f6f5c56d3c54731f3ee707a16a608e9cbc228d37c5d8; parent_hash: 0x3b2a…47b2; extrinsics (1): [0x4f57…6010]]
2020-06-10 11:55:36 🔖 Pre-sealed block for proposal at 4. Hash now 0xe0619bdba8f6a53bd7f0ce28603500e68579ab1e02cd4886fe506667b1705731, previously 0x409ef58d3272976d04b1f6f5c56d3c54731f3ee707a16a608e9cbc228d37c5d8.
2020-06-10 11:55:36 ✨ Imported #4 (0xe061…5731)
2020-06-10 11:55:37 💤 Idle (0 peers), best: #4 (0xe061…5731), finalized #1 (0x5e6e…6f18), ⬇ 0 ⬆ 0
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
[the `sudo` function from the Sudo pallet](https://substrate.dev/rustdocs/v2.0.0-rc3/pallet_sudo/enum.Call.html#variant.sudo).

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

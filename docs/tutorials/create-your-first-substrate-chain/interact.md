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

2020-06-26 10:10:00 Running in --dev mode, RPC CORS has been disabled.
2020-06-26 10:10:00 Substrate Node
2020-06-26 10:10:00 ✌️  version 2.0.0-rc4-a704d36-x86_64-linux-gnu
2020-06-26 10:10:00 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-06-26 10:10:00 📋 Chain specification: Development
2020-06-26 10:10:00 🏷  Node name: bright-selection-0878
2020-06-26 10:10:00 👤 Role: AUTHORITY
2020-06-26 10:10:00 💾 Database: RocksDb at /home/dan/.local/share/node-template/chains/dev/db
2020-06-26 10:10:00 ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-06-26 10:10:00 🔨 Initializing Genesis block/state (state: 0xc478…295b, header-hash: 0x15b6…47b5)
2020-06-26 10:10:00 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-06-26 10:10:00 ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-06-26 10:10:00 📦 Highest known block at #0
2020-06-26 10:10:00 Using default protocol ID "sup" because none is configured in the chain specs
2020-06-26 10:10:00 🏷  Local node identity is: 12D3KooWMaPpCv7hp7wArmG6cAuyz8HXqD88zKNvVQ34CoCJsXmX (legacy representation: QmfHEbdmVZHCBwKJFvczRt5owAzEbtF7Ao7oPQLvBq645c)
2020-06-26 10:10:00 〽️ Prometheus server started at 127.0.0.1:9615
2020-06-26 10:10:05 💤 Idle (0 peers), best: #0 (0x15b6…47b5), finalized #0 (0x15b6…47b5), ⬇ 0 ⬆ 0
2020-06-26 10:10:06 🙌 Starting consensus session on top of parent 0x15b647de5cf3ec3b4e15159edf28345346fc29d3c646c509e6b8337b6c9b47b5
2020-06-26 10:10:06 🎁 Prepared block for proposing at 1 [hash: 0xf9b9cd1226bcbce4ef3f8802f9af1746d0243c471600bf2bec38e1c436ac9cd8; parent_hash: 0x15b6…47b5; extrinsics (1): [0xe7b0…f430]]
2020-06-26 10:10:06 🔖 Pre-sealed block for proposal at 1. Hash now 0x9a3af41c7e2d693c24245926d85dac96e09a1bef56d2faf254bc06d6b7d1192f, previously 0xf9b9cd1226bcbce4ef3f8802f9af1746d0243c471600bf2bec38e1c436ac9cd8.
2020-06-26 10:10:06 ✨ Imported #1 (0x9a3a…192f)
2020-06-26 10:10:10 💤 Idle (0 peers), best: #1 (0x9a3a…192f), finalized #0 (0x15b6…47b5), ⬇ 0 ⬆ 0
2020-06-26 10:10:12 🙌 Starting consensus session on top of parent 0x9a3af41c7e2d693c24245926d85dac96e09a1bef56d2faf254bc06d6b7d1192f
2020-06-26 10:10:12 🎁 Prepared block for proposing at 2 [hash: 0xac145cc0decaa0a574fd9e821a4d762e87491cff113659820f51af0f307870df; parent_hash: 0x9a3a…192f; extrinsics (1): [0x297c…9092]]
2020-06-26 10:10:12 🔖 Pre-sealed block for proposal at 2. Hash now 0x618c767c01a4e2fff92c04f8b581da5652595330a479e927bf1ee68c1295d0d7, previously 0xac145cc0decaa0a574fd9e821a4d762e87491cff113659820f51af0f307870df.
2020-06-26 10:10:12 ✨ Imported #2 (0x618c…d0d7)
2020-06-26 10:10:15 💤 Idle (0 peers), best: #2 (0x618c…d0d7), finalized #0 (0x15b6…47b5), ⬇ 0 ⬆ 0
2020-06-26 10:10:18 🙌 Starting consensus session on top of parent 0x618c767c01a4e2fff92c04f8b581da5652595330a479e927bf1ee68c1295d0d7
2020-06-26 10:10:18 🎁 Prepared block for proposing at 3 [hash: 0x5b21914d18523cbba295002b913e352ee7abb4e3cf670c202a701b83aa35b435; parent_hash: 0x618c…d0d7; extrinsics (1): [0x4c52…ea51]]
2020-06-26 10:10:18 🔖 Pre-sealed block for proposal at 3. Hash now 0xf6471c2e33e6d456d1ae2bd3feeb7de813dddecb8927d5b0c753cb38f2225c2d, previously 0x5b21914d18523cbba295002b913e352ee7abb4e3cf670c202a701b83aa35b435.
2020-06-26 10:10:18 ✨ Imported #3 (0xf647…5c2d)
2020-06-26 10:10:20 💤 Idle (0 peers), best: #3 (0xf647…5c2d), finalized #1 (0x9a3a…192f), ⬇ 0 ⬆ 0
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
[the `sudo` function from the Sudo pallet](https://substrate.dev/rustdocs/v2.0.0-rc4/pallet_sudo/enum.Call.html#variant.sudo).

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

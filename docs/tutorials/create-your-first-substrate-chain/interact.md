---
title: Interacting with Your Node
---

Now that your node has finished compiling, let's show you how everything works out of the box.

## Starting Your Node

Run the following commands to start your node:

```bash
# Run a temporary node in development mode
./target/release/node-template --dev --tmp
```

You should see something like this if your node is running successfully:

```
Sep 23 15:23:21.759  WARN Running in --dev mode, RPC CORS has been disabled.
Sep 23 15:23:21.759  INFO Substrate Node
Sep 23 15:23:21.759  INFO ✌️  version 2.0.0-24da767-x86_64-linux-gnu
Sep 23 15:23:21.759  INFO ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
Sep 23 15:23:21.759  INFO 📋 Chain specification: Development
Sep 23 15:23:21.759  INFO 🏷  Node name: unbiased-dress-7993
Sep 23 15:23:21.759  INFO 👤 Role: AUTHORITY
Sep 23 15:23:21.759  INFO 💾 Database: RocksDb at /tmp/substrate9CaTUC/chains/dev/db
Sep 23 15:23:21.759  INFO ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
Sep 23 15:23:22.549  INFO 🔨 Initializing Genesis block/state (state: 0x0971…6ec2, header-hash: 0x22e7…7290)
Sep 23 15:23:22.552  INFO 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
Sep 23 15:23:22.708  INFO ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
Sep 23 15:23:22.709  WARN Using default protocol ID "sup" because none is configured in the chain specs
Sep 23 15:23:22.709  INFO 🏷  Local node identity is: 12D3KooWB4SfTtXEEYbPHEdZPndkq1oTxExwx6ku1esPq3Pq9nwF (legacy representation: 12D3KooWB4SfTtXEEYbPHEdZPndkq1oTxExwx6ku1esPq3Pq9nwF)
Sep 23 15:23:22.935  INFO 📦 Highest known block at #0
Sep 23 15:23:22.937  INFO 〽️ Prometheus server started at 127.0.0.1:9615
Sep 23 15:23:22.940  INFO Listening for new connections on 127.0.0.1:9944.
Sep 23 15:23:24.178  INFO 🙌 Starting consensus session on top of parent 0x22e7a22d9745b5af63c11626498c08726e45b40b95abcd2092117b3337ff7290
Sep 23 15:23:24.281  INFO 🎁 Prepared block for proposing at 1 [hash: 0x515b6280f0d4536ee225a93f4ea56071b86d3bca8020487b2666060b0b739c41; parent_hash: 0x22e7…7290; extrinsics (1): [0x1783…fefe]]
Sep 23 15:23:24.384  INFO 🔖 Pre-sealed block for proposal at 1. Hash now 0x2aa4fb6eeba88eead4f2ea975d6827f3bbf5973e6be01077bd9c920a006d0098, previously 0x515b6280f0d4536ee225a93f4ea56071b86d3bca8020487b2666060b0b739c41.
Sep 23 15:23:24.386  INFO ✨ Imported #1 (0x2aa4…0098)
Sep 23 15:23:27.942  INFO 💤 Idle (0 peers), best: #1 (0x2aa4…0098), finalized #0 (0x22e7…7290), ⬇ 0 ⬆ 0
Sep 23 15:23:30.115  INFO 🙌 Starting consensus session on top of parent 0x2aa4fb6eeba88eead4f2ea975d6827f3bbf5973e6be01077bd9c920a006d0098
Sep 23 15:23:30.122  INFO 🎁 Prepared block for proposing at 2 [hash: 0x1692ea3bed6539b7268b14b35d4be319a32aac79aa709cc71d304722ca7766f4; parent_hash: 0x2aa4…0098; extrinsics (1): [0x0d1a…78da]]
Sep 23 15:23:30.203  INFO 🔖 Pre-sealed block for proposal at 2. Hash now 0x919fab4399075fb75e24005a4a63448e09174199fc073b4f3cd9d72782c46b8c, previously 0x1692ea3bed6539b7268b14b35d4be319a32aac79aa709cc71d304722ca7766f4.
Sep 23 15:23:30.205  INFO ✨ Imported #2 (0x919f…6b8c)
Sep 23 15:23:32.942  INFO 💤 Idle (0 peers), best: #2 (0x919f…6b8c), finalized #0 (0x22e7…7290), ⬇ 0 ⬆ 0
Sep 23 15:23:36.087  INFO 🙌 Starting consensus session on top of parent 0x919fab4399075fb75e24005a4a63448e09174199fc073b4f3cd9d72782c46b8c
Sep 23 15:23:36.094  INFO 🎁 Prepared block for proposing at 3 [hash: 0x0df26c2b2559bfb11c6d1be63005b0f4408468de3dfef7957df86b95cfb68473; parent_hash: 0x919f…6b8c; extrinsics (1): [0x1079…1874]]
Sep 23 15:23:36.178  INFO 🔖 Pre-sealed block for proposal at 3. Hash now 0xb6dca495b5530ca8c97d1d3de8eb71fc945e5b367e219c26164d94e77954b583, previously 0x0df26c2b2559bfb11c6d1be63005b0f4408468de3dfef7957df86b95cfb68473.
Sep 23 15:23:36.180  INFO ✨ Imported #3 (0xb6dc…b583)
Sep 23 15:23:37.942  INFO 💤 Idle (0 peers), best: #3 (0xb6dc…b583), finalized #1 (0x2aa4…0098), ⬇ 0 ⬆ 0
```

If the number after `finalized:` is increasing, your blockchain is producing new blocks and reaching
consensus about the state they describe!

## Start the Front-End

To interact with your local node, we will use
[the Substrate Developer Hub Front-End Template](https://github.com/substrate-developer-hub/substrate-front-end-template),
which is a collection of UI components that have been designed with common use cases in mind.

You already installed the Front-End Template; launch it by executing the following command in the
root directory of the Front-End Template:

```bash
# Make sure to run this command in the root directory of the Front-End Template
yarn start
```

## Interact

Once the Front-End Template is running and loaded in your browser at
[http://localhost:8000/](http://localhost:8000/), take a moment to explore its components. At the
top, you will find lots of helpful information about the chain to which you're connected as well as
an account selector that will let you control the account you use to perform on-chain operations.

![Chain Data & Account Selector](assets/tutorials/first-chain/chain-data.png)

There is also a table that lists
[the well-known test accounts](../../knowledgebase/integrate/subkey#well-known-keys) that you have
access to. Some, like Alice and Bob, already have funds!

![Account Table](assets/tutorials/first-chain/accts-prefunded.png)

Beneath the account table there is a Transfer component that you can use to transfer funds from one
account to another. Take note of the info box that describes the precision used by the Front-End
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

[Extrinsics](../../knowledgebase/learn-substrate/extrinsics) are the runtime's callable functions;
if you are already familiar with blockchain concepts, you can think of them as transactions for now.
The Pallet Interactor allows you to submit
[unsigned](../../knowledgebase/learn-substrate/extrinsics#unsigned-transactions) or
[signed](../../knowledgebase/learn-substrate/extrinsics#signed-transactions) extrinsics and also
provides a button that makes it easy to invoke an extrinsic by way of
[the `sudo` function from the Sudo pallet](https://substrate.dev/rustdocs/v2.0.0/pallet_sudo/enum.Call.html#variant.sudo).
You will learn more about using the "SUDO" button to invoke privileged extrinsics in the third
tutorial, the [Add a Pallet](../add-a-pallet) tutorial.

You can select Query interactions to read
[the values present in your runtime's storage](../../knowledgebase/runtime/storage). The RPC and
Constant options provide additional mechanisms for runtime interaction.

Like many blockchains, Substrate chains use [events](../../knowledgebase/runtime/events) to report
the results of asynchronous operations. If you have already used the Front-End Template to perform a
balance transfer as described above, you should see an event for the transfer in the Event component
next to the Pallet Interactor.

## Next Steps

This is the end of your journey to launching your first blockchain with Substrate.

You have launched a working Substrate-based blockchain, attached a user interface to that chain, and
made token transfers among users. We hope you'll continue learning about Substrate.

Your next step may be:

- Extend the features of the template node in the [Add a Pallet](../add-a-pallet) tutorial.
- Learn about forkless runtime upgrades in the [Upgrade a Chain](../upgrade-a-chain) tutorial.

If you experienced any issues with this tutorial or want to provide feedback, You can
[ask a question on Stack Overflow](https://stackoverflow.com/questions/tagged/substrate) and use the
`substrate` tag or contact us on
[Element](https://app.element.io/#/room/!HzySYSaIhtyWrwiwEV:matrix.org).

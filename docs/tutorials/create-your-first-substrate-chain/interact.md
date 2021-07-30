---
title: Interacting with Your Node
---

Now that your node has finished compiling, let's show you how everything works out of the box.

## Starting Your Node

Run the following command to start your node:

```bash
# Run a temporary node in development mode
./target/release/node-template --dev --tmp
```

Note the flags:
- `--dev` this sets up a developer node [chain specification](../../knowledgebase/integrate/chain-spec)
- `--tmp` this saves all active data for the node (keys, blockchain database, networking info, ...)
and is deleted as soon as you properly terminate your node (using <kbd>ctrl</kbd>+<kbd>c</kbd>). So every time you start with this command, you will have a clean state to work from. If the node is killed, `/tmp` is cleaned automatically on the restart of your
computer for linux based OSs, and these files can manually be removed if needed.

With this command, you should see something like this if your node is running successfully:

```bash
2021-03-16 10:56:51  Running in --dev mode, RPC CORS has been disabled.
2021-03-16 10:56:51  Substrate Node
2021-03-16 10:56:51  ✌️  version 3.0.0-8370ddd-x86_64-linux-gnu
2021-03-16 10:56:51  ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2021
2021-03-16 10:56:51  📋 Chain specification: Development
2021-03-16 10:56:51  🏷 Node name: few-size-5380
2021-03-16 10:56:51  👤 Role: AUTHORITY
2021-03-16 10:56:51  💾 Database: RocksDb at /tmp/substrateP1jD7H/chains/dev/db
2021-03-16 10:56:51  ⛓  Native runtime: node-template-100 (node-template-1.tx1.au1)
2021-03-16 10:56:51  🔨 Initializing Genesis block/state (state: 0x17df…04a0, header-hash: 0xc43b…ed16)
2021-03-16 10:56:51  👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2021-03-16 10:56:51  ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2021-03-16 10:56:51  Using default protocol ID "sup" because none is configured in the chain specs
2021-03-16 10:56:51  🏷 Local node identity is: 12D3KooWQdU84EJCqDr4aqfhb7dxXU2fzd6i2Rn1XdNtsiM5jvEC
2021-03-16 10:56:51  📦 Highest known block at #0
2021-03-16 10:56:51  〽️ Prometheus server started at 127.0.0.1:9615
2021-03-16 10:56:51  Listening for new connections on 127.0.0.1:9944.
2021-03-16 10:56:54  🙌 Starting consensus session on top of parent 0xc43b4514877d7dcfff2459cdfe609a96cf8e9b9723589635d7215de6bf00ed16
2021-03-16 10:56:54  🎁 Prepared block for proposing at 1 [hash: 0x255bcf44df92dd4ccaca15d92d4a3db9d276e42843e21ab0cc840e207b2649d6; parent_hash: 0xc43b…ed16; extrinsics (1): [0x02bf…2cbd]]
2021-03-16 10:56:54  🔖 Pre-sealed block for proposal at 1. Hash now 0x9c14d9caccc37f8142fc348d184fb4bd8a8bc217a8979493d7f46d4220775616, previously 0x255bcf44df92dd4ccaca15d92d4a3db9d276e42843e21ab0cc840e207b2649d6.
2021-03-16 10:56:54  ✨ Imported #1 (0x9c14…5616)
2021-03-16 10:56:54  🙌 Starting consensus session on top of parent 0x9c14d9caccc37f8142fc348d184fb4bd8a8bc217a8979493d7f46d4220775616
2021-03-16 10:56:54  🎁 Prepared block for proposing at 2 [hash: 0x6cd4bd9d2a531750c10610bdaa5af0075745b6612ffa3623c14d699250b4e732; parent_hash: 0x9c14…5616; extrinsics (1): [0x3cc8…b8d9]]
2021-03-16 10:56:54  🔖 Pre-sealed block for proposal at 2. Hash now 0x05bd3317b51d717163dfa8847369d7f697c6180868c29f02d0b7ff79c5bbde3f, previously 0x6cd4bd9d2a531750c10610bdaa5af0075745b6612ffa3623c14d699250b4e732.
2021-03-16 10:56:54  ✨ Imported #2 (0x05bd…de3f)
2021-03-16 10:56:56  💤 Idle (0 peers), best: #2 (0x05bd…de3f), finalized #0 (0xc43b…ed16), ⬇ 0 ⬆ 0
2021-03-16 10:57:00  🙌 Starting consensus session on top of parent 0x05bd3317b51d717163dfa8847369d7f697c6180868c29f02d0b7ff79c5bbde3f
2021-03-16 10:57:00  🎁 Prepared block for proposing at 3 [hash: 0xa6990964cf4f184edc08acd61c3c01ac8975abbba6d42f4eec3f9658097aec04; parent_hash: 0x05bd…de3f; extrinsics (1): [0xd6ed…86a5]]
2021-03-16 10:57:00  🔖 Pre-sealed block for proposal at 3. Hash now 0xbe07e322ca525e580a3703637db191c6df091b0242a411b88fa0c43ef0ac31f8, previously 0xa6990964cf4f184edc08acd61c3c01ac8975abbba6d42f4eec3f9658097aec04.
2021-03-16 10:57:00  ✨ Imported #3 (0xbe07…31f8)
2021-03-16 10:57:01  💤 Idle (0 peers), best: #3 (0xbe07…31f8), finalized #1 (0x9c14…5616), ⬇ 0 ⬆ 0
```

If the number after `finalized:` is increasing, your blockchain is producing new blocks and reaching
consensus about the state they describe!

A few notes on the example output above:
- `💾 Database: RocksDb at /tmp/substrateP1jD7H/chains/dev/db` : where chain data is being written
- `🏷 Local node identity is: 12D3KooWQdU84EJCqDr4aqfhb7dxXU2fzd6i2Rn1XdNtsiM5jvEC`: the node ID
needed if you intend to connect to other nodes directly (more in the
[private network tutorial](../start-a-private-network/index))

> While not critical now, please do read all the startup logs for your node, as they help inform you
> of key configuration information as you continue to learn and move past these first basic tutorials.

## Start the Front-End Template

To interact with your local node, we will use
[the Substrate Developer Hub Front-End Template](https://github.com/substrate-developer-hub/substrate-front-end-template),
which is a collection of UI components that have been designed with common use cases in mind.

> Be sure to use the correct version of the template for the version of substrate you are using
> as [major versions](https://semver.org/) are _not_ expected to be interoperable!

You already installed the Front-End Template; let's launch it by executing the following command
in the root directory of the Front-End Template:

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
changes you're making. Here we give the `dave` development account these funds:

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
[the `sudo` function from the Sudo pallet](https://substrate.dev/rustdocs/latest/pallet_sudo/enum.Call.html#variant.sudo).
You can learn more about using the "SUDO" button to invoke privileged extrinsics in the [Add a Pallet](../add-a-pallet) tutorial.

You can select Query interactions to read
[the values present in your runtime's storage](../../knowledgebase/runtime/storage). The RPC and
Constant options provide additional mechanisms for runtime interaction.

Like many blockchains, Substrate chains use [events](../../knowledgebase/runtime/events) to report
the results of asynchronous operations. If you have already used the Front-End Template to perform a
balance transfer as described above, you should see an event for the transfer in the Event component
next to the Pallet Interactor.

## Next Steps

🎉 Congratulations!!! 🎉

You have launched a working Substrate-based blockchain, attached a user interface to that chain, and
made token transfers among users. We hope you'll continue learning about Substrate!

Your next step may be:

- Extend the features of the template node in the [Add a Pallet](../add-a-pallet) tutorial.
- Learn about forkless runtime upgrades in the [Forkless Upgrade a Chain](../forkless-upgrade) tutorial.

If you experienced any issues with this tutorial or want to provide feedback, You can
[ask a question on Stack Overflow](https://stackoverflow.com/questions/tagged/substrate) and use the
`substrate` tag or contact us on
[Element](https://matrix.to/#/#substrate-technical:matrix.org).

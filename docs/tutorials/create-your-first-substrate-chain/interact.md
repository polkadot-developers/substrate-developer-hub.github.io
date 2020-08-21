---
title: Interacting with Your Node
---

Now that your node has finished compiling, let's show you how everything works out of the box.

## Starting Your Node

Run the following commands to start your node:

```bash
# Clean up any old data from running a development node in the past
# You will be prompted to type `y`
./target/release/node-template purge-chain --dev

# Run the node in development mode
./target/release/node-template --dev
```

You should see something like this if your node is running successfully:

```
2020-08-20 15:49:19.045 main WARN sc_cli::commands::run_cmd  Running in --dev mode, RPC CORS has been disabled.
2020-08-20 15:49:19.045 main INFO sc_cli::runner  Substrate Node
2020-08-20 15:49:19.045 main INFO sc_cli::runner  ✌️  version 2.0.0-rc6-8682ee4-x86_64-linux-gnu
2020-08-20 15:49:19.045 main INFO sc_cli::runner  ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-08-20 15:49:19.045 main INFO sc_cli::runner  📋 Chain specification: Development
2020-08-20 15:49:19.045 main INFO sc_cli::runner  🏷  Node name: utopian-quicksand-7565
2020-08-20 15:49:19.045 main INFO sc_cli::runner  👤 Role: AUTHORITY
2020-08-20 15:49:19.045 main INFO sc_cli::runner  💾 Database: RocksDb at /home/parity/.local/share/node-template/chains/dev/db
2020-08-20 15:49:19.045 main INFO sc_cli::runner  ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-08-20 15:49:19.190 main INFO sc_service::client::client  🔨 Initializing Genesis block/state (state: 0x49ff…ef9d, header-hash: 0x82e1…0111)
2020-08-20 15:49:19.190 main INFO afg  👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-08-20 15:49:19.206 main INFO sc_consensus_slots  ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-08-20 15:49:19.207 main WARN sc_service::builder  Using default protocol ID "sup" because none is configured in the chain specs
2020-08-20 15:49:19.207 main INFO sub-libp2p  🏷  Local node identity is: 12D3KooWCJV1L6dEdRxE9HQnYzrNb3zTui2nWeKBDZUKsEyp8Qt7 (legacy representation: Qmct61NrFJjCU4ACCAqZRgyR4gdtaUVuFSNTfXUC8tzCBT)
2020-08-20 15:49:19.215 main INFO sc_service::builder  📦 Highest known block at #0
2020-08-20 15:49:19.215 tokio-runtime-worker INFO substrate_prometheus_endpoint::known_os  〽️ Prometheus server started at 127.0.0.1:9615
2020-08-20 15:49:24.020 tokio-runtime-worker INFO sc_basic_authorship::basic_authorship  🙌 Starting consensus session on top of parent 0x82e1dd371de05f76116ee0039430dcd218c77c473f450a9f4a6b58b101ad0111
2020-08-20 15:49:24.035 tokio-blocking-driver INFO sc_basic_authorship::basic_authorship  🎁 Prepared block for proposing at 1 [hash: 0x7c3867c27cc0901ed6e8421270afaedb3d5614214d78b69f294aef263bd7861a; parent_hash: 0x82e1…0111; extrinsics (1): [0xe371…f93b]]
2020-08-20 15:49:24.044 tokio-runtime-worker INFO sc_consensus_slots  🔖 Pre-sealed block for proposal at 1. Hash now 0x50455c95a01e645e3f754f49629f2687f72d547c64cd35910f199d05530bbf54, previously 0x7c3867c27cc0901ed6e8421270afaedb3d5614214d78b69f294aef263bd7861a.
2020-08-20 15:49:24.045 tokio-runtime-worker INFO substrate  ✨ Imported #1 (0x5045…bf54)
2020-08-20 15:49:24.216 tokio-runtime-worker INFO substrate  💤 Idle (0 peers), best: #1 (0x5045…bf54), finalized #0 (0x82e1…0111), ⬇ 0 ⬆ 0
2020-08-20 15:49:29.217 tokio-runtime-worker INFO substrate  💤 Idle (0 peers), best: #1 (0x5045…bf54), finalized #0 (0x82e1…0111), ⬇ 0 ⬆ 0
2020-08-20 15:49:30.006 tokio-runtime-worker INFO sc_basic_authorship::basic_authorship  🙌 Starting consensus session on top of parent 0x50455c95a01e645e3f754f49629f2687f72d547c64cd35910f199d05530bbf54
2020-08-20 15:49:30.007 tokio-blocking-driver INFO sc_basic_authorship::basic_authorship  🎁 Prepared block for proposing at 2 [hash: 0xb608e0291490a9af5cfaa5f8fd318af661935666ebc88152f05b5b2f828b31c3; parent_hash: 0x5045…bf54; extrinsics (1): [0xc797…a8e0]]
2020-08-20 15:49:30.012 tokio-runtime-worker INFO sc_consensus_slots  🔖 Pre-sealed block for proposal at 2. Hash now 0xc4276103ee9595e25e4b4ef2a2a5684ca1cbabfc4a3c1545a1fe5ad1f70fd4f6, previously 0xb608e0291490a9af5cfaa5f8fd318af661935666ebc88152f05b5b2f828b31c3.
2020-08-20 15:49:30.012 tokio-runtime-worker INFO substrate  ✨ Imported #2 (0xc427…d4f6)
2020-08-20 15:49:34.217 tokio-runtime-worker INFO substrate  💤 Idle (0 peers), best: #2 (0xc427…d4f6), finalized #0 (0x82e1…0111), ⬇ 0 ⬆ 0
2020-08-20 15:49:36.008 tokio-runtime-worker INFO sc_basic_authorship::basic_authorship  🙌 Starting consensus session on top of parent 0xc4276103ee9595e25e4b4ef2a2a5684ca1cbabfc4a3c1545a1fe5ad1f70fd4f6
2020-08-20 15:49:36.010 tokio-blocking-driver INFO sc_basic_authorship::basic_authorship  🎁 Prepared block for proposing at 3 [hash: 0xf6c5aac59e1c034e0fc65d7ccdc18df0a12d8cbc71660520e322542c940ba8f9; parent_hash: 0xc427…d4f6; extrinsics (1): [0xeeb9…f554]]
2020-08-20 15:49:36.018 tokio-runtime-worker INFO sc_consensus_slots  🔖 Pre-sealed block for proposal at 3. Hash now 0x751b14ef67fcb64adc47fe31912facdc748032a4f3f87f1795769a1bce94d07c, previously 0xf6c5aac59e1c034e0fc65d7ccdc18df0a12d8cbc71660520e322542c940ba8f9.
2020-08-20 15:49:36.019 tokio-runtime-worker INFO substrate  ✨ Imported #3 (0x751b…d07c)
2020-08-20 15:49:39.217 tokio-runtime-worker INFO substrate  💤 Idle (0 peers), best: #3 (0x751b…d07c), finalized #1 (0x5045…bf54), ⬇ 0 ⬆ 0
```

If the number after `finalized:` is increasing, your blockchain is producing new blocks and reaching
consensus about the state they describe!

## Start the Front-End

To interact with your local node, we will use
[the Substrate Developer Hub Front-End Template](https://github.com/substrate-developer-hub/substrate-front-end-template),
which is a collection of UI components that have been designed with common use cases in mind.

You already installed the Front-End Template; launch it be executing the following command in the
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
[the `sudo` function from the Sudo pallet](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_sudo/enum.Call.html#variant.sudo).
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

- Add custom functionality in the [Build a dApp](../build-a-dapp/) tutorial.
- Decentralize your network with more nodes in the
  [Start a Private Network](../start-a-private-network/) tutorial.

If you experienced any issues with this tutorial or want to provide feedback, You can
[ask a question on Stack Overflow](https://stackoverflow.com/questions/tagged/substrate) and use the
`substrate` tag or contact us on
[Element](https://app.element.io/#/room/!HzySYSaIhtyWrwiwEV:matrix.org).

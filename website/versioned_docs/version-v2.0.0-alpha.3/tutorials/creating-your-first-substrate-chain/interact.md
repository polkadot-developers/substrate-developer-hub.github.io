---
title: Interacting with Your Node
id: version-v2.0.0-alpha.3-interact
original_id: interact
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

2020-03-11 07:42:55 Running in --dev mode, RPC CORS has been disabled.
2020-03-11 07:42:55 Substrate Node
2020-03-11 07:42:55   version 2.0.0-alpha.3-5b41f0b-x86_64-linux-gnu
2020-03-11 07:42:55   by Anonymous, 2017-2020
2020-03-11 07:42:55 Chain specification: Development
2020-03-11 07:42:55 Node name: deranged-faucet-4432
2020-03-11 07:42:55 Roles: AUTHORITY
2020-03-11 07:42:55 Initializing Genesis block/state (state: 0x3e8a…1c6b, header-hash: 0x1990…e24d)
...
2020-03-11 07:43:00 Imported #1 (0x857f…9b4e)
2020-03-11 07:43:00 Idle (0 peers), best: #1 (0x857f…9b4e), finalized #0 (0x1990…e24d), ⬇ 0 ⬆ 0
2020-03-11 07:43:05 Idle (0 peers), best: #1 (0x857f…9b4e), finalized #0 (0x1990…e24d), ⬇ 0 ⬆ 0
2020-03-11 07:43:06 Starting consensus session on top of parent 0x857f7b9091f37926a67c403ef0a19fdb31b31491dbc1d2a5e70c000f23c99b4e
2020-03-11 07:43:06 Prepared block for proposing at 2 [hash: 0xf2b6f619c42824690c39c022af815fd59e7497b7ca321cf866bd9a16aed75ae7; parent_hash: 0x857f…9b4e; extrinsics (1): [0x5283…d9f3]]
2020-03-11 07:43:06 Pre-sealed block for proposal at 2. Hash now 0x4db38cd7afa731a88cd0cf963de1bf728d8cee96ea5db1718b7c32121aa286a6, previously 0xf2b6f619c42824690c39c022af815fd59e7497b7ca321cf866bd9a16aed75ae7.
2020-03-11 07:43:06 Imported #2 (0x4db3…86a6)
```

If the number after `best:` is increasing, your blockchain is producing new blocks!

## Start the Front End

To interact with the local node we will use the Polkadot-js Apps user interface, often known as
"Apps" for short. Despite the name, Apps will work with any Substrate-based blockchain including ours, not just Polkadot.

In your web browser, navigate to [https://polkadot.js.org/apps](https://polkadot.js.org/apps/#/settings?rpc=ws://127.0.0.1:9944).

On the `Settings` tab ensure that you are connected to a `Local Node` or `ws://127.0.0.1:9944`.

> Some browsers, notably Firefox, will not connect to a local node from an https website. An easy work around is to try another browser, like Chromium. Another option is to [host this interface locally](https://github.com/polkadot-js/apps#development).

## Interact

Select the **Accounts** tab, you will see test accounts that you have access to. Some, like Alice
and Bob, already have funds!

![Apps UI with pre-funded accounts](assets/tutorials/first-chain/apps-prefunded.png)

You can try to transfer some funds from Alice to Charlie by clicking the "send" button.

![Balance Transfer](assets/tutorials/first-chain/apps-transfer.png)

If everything went successfully, you should see some popup notifications claiming "Extrinsic
Success", and of course Charlie's balance will increase.

## Create Your Own Account

You can create your own account by selecting the `+ Add Account` button. It won't have any tokens
yet, but you can send some from Alice or any other pre-funded account. Only you will (and your
browser) will know the private key for your own account which means nobody can transfer those tokens
except you.

## Next Steps

This is the end of your journey to launching your first blockchain with Substrate.

You have launched a working Substrate-based blockchain, attached a user interface to that chain, and made token transfers among users. We hope you'll continue learning about Substrate.

Your next step may be:

* Decentralize your network with more nodes in the [Start a Private Network](tutorials/start-a-private-network/index.md) tutorial.
* Add custom functionality in the [Build a dApp](tutorials/build-a-dapp/index.md) tutorial.

If you experienced any issues with this tutorial or want to provide feedback, feel free to [open a
GitHub
issue](https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/issues/new) or reach out on [Riot](https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org).

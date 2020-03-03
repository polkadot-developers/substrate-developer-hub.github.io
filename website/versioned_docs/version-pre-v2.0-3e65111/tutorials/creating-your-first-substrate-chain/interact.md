---
title: Interacting with Your Node
id: version-pre-v2.0-3e65111-interact
original_id: interact
---

Now that your node has finished compiling, let's show you how everything works out of the box.

## Starting Your Node

Run the following commands to start your node:

```bash
cd substrate-node-template/
# Purge chain cleans up any old data from running a `dev` node in the past
# You will be prompted to type `y`
./target/release/node-template purge-chain --dev
# Run your actual node in "developer" mode
./target/release/node-template --dev
```

You should see something like this if your node is running successfully:

```bash
$ ./target/release/node-template --dev

2019-09-05 15:57:27 Running in --dev mode, RPC CORS has been disabled.
2019-09-05 15:57:27 Substrate Node
2019-09-05 15:57:27   version 2.0.0-b6bfc95-x86_64-macos
2019-09-05 15:57:27   by Anonymous, 2017, 2018
2019-09-05 15:57:27 Chain specification: Development
2019-09-05 15:57:27 Node name: unwieldy-skate-4685
2019-09-05 15:57:27 Roles: AUTHORITY
2019-09-05 15:57:27 Initializing Genesis block/state (state: 0x26bd…7093, header-hash: 0xbf06…58a9)
...
2019-09-05 15:57:30 Imported #1 (0x9f41…e673)
2019-09-05 15:57:32 Idle (0 peers), best: #1 (0x9f41…e673), finalized #1 (0x9f41…e673), ⬇ 0 ⬆ 0
2019-09-05 15:57:37 Idle (0 peers), best: #1 (0x9f41…e673), finalized #1 (0x9f41…e673), ⬇ 0 ⬆ 0
```

If the number after `best:` is increasing, your blockchain is producing new blocks!

## Start the Front End

To interact with the local node we will use the Polkadot-js Apps user interface, often known as
"Apps" for short. Despite the name, Apps will work with any Substrate-based blockchain including ours, not just Polkadot.

In your web browser, navigate to [https://polkadot.js.org/apps](https://polkadot.js.org/apps/#/settings?rpc=ws://127.0.0.1:9944).

On the `Settings` tab ensure that you are connected to a `Local Node`.

> Some browsers, notably Firefox, will not connect to a local node from an https website. An easy work around is to try another browser, like Chromium. Another option is to [host this interface locally](https://github.com/polkadot-js/apps#development).

## Interact

Select the **Accounts** tab, you will see test accounts that you have access to. Some, like Alice
and Bob, already have funds!

![Apps UI with pre-funded accounts](assets/tutorials/first-chain/apps-prefunded.png)

You can try to transfer some funds from Alice to Charlie by clicking the "send" button.

![Balance Transfer](assets/tutorials/first-chain/apps-transfer.png)

If everything went successfully, you should see some popup notifications claiming "Extrinsic
Success", and of course Charlie's balance will increase.

## Next Steps

This is the end of your journey to launching your first blockchain with Substrate.

You have launched a working Substrate-based blockchain, with an underlying cryptocurrency, attached a user interface to that chain, and made token transfers among users. We hope you'll continue learning about Substrate.

Your next step may be:

* Decentralize your network with more nodes in the [Start a Private Network](tutorials/start-a-private-network/index.md) tutorial.
* Add custom functionality in the [Build a dApp](tutorials/build-a-dapp/index.md) tutorial.

If you experienced any issues with this tutorial or want to provide feedback, feel free to [open a
GitHub
issue](https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/issues/new) with
your thoughts.

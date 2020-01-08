---
title: Interacting with Your Node
id: version-pre-2.0-interact
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

Your blockchain is producing new blocks!

## Start Your Front-End

To interact with the local node via the front-end template, start the
`substrate-front-end-template`.

Open another terminal in your working folder and run the following:

```bash
cd substrate-front-end-template/
# Install the Node.JS dependencies
yarn install
# Start a local web server
yarn start
```

You should then be able to navigate to [`localhost:8000`](http://localhost:8000/) where you will see
a simple front-end showing that your Substrate node is running and connected!

## Interact

If you look at the **Balances** component, you will see test accounts which you have access to. Some
like Alice and Bob already have funds!

![Front End Template](assets/front-end-template.png)

You can try to transfer some funds from Alice to Charlie using the **Transfer** component.

```
Selected Account: Alice
To: 5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y
Amount: 1000
```

![Balance Transfer](assets/front-end-template-balance-transfer.png)

If everything went successfully, you should see some notifications in the **Events** component, and
of course Charlie's balance will now be `1000`.

Already you have a working blockchain, with an underlying cryptocurrency. You are able to make
transfers easily with a simple, interactive front-end.

Now let's build our Proof of Existence pallet!

> **Note:** If you want to stop your node or front-end, you can press `ctrl + c` in the terminal.

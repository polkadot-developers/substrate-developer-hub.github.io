---
title: Alice and Bob Start Blockchain
---

Before we generate our own keys, and start a truly unique Substrate network, let's learn the
fundamentals by starting with a pre-defined network specification called `local` with two
pre-defined (and definitely not private!) keys known as Alice and Bob.

> This portion of the tutorial should be run on a single workstation with a single Substrate binary.
> If you've followed the tutorial up to this point, you have the correct setup.

## Alice Starts First

Alice (or whomever is playing her) should run these commands from node-template repository root.

> Here we've explicitly shown the `purge-chain` command. In the future we will omit this You should
> purge old chain data any time you're trying to start a new network.

```bash
# Purge any chain data from previous runs
# You will be prompted to type `y`
./target/release/node-template purge-chain --base-path /tmp/alice --chain local
```

```bash
# Start Alice's node
./target/release/node-template \
  --base-path /tmp/alice \
  --chain local \
  --alice \
  --port 30333 \
  --ws-port 9944 \
  --rpc-port 9933 \
  --telemetry-url 'ws://telemetry.polkadot.io:1024 0' \
  --validator
```

Let's look at those flags in detail:

| <div style="min-width:110pt"> Flags </div> | Descriptions                                                                                                                                                                                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--base-path`     | Specifies a directory where Substrate should store all the data related to this chain. If the directory does not exist it will be created for you. If other blockchain data already exists there you will get an error. Either clear the directory or choose a different one. If this value is not specified, a default path will be used. |
| `--chain local`   | Specifies which chain specification to use. There are a few pre-packaged options including `local`, `development`, and `staging` but generally one specifies their own chainspec file. We'll specify our own file in a later step.                                                                                                         |
| `--alice`         | Puts the pre-defined Alice keys (both for block production and finalization) in the node's keystore. Generally one should generate their own keys and insert them with an RPC call. We'll generate our own keys in a later step. This flag also makes Alice a validator.                                                                   |
| `--port 30333`    | Specifies the port that your node will listen for p2p traffic on. `30333` is the default and this flag can be omitted if you're happy with the default. If Bob's node will run on the same physical system, you will need to explicitly specify a different port for it.                                                                   |
| `--ws-port 9944`  | Specifies the port that your node will listen for incoming web socket traffic on. `9944` is the default, so it can also be omitted.                                                                                                                                                                                                        |
| `--rpc-port 9933` | Specifies the port that your node will listen for incoming RPC traffic on. `9933` is the default, so it can also be omitted.                                                                                                                                                                                                               |
| `--telemetry-url` | Tells the node to send telemetry data to a particular server. The one we've chosen here is hosted by Parity and is available for anyone to use. You may also host your own (beyond the scope of this article) or omit this flag entirely.                                                                                                  |
| `--validator`     | Means that we want to participate in block production and finalization rather than just sync the network.                                                                                                                                                                                                                                  |

When the node starts you should see output similar to this.

```
2020-05-28 13:09:30 Substrate Node
2020-05-28 13:09:30 ✌️  version 2.0.0-rc2-83d7157-x86_64-linux-gnu
2020-05-28 13:09:30 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-05-28 13:09:30 📋 Chain specification: Local Testnet
2020-05-28 13:09:30 🏷  Node name: Alice
2020-05-28 13:09:30 👤 Role: AUTHORITY
2020-05-28 13:09:30 💾 Database: RocksDb at /tmp/alice/chains/local_testnet/db
2020-05-28 13:09:30 ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-05-28 13:09:30 🔨 Initializing Genesis block/state (state: 0xf7ca…5c0f, header-hash: 0x1b54…0198)
2020-05-28 13:09:30 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-05-28 13:09:30 ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-05-28 13:09:30 📦 Highest known block at #0
2020-05-28 13:09:30 Using default protocol ID "sup" because none is configured in the chain specs
2020-05-28 13:09:30 🏷  Local node identity is: 12D3KooWFGe9f8p88PVU3E4AwJEjU47DCWgJjU7SwGhvbDm6T7V2 (legacy representation: QmdYNXLKscxk45kK7VNnR95zkjYW2KVg9Qdv1WG6w73rQN)
2020-05-28 13:09:30 〽️ Prometheus server started at 127.0.0.1:9615
2020-05-28 13:09:35 💤 Idle (0 peers), best: #0 (0x1b54…0198), finalized #0 (0x1b54…0198), ⬇ 0 ⬆ 0
2020-05-28 13:09:40 💤 Idle (0 peers), best: #0 (0x1b54…0198), finalized #0 (0x1b54…0198), ⬇ 0 ⬆ 0
...
```

> **Notes**
>
> - `🔨 Initializing Genesis block/state (state: 0xf7ca…5c0f, header-hash: 0x1b54…0198)` tells which
>   genesis block the node is using. When you start the next node, verify that these values are
>   equal.
> - `🏷 Local node identity is: 12D3KooWFGe9f8p88PVU3E4AwJEjU47DCWgJjU7SwGhvbDm6T7V2...` shows the
>   Peer ID that Bob will need when booting from Alice's node.

You'll notice that no blocks are being produced yet. Blocks will start being produced once another
node joins the network.

More details about all of these flags and others that I haven't mentioned are available by running
`./target/release/node-template --help`.

## Attach a UI

You can tell a lot about your node by watching the output it produces in your terminal. There is
also a nice graphical user interface known as the Polkadot-JS Apps, or just "Apps" for short.

In your web browser, navigate to
[https://polkadot.js.org/apps/#/settings?rpc=ws://127.0.0.1:9944](https://polkadot.js.org/apps/#/settings?rpc=ws://127.0.0.1:9944).

> Some browsers, notably Firefox, will not connect to a local node from an https website. An easy
> work around is to try another browser, like Chromium. Another option is to
> [host this interface locally](https://github.com/polkadot-js/apps#development).

The link provided above includes the `rpc` URL parameter, which instructs the Apps UI to connect to
the URL that was provided as its value (in this case, your local node). To manually configure Apps
UI to connect to another node:

- Click on the top left network icon

  ![Top Left Network Icon](assets/tutorials/private-network/private-network-top-left-network-icon.png)

- A popup dropdown appears. Choose the last entry, which is a local node using default port 9944

  ![Select Network](assets/tutorials/private-network/private-network-select-network.png)

- To connect to a custom node and port, you just need to specify the endpoint by choosing
  `custom endpoint` and type in your own endpoint. In this way you can use a single instance of Apps
  UI to connect to various nodes.

  ![Custom Endpoint](assets/tutorials/private-network/private-network-custom-endpoint.png)

You should now see something like this.

![No blocks in polkadot-js-apps](assets/tutorials/private-network/private-network-no-blocks.png)

> **Notes**
>
> If you do not want to run your hosted version of Polkadot-JS Apps UI while connecting to Substrate
> node you have deployed remotely, you can configure ssh local port forwarding to forward local
> request to the `ws-port` listened by the remote host. This is beyond the scope of this tutorial
> but is referenced at the bottom.

## Bob Joins

Now that Alice's node is up and running, Bob can join the network by bootstrapping from her node.
His command will look very similar.

```bash
./target/release/node-template purge-chain --base-path /tmp/bob --chain local
```

```bash
./target/release/node-template \
  --base-path /tmp/bob \
  --chain local \
  --bob \
  --port 30334 \
  --ws-port 9945 \
  --rpc-port 9934 \
  --telemetry-url 'ws://telemetry.polkadot.io:1024 0' \
  --validator \
  --bootnodes /ip4/<Alices IP Address>/tcp/<Alices Port>/p2p/<Alices Peer ID>
```

Most of these options are already explained above, but there are a few points worth mentioning.

- Because these two nodes are running on the same physical machine, Bob must specify a different
  `--base-path`, `--port`, `--ws-port`, and `--rpc-port`.
- Bob has added the `--bootnodes` flag and specified a single boot node, namely Alice's. He must
  correctly specify these three pieces of information which Alice can supply for him.
  - Alice's IP Address, probably `127.0.0.1`
  - Alice's Port, probably `30333`
  - Alice's Peer ID, copied from her log output.
    (`12D3KooWFGe9f8p88PVU3E4AwJEjU47DCWgJjU7SwGhvbDm6T7V2` in the example output above.)

If all is going well, after a few seconds, the nodes should peer together and start producing
blocks. You should see some lines like the following in the console that started Alice node.

```
...
2020-05-28 13:13:14 💤 Idle (0 peers), best: #0 (0x1b54…0198), finalized #0 (0x1b54…0198), ⬇ 0 ⬆ 0
2020-05-28 13:13:19 💤 Idle (0 peers), best: #0 (0x1b54…0198), finalized #0 (0x1b54…0198), ⬇ 0 ⬆ 0
2020-05-28 13:13:22 🔍 Discovered new external address for our node: /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWFGe9f8p88PVU3E4AwJEjU47DCWgJjU7SwGhvbDm6T7V2
2020-05-28 13:13:24 🙌 Starting consensus session on top of parent 0x1b54d33e7be756ecb667b4e10153511346ea1a5b95068c946134103f63690198
2020-05-28 13:13:24 🎁 Prepared block for proposing at 1 [hash: 0xb54d18595c90ff39d4efd2835a883f60446f889500a16dbab18bafe480152dab; parent_hash: 0x1b54…0198; extrinsics (1): [0xb2b3…d97e]]
2020-05-28 13:13:24 🔖 Pre-sealed block for proposal at 1. Hash now 0x84a61167bd9c2eecaa2f242e3bc747a49be40bbcd76d5897f908fee53e205967, previously 0xb54d18595c90ff39d4efd2835a883f60446f889500a16dbab18bafe480152dab.
2020-05-28 13:13:24 ✨ Imported #1 (0x84a6…5967)
2020-05-28 13:13:24 💤 Idle (1 peers), best: #1 (0x84a6…5967), finalized #0 (0x1b54…0198), ⬇ 0.9kiB/s ⬆ 1.0kiB/s
2020-05-28 13:13:29 💤 Idle (1 peers), best: #1 (0x84a6…5967), finalized #0 (0x1b54…0198), ⬇ 0.7kiB/s ⬆ 0.6kiB/s
2020-05-28 13:13:30 ✨ Imported #2 (0x5865…74d5)
2020-05-28 13:13:34 💤 Idle (1 peers), best: #2 (0x5865…74d5), finalized #0 (0x1b54…0198), ⬇ 0.7kiB/s ⬆ 0.7kiB/s
2020-05-28 13:13:36 🙌 Starting consensus session on top of parent 0x5865da4ba8dbf983845ef9b17f3e5920a067de5215120feb42a63778af0a74d5
2020-05-28 13:13:36 🎁 Prepared block for proposing at 3 [hash: 0xd8f870209fcaca8d2372d39125561990fdd6b9d6941ced7b0835044ff7a77693; parent_hash: 0x5865…74d5; extrinsics (1): [0x309d…0d70]]
2020-05-28 13:13:36 🔖 Pre-sealed block for proposal at 3. Hash now 0x1c03614c74ff7be6841777009dd368d864c850d3e238ffb27e871099ec54773d, previously 0xd8f870209fcaca8d2372d39125561990fdd6b9d6941ced7b0835044ff7a77693.
2020-05-28 13:13:36 ✨ Imported #3 (0x1c03…773d)
2020-05-28 13:13:39 💤 Idle (1 peers), best: #3 (0x1c03…773d), finalized #1 (0x84a6…5967), ⬇ 1.1kiB/s ⬆ 1.2kiB/s
...
```

These lines shows that Bob has peered with Alice (**`1 peers`**), they have produced some blocks
(**`best: #3 (0x1c03…773d)`**), and blocks are being finalized (**`finalized #1 (0x84a6…5967)`**).

Looking at the console that started Bob's node, you should see something similar.

Once you've verified that both nodes are running as expected, you can shut them down. The next
section of this tutorial will include commands to restart the nodes when necessary.

## References

- [Configure ssh local port forwarding](https://www.booleanworld.com/guide-ssh-port-forwarding-tunnelling/)

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
  --ws-port 9945 \
  --rpc-port 9933 \
  --node-key 0000000000000000000000000000000000000000000000000000000000000001 \
  --telemetry-url 'wss://telemetry.polkadot.io/submit/ 0' \
  --validator
```

Let's look at those flags in detail:

| <div style="min-width:110pt"> Flags </div> | Descriptions                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--base-path`                              | Specifies a directory where Substrate should store all the data related to this chain. If this value is not specified, a default path will be used. If the directory does not exist it will be created for you. If other blockchain data already exists there you will get an error. Either clear the directory or choose a different one. |
| `--chain local`                            | Specifies which chain specification to use. There are a few prepackaged options including `local`, `development`, and `staging` but generally one specifies their own chain spec file. We'll specify our own file in a later step.                                                                                                         |
| `--alice`                                  | Puts the predefined Alice keys (both for block production and finalization) in the node's keystore. Generally one should generate their own keys and insert them with an RPC call. We'll generate our own keys in a later step. This flag also makes Alice a validator.                                                                    |
| `--port 30333`                             | Specifies the port that your node will listen for p2p traffic on. `30333` is the default and this flag can be omitted if you're happy with the default. If Bob's node will run on the same physical system, you will need to explicitly specify a different port for it.                                                                   |
| `--ws-port 9945`                           | Specifies the port that your node will listen for incoming WebSocket traffic on. The default value is `9944`. This example uses a custom web socket port number (`9945`).                                                                                                                                                                  |
| `--rpc-port 9933`                          | Specifies the port that your node will listen for incoming RPC traffic on. `9933` is the default, so this parameter may be omitted.                                                                                                                                                                                                        |
| `--node-key <key>`                         | The Ed25519 secret key to use for `libp2p` networking. The value is parsed as a hex-encoded Ed25519 32 byte secret key, i.e. 64 hex characters. WARNING: Secrets provided as command-line arguments are easily exposed. Use of this option should be limited to development and testing.                                                   |
| `--telemetry-url`                          | Tells the node to send telemetry data to a particular server. The one we've chosen here is hosted by Parity and is available for anyone to use. You may also host your own (beyond the scope of this article) or omit this flag entirely.                                                                                                  |
| `--validator`                              | Means that we want to participate in block production and finalization rather than just sync the network.                                                                                                                                                                                                                                  |

When the node starts you should see output similar to this.

```
Sep 24 12:53:30.728  INFO Substrate Node
Sep 24 12:53:30.728  INFO ✌️  version 2.0.0-24da767-x86_64-linux-gnu
Sep 24 12:53:30.729  INFO ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
Sep 24 12:53:30.729  INFO 📋 Chain specification: Local Testnet
Sep 24 12:53:30.729  INFO 🏷  Node name: Alice
Sep 24 12:53:30.729  INFO 👤 Role: AUTHORITY
Sep 24 12:53:30.729  INFO 💾 Database: RocksDb at /tmp/alice/chains/local_testnet/db
Sep 24 12:53:30.729  INFO ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
Sep 24 12:53:32.312  INFO 🔨 Initializing Genesis block/state (state: 0x0118…493b, header-hash: 0x2533…1d36)
Sep 24 12:53:32.315  INFO 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
Sep 24 12:53:32.474  INFO ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
Sep 24 12:53:32.475  WARN Using default protocol ID "sup" because none is configured in the chain specs
Sep 24 12:53:32.475  INFO 🏷  Local node identity is: 12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp (legacy representation: 12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp)
Sep 24 12:53:32.704  INFO 📦 Highest known block at #0
Sep 24 12:53:32.705  INFO 〽️ Prometheus server started at 127.0.0.1:9615
Sep 24 12:53:32.730  INFO Listening for new connections on 127.0.0.1:9945.
Sep 24 12:53:37.733  INFO 💤 Idle (0 peers), best: #0 (0x2533…1d36), finalized #0 (0x2533…1d36), ⬇ 0 ⬆ 0
Sep 24 12:53:42.734  INFO 💤 Idle (0 peers), best: #0 (0x2533…1d36), finalized #0 (0x2533…1d36), ⬇ 0 ⬆ 0
...
```

> **Notes**
>
> - `🔨 Initializing Genesis block/state (state: 0x0118…493b, header-hash: 0x2533…1d36)` tells which
>   genesis block the node is using. When you start the next node, verify that these values are
>   equal.
> - `🏷 Local node identity is: 12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp...` shows the
>   Peer ID that Bob will need when booting from Alice's node. This value was determined by the
>   `--node-key` that was used to start Alice's node.

You'll notice that no blocks are being produced yet. Blocks will start being produced once another
node joins the network.

More details about all of these flags and others that I haven't mentioned are available by running
`./target/release/node-template --help`.

## Attach a UI

You can tell a lot about your node by watching the output it produces in your terminal. There is
also a nice graphical user interface called Polkadot-JS Apps, or just "Apps" for short.

In your web browser, navigate to
[https://polkadot.js.org/apps/#/settings?rpc=ws://127.0.0.1:9945](https://polkadot.js.org/apps/#/settings?rpc=ws://127.0.0.1:9945).

> Some browsers, notably Firefox, will not connect to a local node from a https website. An easy
> work around is to try another browser, like Chromium. Alternatively
> [host this interface locally](https://github.com/polkadot-js/apps#development).

The link provided above includes the `rpc` URL parameter, which instructs the Apps UI to connect to
the URL that was provided as its value (in this case, your local node). To manually configure Apps
UI to connect to another node:

- Click on the top left network icon

  ![Top Left Network Icon](assets/tutorials/private-network/private-network-top-left-network-icon.png)

- A popup dialog appears. Expand **DEVELOPMENT** and ensure the custom endpoint is set to
  `ws://127.0.0.1:9945`.

  ![Select Network](assets/tutorials/private-network/private-network-select-network.png)

- To connect to a custom node and port, you just need to specify the endpoint by choosing
  `custom endpoint` and type in your own endpoint. In this way you can use a single instance of Apps
  UI to connect to various nodes. Click **Switch** icon to actually switch to the new endpoint when
  necessary.

  ![Custom Endpoint](assets/tutorials/private-network/private-network-custom-endpoint.png)

You should now see something like this example from the **Network** and **Explorer** page.

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
  --ws-port 9946 \
  --rpc-port 9934 \
  --telemetry-url 'wss://telemetry.polkadot.io/submit/ 0' \
  --validator \
  --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp
```

Most of these options are already explained above, but there are a few points worth mentioning.

- Because these two nodes are running on the same physical machine, Bob must specify different
  `--base-path`, `--port`, `--ws-port`, and `--rpc-port` values.
- Bob has added the `--bootnodes` flag and specified a single boot node, namely Alice's. He must
  correctly specify these three pieces of information which Alice can supply for him.
  - Alice's IP Address, probably `127.0.0.1`
  - Alice's Port, she specified `30333`
  - Alice's Peer ID, copied from her log output.

If all is going well, after a few seconds, the nodes should peer together and start producing
blocks. You should see some lines like the following in the console that started Alice node.

```
...
Sep 24 12:55:12.755  INFO 💤 Idle (0 peers), best: #0 (0x2533…1d36), finalized #0 (0x2533…1d36), ⬇ 0 ⬆ 0
Sep 24 12:55:17.755  INFO 💤 Idle (0 peers), best: #0 (0x2533…1d36), finalized #0 (0x2533…1d36), ⬇ 0 ⬆ 0
Sep 24 12:55:21.937  INFO 🔍 Discovered new external address for our node: /ip4/192.168.0.117/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp
Sep 24 12:55:21.981  INFO 🔍 Discovered new external address for our node: /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp
Sep 24 12:55:22.756  INFO 💤 Idle (1 peers), best: #0 (0x2533…1d36), finalized #0 (0x2533…1d36), ⬇ 1.2kiB/s ⬆ 1.2kiB/s
Sep 24 12:55:24.153  INFO 🙌 Starting consensus session on top of parent 0x2533ac58ba9931d1ed7e1c8779a51d0413c77c4f258691c2819411c457aa1d36
Sep 24 12:55:24.302  INFO 🎁 Prepared block for proposing at 1 [hash: 0x380c14f5773d8eaf326e9a29f73f992bea1d8c1258dd1ac669073c3aac798036; parent_hash: 0x2533…1d36; extrinsics (1): [0x4ade…ab32]]
Sep 24 12:55:24.382  INFO 🔖 Pre-sealed block for proposal at 1. Hash now 0xd7dfb9b8bf8f36d10a22fcdad0b9753a54c38fed326e837e9639d39eb2895e0c, previously 0x380c14f5773d8eaf326e9a29f73f992bea1d8c1258dd1ac669073c3aac798036.
Sep 24 12:55:24.385  INFO ✨ Imported #1 (0xd7df…5e0c)
Sep 24 12:55:27.757  INFO 💤 Idle (1 peers), best: #1 (0xd7df…5e0c), finalized #0 (0x2533…1d36), ⬇ 0.6kiB/s ⬆ 0.7kiB/s
Sep 24 12:55:30.344  INFO ✨ Imported #2 (0xa1cb…562d)
Sep 24 12:55:32.759  INFO 💤 Idle (1 peers), best: #2 (0xa1cb…562d), finalized #0 (0x2533…1d36), ⬇ 0.7kiB/s ⬆ 0.6kiB/s
Sep 24 12:55:36.120  INFO 🙌 Starting consensus session on top of parent 0xa1cb3ff2f34833ab3bbb0791e8ab894b59dae6cbd83e9aceec49d05b3254562d
Sep 24 12:55:36.176  INFO 🎁 Prepared block for proposing at 3 [hash: 0xb1e91198d861dfa7fb71489a89871551bef8b92cf0a5a305315fa3221039abaa; parent_hash: 0xa1cb…562d; extrinsics (1): [0x2ac1…af5e]]
Sep 24 12:55:36.258  INFO 🔖 Pre-sealed block for proposal at 3. Hash now 0x632d162c6765b4ad31d7174a7e959ce108c3a4d9e8e1b2dd8c7b84664eb5a43f, previously 0xb1e91198d861dfa7fb71489a89871551bef8b92cf0a5a305315fa3221039abaa.
Sep 24 12:55:36.260  INFO ✨ Imported #3 (0x632d…a43f)
Sep 24 12:55:37.761  INFO 💤 Idle (1 peers), best: #3 (0x632d…a43f), finalized #1 (0xd7df…5e0c), ⬇ 0.8kiB/s ⬆ 0.9kiB/s
...
```

These lines shows that Bob has peered with Alice (**`1 peers`**), they have produced some blocks
(**`best: #3 (0x632d…a43f)`**), and blocks are being finalized (**`finalized #1 (0xd7df…5e0c)`**).

Looking at the console that started Bob's node, you should see something similar.

Once you've verified that both nodes are running as expected, you can shut them down. The next
section of this tutorial will include commands to restart the nodes when necessary.

## References

- [Configure ssh local port forwarding](https://www.booleanworld.com/guide-ssh-port-forwarding-tunnelling/)

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
  --node-key 0000000000000000000000000000000000000000000000000000000000000001 \
  --telemetry-url 'wss://telemetry.polkadot.io/submit/ 0' \
  --validator
```

Let's look at those flags in detail:

| <div style="min-width:110pt"> Flags </div> | Descriptions                                                                                                                                                                                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--base-path`      | Specifies a directory where Substrate should store all the data related to this chain. If the directory does not exist it will be created for you. If other blockchain data already exists there you will get an error. Either clear the directory or choose a different one. If this value is not specified, a default path will be used. |
| `--chain local`    | Specifies which chain specification to use. There are a few pre-packaged options including `local`, `development`, and `staging` but generally one specifies their own chainspec file. We'll specify our own file in a later step.                                                                                                         |
| `--alice`          | Puts the pre-defined Alice keys (both for block production and finalization) in the node's keystore. Generally one should generate their own keys and insert them with an RPC call. We'll generate our own keys in a later step. This flag also makes Alice a validator.                                                                   |
| `--port 30333`     | Specifies the port that your node will listen for p2p traffic on. `30333` is the default and this flag can be omitted if you're happy with the default. If Bob's node will run on the same physical system, you will need to explicitly specify a different port for it.                                                                   |
| `--ws-port 9944`   | Specifies the port that your node will listen for incoming web socket traffic on. `9944` is the default, so it can also be omitted.                                                                                                                                                                                                        |
| `--rpc-port 9933`  | Specifies the port that your node will listen for incoming RPC traffic on. `9933` is the default, so it can also be omitted.                                                                                                                                                                                                               |
| `--node-key <key>` | The Ed25519 secret key to use for `libp2p` networking. The value is parsed as a hex-encoded Ed25519 32 byte secret key, i.e. 64 hex characters. WARNING: Secrets provided as command-line arguments are easily exposed. Use of this option should be limited to development and testing.                                                   |
| `--telemetry-url`  | Tells the node to send telemetry data to a particular server. The one we've chosen here is hosted by Parity and is available for anyone to use. You may also host your own (beyond the scope of this article) or omit this flag entirely.                                                                                                  |
| `--validator`      | Means that we want to participate in block production and finalization rather than just sync the network.                                                                                                                                                                                                                                  |

When the node starts you should see output similar to this.

```
2020-08-20 17:11:10.759 main INFO sc_cli::runner  Substrate Node
2020-08-20 17:11:10.759 main INFO sc_cli::runner  ✌️  version 2.0.0-rc6-7c921bb-x86_64-linux-gnu
2020-08-20 17:11:10.759 main INFO sc_cli::runner  ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-08-20 17:11:10.759 main INFO sc_cli::runner  📋 Chain specification: Local Testnet
2020-08-20 17:11:10.759 main INFO sc_cli::runner  🏷  Node name: Alice
2020-08-20 17:11:10.759 main INFO sc_cli::runner  👤 Role: AUTHORITY
2020-08-20 17:11:10.759 main INFO sc_cli::runner  💾 Database: RocksDb at /tmp/alice/chains/local_testnet/db
2020-08-20 17:11:10.759 main INFO sc_cli::runner  ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-08-20 17:11:10.990 main INFO sc_service::client::client  🔨 Initializing Genesis block/state (state: 0x5e50…60d3, header-hash: 0x3e48…2b04)
2020-08-20 17:11:10.991 main INFO afg  👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-08-20 17:11:11.004 main INFO sc_consensus_slots  ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-08-20 17:11:11.004 main WARN sc_service::builder  Using default protocol ID "sup" because none is configured in the chain specs
2020-08-20 17:11:11.005 main INFO sub-libp2p  🏷  Local node identity is: 12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp (legacy representation: QmRpheLN4JWdAnY7HGJfWFNbfkQCb6tFf4vvA6hgjMZKrR)
2020-08-20 17:11:11.012 main INFO sc_service::builder  📦 Highest known block at #0
2020-08-20 17:11:11.012 tokio-runtime-worker INFO substrate_prometheus_endpoint::known_os  〽️ Prometheus server started at 127.0.0.1:9615
2020-08-20 17:11:16.015 tokio-runtime-worker INFO substrate  💤 Idle (0 peers), best: #0 (0x3e48…2b04), finalized #0 (0x3e48…2b04), ⬇ 0 ⬆ 0
2020-08-20 17:11:21.015 tokio-runtime-worker INFO substrate  💤 Idle (0 peers), best: #0 (0x3e48…2b04), finalized #0 (0x3e48…2b04), ⬇ 0 ⬆ 0
...
```

> **Notes**
>
> - `🔨 Initializing Genesis block/state (state: 0x5e50…60d3, header-hash: 0x3e48…2b04)` tells which
>   genesis block the node is using. When you start the next node, verify that these values are
>   equal.
> - `🏷  Local node identity is: 12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp...` shows the
>   Peer ID that Bob will need when booting from Alice's node. This value was determined by the
>   `--node-key` that was used to start Alice's node. 

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
  --telemetry-url 'wss://telemetry.polkadot.io/submit/ 0' \
  --validator \
  --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp
```

Most of these options are already explained above, but there are a few points worth mentioning.

- Because these two nodes are running on the same physical machine, Bob must specify a different
  `--base-path`, `--port`, `--ws-port`, and `--rpc-port`.
- Bob has added the `--bootnodes` flag and specified a single boot node, namely Alice's. He must
  correctly specify these three pieces of information which Alice can supply for him.
  - Alice's IP Address, probably `127.0.0.1`
  - Alice's Port, she specified `30333`
  - Alice's Peer ID, copied from her log output.

If all is going well, after a few seconds, the nodes should peer together and start producing
blocks. You should see some lines like the following in the console that started Alice node.

```
...
2020-08-20 17:13:31.024 tokio-runtime-worker INFO substrate  💤 Idle (0 peers), best: #0 (0x3e48…2b04), finalized #0 (0x3e48…2b04), ⬇ 0 ⬆ 0
2020-08-20 17:13:36.025 tokio-runtime-worker INFO substrate  💤 Idle (0 peers), best: #0 (0x3e48…2b04), finalized #0 (0x3e48…2b04), ⬇ 0 ⬆ 0
2020-08-20 17:13:40.067 tokio-runtime-worker INFO sub-libp2p  🔍 Discovered new external address for our node: /ip4/192.168.0.118/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp
2020-08-20 17:13:40.067 tokio-runtime-worker INFO sub-libp2p  🔍 Discovered new external address for our node: /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp
2020-08-20 17:13:41.025 tokio-runtime-worker INFO substrate  💤 Idle (1 peers), best: #0 (0x3e48…2b04), finalized #0 (0x3e48…2b04), ⬇ 1.2kiB/s ⬆ 1.2kiB/s
2020-08-20 17:13:42.078 tokio-runtime-worker INFO substrate  ✨ Imported #1 (0x2335…80ad)
2020-08-20 17:13:46.026 tokio-runtime-worker INFO substrate  💤 Idle (1 peers), best: #1 (0x2335…80ad), finalized #0 (0x3e48…2b04), ⬇ 0.7kiB/s ⬆ 0.6kiB/s
2020-08-20 17:13:48.010 tokio-runtime-worker INFO sc_basic_authorship::basic_authorship  🙌 Starting consensus session on top of parent 0x233562021d92a974344bd83f070688ecfe178cae33355fa26e4b8544f6e380ad
2020-08-20 17:13:48.021 tokio-blocking-driver INFO sc_basic_authorship::basic_authorship  🎁 Prepared block for proposing at 2 [hash: 0x5c05288cf3c7726db6fb7b3b3997cb92f9340662060938e4c25c7b9a3d61e412; parent_hash: 0x2335…80ad; extrinsics (1): [0x69d9…d1b6]]
2020-08-20 17:13:48.031 tokio-runtime-worker INFO sc_consensus_slots  🔖 Pre-sealed block for proposal at 2. Hash now 0xf7f80a0fcdb764135d9814bb7a917a829bbc46e052e84e3ef605b652541b71d6, previously 0x5c05288cf3c7726db6fb7b3b3997cb92f9340662060938e4c25c7b9a3d61e412.
2020-08-20 17:13:48.031 tokio-runtime-worker INFO substrate  ✨ Imported #2 (0xf7f8…71d6)
2020-08-20 17:13:51.026 tokio-runtime-worker INFO substrate  💤 Idle (1 peers), best: #2 (0xf7f8…71d6), finalized #0 (0x3e48…2b04), ⬇ 0.7kiB/s ⬆ 0.8kiB/s
2020-08-20 17:13:54.084 tokio-runtime-worker INFO substrate  ✨ Imported #3 (0x0681…2d89)
2020-08-20 17:13:56.027 tokio-runtime-worker INFO substrate  💤 Idle (1 peers), best: #3 (0x0681…2d89), finalized #1 (0x2335…80ad), ⬇ 0.9kiB/s ⬆ 0.9kiB/s
...
```

These lines shows that Bob has peered with Alice (**`1 peers`**), they have produced some blocks
(**`best: #3 (0x0681…2d89)`**), and blocks are being finalized (**`finalized #1 (0x2335…80ad)`**).

Looking at the console that started Bob's node, you should see something similar.

Once you've verified that both nodes are running as expected, you can shut them down. The next
section of this tutorial will include commands to restart the nodes when necessary.

## References

- [Configure ssh local port forwarding](https://www.booleanworld.com/guide-ssh-port-forwarding-tunnelling/)

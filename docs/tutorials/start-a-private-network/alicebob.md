---
title: Alice and Bob Start Blockchain
---

Before we generate our own keys, and start a truly unique Substrate network, let's learn the
fundamentals by starting with a pre-defined network specification called `local` with two
pre-defined (and definitely not private!) keys known as Alice and Bob.

> This portion of the tutorial should be run on a single workstation with a single Substrate binary.
> If you've followed the tutorial up to this point, you have the correct setup.

## Alice Starts First

Alice (or whomever is playing her) should run this command from node-template repository root.

```bash
# Start Alice's node
./target/release/node-template \
  --base-path /tmp/alice \
  --chain local \
  --alice \
  --port 30333 \
  --ws-port 9944 \
  --rpc-port 9933 \
  --telemetry-url ws://telemetry.polkadot.io:1024 \
  --validator
```

Let's look at those flags in detail:

| <div style="min-width:110pt"> Flags </div> | Descriptions |
| --- | --- |
| `--base-path` | Specifies a directory where Substrate should store all the data related to this chain. If the directory does not exist it will be created for you. If other blockchain data already exists there you will get an error. Either clear the directory or choose a different one. If this value is not specified, a default path will be used. |
| `--chain local` | Specifies which chain specification to use. There are a few pre-packaged options including `local`, `development`, and `staging` but generally one specifies their own chainspec file. We'll specify our own file in a later step. |
| `--alice` | Puts the pre-defined Alice keys (both for block production and finalization) in the node's keystore. Generally one should generate their own keys and insert them with an RPC call. We'll generate our own keys in a later step. This flag also makes Alice a validator. |
| `--port 30333` | Specifies the port that your node will listen for p2p traffic on. `30333` is the default and this flag can be omitted if you're happy with the default. If Bob's node will run on the same physical system, you will need to explicitly specify a different port for it. |
| `--ws-port 9944` | Specifies the port that your node will listen for incoming web socket traffic on. `9944` is the default, so it can also be omitted. |
| `--rpc-port 9933` | Specifies the port that your node will listen for incoming RPC traffic on. `9933` is the default, so it can also be omitted. |
| `--telemetry-url` | Tells the node to send telemetry data to a particular server. The one we've chosen here is hosted by Parity and is available for anyone to use. You may also host your own (beyond the scope of this article) or omit this flag entirely. |
| `--validator` | Means that we want to participate in block production and finalization rather than just sync the network. |

When the node starts you should see output similar to this.

```
2020-03-11 09:39:14 Substrate Node
2020-03-11 09:39:14   version 2.0.0-alpha.3-5b41f0b-x86_64-linux-gnu
2020-03-11 09:39:14   by Anonymous, 2017-2020
2020-03-11 09:39:14 Chain specification: Local Testnet
2020-03-11 09:39:14 Node name: Alice
2020-03-11 09:39:14 Roles: AUTHORITY
2020-03-11 09:39:14 Initializing Genesis block/state (state: 0xb8a4…aff5, header-hash: 0x2b5c…9bf7)
2020-03-11 09:39:14 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-03-11 09:39:14 Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-03-11 09:39:14 Highest known block at #0
2020-03-11 09:39:14 Using default protocol ID "sup" because none is configured in the chain specs
2020-03-11 09:39:14 Local node identity is: QmWirz83uJTFEUVzoshXUf2SY2nTSJetd4nJGkZ7kozZPb
2020-03-11 09:39:14 Prometheus server started at 127.0.0.1:9615
2020-03-11 09:39:19 Idle (0 peers), best: #0 (0x2b5c…9bf7), finalized #0 (0x2b5c…9bf7), ⬇ 0 ⬆ 0
2020-03-11 09:39:24 Idle (0 peers), best: #0 (0x2b5c…9bf7), finalized #0 (0x2b5c…9bf7), ⬇ 0 ⬆ 0
2020-03-11 09:39:29 Idle (0 peers), best: #0 (0x2b5c…9bf7), finalized #0 (0x2b5c…9bf7), ⬇ 0 ⬆ 0

...
```

> **Notes**
>
> * `Local node identity is: QmWirz83uJTFEUVzoshXUf2SY2nTSJetd4nJGkZ7kozZPb` shows the Peer ID that
> Bob will need when booting from Alice's node.
> * `Initializing Genesis block/state (state: 0x4a75…ea43, header-hash: 0x05e7…019e)` tells which
> genesis block the node is using. Bob's node must have the same hashes or they will not connect
> to one another.

You'll notice that no blocks are being produced yet. Blocks will start being produced once another
node joins the network.

More details about all of these flags and others that I haven't mentioned are available by running `./target/release/node-template --help`.

## Attach a UI

You can tell a lot about your node by watching the output it produces in your terminal. There is
also a nice graphical user interface known as the Polkadot-JS Apps, or just "Apps" for short.

In your web browser, navigate to [https://polkadot.js.org/apps](https://polkadot.js.org/apps/#/settings?rpc=ws://127.0.0.1:9944).

> Some browsers, notably Firefox, will not connect to a local node from an https website. An easy work around is to try another browser, like Chromium. Another option is to [host this interface locally](https://github.com/polkadot-js/apps#development).

Apps UI, by default, connects to the Kusama network. To configure Apps UI to connect to your local-running node:

  - Click on the top left network icon

    ![Top Left Network Icon](/docs/assets/private-network-top-left-network-icon.png)

  - A popup dropdown appears. Choose the last entry, which is a local node using default port 9944

    ![Select Network](/docs/assets/private-network-select-network.png)

  - To connect to a custom node and port, you just need to specify the endpoint by choosing `custom
  endpoint` and type in your own endpoint. By this way you can use a single instance of Apps UI to
  connect to various nodes.

    ![Custom Endpoint](/docs/assets/private-network-custom-endpoint.png)

You should now see something like this.

![No blocks in polkadot-js-apps](/docs/assets/private-network-no-blocks.png)

> **Notes**
>
> If you do not want to run your hosted version of Polkadot-JS Apps UI while connecting to Substrate
> node you have deployed remotely, you can configure ssh local port forwarding to forward local request
> to the `ws-port` listened by the remote host. This is beyond the scope of this tutorial but is
> referenced at the bottom.

## Bob Joins

Now that Alice's node is up and running, Bob can join the network by bootstrapping from her node.
His command will look very similar.

```bash
./target/release/node-template \
  --base-path /tmp/bob \
  --chain local \
  --bob \
  --port 30334 \
  --ws-port 9945 \
  --rpc-port 9934 \
  --telemetry-url ws://telemetry.polkadot.io:1024 \
  --validator \
  --bootnodes /ip4/<Alices IP Address>/tcp/<Alices Port>/p2p/<Alices Peer ID>
```

Most of these options are already explained above, but there are a few points worth mentioning.

* Because these two nodes are running on the same physical machine, Bob must specify a different `--base-path`,
`--port`, `--ws-port`, and `--rpc-port`.
* Bob has added the `--bootnodes` flag and specified a single boot node, namely Alice's. He must correctly specify these three pieces of information which Alice can supply for him.
  * Alice's IP Address, in the form `127.0.0.1`
  * Alice's Port, probably `30333`
  * Alice's Peer ID, copied from the log output. (`QmWirz83uJTFEUVzoshXUf2SY2nTSJetd4nJGkZ7kozZPb`
  in the example output above.)

If all is going well, after a few seconds, the nodes should peer together and start producing blocks.
You should see some lines like the following in the console that started Alice node.

```
...
2020-03-11 09:43:59 Idle (0 peers), best: #0 (0x2b5c…9bf7), finalized #0 (0x2b5c…9bf7), ⬇ 0 ⬆ 0
2020-03-11 09:44:04 Idle (0 peers), best: #0 (0x2b5c…9bf7), finalized #0 (0x2b5c…9bf7), ⬇ 0 ⬆ 0
2020-03-11 09:44:05 Discovered new external address for our node: /ip4/192.168.0.189/tcp/30333/p2p/QmWirz83uJTFEUVzoshXUf2SY2nTSJetd4nJGkZ7kozZPb
2020-03-11 09:44:06 Imported #1 (0xb716…a7aa)
2020-03-11 09:44:09 Idle (1 peers), best: #1 (0xb716…a7aa), finalized #0 (0x2b5c…9bf7), ⬇ 1.0kiB/s ⬆ 1.0kiB/s
2020-03-11 09:44:12 Starting consensus session on top of parent 0xb716ffbceb742f5f6e32b5a957fa3f1e61725410fa17e617f42ec28b26f1a7aa
2020-03-11 09:44:12 Prepared block for proposing at 2 [hash: 0xf255064c2f324536f32a72d4de15038ea1fb2db7d6741dbb7e81c1dbe0ad8115; parent_hash: 0xb716…a7aa; extrinsics (1): [0xff3d…3ad4]]
2020-03-11 09:44:12 Pre-sealed block for proposal at 2. Hash now 0x4f932e94535396385cc18bd84917487672668e9b99f5214ff5fd8feddc21ac54, previously 0xf255064c2f324536f32a72d4de15038ea1fb2db7d6741dbb7e81c1dbe0ad8115.
2020-03-11 09:44:12 Imported #2 (0x4f93…ac54)
2020-03-11 09:44:14 Idle (1 peers), best: #2 (0x4f93…ac54), finalized #0 (0x2b5c…9bf7), ⬇ 0.6kiB/s ⬆ 0.7kiB/s
2020-03-11 09:44:18 Imported #3 (0xc4ab…bcc3)
2020-03-11 09:44:19 Idle (1 peers), best: #3 (0xc4ab…bcc3), finalized #1 (0xb716…a7aa), ⬇ 0.9kiB/s ⬆ 0.8kiB/s
...
```

These lines shows that Bob has peered with Alice (**`1 peers`**), they have produced some blocks
(**`best: #3 (0xc4ab…bcc3)`**), and blocks are being finalized (**`finalized #1 (0xb716…a7aa)`**).

Looking at the console that started Bob's node, you should see something similar.

## References

* [Configure ssh local port forwarding](https://www.booleanworld.com/guide-ssh-port-forwarding-tunnelling/)

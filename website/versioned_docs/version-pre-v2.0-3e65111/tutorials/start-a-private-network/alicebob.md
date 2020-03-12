---
title: Alice and Bob Start Blockchain
id: version-pre-v2.0-3e65111-alicebob
original_id: alicebob
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
2020-01-10 14:25:37 Substrate Node
2020-01-10 14:25:37   version 2.0.0-x86_64-linux-gnu
2020-01-10 14:25:37   by Anonymous, 2017, 2018
2020-01-10 14:25:37 Chain specification: Local Testnet
2020-01-10 14:25:37 Node name: Alice
2020-01-10 14:25:37 Roles: AUTHORITY
2020-01-10 14:25:37 Initializing Genesis block/state (state: 0x4a75…ea43, header-hash: 0x05e7…019e)
2020-01-10 14:25:37 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-01-10 14:25:38 Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-01-10 14:25:38 Highest known block at #0
2020-01-10 14:25:38 Using default protocol ID "sup" because none is configured in the chain specs
2020-01-10 14:25:38 Local node identity is: QmViTYm8Yr4yneyRGov9L87vLeVLoySFduVRNQ1d33WdXN
2020-01-10 14:25:38 Grafana data source server started at 127.0.0.1:9955
2020-01-10 14:25:43 Idle (0 peers), best: #0 (0x05e7…019e), finalized #0 (0x05e7…019e), ⬇ 0 ⬆ 0
2020-01-10 14:25:48 Idle (0 peers), best: #0 (0x05e7…019e), finalized #0 (0x05e7…019e), ⬇ 0 ⬆ 0
2020-01-10 14:25:53 Idle (0 peers), best: #0 (0x05e7…019e), finalized #0 (0x05e7…019e), ⬇ 0 ⬆ 0
...
```

> **Notes**
>
> * `Local node identity is: QmViTYm8Yr4yneyRGov9L87vLeVLoySFduVRNQ1d33WdXN` shows the Peer ID that
> Bob will need when booting from Alice's node.
> * `Initializing Genesis block/state (state: 0x4a75…ea43, header-hash: 0x05e7…019e)` tells which
> genesis block the node is using. Bob's node must have the same hashes or they will not connect
> to one another.

You'll notice that no blocks are being produced yet. Blocks will start being produced once another
validator joins the network.

More details about all of these flags are available by running `./target/release/node-template --help`.

## Attach a UI

You can tell a lot about your node by watching the output it produces in your terminal. There is
also a nice graphical user interface known as the [Polkadot-JS Apps UI](https://polkadot.js.org/apps/)
which you can connect to your node. That link goes to the hosted version of the user interface,
which is super convenient, but will not connect to unencrypted web-socket endpoints in some browsers
(notably including Firefox). In this case, you can run the interface locally by grabbing the code
from [github](https://github.com/polkadot-js/apps). In general the instructions in that repository
will be your best guide, but the process should be something like this.

```bash
# Grab the code
git clone https://github.com/polkadot-js/apps
cd apps

# Install dependencies (you MUST use yarn, not npm)
yarn install

# Start the project
yarn run start
```

If you are running Apps UI locally, it will be accesible at `http://localhost:3000`. You could also use the hosted version at `https://polkadot.js.org/apps/`

Apps UI by default connects to Parity Kusama network. To configure Apps UI to connect to your local-running node:

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

* If these two nodes are running on the same physical machine, Bob MUST specify a different `--base-path`,
`--port`, `--ws-port`, and `--rpc-port`.
* Bob has added the `--bootnodes` flag and specified a single boot node, namely Alice's. 
He must correctly specify these three pieces of information which Alice can supply for him.
  * Alice's IP Address, in the form `127.0.0.1`
  * Alice's Port, probably `30333`
  * Alice's Peer ID, copied from the log output. (`QmViTYm8Yr4yneyRGov9L87vLeVLoySFduVRNQ1d33WdXN`
  in the example output above.)

If all is going well, after a few seconds, the nodes should peer together and start producing blocks.
You should see some lines like the following in the console that started Alice node.

```
...
2020-01-10 14:30:28 Idle (0 peers), best: #0 (0x05e7…019e), finalized #0 (0x05e7…019e), ⬇ 0 ⬆ 0
2020-01-10 14:30:30 Discovered new external address for our node: /ip4/127.0.0.1/tcp/30333/p2p/QmZbVTa3n3CJUDMYCDqGPpDGwMmQJBkyGc5gRGkmYw88Pp
2020-01-10 14:30:33 Idle (1 peers), best: #0 (0x05e7…019e), finalized #0 (0x05e7…019e), ⬇ 0.7kiB/s ⬆ 0.7kiB/s
2020-01-10 14:30:36 Starting consensus session on top of parent 0x05e71d9c5e414bbe6f72e3b045eebfb5d9af22d59070bc29de4084544cef019e
2020-01-10 14:30:36 Prepared block for proposing at 1 [hash: 0xbeba14c5c8ad5ffa91a007c2b84554f3e74151b87444f389d719fff60aecd616; parent_hash: 0x05e7…019e; extrinsics: [0xe4ff…6bd7]]
2020-01-10 14:30:36 Pre-sealed block for proposal at 1. Hash now 0x1368112db340f6470a2edec9d8fb52031c8c63af4dc1ed86116ad048da93fe12, previously 0xbeba14c5c8ad5ffa91a007c2b84554f3e74151b87444f389d719fff60aecd616.
2020-01-10 14:30:36 Imported #1 (0x1368…fe12)
2020-01-10 14:30:38 Idle (1 peers), best: #1 (0x1368…fe12), finalized #0 (0x05e7…019e), ⬇ 0.6kiB/s ⬆ 0.7kiB/s
2020-01-10 14:30:42 Imported #2 (0xe4ee…8863)
2020-01-10 14:30:43 Idle (1 peers), best: #2 (0xe4ee…8863), finalized #1 (0x05e7…019e), ⬇ 0.8kiB/s ⬆ 0.7kiB/s
2020-01-10 14:30:48 Starting consensus session on top of parent 0xe4ee9d721d1b179ba83bc253871c504f48a0d4d02f304acfdccd29bfb1798863
2020-01-10 14:30:48 Prepared block for proposing at 3 [hash: 0x83f211e9e2d24101acf8097d46c6d348308a4a354fd0d60a7768ad51e4b0cc6b; parent_hash: 0xe4ee…8863; extrinsics: [0x81fa…3ab1]]
2020-01-10 14:30:48 Pre-sealed block for proposal at 3. Hash now 0x42f2fcfdb65c9e26700ef779a0782f6de30cb9531f8de54043e1a3b3469a0aff, previously 0x83f211e9e2d24101acf8097d46c6d348308a4a354fd0d60a7768ad51e4b0cc6b.
2020-01-10 14:30:48 Imported #3 (0x42f2…0aff)
2020-01-10 14:30:48 Idle (1 peers), best: #3 (0x42f2…0aff), finalized #2 (0x1368…fe12), ⬇ 1.0kiB/s ⬆ 0.9kiB/s
...
```

This line shows that Bob has peered with Alice (**`1 peers`**), they have produced a block
(**`best: #1 (0x1368…fe12)`**), and the block is finalized (**`finalized #1 (0x1368…fe12)`**).

Looking at the console that started Bob node, you should see something similar as above also.

## References

* [Configure ssh local port forwarding](https://www.booleanworld.com/guide-ssh-port-forwarding-tunnelling/)

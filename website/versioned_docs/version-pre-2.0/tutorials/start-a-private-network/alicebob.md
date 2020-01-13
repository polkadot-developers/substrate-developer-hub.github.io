---
title: Alice and Bob Start Blockchain
id: version-pre-2.0-alicebob
original_id: alicebob
---

Before we generate our own keys, and start a truly unique Substrate network, let's learn the fundamentals by starting with a pre-defined network specification called `local` with two pre-defined (and definitely not private!) keys known as Alice and Bob.

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
2019-09-26 15:42:10 Substrate Node
2019-09-26 15:42:10   version 2.0.0-7d7e74fb7-x86_64-linux-gnu
2019-09-26 15:42:10   by Anonymous, 2017, 2018
2019-09-26 15:42:10 Chain specification: Local Testnet
2019-09-26 15:42:10 Node name: Alice
2019-09-26 15:42:10 Roles: AUTHORITY
2019-09-26 15:42:10 Initializing Genesis block/state (state: 0x4faf…3aba, header-hash: 0x8855…e564)
2019-09-26 15:42:10 Loading GRANDPA authority set from genesis on what appears to be first startup.
2019-09-26 15:42:10 Loaded block-time = BabeConfiguration { slot_duration: 6000, epoch_length: 100, c: (1, 4), genesis_authorities: [(Public(d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d (5GrwvaEF...)), 1), (Public(8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48 (5FHneW46...)), 1)], randomness: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], secondary_slots: true } seconds from genesis on first-launch
2019-09-26 15:42:10 Creating empty BABE epoch changes on what appears to be first startup.
2019-09-26 15:42:10 Highest known block at #0
2019-09-26 15:42:10 Using default protocol ID "sup" because none is configured in the chain specs
2019-09-26 15:42:10 Local node identity is: QmViTYm8Yr4yneyRGov9L87vLeVLoySFduVRNQ1d33WdXN
2019-09-26 15:42:10 Starting BABE Authorship worker
2019-09-26 15:42:15 Idle (0 peers), best: #0 (0x8855…e564), finalized #0 (0x8855…e564), ⬇ 0 ⬆ 0
2019-09-26 15:42:20 Idle (0 peers), best: #0 (0x8855…e564), finalized #0 (0x8855…e564), ⬇ 0 ⬆ 0
```

> **Notes**
>
> * `Local node identity is: QmViTYm8Yr4yneyRGov9L87vLeVLoySFduVRNQ1d33WdXN` shows the node ID that
> Bob will need when booting from Alice's node.
> * `Initializing Genesis block/state (state: 0x4faf…3aba, header-hash: 0x8855…e564)` tells which
> genesis block the node is using. Bob's node must have the same hashes or they will not connect
> to one another.

More details about all of these flags and others that I haven't mentioned are available by running `./target/release/node-template --help`.

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
yarn

# Start the project
yarn run start
```

Point your favorite web browser at localhost:3000, and on the settings tab, choose "local node".
You should see something like this.

![No blocks in polkadot-js-apps](/docs/assets/private-network-no-blocks.png)

You'll notice, both in the terminal and the UI, that no blocks are being produced yet. Blocks will
start being produced once another validator joins the network.

> **Notes**
>
> If you do not want to run your hosted version of Polkadot-JS Apps UI while connecting to Substrate
> node you have deployed remotely, you can configure ssh local port forwarding to forward local request
> to the `ws-port` listened by the remote host. This is beyond the scope of this tutorial but is
> referenced at the bottom.

### Bob Joins In

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
  --bootnodes /ip4/<Alices IP Address>/tcp/<Alices Port>/p2p/<Alices Node ID>
```

Most of these options are already explained above, but there are a few points worth mentioning.

* If these two nodes are running on the same physical machine, Bob MUST specify a different `--base-path`,
`--port`, `--ws-port`, and `--rpc-port`.
* Bob has added the `--bootnodes` flag and specified a single boot node, namely Alice's. He must correctly specify these three pieces of information which Alice can supply for him.
  * Alice's IP Address, in the form `192.168.1.1`
  * Alice's Port, probably `30333`
  * Alice's node ID, copied from her log output. (`QmViTYm8Yr4yneyRGov9L87vLeVLoySFduVRNQ1d33WdXN` in the example output above.)

If all is going well, after a few seconds, the nodes should peer together and start producing blocks.
You should see some lines like

```
Idle (1 peers), best: #1 (0x9f1b…9b57), finalized #1 (0x28be…45e5), ⬇ 1.7kiB/s ⬆ 1.4kiB/s
```

This line shows that Bob has peered with Alice (`1 peers`), they have produced a block (`best: #1 (0x9f1b…9b57)`), and the block is  finalized (`finalized #1 (0x28be…45e5)`).

## References

* [Configure ssh local port forwarding](https://www.booleanworld.com/guide-ssh-port-forwarding-tunnelling/)

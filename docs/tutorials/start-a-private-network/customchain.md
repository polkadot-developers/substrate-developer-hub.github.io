---
title: Creating Your Private Network
---

With you custom chain spec created and distributed to all participants, you're ready to launch your
own custom chain. In this section it is no longer required to use a single physical machine or a
single binary.

## First Participant Starts a Bootnode

You've completed all the necessary prep work and you're now ready to launch your chain. This process
is very similar to when you launched a chain earlier as Alice and Bob. It's important to start with
a clean base path, so if you plan to use the same path that you've used previously, please delete
all contents from that directory.

The first participant can launch her node with

```bash
./target/release/node-template \
  --base-path /tmp/node01 \
  --chain=./customSpecRaw.json \
  --port 30333 \
  --ws-port 9944 \
  --rpc-port 9933 \
  --telemetry-url 'ws://telemetry.polkadot.io:1024 0' \
  --validator \
  --rpc-methods=Unsafe \
  --name MyNode01
```

Here are some differences from when we launched as Alice.

- I've omitted the `--alice` flag. Instead we will insert our own custom keys into the keystore
  through the RPC shortly.
- The `--chain` flag has changed to use our custom chain spec.
- I've added the optional `--name` flag. You may use it to give your node a human-readable name in
  the telemetry UI.
- The optional `--rpc-methods=Unsafe` flag has been added. As the name indicates, this flag is not
  safe to use in a production setting, but it allows this tutorial to stay focused on the topic at
  hand. In production, you should use a
  [JSON-RPC proxy](../../knowledgebase/getting-started/glossary#json-rpc-proxy-crate), but that
  topic is out of the scope of this tutorial.

You should see the console outputs something as follows:

```bash
2020-07-25 10:48:33 Substrate Node
2020-07-25 10:48:33 ✌️  version 2.0.0-rc5-unknown-x86_64-linux-gnu
2020-07-25 10:48:33 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-07-25 10:48:33 📋 Chain specification: Local Testnet
2020-07-25 10:48:33 🏷  Node name: MyNode01
2020-07-25 10:48:33 👤 Role: AUTHORITY
2020-07-25 10:48:33 💾 Database: RocksDb at /tmp/node01/chains/local_testnet/db
2020-07-25 10:48:33 ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-07-25 10:48:33 🔨 Initializing Genesis block/state (state: 0x5327…59d5, header-hash: 0x60b2…88ec)
2020-07-25 10:48:33 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-07-25 10:48:33 ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-07-25 10:48:33 📦 Highest known block at #0
2020-07-25 10:48:33 Using default protocol ID "sup" because none is configured in the chain specs
2020-07-25 10:48:33 🏷  Local node identity is: 12D3KooWSDA5zyaXnJH4nHxKFgpd5HDH13uXUQoBLQd29QhrM9pm (legacy representation: QmcZZW2jEqNaFGUm8Bsfiuu3x9sY3cZQyWLyk98T7w7Dyy)
2020-07-25 10:48:33 〽️ Prometheus server started at 127.0.0.1:9615
2020-07-25 10:48:38 💤 Idle (0 peers), best: #0 (0x60b2…88ec), finalized #0 (0x60b2…88ec), ⬇ 0 ⬆ 0
2020-07-25 10:48:43 💤 Idle (0 peers), best: #0 (0x60b2…88ec), finalized #0 (0x60b2…88ec), ⬇ 0 ⬆ 0
```

## Add Keys to Keystore

Once your node is running, you will again notice that no blocks are being produced. At this point,
you need to add your keys into the keystore. Remember you will need to complete these steps for each
node in your network. You will add two types of keys for each node: Aura and GRANDPA keys. Aura keys
are necessary for
[block _production_](https://substrate.dev/docs/en/knowledgebase/getting-started/glossary#author-aka-block-author-block-producer);
GRANDPA keys are necessary for
[block _finalization_](https://substrate.dev/docs/en/knowledgebase/getting-started/glossary#finality).

### Option 1: Use the Polkadot-JS Apps UI

You can use the Apps UI to insert your keys into the keystore. Navigate to the "Toolbox" tab and the
"RPC Call" sub-tab. Choose "author" and "insertKey". The fields can be filled like this:

![Inserting a Aura key using Apps](assets/tutorials/private-network/private-network-apps-insert-key-aura.png)

```
keytype: aura
suri: <your mnemonic phrase> (eg. clip organ olive upper oak void inject side suit toilet stick narrow)
publicKey: <your raw sr25519 key> (eg. 0x9effc1668ca381c242885516ec9fa2b19c67b6684c02a8a3237b6862e5c8cd7e)
```

> If you generated your keys with the Apps UI you will not know your raw public key. In this case
> you may use your SS58 address (`5FfBQ3kwXrbdyoqLPvcXRp7ikWydXawpNs2Ceu3WwFdhZ8W4`) instead.

You've now successfully inserted your
[**Aura**](https://substrate.dev/docs/en/knowledgebase/getting-started/glossary#aura-aka-authority-round)
key. You can repeat those steps to insert your
[**GRANDPA**](https://substrate.dev/docs/en/knowledgebase/getting-started/glossary#grandpa) key (the
**ed25519** key)

![Inserting a GRANDPA key using Apps](assets/tutorials/private-network/private-network-apps-insert-key.png)

```
keytype: gran
suri: <your mnemonic phrase> (eg. clip organ olive upper oak void inject side suit toilet stick narrow)
publicKey: <your raw ed25519 key> (eg. 0xb48004c6e1625282313b07d1c9950935e86894a2e4f21fb1ffee9854d180c781)
```

> If you generated your keys with the Apps UI you will not know your raw public key. In this case
> you may use your SS58 address (`5G9NWJ5P9uk7am24yCKeLZJqXWW6hjuMyRJDmw4ofqxG8Js2`) instead.

> If you are following these steps for the _second_ node in the network, you must connect the UI to
> the second node before inserting the keys.

### Option 2: Use `curl`

You can also insert a key into the keystore by using [`curl`](https://curl.haxx.se/) from the
command line. This approach may be preferable in a production setting, where you may be using a
cloud-based virtual private server.

Because security is of the utmost concern in a production environment, it is important to take every
precaution possible. In this case, that means taking care that you do not leave any traces of your
keys behind, such as in your terminal's history. Create a file that you will use to define the body
for your `curl` request:

```json
{
  "jsonrpc":"2.0",
  "id":1,
  "method":"author_insertKey",
  "params": [
    "<aura/gran>",
    "<mnemonic phrase>",
    "<public key>"
  ]
}
```

```bash
# Submit a new key via RPC, connect to where your `rpc-port` is listening
$ curl http://localhost:9933 -H "Content-Type:application/json;charset=utf-8" -d "@/path/to/file"
```

If you enter the command and parameters correctly, the node will return a JSON response as follows.

```json
{ "jsonrpc": "2.0", "result": null, "id": 1 }
```

Make sure you delete the file that contains the keys when you are done.

## Subsequent Participants Join

Subsequent validators can now join the network. This can be done by specifying the `--bootnodes`
paramter as Bob did previously.

```bash
./target/release/node-template \
  --base-path /tmp/node02 \
  --chain ./customSpecRaw.json \
  --port 30334 \
  --ws-port 9945 \
  --rpc-port 9934 \
  --telemetry-url 'ws://telemetry.polkadot.io:1024 0' \
  --validator \
  --rpc-methods=Unsafe \
  --name MyNode02 \
  --bootnodes /ip4/<IP Address>/tcp/<Port>/p2p/<Peer ID>
```

As before, we specify another `base-path`, give it another `name`, and also specify this node as a
`validator`.

Once the second node is up, you should see them authoring:

```
2020-07-25 10:52:31 Substrate Node
2020-07-25 10:52:31 ✌️  version 2.0.0-rc5-unknown-x86_64-linux-gnu
2020-07-25 10:52:31 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-07-25 10:52:31 📋 Chain specification: Local Testnet
2020-07-25 10:52:31 🏷  Node name: MyNode02
2020-07-25 10:52:31 👤 Role: AUTHORITY
2020-07-25 10:52:31 💾 Database: RocksDb at /tmp/node02/chains/local_testnet/db
2020-07-25 10:52:31 ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-07-25 10:52:31 🔨 Initializing Genesis block/state (state: 0x5327…59d5, header-hash: 0x60b2…88ec)
2020-07-25 10:52:31 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-07-25 10:52:31 ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-07-25 10:52:31 📦 Highest known block at #0
2020-07-25 10:52:31 Using default protocol ID "sup" because none is configured in the chain specs
2020-07-25 10:52:31 🏷  Local node identity is: 12D3KooWSn4GHHQdmTtrJE4h2dRqm5xV5BG3FZsnrn6HQEr6hShM (legacy representation: QmSFpf3SgDy2WQmes41FGusqpZKr7PfS7aC9CRMLYdJwWF)
2020-07-25 10:52:31 Received message on non-registered protocol: [70, 82, 78, 75]
2020-07-25 10:52:31 🔍 Discovered new external address for our node: /ip4/127.0.0.1/tcp/30334/p2p/12D3KooWSn4GHHQdmTtrJE4h2dRqm5xV5BG3FZsnrn6HQEr6hShM
2020-07-25 10:52:31 🔍 Discovered new external address for our node: /ip4/10.1.10.99/tcp/30334/p2p/12D3KooWSn4GHHQdmTtrJE4h2dRqm5xV5BG3FZsnrn6HQEr6hShM
2020-07-25 10:52:36 ✨ Imported #1 (0xfc20…1be1)
2020-07-25 10:52:36 💤 Idle (1 peers), best: #1 (0xfc20…1be1), finalized #0 (0x60b2…88ec), ⬇ 1.2kiB/s ⬆ 1.2kiB/s
```

The final lines shows that your node has peered with another (**`1 peers`**), and they have produced
a block (**`best: #1 (0xfc20…1be1)`**).

Now you're ready to add keys to its keystore by following the process (in the previous section) just
like you did for the first node.

> If you're inserting keys with the UI, you must connect the UI to the second node's WebSocket
> endpoint before inserting the second node's keys.

> A node will not be able to produce blocks if it has not added its Aura key.

> Block finalization can only happen if more than two-thirds of the validators have added their
> GRANDPA keys to their keystores. Since this network was configured with two validators (in the
> chain spec), block finalization can occur after the second node has added its keys (i.e. 50% < 66%
> < 100%).

> Reminder: All validators must be using identical chain specifications in order to peer. You should
> see the same genesis block and state root hashes.

You will notice that even after you add the keys for the second node no block finalization has
happened (**`finalized #0 (0x60b2…88ec)`**). Substrate nodes require a restart after inserting a
GRANDPA key. Kill your nodes and restart them with the same commands you used previously. Now blocks
should be finalized.

```
2020-07-25 10:56:17 Substrate Node
2020-07-25 10:56:17 ✌️  version 2.0.0-rc5-unknown-x86_64-linux-gnu
2020-07-25 10:56:17 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-07-25 10:56:17 📋 Chain specification: Local Testnet
2020-07-25 10:56:17 🏷  Node name: MyNode02
2020-07-25 10:56:17 👤 Role: AUTHORITY
2020-07-25 10:56:17 💾 Database: RocksDb at /tmp/node02/chains/local_testnet/db
2020-07-25 10:56:17 ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-07-25 10:56:17 📦 Highest known block at #19
2020-07-25 10:56:17 Using default protocol ID "sup" because none is configured in the chain specs
2020-07-25 10:56:17 🏷  Local node identity is: 12D3KooWSn4GHHQdmTtrJE4h2dRqm5xV5BG3FZsnrn6HQEr6hShM (legacy representation: QmSFpf3SgDy2WQmes41FGusqpZKr7PfS7aC9CRMLYdJwWF)
2020-07-25 10:56:17 Received message on non-registered protocol: [70, 82, 78, 75]
2020-07-25 10:56:17 🔍 Discovered new external address for our node: /ip4/127.0.0.1/tcp/30334/p2p/12D3KooWSn4GHHQdmTtrJE4h2dRqm5xV5BG3FZsnrn6HQEr6hShM
2020-07-25 10:56:17 🔍 Discovered new external address for our node: /ip4/10.1.10.99/tcp/30334/p2p/12D3KooWSn4GHHQdmTtrJE4h2dRqm5xV5BG3FZsnrn6HQEr6hShM
2020-07-25 10:56:18 🙌 Starting consensus session on top of parent 0xd882a26e1d28a9b5a3a5281456138d5755b708284a0b96005767623ae63d6b02
2020-07-25 10:56:18 Timeout fired waiting for transaction pool at block #19. Proceeding with production.
2020-07-25 10:56:18 🎁 Prepared block for proposing at 20 [hash: 0x52ff2f4611b2e929f167acf514e59ba0cc95d57209df287eb154c9c48686f16d; parent_hash: 0xd882…6b02; extrinsics (1): [0x9bc5…aca0]]
2020-07-25 10:56:18 🔖 Pre-sealed block for proposal at 20. Hash now 0x7501f730efa3f37978adb513c1c8809713f99d02ac67794c5bc93aa468d7fcdb, previously 0x52ff2f4611b2e929f167acf514e59ba0cc95d57209df287eb154c9c48686f16d.
2020-07-25 10:56:18 ✨ Imported #20 (0x7501…fcdb)
2020-07-25 10:56:22 💤 Idle (1 peers), best: #20 (0x7501…fcdb), finalized #18 (0xfb39…1a64), ⬇ 2.2kiB/s ⬆ 2.1kiB/s
```

## You're Finished

Congratulations! You've started your own blockchain!

In this tutorial you've learned to generate your own keypairs, create a custom chain spec that uses
those keypairs, and start a private network based on your custom chain spec.

<!-- TODO link to the followup tutorial about starting a 3 node network using the demo substrate node
Details in https://github.com/substrate-developer-hub/tutorials/issues/16-->

### Learn More

That big Wasm blob we encountered in the chain spec was was necessary to enable forkless upgrades.
Learn more about how the [executor](../../knowledgebase/advanced/executor) uses on-chain Wasm.

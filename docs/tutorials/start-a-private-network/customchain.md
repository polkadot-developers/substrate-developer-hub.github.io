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
  [JSON-RPC proxy](../../knowledgebase/getting-started/glossary#json-rpc-proxy-crate), but that topic is out of the
  scope of this tutorial.

You should see the console outputs something as follows:

```bash
2020-06-26 11:41:24 Substrate Node
2020-06-26 11:41:24 ✌️  version 2.0.0-rc4-29f29b9-x86_64-linux-gnu
2020-06-26 11:41:24 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-06-26 11:41:24 📋 Chain specification: Local Testnet
2020-06-26 11:41:24 🏷  Node name: MyNode01
2020-06-26 11:41:24 👤 Role: AUTHORITY
2020-06-26 11:41:24 💾 Database: RocksDb at /tmp/node01/chains/local_testnet/db
2020-06-26 11:41:24 ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-06-26 11:41:24 🔨 Initializing Genesis block/state (state: 0x321d…1e25, header-hash: 0x3579…2dd2)
2020-06-26 11:41:24 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-06-26 11:41:24 ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-06-26 11:41:24 📦 Highest known block at #0
2020-06-26 11:41:24 Using default protocol ID "sup" because none is configured in the chain specs
2020-06-26 11:41:24 🏷  Local node identity is: 12D3KooWNjdj9N1nkau1wVbo4E3T3CSNTsvFEBiBTPB7VTPabREL (legacy representation: QmemnA8JEW4yKsQJBcWS9LLAgwpQ1bUqczB6s1PugE2FbU)
2020-06-26 11:41:24 〽️ Prometheus server started at 127.0.0.1:9615
2020-06-26 11:41:29 💤 Idle (0 peers), best: #0 (0x3579…2dd2), finalized #0 (0x3579…2dd2), ⬇ 0 ⬆ 0
2020-06-26 11:41:34 💤 Idle (0 peers), best: #0 (0x3579…2dd2), finalized #0 (0x3579…2dd2), ⬇ 0 ⬆ 0
```

## Add Keys to Keystore

Once your node is running, you will again notice that no blocks are being produced. At this point,
you need to add your keys into the keystore. Remember you will need to complete these steps for each
node in your network.

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

You've now successfully inserted your **aura** key. You can repeat those steps to insert your
**grandpa** key (the **ed25519** key)

![Inserting a Grandpa key using Apps](assets/tutorials/private-network/private-network-apps-insert-key.png)

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

You can also insert a key into the keystore by using [`curl`](https://curl.haxx.se/) from the command
line. This approach may be preferable in a production setting, where you may be using a cloud-based
virtual private server.

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
2020-06-26 11:59:15 Substrate Node
2020-06-26 11:59:15 ✌️  version 2.0.0-rc4-29f29b9-x86_64-linux-gnu
2020-06-26 11:59:15 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-06-26 11:59:15 📋 Chain specification: Local Testnet
2020-06-26 11:59:15 🏷  Node name: MyNode02
2020-06-26 11:59:15 👤 Role: AUTHORITY
2020-06-26 11:59:15 💾 Database: RocksDb at /tmp/node02/chains/local_testnet/db
2020-06-26 11:59:15 ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-06-26 11:59:16 🔨 Initializing Genesis block/state (state: 0x321d…1e25, header-hash: 0x3579…2dd2)
2020-06-26 11:59:16 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-06-26 11:59:16 ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-06-26 11:59:16 📦 Highest known block at #0
2020-06-26 11:59:16 Using default protocol ID "sup" because none is configured in the chain specs
2020-06-26 11:59:16 🏷  Local node identity is: 12D3KooWP1rFTPCK5y8M5kojZPGUDQSaAHu1ZhMD5rQjjhH3WK8G (legacy representation: QmfB1GxdWQsgXgmubM5u5Vqdn6raR2f9yNhvDg2rtT3bhs)
2020-06-26 11:59:16 Received message on non-registered protocol: [70, 82, 78, 75]
2020-06-26 11:59:16 🔍 Discovered new external address for our node: /ip4/127.0.0.1/tcp/30334/p2p/12D3KooWP1rFTPCK5y8M5kojZPGUDQSaAHu1ZhMD5rQjjhH3WK8G
2020-06-26 11:59:16 🔍 Discovered new external address for our node: /ip4/192.168.0.113/tcp/30334/p2p/12D3KooWP1rFTPCK5y8M5kojZPGUDQSaAHu1ZhMD5rQjjhH3WK8G
2020-06-26 11:59:21 💤 Idle (1 peers), best: #0 (0x3579…2dd2), finalized #0 (0x3579…2dd2), ⬇ 1.0kiB/s ⬆ 1.0kiB/s
2020-06-26 11:59:24 ✨ Imported #1 (0x7390…360a)
2020-06-26 11:59:26 💤 Idle (1 peers), best: #1 (0x7390…360a), finalized #0 (0x3579…2dd2), ⬇ 0.2kiB/s ⬆ 0.1kiB/s
```

The final lines shows that your node has peered with another (**`1 peers`**), and they have produced
a block (**`best: #1 (0x7390…360a)`**).

Now you're ready to add keys to its keystore by following the process (in the previous section) just
like you did for the first node.

> If you're inserting keys with the UI, you must connect the UI to the second node's WebSocket
> endpoint before inserting the second node's keys.

> Reminder: All validators must be using identical chain specifications in order to peer. You should
> see the same genesis block and state root hashes.

You will notice that even after you add the keys for the second node no block finalization has
happened (**`finalized #0 (0x3579…2dd2)`**). Substrate nodes require a restart after inserting a
grandpa key. Kill your nodes and restart them with the same commands you used previously. Now blocks
should be finalized.

```
2020-06-26 12:02:15 Substrate Node
2020-06-26 12:02:15 ✌️  version 2.0.0-rc4-29f29b9-x86_64-linux-gnu
2020-06-26 12:02:15 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-06-26 12:02:15 📋 Chain specification: Local Testnet
2020-06-26 12:02:15 🏷  Node name: MyNode02
2020-06-26 12:02:15 👤 Role: AUTHORITY
2020-06-26 12:02:15 💾 Database: RocksDb at /tmp/node02/chains/local_testnet/db
2020-06-26 12:02:15 ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-06-26 12:02:15 📦 Highest known block at #16
2020-06-26 12:02:15 Using default protocol ID "sup" because none is configured in the chain specs
2020-06-26 12:02:15 🏷  Local node identity is: 12D3KooWP1rFTPCK5y8M5kojZPGUDQSaAHu1ZhMD5rQjjhH3WK8G (legacy representation: QmfB1GxdWQsgXgmubM5u5Vqdn6raR2f9yNhvDg2rtT3bhs)
2020-06-26 12:02:15 Received message on non-registered protocol: [70, 82, 78, 75]
2020-06-26 12:02:16 🔍 Discovered new external address for our node: /ip4/192.168.0.113/tcp/30334/p2p/12D3KooWP1rFTPCK5y8M5kojZPGUDQSaAHu1ZhMD5rQjjhH3WK8G
2020-06-26 12:02:18 🙌 Starting consensus session on top of parent 0x03e6207c6c8ea179ec0fc14cf6d186e9d2de0db8dff535047a44b8cf011182ec
2020-06-26 12:02:18 Timeout fired waiting for transaction pool at block #16. Proceeding with production.
2020-06-26 12:02:18 🎁 Prepared block for proposing at 17 [hash: 0x60ea2aa720187cf9fabd39496f3799434d0589f961bd497ee0b58a262c65df80; parent_hash: 0x03e6…82ec; extrinsics (1): [0x46e1…e098]]
2020-06-26 12:02:18 🔖 Pre-sealed block for proposal at 17. Hash now 0x9acb23301b81f017289e0657a768170a9bcd2aa37418fec8036fadb97f54ce8d, previously 0x60ea2aa720187cf9fabd39496f3799434d0589f961bd497ee0b58a262c65df80.
2020-06-26 12:02:18 ✨ Imported #17 (0x9acb…ce8d)
2020-06-26 12:02:20 💤 Idle (1 peers), best: #17 (0x9acb…ce8d), finalized #15 (0x806e…c94a), ⬇ 1.8kiB/s ⬆ 2.0kiB/s
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

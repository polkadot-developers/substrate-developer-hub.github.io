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
2020-05-28 13:43:02 Substrate Node
2020-05-28 13:43:02 ✌️  version 2.0.0-rc2-83d7157-x86_64-linux-gnu
2020-05-28 13:43:02 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-05-28 13:43:02 📋 Chain specification: Local Testnet
2020-05-28 13:43:02 🏷  Node name: MyNode01
2020-05-28 13:43:02 👤 Role: AUTHORITY
2020-05-28 13:43:02 💾 Database: RocksDb at /tmp/node01/chains/local_testnet/db
2020-05-28 13:43:02 ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-05-28 13:43:03 🔨 Initializing Genesis block/state (state: 0x7f04…10af, header-hash: 0x4328…9cc8)
2020-05-28 13:43:03 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-05-28 13:43:03 ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-05-28 13:43:03 📦 Highest known block at #0
2020-05-28 13:43:03 Using default protocol ID "sup" because none is configured in the chain specs
2020-05-28 13:43:03 🏷  Local node identity is: 12D3KooWMNy8bTtD81UCv5Wm44iHeCpygr8LAvCRcAdq4mA5PPie (legacy representation: QmXHC17m265EJK51YpF8uq5wmQEsS86av66vpx9oeckuBW)
2020-05-28 13:43:03 〽️ Prometheus server started at 127.0.0.1:9615
2020-05-28 13:43:08 💤 Idle (0 peers), best: #0 (0x4328…9cc8), finalized #0 (0x4328…9cc8), ⬇ 0 ⬆ 0
2020-05-28 13:43:13 💤 Idle (0 peers), best: #0 (0x4328…9cc8), finalized #0 (0x4328…9cc8), ⬇ 0 ⬆ 0
2020-05-28 13:43:18 💤 Idle (0 peers), best: #0 (0x4328…9cc8), finalized #0 (0x4328…9cc8), ⬇ 0 ⬆ 0
```

## Add Keys to Keystore

Once your node is running, you will again notice that no blocks are being produced. At this point,
you need to add your keys into the keystore. Remember you will need to complete these steps for each
node in your network.

### Add Keys with the Polkadot-JS App UI

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
2020-05-28 13:45:41 Substrate Node
2020-05-28 13:45:41 ✌️  version 2.0.0-rc2-83d7157-x86_64-linux-gnu
2020-05-28 13:45:41 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-05-28 13:45:41 📋 Chain specification: Local Testnet
2020-05-28 13:45:41 🏷  Node name: MyNode02
2020-05-28 13:45:41 👤 Role: AUTHORITY
2020-05-28 13:45:41 💾 Database: RocksDb at /tmp/node02/chains/local_testnet/db
2020-05-28 13:45:41 ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-05-28 13:45:41 🔨 Initializing Genesis block/state (state: 0x7f04…10af, header-hash: 0x4328…9cc8)
2020-05-28 13:45:41 👴 Loading GRANDPA authority set from genesis on what appears to be first startup.
2020-05-28 13:45:41 ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch
2020-05-28 13:45:41 📦 Highest known block at #0
2020-05-28 13:45:41 Using default protocol ID "sup" because none is configured in the chain specs
2020-05-28 13:45:41 🏷  Local node identity is: 12D3KooWEnRZxA2Uu2p2LNgttWy6QX6NyR4tFgwn5boqRcU2cqkx (legacy representation: QmXgKEtm3m6zgNpgrGQKk7yxZNCw6ivb64Pz2q9nso4W87)
2020-05-28 13:45:45 🔍 Discovered new external address for our node: /ip4/127.0.0.1/tcp/30334/p2p/12D3KooWEnRZxA2Uu2p2LNgttWy6QX6NyR4tFgwn5boqRcU2cqkx
2020-05-28 13:45:46 💤 Idle (1 peers), best: #0 (0x4328…9cc8), finalized #0 (0x4328…9cc8), ⬇ 1.1kiB/s ⬆ 1.1kiB/s
2020-05-28 13:45:48 ✨ Imported #1 (0xa6d7…4d0e)
2020-05-28 13:45:51 💤 Idle (1 peers), best: #1 (0xa6d7…4d0e), finalized #0 (0x4328…9cc8), ⬇ 0.2kiB/s ⬆ 0.2kiB/s
```

The final lines shows that your node has peered with another (**`1 peers`**), and they have produced
a block (**`best: #1 (0xa6d7…4d0e)`**).

Now you're ready to add keys to its keystore by following the process (in the previous section) just
like you did for the first node.

> If you're inserting keys with the UI, you must connect the UI to the second node's WebSocket
> endpoint before inserting the second node's keys.

> Reminder: All validators must be using identical chain specifications in order to peer. You should
> see the same genesis block and state root hashes.

You will notice that even after you add the keys for the second node no block finalization has
happened (**`finalized #0 (0x1b54…0198)`**). Substrate nodes require a restart after inserting a
grandpa key. Kill your nodes and restart them with the same commands you used previously. Now blocks
should be finalized.

```
2020-05-28 13:53:12 Substrate Node
2020-05-28 13:53:12 ✌️  version 2.0.0-rc2-83d7157-x86_64-linux-gnu
2020-05-28 13:53:12 ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
2020-05-28 13:53:12 📋 Chain specification: Local Testnet
2020-05-28 13:53:12 🏷  Node name: MyNode02
2020-05-28 13:53:12 👤 Role: AUTHORITY
2020-05-28 13:53:12 💾 Database: RocksDb at /tmp/node02/chains/local_testnet/db
2020-05-28 13:53:12 ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
2020-05-28 13:53:12 📦 Highest known block at #42
2020-05-28 13:53:12 Using default protocol ID "sup" because none is configured in the chain specs
2020-05-28 13:53:12 🏷  Local node identity is: 12D3KooWEnRZxA2Uu2p2LNgttWy6QX6NyR4tFgwn5boqRcU2cqkx (legacy representation: QmXgKEtm3m6zgNpgrGQKk7yxZNCw6ivb64Pz2q9nso4W87)
2020-05-28 13:53:14 🔍 Discovered new external address for our node: /ip4/127.0.0.1/tcp/30334/p2p/12D3KooWEnRZxA2Uu2p2LNgttWy6QX6NyR4tFgwn5boqRcU2cqkx
2020-05-28 13:53:18 💤 Idle (1 peers), best: #42 (0xf09d…dbfa), finalized #40 (0x0e49…3118), ⬇ 1.7kiB/s ⬆ 1.7kiB/s
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

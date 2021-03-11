---
title: Creating Your Private Network
---

With your custom chain spec created and distributed to all participants, you're ready to launch your
own custom chain. In this section it is no longer required to use a single physical machine or a
single binary.

## First Participant Starts a Bootnode

You've completed all the necessary prep work and you're now ready to launch your chain. This process
is very similar to when you launched a chain earlier, as Alice and Bob. It's important to start with
a clean base path, so if you plan to use the same path that you've used previously, please delete
all contents from that directory.

The first participant can launch her node with:

```bash
# purge chain (only required for new/modified dev chainspec)
./target/release/node-template purge-chain --base-path /tmp/node01 --chain local
```
```bash
# start node01
./target/release/node-template \
  --base-path /tmp/node01 \
  --chain ./customSpecRaw.json \
  --port 30333 \
  --ws-port 9945 \
  --rpc-port 9933 \
  --telemetry-url 'wss://telemetry.polkadot.io/submit/ 0' \
  --validator \
  --rpc-methods Unsafe \
  --name MyNode01
```

Here are some differences from when we launched as Alice.

- I've omitted the `--alice` flag. Instead we will insert our own custom keys into the keystore
  through the RPC shortly.
- The `--chain` flag has changed to use our custom chain spec.
- I've added the optional `--name` flag. You may use it to give your node a human-readable name in
  the telemetry UI.
- The optional `--rpc-methods Unsafe` flag has been added. As the name indicates, this flag is not
  safe to use in a production setting, but it allows this tutorial to stay focused on the topic at
  hand.

You should see the console outputs something as follows:

```bash
2021-03-10 18:32:15  Substrate Node    
2021-03-10 18:32:15  ✌️  version 3.0.0-1c5b984-x86_64-linux-gnu    
2021-03-10 18:32:15  ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2021    
2021-03-10 18:32:15  📋 Chain specification: Local Testnet    
2021-03-10 18:32:15  🏷 Node name: MyNode01    
2021-03-10 18:32:15  👤 Role: AUTHORITY    
2021-03-10 18:32:15  💾 Database: RocksDb at /tmp/node01/chains/local_testnet/db    
2021-03-10 18:32:15  ⛓  Native runtime: node-template-100 (node-template-1.tx1.au1)    
2021-03-10 18:32:16  🔨 Initializing Genesis block/state (state: 0xea47…9ba8, header-hash: 0x9d07…7cce)    
2021-03-10 18:32:16  👴 Loading GRANDPA authority set from genesis on what appears to be first startup.    
2021-03-10 18:32:16  ⏱  Loaded block-time = 6000 milliseconds from genesis on first-launch    
2021-03-10 18:32:16  Using default protocol ID "sup" because none is configured in the chain specs    
2021-03-10 18:32:16  🏷 Local node identity is: 12D3KooWJvVUoAa7R8gjCSQ45x69Ahh3HcdVSH1dvpcA52vKawHL    
2021-03-10 18:32:16  📦 Highest known block at #0    
2021-03-10 18:32:16  〽️ Prometheus server started at 127.0.0.1:9615    
2021-03-10 18:32:16  Listening for new connections on 127.0.0.1:9944.    
2021-03-10 18:32:21  💤 Idle (0 peers), best: #0 (0x9d07…7cce), finalized #0 (0x9d07…7cce), ⬇ 0 ⬆ 0    
2021-03-10 18:32:26  💤 Idle (0 peers), best: #0 (0x9d07…7cce), finalized #0 (0x9d07…7cce), ⬇ 0 ⬆ 0  
```

## Add Keys to Keystore

Once your node is running, you will again notice that no blocks are being produced. At this point,
you need to add your keys into the keystore. Remember you will need to complete these steps for each
node in your network. You will add two types of keys for each node: Aura and GRANDPA keys. Aura keys
are necessary for
[block _production_](https://substrate.dev/docs/en/knowledgebase/getting-started/glossary#author);
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

![Inserting a GRANDPA key using Apps](assets/tutorials/private-network/private-network-apps-insert-key-gran.png)

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
curl http://localhost:9933 -H "Content-Type:application/json;charset=utf-8" -d "@/path/to/file"
```

If you enter the command and parameters correctly, the node will return a JSON response as follows.

```json
{ "jsonrpc": "2.0", "result": null, "id": 1 }
```

Make sure you delete the file that contains the keys when you are done.

## Subsequent Participants Join

Subsequent validators can now join the network. This can be done by specifying the `--bootnodes`
parameter as Bob did previously.

```bash
# purge chain (only required for new/modified dev chainspec)
./target/release/node-template purge-chain --base-path /tmp/node02 --chain local
```
```bash
# start node02
./target/release/node-template \
  --base-path /tmp/node02 \
  --chain ./customSpecRaw.json \
  --port 30334 \
  --ws-port 9946 \
  --rpc-port 9934 \
  --telemetry-url 'wss://telemetry.polkadot.io/submit/ 0' \
  --validator \
  --rpc-methods Unsafe \
  --name MyNode02 \
  --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWAvdwXzjmRpkHpz8PzUTaX1o23SdpgAWVyTGMSQ68QXK6
  # you must fill the correct info in the line above:
  # --bootnodes /ip4/<IP Address>/tcp/<Port>/p2p/<Peer ID>
```

As before, we specify another `base-path`, give it another `name`, and also specify this node as a
`validator`.

> Now you must also set the authoring keys in this node, just as we did 
> [for the first node](#add-keys-to-keystore). Note that you will need to communicate with your node
> on the correct `ws-port` (so setting the app UI and submitting `curl` to the right port is critical)

> A node will not be able to produce blocks if it has not added its Aura key.

> Block finalization can only happen if more than two-thirds of the validators have added their
> GRANDPA keys to their keystores. Since this network was configured with two validators (in the
> chain spec), block finalization can occur after the second node has added its keys (i.e. 50% < 66%
> < 100%).

> Reminder: All validators must be using identical chain specifications in order to peer. You should
> see the same genesis block and state root hashes.

Once the second node is up *and* it has it's authoring keys, you should see both nodes reporting block authoring:

```bash
2021-03-10 19:02:43  Substrate Node    
2021-03-10 19:02:43  ✌️  version 3.0.0-1c5b984-x86_64-linux-gnu    
2021-03-10 19:02:43  ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2021    
2021-03-10 19:02:43  📋 Chain specification: Local Testnet    
2021-03-10 19:02:43  🏷 Node name: MyNode02    
2021-03-10 19:02:43  👤 Role: AUTHORITY    
2021-03-10 19:02:43  💾 Database: RocksDb at /tmp/node02/chains/local_testnet/db    
2021-03-10 19:02:43  ⛓  Native runtime: node-template-100 (node-template-1.tx1.au1)    
2021-03-10 19:02:43  Using default protocol ID "sup" because none is configured in the chain specs    
2021-03-10 19:02:43  🏷 Local node identity is: 12D3KooWAvdwXzjmRpkHpz8PzUTaX1o23SdpgAWVyTGMSQ68QXK6    
2021-03-10 19:02:43  📦 Highest known block at #0    
2021-03-10 19:02:44  Listening for new connections on 127.0.0.1:9946.    
2021-03-10 19:02:44  🔍 Discovered new external address for our node: /ip4/192.168.42.203/tcp/30334/p2p/12D3KooWAvdwXzjmRpkHpz8PzUTaX1o23SdpgAWVyTGMSQ68QXK6    
2021-03-10 19:02:48  🙌 Starting consensus session on top of parent 0x9d07d1757a9ca248e58141ce52a11fca37f71007dec16650b87a853f0d4c7cce    
2021-03-10 19:02:48  🎁 Prepared block for proposing at 1 [hash: 0x33484d425b9cb0708d854e8c331cb012ffb1faf86fd79637a92f4329cdc083cf; parent_hash: 0x9d07…7cce; extrinsics (1): [0x9f5f…99fe]]    
2021-03-10 19:02:48  🔖 Pre-sealed block for proposal at 1. Hash now 0x771ebaa4ec3cf588ce0f5c72c9afc1c7dd2c8c7b88b221e317b5b270ff26ad9b, previously 0x33484d425b9cb0708d854e8c331cb012ffb1faf86fd79637a92f4329cdc083cf.    
2021-03-10 19:02:48  ✨ Imported #1 (0x771e…ad9b)    
2021-03-10 19:02:49  💤 Idle (1 peers), best: #1 (0x771e…ad9b), finalized #0 (0x9d07…7cce), ⬇ 0.6kiB/s ⬆ 0.7kiB/s    
2021-03-10 19:02:54  🙌 Starting consensus session on top of parent 0x771ebaa4ec3cf588ce0f5c72c9afc1c7dd2c8c7b88b221e317b5b270ff26ad9b    
2021-03-10 19:02:54  💤 Idle (1 peers), best: #1 (0x771e…ad9b), finalized #0 (0x9d07…7cce), ⬇ 25 B/s ⬆ 32 B/s    
2021-03-10 19:02:54  🎁 Prepared block for proposing at 2 [hash: 0x9941f9691b205476ea57743e2d04430670afa661af925be623be3eb2e36fc861; parent_hash: 0x771e…ad9b; extrinsics (1): [0xc720…a736]]    
2021-03-10 19:02:54  🔖 Pre-sealed block for proposal at 2. Hash now 0xb2cadabf4ef2c713677da97db0d102c5b95939692e575fac33c349ea3a7884c6, previously 0x9941f9691b205476ea57743e2d04430670afa661af925be623be3eb2e36fc861.    
2021-03-10 19:02:54  ✨ Imported #2 (0xb2ca…84c6)    
2021-03-10 19:02:59  💤 Idle (1 peers), best: #2 (0xb2ca…84c6), finalized #0 (0x9d07…7cce), ⬇ 45 B/s ⬆ 0.1kiB/s    
2021-03-10 19:03:04  💤 Idle (1 peers), best: #2 (0xb2ca…84c6), finalized #0 (0x9d07…7cce), ⬇ 52 B/s ⬆ 57 B/s    
```

The final lines shows that your node has peered with another (**`1 peers`**), and they have produced
a block (**`best: #2 (0xb2ca…84c6)`**).

You will notice that even after you add the keys for the second node no block finalization has
happened (**`finalized #0 (0x9d07…7cce)`**). Substrate nodes require a restart after inserting a
GRANDPA key. Kill your nodes and restart them with the same commands you used previously. Now blocks
should be finalized.

```bash
Sep 24 13:37:33.863  INFO Substrate Node
Sep 24 13:37:33.864  INFO ✌️  version 2.0.0-24da767-x86_64-linux-gnu
Sep 24 13:37:33.864  INFO ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2020
Sep 24 13:37:33.864  INFO 📋 Chain specification: Local Testnet
Sep 24 13:37:33.864  INFO 🏷  Node name: MyNode02
Sep 24 13:37:33.864  INFO 👤 Role: AUTHORITY
Sep 24 13:37:33.864  INFO 💾 Database: RocksDb at /tmp/node02/chains/local_testnet/db
Sep 24 13:37:33.864  INFO ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)
Sep 24 13:37:33.918  WARN Using default protocol ID "sup" because none is configured in the chain specs
Sep 24 13:37:33.918  INFO 🏷  Local node identity is: 12D3KooWBHwymjRsTipVZbGqiZV2rtxJiwTjLzPKZ7rYMsa9poUn (legacy representation: 12D3KooWBHwymjRsTipVZbGqiZV2rtxJiwTjLzPKZ7rYMsa9poUn)
Sep 24 13:37:33.942  INFO 📦 Highest known block at #23
Sep 24 13:37:33.973  INFO Listening for new connections on 127.0.0.1:9945.
Sep 24 13:37:34.486  INFO 🔍 Discovered new external address for our node: /ip4/127.0.0.1/tcp/30334/p2p/12D3KooWBHwymjRsTipVZbGqiZV2rtxJiwTjLzPKZ7rYMsa9poUn
Sep 24 13:37:36.593  INFO ✨ Imported #24 (0xa7e8…7596)
Sep 24 13:37:38.976  INFO 💤 Idle (1 peers), best: #24 (0xa7e8…7596), finalized #22 (0x753e…ddb0), ⬇ 1.5kiB/s ⬆ 1.5kiB/s
```

## You're Finished

Congratulations! You've started your own blockchain!

In this tutorial you've learned to generate your own keypairs, create a custom chain spec that uses
those keypairs, and start a private network based on your custom chain spec.

<!-- TODO link to the followup tutorial about starting a 3 node network using the demo substrate node
Details in https://github.com/substrate-developer-hub/tutorials/issues/16-->

### Learn More

That big Wasm blob we encountered in the chain spec was necessary to enable forkless upgrades.
Learn more about how the [executor](../../knowledgebase/advanced/executor) uses on-chain Wasm.

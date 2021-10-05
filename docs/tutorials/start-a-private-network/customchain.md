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
# purge chain (only required for new/modified dev chain spec)
./target/release/node-template purge-chain --base-path /tmp/node01 --chain local -y
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

> Here you must take note of the **node identity**: `12D3KooWJvVUoAa7R8gjCSQ45x69Ahh3HcdVSH1dvpcA52vKawHL`
> and the **IP address** `127.0.0.1` and p2p port `--port = 30333`. These values are for this specific
> example, but for your node, they will be different and **required** for other nodes to directly connect
>  to it (without a bootnode in the chain spec, as we removed in the flags before)

## Add Keys to Keystore

Once your node is running, you will again notice that no blocks are being produced. At this point,
you need to add your keys into the keystore. Remember you will need to complete these steps for each
node in your network. You will add two types of keys for each node: Aura and GRANDPA keys. Aura keys
are necessary for
[block _production_](https://substrate.dev/docs/en/knowledgebase/getting-started/glossary#author);
GRANDPA keys are necessary for
[block _finalization_](https://substrate.dev/docs/en/knowledgebase/getting-started/glossary#finality).

### Option 1: Use the Polkadot-JS Apps UI

You can use the Apps UI to insert your keys into the keystore. Navigate to "Developer --> RPC Call". Choose
"author" and "insertKey". The fields can be filled like this:

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

### Option 3: Use the `key` command

Alternatively, you can insert a key saved to a local file using the `key` command:

```bash
# Insert the key from /path/to/key/file into the keystore
# for <aura> key type, default <Sr25519> crypto scheme is applied
./target/release/node-template key insert --base-path /tmp/node01 --chain local --key-type aura  --suri /path/to/key/file

# for <gran> key type, need to specify <Ed25519> crypto scheme!
./target/release/node-template key insert --base-path /tmp/node01 --chain local --key-type gran  --scheme Ed25519 --suri /path/to/key/file

```

### Verify Keys in the Keystore (Optional)

Optionally, If you would like to check that your keys are now loaded, you can view the keystore files that should
now exists for your `node01`. These are found in the following (default example) location:

```bash
# The path stems from `--base-path` and ID from `chain_spec.rs` ID field.
# Keys are then in `chains/<chain ID>/keystore :
ls /tmp/node01/chains/local_testnet/keystore
```
```bash
## list of keystore files:
617572619effc1668ca381c242885516ec9fa2b19c67b6684c02a8a3237b6862e5c8cd7e
6772616eb48004c6e1625282313b07d1c9950935e86894a2e4f21fb1ffee9854d180c781

# read a keystore file (our demo seed 1 was used)
cat /tmp/node01/chains/local_testnet/keystore/617572619effc1668ca381c242885516ec9fa2b19c67b6684c02a8a3237b6862e5c8cd7e
"clip organ olive upper oak void inject side suit toilet stick narrow"
```
Notice there are two keystores, as expected as we added two keys to our node.
This example used [pair 1](keygen#pair-1) from the well known seeds here, and
will use [pair 2](keygen#pair-2) for our next node, where your keys may differ.

<!-- TODO: update below with example of successful use (not working for me at time of writing) -->

<!--
You can also set a non-standard keystore file for your node with the flags:
  keystore-path <PATH> - Specify custom keystore path
  keystore-uri <keystore-uri> - Specify custom URIs to connect to for keystore-services
-->

## Subsequent Participants Join

Subsequent validators can now join the network. This can be done by specifying the `--bootnodes`
parameter as Bob did previously.

```bash
# purge chain (only required for new/modified dev chain spec)
./target/release/node-template purge-chain --base-path /tmp/node02 --chain local -y

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
  # you MUST fill the correct info in the line above:
  # --bootnodes /ip4/<IP Address>/tcp/<p2p Port>/p2p/<Peer ID>
```

> If you didn't set the correct node ID gathered from another running with the same chain spec,
> but only the right IP - you will get errors of the form:
> `💔 The bootnode you want to connect to at ... provided a different peer ID than the one you expect: ...`

As before, we specify another `base-path`, give it another `name`, and also specify this node as a
`validator`.

> **Block production**: Now you *must* also set the authoring keys in this node, just as we did
> [for the first node](#add-keys-to-keystore). Note that you will need to communicate with your node
> on the correct `ws-port` (so setting the app UI and submitting `curl` to the right port is critical)
> A node will not be able to produce blocks if it has not added its Aura key!
>
> **Block finalization**: This can *only* happen if more than two-thirds of the validators have added their
> GRANDPA keys to their keystores. Since this network was configured with two validators (in the
> chain spec), block finalization can occur after the second node has added its keys (i.e. 50% < 66%
> < 100%).

> **Reminder:** All validators must be using *identical chain specifications* in order to peer. You should
> see the same genesis block and state root hashes.

Once the second node is running *and* it has an authoring key, you should see both nodes reporting block authoring:

```bash
2021-03-18 16:43:10  Substrate Node
2021-03-18 16:43:10  ✌️  version 3.0.0-c528fd2-x86_64-linux-gnu
2021-03-18 16:43:10  ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2021
2021-03-18 16:43:10  📋 Chain specification: Local Testnet
2021-03-18 16:43:10  🏷 Node name: MyNode02
2021-03-18 16:43:10  👤 Role: AUTHORITY
2021-03-18 16:43:10  💾 Database: RocksDb at /tmp/node02/chains/local_testnet/db
2021-03-18 16:43:10  ⛓  Native runtime: node-template-100 (node-template-1.tx1.au1)
2021-03-18 16:43:10  Using default protocol ID "sup" because none is configured in the chain specs
2021-03-18 16:43:10  🏷 Local node identity is: 12D3KooWDfpXmPtsvLCFTh4mKybYi6MvDMDiUrnRDcGZiSTR2GHp
2021-03-18 16:43:10  📦 Highest known block at #1
2021-03-18 16:43:10  Listening for new connections on 127.0.0.1:9946.
2021-03-18 16:43:11  🔍 Discovered new external address for our node: /ip4/127.0.0.1/tcp/30334/p2p/12D3KooWDfpXmPtsvLCFTh4mKybYi6MvDMDiUrnRDcGZiSTR2GHp
2021-03-18 16:43:12  🙌 Starting consensus session on top of parent 0x700fda8b9c7574553eccc8acc72e2dec59e40711e743223d67c3e5b57e1f76ef
2021-03-18 16:43:12  ♻️  Reorg on #1,0x700f…76ef to #2,0xe111…c084, common ancestor #0,0x2776…8ba7
2021-03-18 16:43:12  ✨ Imported #2 (0xe111…c084)
2021-03-18 16:43:12  Timeout fired waiting for transaction pool at block #1. Proceeding with production.
2021-03-18 16:43:12  🎁 Prepared block for proposing at 2 [hash: 0xc590a846ff17871ffdcdd670914321f667cd6ad0b898bfb6d25f7dd68fff478b; parent_hash: 0x700f…76ef; extrinsics (1): [0x34d6…ed56]]
2021-03-18 16:43:12  🔖 Pre-sealed block for proposal at 2. Hash now 0x38b29b343d8f6ef56286a2f3aad20c82ae75d5bb0698569dd06fca654dae6fa6, previously 0xc590a846ff17871ffdcdd670914321f667cd6ad0b898bfb6d25f7dd68fff478b.
2021-03-18 16:43:12  ✨ Imported #2 (0x38b2…6fa6)
2021-03-18 16:43:15  💤 Idle (1 peers), best: #2 (0xe111…c084), finalized #0 (0x2776…8ba7), ⬇ 1.4kiB/s ⬆ 1.4kiB/s
```

The final lines shows that your node has peered with another (**`1 peers`**), and they have produced
a block (**`best: #2 (0xe111…c084)`**)!

> But do notice that even after you add the GRANDPA key for the second node no block finalization has
> happened (**`finalized #0 (0x2776…8ba7)`**).
> **Substrate nodes require a restart after inserting a GRANDPA key.**
> Kill your nodes and restart them with the same commands you used previously.
> Now blocks should be finalized!

```bash
...
2021-03-18 16:47:47  💤 Idle (1 peers), best: #46 (0xfaf1…02f8), finalized #44 (0x9b08…09ea), ⬇ 1.3kiB/s ⬆ 1.3kiB/s
2021-03-18 16:47:48  ✨ Imported #47 (0x7375…aa51)
2021-03-18 16:47:52  💤 Idle (1 peers), best: #47 (0x7375…aa51), finalized #45 (0x7c13…7575), ⬇ 0.8kiB/s ⬆ 0.6kiB/s
2021-03-18 16:47:54  🙌 Starting consensus session on top of parent 0x73757e1773e6d86a9ef4a3ec9c3a55eef04345705c0a51f04445af657184aa51
2021-03-18 16:47:54  🎁 Prepared block for proposing at 48 [hash: 0xd9ef428ccd38426a47a9eca181b508630e327b35ef4c468103ce59fa861e60f6; parent_hash: 0x7375…aa51; extrinsics (1): [0x16f0…dbe6]]
2021-03-18 16:47:54  🔖 Pre-sealed block for proposal at 48. Hash now 0x23a93d8e6bbbcf9f36e61264cc3a48a426a7f1112ff48df76f0d55b52c181156, previously 0xd9ef428ccd38426a47a9eca181b508630e327b35ef4c468103ce59fa861e60f6.
```

## You're Finished

Congratulations! You've started your own blockchain!

In this tutorial you've learned to generate your own keypairs, create a custom chain spec that uses
those keypairs, and start a private network based on your custom chain spec.

### Solutions and Helpers

If you would like examples of correct JSON keystore `curl` files with a known working chainspec, see the
[solution](https://github.com/substrate-developer-hub/substrate-node-template/tree/tutorials/solutions/private-chain-v3), you can use the extra files with your already cloned and compiled node, no need to
start from scratch.

<!-- TODO link to the followup tutorial about starting a 3 node network using the demo substrate node
Details in https://github.com/substrate-developer-hub/tutorials/issues/16 -->

### Learn More

That big Wasm blob we encountered in the chain spec was necessary to enable forkless upgrades.
Learn more about how the [executor](../../knowledgebase/advanced/executor) uses on-chain Wasm.

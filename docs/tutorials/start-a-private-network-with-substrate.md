---
title: "Start a Private Network with Substrate"
---
In this tutorial we will learn and practice how to start a blockchain network with a validator/authority set of your choosing using Substrate.

You will need:
1. A linux- or OSX-like shell
2. git

You will learn to:
1. Compile a Substrate node from source code.
2. Generate ed25519 and sr25519 key-pairs for use as a network authority
3. Create and edit a chainspec json file


Compiling the Tools
-----------------
Substrate does not (yet) offer binary installation packages, so it must be compiled from source, which can be a time-consuming process. Commits go into the [Substrate repository](https://github.com/paritytech/substrate) regularly and it is wise that everyone participating in this network have the same version of substrate to guarantee success. In practice similar but not identical versions will often work, but banking on that is a recipe for frustration. In this tutorial, we'll be using commit `7d7e74fb` for more stability.

```bash
# Download the Substrate code
git clone https://github.com/paritytech/substrate
cd substrate

# Switch to the proper commit
git checkout 7d7e74fb

# Install rust prerequisites
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

The repository includes a utility called `subkey` which we'll optionally use to generate and inspect keypairs. Let's compile it first. The `--force` option means that we'll install this version by overriding the previously installed version.
```bash
# Compile subkey
cargo install --force --path subkey subkey
```

Now let's compile the actual blockchain node that we'll be running. Because Substrate is a framework, most real-world blockchains that use it will write custom runtime code. There are [other tutorials](/tutorials/) that cover that process in detail. Luckily the Substrate repository itself already comes with two ready-to-run node environments. The first lives in the `node` directory and includes many features to be a practical blockchain. In fact it looks quite similar to [Polkadot](https://polkadot.network) which is also built on Substrate. The second is a more minimal runtime that lives in the `node-template` directory. We'll be using the node template in this tutorial because of its simplicity and because it is the usual starting point when writing your own custom runtime.

```bash
# Switch to node-template directory
cd node-template

# Ensure your Rust toolchain is up to date
./scripts/init.sh

# Compile the node-template
cargo build --release
```


Alice and Bob Start Blockchain
-----------------------------
Before we generate our own keys, and start a truly unique Substrate network, let's learn the fundamentals by starting with a pre-defined network specification called `local` with two pre-defined (and definitely not private!) keys known as Alice and Bob.

### Alice Starts first

Alice (or whomever is playing her) should run this command from Substrate repository root.
```bash
# If you're still in node-template/
cd ..

# Start the node
./target/release/node-template \
  --base-path /tmp/alice \
  --chain=local \
  --alice \
  --port 30333 \
  --telemetry-url ws://telemetry.polkadot.io:1024 \
  --validator
```
Let's look at those flags in detail:
* `--base-path` Specifies a directory where Substrate should store all the data related to this chain. If the directory does not exist it will be created for you. If other blockchain data already exists there you will get an error. Either clear the directory or choose a different one.
* `--chain=local` Specifies which chain specification to use. There are a few pre-packaged options including `local` `development` and `staging` but generally one specifies their own chainspec file. We'll specify our own file in a later step.
* `--alice` Puts the pre-defined Alice keys (both for block production and finalization) in the node's keystore. Generally one should generate their own key with `subkey` and insert them with an RPC call. We'll generate our own keys in a later step.
* `--port 30333` Specifies the port that your node will listen for p2p traffic on. 30333 is the default and this flag can be omitted if you're happy with the default. If Bob's node will run on the same physical system, you will need to explicitly specify a different port for it.
* `--telemetry-url` Tells the node to send telemetry data to a particular server. The one we've chosen here is hosted by Parity and is available for anyone to use. You may also host your own (beyond the scope of this article) or omit this flag entirely.
* `--validator` Means that we want to participate in block production and finalization rather than just sync the network.

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

A few lines to take note of:
`Local node identity is: QmViTYm8Yr4yneyRGov9L87vLeVLoySFduVRNQ1d33WdXN` shows the node ID that Bob will need when booting from Alice's node.
`Initializing Genesis block/state (state: 0x4faf…3aba, header-hash: 0x8855…e564)` tells which genesis block the node is using. Bob's node must have the same numbers or they will not connect to one another.

More details about all of these flags and others that I haven't mentioned are available by running `./target/release/node-template --help`.

### Attach a UI
You can tell a lot about your node by watching the output it produces in your terminal. There is also a nice graphical user interface known as the [Polkadot Js Apps UI](https://polkadot.js.org/apps/) which you can connect to your node. That link goes to the hosted version of the user interface, which is super convenient when it works, but is often out of date compared to the version of Substrate you're running. In the likely scenario that the hosted interface is out of date, you can run the interface locally by grabbing the code from [github](https://github.com/polkadot-js/apps). In general the instructions in that repository will be your best guide, but the process should be something like this.

```bash
# Grab the code
git clone https://github.com/polkadot-js/apps
cd apps

# Install dependencies (you MUST use yarn, not npm)
yarn

# Start the project
yarn run start
```

Point your favorite web browser at localhost:3000, and on the settings tab, choose "local node". You should see something like this.

![No blocks in polkadot-js-apps](https://cdn.discordapp.com/attachments/559788157239951376/580368220364603392/unknown.png)

You'll notice, both in the terminal and the UI, that no blocks are being produced yet. Blocks will start being produced once another validator joins the network.

### Bob Joins In
Now that Alice's node is up and running, Bob can join the network by bootstrapping from her node. His command will look very similar.
```bash
./target/release/node-template \
  --base-path /tmp/bob \
  --chain=local \
  --bob \
  --port 30334 \
  --telemetry-url ws://telemetry.polkadot.io:1024 \
  --validator \
  --bootnodes /ip4/<Alices IP Address>/tcp/<Alices Port>/p2p/<Alices Node ID>
```
Most of these options are already explained above, but there are a few tripping points.
* If these two nodes are running on the same physical machine, Bob MUST specify a different `--base-path` and `--port`.
* Bob has added the `--bootnodes` flag and specified a single boot node, namely Alice's. He must correctly specify these three pieces of information which Alice can supply for him.
  * Alice's IP Address in the form `192.168.1.1`
  * Alice's Port, probably 30333
  * Alice's node ID, copied from her log output. (`QmViTYm8Yr4yneyRGov9L87vLeVLoySFduVRNQ1d33WdXN` in the example output above.)

If all is going well, after a few seconds, the nodes should peer together and start producing blocks. You should see some lines like

```
Idle (1 peers), best: #1 (0x9f1b…9b57), finalized #1 (0x28be…45e5), ⬇ 1.7kiB/s ⬆ 1.4kiB/s
```

This line shows that Bob has peered with Alice (`1 peers`), they have produced a block (`best: #1 (0x9f1b…9b57)`), and the block is  finalized (`finalized #1 (0x28be…45e5)`).

Generate Your Own Keys
----------------------
Now that we know the fundamentals and the command line options, it's time to generate our own keys rather than using the well-known Alice and Bob keys. Each person who wants to participate in the blockchain can generate their own key using the [subkey tool](ecosystem/subkey). Be sure to record all of the output from this section as you will need it later.

First generate a mnemonic and see the `sr25519` key and address associated with it. This key will be used by BABE for block production.
```
$ subkey generate
Secret phrase `keep matrix knee meat awake frown rubber position federal easily strategy inhale` is account:
  Secret seed: 0xb5d5cda89e139aecb67181e11d6d2d90a0cc80106afa035ab19264af7b5e5c0b
  Public key (hex): 0x8ed5f822065e5824d3e37d9ea36a81eacb98ff1a6fa04bb87d2fa4915e9ed147
  Address (SS58): 5FHzDem7A5aAq79tuEN9xJuNPXiYfmRQamhumTuqu6i57BuU
```

Now see the `ed25519` key and address associated with the same mnemonic. This key will be used by GRANDPA for block finalization.
```
$ subkey --ed25519 inspect "keep matrix knee meat awake frown rubber position federal easily strategy inhale"
Secret phrase `keep matrix knee meat awake frown rubber position federal easily strategy inhale` is account:
  Secret seed: 0xb5d5cda89e139aecb67181e11d6d2d90a0cc80106afa035ab19264af7b5e5c0b
  Public key (hex): 0xfe68fdff17960cb8d45d861396a64d4086997353849403ee3352996ec68ff4af
  Address (SS58): 5HpHD5YseSWbHfni43Zm2SjtpyqSVmuaNhKkVmivp8L93Trs
```

Creating the chainspec
-----------------------------
Last time around, we used `--chain=local` which is a predefined "chainspec" that has Alice and Bob specified as validators along with many other useful defaults.

Rather than writing our chainspec completely from scratch, we'll just make a few modifications to the the one we used before. To start we need to export the chainspec to a json file. Remember, further details about all of these commands are available by running `node-template --help`.

```bash
./target/release/node-template build-spec --chain=local > customSpec.json
```

The file we just created contains several fields, and one can learn a lot by exploring them. By far the largest field is a single hex number that is the Wasm binary of our runtime. It is part of what you built earlier when you ran the `cargo build` command. Having this inforamtion on-chain allows supports forkless upgrades.

The portion of the file we're interested in is the babe authorities (used for creating blocks) and the grandpa authorieits (used for finalizing blocks). That section looks like this
```json
"babe": {
  "authorities": [
    [
      "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      1
    ],
    [
      "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      1
    ]
  ]
},
"grandpa": {
  "authorities": [
    [
      "5FA9nQDVg267DEd8m1ZypXLBnvN7SFxYwV7ndqSYGiN9TTpu",
      1
    ],
    [
      "5GoNkf6WdbxCFnPdAnYYQyCjAKPJgLNxXwPjwTh6DGg6gN3E",
      1
    ]
  ]
},

```

All we need to do is change the authority addresses listed (currently Alice and Bob) to our own addresses that we generated in the previous step. The sr25519 addresses go in the `babe` section, and the ed25519 addresses in the `grandpa` section. You may add as many validators as you like.

> A single person should do these steps and share the resulting file with their fellow validators.
>
> Because Rust -> Wasm builds aren't "reproducible", each person will get a slightly different Wasm blob which will break consensus if each participant generates the file themselves.

Once the chainspec is prepared, convert it to a "raw" chainspec. The distinction between regular and raw is just that all the field names are encoded as hex in the raw chainspec. Not much interesting to explore there.

```bash
./target/release/node-template build-spec --chain customSpec.json --raw > customSpecRaw.json
```

Finally share the `customSpecRaw.json` with your all the other validators in the network.

Launching the chain
-------------------

### First Participant starts a Bootnode

You've completed all the necessary prep work and you're now ready to launch your chain. This process is very similar to when you launched a chain earlier as Alice and Bob. It's important to start with a clean base path, so if you plan to use the same path that you've used previously, please delete all contents from that directory.

The first participant can launch her node with
```bash
./target/release/node-template \
  --chain ./customSpecRaw.json \
  --port 30333 \
  --telemetry-url ws://telemetry.polkadot.io:1024 \
  --validator
  --name MyNode
```
Here are some differences from when we launched as Alice.
* I've omitted the `--base-path` flag, so Substrate will use a default location. You're still free to specify your own base path.
* I've omitted the `--alice` flag instead we will insert our own custom keys into the keysotre through the RPC shortly.
* The `--chain` flag has changed to use our custom chainspec.
* I've added the optional `--name` flag. You may use it to give your node a human-readable name in the telemetry UI.

One your node is running, you will again notice that no blocks are being produced. At this point you can use the Apps UI to insert your keys into the keystore. NAvigate to the "Toolbox" tab and the "RPC Call" sub-tab. Choose "author" and "insertKey". The fields can be filled like this:
```
keytype: babe
suri: your mnemonic phrase (eg keep matrix knee meat awake frown rubber position federal easily strategy inhale)
publicKey: your sr25519 key (eg 0x8ed5f822065e5824d3e37d9ea36a81eacb98ff1a6fa04bb87d2fa4915e9ed147)
```

You've now successfully inserted your babe key. You can repeat those steps to insert your grandpa key (the ed25519 key)
```
keytype: gran
suri: your mnemonic phrase (eg keep matrix knee meat awake frown rubber position federal easily strategy inhale)
publicKey: your sr25519 key (eg 0xfe68fdff17960cb8d45d861396a64d4086997353849403ee3352996ec68ff4af)
```

Finally, restart your node so that the keys just added to the keystore take effect.

### Subsequent Participants Join

Subsequent validators can now join the network as Bob did previously, making sure to use the new chainspec. You may bootstrap from _any_ of the nodes already in the network, not just the one that went first.

Each participant will need to start their node, add both keys to the keystore, and restart their node.

> Reminder: All validators must be using identical chain specifications in order to peer. You should see the same genesis block and state root hashes.

Next Steps
----------
Congratulations! You've started your own blockchain!

In this tutorial you've learned to compile the node-template, generate your own keypairs, create a custom chainspec that uses those keypairs, and start a private network based on your custom chainspec and the node-template.

Here are some ideas for what to learn next.

### Use the Full Node
You can go through a very similar process using Substrate's full node that lives in the `node` directory rather than the `node-template` that we used. The process should be familiar to you, and you'll get to explore more runtime modules that are included in the full node.

### Add Validators After Genesis
What if you want to add more validators after starting the blockchain? You can't just go back and edit the chainspec at that point. The authority set can be changed after genesis by calling the consensus module's [`set_authorities` function](https://github.com/paritytech/substrate/blob/master/srml/consensus/src/lib.rs#L356-L362). However, that function can only be called from other runtime modules. If you've built the full node, you can use the democracy module for this task. Or check out the [Substrate POA runtime](https://github.com/gautamdhameja/substrate-poa).

### Write a Custom Runtime
Substrate is all about writing your own runtimes, and now that you've gotten your hands dirty, I encourage you to try writing one. Consider one of the [tutorials](/tutorials/).

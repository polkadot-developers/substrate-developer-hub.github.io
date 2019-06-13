---
title: "Start a Private Network with Substrate"
---
In this tutorial we will learn and practice how to start a blockchain network with a validator/authority set of your choosing using Substrate.

You will need:
1. A linux- or OSX-like shell
2. git

You will learn to:
1. Compile a Substrate node from source code.
2. Generate ed25519 key-pairs for use as a network authority
3. Create and edit a chainspec json file


Compiling the Tools
-----------------
Substrate is an open source framework for building your own blockchain nodes. It can be used for a very wide variety of applications.

Substrate does not (yet) offer binary installation packages, so it must be compiled from source, which can be a time-consuming process. Commits go into the [Substrate repository](https://github.com/paritytech/substrate) regularly and it is wise that everyone participating in this network have the same version of substrate to guarantee success. In practice similar but not identical versions will often work, but banking on that is a recipe for frustration. We'll be using the `v1.0` branch for more stability.

### Your First Time
First we'll download the Substrate v1.0 code by cloning the git repository.
```bash
git clone -b v1.0 https://github.com/paritytech/substrate
cd substrate
```

The repository includes a utility called `subkey` which we'll optionally  use to generate and inspect keypairs. Let's compile it first. The `--force` option means that we'll install this version over any previously installed versions.
```bash
cargo install --force --path subkey subkey
```

Now let's compile the actual blockchain node that we'll be running. Because Substrate is a framework, most real-world blockchains that use it will write custom runtime code. There are [other tutorials](/tutorials/) that cover that process in detail. Luckily the Substrate repository itself already comes with two ready-to-run node environments. The first lives in the `node` directory and includes many features to be a practical blockchain. In fact it looks quite similar to [Polkadot](https://polkadot.network) which is also built on Substrate. The second is a minimalistic runtime that lives in the `node-template` directory. We'll be using the node template in this tutorial because of its simplicity and because it is the usual starting point when writing your own custom runtime.

```bash
# Switch to note-template directory
cd node-template

# Ensure your rust toolchain is up to date
./scripts/init.sh

# Compile the wasm version of the runtime code
./scripts/build.sh

# Compile the native version of the node
cargo build
```

### Updating Later
When updating or changing Substrate versions, the process is similar, but the builds are much faster. Start by grabbing all the latest code, even if you will ultimately use an older version.
```bash
# Ensure you're on the v1.0 branch
git checkout v1.0

# Grab the latest code
git pull
```

Subkey doesn't change nearly as quickly as Substrate itself, so you can often skip rebuilding it. If your get checksum errors or key-compatibility errors, ensure subkey is up to date.
```bash
# Optional: Rebuild subkey
cargo install --force --path subkey subkey
```

Now we're ready to rebuild the node template. This process is identical to before, but will run much faster, because only the parts of the code that have actually changed will be recompiled.
```bash
cd node-template
./scripts/init.sh
./scripts/build.sh
cargo build
```

Protip: If you'd like `node-template` to end up on your path, you may use `cargo install` instead of `cargo build` in the last step.



Alice and Bob Start Blockchain
-----------------------------
Before we generate our own keys, and start a truly unique Substrate network, let's learn the fundamentals by starting with a pre-defined network specification called `local` with two pre-defined (and definitely not private!) keys known as Alice and Bob.

### Alice Starts first

Alice (or whomever is playing her) should run this command from Substrate repository root.
```bash
# If you're still in node-template/
cd ..

# Start the node
./target/debug/node-template \
  --base-path /tmp/alice \
  --chain=local \
  --key //Alice \
  --port 30333 \
  --telemetry-url ws://telemetry.polkadot.io:1024 \
  --validator \
  --name AlicesNode
```
Let's look at those flags in detail:
* `--base-path` Specifies a directory where Substrate should store all the data related to this chain. If the directory does not exist it will be created for you. If other blockchain data already exists there you will get an error. Either clear the directory or choose a different one.
* `--chain=local` Specifies which chain specification to use. There are a few pre-packaged options including `local` `development` and `staging` but generally one specifies their own chainspec file. We'll specify our own file in a later step.
* `--key //Alice` Specifies that we're using the pre-packaged Alice key as a validator on this node. Generally one should generate their own key with `subkey` and then the flag would look like `--key "enroll mechanic science ...""`. We'll generate our own keys in a later step.
* `--port 30333` Specifies the port that your node will listen for p2p traffic on. 30333 is the default and this flag can be omitted if you're happy with the default. If Bob's node will run on the same physical system, you will need to explicitly specify a different port for it.
* `--telemetry-url` Tells the node to send telemetry data to a particular server. The one we've chosen here is hosted by Parity and is available for anyone to use. You may host your own (beyond the scope of this article) or omit this flag entirely.
* `--validator` Means that we want to participate in block production rather than just sync the network.
* `--name` Attaches a human readable name to the node. This flag is optional and if you omit it a human-readable name will be generated for you. If you aren't using telemetry, you likely won't find much value in assigning a name to the node.

When the node starts you should see output similar to this.
```
2019-05-08 11:15:38 Substrate Node
2019-05-08 11:15:38   version 1.0.0-17dcbe6c-x86_64-linux-gnu
2019-05-08 11:15:38   by Anonymous, 2017, 2018
2019-05-08 11:15:38 Chain specification: Local Testnet
2019-05-08 11:15:38 Node name: AlicesNode
2019-05-08 11:15:38 Roles: FULL
2019-05-08 11:15:38 Generated a new keypair: 3520cafa56767704a32b27c351851b9f0dba7dec34e79e4165b10b89dce98a9c (5DGN8sgD...)
2019-05-08 11:15:38 Best block: #0
2019-05-08 11:15:38 Using default protocol ID "sup" because none is configured in the chain specs
2019-05-08 11:15:38 Local node identity is: QmNTx7qYd5JiasUTzjaAbTCUeH5ot9xMjRePRjkSEdD7MY
2019-05-08 11:15:38 Libp2p => Random Kademlia query has yielded empty results
2019-05-08 11:15:38 Listening for new connections on 127.0.0.1:9944.
2019-05-08 11:15:41 Libp2p => Random Kademlia query has yielded empty results
2019-05-08 11:15:43 Idle (0 peers), best: #0 (0x8a3c…b693), finalized #0 (0xdb6e…679d), ⬇ 0 ⬆ 0
```

A few lines to take note of:
`Node name: AlicesNode` shows the human-readable name you specified or an autogenerated one
`Local node identity is: QmNTx7qYd5JiasUTzjaAbTCUeH5ot9xMjRePRjkSEdD7MY` shows the node ID that Bob will need when booting from Alice's node
`Listening for new connections on 127.0.0.1:9944.` shows that the node is listening for RPC connections on port 9944. By default only connections from localhost will be accepted, but you can change that behavior by specifying `--ws-external`. You can change the port by specifying `--ws-port 12345`.

More details about all of these flags and others that I haven't mentioned are available by running `./target/debug/node-template --help`.

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

Point your favorite web browser at localhost:3000, and on the settings page, choose "local node". You should see something like this.

![No blocks in polkadot-js-apps](https://cdn.discordapp.com/attachments/559788157239951376/580368220364603392/unknown.png)

You'll notice, both in the terminal and the UI, that no blocks are being produced yet. Curious learners can [see why](https://github.com/paritytech/substrate/blob/ae350506053b186a15fe5ffe2c1e85088b13a619/core/consensus/aura/src/lib.rs#L341). Blocks will start being produced once another validator joins the network.

### Bob Joins In
Now that Alice's node is up and running, Bob can join the network by bootstrapping from her node. His command will look very similar.
```bash
./target/debug/node-template \
  --base-path /tmp/bob \
  --chain=local \
  --key //Bob \
  --port 30333 \
  --telemetry-url ws://telemetry.polkadot.io:1024 \
  --validator \
  --name BobsNode \
  --bootnodes /ip4/<Alices IP Address>/tcp/<Alices Port>/p2p/<Alices Node ID>
```
Most of these options are already explained above, but there are a few tripping points.
* If these two nodes are running on the same physical machine, Bob MUST specify a different `--base-path` and `--port`.
* Bob has added the `--bootnodes` flag and specified a single boot node, namely Alice's. He must correctly specify these three pieces of information which Alice can supply for him.
  * Alice's IP Address in the form `192.168.1.1`
  * Alice's Port, probably 30333
  * Alice's node ID, copied from her log output. (`QmNTx7qYd5JiasUTzjaAbTCUeH5ot9xMjRePRjkSEdD7MY` in the output above.)

If all is going well, after a few seconds, the nodes should peer together and start producing blocks. You should see some lines like

```
Idle (1 peers), best: #1 (0x9f1b…9b57), finalized #0 (0x28be…45e5), ⬇ 1.7kiB/s ⬆ 1.4kiB/s
```

This line shows that Bob has peered with Alice (`1 peers`), they have produced a block (`best: #1 (0x9f1b…9b57)`), and the block is not finalized (`finalized #0 (0x28be…45e5)`). In this network, only the genesis block will ever be finalized because there is no finality gadget in the node-template. Finality is beyond the scope of this tutorial.

Generate Your Own Keys
----------------------
Now that we know the fundamentals and the command line options, it's time to generate our own keys rather than using the well-known Alice and Bob keys.

Each person who wants to participate in the blockchain can generate their own key using the [subkey tool](ecosystem/subkey) or the Polkadot JS Apps UI that we used previously. In this tutorial, we'll use the UI.

Navigate to the "Accounts" tab, and choose "Add Account". For this kind of session key, we'll need to select Edwards Curve near the bottom, and copy-paste the public address and the raw seed.

![Screenshot of key generation](https://cdn.discordapp.com/attachments/559788157239951376/583363719753367567/unknown.png)

When you have generated a key pair, store the entire output somewhere safe. Share your public address with the other validators who will be in your network. When everyone in the network knows everyone else's addresses, you can proceed to launch your own chain.

Start Your Private Blockchain
-----------------------------
Last time around, we used `--chain=local` which is a predefined "chainspec" that has Alice and Bob specified as validators along with many other useful defaults.

### Creating the chainspec
Rather than writing our chainspec completely from scratch, we'll just make a few modifications to the the one we used before. To start we need to export the chainspec to a json file. Remember, further details about all of these commands are available by running `node-template --help`.

```bash
./target/debug/node-template build-spec --chain=local > customSpec.json
```

The file we just created contains several fields, and one can learn a lot by exploring them. By far the largest field is a single hex number that is the wasm binary of our runtime. It is what you built earlier when you ran the `build.sh` script. Learn more about why it's useful to have that info on-chain from [Gav's web3 summit demo](https://www.youtube.com/watch?v=0IoUZdDi5Is).

The portion of the file we're interested in is the authorities which looks like this
```json
  "consensus": {
      "authorities": [
        "5FA9nQDVg267DEd8m1ZypXLBnvN7SFxYwV7ndqSYGiN9TTpu",
        "5GoNkf6WdbxCFnPdAnYYQyCjAKPJgLNxXwPjwTh6DGg6gN3E",
      ],
      "code": <snip>
    }
```

All we need to do is change the authority addresses listed (currently Alice and Bob) to our own addresses that we generated in the previous step. A single person should do these steps and share the resulting file. with their fellow validators. (Because rust -> wasm builds aren't "reproducible", each person will get a slightly different wasm blob which will break consensus if each participant generates the file themselves.)

Once the chainspec is prepared, convert it to a "raw" chainspec. The distinction between regular and raw is just that all the field names are encoded as hex in the raw chainspec. Not much interesting to explore there.

```bash
./target/debug/node-template build-spec --chain customSpec.json --raw > customSpecRaw.json
```

Finally share the `customSpecRaw.json` with your all the other validators in the network.

### Launching the chain

You've completed all the necessary prep work and you're now ready to launch your chain. This process is very similar to when you launched a chain earlier as Alice and Bob. It's important to start with a clean base path, so if you plan to use the same path that you've used previously, please delete all contents from that directory.

The first participant can launch her node with
```bash
./target/debug/node-template \
  --chain ./customSpecRaw.json \
  --key "enroll mechanic ... embody" \
  --port 30333 \
  --telemetry-url ws://telemetry.polkadot.io:1024 \
  --validator
```
Here are some differences from when we launched as Alice.
* I've omitted the `--base-path` flag, so Substrate will use a default location. You're still free to specify your own base path.
* For the key, I've used the mnemonic phrase that we generated previously. This must be a phrase that corresponds to one of the addresses in your chainspec.
* The `--chain` flag has changed to use our custom chainspec.

Subsequent validators can now join the network just as Bob did previously. You may bootstrap from _any_ of the nodes already in the network, not just the one that went first.


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

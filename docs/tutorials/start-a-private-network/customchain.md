---
title: Creating Your Private Network
---
Now that each participant has their own keys generated, you're ready to start your own custom chain.

> Validators should not share the same keys, even for learning purposes. If two validators have the
> same keys, they will produce conflicting blocks and be slashed.

## Create a Chain Specification

Last time around, we used `--chain local` which is a predefined "chain spec" that has Alice and Bob
specified as validators along with many other useful defaults.

Rather than writing our chain spec completely from scratch, we'll just make a few modifications to
the the one we used before. To start we need to export the chain spec to a json file. Remember,
further details about all of these commands are available by running `node-template --help`.

```bash
./target/release/node-template build-spec --chain local > customSpec.json
```

The file we just created contains several fields, and you can learn a lot by exploring them. By far
the largest field is a single hex number that is the Wasm binary of our runtime. It is part of what
you built earlier when you ran the `cargo build` command.

The portion of the file we're interested in is the Aura authorities (used for creating blocks) and
the GRANDPA authorities (used for finalizing blocks). That section looks like this

```json
"aura": {
  "authorities": [
    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
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

The format for the grandpa data is more complex because the grandpa protocol supports weighted
votes. In this case we have given each validator a weight of 1.

All we need to do is change the authority addresses listed (currently Alice and Bob) to our own
addresses that we generated in the previous step. The sr25519 addresses go in the `aura` section,
and the ed25519 addresses in the `grandpa` section. You may add as many validators as you like.
For additional context, read about [keys in Substrate](https://substrate.dev/docs/en/next/conceptual/cryptography/keys).

> A single person should do these steps and share the resulting file with their fellow validators.
>
> Because Rust -> Wasm builds aren't "reproducible", each person will get a slightly different Wasm
> blob which will break consensus if each participant generates the file themselves.

Once the chain spec is prepared, convert it to a "raw" chain spec. The raw chain spec contains all
the same information, but it contains the encoded storage keys that the node will use to reference
the data in its local storage. Distributing a raw spec ensures that each node will store the data
at the proper storage keys.

```bash
./target/release/node-template build-spec --chain customSpec.json --raw > customSpecRaw.json
```

Finally share the `customSpecRaw.json` with your all the other validators in the network.

## First Participant Starts a Bootnode

You've completed all the necessary prep work and you're now ready to launch your chain. This
process is very similar to when you launched a chain earlier as Alice and Bob. It's important to
start with a clean base path, so if you plan to use the same path that you've used previously,
please delete all contents from that directory.

The first participant can launch her node with

```bash
./target/release/node-template \
  --base-path /tmp/node01 \
  --chain ./customSpecRaw.json \
  --port 30333 \
  --ws-port 9944 \
  --rpc-port 9933 \
  --telemetry-url ws://telemetry.polkadot.io:1024 \
  --validator \
  --name MyNode01
```
Here are some differences from when we launched as Alice.

* I've omitted the `--alice` flag. Instead we will insert our own custom keys into the keystore
through the RPC shortly.
* The `--chain` flag has changed to use our custom chain spec.
* I've added the optional `--name` flag. You may use it to give your node a human-readable name in the telemetry UI.

## Adding Keys to Keystore

Once your node is running, you will again notice that no blocks are being produced. At this point,
you need to add your keys into the keystore.

### Option 1: Using Polkadot-JS App UI

You can use the Apps UI to insert your keys into the keystore. Navigate to the "Toolbox" tab and the "RPC Call" sub-tab. Choose "author" and "insertKey". The fields can be filled like this:

```
keytype: aura
suri: <your mnemonic phrase> (eg clip organ olive upper oak void inject side suit toilet stick narrow)
publicKey: <your sr25519 key> (eg 0x9effc1668ca381c242885516ec9fa2b19c67b6684c02a8a3237b6862e5c8cd7e)
```

![Inserting a Grandpa key using Apps](/docs/assets/private-network-apps-insert-key.png)

> If you generated your keys with the Apps UI you will not know your raw public key. In this case you may use your SS58 address instead.

You've now successfully inserted your aura key. You can repeat those steps to insert your grandpa key (the ed25519 key)

```
keytype: gran
suri: <your mnemonic phrase> (eg clip organ olive upper oak void inject side suit toilet stick narrow)
publicKey: <your ed25519 key> (eg 0xb48004c6e1625282313b07d1c9950935e86894a2e4f21fb1ffee9854d180c781)
```

### Option 2: Using CLI

You can also insert a key to the keystore by command line.

```bash
# Submit a new key via RPC, connect to where your `rpc-port` is listening
$ curl http://localhost:9933 -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"author_insertKey",
    "params": [
      "<aura/gran>",
      "<mnemonic phrase>",
      "<public key>"
    ]
  }'
```

If you enter the command and parameters correctly, the node will return a JSON response as follows.

```json
{ "jsonrpc": "2.0", "result": null, "id": 1 }
```

## Subsequent Participants Join

Subsequent validators can now join the network. This can be done either by specifying the
`--bootnodes` paramter as Bob did previously, or using the chain spec file we generated just now.

Let's use the chain spec file to run another node. The command will be similar to the following:

```bash
./target/release/node-template \
  --base-path /tmp/node02 \
  --chain ./customSpecRaw.json \
  --port 30334 \
  --ws-port 9945 \
  --rpc-port 9934 \
  --telemetry-url ws://telemetry.polkadot.io:1024 \
  --validator \
  --name MyNode02
```

Note that:

* We don't need to specify the `--bootnodes` as it is read from the `customSpecRaw.json` file.
* We specify another `base-path`, give it another `name`, and also specify this node as a
`validator`.
* Once the node is up, we add another pair of `sr25519` and `ed25519` keys in this node keystore
that we specify in the `customSpec.json`. Each participant will need to start their node and add
both keys to the keystore to be a validator.
* If there are multiple validators in the network, we want to add all of them in the
`bootnodes` section of in the `customSpec.json`.

> If you are running multiple nodes on the same machine, you must configure the UI to the correct
> node's WebSocket endpoint.

> Reminder: All validators must be using identical chain specifications in order to peer. You
> should see the same genesis block and state root hashes.

## You're Finished

Congratulations! You've started your own blockchain!

In this tutorial you've learned to compile the node-template, generate your own keypairs, create a
custom chain spec that uses those keypairs, and start a private network based on your custom chain
spec and the node-template.

### Learn More

That big Wasm blob we encountered in the chain spec was was necessary to enable forkless upgrades.
Learn more about how the [executor](docs/conceptual/core/executor) uses on-chain Wasm.

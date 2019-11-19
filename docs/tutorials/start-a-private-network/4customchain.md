---
title: Creating Your Private Network
---
Now that each participant has their own keys generated, you're ready to start your own custom chain.

> Validators should not share the same keys, even for learning purposes. If two validators have the same keys, they will produce conflicting blocks and be slashed.

## Create a Chain Specification

Last time around, we used `--chain=local` which is a predefined "chain spec" that has Alice and Bob specified as validators along with many other useful defaults.

Rather than writing our chain spec completely from scratch, we'll just make a few modifications to the the one we used before. To start we need to export the chain spec to a json file. Remember, further details about all of these commands are available by running `node-template --help`.

```bash
./target/release/node-template build-spec --chain=local > customSpec.json
```

The file we just created contains several fields, and you can learn a lot by exploring them. By far the largest field is a single hex number that is the Wasm binary of our runtime. It is part of what you built earlier when you ran the `cargo build` command. Having this information on-chain enables forkless upgrades.

The portion of the file we're interested in is the Aura authorities (used for creating blocks) and the GRANDPA authorities (used for finalizing blocks). That section looks like this
```json
"aura": {
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

All we need to do is change the authority addresses listed (currently Alice and Bob) to our own addresses that we generated in the previous step. The sr25519 addresses go in the `aura` section, and the ed25519 addresses in the `grandpa` section. You may add as many validators as you like. For additional context, read about [keys in Substrate](https://substrate.dev/docs/en/next/conceptual/cryptography/keys).

> A single person should do these steps and share the resulting file with their fellow validators.
>
> Because Rust -> Wasm builds aren't "reproducible", each person will get a slightly different Wasm blob which will break consensus if each participant generates the file themselves.

Once the chain spec is prepared, convert it to a "raw" chain spec. The raw chain spec contains all the same information, but it contains the encoded storage keys that the node will use to reference the data in its local storage. Distributing a raw spec ensures that each node will store the data at the proper storage keys.

```bash
./target/release/node-template build-spec --chain customSpec.json --raw > customSpecRaw.json
```

Finally share the `customSpecRaw.json` with your all the other validators in the network.

## First Participant starts a Bootnode

You've completed all the necessary prep work and you're now ready to launch your chain. This process is very similar to when you launched a chain earlier as Alice and Bob. It's important to start with a clean base path, so if you plan to use the same path that you've used previously, please delete all contents from that directory.

The first participant can launch her node with
```bash
./target/release/node-template \
  --chain ./customSpecRaw.json \
  --port 30333 \
  --ws-port 9944 \
  --rpc-port 9933 \
  --telemetry-url ws://telemetry.polkadot.io:1024 \
  --validator
  --name MyNode
```
Here are some differences from when we launched as Alice.
* I've omitted the `--base-path` flag, so Substrate will use a default location. You're still free to specify your own base path, and you must do so if multiple nodes will run on the same physical machine.
* I've omitted the `--alice` flag. Instead we will insert our own custom keys into the keystore through the RPC shortly.
* The `--chain` flag has changed to use our custom chain spec.
* I've added the optional `--name` flag. You may use it to give your node a human-readable name in the telemetry UI.

One your node is running, you will again notice that no blocks are being produced. At this point you can use the Apps UI to insert your keys into the keystore. Navigate to the "Toolbox" tab and the "RPC Call" sub-tab. Choose "author" and "insertKey". The fields can be filled like this:
```
keytype: aura
suri: your mnemonic phrase (eg keep matrix knee meat awake frown rubber position federal easily strategy inhale)
publicKey: your sr25519 key (eg 0x8ed5f822065e5824d3e37d9ea36a81eacb98ff1a6fa04bb87d2fa4915e9ed147)
```

> If you generated your keys with the Apps UI you will not know your raw public key. In this case you may use your SS58 address instead.

You've now successfully inserted your aura key. You can repeat those steps to insert your grandpa key (the ed25519 key)
```
keytype: gran
suri: your mnemonic phrase (eg keep matrix knee meat awake frown rubber position federal easily strategy inhale)
publicKey: your ed25519 key (eg 0xfe68fdff17960cb8d45d861396a64d4086997353849403ee3352996ec68ff4af)
```

Finally, restart your node so that the keys just added to the keystore take effect.

## Subsequent Participants Join

Subsequent validators can now join the network as Bob did previously, making sure to use the new chain spec. You may bootstrap from _any_ of the nodes already in the network, not just the one that went first.

Each participant will need to start their node, add both keys to the keystore, and restart their node.

> If you are running multiple nodes on the same machine, you must direct the UI to the correct node's websocket endpoint.

> Reminder: All validators must be using identical chain specifications in order to peer. You should see the same genesis block and state root hashes.

## You're Finished
Congratulations! You've started your own blockchain!

In this tutorial you've learned to compile the node-template, generate your own keypairs, create a custom chain spec that uses those keypairs, and start a private network based on your custom chain spec and the node-template.

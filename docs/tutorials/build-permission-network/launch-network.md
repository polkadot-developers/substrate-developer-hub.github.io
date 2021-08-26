---
title: Launch our permissioned network
---

Before even starting a node, let's make sure everything is compiled for our project.

```bash
# from the root dir of your node template:
cargo build --release
```

For this demonstration, we'll launch 4 nodes: 3 with well known nodes that are allowed
to author and validate blocks, as well as 1 sub-node that is only allowed to read-only
access to data from a selected well-known node (on it's approval). 

## Demonstration Node Keys and PeerIDs

For Alice's *well known* node:

```bash
# node key
c12b6d18942f5ee8528c8e2baf4e147b5c5c18710926ea492d09cbd9f6c9f82a

# peerid, generated from node key
12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2

# bs58 decoded peer id in hex:
0024080112201ce5f00ef6e89374afb625f1ae4c1546d31234e87e3c3f51a62b91dd6bfa57df
```

For Bob's *well known* node:

```bash
# node key
6ce3be907dbcabf20a9a5a60a712b4256a54196000a8ed4050d352bc113f8c58

# peer id, generated from node key
12D3KooWQYV9dGMFoRzNStwpXztXaBUjtPqi6aU76ZgUriHhKust

# bs58 decoded peer id in hex:
002408011220dacde7714d8551f674b8bb4b54239383c76a2b286fa436e93b2b7eb226bf4de7
```

For Charlie's *NOT well known* node:

```bash
# node key
3a9d5b35b9fb4c42aafadeca046f6bf56107bd2579687f069b42646684b94d9e

# peer id, generated from node key
12D3KooWJvyP3VJYymTqG7eH4PM5rN4T2agk5cdNCfNymAqwqcvZ

# bs58 decoded peer id in hex:
002408011220876a7b4984f98006dc8d666e28b60de307309835d775e7755cc770328cdacf2e
```

For Dave's *sub-node* (to Charlie, [more below](#add-dave-as-a-sub-node-to-charlie)):

```bash
# node key
a99331ff4f0e0a0434a6263da0a5823ea3afcfffe590c9f3014e6cf620f2b19a

# peer id, generated from node key
12D3KooWPHWFrfaJzxPnqnAYAoRUyAHHKqACmEycGTVmeVhQYuZN

# bs58 decoded peer id in hex:
002408011220c81bc1d7057a1511eb9496f056f6f53cdfe0e14c8bd5ffca47c70a8d76c1326d
```

The nodes of Alice and Bob are already configured in genesis storage and serve as 
well known nodes. We will later add Charlie's node into the set of well known nodes.
Finally we will add the connection between Charlie's node and Dave's node without
making Dave's node as a well known node.

> Note: You can get the above bs58 decoded peer id by using `bs58::decode` similar
> to how it was used in our genesis storage configuration. Alternatively, there are
> tools online like [this one](https://whisperd.tech/bs58-codec/) to en/decode bs58 IDs.

## Alice and Bob Start the Network

Let's start Alice's node first:

```bash
./target/release/node-template \
--chain=local \
--base-path /tmp/validator1 \
--alice \
--node-key=c12b6d18942f5ee8528c8e2baf4e147b5c5c18710926ea492d09cbd9f6c9f82a \
--port 30333 \
--ws-port 9944
```

Here we are using `--node-key` to specify the key that are used for the security 
connection of the network. This key is also used internally to generate the human
readable PeerId as shown in above section.

Other used CLI flags are:

* `--chain=local` for a local testnet (not the same as the `--dev` flag!).
* `--alice` to make the node an authority which can author and finalize block,
also give the node a name which is `alice`.
* `--port` assign a port for peer to peer connection.
* `--ws-port` assign a listening port for WebSocket connection.

> You can get the detailed description of above flags and more by running
> `./target/release/node-template -h`.

Start Bob's node:

```bash
# In a new terminal, leave Alice running 
./target/release/node-template \
--chain=local \
--base-path /tmp/validator2 \
--bob \
--node-key=6ce3be907dbcabf20a9a5a60a712b4256a54196000a8ed4050d352bc113f8c58 \
--port 30334 \
--ws-port 9945
```

After both nodes are started, you should be able to see new blocks authored and 
finalized in bother terminal logs. Now let's use the
[polkadot.js apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer)
and check the well known nodes of our blockchain. Don't forget to switch to one of
our local nodes running: `127.0.0.1:9944` or `127.0.0.1:9945`.

Firstly, we need to add an extra setting to tell the frontend the type of  the `PeerId` used
in node-authorization pallet. Note: the format of `PeerId` here is a wrapper on bs58 decoded
peer id in bytes. Go to the **Settings Developer** 
[page in apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/settings/developer)
, add following [custom type mapping](https://polkadot.js.org/docs/api/start/types.extend)
information:

```json
// add this as is, or with other required types you have set already:
{
  "PeerId": "(Vec<u8>)"
}
```
> If you don't do this, you will get extrinsic errors of the form" 
> `Verification Error: Execution(ApiError("Could not convert parameter 'tx' between node and runtime`
>, more details [here](https://polkadot.js.org/docs/api/FAQ#the-node-returns-a-could-not-convert-error-on-send)

Then, let's go to **Developer** page, **Chain State sub-tab**, and check the data 
stored in the  `nodeAuthorization` pallet, `wellKnownNodes` storage. You should be
able to see the peer ids of Alice and Bob's nodes, prefixed with `0x` to show its
bytes in hex format.

We can also check the owner of one node by querying the storage `owners` with the
peer id of the node as input, you should get the account address of the owner.

![query_well_known_nodes](assets/tutorials/permission-network/get_well_known_nodes.png)

## Add Another Well Known Node

Let's start Charlie's node,

```bash
./target/release/node-template \
--chain=local \
--base-path /tmp/validator3 \
--name charlie  \
--node-key=3a9d5b35b9fb4c42aafadeca046f6bf56107bd2579687f069b42646684b94d9e \
--port 30335 \
--ws-port=9946 \
--offchain-worker always
```

> Remember: The `node-authorization` pallet integrates an
[offchain worker](../../knowledgebase/learn-substrate/off-chain-features#off-chain-workers)
> to configure node connections. As Charlie is not _yet_ a wellknown node, and we 
> intend to attach Dave's node, we require the offchain worker to be enabled.

After it was started, you should see there are **no connected peers** for this node.
This is because we are trying to connect to a permissioned network, you need to
get authorization to to be connectable! Alice and Bob were configured already in
the genesis `chain_spec.rs`, where all others mut be added manually via extrinsic.

Remember that we are using `sudo` pallet for our governance, we can make a sudo call
on `add_well_known_node` dispatch call provided by node-authorization pallet to add
our node. You can find more avaliable calls in this 
[reference doc](https://substrate.dev/rustdocs/latest/pallet_node_authorization/pallet/enum.Call.html).

Go to **Developer** page, **Sudo** tab, in apps and submit the `nodeAuthorization` -
`add_well_known_node` call with the peer id in hex of Charlie's node and the 
owner is Charlie, of course. Note Allice is the valid sudo origin for this call.

![add_well_known_node](assets/tutorials/permission-network/add_well_known_node.png)

After the transaction is included in the block, you should see Charlie's node is
connected to Alice and Bob's nodes, and starts to sync blocks. Notice the reason
the three nodes can find each other is
[mDNS](https://docs.rs/sc-network/0.8.0/sc_network/) discovery mechanism is enabled
by default in a local network.

> If your nodes are not on the same local network, you don't need mDNS and should use
> `--no-mdns` to disable it. If running node in a public internet, you need to use
> `--reserved-nodes` flag to assign reachable nodes when starting Charlie's node.
> Otherwise put the reachable nodes as bootnodes of  Chain Spec.

Now we have 3 well known nodes all validating blocks together!

## Add Dave as a Sub-Node to Charlie

Let's add Dave's node, not as a well-known node, but a "sub-node" of Charlie.
Dave will *only* be able to connect to Charlie to access the network.
This is a security feature: as Charlie is therefor solely responsible for any
connected sub-node peer. There is one point of access control for David in case
they need to be removed or audited.

Start Dave's node with following command:

```bash
./target/release/node-template \
--chain=local \
--base-path /tmp/validator4 \
--name dave \
--node-key=a99331ff4f0e0a0434a6263da0a5823ea3afcfffe590c9f3014e6cf620f2b19a \
--port 30336 \
--ws-port 9947 \
--offchain-worker always
```

After it was started, there is no available connections. This is a *permissioned network*,
so first, Charlie needs to configure his node to allow the connection from Dave's node.

In **Developer Extrinsics** page, Charlie submit an `addConnections` extrinsic.
The first PeerId is the peer id in hex of Charlie's node. The connections is a list
of allowed peer ids for Charlie's node, here we only add Dave's.

![charlie_add_connections](assets/tutorials/permission-network/charlie_add_connections.png)

Then, Dave needs to configure his node to allow the connection from Charlie's node. 
But before he adds this, Dave needs to *claim* his node, hopefully it's not too late!

![dave_claim_node](assets/tutorials/permission-network/dave_claim_node.png)

Similarly, Dave can add connection from Charlie's node.

![dave_add_connections](assets/tutorials/permission-network/dave_add_connections.png)

You should now see Dave is catching up blocks and only have one peer which belong to Charlie!
Restart Dave's node in case it's not connecting with Charley right away.

> Note: *any* node may issue *extrinsics* that effect other node's behavior, as long as it
> is *on chain data* that is used for reference, and you have the *singing key* in the keystore
> available for the account in question for the extrinsics' required origin.
> All nodes in this demonstration have access to the developer signing keys, thus
> we were able to issue commands that effected Chalie's sub-nodes from *any* connected node
> on our network on behalf of Charlie. In a real world application, node operators would
> *only* have access to their node keys, and would be the only ones able to sign and submit
> extrinsics properly, very likely from their own node where they have control of the key's 
> security.  

**Congratulations!**

You are at the end of this tutorial and are already learned about how to build a
permissioned network. You can also play with other dispatchable calls like
`remove_well_known_node`, `remove_connections`.

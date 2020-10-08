---
title: Launch our permissioned network
---

Before even starting a node, let's make sure everything is compiled for our project.

```shell
cargo build --release
```

In this part, we'll launch 4 nodes, include 3 well known nodes and 1 normal node. Here are the node keys and peer ids that are used in this tutorial.

For Alice's node,

```shell
# node key
c12b6d18942f5ee8528c8e2baf4e147b5c5c18710926ea492d09cbd9f6c9f82a

# peerid
12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2

# bs58 decoded peer id in hex:
0024080112201ce5f00ef6e89374afb625f1ae4c1546d31234e87e3c3f51a62b91dd6bfa57df
```

> Notes: You can get the above bs59 decoded peer id by using `bs58::decode` similar to how it was used in our genese storage configuration. Otherwise, there is a small [tool](https://whisperd.tech/bs58-codec/) to ease your life.

For Bob's node,

```shell
# node key
6ce3be907dbcabf20a9a5a60a712b4256a54196000a8ed4050d352bc113f8c58

# peer id
12D3KooWQYV9dGMFoRzNStwpXztXaBUjtPqi6aU76ZgUriHhKust

# bs58 decoded peer id in hex:
002408011220dacde7714d8551f674b8bb4b54239383c76a2b286fa436e93b2b7eb226bf4de7
```

For Charlie's node,

```shell
# node key
3a9d5b35b9fb4c42aafadeca046f6bf56107bd2579687f069b42646684b94d9e

# peer id
12D3KooWJvyP3VJYymTqG7eH4PM5rN4T2agk5cdNCfNymAqwqcvZ

# bs58 decoded peer id in hex:
002408011220876a7b4984f98006dc8d666e28b60de307309835d775e7755cc770328cdacf2e
```

For Dave's node,

```shell
# node key 
a99331ff4f0e0a0434a6263da0a5823ea3afcfffe590c9f3014e6cf620f2b19a

# peer id
12D3KooWPHWFrfaJzxPnqnAYAoRUyAHHKqACmEycGTVmeVhQYuZN

# bs58 decoded peer id in hex:
002408011220c81bc1d7057a1511eb9496f056f6f53cdfe0e14c8bd5ffca47c70a8d76c1326d
```

The nodes of Alice and Bob are already configured in genesis storage and serve as well known nodes. We will later add Charlie's node into the set of well known nodes. Finally we will add the connection between Charlie's node and Dave's node without making Dave's node as a well known node.

## Launch the nodes of Alice and Bob

Let's start Alice's node first:

```shell
./target/release/node-template --chain=local --base-path ~/tmp/validator1 --alice --node-key=c12b6d18942f5ee8528c8e2baf4e147b5c5c18710926ea492d09cbd9f6c9f82a --port 30333 --ws-port 9944
```

Here we are using `--node-key` to specify the key that are used for the security connection of the network. This key is also used to generate the human readable PeerId as shown in above section.

Other used CLI flags are,

* `--chain` for a local testnet.
* `--alice` to make the node an authority which can author and finalize block, also give the node a name which is `alice`.
* `--port` assign a port for peer to peer connection.
* `--ws-port` assign a listening port for WebSocket connection.

> You can get the detailed description of above flags by running `./target/release/node-template -h`.

Start Bob's node:

```shell
./target/release/node-template --chain=local --base-path ~/tmp/validator2 --bob --node-key=6ce3be907dbcabf20a9a5a60a712b4256a54196000a8ed4050d352bc113f8c58 --port 30334 --ws-port 9945
```

After both nodes are started, you should be able to see new blocks authored and finalized. Now let's use the [polkadot.js apps](https://polkadot.js.org/apps/) and check the well known nodes of our blockchain. Don't forget to use our local node `127.0.0.1:9944`.

Firstly, we need to add an extra setting to tell the frontend the type of  the `PeerId` used in node-authorization pallet. Note: the format of `PeerId` here is a wrapper on bs58 decoded peer id in bytes. Go to the **Settings Developer** page in apps, add following type information:

```json
{
  "PeerId": "(Vec<u8>)"
}
```

Then, let's go to **Developer Chain state** page, check the data stored in the `nodeAuthorization` pallet, `wellKnownNodes` storage. You should be able to see the peer ids of Alice and Bob's nodes, prefixed with `0x` to show its bytes in hex format.

We can also check the owner of one node by querying the storage `owners` with the peer id of the node as input, you should get the account address of the owner.

![query_well_known_nodes](assets/tutorials/permission-network/get_well_known_nodes.png)

## Add another well known node

Let's start Charlie's node,

```shell
./target/release/node-template --chain=local --base-path ~/tmp/validator3 --name charlie  --node-key=3a9d5b35b9fb4c42aafadeca046f6bf56107bd2579687f069b42646684b94d9e --port 30335 --ws-port=9946 --offchain-worker always
```

After it was started, you should see there is no connected peers for this node. This is because we are already in a permissioned network, you need to get authorization to to be connectable! 

Remember that we are using `sudo` pallet for our governance, we can make a sudo call on `add_well_known_node` dispatch call provided by node-authorization pallet to add our node. You can find more avaliable calls in this [reference doc](https://docs.rs/pallet-node-authorization/2.0.0/pallet_node_authorization/enum.Call.html).

Go to **Developer Sudo** page in apps, submit the `nodeAuthorization` -  `add_well_known_node` call with the peer id in hex of Charlie's node and the owner is Charlie of course.

![add_well_known_node](assets/tutorials/permission-network/add_well_known_node.png)

After the transaction is included in the block, you should see Charlie's node are connected to Alice and Bob's nodes and slowly catch up with the blocks. The reason of the three nodes can find each other is [mdns](https://docs.rs/sc-network/0.8.0/sc_network/) discovery mechanism is enabled by default in a local network. If running node in a public internet, you need to use `--reserved-nodes` flag to assign reachable nodes when starting Charlie's node. Otherwise put the reachable nodes as bootnodes of  Chain Spec.

Now we have 3 well known nodes.

## Add an extra connection

Let's add another node, but not well known, only a "sub-node" of Charlie, which can only conneted to Charlie's well known node.

Start the node with following command.

```shell
./target/release/node-template --chain=local --base-path ~/tmp/validator4 --name dave --node-key=a99331ff4f0e0a0434a6263da0a5823ea3afcfffe590c9f3014e6cf620f2b19a --port 30336 --ws-port 9947 --offchain-worker always
```

After it was started, there is no avaliable connections. Firstly, Charlie need to configure his well known node to allow the connection from Dave's node.

In **Developer Extrinsics** page, Charlie submit a `addConnections` transaction. The first PeerId is the peer id in hex of Charlie's node. The connections is a list of allowed peer ids for Charlie's node, here we only add Dave's.

![charlie_add_connections](assets/tutorials/permission-network/charlie_add_connections.png)

Then, Dave need to configure his node to allow the connection from Charlie's node. But before add connections, Dave needs to claim his node first, hopefully it's not too late!

![dave_claim_node](assets/tutorials/permission-network/dave_claim_node.png)

Similarly, Dave can add connection from Charlie's node.

![dave_add_connections](assets/tutorials/permission-network/dave_add_connections.png)

Restarting Dave's node in case it's not connecting with other node. You should now see Dave is catching up blocks and only have one peer which belong to Charlie.

**Congratulations!** 

You are at the end of this tutorial and are already learned about how to build a fresh permissioned network. You can also play with other dispatchable calls like `remove_well_known_node`, `remove_connections`. Feel free to reach out and share your experience on the journey of building permissioned blockchains.

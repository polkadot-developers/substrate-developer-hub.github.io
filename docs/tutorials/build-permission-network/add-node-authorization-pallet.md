---
title: Add node-authorization pallet
---

You should already be familiar with the [Node Template](https://github.com/substrate-developer-hub/substrate-node-template) and how to add a new pallet after learning [Build a PoE Decentralized Application Tutorial](https://substrate.dev/docs/en/tutorials/build-a-dapp/), if not, please complete that tutorial.

## About node-authorization pallet

This pallet is a build-in pallet in Substrate FRAME, which manages a configurable set of nodes for a permissioned network. Each node is identified by a `PeerId` which is simply a wrapper on `Vec<u8>`. With this pallet, you have two ways to authorize a node which wants to join the network,

* Join the set of well known nodes between which the connections are allowed. Such effort usually needs to be approved by the governance in the system.
* Ask for the connection from a node which is already a member of the network. Such node can either be a well known node or a normal one. 

A node must have one and only one owner. The owner of a well known node is specified when adding it. If it's a normal node, user can claim it as its owner. To eliminate false claim, the maintainer of the node should claim it before even starting the node (after getting the `PeerId` of course). 

The owner can then change the additional connections for his (or her) node. To make it clear, you can't change the connections between well known nodes, they are always allowed to connect with each other. Instead, you can manipulate the connection between a well know node and a normal node or between two normal nodes.

It uses [offchain worker](https://substrate.dev/docs/en/knowledgebase/runtime/off-chain-workers) to set authorized nodes in node-authorization pallet. Make sure to enable offchain worker with the right CLI flag as offchain worker is diabled by default for non-authority nodes. Your node can be lagged with the latest block, in this case you need to disable offchain worker and manually set reachable reserved nodes to sync up with the network.

## Add our pallet

You should already have Node Template project at hand, otherwise, clone `v2.0.0` of the project.

```shell
git clone -b v2.0.0 --depth 1 https://github.com/substrate-developer-hub/substrate-node-template
```

You should be able to compile the project without any error.

```shell
cd substrate-node-template/
cargo build --release
```

Now open the code with your favorite editor, can't wait to make some changes right?

In **runtime/Cargo.toml**, add the dependency of our pallet,

```toml
pallet-node-authorization = { default-features = false, version = '2.0.0' }
```

Don't forget the `std` feature `pallet-node-authorization/std`.

Let's import and use our pallet in **runtime/src/lib.rs**. Firstly Import the dependency with `use frame_system::EnsureRoot`, we need it to simulate the governance in our simple blockchain. Then implement the configure trait of our pallet. More description on the trait can be found in its [reference doc](https://docs.rs/pallet-node-authorization/2.0.0/pallet_node_authorization/trait.Trait.html).

```rust
parameter_types! {
	pub const MaxWellKnownNodes: u32 = 8;
	pub const MaxPeerIdLength: u32 = 128;
}

impl pallet_node_authorization::Trait for Runtime {
	type Event = Event;
	type MaxWellKnownNodes = MaxWellKnownNodes;
	type MaxPeerIdLength = MaxPeerIdLength;
	type AddOrigin = EnsureRoot<AccountId>;
	type RemoveOrigin = EnsureRoot<AccountId>;
	type SwapOrigin = EnsureRoot<AccountId>;
	type ResetOrigin = EnsureRoot<AccountId>;
	type WeightInfo = ();
}
```

Finally, we are ready to put our pallet in `construct_runtime` macro with following extra line of code.

```rust
NodeAuthorization: pallet_node_authorization::{Module, Call, Storage, Event<T>, Config<T>},
```

## Add genesis storage for our pallet

`PeerId` is encoded in bs58 format, so we need a new library [bs58](https://docs.rs/bs58/0.3.1/bs58/) in **node/cargo.toml** to decode it to get its bytes.

```toml
bs58 = "0.3.1"
```

Let's see how to add proper genesis storage in **node/src/chain_spec.rs**. Similarly, import the necessary dependencies.

```rust
use sp_core::OpaquePeerId; // A struct wraps Vec<u8>, represents as our `PeerId`.
use node_template_runtime::NodeAuthorizationConfig; // The genesis config that serves for our pallet.
```

Adding our genesis config in the helper function `testnet_genesis`,

```rust
pallet_node_authorization: Some(NodeAuthorizationConfig {
	nodes: vec![
		(
			OpaquePeerId(bs58::decode("12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2").into_vec().unwrap()),
			endowed_accounts[0].clone()
		),
		(
			OpaquePeerId(bs58::decode("12D3KooWQYV9dGMFoRzNStwpXztXaBUjtPqi6aU76ZgUriHhKust").into_vec().unwrap()),
			endowed_accounts[1].clone()
		),
	],
}),
```

`NodeAuthorizationConfig` contains a property named `nodes`, which is vector of tuple. The first element of the tuple is the `OpaquePeerId` and we use `bs58::decode` to convert the `PeerId` in human readable format to bytes. The second element of the tuple is `AccountId` and represents the owner of this node, here we are using one of the provided endowned accounts for demonstration. To make it clear, the owner of the first node is Alice, and Bob owns the seconde node.

You may wondering where the `12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2` comes from. If you have missed reading the document [P2P Networking](https://wiki.polkadot.network/docs/en/maintain-guides-how-to-setup-sentry-node#p2p-networking), I highly recommend you finish it first. Then we can use [subkey](https://substrate.dev/docs/en/knowledgebase/integrate/subkey#generating-node-keys) to generate the above human readable `PeerId`.

```shell
subkey generate-node-key
```

> Notes: make sure to use the correct version which is 2.0.0.

The output of the command is like:

```shell
12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2 // this is PeerId.
c12b6d18942f5ee8528c8e2baf4e147b5c5c18710926ea492d09cbd9f6c9f82a // This is node-key.
```

The overall changes can be found [here](https://github.com/kaichaosun/substrate-permission-network/commit/c8b8f610afaab024c16da0917d059dc5050d3807). 

Now all the code changes are finished, we are ready to launch our permissoned network. Go get yourself some water!

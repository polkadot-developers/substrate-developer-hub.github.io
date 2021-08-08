---
title: Add node-authorization pallet
---

## About `node-authorization` pallet

The `node-authorization` pallet is a build-in pallet in Substrate FRAME, which manages
a configurable set of nodes for a permissioned network.
Each node is identified by a `PeerId` which is simply a wrapper on `Vec<u8>`.
Each `PeerId` is owned by an `AccountId` that claims it
(these are 
[associated in a map](https://substrate.dev/rustdocs/latest/pallet_node_authorization/struct.Owners.html)
). With this pallet, you have two ways to authorize a node which wants to join the network:

1. Join the set of well known nodes between which the connections are allowed.
    You need to be approved by the governance (or sudo) in the system for this.
2. Ask for a *paired peer* connection from a specific node.
    This node can either be a well known node or a normal one.

A node associated with a `PeerId` must have **one and only one owner**.
The owner of a well known node is specified when adding it.
If it's a normal node, *any* user can claim a `PeerId` as its owner.
To protect against false claims, the maintainer of the node should claim it 
*before even starting the node* and therefor revealing their `PeerID` to the network that
*anyone* could subsequently claim.

The owner of a node can then add and remove connections for their node.
To be clear, you can't change the connections between well known nodes,
they are always allowed to connect with each other.
Instead, you can manipulate the connection between a well know node
and a normal node or between two normal nodes and sub-nodes.

The `node-authorization` pallet integrates an
[offchain worker](../../knowledgebase/learn-substrate/off-chain-features#off-chain-workers)
to configure it's node connections. Make sure to enable offchain worker with
the right CLI flag as offchain worker is disabled by default for non-authority nodes.

> Your node may not be synced with the latest block, and thus not be aware of and published updates
> that are reflected in the `node-authorization` chain storage. You may need to disable offchain worker
> and manually set reachable reserved nodes for your node to sync up with the network if this is the case.

## Start with the Template

If you already have Node Template cloned, you can just create a
**check out the v3.0.0 branch** from the base template,
otherwise, clone this branch of the project:

```bash
# Fresh clone, if needed:
git clone -b v3.0.0 --depth 1 https://github.com/substrate-developer-hub/substrate-node-template
# From the working directory, create a new branch and check it out
cd substrate-node-template
git branch perm-network
git checkout perm-network
```

You should be able to `build` the project (or `check`) without any error:

```bash
cd substrate-node-template/
cargo build --release
```

> If you do run into issues building, checkout
> [these helpful tips](../../knowledgebase/getting-started/#2-rust-developer-environment)

Now open the code with your favorite editor, can't wait to make some changes right?

## Add the `node-authorization` pallet

First we must add the pallet to our runtime dependencies:

**`runtime/Cargo.toml`**

```TOML
[dependencies]
#--snip--
pallet-node-authorization = { default-features = false, version = '3.0.0' }

#--snip--
[features]
default = ['std']
std = [
    #--snip--
    'pallet-node-authorization/std',
    #--snip--
]
```
We need to simulate the governance in our simple blockchain, so we just let a `sudo` admin rule, 
configuring the pallet's interface to `EnsureRoot`. In a production environment we sould want to have 
difference, governance based checking implimented here. More details of this `Config` can be found in
the pallet's 
[reference docs](https://docs.rs/pallet-node-authorization/3.0.0/pallet_node_authorization/trait.Config.html).

**`runtime/src/lib.rs`**

```rust

/* --snip-- */

use frame_system::EnsureRoot;

/* --snip-- */

parameter_types! {
    pub const MaxWellKnownNodes: u32 = 8;
    pub const MaxPeerIdLength: u32 = 128;
}

impl pallet_node_authorization::Config for Runtime {
    type Event = Event;
    type MaxWellKnownNodes = MaxWellKnownNodes;
    type MaxPeerIdLength = MaxPeerIdLength;
    type AddOrigin = EnsureRoot<AccountId>;
    type RemoveOrigin = EnsureRoot<AccountId>;
    type SwapOrigin = EnsureRoot<AccountId>;
    type ResetOrigin = EnsureRoot<AccountId>;
    type WeightInfo = ();
}

/* --snip-- */
```

Finally, we are ready to put our pallet in `construct_runtime` macro with following extra line of code:

**`runtime/src/lib.rs`**

```rust
construct_runtime!(
    pub enum Runtime where
        Block = Block,
        NodeBlock = opaque::Block,
        UncheckedExtrinsic = UncheckedExtrinsic
    {
        /* --snip-- */

        /*** Add This Line ***/
        NodeAuthorization: pallet_node_authorization::{Module, Call, Storage, Event<T>, Config<T>},

        /* --snip-- */

    }
);
```

## Add genesis storage for our pallet

`PeerId` is encoded in bs58 format, so we need a new library
[bs58](https://docs.rs/bs58/0.3.1/bs58/) in **node/cargo.toml** to decode it to get its bytes.

**`node/cargo.toml`**

```TOML
[dependencies]
#--snip--
bs58 = "0.4.0"
#--snip--
```

Now we add a proper genesis storage in **node/src/chain_spec.rs**. Similarly, import the necessary dependencies:

**node/src/chain_spec.rs**

```rust
/* --snip-- */
use sp_core::OpaquePeerId; // A struct wraps Vec<u8>, represents as our `PeerId`.
use node_template_runtime::NodeAuthorizationConfig; // The genesis config that serves for our pallet.
/* --snip-- */
```

Adding our genesis config in the helper function `testnet_genesis`,

**node/src/chain_spec.rs**

```rust
/// Configure initial storage state for FRAME modules.
fn testnet_genesis(
    wasm_binary: &[u8],
    initial_authorities: Vec<(AuraId, GrandpaId)>,
    root_key: AccountId,
    endowed_accounts: Vec<AccountId>,
    _enable_println: bool,
) -> GenesisConfig {

    /* --snip-- */

    /*** Add This Block Item ***/
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

    /* --snip-- */

}
```

`NodeAuthorizationConfig` contains a property named `nodes`, which is vector of tuple.
The first element of the tuple is the `OpaquePeerId` and we use `bs58::decode` to convert
the `PeerId` in human readable format to bytes. The second element of the tuple is `AccountId`
and represents the owner of this node, here we are using one of the provided endowed accounts
for demonstration: [Alice and Bob](../../knowledgebase/integrate/subkey#well-known-keys).

<!-- TODO: update to use the `key` embedded CLI tool with the node, reference subkey as option -->

You may wondering where the `12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2` comes from.
We can use [subkey](../../knowledgebase/integrate/subkey#generating-node-keys) to generate 
the above human readable `PeerId`.

```bash
subkey generate-node-key
```

> Note: `subkey` is a CLI tool that comes bundled with substrate, and you can install it natively too!
>  - [Install Instructions](../../knowledgebase/integrate/subkey#installation)

The output of the command is like:

```bash
12D3KooWBmAwcd4PJNJvfV89HwE48nwkRmAgo8Vy3uQEyNNHBox2 // this is PeerId.
c12b6d18942f5ee8528c8e2baf4e147b5c5c18710926ea492d09cbd9f6c9f82a // This is node-key.
```

Now all the code changes are finished, we are ready to launch our permissioned network!

> Stuck? The solution with all required changes to the base template can be found [here](https://github.com/substrate-developer-hub/substrate-node-template/tree/tutorials/solutions/permissioned-network-v3).

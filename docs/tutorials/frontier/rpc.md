---
title: Install the RPC Endpoint
---

Now that we are able to query the runtime for ethereum-style data, and we have a mapping from ethereum-style block hashes to native Substrate block hashes, let's expose that capability to users over the RPC. There are actually several different apis, each of which can be added. For the sake of this tutorial, we'll just add the core `EthApi`.

For reference, you can see this work in commit [72ff2ec](https://github.com/JoshOrndorff/substrate-node-template/commit/72ff2ecfabe5945c520001423bcd5395fd0b9b24).

![architecture diagram](assets/tutorials/frontier/rpc.png)

## Snippets
`node/Cargo.toml`

```toml
frontier-rpc = { git = 'https://github.com/PureStake/frontier.git', branch = 'substrate-v2' }
frontier-rpc-primitives = { git = 'https://github.com/PureStake/frontier.git', branch = 'substrate-v2' }
```

`node/src/rpc.rs`

```rust
use node_template_runtime::{opaque::Block, AccountId, Balance, Index, TransactionConverter};
use sc_client_api::{
	backend::{StorageProvider, Backend, StateBackend, AuxStore},
};
use sp_runtime::traits::BlakeTwo256;
```

Here we add a field to the `FullDeps` struct. The ethereum RPC needs to know whether the node is a "miner", so we need this additional information. We will have to plumb this change through the `service.rs` file as well.
`node/src/rpc.rs`

```rust
/// Full client dependencies.
pub struct FullDeps<C, P> {
	/// The client instance to use.
	pub client: Arc<C>,
	/// Transaction pool instance.
	pub pool: Arc<P>,
	/// Whether to deny unsafe calls
	pub deny_unsafe: DenyUnsafe,
	/// The Node authority flag
	pub is_authority: bool,
}
```

The changes to `create_full`'s signature are a great jumping off point into the inner workings of Substrate. Each additional trait bound should be studied in its own right.

TODO: Lots of rustdocs links would be useful here.
There are three generic types: `C` for **c**lient, `P` for Transaction **P**ool, and, newly added, `BE` for **B**ackend.

There are also several trait bounds.
https://substrate.dev/rustdocs/v2.0.0/sc_client_api/backend/trait.Backend.html
https://substrate.dev/rustdocs/v2.0.0/sc_client_api/backend/trait.StateBackend.html
https://substrate.dev/rustdocs/v2.0.0/sc_client_api/backend/trait.StorageProvider.html
https://substrate.dev/rustdocs/v2.0.0/sc_client_api/backend/trait.AuxStore.html
EthereumRuntimeRPCApi (not part of substrate, so no hosted rustdocs)
https://substrate.dev/rustdocs/v2.0.0/sp_transaction_pool/trait.TransactionPool.html

`node/src/rpc.rs`

```rust
/// Instantiate all full RPC extensions.
pub fn create_full<C, P, BE>(
	deps: FullDeps<C, P>,
) -> jsonrpc_core::IoHandler<sc_rpc::Metadata> where
	BE: Backend<Block> + 'static,
	BE::State: StateBackend<BlakeTwo256>,
	C: ProvideRuntimeApi<Block>,
	C: StorageProvider<Block, BE>,
	C: AuxStore,
	C: HeaderBackend<Block> + HeaderMetadata<Block, Error=BlockChainError> + 'static,
	C: Send + Sync + 'static,
	C::Api: substrate_frame_rpc_system::AccountNonceApi<Block, AccountId, Index>,
	C::Api: pallet_transaction_payment_rpc::TransactionPaymentRuntimeApi<Block, Balance>,
	C::Api: BlockBuilder<Block>,
	C::Api: frontier_rpc_primitives::EthereumRuntimeRPCApi<Block>,
	P: TransactionPool<Block=Block> + 'static
{
  // -- snip --
}
```

Here we have another import, but the precedent is to include it inside the `create_full` function instead of at the top.

`node/src/rpc.rs`

```rust
use frontier_rpc::{EthApi, EthApiServer};
```

More plumbing of `is_authority`

```rust
let FullDeps {
  client,
  pool,
  deny_unsafe,
  is_authority,
} = deps;
```

Finally install the actual RPC extension. Depending on what order you place this code, you may need to modify some of the clones.

```rust
io.extend_with(
  EthApiServer::to_delegate(EthApi::new(
    client.clone(),
    pool.clone(),
    TransactionConverter,
    is_authority,
  ))
);
```

And with the `rpc.rs` file complete, we now plumb the `is_authority` change through the service.

`node/src/service.rs`

```rust
let is_authority = role.is_authority();
```

`node/src/service.rs`

```rust
let deps = crate::rpc::FullDeps {
	client: client.clone(),
	pool: pool.clone(),
	deny_unsafe,
	is_authority,
};
```

## Helpful Resources

* Recipe about Custom RPCs https://substrate.dev/recipes/custom-rpc.html
* Definition of the `EthAPI` RPC interface https://github.com/paritytech/frontier/blob/51bd10ff209f1f19cd33715d2d75e6768eca5352/rpc/core/src/eth.rs
* All RPC interfaces that come with Frontier https://github.com/paritytech/frontier/tree/51bd10ff209f1f19cd33715d2d75e6768eca5352/rpc/core/src

## Check Your Work

At this point the entire node should build with `cargo check`.

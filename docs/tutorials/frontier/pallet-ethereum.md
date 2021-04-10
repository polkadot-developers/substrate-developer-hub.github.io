---
title: Add the Ethereum Pallet in Your Runtime
---

Now we will add pallet Ethereum which is responsible for storing Ethereum-formatted blocks, transaction receipts, and transaction statuses.

The biggest challenge here is that the Frontier project does not use the same, published, Substrate crates; it takes Substrate code from github. For this workshop, I've made a special branch of Frontier that uses the published dependencies.

For reference, you can see this work in commit [bbaa3f9](https://github.com/JoshOrndorff/substrate-node-template/commit/bbaa3f90080257451504aed1fed66ea3d446e3d1).

![architecture diagram](assets/tutorials/frontier/pallet-ethereum.png)

## Snippets

`runtime/Cargo.toml`

```toml
pallet-ethereum = { default-features = false, git = 'https://github.com/PureStake/frontier.git', branch = 'substrate-v2' }
```

`runtime/Cargo.toml`

```toml
'pallet-evm/std',
```

`runtime/src/lib.rs`

```rust
impl pallet_ethereum::Trait for Runtime {
	type Event = Event;
	// This means we will never record a block author in the Ethereum-formatted blocks
	type FindAuthor = ();
}
```

`runtime/src/lib.rs`

```rust
Ethereum: pallet_ethereum::{Module, Call, Storage, Event, Config, ValidateUnsigned},
```

## Helpful Resources

* Our frontier branch that uses published Substrate version https://github.com/PureStake/frontier/tree/substrate-v2

## Check Your Work

At this point your runtime should compile. Check with `cargo check -p node-template-runtime`.

As before, the entire node should not compile because the genesis config has not been updated. Confirm that the build fails by running `cargo check`.


* * *
---
title: The Ethereum Pallet Genesis Configuration
---

Again we update the genesis config to work with the updated runtime. For reference, you can see this work in commit [217ac4d](https://github.com/JoshOrndorff/substrate-node-template/commit/217ac4d7a63575631c65e6a2b8936b88fc4bcbca).

## Snippets

`node/src/chain_spec.rs`

```rust
use node_template_runtime::{
	AccountId, AuraConfig, BalancesConfig, GenesisConfig, GrandpaConfig,
	SudoConfig, SystemConfig, WASM_BINARY, Signature, EVMConfig, EthereumConfig,
};
```

`node/src/chain_spec.rs`

```rust
pallet_ethereum: Some(EthereumConfig {}),
```

## Helpful Resources

* https://github.com/paritytech/frontier/blob/51bd10ff209f1f19cd33715d2d75e6768eca5352/frame/ethereum/src/lib.rs#L75-L79 

  Definition of empty genesis config. You may wonder why we have a genesis config at all if it doesn't contain any data. Although we don't need to pass any data into the pallet, we do need the pallet to calculate the ethereum-style genesis block just like it will for every other block in the chain.

## Check Your Work

At this point the entire node should build. Confirm that by running `cargo check`.

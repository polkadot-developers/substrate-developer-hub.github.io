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

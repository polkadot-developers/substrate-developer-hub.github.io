---
title: The EVM Pallet Genesis Configuration
---

Here we update the genesis config that is hard-coded into the node so that it works with the updated runtime. For reference, you can see this work in commit [b5aa541](https://github.com/JoshOrndorff/substrate-node-template/commit/b5aa5417bb2ea9855338bee487f20bcd49eacf05).

## Snippets

`node/src/chain_spec.rs`

```rust
use node_template_runtime::{
	AccountId, AuraConfig, BalancesConfig, GenesisConfig, GrandpaConfig,
	SudoConfig, SystemConfig, WASM_BINARY, Signature, EVMConfig,
};
use std::collections::BTreeMap;
```

`node/src/chain_spec.rs`

```rust
pallet_evm: Some(EVMConfig {
	accounts: BTreeMap::new(),
}),
```

## Helpful Resources

* https://substrate.dev/rustdocs/v2.0.0/pallet_evm/struct.GenesisAccount.html
* Example of actually initializing accounts https://github.com/PureStake/moonbeam/blob/1308eed69a1083fd69fa3324ac4e0a93701d94f6/node/standalone/src/chain_spec.rs#L154-L164

### Check Your Work

At this point the entire node should build. Confirm that by running `cargo check`.

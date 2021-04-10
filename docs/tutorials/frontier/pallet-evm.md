---
title: Add the EVM Pallet in Your Runtime
---

## EVM Runtime Configuration

Here we add the EVM pallet to the runtime. For reference, you can see this work in commit [0a107ca](https://github.com/substrate-developer-hub/substrate-node-template/commit/0a107ca4980a69db16a0ae3ec42b2f94b8fdc685).

![architecture diagram](assets/tutorials/frontier/pallet-evm.png)

### Snippets

**runtime/Cargo.toml**

```toml
pallet-evm = { default-features = false, version = '3.0.0' }
```

**runtime/Cargo.toml**

```toml
[features]
default = ['std']
<!-- snip -->
std = [
	<!-- snip -->
	'pallet-evm/std',
	<!-- snip -->
]
```

* * *

**runtime/src/lib.rs**

```rust
/// Import the EVM pallet.
use pallet_evm::{
	HashedAddressMapping, EnsureAddressTruncated
};
```

**runtime/src/lib.rs**

```rust
// EVM parameters
parameter_types! {
	pub const LeetChainId: u64 = 1337;
}

/// Configure the EVM pallet
impl pallet_evm::Config for Runtime {
	type ChainId = LeetChainId;
	type FeeCalculator = ();
	type Event = Event;
	type Currency = Balances;
	type CallOrigin = EnsureAddressTruncated;
	type WithdrawOrigin = EnsureAddressTruncated;
	type AddressMapping = HashedAddressMapping<BlakeTwo256>;
	type GasWeightMapping = ();
	type Precompiles = ();
	type Runner = pallet_evm::runner::stack::Runner<Self>;
	type OnChargeTransaction = ();
	type BlockGasLimit = ();
}
```

**runtime/src/lib.rs**

```rust
construct_runtime!(
	pub enum Runtime where
		Block = Block,
		NodeBlock = opaque::Block,
		UncheckedExtrinsic = UncheckedExtrinsic
	{
		//-- snip --
		// Include the EVM pallet-template in the runtime.
		EVM: pallet_evm::{Module, Call, Storage, Config, Event<T>},
		//-- snip --
	}
)
```

* * *


## EVM Genesis Configuration

### Snippets

**node/src/chain_spec.rs**

```rust
use node_template_runtime::{
	AccountId, AuraConfig, BalancesConfig, GenesisConfig, GrandpaConfig,
	SudoConfig, SystemConfig, WASM_BINARY, Signature, EVMConfig,         // <--- ADDED `EVMConfig`
};
use std::collections::BTreeMap; // <--- Add BTreeMap dep.
```

**node/src/chain_spec.rs**

```rust
fn testnet_genesis(
	wasm_binary: &[u8],
	initial_authorities: Vec<(AuraId, GrandpaId)>,
	root_key: AccountId,
	endowed_accounts: Vec<AccountId>,
	_enable_println: bool,
) -> GenesisConfig {
	GenesisConfig {
		// -- snip --
		pallet_evm: Some(EVMConfig {
			accounts: BTreeMap::new(),
		}),
		// -- snip --
	}
}

```

## Build Your Work

At this point your runtime should compile. Let's get a headstart if you have not complied yet to 
make changes and checks faster Check with `cargo build --release`.

## Helpful Resources

<!-- TODO FIXME v2->v3 when published. https://github.com/paritytech/frontier/issues/354 -->

### EVM Pallet (v2.0.0)
* https://substrate.dev/rustdocs/v2.0.0/pallet_evm/index.html
* https://substrate.dev/rustdocs/v2.0.0/pallet_evm/struct.EnsureAddressTruncated.html
* https://substrate.dev/rustdocs/v2.0.0/pallet_evm/struct.HashedAddressMapping.html

### Genesis (v2.0.0)
* https://substrate.dev/rustdocs/v2.0.0/pallet_evm/struct.GenesisAccount.html
* Example of actually initializing accounts https://github.com/PureStake/moonbeam/blob/1308eed69a1083fd69fa3324ac4e0a93701d94f6/node/standalone/src/chain_spec.rs#L154-L164


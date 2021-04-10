---
title: Wrapping Ethereum Transactions
---

When a user submits a raw Ethereum transaction, we need to convert it into a Substrate transaction. The conversion is simple. we just wrap the raw transaction in a call the pallet_ethereum's `transact` extrinsic. This is done in the runtime.

For reference, you can see this work in commit [b2e9b2c](https://github.com/JoshOrndorff/substrate-node-template/commit/b2e9b2ccd0e6aff267ca4eeebb0ddb373476dd79).

## Snippets

`runtime/Cargo.toml`

```toml
frontier-rpc-primitives = { default-features = false, git = 'https://github.com/PureStake/frontier.git', branch = 'substrate-v2' }
```

`runtime/Cargo.toml`

```toml
'frontier-rpc-primitives/std',
```

`runtime/src/lib.rs`

```rust
use codec::{Encode, Decode};
```


`runtime/src/lib.rs`

```rust
/// A unit struct that can can convert ethereum-formatted transactions into Substrate-formatted transactions
/// The ConvertTransaction trait is implemented twice. Once for Uncheckd Extrinsic and once for Opaque Unchecked Extrinsic
/// Essentially we wrap the raw ethereum transaction in a call to the transact extrinsic in pallet ethereum.
pub struct TransactionConverter;

impl frontier_rpc_primitives::ConvertTransaction<UncheckedExtrinsic> for TransactionConverter {
	fn convert_transaction(&self, transaction: pallet_ethereum::Transaction) -> UncheckedExtrinsic {
		UncheckedExtrinsic::new_unsigned(pallet_ethereum::Call::<Runtime>::transact(transaction).into())
	}
}

impl frontier_rpc_primitives::ConvertTransaction<opaque::UncheckedExtrinsic> for TransactionConverter {
	fn convert_transaction(&self, transaction: pallet_ethereum::Transaction) -> opaque::UncheckedExtrinsic {
		let extrinsic = UncheckedExtrinsic::new_unsigned(pallet_ethereum::Call::<Runtime>::transact(transaction).into());
		let encoded = extrinsic.encode();
		opaque::UncheckedExtrinsic::decode(&mut &encoded[..]).expect("Encoded extrinsic is always valid")
	}
}
```

## Helpful Resources

## Check Your Work

At this point the entire node should build with `cargo check`.

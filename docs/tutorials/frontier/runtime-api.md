---
title: Install the Runtime API
---

Now that our runtime is storing all the ethereum-formatted information that may be queried, we need a way for the RPC server to call into the runtime and retrieve that information. This is done through a runtime API, and it is entirely plumbing.

For reference, you can see this work in commit [2282def](https://github.com/JoshOrndorff/substrate-node-template/commit/2282defa06d4104d8f68643d42ae8e0f0d4d6b38).

## Snippets

`runtime/src/lib.rs`

```rust
use sp_core::{crypto::KeyTypeId, OpaqueMetadata, U256, H160, H256};
use pallet_evm::{
	Account as EVMAccount, FeeCalculator, EnsureAddressTruncated, HashedAddressMapping,
};
use frontier_rpc_primitives::TransactionStatus;
```

`runtime/src/lib.rs`

```rust
impl frontier_rpc_primitives::EthereumRuntimeRPCApi<Block> for Runtime {
	fn chain_id() -> u64 {
		<Runtime as pallet_evm::Trait>::ChainId::get()
	}

	fn account_basic(address: H160) -> EVMAccount {
		EVM::account_basic(&address)
	}

	fn gas_price() -> U256 {
		<Runtime as pallet_evm::Trait>::FeeCalculator::min_gas_price()
	}

	fn account_code_at(address: H160) -> Vec<u8> {
		EVM::account_codes(address)
	}

	fn author() -> H160 {
		Ethereum::find_author()
	}

	fn storage_at(address: H160, index: U256) -> H256 {
		let mut tmp = [0u8; 32];
		index.to_big_endian(&mut tmp);
		EVM::account_storages(address, H256::from_slice(&tmp[..]))
	}

	fn call(
		from: H160,
		data: Vec<u8>,
		value: U256,
		gas_limit: U256,
		gas_price: Option<U256>,
		nonce: Option<U256>,
		action: pallet_ethereum::TransactionAction,
	) -> Result<(Vec<u8>, U256), sp_runtime::DispatchError> {
		match action {
			pallet_ethereum::TransactionAction::Call(to) =>
				EVM::execute_call(
					from,
					to,
					data,
					value,
					gas_limit.low_u32(),
					gas_price.unwrap_or_default(),
					nonce,
					false,
				)
				.map(|(_, ret, gas, _)| (ret, gas))
				.map_err(|err| err.into()),
			pallet_ethereum::TransactionAction::Create =>
				EVM::execute_create(
					from,
					data,
					value,
					gas_limit.low_u32(),
					gas_price.unwrap_or_default(),
					nonce,
					false,
				)
				.map(|(_, _, gas, _)| (vec![], gas))
				.map_err(|err| err.into()),
		}
	}

	fn current_transaction_statuses() -> Option<Vec<TransactionStatus>> {
		Ethereum::current_transaction_statuses()
	}

	fn current_block() -> Option<pallet_ethereum::Block> {
		Ethereum::current_block()
	}

	fn current_receipts() -> Option<Vec<pallet_ethereum::Receipt>> {
		Ethereum::current_receipts()
	}

	fn current_all() -> (
		Option<pallet_ethereum::Block>,
		Option<Vec<pallet_ethereum::Receipt>>,
		Option<Vec<TransactionStatus>>
	) {
		(
			Ethereum::current_block(),
			Ethereum::current_receipts(),
			Ethereum::current_transaction_statuses()
		)
	}
}
```


## Helpful Resources

* Recipe about Runtime APIs https://substrate.dev/recipes/runtime-api.html
* Definition of the `EthereumRuntimeRPCApi` https://github.com/paritytech/frontier/blob/51bd10ff209f1f19cd33715d2d75e6768eca5352/rpc/primitives/src/lib.rs

## Check Your Work

At this point the entire node should build with `cargo check`.

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

---
title: Schedule an Upgrade
---

Now that the Node Template has been upgraded to include the Scheduler pallet,
[the `schedule` function](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_scheduler/enum.Call.html#variant.schedule)
can be used to perform the next runtime upgrade. In the previous section, the
`sudo_unchecked_weight` function was used to override the weight associated with the `set_code`
function; in this section, the runtime upgrade will be _scheduled_ so that it can be processed as
the only [extrinsic](../../knowledgebase/learn-substrate/extrinsics) in a block.

## Prepare an Upgraded Runtime

This upgrade is more straightforward than the previous one and only requires updating a single value
in `runtime/src/lib.rs` aside from the runtime's `spec_version`.

```rust
pub const VERSION: RuntimeVersion = RuntimeVersion {
	spec_name: create_runtime_str!("node-template"),
	impl_name: create_runtime_str!("node-template"),
	authoring_version: 1,
	spec_version: 3,  // Update this value.
	impl_version: 1,
	apis: RUNTIME_API_VERSIONS,
	transaction_version: 1,
};

/*** snip ***/

parameter_types! {
	pub const ExistentialDeposit: u128 = 1000;  // Update this value.
	pub const MaxLocks: u32 = 50;
}

impl pallet_balances::Trait for Runtime {
	type MaxLocks = MaxLocks;
	/// The type for recording an account's balance.
	type Balance = Balance;
	/// The ubiquitous event type.
	type Event = Event;
	type DustRemoval = ();
	type ExistentialDeposit = ExistentialDeposit;
	type AccountStore = System;
	type WeightInfo = ();
}
```

This change increases the value of the Balances pallet's
[`ExistentialDeposit`](../../knowledgebase/getting-started/glossary#existential-deposit) - the
minimum balance needed to keep an account alive from the point-of-view of the Balances pallet. Keep
in mind that this change will _not_ cause all accounts with balances between 500 and 1000 to be
dropped - that would require a storage migration, which is out of the scope of this tutorial.

Build the upgraded runtime.

```shell
cargo build --release -p node-template-runtime
```

## Upgrade the Runtime

In the previous section, the Scheduler pallet was configured with the `Root` origin as its
[`ScheduleOrigin`](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_scheduler/trait.Trait.html#associatedtype.ScheduleOrigin),
which means that the `sudo` function (_not_ `sudo_unchecked_weight`) can be used to invoke the
`schedule` function. Use this link to open the Polkadot JS Apps UI's Sudo tab:
https://polkadot.js.org/apps/#/sudo?rpc=ws://127.0.0.1:9944. Wait until all the other fields have
been filled in before providing the `when` parameter. Leave the `maybe_periodic` parameter empty and
the `priority` parameter at its default value of `0`. Select the System pallet's `set_code` function
as the `call` parameter and provide the Wasm binary as before. Leave the "with weight override"
option deactivated. Once all the other fields have been filled in, use a block number about 10
blocks (1 minute) in the future to fill in the `when` parameter and quickly submit the transaction.
You can use the template node's command line output or the
[Polkadot JS Apps UI block explorer](https://polkadot.js.org/apps/#/explorer?rpc=ws://127.0.0.1:9944)
to select a block number.

![Scheduled Upgrade](assets/tutorials/upgrade-a-chain/scheduled-upgrade.png)

After the target block has been included in the chain, the version number in the upper-left-hand
corner of Polkadot JS Apps UI should reflect that the runtime version is now `3`.

![Version 3](assets/tutorials/upgrade-a-chain/version-3.png)

You can observe the changes that were made in the upgrade by using the
[Polkadot JS Apps UI Chain State](https://polkadot.js.org/apps/#/chainstate/constants?rpc=ws://127.0.0.1:9944)
app to query the `existentialDeposit` constant value from the Balances pallet.

---
title: "Adding a Pallet to Your Runtime"
---

The [Substrate node template](https://github.com/paritytech/substrate/tree/master/bin/node-template) provides a minimal working runtime which you can use to quickly get started building your own custom blockchain. However, in the attempts to remain minimal, it does not include most of the pallets from ([FRAME](overview/glossary.md#frame-framework-runtime-aggregation-modularised-entities)).

This guide will show you how you can add the [Contracts pallet](https://substrate.dev/rustdocs/master/pallet_contracts/index.html) to your runtime in order to allow your blockchain to support Wasm smart contracts. You can follow similar patterns to add additional FRAME pallets to your runtime, however you should note that each pallet can be a little different in terms of the specific settings needed to import and use it correctly.

## Prerequisites

Before you can follow this guide, you need to make sure that your computer is set up to work with and build Substrate.

To install all the prerequisites needed for the Substrate build environment, like Rust, you can run:

```bash
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

#### Get the Node Template

```bash
git clone https://github.com/substrate-developer-hub/substrate-node-template
```

#### Run your node.

It will take a little while for Rust to build your node, but once it is complete, you should be able to start your node with:

```bash
cd substrate-node-template/
cargo run --release -- --dev
```

If you have gotten this far, then you are ready to start adding the new pallet to your runtime.

Remember to stop your node with `control + C`!

## Importing a Pallet Crate

The first thing you need to do to add the Contracts pallet is to import the `pallet-contracts` crate in your runtime's `Cargo.toml` file. If you want a proper primer into Cargo References, you should check out [their official documentation](https://doc.rust-lang.org/cargo/reference/index.html).

Open `substrate-node-template/runtime/Cargo.toml` and you will see a file which lists all the dependencies your runtime has. For example, it depends on the [Balances pallet](https://substrate.dev/rustdocs/master/pallet_balances/index.html):

**`runtime/Cargo.toml`**

```TOML
[dependencies.balances]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'pallet-balances'
rev = '<git-commit>'
```

### Crate Features

One important thing we need to call out with importing pallet crates is making sure to set up the crate `features` correctly. In the code snippet above, you will notice that we set `default_features = false`. If you explore the `Cargo.toml` file even closer, you will find something like:

**`runtime/Cargo.toml`**

```TOML
[features]
default = ['std']
std = [
    'codec/std',
    'client/std',
    'sp-std/std',
    'sp-io/std',
    'balances/std',
    'frame-support/std',
    #--snip--
]
```

This second line defines the `default` features of your runtime crate as `std`. You can imagine, each pallet crate has a similar configuration defining the default feature for the crate. Your feature will determine the features that should be used on downstream dependencies. For example, the snippet above should be read as:

> The default feature for this Substrate runtime is `std`. When `std` feature is enabled for the runtime, `parity-scale-codec`, `primitives`, `client`, and all the other listed dependencies should use their `std` feature too.

This is important to enable the Substrate runtime to compile to both native binaries (which support Rust [`std`](https://doc.rust-lang.org/std/)) and Wasm binaries (which do not: [`no_std`](https://rust-embedded.github.io/book/intro/no-std.html)).

To see how these features actually get used in the runtime code, we can open the project file:

**`runtime/src/lib.rs`**

```rust
//! The Substrate Node Template runtime. This can be compiled with `#[no_std]`, ready for Wasm.

#![cfg_attr(not(feature = "std"), no_std)]
// `construct_runtime!` does a lot of recursion and requires us to increase the limit to 256.
#![recursion_limit="256"]

// Make the WASM binary available.
#[cfg(feature = "std")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

use sp_std::prelude::*;
/* --snip-- */

// A few exports that help ease life for downstream crates.
#[cfg(any(feature = "std", test))]
pub use sp_runtime::BuildStorage;
pub use timestamp::Call as TimestampCall;
pub use balances::Call as BalancesCall;
/* --snip-- */
```

You can see that at the top of the file, we define that we will use `no_std` when we are *not* using the `std` feature. A few lines lower you can see `#[cfg(feature = "std")]` above the `wasm_binary.rs` import, which is a flag saying to only import the WASM binary when we have enabled the `std` feature.

### Importing the Contracts Pallet Crate

Okay, now that we have covered the basics of crate features, we can actually import the Contracts pallet. The Contracts pallet is probably the most complicated pallet in FRAME, so it makes for a good example of some of the trickiness that can be involved when adding additional pallets. To give you a hint as to what is to come, you should take a look at the [`Cargo.toml` file for the Contracts pallet](https://github.com/paritytech/substrate/blob/master/frame/contracts/Cargo.toml).

First we will add the new dependency by simply copying an existing pallet, and changing the values. So based on the `balances` import shown above, my `contracts` import will look like:

**`runtime/Cargo.toml`**

```TOML
[dependencies.contracts]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'pallet-contracts'
rev = '<git-commit>' # e.g. '40a16efefc070faf5a25442bc3ae1d0ea2478eee'
```

You [can see](https://github.com/paritytech/substrate/blob/master/frame/contracts/Cargo.toml) that the Contracts pallet has `std` feature, thus we need to add that feature to our runtime:

**`runtime/Cargo.toml`**

```TOML
[features]
default = ["std"]
std = [
    #--snip--
    'contracts/std',
    #--snip--
]
```

If you forget to set the feature, when building to your native binaries you will get errors like:

```rust
error[E0603]: function `memory_teardown` is private
  --> ~/.cargo/git/checkouts/substrate-7e08433d4c370a21/90fc723/primitives/sr-sandbox/src/../without_std.rs:53:12
   |
53 |         sandbox::memory_teardown(self.memory_idx);
   |                  ^^^^^^^^^^^^^^^

error[E0603]: function `memory_new` is private
  --> ~/.cargo/git/checkouts/substrate-7e08433d4c370a21/90fc723/primitives/sr-sandbox/src/../without_std.rs:72:18
   |
72 |         match sandbox::memory_new(initial, maximum) {
   |                        ^^^^^^^^^^

error[E0603]: function `memory_get` is private

error: aborting due to previous errors
```

But since you did not forget, you should be able to sanity check that everything compiles correctly with:

```bash
cargo run --release -- --dev
```

## Adding the Contracts Pallet

Now that we have successfully imported the Contracts pallet crate, we need to add it to our Runtime. The first thing we will add to our runtime is the Gas type.

**`runtime/src/lib.rs`**

```rust
//! The Substrate Node Template runtime. This can be compiled with `#[no_std]`, ready for Wasm.

#![cfg_attr(not(feature = "std"), no_std)]
// `construct_runtime!` does a lot of recursion and requires us to increase the limit to 256.
#![recursion_limit="256"]

// Make the WASM binary available.
#[cfg(feature = "std")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

use sp_std::prelude::*;
/* --snip-- */

// A few exports that help ease life for downstream crates.
#[cfg(any(feature = "std", test))]
pub use sp_runtime::BuildStorage;
pub use timestamp::Call as TimestampCall;
pub use balances::Call as BalancesCall;

/*** Add This Line ***/
pub use contracts::Gas as ContractsGas;
/* --snip-- */
```

If you have followed our [other basic tutorials](tutorials/creating-your-first-substrate-chain.md), you may remember that we need to implement a `contracts::Trait` and also add `Contracts: contracts,` to our `construct_runtime!` macro.

### Implementing the Contract Trait

To figure out what we need to implement, you can take a look to the FRAME [`contracts::Trait` documentation](https://substrate.dev/rustdocs/master/pallet_contracts/trait.Trait.html) or the [Contracts pallet source code](https://github.com/paritytech/substrate/blob/master/frame/contracts/src/lib.rs). For our runtime, the implementation will look like this:

**`runtime/src/lib.rs`**

```rust

// These time units are defined in number of blocks.
   /* --snip-- */

/*** Add This Block ***/
// Contracts price units.
pub const MILLICENTS: Balance = 1_000_000_000;
pub const CENTS: Balance = 1_000 * MILLICENTS;
pub const DOLLARS: Balance = 100 * CENTS;
/*** End Added Block ***/
```

```rust

impl timestamp::Trait for Runtime {
    /* --snip-- */
}

/*** Add This Block ***/
parameter_types! {
	pub const ContractTransferFee: Balance = 1 * CENTS;
	pub const ContractCreationFee: Balance = 1 * CENTS;
	pub const ContractTransactionBaseFee: Balance = 1 * CENTS;
	pub const ContractTransactionByteFee: Balance = 10 * MILLICENTS;
	pub const ContractFee: Balance = 1 * CENTS;
	pub const TombstoneDeposit: Balance = 1 * DOLLARS;
	pub const RentByteFee: Balance = 1 * DOLLARS;
	pub const RentDepositOffset: Balance = 1000 * DOLLARS;
	pub const SurchargeReward: Balance = 150 * DOLLARS;
}

impl contracts::Trait for Runtime {
	type Currency = Balances;
	type Time = Timestamp;
	type Randomness = RandomnessCollectiveFlip;
	type Call = Call;
	type Event = Event;
	type DetermineContractAddress = contracts::SimpleAddressDeterminator<Runtime>;
	type ComputeDispatchFee = contracts::DefaultDispatchFeeComputor<Runtime>;
	type TrieIdGenerator = contracts::TrieIdFromParentCounter<Runtime>;
	type GasPayment = ();
	type RentPayment = ();
	type SignedClaimHandicap = contracts::DefaultSignedClaimHandicap;
	type TombstoneDeposit = TombstoneDeposit;
	type StorageSizeOffset = contracts::DefaultStorageSizeOffset;
	type RentByteFee = RentByteFee;
	type RentDepositOffset = RentDepositOffset;
	type SurchargeReward = SurchargeReward;
	type TransferFee = ContractTransferFee;
	type CreationFee = ContractCreationFee;
	type TransactionBaseFee = ContractTransactionBaseFee;
	type TransactionByteFee = ContractTransactionByteFee;
	type ContractFee = ContractFee;
	type CallBaseFee = contracts::DefaultCallBaseFee;
	type InstantiateBaseFee = contracts::DefaultInstantiateBaseFee;
	type MaxDepth = contracts::DefaultMaxDepth;
	type MaxValueSize = contracts::DefaultMaxValueSize;
	type BlockGasLimit = contracts::DefaultBlockGasLimit;
}
/*** End Added Block ***/
```

To go into a bit more detail here, we see from the documentation that `type Currency` in the Contracts pallet needs to be defined and support the requirements of the trait `Currency`

```rust
// From the reference documentation, also found in `contracts` pallet:
//   https://github.com/paritytech/substrate/blob/master/frame/contracts/src/lib.rs

type Currency: Currency<Self::AccountId>
```

Fortunately, the Balances pallet implements this type, so we can simply reference `Balances` to gain access to it.

Similarly, `type DetermineContractAddress` requires the trait `ContractAddressFor`. The Contracts pallet itself implements a type with this trait in `contract::SimpleAddressDeterminator`, thus we can use that implementation to satisfy our `contracts::Trait`. At this point, I really recommend you explore the source code of the [Contracts pallet](https://github.com/paritytech/substrate/blob/master/frame/contracts/src/lib.rs) if things don't make sense or you want to gain a deeper understanding.

### Adding Contract to the Construct Runtime Macro

Next, we need to add the pallet to the `construct_runtime!` macro. For this, we need to determine the types that the pallet exposes so that we can tell the our runtime that they exist. The complete list of possible types can be found in the [`construct_runtime!` macro documentation](https://substrate.dev/rustdocs/master/frame_support/macro.construct_runtime.html).

If we look at the Contracts pallet in detail, we know it has:

* Module **Storage**: Because it uses the `decl_storage!` macro.
* Module **Event**s: Because it uses the `decl_event!` macro.
* **Call**able Functions: Because it has dispatchable functions in the `decl_module!` macro.
* **Config**uration Values: Because the `decl_storage!` macro has `config()` parameters.
* The **Module** type from the `decl_module!` macro.

Thus, when we add the pallet, it will look like this:

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
        Contracts: contracts,
    }
);
```

Note that not all pallets will expose all of these runtime types, and some may expose more! You always look at the source code of a pallet or the documentation of the pallet to determine which of these types you need to expose.

### Adding Runtime Hooks

Substrate provides the ability for pallets to expose "hooks" where changes in the pallet can trigger functions in other pallets. For example, you could create a pallet which executes some action every time a new account is created (when it first gains a balance over the [existential deposit](https://substrate.dev/docs/en/overview/glossary#existential-deposit)).

In the case of the Contracts pallet, we actually want a hook when an account runs out of free balance. Because the Contracts pallet instantiates contracts as "Accounts", it also needs to know when an account is destroyed so that it can clean up any storage that contract was using. You can find that logic in the Contracts pallet source code:

```rust
// From the reference documentation, also found in `contracts` pallet:
//   https://github.com/paritytech/substrate/blob/master/frame/contracts/src/lib.rs

impl<T: Trait> OnFreeBalanceZero<T::AccountId> for Module<T> {
	fn on_free_balance_zero(who: &T::AccountId) {
		if let Some(ContractInfo::Alive(info)) = <ContractInfoOf<T>>::take(who) {
			child::kill_storage(&info.trie_id);
		}
	}
}
```

To enable this, we simply need to add `Contracts` type that we defined in 
the `construct_runtime!` macro to the `OnFreeBalanceZero` hook provided by 
the Balances pallet:

**`runtime/src/lib.rs`**

```rust
impl balances::Trait for Runtime {
    /// What to do if an account's free balance gets zeroed.
    type OnFreeBalanceZero = Contracts;
    /* --snip-- */
}
```
Now, when the Balances pallet detects that the free balance of an account has 
reached zero, it calls the `on_free_balance_zero` function of the Contracts pallet.

### Exposing The Contracts API

We now want to enable an easy way to get the contract's state. It's not required to 
enable RPC calls on the contracts pallet to use it in our chain. 
However, we'll do it to make calls to our node's storage without making a transaction.

Contracts do not return data at the end of their execution. Due to the nature of blockchains, 
a transaction needs to be valid to get finalized and included in a block before getting the 
current state.

To achieve this, we need to start by adding the required API dependencies.

**`runtime/Cargo.toml`**
```TOML
[dependencies.contracts-rpc-runtime-api]
default-features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'pallet-contracts-rpc-runtime-api'
rev = '<git-commit>' # e.g. '40a16efefc070faf5a25442bc3ae1d0ea2478eee'
```

**`runtime/Cargo.toml`**
```TOML
[features]
default = ["std"]
std = [
    #--snip--
    'contracts-rpc-runtime-api/std',
]
```

To get the state of a variable, we have to call a getter function that will 
return a `ContractExecResult` wrapper with the current state of the execution.

We need to add the return type to our runtime.

**`runtime/src/lib.rs`**
```rust
/* --snip-- */
use sp_std::prelude::*;

/*** Add This Line ***/
use contracts_rpc_runtime_api::ContractExecResult;
/* --snip-- */
```

The next step, is to implement the required functions to handle the returned data.

```rust
impl_runtime_apis! {
   /* --snip-- */

   /*** Add This Block ***/
    impl contracts_rpc_runtime_api::ContractsApi<Block, AccountId, Balance> for Runtime {
        fn call(
            origin: AccountId,
            dest: AccountId,
            value: Balance,
            gas_limit: u64,
            input_data: Vec<u8>,
        ) -> ContractExecResult {
            let exec_result = Contracts::bare_call(
                origin,
                dest.into(),
                value,
                gas_limit,
                input_data,
            );
            match exec_result {
                Ok(v) => ContractExecResult::Success {
                    status: v.status,
                    data: v.data,
                },
                Err(_) => ContractExecResult::Error,
            }
        }

        fn get_storage(
            address: AccountId,
            key: [u8; 32],
        ) -> contracts_rpc_runtime_api::GetStorageResult {
            Contracts::get_storage(address, key).map_err(|rpc_err| {
                use contracts::GetStorageError;
                use contracts_rpc_runtime_api::{GetStorageError as RpcGetStorageError};
                /// Map the contract error into the RPC layer error.
                match rpc_err {
                    GetStorageError::ContractDoesntExist => RpcGetStorageError::ContractDoesntExist,
                    GetStorageError::IsTombstone => RpcGetStorageError::IsTombstone,
                }
            })
        }
    }
   /*** End Added Block ***/
}
```

## Service Configuration

The next thing we need to do is to establish a service configuration for the Contracts pallet.

**`Cargo.toml`**
```toml
[dependencies]
#--snip--
jsonrpc-core = '14.0.5'

#--snip--
[dependencies.pallet-contracts-rpc]
git = 'https://github.com/paritytech/substrate.git'
rev = '<git-commit>' # e.g. '40a16efefc070faf5a25442bc3ae1d0ea2478eee'

[dependencies.sc-rpc]
git = 'https://github.com/paritytech/substrate.git'
rev = '<git-commit>' # e.g. '40a16efefc070faf5a25442bc3ae1d0ea2478eee'
```

**`src/service.rs`**
```rust
macro_rules! new_full_start {
	($config:expr) => {{
        /*** Add This Line ***/
        type RpcExtension = jsonrpc_core::IoHandler<sc_rpc::Metadata>;
```

Substrate provides an RPC to interact with our node. However, it does not contain access to the contracts pallet by default. To interact with this pallet, we have to extend the existing RPC and add the contracts pallet along with its API.

```rust
            /* --snip-- */
                Ok(import_queue)
            })? // <- Remove semi-colon
            /*** Add This Block ***/
            .with_rpc_extensions(|client, _pool, _backend, _, _| -> Result<RpcExtension, _> {
                use pallet_contracts_rpc::{Contracts, ContractsApi};
                let mut io = jsonrpc_core::IoHandler::default();
                io.extend_with(
                ContractsApi::to_delegate(Contracts::new(client.clone()))
                );
                Ok(io)
            })?;
            /*** End Added Block ***/
        (builder, import_setup, inherent_data_providers)
    }}
```

## Genesis Configuration

Not all pallets will have a genesis configuration, but if they do, you can use its documentation to learn about it. For example, [`pallet_contracts::GenesisConfig` documentation](https://substrate.dev/rustdocs/master/pallet_contracts/struct.GenesisConfig.html) describes all the fields you need to define for the Contracts pallet. This definition is controlled in `substrate-node-template/src/chain_spec.rs`. We need to modify this file to include the `ContractsConfig` type and the contract price units at the top:

**`src/chain_spec.rs`**

```rust
use node_template_runtime::{ContractsConfig, MILLICENTS};
```

Then inside the `testnet_genesis` function we need to add the contract configuration to the returned `GenesisConfig` object as followed:

> IMPORTANT: We are taking the value `_enable_println` from the function parameters.
> Make sure to remove the underscore that precedes the parameter definition.

```rust
fn testnet_genesis(initial_authorities: Vec<(AuraId, GrandpaId)>,
    root_key: AccountId,
    endowed_accounts: Vec<AccountId>,
    enable_println: bool) -> GenesisConfig {
    /*** Add This Block ***/
    let mut contracts_config = ContractsConfig {
        current_schedule: Default::default(),
        gas_price: 1 * MILLICENTS,
    };
    // IMPORTANT: println should only be enabled on development chains!
    contracts_config.current_schedule.enable_println = enable_println;
    /*** End Added Block ***/

    GenesisConfig {
        /* --snip-- */
        
        /*** Add This Line ***/
        contracts: Some(contracts_config),
    }
}
```

## Start Your Upgraded Chain

Now you are ready to compile and run your contract-capable node. We first need to purge the chain to remove the old runtime logic and have the genesis configuration initialized for the Contracts pallet. It is possible to upgrade the chain without purging it but it will remain out of scope for this tutorial.

```bash
cargo run --release -- purge-chain --dev
cargo run --release -- --dev
```

## Adding Other FRAME pallets

In this guide, we walked through specifically how to import the Contracts pallet, but as mentioned in the beginning of this guide, each pallet will be a little different. Have no fear, you can always refer to the ["main" Substrate node runtime](https://github.com/paritytech/substrate/blob/master/bin/node/runtime/) which includes nearly every pallet in the FRAME.

In the `Cargo.toml` file of the Substrate node runtime, you will see an example of how to import each of the different pallets, and in the `lib.rs` file you will find how to add each pallet to your runtime. You can basically copy what was done there to your own runtime.

### Learn More

- [A minimalist tutorial on writing your runtime pallet in its own package](creating-a-runtime-module).
- With your node now capable of running smart contracts, go learn to write your first smart contract in [Substrate Contracts workshop](https://substrate.dev/substrate-contracts-workshop).
- To learn more about writing your own runtime with a front end, we have a [Substrate Collectables Workshop](https://substrate.dev/substrate-collectables-workshop) for building an end-to-end application.
- For more information about runtime development tips and patterns, please refer to our [Substrate Recipes](https://substrate.dev/recipes/).
- Understand the chain-spec file to customize your [Genesis Configuration](docs/development/deployment/chain-spec).

### References

- [FRAME `Contracts` Pallet API](https://substrate.dev/rustdocs/master/pallet_contracts/index.html)

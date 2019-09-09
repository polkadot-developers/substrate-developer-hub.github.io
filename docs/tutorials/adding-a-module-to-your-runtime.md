---
title: "Adding a Module to Your Runtime"
---

The [Substrate node template](https://github.com/paritytech/substrate/tree/master/node-template) provides a minimal working runtime which you can use to quickly get started building your own custom blockchain. However, in the attempts to remain minimal, it does not include most of the modules in the Substrate runtime module library ([SRML](overview/glossary.md#srml-substrate-runtime-module-library)).

This guide will show you how you can add the [Contracts module](https://substrate.dev/rustdocs/master/srml_contracts/index.html) to your runtime in order to allow your blockchain to support Wasm smart contracts. You can follow similar patterns to add additional modules from the SRML to your runtime, however you should note that each module can be a little different in terms of the specific settings needed to import and use it correctly.

## Prerequisites

Before you can follow this guide, you need to make sure that your computer is set up to work with and build Substrate.

To install all the prerequisites needed for the Substrate build environment, like Rust, you can run:

```bash
curl https://getsubstrate.io -sSf | bash -s -- --fast
```
#### Get the node template
```bash
git clone https://github.com/substrate-developer-hub/substrate-node-template

./substrate-node-template/substrate-node-rename.sh contracts-chain <YourName> # Personalize your project
```

#### Run your node.

It will take a little while for Rust to build your node, but once it is complete, you should be able to start your node with:

```bash
cd contracts-chain/
cargo run --release -- --dev
```

If you have gotten this far, then you are ready to start adding the new module to your runtime.

Remember to stop your node with `control + C`!

## Importing a Module Crate

The first thing you need to do to add the Contracts module is to import the `srml_contracts` crate in your runtime's `Cargo.toml` file. If you want a proper primer into Cargo References, you should check out [their official documentation](https://doc.rust-lang.org/cargo/reference/index.html).

Open `contracts-chain/runtime/Cargo.toml` and you will see a file which lists all the dependencies your runtime has. For example, it depends on the [Balances module](https://substrate.dev/rustdocs/master/srml_balances/index.html):

```rust
[dependencies.balances]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-balances'
rev = '<git-commit>'
```

### Crate Features

One important thing we need to call out with importing module crates is making sure to set up the crate `features` correctly. In the code snippet above, you will notice that we set `default_features = false`. If you explore the `Cargo.toml` file even closer, you will find something like:

``` TOML
[features]
default = ['std']
std = [
    'codec/std',
    'client/std',
    'rstd/std',
    'runtime-io/std',
    'support/std',
    'balances/std',
	#--snip--
]
```

This second line defines the `default` features of your runtime crate as `std`. You can imagine, each module crate has a similar configuration defining the default feature for the crate. Your feature will determine the features that should be used on downstream dependencies. For example, the snippet above should be read as:

> The default feature for this Substrate runtime is `std`. When `std` feature is enabled for the runtime, `parity-scale-codec`, `primitives`, `client`, and all the other listed dependencies should use their `std` feature too.

This is important to enable the Substrate runtime to compile to both native binaries (which support Rust [`std`](https://doc.rust-lang.org/std/)) and Wasm binaries (which do not: [`no_std`](https://rust-embedded.github.io/book/intro/no-std.html)).

To see how these features actually get used in the runtime code, we can open `contracts-chain/runtime/src/lib.rs`:

**lib.rs**
```rust
//! The Substrate Node Template runtime. This can be compiled with `#[no_std]`, ready for Wasm.

#![cfg_attr(not(feature = "std"), no_std)]
// `construct_runtime!` does a lot of recursion and requires us to increase the limit to 256.
#![recursion_limit="256"]

// Make the WASM binary available.
#[cfg(feature = "std")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

use rstd::prelude::*;
//--snip--

// A few exports that help ease life for downstream crates.
#[cfg(any(feature = "std", test))]
pub use sr_primitives::BuildStorage;
pub use balances::Call as BalancesCall;
//--snip--
```

You can see that at the top of the file, we define that we will use `no_std` when we are *not* using the `std` feature. A few lines lower you can see `#[cfg(feature = "std")]` above the `wasm_binary.rs` import, which is a flag saying to only import the WASM binary when we have enabled the `std` feature.

### Importing the Contracts Module Crate

Okay, now that we have covered the basics of crate features, we can actually import the Contracts module. The Contracts module is probably the most complicated module in the SRML, so it makes for a good example of some of the trickiness that can be involved when adding additional modules. To give you a hint as to what is to come, you should take a look at the [`Cargo.toml` file for the Contracts module](https://github.com/paritytech/substrate/blob/master/srml/contracts/Cargo.toml).

First we will add the new dependency by simply copying an existing module, and changing the values. So based on the `balances` import shown above, my `contracts` import will look like:

**Cargo.toml**

```rust
[dependencies.contracts]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-contracts'
rev = '<git-commit>'
```

You [can see](https://github.com/paritytech/substrate/blob/master/srml/contracts/Cargo.toml) that the Contracts module has `std` and `no_std` features, thus we need to add both features to our runtime:

```TOML
[features]
default = ["std"]
no_std = [
	'contracts/core',
]
std = [
	'contracts/std',
    #--snip--
]
```

If you forget to set the features, when building to your native binaries you will get errors like:

```rust
error: cannot find macro `vec!` in this scope
   --> /Users/shawntabrizi/.cargo/git/checkouts/substrate-7e08433d4c370a21/783ca18/core/sr-sandbox/src/../without_std.rs:290:24
    |
290 |         let mut return_val = vec![0u8; sandbox_primitives::ReturnValue::ENCODED_MAX_SIZE];
    |                              ^^^

error: aborting due to previous error
```

But since you did not forget, you should be able to sanity check that everything compiles correctly with:

```bash
cargo run --release -- --dev
```

## Adding the Contracts module

Now that we have successfully imported the Contracts module crate, we need to add it to our Runtime. The first thing we will add to our runtime is the Gas type.

**lib.rs**
```rust
//! The Substrate Node Template runtime. This can be compiled with `#[no_std]`, ready for Wasm.

#![cfg_attr(not(feature = "std"), no_std)]
// `construct_runtime!` does a lot of recursion and requires us to increase the limit to 256.
#![recursion_limit="256"]

// Make the WASM binary available.
#[cfg(feature = "std")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

use rstd::prelude::*;
//--snip--

// A few exports that help ease life for downstream crates.
#[cfg(any(feature = "std", test))]
pub use sr_primitives::BuildStorage;
pub use balances::Call as BalancesCall;
pub use contracts::Gas;
//--snip--
```

If you have followed our [other basic tutorials](tutorials/creating-your-first-substrate-chain.md), you may remember that we need to implement a `contracts::Trait` and also add `Contracts: contracts,` to our `construct_runtime!` macro.

### Implementing the Contract Trait

To figure out what we need to implement, you can take a look at the SRML  [`contracts::Trait` documentation](https://substrate.dev/rustdocs/master/srml_contracts/trait.Trait.html) or the [Contracts module source code](https://github.com/paritytech/substrate/blob/master/srml/contracts/src/lib.rs). For our runtime, the implementation will look like this:

```rust
impl contracts::Trait for Runtime {
	type Currency = Balances;
	type Call = Call;
	type Event = Event;
	type DetermineContractAddress = contracts::SimpleAddressDeterminator<Runtime>;
	type ComputeDispatchFee = contracts::DefaultDispatchFeeComputor<Runtime>;
	type TrieIdGenerator = contracts::TrieIdFromParentCounter<Runtime>;
	type GasPayment = ();
	type SignedClaimHandicap = contracts::DefaultSignedClaimHandicap;
	type TombstoneDeposit = contracts::DefaultTombstoneDeposit;
	type StorageSizeOffset = contracts::DefaultStorageSizeOffset;
	type RentByteFee = contracts::DefaultRentByteFee;
	type RentDepositOffset = contracts::DefaultRentDepositOffset;
	type SurchargeReward = contracts::DefaultSurchargeReward;
	type TransferFee = ContractTransferFee;
	type CreationFee = ContractCreationFee;
	type TransactionBaseFee = ContractTransactionBaseFee;
	type TransactionByteFee = ContractTransactionByteFee;
	type ContractFee = ContractFee;
	type CallBaseFee = contracts::DefaultCallBaseFee;
	type CreateBaseFee = contracts::DefaultCreateBaseFee;
	type MaxDepth = contracts::DefaultMaxDepth;
	type MaxValueSize = contracts::DefaultMaxValueSize;
	type BlockGasLimit = contracts::DefaultBlockGasLimit;
}
```

To go into a bit more detail here, we see from the documentation that `type Currency` in the Contracts module needs to be defined and support the requirements of the trait `Currency`

```rust
// From the reference documentation, but also can be found in the Contracts module code
type Currency: Currency<Self::AccountId>
```

Fortunately, the Balances module implements this type, so we can simply reference `Balances` to gain access to it.

Similarly, `type DetermineContractAddress` requires the trait `ContractAddressFor`. The Contracts module itself implements a type with this trait in `contract::SimpleAddressDeterminator`, thus we can use that implementation to satisfy our `contracts::Trait`. At this point, I really recommend you explore the source code of the [Contracts module](https://github.com/paritytech/substrate/blob/master/srml/contract/src/lib.rs) if things don't make sense or you want to gain a deeper understanding.

### Adding Contract to the Construct Runtime Macro

Next, we need to add the module to the `construct_runtime!` macro. For this, we need to determine the types that the module exposes so that we can tell the our runtime that they exist. The complete list of possible types can be found in the [`construct_runtime!` macro documentation](https://substrate.dev/rustdocs/master/srml_support/macro.construct_runtime.html).

If we look at the Contracts module in detail, we know it has:

* Module **Storage**: Because it uses the `decl_storage!` macro.
* Module **Event**s: Because it uses the `decl_event!` macro.
* **Call**able Functions: Because it has dispatchable functions in the `decl_module!` macro.
* **Config**uration Values: Because the `decl_storage!` macro has `config()` parameters.
* The **Module** type from the `decl_module!` macro.

Thus, when we add the module, it will look like this:

```rust
construct_runtime!(
	pub enum Runtime where
		Block = Block,
		NodeBlock = opaque::Block,
		UncheckedExtrinsic = UncheckedExtrinsic
	{
        //--snip--
        Contracts: contracts,
    }
);
```

Note that not all modules will expose all of these runtime types, and some may expose more! You always look at the source code of a module or the documentation of the module to determine which of these types you need to expose.

### Adding Runtime Hooks

Substrate provides the ability for modules to expose "hooks" where changes in the module can trigger functions in other modules. For example, you could create a module which executes some action every time a new account is created (when it first gains a balance over the [existential deposit](https://substrate.dev/docs/en/overview/glossary#existential-deposit)).

In the case of the Contracts module, we actually want a hook when an account runs out of free balance. Because the Contracts module instantiates contracts as "Accounts", it also needs to know when an account is destroyed so that it can clean up any storage that contract was using. You can find that logic in the Contracts module source code:

**Contracts module `lib.rs`**
```rust
impl<T: Trait> OnFreeBalanceZero<T::AccountId> for Module<T> {
	fn on_free_balance_zero(who: &T::AccountId) {
		<CodeHashOf<T>>::remove(who);
		<AccountInfoOf<T>>::get(who).map(|info| child::kill_storage(&info.trie_id));
	}
}
```

To enable this, we simply need to add `Contracts` type that we defined in the `construct_runtime!` macro to the `OnFreeBalanceZero` hook provided by the Balances module:

**`contracts-chain/runtime/src/lib.rs`**
```rust
impl balances::Trait for Runtime {
    /// What to do if an account's free balance gets zeroed.
    type OnFreeBalanceZero = (Contracts);
    //--snip--
}
```

Now, when the Balances module detects that the free balance of an account has reached zero, it calls the `on_free_balance_zero` function of the Contracts module.

## Genesis Configuration

The last thing we need to do in order to get your node up and running is to establish a genesis configuration for the Contracts module. Not all modules will have a genesis configuration, but if they do, you can use its documentation to learn about it. For example, [`srml_contracts::GenesisConfig` documentation](https://substrate.dev/rustdocs/master/srml_contracts/struct.GenesisConfig.html) describes all the fields you need to define for the Contracts module. This definition is controlled in `contracts-chain/src/chain_spec.rs`. We need to modify this file to include the `ContractsConfig` type:

```rust
use contracts_chain_runtime::ContractsConfig;
```

Then we need to add values to the configuration.

```rust
fn testnet_genesis(...) {

    //--snip--
	let mut contracts_config = ContractsConfig {
		current_schedule: Default::default(),
		gas_price: 1 * 1_000_000_000, // MILLICENTS
	};
	// IMPORTANT: this should only be enabled on development chains!
	contracts_config.current_schedule.enable_println = true;
    //--snip--
}
```

Note that you can tweak these numbers to your needs, but these are the values set at the [genesis configuration of the main Substrate node](https://github.com/paritytech/substrate/blob/master/node/cli/src/chain_spec.rs). You should place that code block into the `testnet_genesis` function, and then in the `GenesisConfig` object, add:

```rust
GenesisConfig {
    //--snip--
    contracts: Some(contracts_config),
}
```

Finally, you are ready to compile your contract capable node with:

We first need to purge the chain to remove the old runtime logic. It is possible to upgrade the chain without purging it but it will remain out of scope for this tutorial.

```bash
cargo run --release -- purge-chain --dev
cargo run --release -- --dev
```

## Next Steps

We wont actually go into the details of testing the Contracts module functionality added to this chain, but if you want to try it out, you can follow our instructions for [deploying a contract](contracts/deploying-a-contract.md).

Make sure to run `cargo run --release -- purge-chain --dev` before you start your chain so that the genesis configuration will be initialized for the Contracts module.

### Adding Other SRML Modules

In this guide, we walked through specifically how to import the Contracts module, but as mentioned in the beginning of this guide, each module will be a little different. Have no fear, you can always refer to the ["main" Substrate node runtime](https://github.com/paritytech/substrate/blob/master/node/runtime/) which includes nearly every module in the SRML.

In the `Cargo.toml` file of the Substrate node runtime, you will see an example of how to import each of the different modules, and in the `lib.rs` file you will find how to add each module to your runtime. You can basically copy what was done there to your own runtime.

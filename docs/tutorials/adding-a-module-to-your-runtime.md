---
title: "Adding a Module to Your Runtime"
---

The [Substrate node template](https://github.com/paritytech/substrate/tree/v1.0/node-template) provides a minimal working runtime which you can use to quickly get started building your own custom blockchain. However, in the attempts to remain minimal, it does not include most of the modules in the Substrate runtime module library ([SRML](overview/glossary.md#srml-substrate-runtime-module-library)).

This guide will show you how you can add the [Contract module](/rustdocs/v1.0/srml_contract/index.html) to your runtime in order to allow your blockchain to support Wasm smart contracts. You can follow similar patterns to add additional modules from the SRML to your runtime, however you should note that each module can be a little different in terms of the specific settings needed to import and use it correctly.

## Prerequisites

Before you can follow this guide, you need to make sure that your computer is set up to work with and build Substrate.

To install all the prerequisites needed for the Substrate build environment, like Rust, you can run:

```bash
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

As a part of `getsubstrate` script, we will also install [additional scripts](getting-started/using-the-substrate-scripts.md) which allow you to quickly create a new Substrate node template in your working folder. We will call this chain `contract-chain`:

```bash
cd /my/working/folder/
substrate-node-new contract-chain <YourName>
```

It will take a little while for Rust to build your node, but once it is complete, you should be able to start your node with:

```bash
cd contract-chain/
./target/release/contract-chain --dev
```

If you have gotten this far, then you are ready to start adding the new module to your runtime.

Remember to stop your node with `control + C`!

## Importing a Module Crate

The first thing you need to do to add the Contract module is to import the `srml_contracts` crate in your runtime's `Cargo.toml` file. If you want a proper primer into Cargo References, you should check out [their official documentation](https://doc.rust-lang.org/cargo/reference/index.html).

Open `contract-chain/runtime/Cargo.toml` and you will see a file which lists all the dependencies your runtime has. For example, it depends on the [Balances module](/rustdocs/v1.0/srml_balances/index.html):

```rust
[dependencies.balances]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-balances'
rev = '<git-commit>'
```

> Note: The `substrate-node-new` script generates a node template which is fixed to a specific commit (`rev`) of the Substrate repository. This is to prevent updates to the GitHub from breaking your working project.

### Crate Features

One important thing we need to call out with importing module crates is making sure to set up the crate `features` correctly. In the code snippet above, you will notice that we set `default_features = false`. If you explore the `Cargo.toml` file even closer, you will find something like:

```rust
[features]
default = ['std']
std = [
    'parity-codec/std',
    'primitives/std',
    'client/std',
    'rstd/std',
    'runtime-io/std',
    'support/std',
    'balances/std',
    ...
]
```

This second line defines the `default` features of your runtime crate as `std`. You can imagine, each module crate has a similar configuration defining the default feature for the crate. Your feature will determine the features that should be used on downstream dependencies. For example, the snippet above should be read as:

> The default feature for this Substrate runtime is `std`. When `std` feature is enabled for the runtime, `parity-codec`, `primitives`, `client`, and all the other listed dependencies should use their `std` feature too.

This is important to enable the Substrate runtime to compile to both native binaries (which support Rust [`std`](https://doc.rust-lang.org/std/)) and Wasm binaries (which do not: [`no_std`](https://rust-embedded.github.io/book/intro/no-std.html)).

To see how these features actually get used in the runtime code, we can open `contract-chain/runtime/src/lib.rs`:

**lib.rs**
```rust
//! The Substrate Node Template runtime. This can be compiled with `#[no_std]`, ready for Wasm.

#![cfg_attr(not(feature = "std"), no_std)]
#![cfg_attr(not(feature = "std"), feature(alloc))]
// `construct_runtime!` does a lot of recursion and requires us to increase the limit to 256.
#![recursion_limit="256"]

#[cfg(feature = "std")]
use serde::{Serialize, Deserialize};
use parity_codec::{Encode, Decode};
...
```

You can see that at the top of the file, we define that we will use `no_std` when we are *not* using the `std` feature. A few lines lower you can see `#[cfg(feature = "std")]` above the `serde` import, which is a flag saying to only use `serde` when we have enabled the `std` feature. We need to do this because `serde` has dependencies on the Rust standard libraries, and thus cannot be used in `no_std` environments.

> Note: The config attribute only applies to the import directly below it, so in the snippet above, `parity_codec` is always used in both the `std` and `no_std` environments.

### Importing the Contract Module Crate

Okay, now that we have covered the basics of crate features, we can actually import the Contract module. The Contract module is probably the most complicated module in the SRML, so it makes for a good example of some of the trickiness that can be involved when adding additional modules. To give you a hint as to what is to come, you should take a look at the [`Cargo.toml` file for the Contract module](https://github.com/paritytech/substrate/blob/v1.0/srml/contract/Cargo.toml).

First we will add the new dependency by simply copying an existing module, and changing the values. So based on the `balances` import shown above, my `contract` import will look like:

```rust
[dependencies.contract]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-contract'
rev = '<git-commit>'
```

You [can see](https://github.com/paritytech/substrate/blob/v1.0/srml/contract/Cargo.toml) that the Contract module has an `std` feature, thus we need to add the `contract/std` feature to the `std` feature of our runtime:

```rust
std = [
    ...
    'contract/std',
]
```

If you forget to set the `contract/std` feature, when building to your native binaries you will get errors like:

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
// Build Wasm binaries with `no_std`
./scripts/build.sh

// Build native binaries with `std`
cargo build --release
```

## Adding the Contract Module

Now that we have successfully imported the Contract module crate, we need to add it to our Runtime.

If you have followed our [other basic tutorials](tutorials/creating-your-first-substrate-chain.md), you may remember that we need to implement a `contract::Trait` and also add `Contract: contract::{...}` to our `construct_runtime!` macro.

### Implementing the Contract Trait

To figure out what we need to implement, you can take a look at the [`srml_contract::Trait` documentation](/rustdocs/v1.0/srml_contract/trait.Trait.html) or the [Contract module source code](https://github.com/paritytech/substrate/blob/v1.0/srml/contract/src/lib.rs). For our runtime, the implementation will look like this:

```rust
impl contract::Trait for Runtime {
	type Currency = Balances;
	type Call = Call;
	type Event = Event;
	type Gas = u64;
	type DetermineContractAddress = contract::SimpleAddressDeterminator<Runtime>;
	type ComputeDispatchFee = contract::DefaultDispatchFeeComputor<Runtime>;
	type TrieIdGenerator = contract::TrieIdFromParentCounter<Runtime>;
	type GasPayment = ();
}
```

To go into a bit more detail here, we see from the documentation that `type Currency` in the Contract module needs to be defined and support the requirements of the trait `Currency`

```rust
// From the reference documentation, but also can be found in the Contract module code
type Currency: Currency<Self::AccountId>
```

Fortunately, the Balances module implements this type, so we can simply reference `Balances` to gain access to it.

Similarly, `type DetermineContractAddress` requires the trait `ContractAddressFor`. The Contract module itself implements a type with this trait in `contract::SimpleAddressDeterminator`, thus we can use that implementation to satisfy our `contract::Trait`. At this point, I really recommend you explore the source code of the [Contract module](https://github.com/paritytech/substrate/blob/v1.0/srml/contract/src/lib.rs) if things don't make sense or you want to gain a deeper understanding.

### Adding Contract to the Construct Runtime Macro

Next, we need to add the module to the `construct_runtime!` macro. For this, we need to determine the types that the module exposes so that we can tell the our runtime that they exist. The complete list of possible types can be found in the [`construct_runtime!` macro documentation](https://substrate.dev/rustdocs/v1.0/srml_support/macro.construct_runtime.html).

If we look at the Contract module in detail, we know it has:

* Module **Storage**: Because it uses the `decl_storage!` macro.
* Module **Event**s: Because it uses the `decl_event!` macro.
* **Call**able Functions: Because it has dispatchable functions in the `decl_module!` macro.
* **Config**uration Values: Because the `decl_storage!` macro has `config()` parameters.
* The **Module** type from the `decl_module!` macro.

Thus, when we add the module, it will look like this:

```rust
construct_runtime!(
    pub enum Runtime with Log(InternalLog: DigestItem<Hash, AuthorityId, AuthoritySignature>) where
        Block = Block,
        NodeBlock = opaque::Block,
        UncheckedExtrinsic = UncheckedExtrinsic
    {
        ...
        Contract: contract::{Module, Call, Storage, Event<T>, Config<T>},
    }
);
```

Note that not all modules will expose all of these runtime types, and some may expose more! You always look at the source code of a module or the documentation of the module to determine which of these types you need to expose.

### Adding Runtime Hooks

Substrate provides the ability for modules to expose "hooks" where changes in the module can trigger functions in other modules. For example, you could create a module which executes some action every time a new account is created (when it first gains a balance over the [existential deposit](https://substrate.dev/docs/en/overview/glossary#existential-deposit)).

In the case of the Contracts module, we actually want a hook when an account runs out of free balance. Because the Contract module instantiates contracts as "Accounts", it also needs to know when an account is destroyed so that it can clean up any storage that contract was using. You can find that logic in the Contract module source code:

**Contract module `lib.rs`**
```rust
impl<T: Trait> OnFreeBalanceZero<T::AccountId> for Module<T> {
	fn on_free_balance_zero(who: &T::AccountId) {
		<CodeHashOf<T>>::remove(who);
		<AccountInfoOf<T>>::get(who).map(|info| child::kill_storage(&info.trie_id));
	}
}
```

To enable this, we simply need to add `Contract` type that we defined in the `construct_runtime!` macro to the `OnFreeBalanceZero` hook provided by the Balances module:

**`contract-chain/runtime/src/lib.rs`**
```rust
impl balances::Trait for Runtime {
    /// What to do if an account's free balance gets zeroed.
    type OnFreeBalanceZero = (Contract);
    ...
}
```

Now, when the Balances module detects that the free balance of an account has reached zero, it calls the `on_free_balance_zero` function of the contract module.

## Genesis Configuration

The last thing we need to do in order to get your node up and running is to establish a genesis configuration for the Contract module. Not all modules will have a genesis configuration, but if they do, you can use its documentation to learn about it. For example, [`srml_contracts::GenesisConfig` documentation](https://substrate.dev/rustdocs/v1.0/srml_contracts/struct.GenesisConfig.html) describes all the fields you need to define for the Contract module. This definition is controlled in `contract-chain/src/chain_spec.rs`. We need to modify this file to include the `ContractConfig` type:

```rust
use contract_chain_runtime::ContractConfig;
```

Then we need to add values to the configuration. As of Substrate v1.0, it looks like:

```rust
let mut contract_config = ContractConfig {
    transaction_base_fee: 1,
    transaction_byte_fee: 0,
    transfer_fee: 0,
    creation_fee: 0,
    contract_fee: 21,
    call_base_fee: 135,
    create_base_fee: 175,
    gas_price: 1,
    max_depth: 1024,
    block_gas_limit: 10_000_000,
    current_schedule: Default::default(),
};
// IMPORTANT: this should only be enabled on development chains!
contract_config.current_schedule.enable_println = true;
```

Note that you can tweak these numbers to your needs, but these are the values set at the [genesis configuration of the main Substrate node](https://github.com/paritytech/substrate/blob/master/node/cli/src/chain_spec.rs). You should place that code block into the `testnet_genesis` function, and then in the `GenesisConfig` object, add:

```rust
GenesisConfig {
    ...
    contract: Some(contract_config),
}
```

Finally, you are ready to compile your contract capable node with:

```rust
./scripts/build.sh
cargo build --release
```

## Next Steps

We wont actually go into the details of testing the Contract module functionality added to this chain, but if you want to try it out, you can follow our instructions for [deploying a contract](contracts/deploying-a-contract.md).

Make sure to run `./target/release/contract-chain purge-chain --dev` before you start your chain so that the genesis configuration will be initialized for the Contract module.

### Adding Other SRML Modules

In this guide, we walked through specifically how to import the Contract module, but as mentioned in the beginning of this guide, each module will be a little different. Have no fear, you can always refer to the ["main" Substrate node runtime](https://github.com/paritytech/substrate/blob/v1.0/node/runtime/) which includes nearly every module in the SRML.

In the `Cargo.toml` file of the Substrate node runtime, you will see an example of how to import each of the different modules, and in the `lib.rs` file you will find how to add each module to your runtime. You can basically copy what was done there to your own runtime.

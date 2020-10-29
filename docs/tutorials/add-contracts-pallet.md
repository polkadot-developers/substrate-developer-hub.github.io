---
title: "Add a Pallet"
---

The [Substrate Node Template](https://github.com/substrate-developer-hub/substrate-node-template)
provides a minimal working runtime which you can use to quickly get started building your own custom
blockchain. However, in the attempts to remain minimal, it does not include most of the pallets from
[FRAME](../../knowledgebase/runtime/frame).

This guide will show you how you can add the
[Contracts pallet](https://substrate.dev/rustdocs/v2.0.0/pallet_contracts/) to your runtime in order to
allow your blockchain to support Wasm smart contracts. You can follow similar patterns to add
additional FRAME pallets to your runtime, however you should note that each pallet is a little
different in terms of the specific configuration settings needed to use it correctly.

## Install the Node Template

You should already have version `v2.0.0` of the
[Substrate Node Template](https://github.com/substrate-developer-hub/substrate-node-template)
compiled on your computer from when you completed the
[Create Your First Substrate Chain Tutorial](../../tutorials/create-your-first-substrate-chain/).
If you do not, please complete that tutorial.

> Experienced developers who truly prefer to skip that tutorial, you may install the node template
> according to the instructions in its readme.

## File Structure

We will now modify the `substrate-node-template` to include the contracts pallet.

Open the `substrate-node-template` in your favorite code editor. We will be editing two files:
`runtime/src/lib.rs`, and `runtime/Cargo.toml`.

```
substrate-node-template
|
+-- runtime
|   |
|   +-- Cargo.toml   <-- One change in this file
|   |
|   +-- build.rs
|   |
|   +-- src
|	   |
|	   +-- lib.rs   <-- Most changes in this file
|
+-- pallets
|
+-- scripts
|
+-- node            <-- changes in this directory
|
+-- ...
```

## Importing a Pallet Crate

The first thing you need to do to add the Contracts pallet is to import the `pallet-contracts` crate
in your runtime's `Cargo.toml` file. If you want a proper primer into Cargo References, you should
check out [their official documentation](https://doc.rust-lang.org/cargo/reference/index.html).

Open `substrate-node-template/runtime/Cargo.toml` and you will see a list of all the dependencies
your runtime has. For example, it depends on the
[Balances pallet](https://substrate.dev/rustdocs/v2.0.0/pallet_balances/):

**`runtime/Cargo.toml`**

```TOML
[dependencies]
#--snip--
pallet-balances = { default-features = false, version = '2.0.0' }
```

### Crate Features

One important thing we need to call out with importing pallet crates is making sure to set up the
crate `features` correctly. In the code snippet above, you will notice that we set
`default_features = false`. If you explore the `Cargo.toml` file even closer, you will find
something like:

**`runtime/Cargo.toml`**

```TOML
[features]
default = ['std']
std = [
	'codec/std',
	'frame-executive/std',
	'frame-support/std',
	'frame-system/std',
	'frame-system-rpc-runtime-api/std',
	'pallet-balances/std',
	#--snip--
]
```

This second line defines the `default` features of your runtime crate as `std`. You can imagine,
each pallet crate has a similar configuration defining the default feature for the crate. Your
feature will determine the features that should be used on downstream dependencies. For example, the
snippet above should be read as:

> The default feature for this Substrate runtime is `std`. When `std` feature is enabled for the
> runtime, `parity-scale-codec`, `primitives`, `client`, and all the other listed dependencies
> should use their `std` feature too.

This is important to enable the Substrate runtime to compile to both native binaries (which support
Rust [`std`](https://doc.rust-lang.org/std/)) and Wasm binaries (which do not:
[`no_std`](https://rust-embedded.github.io/book/intro/no-std.html)).

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

// --snip--
```

You can see that at the top of the file, we define that we will use `no_std` when we are _not_ using
the `std` feature. A few lines lower you can see `#[cfg(feature = "std")]` above the
`wasm_binary.rs` import, which is a flag saying to only import the WASM binary when we have enabled
the `std` feature.

### Importing the Contracts Pallet Crate

Okay, now that we have covered the basics of crate features, we can actually import the Contracts
pallet. The Contracts pallet is probably the most complicated pallet in FRAME, so it makes for a
good example of some of the trickiness that can be involved when adding additional pallets.

First we will add the new dependency by simply copying an existing pallet, and changing the values.
So based on the `balances` import shown above, the `contracts` import will look like:

**`runtime/Cargo.toml`**

```TOML
[dependencies]
#--snip--
pallet-contracts = { version = '2.0.0', default_features = false }
pallet-contracts-primitives = { version = '2.0.0', default_features = false }
```

As with other pallets, the Contracts pallet has an `std` feature. We should build its `std` feature
when the runtime is built with its own `std` feature. Add the following two lines to the runtime's
`std` feature.

**`runtime/Cargo.toml`**

```TOML
[features]
default = ['std']
std = [
	#--snip--
	'pallet-contracts/std',
	'pallet-contracts-primitives/std',
	#--snip--
]
```

Now is a good time to check that everything compiles correctly so far with:

```bash
cargo check
```

## Adding the Contracts Pallet

Now that we have successfully imported the Contracts pallet crate, we need to add it to our Runtime.

### Implementing the Contract Trait

Every pallet has a configuration trait called `Trait` that the runtime must implement.

To figure out what we need to implement for this pallet specifically, you can take a look to the
FRAME
[`pallet_contracts::Trait` documentation](https://substrate.dev/rustdocs/v2.0.0/pallet_contracts/trait.Trait.html).
For our runtime, the implementation will look like this:

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

impl pallet_timestamp::Trait for Runtime {
	/* --snip-- */
}

/*** Add This Block ***/
parameter_types! {
	pub const TombstoneDeposit: Balance = 16 * MILLICENTS;
	pub const RentByteFee: Balance = 4 * MILLICENTS;
	pub const RentDepositOffset: Balance = 1000 * MILLICENTS;
	pub const SurchargeReward: Balance = 150 * MILLICENTS;
}

impl pallet_contracts::Trait for Runtime {
	type Time = Timestamp;
	type Randomness = RandomnessCollectiveFlip;
	type Currency = Balances;
	type Event = Event;
	type DetermineContractAddress = pallet_contracts::SimpleAddressDeterminer<Runtime>;
	type TrieIdGenerator = pallet_contracts::TrieIdFromParentCounter<Runtime>;
	type RentPayment = ();
	type SignedClaimHandicap = pallet_contracts::DefaultSignedClaimHandicap;
	type TombstoneDeposit = TombstoneDeposit;
	type StorageSizeOffset = pallet_contracts::DefaultStorageSizeOffset;
	type RentByteFee = RentByteFee;
	type RentDepositOffset = RentDepositOffset;
	type SurchargeReward = SurchargeReward;
	type MaxDepth = pallet_contracts::DefaultMaxDepth;
	type MaxValueSize = pallet_contracts::DefaultMaxValueSize;
	type WeightPrice = pallet_transaction_payment::Module<Self>;
}
/*** End Added Block ***/
```

We will use `type DetermineContractAddress` as an example to go into a bit more detail - you can see
from
[the `DetermineContractAddress` documentation](https://substrate.dev/rustdocs/v2.0.0/pallet_contracts/trait.Trait.html#associatedtype.DetermineContractAddress)
that it requires the trait `ContractAddressFor`. The Contracts pallet itself implements a type with
this trait in `pallet_contracts::SimpleAddressDeterminator`, thus we can use that implementation to satisfy
our `pallet_contracts::Trait`. At this point, it is recommend to explore the
[Contracts pallet source code](https://github.com/paritytech/substrate/blob/v2.0.0/frame/contracts/src/lib.rs)
if things don't make sense or you want to gain a deeper understanding.

### Adding Contracts to the `construct_runtime!` Macro

Next, we need to add the pallet to the `construct_runtime!` macro. For this, we need to determine
the types that the pallet exposes so that we can tell the our runtime that they exist. The complete
list of possible types can be found in the
[`construct_runtime!` macro documentation](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.construct_runtime.html).

If we look at the Contracts pallet in detail, we know it has:

- Module **Storage**: Because it uses the `decl_storage!` macro.
- Module **Event**s: Because it uses the `decl_event!` macro.
- **Call**able Functions: Because it has dispatchable functions in the `decl_module!` macro.
- **Config**uration Values: Because the `decl_storage!` macro has `config()` parameters.
- The **Module** type from the `decl_module!` macro.

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
		Contracts: pallet_contracts::{Module, Call, Config, Storage, Event<T>},
	}
);
```

Note that not all pallets will expose all of these runtime types, and some may expose more! You
always look at the source code of a pallet or the documentation of the pallet to determine which of
these types you need to expose.

This is another good time to check that your runtime compiles correctly so far. Although the runtime
should compile, the entire node will not (yet). So we will use this command to check just the
runtime.

```bash
cargo check -p node-template-runtime
```

### Exposing The Contracts API

Some pallets, including the Contracts pallet, expose custom runtime APIs and RPC endpoints. In the
case of the Contracts pallet, this enables reading contracts state from off chain.

It's not required to enable the RPC calls on the contracts pallet to use it in our chain. However,
we'll do it to make calls to our node's storage without making a transaction.

We start by adding the required API dependencies in our `Cargo.toml`.

**`runtime/Cargo.toml`**

```TOML
[dependencies]
#--snip--
pallet-contracts-rpc-runtime-api = { version = '0.8.0', default-features = false }
```

**`runtime/Cargo.toml`**

```TOML
[features]
default = ['std']
std = [
	#--snip--
	'pallet-contracts-rpc-runtime-api/std',
]
```

To get the state of a contract variable, we have to call a getter function that will return a
`ContractExecResult` wrapper with the current state of the execution.

We need to add the return type to our runtime. Add this with the other `use` statements.

**`runtime/src/lib.rs`**

```rust
/*** Add This Line ***/
use pallet_contracts_rpc_runtime_api::ContractExecResult;
/* --snip-- */
```

We're now ready to implement the contracts runtime API. This happens in the `impl_runtime_apis!`
macro near the end of your runtime.

```rust
impl_runtime_apis! {
   /* --snip-- */

   /*** Add This Block ***/
	impl pallet_contracts_rpc_runtime_api::ContractsApi<Block, AccountId, Balance, BlockNumber>
		for Runtime
	{
		fn call(
			origin: AccountId,
			dest: AccountId,
			value: Balance,
			gas_limit: u64,
			input_data: Vec<u8>,
		) -> ContractExecResult {
			let (exec_result, gas_consumed) =
				Contracts::bare_call(origin, dest.into(), value, gas_limit, input_data);
			match exec_result {
				Ok(v) => ContractExecResult::Success {
					flags: v.flags.bits(),
					data: v.data,
					gas_consumed: gas_consumed,
				},
				Err(_) => ContractExecResult::Error,
			}
		}

		fn get_storage(
			address: AccountId,
			key: [u8; 32],
		) -> pallet_contracts_primitives::GetStorageResult {
			Contracts::get_storage(address, key)
		}

		fn rent_projection(
			address: AccountId,
		) -> pallet_contracts_primitives::RentProjectionResult<BlockNumber> {
			Contracts::rent_projection(address)
		}
	}
   /*** End Added Block ***/
}
```

This is another good time to check that your runtime compiles correctly so far.

```bash
cargo check -p node-template-runtime
```

## Updating the Outer Node

At this point we have finished adding a pallet to the runtime. We now turn our attention to the
outer node which will often need some corresponding updates. In the case of the Contracts pallet we
will add the custom RPC endpoint and a genesis configuration.

### Adding the RPC API extension

With the proper runtime API exposed. We now add the RPC to the node's service to call into that
runtime API. Because we are now working in the outer node, we are not building to `no_std` and we
don't have to maintain a dedicated `std` feature.

**`node/Cargo.toml`**

```toml
[dependencies]
jsonrpc-core = '15.0.0'
structopt = '0.3.8'
#--snip--
# *** Add this 2 lines ***
pallet-contracts = '2.0.0'
pallet-contracts-rpc = '0.8.0'
```


Substrate provides an RPC to interact with our node. However, it does not contain access to the
contracts pallet by default. To interact with this pallet, we have to extend the existing RPC and
add the contracts pallet along with its API.

**`node/src/rpc.rs`**

```rust
use node_template_runtime::{opaque::Block, AccountId, Balance, Index, BlockNumber};
use pallet_contracts_rpc::{Contracts, ContractsApi};
```

```rust
/// Instantiate all full RPC extensions.
pub fn create_full<C, P>(
	deps: FullDeps<C, P>,
) -> jsonrpc_core::IoHandler<sc_rpc::Metadata> where
	/* --snip-- */
	C: Send + Sync + 'static,
	C::Api: substrate_frame_rpc_system::AccountNonceApi<Block, AccountId, Index>,
	/*** Add This Line ***/
    C::Api: pallet_contracts_rpc::ContractsRuntimeApi<Block, AccountId, Balance, BlockNumber>,
	/* --snip-- */
{
	/* --snip-- */

	// Extend this RPC with a custom API by using the following syntax.
	// `YourRpcStruct` should have a reference to a client, which is needed
	// to call into the runtime.
	// `io.extend_with(YourRpcTrait::to_delegate(YourRpcStruct::new(ReferenceToClient, ...)));`

	/*** Add This Block ***/
	io.extend_with(
		ContractsApi::to_delegate(Contracts::new(client.clone()))
	);
	/*** End Added Block ***/
	io
}
```
### Genesis Configuration

Not all pallets will have a genesis configuration, but if yours does, you can use its documentation
to learn about it. For example,
[`pallet_contracts::GenesisConfig` documentation](https://substrate.dev/rustdocs/v2.0.0/pallet_contracts/struct.GenesisConfig.html)
describes all the fields you need to define for the Contracts pallet.

Genesis configurations are controlled in `node/src/chain_spec.rs`. We need to modify this file to
include the `ContractsConfig` type and the contract price units at the top:

**`node/src/chain_spec.rs`**

```rust
use node_template_runtime::ContractsConfig;
```

Then inside the `testnet_genesis` function we need to add the contract configuration to the returned
`GenesisConfig` object as followed:

> IMPORTANT: We are taking the value `_enable_println` from the function parameters. Make sure to
> remove the underscore that precedes the parameter definition.

```rust
/// Configure initial storage state for FRAME modules.
fn testnet_genesis(
	wasm_binary: &[u8],
	initial_authorities: Vec<(AuraId, GrandpaId)>,
	root_key: AccountId,
	endowed_accounts: Vec<AccountId>,
	enable_println: bool, // Update this line
) -> GenesisConfig {
	GenesisConfig {
		/* --snip-- */

		/*** Add This Block ***/
		pallet_contracts: Some(ContractsConfig {
			current_schedule: pallet_contracts::Schedule {
					enable_println,
					..Default::default()
			},
		}),
		/*** End Added Block ***/
	}
}
```

## Start Your Upgraded Chain

Now you are ready to compile and run your contract-capable node. Compile the node in release mode
with

```bash
cargo build --release
```

Now launch the executable you just built by running this command

```bash
# Run a temporary node in development mode
./target/release/node-template --dev --tmp
```

## Adding Other FRAME pallets

In this guide, we walked through specifically how to import the Contracts pallet, but as mentioned
in the beginning of this guide, each pallet will be a little different. Have no fear, you can always
refer to the
[demonstration Substrate node runtime](https://github.com/paritytech/substrate/blob/v2.0.0/bin/node/runtime/)
which includes nearly every pallet in the FRAME.

In the `Cargo.toml` file of the Substrate node runtime, you will see an example of how to import
each of the different pallets, and in the `lib.rs` file you will find how to add each pallet to your
runtime. You can basically copy what was done there to your own runtime.

### Learn More

- [A minimalist tutorial on writing your runtime pallet in its own package](../../tutorials/create-a-pallet/).
- With your node now capable of running smart contracts, go learn about
  [Substrate ink! smart contracts](../../knowledgebase/smart-contracts/).
- [Substrate Recipes](https://substrate.dev/recipes/) offers detailed tutorials about writing
  [Runtime APIs](https://substrate.dev/recipes/3-entrees/runtime-api.html) and
  [Custom RPCs](https://substrate.dev/recipes/3-entrees/custom-rpc.html) like the ones explored in
  this tutorial.
- Understand the [Chain Spec](../../knowledgebase/integrate/chain-spec) file to customize your Genesis
  Configuration.

### References

- [FRAME `Contracts` Pallet API](https://substrate.dev/rustdocs/v2.0.0/pallet_contracts/index.html)

---
title: "Adding a Module to Your Runtime"
---

The [Substrate node template](https://github.com/paritytech/substrate/tree/master/node-template) provides you with a minimal working runtime which you can use to quickly get started building your own custom blockchain. However, in the attempts to remain minimal, it does not include most of the modules in the Substrate runtime module library ([SRML](overview/glossary.md#srml-substrate-runtime-module-library)).

This guide will show you how you can add the [Contract module](https://crates.parity.io/srml_contract/index.html) to your runtime in order to allow your blockchain to support Wasm smart contracts. You can follow similar patterns to add additional modules from the SRML to your runtime, however you should note that each module can be a little different in terms of the specific settings needed to import and use it correctly.

## Prerequisites

Before you can follow this guide, you need to make sure that your computer is set up to work with and build Substrate.

To install all the prerequisites needed for the Substrate build environment, like Rust, you can run:

```bash
curl https://getsubstrate.io -sSf | bash -- -s --fast
```

As a part of `getsubstrate` script, we will also install [additional scripts](quickstart/using-the-substrate-node-and-module-setup-scripts.md) which allow you to quickly create a new Substrate node template in your working folder. We will call this chain `constract-chain`:

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

## Importing a Module Crate

The first thing you need to do to add you new module is to import the crate using your runtime's `Cargo.toml` file. If you want a proper primer into Cargo References, you should check out [their official documentation](https://doc.rust-lang.org/cargo/reference/index.html).

Open `contract-chain/runtime/Cargo.toml` and you will see a file which lists all the dependencies your runtime has, for example the [Balances module](https://crates.parity.io/srml_balances/index.html):

```rust
[dependencies.balances]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-balances'
rev = '783ca1892892454e05e234cda5f7a2e42a54461e'
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

This section is defining the features of your runtime crate, and as you can imagine, each module crate has a similar configuration defining the default feature for the crate, and what features should be used on downstream dependencies when that feature is enabled. The snippet above should be read as:

> The default feature for this Substrate runtime is `std`. When `std` feature is enabled for the runtime, `parity-codec`, `primatives`, `client`, and all the other listed dependencies should use their `std` feature too.

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

Okay, now that we have covered the basics of crate features, we can actually import the Contract module. The Contract module is probably the most complicated module in the SRML, so it makes for a good example of some of the trickiness that can be involved when adding additional modules. To give you a hint as to what is to come, you should take a look at the [`Cargo.toml` file for the Contract module](https://github.com/paritytech/substrate/blob/master/srml/contract/Cargo.toml).

First we will add the new dependency by simply copying an existing module, and changing the values. So based on the `balances` import shown above, my `contract import will look like:

```rust
[dependencies.contract]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-contract'
rev = '783ca1892892454e05e234cda5f7a2e42a54461e'
```

You can see that the Contract module has an `std` feature, thus we need to add the `contract/std` feature to the `std` feature of our runtime:

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

But, it also has another feature: `core`.

**Contract Module `Cargo.toml`**
```rust
core = [
    "wasmi-validation/core",
]
```

We will also need to add this feature into our runtime, so we will add the following to our runtime's `Cargo.toml` file:

```rust
core = [
	"contract/core",
]
```

Thus, when our runtime compiles with the `core` feature, it will use the `contract/core` feature, which will then use the `wasmi-validation/core` feature, and so on.

At this point, you should be able to sanity check that everything compiles correctly with:

```bash
// Build Wasm binaries with `no_std`
./scripts/build.sh

// Build Native binaries with `std`
cargo build --release
```

## Adding the Contract Module

Now that we have successfully imported the Contract module crate, we need to add it to our Runtime.

If you have followed our [other basic tutorials](tutorials/creating-your-first-substrate-chain.md), you would know that we need to implement a `contract::Trait` and also add `Contract: contract::{...}` to our `construct_runtime!` macro.

To figure out what we need to implement, you can take a [look at the `srml_contract::Trait`](https://crates.parity.io/srml_contract/trait.Trait.html) documentation. For our runtime, the implementation will look like this:

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

**From the reference documentation, but also can be found in the Contract module**
```
type Currency: Currency<Self::AccountId>
```

Fortunately, the Balances module implements this type, so we can simply reference `Balances` to gain access to it.

Similarly, `type DetermineContractAddress` requires the trait `ContractAddressFor`. The Contract module itself implements a type with this trait in `contract::SimpleAddressDeterminator`, thus can use that implementation to satisfy our `contract::Trait`. At this point, I really recommend you explore the source code of the [Contract module]

## Importing and Adding Other SRML Modules

We walked through specifically how to import the Contract module, but as mentioned in the beginning of this guide, each module will be a little different. Have no fear, you can always refer to the ["main" Substrate node runtime](https://github.com/paritytech/substrate/blob/master/node/runtime/) which includes nearly every module in the SRML.

In the `Cargo.toml` file of the Substrate node runtime, you will see an example of how to import each of the different modules, and in the `lib.rs` file you will find how to add each module to your runtime. You can basically copy what was done there to your own runtime.
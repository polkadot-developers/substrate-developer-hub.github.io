---
title: Pallets
---

This document is a top-level entry point to documentation related to developing runtime modules for
Substrate. The documentation that follows is written for technical audiences, who are familiar with the Rust programming
language.

> If you are getting started with Substrate runtime development for the first time, we suggest you try
> our introductory tutorial for
> [creating your first Substrate chain](../../tutorials/create-your-first-substrate-chain).

## What is a Pallet?

Pallets are a special kind of Rust module from which Substrate runtimes can be composed. Each pallet
has its own discrete logic which can modify the features and functionality of your blockchain's
state transition function.

For example, the [Balances pallet](https://github.com/paritytech/substrate/tree/master/frame/balances), which is included in [FRAME](/knowledgebase/runtime/frame), defines cryptocurrency capabilities for your blockchain. More specifically, it
defines: 
- **storage items** that keep track of the tokens a user owns;
- **functions** that users can call to transfer
and manage those tokens;
- **APIs** which allow other pallets to make use of those tokens and their capabilities; and
- **hooks**
which allow other pallets to trigger function calls when a user's balance changes.

Substrate runtime engineers can define custom logic for their blockchain by writing their own pallets and encapsulating their blockchains desired functionality by combining custom pallets with existing FRAME pallets or [Substrate modules alike](link_to_other_pallet_libs). The following documentation will show you how.

> **Note:** At the time of writing, FRAME pallets exist in two different forms &mdash; Version 1 and Version 2. This article first covers the structure of a "V1" pallet. Skip to "FRAME V2" for the latest structure of a Substrate pallet. Read [here](to_do) for more information on these changes.

## Skeleton of a Pallet
### FRAME V1
A Substrate pallet is composed of 5 sections:

```rust
// 1. Imports and Dependencies
// The pallet supports the use of any Rust library which compiles
// with the `no_std` flag.
use support::{decl_module, decl_event, decl_storage, ...}

// 2. Runtime Configuration Trait
// All of the runtime types and consts go in here. If the pallet
// is dependent on specific other pallets, then their configuration traits
// should be added to the inherited traits list.
pub trait Config: system::Config { ... }

// 3. Runtime Events
// Events are a simple means of reporting specific conditions and circumstances
// that have happened that users, Dapps and/or chain explorers would find
// interesting and otherwise difficult to detect.
decl_event!{ ... }

// 4. Runtime Storage
// This allows for type-safe usage of the Substrate storage database, so you can
// keep things around between blocks.
decl_storage! { ... }

// 5. The Pallet Declaration
// This defines the `Module` struct that is ultimately exported from this pallet.
// It defines the callable functions that this pallet exposes and orchestrates
// actions this pallet takes throughout block execution.
decl_module! { ... }
```

## Example Module

Here is a minimal, working pallet which simply allows a user to put a `u64` value into storage.

Parts of this example will be used to help teach concepts throughout the rest of the pallet
documentation.

It is written in full here for clarity:

```rust
use support::{decl_module, decl_event, decl_storage, StorageValue, StorageMap};
use system::ensure_signed;

pub trait Config: system::Config {
	// The traits the `Event` type used in this pallet has.
	type Event: From<Event<Self>> + Into<<Self as system::Config>::Event>;
}

decl_event!{
	pub enum Event<T> where
		AccountId = <T as system::Config>::AccountId,
	{
		// An event which is emitted when `set_value` is called.
		// Contains information about the user who called the function
		// and the value they called with.
		ValueSet(AccountId, u64),
	}
}

decl_storage! {
	trait Store for Module<T: Config> as Example {
		// The last value passed to `set_value`.
		// Used as an example of a `StorageValue`.
		pub LastValue get(fn last_value): u64;
		// The value each user has put into `set_value`.
		// Used as an example of a `StorageMap`.
		pub UserValue get(fn user_value): map T::AccountId => u64;
	}
}

decl_module! {
	pub struct Module<T: Config> for enum Call where origin: T::Origin {
		// A default function for depositing events in our runtime
		fn deposit_event() = default;

		// The only callable function of our runtime module.
		// Allows a user to set a `u64` value into the runtime storage.
		pub fn set_value(origin, value: u64) {
			let sender = ensure_signed(origin)?;
			LastValue::put(value);
			UserValue::<T>::insert(&sender, value);
			Self::deposit_event(RawEvent::ValueSet(sender, value));
		}
	}
}
```

### FRAME V2
A Substrate pallet is composed of 5 sections:

```rust
// 1. Imports and Dependencies
pub use pallet::*;
#[frame_support::pallet]
pub mod pallet {
	use frame_support::{dispatch::DispatchResultWithPostInfo, pallet_prelude::*};
	use frame_system::pallet_prelude::*;
}
// 2. Runtime Configuration Trait
// All of the runtime types and consts go in here. If the pallet
// is dependent on specific other pallets, then their configuration traits
// should be added to the inherited traits list.
#[pallet::config]
	pub trait Config: frame_system::Config { ... }

// 3. Runtime Events
// Events are a simple means of reporting specific conditions and circumstances
// that have happened that users, Dapps and/or chain explorers would find
// interesting and otherwise difficult to detect.
#[pallet::event]
	#[pallet::metadata(T::AccountId = "AccountId")]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> { ... }

// 4. Runtime Storage
// This allows for type-safe usage of the Substrate storage database, so you can
// keep things around between blocks.
#[pallet::storage]
	#[pallet::getter(fn something)]

// 5. The Pallet Declaration
// This defines the `Module` struct that is ultimately exported from this pallet.
// It defines the callable functions that this pallet exposes and orchestrates
// actions this pallet takes throughout block execution.
#[pallet::call]
	impl<T:Config> Pallet<T> { ... }
```

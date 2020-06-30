---
title: Pallets
---

This document is a top-level entry point to documentation related to developing runtime modules for
Substrate.

These documents are written for a technical audience, who is familiar with the Rust programming
language.

If you are getting started with Substrate runtime development for the first time, we suggest you try
our introductory tutorial for
[creating your first Substrate chain](../../tutorials/create-your-first-substrate-chain).

## What is a Pallet?

Pallets are a special kind of Rust module from which Substrate runtimes can be composed. Each pallet
has its own discrete logic which can modify the features and functionality of your blockchain's
state transition function.

For example, the Balances pallet, which is included in the Framework for Runtime Aggregation of
Modularised Entities (FRAME), defines a cryptocurrency for your blockchain. More specifically, it
defines storage items which tracks the tokens a user has, functions that users can call to transfer
and manage those tokens, APIs which allow other modules to burn or mint those tokens, and hooks
which allow other modules to trigger functions when a user's balance changes.

You are able to write your own pallets which define logic and functionality you want to introduce to
your blockchain, and the following documentation will show you how.

## Skeleton of a Pallet

A Substrate pallet is composed of 5 main sections:

```rust
// 1. Imports and Dependencies
// The pallet supports the use of any Rust library which compiles
// with the `no_std` flag.
use support::{decl_module, decl_event, decl_storage, ...}

// 2. Runtime Configuration Trait
// All of the runtime types and consts go in here. If the pallet
// is dependent on specific other pallets, then their configuration traits
// should be added to the inherited traits list.
pub trait Trait: system::Trait { ... }

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

pub trait Trait: system::Trait {
	// The traits the `Event` type used in this pallet has.
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

decl_event!{
	pub enum Event<T> where
		AccountId = <T as system::Trait>::AccountId,
	{
		// An event which is emitted when `set_value` is called.
		// Contains information about the user who called the function
		// and the value they called with.
		ValueSet(AccountId, u64),
	}
}

decl_storage! {
	trait Store for Module<T: Trait> as Example {
		// The last value passed to `set_value`.
		// Used as an example of a `StorageValue`.
		pub LastValue get(fn last_value): u64;
		// The value each user has put into `set_value`.
		// Used as an example of a `StorageMap`.
		pub UserValue get(fn user_value): map T::AccountId => u64;
	}
}

decl_module! {
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
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

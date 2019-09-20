---
title: Overview
---

This document is a top-level entry point to documentation related to developing runtime modules for Substrate.

## What is a Runtime Module?

A Substrate runtime module is an independent piece of business logic for your blockchain. These modules compose your blockchain's state transition function, and define the state and behaviors of your blockchain.

For example, the Balances module, which is included in the Substrate Runtime Module Library (SRML), defines a cryptocurrency for your blockchain. More specifically, it defines storage items which tracks the tokens a user has, functions that users can call to transfer and manage those tokens, APIs which allow other modules to burn or mint those tokens, and hooks which allow other modules to trigger functions when a user's balance changes.

You are able to write your own runtime modules which define logic and functionality you want to introduce to your blockchain, and the following documentation will show you how.

## Skeleton of a Module

A Substrate runtime module is composed of 5 main sections:

```rust
// 1. Imports and Dependencies
// The Substrate runtime supports the use of any Rust library which compiles
// with the `no_std` flag.
use support::{decl_module, decl_event, decl_storage, ...}

// 2. Runtime Configuration Trait
// All of the runtime types and consts go in here. If the module
// is dependent on specific other modules, then their configuration traits
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

// 5. The Module Declaration
// This defines the `Module` struct that is ultimately exported from our module.
// It defines the callable functions our module exposes and orchestrates
// actions our module takes throughout block execution.
decl_module! { ... }
```

## Example Module

Here is a minimal, working runtime module which simply allows a user to put a `u64` value into storage.

Parts of this example will be used to help teach concepts throughout the rest of the runtime module documentation.

It is written in full here for clarity:

```rust
use support::{decl_module, decl_event, decl_storage, StorageValue, StorageMap};
use system::ensure_signed;

pub trait Trait: system::Trait {
	// The traits the `Event` type used in our module has.
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
		pub LastValue get(last_value): u64;
		// The value each user has put into `set_value`.
		// Used as an example of a `StorageMap`.
		pub UserValue get(user_value): map T::AccountId => u64;
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
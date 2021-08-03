---
title: Pallets
---

The following documentation is written for technical audiences, familiar with the Rust programming
language. It is a top-level entry point for FRAME runtime developement in Substrate. 

> If you are just getting started with Substrate runtime development, we suggest you try
> our introductory tutorial for
> [creating your first Substrate chain](../../tutorials/create-your-first-substrate-chain).

## What is a Pallet?

Pallets are a special kind of Rust module made up of a set of types, trait implementations and functions 
from which Substrate runtimes can be composed. FRAME not only 
provides a library of commonly used Substrate pallets but also a framework to build custom domain-specific 
pallets, giving runtime engineers the flexibility to define their runtime's behaviour according to their 
target use case. The result: each pallet has its own discrete logic which can modify the features and 
functionality of your blockchain's state transition functions.


For example, the [Balances pallet](https://github.com/paritytech/substrate/tree/master/frame/balances), which is included in [FRAME](../../knowledgebase/runtime/frame), defines cryptocurrency capabilities for your blockchain. More specifically, it
defines: 
- **Storage items** that keep track of the tokens a user owns.
- **Functions** that users can call to transfer
and manage those tokens.
- **APIs** which allow other pallets to make use of those tokens and their capabilities.
- **Hooks**
which allow other pallets to trigger function calls when a user's balance changes.

Substrate runtime engineers can define custom logic for their blockchain by writing their own pallets and encapsulating their blockchains desired functionality by combining custom pallets with existing FRAME pallets or Substrate modules alike. The following documentation will show you how.

> **Note:** At the time of writing, FRAME pallets exist in two different flavors &mdash; Version 1 and Version 2. This article first covers the structure of a v1 pallet. Skip to [FRAME v2](./pallets#frame-v2) for the latest structure of a Substrate pallet. Read [here](./macros#frame-v1-vs-v2) for more information on these changes.

## Skeleton of a Pallet
### FRAME v1
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
pub trait Config: frame_system::Config { ... }

// 3. Runtime Events
// Events are a simple means of reporting specific conditions and circumstances
// that have happened that users, Dapps and/or chain explorers would find
// interesting and otherwise difficult to detect.
decl_event! { ... }

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
> **Note**: Additional sections such as [`decl_error!`](./macros#decl_error) are commonly used however are not a requirement for a minimally working pallet.
#### Example

The [Basic Token recipe](https://substrate.dev/recipes/basic-token.html) provides a good example of a simple FRAME V1 pallet that allows a user to create a `u64` supply of tokens in storage and a `StorageMap` of account IDs and `u64` balances. The primary parts include:
- `decl_storage!` defines `TotalSupply` and `Balances` the pallet's storage items;
- `decl_event!` defines `Initialized` and `Transfer` events;
- `decl_module!` defines the pallet's functions, `init()` and `transfer()`; and
- `decl_module!` also has a `deposit_event()` function, common to all pallets that define behavior that emits an event.
### FRAME v2
A FRAME v2 pallet is commonly composed of 7 sections:

```rust
// 1. Imports and Dependencies
pub use pallet::*;
#[frame_support::pallet]
pub mod pallet {
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;
}

// 2. Declaration of the Pallet type 
// This is a placeholder to implement traits and methods.
#[pallet::pallet]
#[pallet::generate_store(pub(super) trait Store)]
pub struct Pallet<T>(PhantomData<T>);

// 3. Runtime Configuration Trait
// All types and constants go here. 
// Use #[pallet::constant] and #[pallet::extra_constants] 
// to pass in values to metadata.
#[pallet::config]
pub trait Config: frame_system::Config { ... }

// 4. Runtime Storage
// Use to declare storage items.
#[pallet::storage]
#[pallet::getter(fn something)]
pub type MyStorage<T: Config> = StorageValue<_, u32>;

// 5. Runtime Events
// Can stringify event types to metadata.
#[pallet::event]
#[pallet::metadata(T::AccountId = "AccountId")]
#[pallet::generate_deposit(pub(super) fn deposit_event)]
pub enum Event<T: Config> { ... }

// 6. Hooks
// Define some logic that should be executed
// regularly in some context, for e.g. on_initialize.
#[pallet::hooks]
impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> { ... }

// 7. Extrinsics
// Functions that are callable from outside the runtime.
#[pallet::call]
impl<T:Config> Pallet<T> { ... }

```
> **Note:** Pallets can be composed of as many sections as needed, giving runtime engineers a lot of flexibility ontop of the basic skeletons depicted above. Refer to the [Substrate Runtime Macros](./macros#substrate-runtime-macros) to learn more about adding functionality to a FRAME pallet.

## Examples

Here is a minimal, working pallet which simply allows a user to put a `u64` value into storage:

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

The above example is similar to FRAME's Nicks pallet. For context, see:
- the [FRAME v1 of the Nicks Pallet](https://github.com/paritytech/substrate/blob/master/frame/nicks/src/lib.rs)
- the [FRAME v2 of the Nicks Pallet](https://github.com/paritytech/substrate/blob/gui-seminar-pallet-migration-nicks-after/frame/nicks/src/lib.rs)

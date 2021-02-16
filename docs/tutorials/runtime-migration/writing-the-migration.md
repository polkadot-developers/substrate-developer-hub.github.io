---
title: Writing the Migration
---

The reason for the migration is that we want to introduce a distinction between first and last name.

## Introducing the Storage Change
To achieve that we introduce a new `Nickname` struct:


`./pallets/nicks/src/lib.rs`
```Rust
#[derive(codec::Encode, codec::Decode, Default, frame_support::RuntimeDebug, PartialEq)]
pub struct Nickname {
  first: Vec<u8>,
  last: Option<Vec<u8>>,
}
```

We then adjust the pallet storage to use the new struct:

`./pallets/nicks/src/lib.rs`
```Rust
decl_storage! {
  trait Store for Module<T: Trait> as MyNicks {
    /// The lookup table for names.
    NameOf: map hasher(twox_64_concat) T::AccountId => Option<(Nickname, BalanceOf<T>)>;
  }
}
```

We then adjust the rest of the pallet logic to this new storage. (Omitted here for brevity.)

## Writing the Migration

Remember that migrations are executed within the context of the upgraded runtime,
which means that migration code may need to include deprecated types,
so include the following mod inside our migration will help when referencing target data.

```Rust
pub mod migration {
  // --- ✂️ snip ---
  pub mod deprecated {
  	use crate::Trait;
	use frame_support::{decl_module, decl_storage, traits::Currency};
	use sp_std::prelude::*;

	type BalanceOf<T> = <<T as Trait>::Currency as Currency<<T as frame_system::Trait>::AccountId>>::Balance;

	decl_storage! {
		trait Store for Module<T: Trait> as MyNicks {
			pub NameOf: map hasher(twox_64_concat) T::AccountId => Option<(Vec<u8>, BalanceOf<T>)>;
		}
	}
	decl_module! {
		pub struct Module<T: Trait> for enum Call where origin: T::Origin { }
	}
  }
  // --- ✂️ snip ---
}


```

The basic structure of our migration will be:
```Rust
if storage_version == expected_version {
  for nick in old_storage.iter() {
    migrate_storage(nick)
  }
  store_storage_version(expected_version)
  return migration_weight
} else {
  log("no migration run")
  return 0
}
```

### Logging
Migrations can be difficult to debug which is why we add logging in order to indicate what was executed.
The first line of our migration function is thus the initialization of the runtime logger:

```Rust
frame_support::debug::RuntimeLogger::init();
```

### Checking the Version
In order to not mangle the runtime storage, we need to check that the storage version is what we expect it to be.
We use an enum with two variants that indicate pre- and post-migration state of the storage.

`./pallets/nicks/src/lib.rs`
```Rust
if PalletVersion::get() == StorageVersion::V1Bytes {
  // --- ✂️ snip (the actual migration) ---
} else {
  // The pallet version is different from what we expect so we
  // do nothing.
  frame_support::debug::info!(" >>> Unused migration!");
  0
}
```

### Iterating and Migrating the Storage Items
We transform the old values into the new format using `translate`  iterator.

`./pallets/nicks/src/lib.rs`
```Rust
pub mod migration {
	// --- ✂️ snip ---
 	pub mod deprecated { // --- ✂️ snip --- }
	pub fn migrate_to_v2<T: Trait>() -> frame_support::weights::Weight {
  		frame_support::debug::RuntimeLogger::init();

		// Storage migrations should use storage versions for safety.
		if PalletVersion::get() == StorageVersion::V1Bytes {
		// Very inefficient, mostly here for illustration purposes.
		let count = deprecated::NameOf::<T>::iter().count();
		frame_support::debug::info!(" >>> Updating MyNicks storage. Migrating {} nicknames...", count);

		// We transform the storage values from the old into the new format.
		NameOf::<T>::translate::<(Vec<u8>, BalanceOf<T>), _>(
			|k: T::AccountId, (nick, deposit): (Vec<u8>, BalanceOf<T>)| {
				frame_support::debug::info!("     Migrated nickname for {:?}...", k);

				// We split the nick at ' ' (<space>).
				match nick.iter().rposition(|&x| x == b" "[0]) {
					Some(ndx) => Some((Nickname {
						first: nick[0..ndx].to_vec(),
						last: Some(nick[ndx + 1..].to_vec())
					}, deposit)),
					None => Some((Nickname { first: nick, last: None }, deposit))
				}
			}
		);
  		// --- ✂️ snip (new version and logging) ---
		} else {
			frame_support::debug::info!(" >>> Unused migration!");
			0
		}
	}  
}
```

Done, the migration is complete!

For further reference you can find the complete code [here](https://github.com/substrate-developer-hub/migration-example/blob/a46652ea0273aef20fb70fe74197fba94e244f91/pallets/nicks/src/lib.rs).

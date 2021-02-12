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
We remove the storage entries one by one by using the `drain` iterator, then transform them into
the new storage format and store them again.

`./pallets/nicks/src/lib.rs`
```Rust
if PalletVersion::get() == StorageVersion::V1Bytes {
  // We remove the nicks from the old storage via `drain`.
  for (key, (nick, deposit)) in deprecated::NameOf::<T>::drain() {
    // We split the nick at ' ' (<space>).
    match nick.iter().rposition(|&x| x == b" "[0]) {
      Some(ndx) => NameOf::<T>::insert(&key, (Nickname {
        first: nick[0..ndx].to_vec(),
        last: Some(nick[ndx + 1..].to_vec())
      }, deposit)),
      None => NameOf::<T>::insert(&key, (Nickname { first: nick, last: None }, deposit))
    }
  }
  // --- ✂️ snip (new version and logging) ---
}
```

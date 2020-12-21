---
title: Writing the Migration
---

The reason for the migration is that we want to introduce a distinction between first and last name.

## Introducing the Storage Change
To achieve that we introduce a new `Nickname` struct:

```Rust
#[derive(codec::Encode, codec::Decode, Default, frame_support::RuntimeDebug, PartialEq)]
pub struct Nickname {
	first: Vec<u8>,
	last: Option<Vec<u8>>,
}
```

We then adjust the pallet storage to use the new struct:
```Rust
decl_storage! {
	trait Store for Module<T: Trait> as MyNicks {
		/// The lookup table for names.
    NameOf: map hasher(twox_64_concat) T::AccountId => Option<(Nickname, BalanceOf<T>)>;
  }
}
```

We then adjust the rest of the pallet logic to this new storage.

## Writing the Migration

TODO
---
title: Account Information
---

## `Account` StorageMap

In Substrate, account information is stored in a storage map, extracted and shown below:

src: `frame/system/src/lib.rs`:

```rust
/// The full account information for a particular account ID.
#[pallet::storage]
#[pallet::getter(fn account)]
pub type Account<T: Config> = StorageMap<
  _,
  Blake2_128Concat,
  T::AccountId,
  AccountInfo<T::Index, T::AccountData>,
  ValueQuery,
>;
```

Account [`StorageMap`]() takes in five generic types, so it has no prefix, use `Blake2_128Concat` as the hash algorithm, use `T::AccountId`, the public key of the account, as the map key, with the map value as `AccountInfo<T::Index, T::AccountData>`.

## `AccountInfo` Structure

Looking further down in the source code of `frame-system`, we will see what `AccountInfo` actually consisted of.

src: `frame/system/src/lib.rs`:

```rust
#[derive(Clone, Eq, PartialEq, Default, RuntimeDebug, Encode, Decode)]
pub struct AccountInfo<Index, AccountData> {
  /// The number of transactions this account has sent.
  pub nonce: Index,
  /// The number of other modules that currently depend on this account's existence. The account
  /// cannot be reaped until this is zero.
  pub consumers: RefCount,
  /// The number of other modules that allow this account to exist. The account may not be reaped
  /// until this and `sufficients` are both zero.
  pub providers: RefCount,
  /// The number of modules that allow this account to exist for their own purposes only. The
  /// account may not be reaped until this and `providers` are both zero.
  pub sufficients: RefCount,
  /// The additional data that belongs to this account. Used to store the balance(s) in a lot of
  /// chains.
  pub data: AccountData,
}
```

So every account in Substrate is an `AccountInfo` consisting of an `nonce` indicating the transaction the account has sent, three reference counters, and `AccountData` structure which contains some balances (further explained below) .

Let's look deeper in the three reference counters, `consumers`, `providers`, and `sufficients`. The reasons these counters exist because Substrate has a mechanism of slashing accounts (e.g. one of the reasons could be an account balance is below the existential deposit). If any of these reference counters are greater than zero for an account, it is telling Substrate to not slash the account. For:

- `consumers` indicates if there are any other modules depending on this account. An example this counter being used is in `frame-session` `set-keys` dispatchable call when an account setting its session key(s) prior of becoming a validator in the next session [1]("#ref-session-set-keys"). This is related to `providers` reference counter.

- `providers` reference counter indicates if there are any other modules allowing this account to exist. Currently this counter  is incremented when creating a new account with more than existential deposit to indicate an account could be used to receive consumer reference counters. This means that `providers` counter is always greater than or equal to `consumers` counter [2]("#ref-system-created").

  Both `providers` and `consumers` tell Substrate pallets not to store data about certain account until it is active (i.e. `providers` > 0), and not to remove an account until data about the account are removed in all pallets (i.e. `consumers` == 0). This is to keep users accountable for their data stored on chain. If users want to remove an account and get back the exisitential deposit, they need to remove the data stored on-chain which use `consumers` counter.

- `sufficients` reference counter indicates if there are any reasons this account is self-sufficient to exist by itself. An example this counter being used is in `frame-assets` `new-account` when an account has sufficient amount of a specific asset but not owning any native account balance [3]("#ref-assets-new-account").

Runtime developers can update these counters via `inc_consumers()`, `dec_consumers()`, `inc_providers()`, `dec_providers()`, `inc_sufficients()`, `dec_sufficients()` exposed in `frame-system`.

## `AccountData` Structure

## Reference

1. <span id="ref-session-set-keys"></span>[`frame/session/src/lib.rs`]()
2. <span id="ref-system-created"></span>[`frame/system/src/lib.rs`]()
3. <span id="ref-assets-new-account"></span>[`frame/assets/src/functions.rs`]()

---
title: Account Information
---

## `Account` StorageMap

In Substrate, account information is stored in a
[**Storage Map**](https://substrate.dev/rustdocs/v3.0.0/frame_support/storage/types/struct.StorageMap.html#impl),
extracted and shown below:

[`frame/system/src/lib.rs`](https://github.com/paritytech/substrate/blob/bcd649ffca9efc93f8b4ac1506ec8117b71e1aac/frame/system/src/lib.rs#L530-L538):

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

`Account` storage map takes in five type parameters, so it has no prefix, use `Blake2_128Concat` as
the hash algorithm, use `T::AccountId`, the account public key as the map key, with
`AccountInfo<T::Index, T::AccountData>` as the map value.

## `AccountInfo` Structure

Looking further down in the source code, we will see what `AccountInfo` is actually consisted of.

[`frame/system/src/lib.rs`](https://github.com/paritytech/substrate/blob/bcd649ffca9efc93f8b4ac1506ec8117b71e1aac/frame/system/src/lib.rs#L787-L803):

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

Every account is an `AccountInfo` consisting of an `nonce` indicating number of transactions the
account has sent, three reference counters, and an `AccountData` structure which contains some
balances ([further explained below](#accountdata-structure)).

Let's look deeper into the three reference counters, `consumers`, `providers`, and `sufficients`.
The reasons these counters exist because Substrate has a mechanism of slashing accounts (e.g. one
reason could be an account balance is below the existential deposit). If any of these reference
counters are greater than zero, it is telling Substrate to not slash the account. For:

- **`consumers` reference counter** indicates if there are any other modules depend on this account.
An example of using this counter is in `Session` pallet when an account setting its session key(s)
prior of becoming a validator [[1]](#ref-session-set-keys). It is also related to the `provider`
counter, see below.

- **`providers` reference counter** indicates if there are any other modules allowing this account
to exist. Currently this counter  is incremented when a new account is created with more than the
existential deposit to indicate this account could be used to receive consumer reference counters
[[2]](#ref-system-created). `providers` counter is always greater than or equal to `consumers`
counter.

  Both `providers` and `consumers` tell Substrate pallets not to store data about that account until
  it is active (i.e. `providers` > 0), and not to remove an account until data about the account are
  removed in all pallets (i.e. `consumers` == 0). This is to keep users accountable for their data
  stored on chain. If users want to remove their accounts and get back the exisitential deposit,
  they need to remove the dependencies from those on-chain pallets, e.g. clearing data stored
  on-chain for those pallets, which decrement `consumers` counter.

- **`sufficients` reference counter** indicates if there are any reasons this account is
self-sufficient to exist by itself. An example of using this counter is in `Assets` pallet when an
account has sufficient amount of certain assets but not owning any native account balance
[[3]](#ref-assets-new-account).

Runtime developers can update these counters via `inc_consumers()`, `dec_consumers()`,
`inc_providers()`, `dec_providers()`, `inc_sufficients()`, `dec_sufficients()` exposed by
`frame-system`. Each increment call of a certain counter should accompanied by a corresponding
decrement call of the counter in an account life cycle, else it is a design bug.

## `AccountData` Structure

The last piece of data in `AccountInfo` is `AccountData`. It is defined in `frame-system` to be
bound by `Member + FullCodec + Clone + Default` traits. Its actual implementation is defined in
`pallet-balances`, as followed.

[`frame/balances/src/lib.rs`](https://github.com/paritytech/substrate/blob/8d02bb0bfc6136f6a3c805db19f51e43090a7cd4/frame/balances/src/lib.rs#L564-L584)

```rust
pub struct AccountData<Balance> {
  /// Non-reserved part of the balance. There may still be restrictions on this, but it is the
  /// total pool what may in principle be transferred, reserved and used for tipping.
  ///
  /// This is the only balance that matters in terms of most operations on tokens. It
  /// alone is used to determine the balance when in the contract execution environment.
  pub free: Balance,
  /// Balance which is reserved and may not be used at all.
  ///
  /// This can still get slashed, but gets slashed last of all.
  ///
  /// This balance is a 'reserve' balance that other subsystems use in order to set aside tokens
  /// that are still 'owned' by the account holder, but which are suspendable.
  pub reserved: Balance,
  /// The amount that `free` may not drop below when withdrawing for *anything except transaction
  /// fee payment*.
  pub misc_frozen: Balance,
  /// The amount that `free` may not drop below when withdrawing specifically for transaction
  /// fee payment.
  pub fee_frozen: Balance,
}
```

It contains:

- **Free balance** `free`. The portion of a balance that is not reserved. The free balance is
usually what matters for most operations.

- **Reserved balance** `reserved`. Reserved balance still belongs to the account holder, but is
suspended. Reserved balance can be slashed, but only after all the free balance has been slashed.
The total balance of an account is the sum of its free balance and reserved balance.

- **Frozen balance**, splitted into `misc_frozen` and `fee_frozen`, represent balances that free
balance cannot drop below. `fee_frozen` are specifically for transaction fee payment, and
`misc_frozen` for everything else. These values are set when accounts are locked for transactions.

## Conclusion

By now, you have a clear picture how account data is stored in Substrate. You can dig deeper by
looking into the [`frame_system::AccountInfo` API doc](https://substrate.dev/rustdocs/v3.0.0/frame_system/struct.AccountInfo.html)
and [`pallet_balances::AccountData` API doc](https://substrate.dev/rustdocs/v3.0.0/pallet_balances/struct.AccountData.html).

## Reference

1. <span id="ref-session-set-keys"></span>[`Session` pallet `set_keys` dispatchable call](https://github.com/paritytech/substrate/blob/8d02bb0bfc6136f6a3c805db19f51e43090a7cd4/frame/session/src/lib.rs#L529-L537)
2. <span id="ref-system-created"></span>[`System` frame `created` function](https://github.com/paritytech/substrate/blob/8d02bb0bfc6136f6a3c805db19f51e43090a7cd4/frame/system/src/lib.rs#L1562-L1573)
3. <span id="ref-assets-new-account"></span>[`Assets` pallet `new_account` function](https://github.com/paritytech/substrate/blob/8d02bb0bfc6136f6a3c805db19f51e43090a7cd4/frame/assets/src/functions.rs#L46-L61)

---
title: Smart Contract Runtime Environment Types
---

`ink!` provides a set of types for interacting with the runtime environment (currently:`AccountId`,
`Balance`, `Hash`, `Timestamp`).

Previously these types were fixed, requiring that the target substrate runtime had compatible types.

Now smart contract authors can specify their own definitions of these types, in order to be
compatible with their custom runtime. e.g.

```
// 1. Define type and derive the implementations.
#[cfg_attr(feature = "ink-generate-abi", derive(Metadata))]
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum CustomRuntimeTypes {}

// 2. Implement `EnvTypes` trait, specifying custom types
impl ink_core::env::EnvTypes for CustomRuntimeTypes {
    type AccountId = AccountId;
    type Balance = u128;
    type Hash = Hash;
    type Timestamp = u64;
    type BlockNumber = BlockNumber;
    type Call = calls::Call;
}


// 3. Add contract attribute specifying custom types
    #[ink::contract(version = "0.1.0", env = CustomRuntimeTypes)]
    ...
```

A full example of implementing this as a library can be found
[here](https://github.com/paritytech/ink-types-node-runtime).

### Testing

For accessing the state of the contract test environment, some helper methods will now require the
concrete implementation of the `EnvTypes`, matching the type specified in the contract `env`
attribute.

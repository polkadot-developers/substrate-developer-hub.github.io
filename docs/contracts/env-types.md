---
title: "Smart Contract Runtime Environment Types"
---

`ink!` provides a set of types for interacting with the runtime environment (currently:`AccountId`, `Balance`, `Hash`, `Moment`).

Previously these types were fixed, requiring that the target substrate runtime had compatible types.

Now smart contract authors can specify their own definitions of these types, in order to be compatible with their custom runtime. e.g.

```
// 1. Define type for implementation of custom runtime types
pub enum CustomRuntimeTypes {}

// 2. Implement `EnvTypes` trait, specifying custom types
impl ink_core::env::EnvTypes for CustomRuntimeTypes {
    type AccountId = [u8; 32];
    type Balance = u128;
    type Hash = [u8; 32];
    type Moment = u64;
}

contract! {
    // 3. Add attribute to contract specifying custom types
    #![env = CustomRuntimeTypes]
    
    ...
}
```

A full example of implementing this as a library can be found [here](https://github.com/paritytech/ink-types-node-runtime).

## Converting existing contracts

Existing contracts use the predefined set of types in `ink_core`: `ink_core::env::DefaultSrmlTypes`. These types are compatible with the standard substrate `node-runtime` definitions. 

To convert an existing contract, simply add the following attribute like so:

```
contract! {
    // Use existing default runtime types
    #![env = ink_core::env::DefaultSrmlTypes]
    
    ...
}
```

### Testing

For accessing the state of the contract test environment, some helper methods will now require the concrete implementation of the `EnvTypes`, matching the type specified in the contract `env` attribute. e.g.

Old:

```
env::test::set_caller(bob);
env::test::emitted_events();
```
New:

```
env::test::set_caller::<DefaultSrmlTypes>(bob);
env::test::emitted_events::<DefaultSrmlTypes>();
```

> **Note:** This api is subject to change, we're planning to review this to make it more ergonomic. See https://github.com/paritytech/ink/issues/125. 

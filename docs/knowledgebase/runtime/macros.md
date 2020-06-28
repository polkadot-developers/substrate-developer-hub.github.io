---
title: Runtime Macros
---

## Introduction

Rust macro is a way of writing code that writes code, also called metaprogramming. It is useful for reducing the amount of code one have to write and maintain. Macro also helps create domain specific language (DSL) by abstracting out some implementation details and defining its own rules and logics. 

In Substrate runtime development context, this helps runtime engineers to focus on the runtime logics and forget about details such as how the on-chain variables need to be encoded and decoded. That's why we frequently leverage these macros to simplify runtime development effort once the intent is made known, via the succinct statements in macros. But the downside is that sometimes developers may encounter error messages of new structs or types that they do not define as a result of how the macro content interacts inside the macro definition.

The purpose of this article is to give a basic overview of macros, and detail macros that runtime engineers deploy.

## Macro Basics

There are four kinds of macro in Rust:

- declarative macros defined with [`macro_rules!` macro](https://doc.rust-lang.org/book/ch19-06-macros.html#declarative-macros-with-macro_rules-for-general-metaprogramming)
- procedural macros, [custom derive](https://doc.rust-lang.org/book/ch19-06-macros.html#how-to-write-a-custom-derive-macro)
- procedural macros, [attribute-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#attribute-like-macros)
- procedural macros, [function-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#function-like-macros)

Most Substrate runtime macros are defined using either declarative macros or function-like macros. 

There are three ways to learn about these runtime macros:

  - read documentation of a particular macro
  - run `cargo expand` to review the macros-expanded code
  - read the macro definition. Readers are required to have a good grasp on [macro rules of expression pattern matching](https://danielkeep.github.io/tlborm/book/pim-README.html).

## Macro Usage in Substrate

When developing substrate runtime, there are a few macros that will be used frequently. The following is a brief introduction to these macros. They will be explained in what context they are used, how they are defined, how the code looks like when expanded within the project [Substrate Node Template](https://github.com/substrate-developer-hub/substrate-node-template).

### decl_storage

**Context**

To define storage items to be used in a runtime pallet. You can define its data type (a regular value `StorageValue`, a map `StorageMap`, a double-map `StorageDoubleMap`), its getter function, the type of the key and how they are hashed if it is a map or double-map data type, the name of the storage, and its default value.

**Objective**

This macro takes a succinct statements of 

```
#vis #name get(fn #getter) config(#field_name) build(#closure): #type = #default;
```

and replace it with a new type/struct defined by your `#name` and have it implement your datatype storage trait. 

The macro also sets up codes so the core struct `Module` implements a `Store` trait to have a basic setup for the pallet to have storage space.

[**API Documentation**](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.decl_storage.html)

[**Macro Definition**](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/procedural/src/lib.rs#L236-L238)

**Code Expansion Example**
  - <a href="https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-rs-L30-L40" target="_blank">Original Code</a>
  - <a href="https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-expanded-rs-L19-L164" target="_blank">Expanded Code</a>

**Somethings worth noting about on the macro expansion**

  - a trait called `Store`, and each storage name becomes an associated type inside the trait.
  - the core struct `Module` implements `Store`
  - the core struct `Module` implementation contains the getter function (pallet-template-expanded.rs#L33-35) and the storage metadata (pallet-template-expanded.rs#L67-70)
  - Each of the storage names becomes a struct. In the above expanded code, `Something` is defined (pallet-template-expanded.rs#L144-L164) and it implements `StorageValue<u32>`, the data type specified in the macro.
  - Helper structs `__GetByteStructSomething` and `__InherentHiddenInstance` are defined. The former is for setting default value of the storage, while the later implements traits for data encoding/decoding.

### decl_event

**Context**

To define events that a pallet extrinsics emit.

**Objective**

This macro defines the pallet events by rewriting with an `Event` enumeration, with each type of event as an enum variant inside. There are three variants of the `Event` enum defined:

- a simple event enum

    ```
    pub enum Event {
      Message(String),
    }
    ```

- an event enum that takes a generic type argument with its associated types used in enum variant, e.g.

    ```
    pub enum Event<T> where <T as Trait>::Balance {
      Message(Balance),
    }
    ```

- an event enum that the pallet trait `Trait` support multiple instances, e.g.

    ```
    pub enum Event<T, I: Instance = DefaultInstance> where
      <T as Trait>::Balance,
      <T as Trait>::Token
    {
      Message(Balance, Token),
    }
    ```

[**API Documentation**](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.decl_event.html)

[**Macro Definition**](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/src/event.rs#L101-L149)

**Code Expansion Example**

  - [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-rs-L43-L50)
  - [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-expanded-rs-L169-L330)

**Somethings worth noting about on the macro expansion**
  
  - an enum `RawEvent<AccountId>` is defined, with all events you specified as its enum variants
  - a type `Event` or `Event<T>` is defined, assigned to `RawEvent`
  - The `RawEvent` implements of all helper traits, including data encoding/decoding, `core::cmp::PartialEq`, `core::cmp::Clone`,
    `core::fmt::Debug`
  - The `RawEvent<AccountId>` implementation contains a `fn metadata()` function.

### decl_error

**Context**

To define error types a pallet might return in dispatchable functions. Dispatchable functions return `DispatchResult`, with either an `Ok(())`, or error defined in this macro.

**Objective**

This macro replaces our enum value in the macro into an enum `Error<T: Trait>`, and implement helpers method for conversion to error code (u8) and string. It also imeplements a function to returns its metadata.

One key implementation is that its automate the implementation of `From<Error<T>>` trait for `DispatchError`, so it return a dispatch error with proper module index, error code assigned to that error variant, and the error string. 

This macro convert 

[**API Documentation**](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.decl_error.html)

[**Macro Definition**](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/src/error.rs#L71-L203)

**Code Expansion Example**

  - [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-rs-L53-L60)
  - [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-expanded-rs-L331-L417)

**Somethings worth noting about on the macro expansion**
  
  - an enum `Error<T: Trait>` is defined, filled with enum variants developer specified in the macro.
  - `Error` implements helper function for display, encoded to a number (u8), and as string.
  - `Error` implementation contains a `fn metadata()` function.
  - implements `From<Error<T>>` for `DispatchError`, so the Error variant can be returned in function 
    that return `DispatchResult`.

### decl_module

**Context**

To define dispatchable functions in a pallet

**Objective**

This macro declares a `Module` struct and a `Call` enum for a pallet, and adding the necessary logic together with user-defined dispatchable calls into these two types. In addition to various helper traits / functions implemented for `Module` and `Call`, lifecycle traits are automatically added for `Module`, and each dispatchable calls are prepended with tracing logic.

[**API Documentation**](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.decl_module.html)

[**Macro Definition**](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/src/dispatch.rs#L275-L1613)

**Code Expansion Example**

  - [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-rs-L63-L109)
  - [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-expanded-rs-L419-L971)

**Somethings worth noting about on the macro expansion**
  
  - This macro declares a `Module` struct and a `Call` enum which implements the dispatch logic.
  - Some helpers trait are automatically imeplemented for `Module` struct, such as `core::cmp::Eq`, `core::clone::Clone`, etc.
  - There are a few lifecycle trait are automatically implemented for `Module`, such as `OnInitialize` (callback function a block is initialized), `OnRuntimeUpgrade` (callback when a chain is going to have a runtime upgrade), `OnFinalize` (callback when a block is being finalized), `OffchainWorker` (entrance of an offchain worker). 
  - Each of the dispatchable functions is prepended with logic to show tracing messages. Developers can set to be interested to display tracing messages of these dispatchable functions if they are being called. 
  - an enum `Call<T: Trait>` is declared.
  - `GetDispatchInfo` and `frame_support::dispatch::Dispatchable` traits are implemented for `Call<T: Trait>` that contain the core logic of dispatching call.
  - Finally `Callable<T>` trait is implemented for `Module<T>` with its associated type `Call` assigned to the `Call` enum.

### construct_runtime

**When to Use it?**

It is part of the contruction process to integrate various pallets into your runtime.

**Objective**

The macro does a lot of things, as noted below. It creates and implements various struct and enum (e.g. `Runtime`, `Event`, `Origin`, `Call`, and `GenesisConfig`) and automated the implementation of them for helper traits. This macro also spit out the logic of mapping different events and dispatchable calls back to a particular pallet.

[**API Documentation**](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.construct_runtime.html)

[**Macro Definition**](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/procedural/src/construct_runtime/mod.rs#L31-L36)

**Code Expansion Example**

  - [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-runtime-lib-rs-L260-L277)
  - [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-runtime-lib-expanded-rs-L763-L2475)

**Somethings worth noting about on the macro expansion**

  - a `Runtime` struct type is declared
  - an `Event` enum is defined with variants of all pallets that emit events. There are also some encoding/decoding traits and helper methods are implemented for the enum. Various conversion traits `TryInto` are implemented for `Event` to convert the enum to the particular event of a certain pallet.
  - an `Origin` enum is defined with its helper traits on `PartialEq`, `Clone`, `Debug` implemented. It maps each pallet included in the runtime to an index number.
  - a `Call` enum is defined with all integrated pallet as variants. It contains the data and metadata of each of the integrated pallets, and redirect calls to the specific pallet via implementing `frame_support::dispatch::Dispatchable`.
  - The `GenesisConfig` struct type is defined, and implement `sp_runtime::BuildStorage` trait for building up the storage genesis config.
  - Provide a default `frame_support::unsigned::ValidateUnsigned` trait implementation if not provided.

### parameter_types

**When to Use it?**

To declare concrete types to be assigned to associated types of a pallet configurable trait `Trait` when the runtime implements that pallet trait.

**Objective**

The macro the paramter into a struct with a `get()` function of retrieving the value. It also implement the `From<T>` trait to convert the struct to the specified type.

[**API Documentation**](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.parameter_types.html)

[**Macro Definition**](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/src/lib.rs#L127-L174)

**Code Expansion Example**

  - [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-runtime-lib-rs-L213-L215)
  - [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-runtime-lib-expanded-rs-L700-L710)

**Somethings worth noting about on the macro expansion**

  - The parameter specified is converted to a complex type (struct) with a `get()` function and `From<TargetType>` trait implemented.

### impl_runtime_apis

**Context**

This macro generates the api implementations for the client side and provides it through the `RuntimeApi` type. 

**Objective**

The macro define the `RuntimeApi` and `RuntimeApiImpl` exposed to Substrate node client. It provides implementation details of the RuntimeApiImpl based on the setup and appended user specified implementation in the `RuntimeApiImpl`.

To expose version information about all implemented api traits, the constant `RUNTIME_API_VERSIONS` is generated. This constant should be used to instantiate the apis field of RuntimeVersion.

[**API Documentation**](https://substrate.dev/rustdocs/v2.0.0-rc3/sp_api/macro.impl_runtime_apis.html)

[**Macro Definition**](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/primitives/api/proc-macro/src/impl_runtime_apis.rs#L701-L706)

**Code Expansion Example**

  - [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-runtime-lib-rs-L306-L414)
  - [expanded]()

**Somethings worth noting about on the macro expansion**
  
  - declared struct `RuntimeApi` and `RuntimeApiImpl`. It also implemented various trait for `RuntimeApiImpl`.
  - what you defined within `impl_runtime_apis` are appended within `RuntimeApiImpl` implementation.
  - A few of the methods are only existed when run as native or test (`#[cfg(any(feature = "std", test))]`).
  - a constant `RUNTIME_API_VERSIONS` is defined with `ID` and `VERSION` of various components, such as metadata, blockBuilder, OffchainWorkerApi, etc
  - A public mod `api` is defined with a `dispatch()` function implemented on how various strings mapped to dispatched calls.

### app_crypto

**Context**

**Objective**

[**API Documentation**]

[**Macro Definition**]

**Code Expansion Example**

  - [original]
  - [expanded]

**Somethings worth noting about on the macro expansion**

### impl_outer_origin!

**Context**

**Objective**

[**API Documentation**]

[**Macro Definition**]

**Code Expansion Example**

  - [original]
  - [expanded]

**Somethings worth noting about on the macro expansion**

### impl_outer_event!

**Context**

**Objective**

[**API Documentation**]

[**Macro Definition**]

**Code Expansion Example**

  - [original]
  - [expanded]

**Somethings worth noting about on the macro expansion**

## Conclusion

Through this article, you should have a good grasp on why Substrate runtime leverage on Rust macros. You also have a basic understanding on some of the frequently used macros in runtime development, and hopefully better equip you when you are debugging on macro content and codes that interact with these macros. 

## References

- [The Rust Programming Language ch 19.5 Macros](https://doc.rust-lang.org/book/ch19-06-macros.html)
- [The Little Book of Rust Macros](https://danielkeep.github.io/tlborm/book/index.html)

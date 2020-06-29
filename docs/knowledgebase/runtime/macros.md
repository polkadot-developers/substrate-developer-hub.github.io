---
title: Runtime Macros
---

## Introduction

Rust macro is a way of writing code that writes code, also called metaprogramming. It is useful for reducing the amount of code one have to write and maintain. Macro also helps create domain specific language (DSL) by abstracting out some implementation details and defining its own rules and logics. 

In Substrate runtime development context, this helps runtime engineers to focus on the runtime logics and forget about details such as how the on-chain variables need to be encoded and decoded. That's why we frequently leverage these macros to simplify runtime development effort once the intent is made known via the succinct statements in macros. But the downside is that sometimes developers may encounter error messages of new structs or types that seems to come out of nowhare, but actually as a result of how the macros creating new types and interacting with contents inside.

The purpose of this article is to give a basic overview of macros, and detail some Substrate macros that runtime engineers deploy.

## Macro Basics

There are four kinds of macro in Rust:

- declarative macros defined with [`macro_rules!`](https://doc.rust-lang.org/book/ch19-06-macros.html#declarative-macros-with-macro_rules-for-general-metaprogramming)
- procedural macros as [custom derive](https://doc.rust-lang.org/book/ch19-06-macros.html#how-to-write-a-custom-derive-macro)
- procedural macros as [attribute-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#attribute-like-macros)
- procedural macros as [function-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#function-like-macros)

Most Substrate runtime macros are defined using either declarative macros or function-like macros. 

There are three ways to learn about these runtime macros:

  - read documentation of a particular macro
  - run [`cargo expand`](https://github.com/dtolnay/cargo-expand) to review the macros-expanded code
  - read the macro definition. Readers are required to have a good grasp on [macro rules of expression pattern matching](https://danielkeep.github.io/tlborm/book/pim-README.html).

## Substrate Runtime Macros

When developing substrate runtime, there are a few macros that will be used frequently. The following is a relatively detail explanation to these macros. They will be explained in when they are used, what they do, how the code looks like when expanded within the [Substrate Node Template](https://github.com/substrate-developer-hub/substrate-node-template) project, and implementation notes that runtime engineers may find worth noting about.

### decl_storage!

**When to Use**

To define storage items in a runtime pallet. For each storage item, you can define: 

- its data type (a regular value `StorageValue`, a map `StorageMap`, a double-map `StorageDoubleMap`), 
- its getter function, 
- its key types and their hashing methods (if a map or double-map), 
- the name of the storage, and 
- its default value.

**What It Does**

This macro takes a succinct statement of 

```
#vis #name get(fn #getter) config(#field_name) build(#closure): #type = #default;
```

and replaces it with a new struct type defined by your `#name` and have it implement the datatype storage trait. 

The macro also sets up codes so the core `Module` struct type implements a `Store` trait to set up the pallet to have storage space.

**Doc. and Example**

  - [API Documentation](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.decl_storage.html)
  - [Macro Definition](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/procedural/src/lib.rs#L236-L238)
  - Macro Expansion Example: [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-rs-L30-L40), [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-expanded-rs-L19-L164)

**Macro Implementation Notes**

  - `Store` trait is declared, with each storage name becomes an associated type inside the trait.
  - `Module` struct type is declared and implements `Store` trait.
  - `Module` implementation contains the getter function and metadata of each storage items.
  - Each of the storage items becomes a struct. In the above expanded code, `Something` struct type [is declared and implements `StorageValue<u32>` trait](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-expanded-rs-L144-L164), the data type specified in the macro.
  - Helper structs `__GetByteStructSomething` and `__InherentHiddenInstance` are defined. The former is for setting default value of the storage item, while the later implements traits for data encoding/decoding.

### decl_event!

**When to Use**

To define events that a runtime pallet emit.

**What It Does**

This macro defines pallet events by implementing `Event` enum type, with each event type in the macro as an enum variant inside `Event`.

**Doc. and Example**

  - [API Documentation](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.decl_event.html)
  - [Macro Definition](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/src/event.rs#L101-L149)
  - Macro Expansion Example: [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-rs-L43-L50), [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-expanded-rs-L169-L330)

**Macro Implementation Notes**

  - `Event` or `Event<T>` type is defined, assigned to `RawEvent`.
  - `RawEvent<AccountId>` enum type is defined, with all events specified in the macro as its enum variants
  - The macro implements various helper traits for`RawEvent`, including data encoding/decoding, `core::cmp::PartialEq`, `core::cmp::Clone`, and `core::fmt::Debug`.
  - Inside `RawEvent<AccountId>` implementation there is a `fn metadata()` function to retrieve meta-data for events emitted in the pallet.

### decl_error!

**When to Use**

To define error types a pallet may return in its dispatchable functions. Dispatchable functions return `DispatchResult`, with either an `Ok(())`, or `DispatchError` containing custom errors defined in this macro.

**What It Does**

This macro defined `Error<T: Trait>` struct type, and implement helpers method for mapping each error type to sequential error code and string.

One key is that the macro automatically implements `From<Error<T>>` trait for `DispatchError`, so `DispatchError` could return a dispatch error with proper module index, error code, and the error string for a particular error type. 

**Doc. and Example**

  - [API Documentation](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.decl_error.html)
  - [Macro Definition](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/src/error.rs#L71-L203)
  - Macro Expansion Example: [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-rs-L53-L60), [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-expanded-rs-L331-L417)

**Macro Implementation Notes**

  - `Error<T: Trait>` enum type is defined, filled with enum variants specified in the macro.
  - `Error` implements helper functions for displaying error type, encoding error to a sequential error code, and as a string.
  - `Error` type implementation contains a `fn metadata()` function.
  - `Error` implements `From<Error<T>>` for `DispatchError`, so the error type can be returned in dispatchable functions.

### decl_module!

**When to Use**

To define dispatchable functions in a pallet

**What It Does**

The macro declares a `Module` struct and `Call` enum type for the containing pallet. It adds the necessary logics together with user-defined dispatchable calls into these two types. In addition to various helper traits / functions implemented for `Module` and `Call`, e.g. `Copy`, `StructuralEq`, `Debug`, the macro also inserts lifecycle traits implementation are automatically added for `Module`, e.g. `frame_support::traits::OnInitialize`, `frame_support::traits::OnFinalize`, `frame_support::traits::OnRuntimeUpgrade`, and `frame_support::traits::OffchainWorker`.

**Doc. and Example**

  - [API Documentation](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.decl_module.html)
  - [Macro Definition](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/src/dispatch.rs#L275-L1613)
  - Macro Expansion Example: [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-rs-L63-L109), [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-expanded-rs-L419-L971)

**Macro Implementation Notes**

  - This macro declares a `Module<T>` struct and a `Call<T>` enum which implements the dispatch logic.
  - Some helper traits are automatically imeplemented for `Module` struct, such as `core::cmp::Eq`, `core::clone::Clone`, etc.
  - Some lifecycle traits are automatically implemented for `Module`, such as `OnInitialize` (callback function a block is initialized), `OnRuntimeUpgrade` (callback when a chain is going to have a runtime upgrade), `OnFinalize` (callback when a block is being finalized), `OffchainWorker` (entrance of an offchain worker upon a block is finalized). 
  - `frame_support::dispatch::GetDispatchInfo` and `frame_support::dispatch::Dispatchable` traits are implemented for `Call<T: Trait>` that contain the core logic for dispatching calls.
  - `frame_support::dispatch::Callable<T>` trait is implemented for `Module<T>`,  with its associated type `Call` assigned to the `Call` enum.
  - Each dispatchable functions is prepended with logic to show tracing messages. Developers can set whether to show these tracing messages by indicating their interest levels. 

### construct_runtime!

**When to Use**

To construct Substrate runtime and integrating various pallets into the runtime.

**What It Does**

The macro does a lot, as noted below. It declares and implements various struct and enum, e.g.`Runtime`, `Event`, `Origin`, `Call`, `GenesisConfig` etc, and automatically implements various helper traits for these struct type. The macro also spit inserts logic of mapping different events and dispatchable calls from the overarching runtime back to a particular pallet.

**Doc. and Example**

  - [API Documentation](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.construct_runtime.html)
  - [Macro Definition](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/procedural/src/construct_runtime/mod.rs#L31-L36)
  - Macro Expansion Example: [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-runtime-lib-rs-L260-L277), [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-runtime-lib-expanded-rs-L763-L2475)

**Macro Implementation Notes**

  - `Runtime` struct type is defined to represent the Substrate runtime.
  - `Event` enum type is defined with variants of all pallets that emit events, with helper traits and encoding/decoding traits implemented for the enum. Various conversion traits `TryInto<pallets::Event<Runtime>>` are implemented for `Event` to extract the event out from the enum type.
  - `Origin` enum type is defined with helper traits, e.g. `PartialEq`, `Clone`, `Debug` automatically implemented. It defines the type where an extrinsic calls is from, `NONE`, `ROOT`, or signed by a particular account.
  - `Call` enum type is defined with all integrated pallets as variants. It contains the data and metadata of each of the integrated pallets, and redirect calls to the specific pallet via implementing `frame_support::dispatch::Dispatchable`.
  - `GenesisConfig` struct type is defined, and implements `sp_runtime::BuildStorage` trait for building up the storage genesis config.
  - The macro also provide a default `frame_support::unsigned::ValidateUnsigned` trait implementation if not provided to disallow all unsigned transactions.

### parameter_types!

**When to Use**

To declare parameter types to be assigned to pallet configurable trait associated types during rumtime construction.

**What It Does**

The macro replaces each parameter specified into a struct type with a `get()` function returning it specified value. It also implements a `frame_support::traits::Get<I>` trait for each type to convert the type to its specified return value.

**Doc. and Example**
  - [API Documentation](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.parameter_types.html)
  - [Macro Definition](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/src/lib.rs#L127-L174)
  - Macro Expansion Example: [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-runtime-lib-rs-L213-L215), [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-runtime-lib-expanded-rs-L700-L710)

**Macro Implementation Notes**

  - The parameter specified is converted to a struct type with a `get()` function and `frame_support::traits::Get<I>` trait implemented.

### impl_runtime_apis!

**When to Use**

This macro generates the API implementations for the client side and provides it through the `RuntimeApi` and `RuntimeApiImpl` struct type. 

**What It Does**

The macro define the `RuntimeApi` and `RuntimeApiImpl` exposed to Substrate node client. It provides implementation details of the RuntimeApiImpl based on the setup and appended user specified implementation in the `RuntimeApiImpl`.


**Doc. and Example**

  - [API Documentation](https://substrate.dev/rustdocs/v2.0.0-rc3/sp_api/macro.impl_runtime_apis.html)
  - [Macro Definition](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/primitives/api/proc-macro/src/impl_runtime_apis.rs#L701-L706)
  - Macro Expansion Example: [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-runtime-lib-rs-L306-L414), [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-runtime-lib-expanded-rs-L2503-L3562)

**Macro Implementation Notes**

  - `RuntimeApi` and `RuntimeApiImpl` structs are declared. The macro also implemented various helper traits for `RuntimeApiImpl`.
  - What you defined within `impl_runtime_apis!` macro are appended at the end of `RuntimeApiImpl` implementation.
  - To expose version information about the runtime, a constant `RUNTIME_API_VERSIONS` is defined. containing the runtime core `ID`/`VERSION`, metadata `ID`/`VERSION`, SessionKeys `ID`/`VERSION`, etc.
  - A public module `api` is defined with a `dispatch()` function implemented deciding how various strings are mapped to metadata or chain lifecycle calls.

### app_crypto!

**Context**

To declares `Public`, `Pair`, `Signature` types which are functionally equivalent to $pair, but are new Application-specific types whose identifier is $key_type.

**Objective**

This macro hold the crypto key information. It declare `Public`, `Pair`, and `Signature` types, and implement methods for storing the key type information, generating key pair, and verification methods on signature with its repective key.

[**API Documentation**](https://substrate.dev/rustdocs/v2.0.0-rc3/sp_application_crypto/macro.app_crypto.html)

[**Macro Definition**](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/primitives/application-crypto/src/lib.rs#L60-L69)

**Code Expansion Example**

  - [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-app-crypto-rs-L12)
  - [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-app-crypto-expanded-rs-L10-L613)

**Somethings worth noting about on the macro expansion**

  - a `Public` struct type is declared, which implements `application_crypto::AppKey` trait defining the public key type, and `RuntimeAppPublic` trait for generating keypairs for the application.
  - a `Signature` struct type is declared, 
  - a generic `Pair` struct type wrapper is declared to wrap over the crypto pair. This type implements `AppKey` trait storing the `Public`, `Pair`, and `Signature` types.

### impl_outer_origin!

**Context**

To construct an `Origin` struct type for a runtime. This is usually called automatically by the `construct_runtime` macro. But developers may call this macro directly to construct a mock runtime to hold the target pallet for testing.

**Objective**

This macro helps to convert the user intent on the `Origin` construction to concrete implementation of the `Origin` enum type.

[**API Documentation**](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.impl_outer_origin.html)

[**Macro Definition**](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/src/origin.rs#L23-L223)

**Code Expansion Example**

  - [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-mock-rs-L12-L14)
  - [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-test-expanded-rs-L26-L147)

**Somethings worth noting about on the macro expansion**

  - declaring and implementing the `Origin` enum and implements various helper traits, e.g. `Clone`, `StructuralPartialEq`, `Debug` etc for the type.

### impl_outer_event

**Context**

Constructs an `Event` type for a runtime. This is usually called automatically by the construct_runtime macro. But developers may call this macro directly to construct `Event` enum to indicate events they are interested to listen for when building a mock runtime for testing.

**Objective**

This macro replace the intent on interested pallet events to a concrete implementation of `Event` that includes the events of tar pallets and automatically implement various help traits on `Event` type.

[**API Documentation**](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.impl_outer_event.html)

[**Macro Definition**](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/src/event.rs#L334-L485)

**Code Expansion Example**

  - [original](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-mock-rs-L16-L21)
  - [expanded](https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-test-expanded-rs-L148-L361)

**Somethings worth noting about on the macro expansion**

  - declaring and implementing the Event enum and implements various helper traits, e.g. `Clone`, `StructuralPartialEq`, `Debug`, data encoding/decoding, and meta-data for the type.

## Conclusion

Through this article, you should have a good grasp on why Substrate runtime leverage on Rust macros. You also have a basic understanding on some of the frequently used macros in runtime development, and hopefully better equip you when you are debugging on macro content and codes that interact with these macros. 

## References

- [The Rust Programming Language ch 19.5 Macros](https://doc.rust-lang.org/book/ch19-06-macros.html)
- [The Little Book of Rust Macros](https://danielkeep.github.io/tlborm/book/index.html)

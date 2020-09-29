---
title: Runtime Macros
---

## Introduction

Substrate's runtime macros allow developers to focus on runtime logic rather than how the on-chain
variables need to be encoded and decoded. As a result, developers frequently leverage these macros
to optimize runtime development with their intention declared utilizing the succinct statements in
macros. As a result, sometimes developers may encounter error messages of new structs or
types, however these errors are a result of how the macros create new types interacting with
contents inside.

The purpose of this article is to give a basic overview of macros and explain the Substrate macros
that runtime engineers frequently encounter.

## Macro Basics

There are four kinds of macro in Rust:

- declarative macros defined with
  [`macro_rules!`](https://doc.rust-lang.org/book/ch19-06-macros.html#declarative-macros-with-macro_rules-for-general-metaprogramming)
- procedural macros as
  [custom derive](https://doc.rust-lang.org/book/ch19-06-macros.html#how-to-write-a-custom-derive-macro)
- procedural macros as
  [attribute-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#attribute-like-macros)
- procedural macros as
  [function-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#function-like-macros)

Most Substrate runtime macros are defined using either declarative macros or function-like macros.

There are additional way to learn about Substrate runtime macros:

- read documentation of a particular macro
- run [`cargo expand`](https://github.com/dtolnay/cargo-expand) to review the macros-expanded code
- read the macro definition. It is helpful to have a good understanding of
  [macro rules of expression pattern matching](https://danielkeep.github.io/tlborm/book/pim-README.html).

## Substrate Runtime Macros

When developing Substrate runtime, there are key macros the majority of developers utilize. The
following is a comprehensive explanation of these macros. After this article, a developer will have
a better understanding of how they are used, what they do and how the expanded code is within
[Substrate Node Template](https://github.com/substrate-developer-hub/substrate-node-template).
Developers who want to know about the implementation details are encouraged to follow the links in
_Doc. and Example_ to see how macro code is expanded.

### decl_storage!

**When to Use**

To define storage items in a FRAME pallet. A storage item definition includes:

- its data type, being one of:

  - for `StorageValue`: `rust-type`
  - for `StorageMap`: `map hasher($hasher) rust_type => rust_type`
  - for `StorageDoubleMap`:
    `doublemap hasher($hasher) rust_type, hasher($hasher) rust_type => rust_type`

- its getter function,
- its key types and their hashing methods (if a map or double-map),
- the name of the storage,
- its default value

These storage values can be initialized in its genesis block via an `add_extra_genesis` block
afterwards.

```rust
decl_storage! {
  trait Storage for Module<T: Trait> as MyModule {
    // ...
  }
  add_extra_genesis {
    build (|config| {
      //...
    });
  }
}
```

**What It Does**

This macro takes a succinct statement of:

```
#vis #name get(fn #getter) config(#field_name) build(#closure): #type = #default;
```

Replacing it with a new struct type defined by `#name` and have it implement the data type storage
trait.

The macro also declares and implements the `Store` trait to set up the pallet to have storage space,
and implements getters on the `Module` struct defined by `decl_module!`.

**Docs and Notes**

- [API Documentation](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.decl_storage.html)
- `Store` trait is declared with each storage name, thus becoming an associated type inside the
  trait.
- `Module` implementation contains the getter function and metadata of each storage item.
- Each of the storage items becomes a struct.

### decl_event!

**When to Use**

To define events when a runtime pallet emits.

**What It Does**

This macro defines pallet events by implementing `Event` enum type, with each event type in the
macro being an enum variant inside `Event`.

**Docs and Notes**

- [API Documentation](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.decl_event.html)
- `Event` or `Event<T>` type is defined, assigned to `RawEvent`.
- `RawEvent<...all generic types used>` enum type is defined with all events specified in the macro
  as its enum variants.
- The macro implements various helper traits for`RawEvent`, including data encoding/decoding,
  `core::cmp::PartialEq`, `core::cmp::Clone`, and `core::fmt::Debug`.
- `RawEvent<...>` implements `metadata()` function to retrieve meta-data for events emitted in the
  pallet.

### decl_error!

**When to Use**

To define error types which a pallet may return in its dispatchable functions. Dispatchable
functions return `DispatchResult`, with either an `Ok(())`, or `DispatchError` containing custom
errors defined in this macro.

**What It Does**

This macro defines the `Error<T: Trait>` type, and implements helper methods for mapping each error
type to a sequential error code and corresponding string.

One key feature is that the macro automatically implements the `From<Error<T>>` trait for
`DispatchError`. Therefore, `DispatchError` returns the proper module index, error code, error
string for a particular error type, and the documentation provided on top of each error as metadata.

**Docs and Notes**

- [API Documentation](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.decl_error.html)
- `Error<T: Trait>` enum type is filled with enum variants specified in the macro.
- `Error` implements various helper functions, and maps each error to a sequential error code and an
  error string.
- `Error` type implementation contains a `fn metadata()` function.
- `Error` implements `From<Error<T>>` for `DispatchError`, so the error type can be returned in
  dispatchable functions.

### decl_module!

**When to Use**

To define dispatchable functions in a pallet

**What It Does**

The macro declares a `Module` struct and `Call` enum type for the containing pallet. It combines the
necessary logics using user-defined dispatchable calls into the two types. In addition to various
helper traits implemented for `Module` and `Call`, e.g. `Copy`, `StructuralEq`, `Debug`, the macro
also inserts lifecycle trait implementations for `Module`, e.g.
`frame_support::traits::OnInitialize`, `frame_support::traits::OnFinalize`,
`frame_support::traits::OnRuntimeUpgrade`, and `frame_support::traits::OffchainWorker`.

**Docs and Notes**

- [API Documentation](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.decl_module.html)
- This macro declares a `Module<T>` struct and a `Call<T>` enum which implements the dispatch logic.
- Helper traits are automatically implemented for `Module` struct, such as `core::cmp::Eq`,
  `core::clone::Clone`, etc.
- `Module` implements various lifecycle traits, such as

  - `frame_support::traits::OnInitialize`: callback when a block is initialized,
  - `frame_support::traits::OnRuntimeUpgrade`: callback when a chain is undergoing a runtime
    upgrade,
  - `frame_support::traits::OnFinalize`: callback when a block is finalized, and
  - `frame_support::traits::OffchainWorker`: entrance of an offchain worker upon a block is
    finalized.

- `Call<T: Trait>` implements `frame_support::dispatch::GetDispatchInfo` and
  `frame_support::traits::UnfilteredDispatchable` traits that contain the core logic for dispatching
  calls.
- `Module<T>` implements `frame_support::dispatch::Callable<T>` trait with its associated type
  `Call` assigned to the `Call` enum.
- Each dispatchable function is prepended with internal tracing logic for keeping track of the node
  activities. Developers can set whether to trace for a dispatchable function by specifying its
  interest level.

### construct_runtime!

**When to Use**

To construct Substrate runtime and integrating various pallets into the runtime.

**What It Does**

The macro declares and implements various struct and enum, e.g.`Runtime`, `Event`, `Origin`, `Call`,
`GenesisConfig` etc, and implements various helper traits for these struct types. The macro also
adds logics of mapping different events and dispatchable calls from the overarching runtime back to
a particular pallet.

**Docs and Notes**

- [API Documentation](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.construct_runtime.html)
- `Runtime` struct type is defined to represent the Substrate runtime.
- `Event` enum type is defined with variants of all pallets that emit events, with helper traits and
  encoding/decoding traits implemented for the enum. Various conversion traits `Event` also
  implements `TryInto<pallets::Event<Runtime>>` trait to extract the event out from the enum type.
- `Origin` enum type is defined with helper traits, e.g. `PartialEq`, `Clone`, `Debug` implemented.
  This enum type defines who calls an extrinsic: `NONE`, `ROOT`, or signed by a particular account.
  These three primitive origins are defined by the FRAME System module, but optional FRAME pallets
  may also define origins.
- `Call` enum type is defined with all integrated pallets as variants. It contains the data and
  metadata of each of the integrated pallets, and redirects calls to the specific pallet via
  implementing `frame_support::traits::UnfilteredDispatchable` trait.
- `GenesisConfig` struct type is defined and implements `sp_runtime::BuildStorage` trait for
  building up the storage genesis config.
- The macro adopts the `frame_support::unsigned::ValidateUnsigned` trait implementation from each
  pallet. If no `ValidateUnsigned` trait is implemented in any included pallets, all unsigned
  transactions will be rejected.

### parameter_types!

**When to Use**

To declare parameter types to be assigned to pallet configurable trait associated types during
runtime construction.

**What It Does**

The macro replaces each parameter specified into a struct type with a `get()` function returning its
specified value. Each parameter struct type also implements a `frame_support::traits::Get<I>` trait
to convert the type to its specified value.

**Docs**

- [API Documentation](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.parameter_types.html)

### impl_runtime_apis!

**When to Use**

This macro generates the API implementations for the client side through the `RuntimeApi` and
`RuntimeApiImpl` struct type.

**What It Does**

The macro defines the `RuntimeApi` and `RuntimeApiImpl` exposed to the Substrate node client. It
provides implementation details of the RuntimeApiImpl based on the setup and appended user specified
implementation in the `RuntimeApiImpl`.

**Docs Notes**

- [API Documentation](https://substrate.dev/rustdocs/v2.0.0/sp_api/macro.impl_runtime_apis.html)
- `RuntimeApi` and `RuntimeApiImpl` structs are declared. The macro also implements various helper
  traits for `RuntimeApiImpl`.
- What developers define within `impl_runtime_apis!` macro are appended to the end of
  `RuntimeApiImpl` implementation.
- To expose version information about the runtime, a constant `RUNTIME_API_VERSIONS` is defined.
  containing the runtime core `ID`/`VERSION`, metadata `ID`/`VERSION`, SessionKeys `ID`/`VERSION`,
  etc.
- A public module `api` is defined with a `dispatch()` function implemented deciding how various
  strings are mapped to metadata or chain lifecycle calls.

### app_crypto!

**When to Use**

To specify cryptographic key pairs and its signature algorithm that are to be managed by a pallet.

**What It Does**

The macro declares three struct types, `Public`, `Signature`, and `Pair`. Aside from having various
helper traits implemented for these three types, `Public` type is implemented to generating
keypairs, signing and verifying signature, `Signature` type to hold the signature property given the
signature chosen to be used (e.g. SR25519, ED25519 etc), and `Pair` type to generate a
public-private key pair from a seed.

**Docs and Notes**

- [API Documentation](https://substrate.dev/rustdocs/v2.0.0/sp_application_crypto/macro.app_crypto.html)
- `Public` struct type is declared, and implements `sp_application_crypto::AppKey` trait defining
  the public key type, and `sp_application_crypto::RuntimeAppPublic` trait for generating keypairs,
  signing, and verifying signatures.
- `Signature` struct type is declared, and implements `core::hash::Hash` trait on how the data with
  this signature type is hashed.
- `Pair` struct type is declared to wrap over the crypto pair. This type implements
  `sp_application_crypto::Pair` and `sp_application_crypto::AppKey` traits determining how it
  generates public-private key pairs from a phrase or seed.

### impl_outer_origin!

**When to Use**

To construct an `Origin` struct type for a runtime. This macro is typically called automatically by
the `construct_runtime!` macro, but developers may call this macro directly to construct a mock
runtime for testing that has a less complex structure than an actual runtime.

Each extrinsic call has an `Origin` type parameter passed, signaling if the call is made from
`NONE`, `ROOT`, or a particular account.

**What It Does**

This macro creates an `Origin` struct type, and implements various helper traits for the type.

**Docs**

- [API Documentation](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.impl_outer_origin.html)

### impl_outer_event!

**When to Use**

To construct an `Event` struct type for a runtime. This macro is typically called automatically by
the `construct_runtime!` macro. However, developers may call this macro directly to construct an
`Event` enum selecting the specific pallet events they want to listen for. This is useful when
constructing a mock runtime for testing.

**What It Does**

This macro creates an event enum type, implements various helper traits on `Event` type, including
`core::clone::Clone`, `core::marker::StructuralPartialEq`, `core::fmt::Debug`, data
encoding/decoding traits etc. Finally, the macro implements only the specifying pallet events for
the runtime.

**Docs**

- [API Documentation](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.impl_outer_event.html)

### impl_outer_dispatch!

**When to Use**

To implement a meta-dispatch module to dispatch to other dispatchers. This macro is typically called
automatically by the `construct_runtime!` macro. However, developers may call this macro directly to
construct a `Call` enum selecting the specific pallet that it dispatches. This is useful when
constructing a mock runtime for testing.

**What It Does**

This macro creates a `Call` enum type, implements various helper traits on `Event` type, including
`Clone`, `PartialEq`, `RuntimeDebug` etc. Finally, the macro implements `GetDispatchInfo`,
`GetCallMetadata`, `IsSubType` traits for the `Call` enum.

**Docs**

- [API Documentation](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.impl_outer_dispatch.html)

## Conclusion

Through this article, developers will have a good understanding of how Substrate runtime leverage on
Rust macros and a basic understanding of some of the frequently used macros in runtime development.

## References

- [The Rust Programming Language ch 19.5 Macros](https://doc.rust-lang.org/book/ch19-06-macros.html)
- [The Little Book of Rust Macros](https://danielkeep.github.io/tlborm/book/index.html)

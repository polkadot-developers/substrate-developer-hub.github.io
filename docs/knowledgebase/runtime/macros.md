---
title: Runtime Macros
---
> **Update:** As of January 2021, FRAME based pallets has upgraded its use of macros. Refer to [this guide](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#upgrade-guidelines) to learn about migrating a v1 pallet to v2. 

Substrate uses [Rust macros](https://doc.rust-lang.org/book/ch19-06-macros.html) to aggregate the logic derived from pallets that are implemented for a runtime. 
These runtime macros allow developers to focus on runtime logic rather than encoding and decoding on-chain
variables or writing extensive blocks of code to achieve [basic blockchain fundamentals](https://substrate.dev/docs/en/knowledgebase/runtime/primitives#core-primitives). This offloads a lot of the heavy lifting from blockchain development efforts and removes the need to duplicate code.

The purpose of this article is to give a basic overview of Rust macros and explain the Substrate macros
that runtime engineers most frequently use. 

## Macro Basics

Put simply, macros are lines of code that write code. They provide the ability to abstract things out without needing to declare complex data structures explicitly.
There are four kinds of macro in Rust:

- [declarative macros](https://doc.rust-lang.org/book/ch19-06-macros.html#declarative-macros-with-macro_rules-for-general-metaprogramming) (most widely used)
- [custom derive](https://doc.rust-lang.org/book/ch19-06-macros.html#how-to-write-a-custom-derive-macro) (a type of procedural macro)
- [attribute-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#attribute-like-macros) (a type of procedural macro)
- [function-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#function-like-macros) (a type of procedural macro)

Most Substrate runtime macros are defined using either **declarative macros** or **function-like macros**.

> **Tips** to learn more about Substrate runtime macros:
> - read the [documentation](https://substrate.dev/rustdocs/v3.0.0/frame_support/index.html#macros) of the macros used in FRAME
> - use [`cargo expand`](https://github.com/dtolnay/cargo-expand) to review a macro's expanded code and understand what's happening under the hood
> - read more on [macro rules of expression pattern matching](https://danielkeep.github.io/tlborm/book/pim-README.html)

## Substrate Runtime Macros

The following section is a comprehensive explanation of the macros that runtime engineers most frequently encounter. 
Developers who want to know about the implementation details are encouraged to follow the links in
"Docs and Notes" sub-sections to better understand how each macro expands.

Substrate Primitives and FRAME both rely on a collection of various types of macros. The following sections will go over each in more detail. Here's a general overview of Substrate macros:

**Macros in FRAME:**
- in `frame_support`: 
  - [function-like](https://substrate.dev/rustdocs/v3.0.0/frame_support/index.html#macros) macros (v1)
  - [derive](https://substrate.dev/rustdocs/v3.0.0/frame_support/index.html#derives) macros (v1)
  - [attribute](https://substrate.dev/rustdocs/v3.0.0/frame_support/index.html#attributes) macros (v2)


**Macros in Substrate Primitives:**
- in `sp_core`: 
  - [function-like macros](https://substrate.dev/rustdocs/v3.0.0/sp_core/index.html#macros) macros 
  - [derive `RuntimeDebug`](https://substrate.dev/rustdocs/v3.0.0/sp_core/index.html#derives) macro
- in `sp_runtime`: 
  - [function-like](https://substrate.dev/rustdocs/v3.0.0/sp_runtime/index.html#macros) macros 
  - [derive](https://substrate.dev/rustdocs/v3.0.0/sp_runtime/index.html#derives) macros
- in `serde`: [function-like](https://substrate.dev/rustdocs/v3.0.0/sp_runtime/index.html#derives) macros
- in `sp_api`: [function-like](https://substrate.dev/rustdocs/v3.0.0/sp_api/index.html#macros) macros
- in `sp_std`: [function-like](https://substrate.dev/rustdocs/v3.0.0/sp_std/index.html#macros) macros
- in `sp_version`: [function-like](https://substrate.dev/rustdocs/v3.0.0/sp_version/index.html#macros) macros

> **Note**: Refer to `#Substrate dependencies` in the `Cargo.toml` file of the [node template runtime](https://github.com/substrate-developer-hub/substrate-node-template/blob/master/runtime/Cargo.toml#L21) to see where these are put to use. 

## FRAME v1 Declarative Macros
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
  trait Storage for Module<T: Config> as MyModule {
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

This macro declares and implements the `Store` trait to set up the pallet to have storage space,
and implements getters on the `Module` struct defined by `decl_module!`.

It takes a succinct statement of:

```
#vis #name get(fn #getter) config(#field_name) build(#closure): #type = #default;
```

Replacing it with a new struct type defined by `#name` and have it implement the data type storage
trait.


**Docs and Notes**

- [API Documentation](https://substrate.dev/rustdocs/v3.0.0/frame_support/macro.decl_storage.html)
- `Store` trait is declared with each storage name, thus becoming an associated type inside the
  trait.
- `Module` implementation contains the getter function and metadata of each storage item.
- Each of the storage items becomes a struct.

### decl_event!

**When to Use**

To define the events that a pallet emits.

**What It Does**

This macro defines pallet events by implementing the `Event` enum type, with each event type in the
macro being an enum variant inside `Event`.

**Docs and Notes**

- [API Documentation](https://substrate.dev/rustdocs/v3.0.0/frame_support/macro.decl_event.html)
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

This macro defines the `Error<T: Config>` type, and implements helper methods for mapping each error
type to a sequential error code and corresponding string.

One key feature is that the macro automatically implements the `From<Error<T>>` trait for
`DispatchError`. Therefore, `DispatchError` returns the proper module index, error code, error
string for a particular error type, and the documentation provided on top of each error as metadata.

**Docs and Notes**

- [API Documentation](https://substrate.dev/rustdocs/v3.0.0/frame_support/macro.decl_error.html)
- `Error<T: Config>` enum type is filled with enum variants specified in the macro.
- `Error` implements various helper functions, and maps each error to a sequential error code and an
  error string.
- `Error` type implementation contains a `fn metadata()` function.
- `Error` implements `From<Error<T>>` for `DispatchError`, so the error type can be returned in
  dispatchable functions.

### decl_module!

**When to Use**

To define dispatchable functions in a pallet.

**What It Does**

The macro declares a `Module` struct and `Call` enum type for the containing pallet. It combines the
necessary logics using user-defined dispatchable calls into the two types. In addition to various
helper traits implemented for `Module` and `Call`, e.g. `Copy`, `StructuralEq`, `Debug`, the macro
also inserts lifecycle trait implementations for `Module`, e.g.
`frame_support::traits::OnInitialize`, `frame_support::traits::OnFinalize`,
`frame_support::traits::OnRuntimeUpgrade`, and `frame_support::traits::OffchainWorker`.

**Docs and Notes**

- [API Documentation](https://substrate.dev/rustdocs/v3.0.0/frame_support/macro.decl_module.html)
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

- `Call<T: Config>` implements `frame_support::dispatch::GetDispatchInfo` and
  `frame_support::traits::UnfilteredDispatchable` traits that contain the core logic for dispatching
  calls.
- `Module<T>` implements `frame_support::dispatch::Callable<T>` trait with its associated type
  `Call` assigned to the `Call` enum.
- Each dispatchable function is prepended with internal tracing logic for keeping track of the node
  activities. Developers can set whether to trace for a dispatchable function by specifying its
  interest level.

## FRAME v2 Attribute Macros

This sections covers the updates brought by FRAME v2. Refer to the [structure of a pallet](./pallets.md) for more context.

### #[frame_support::pallet]

**When to Use**

Required to use all other macro traits.

**What It Does**

This is the [attribute macro](https://crates.parity.io/frame_support/attr.pallet.html) that allows the pallet to be used in `construct_runtime!`

### #[pallet::config]

**When to Use** 

Required to define the pallet's generics.

**What it Does**

Provides constants that are part of the [`Config` trait](https://substrate.dev/rustdocs/v3.0.0/frame_system/pallet/trait.Config.html) and gives information about external tools to use for the runtime.

**Docs**
- [Config trait](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#config-trait-palletconfig-mandatory)

### #[pallet::constant]

**When to Use** 

To pass values of associated types to metadata, which allows the value of the type to be used by external tools and third parties.

**What it Does**

This is a constraint trait that provides the `Config` trait with the types and attributes it needs for the runtime and generates associated metadata.

For example, we can use `Get<u32>` without needing to add any imports and #[pallet::constant] will put it in metadata:

```rust
#[pallet::config]
	pub trait Config: frame_system::Config { 
		#[pallet::constant] // puts attributes in metadata
		type MyGetParam: Get<u32>;
```

**Docs**
- See use in the context of [#[pallet::config]](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#config-trait-palletconfig-mandatory)

### #[pallet::extra_constants] 

**When to Use**

Optionally, for additional constants one may want to pass to metadata.

**What it Does**

It allows to define some additional constants to put into metadata. For example, you could declare a function that returns a value that will be generated to metadata: 

```rust
#[pallet::extra_constants]
impl<T: Config> Pallet<T> {
  //Example function using extra_constants
  fn example_extra_constants() -> u128 { 4u128 }
}
```

**Docs**
- See [documentation](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#extra-constants-palletextra_constants-optional)

### #[pallet::pallet]  

**When to Use**

Required.

**What it Does**

This is the equivalent of `decl_module!` in FRAME v1. Instead, it takes the form of a more explicit Rust struct module, using  `PhantomData` to make it generic. It generates the `Store` trait if the attribute is provided, which contains an associated type for each storage.

This is an example of its definition:

```rust
#[pallet::pallet]
#[pallet::generate_store(pub(super) trait Store)]
pub struct Pallet<T>(PhantomData<T>);
```

**Docs**
- See the [macro expansion](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#macro-expansion-1) added to the `struct Pallet<T>` definition

### #[pallet::hooks]

**When to Use**

Required for runtime hooks.

**What it Does**

In `decl_module` we used to declare hooks logic by implementing [each method](https://crates.parity.io/frame_support/traits/trait.Hooks.html#provided-methods). In FRAME V2, `Hooks` are made available by using the `Hooks` trait allowing developers to implement each individual trait.

For example: 

```rust
#[pallet::hooks]
imple<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
  // Hooks functions and logic goes here.
}
```

**Docs**
- See the [documentation](https://crates.parity.io/frame_support/attr.pallet.html#hooks-pallethooks-mandatory)
- See the [macro expansion](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#macro-expansion-2)

### #[pallet::call]

**When to Use**

Required, to implement a pallet's dispatchables. Each dispatchable must:
- define a weight with the #[pallet::weight($expr)] attribute
- have its first argument as `origin: OriginFor<T>`, 
- use compact encoding for argument using #[pallet::compact]
- return `DispatchResultWithPostInfo` or `DispatchResult`

**What it Does**

Similar to `decl_module`, it allows to create dispatchable functions which will generate associated items from the `impl` code blocks. In other words, it aggregates all dispatchable logic using the [`Call` enum](https://substrate.dev/rustdocs/v3.0.0/frame_system/pallet/enum.Call.html) which will aggregate all dispatchable calls into a single runtime call.

**Docs**
- See the [documentation](https://crates.parity.io/frame_support/attr.pallet.html#call-palletcall-mandatory)

### #[pallet::error]

**When to Use**

Optionally, to define errors types from the pallet's dispatchables.

**What it Does**

Puts error types into metadata.

**Docs**
- See [documentation](https://crates.parity.io/frame_support/attr.pallet.html#error-palleterror-optional)

### #[pallet::events]

**When to Use**

Optionally, to define a pallet's event types. 


**What it Does**

It is similar to errors but it holds more types. They generate the metadata of the event and add_derive. It uses the `#[pallet::metadata(..)]` attribute to define what metadata to put from the events.

For example: 
```rust
#[pallet::event]
#[pallet::metadata(u32 = "SpecialU32")]
pub enum Event<T: Config> {
	Proposed(u32, T::AccountId),
}
```

**Docs**
- See [documentation](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#event-palletevent-optional)
### #[pallet::storage]

**When to Use** 

Optionally, as it can be used multiple times.

**What it Does** 

To define some abstract storage inside runtime storage.

**Note:** this changes how storage is declared compared to v1. Here, `[pallet::storage]` is using Rust like storage maps to do storage, such that it can be generic over the pallet. 

**Docs**
- See [documentation](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#storage-palletstorage-optional)
- See Rust docs for [StorageMap](https://docs.rs/storage-map/0.1.2/storage_map/struct.StorageMap.html) and [HashMap syntax](https://doc.rust-lang.org/book/ch08-03-hash-maps.html)

### Others

Other FRAME v2 macro attributes include:
- [#[pallet::genesis_config]](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#genesis-config-palletgenesis_config-optional) which used to be in `decl_storage` in v1. This gives runtime engineers more flexibility to define `genesis_config`.
- [#[pallet::type_value]](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#type-value-pallettype_value-optional)
- [#[pallet::genesis_build]](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#genesis-build-palletgenesis_build-optional)
- [#[pallet::inherent]](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#inherent-palletinherent-optional)
- [#[pallet::validate_unsigned]](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#validate-unsigned-palletvalidate_unsigned-optional)
- [#[pallet::origin]](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#origin-palletorigin-optional)

#### FRAME v1 vs. v2
Things to note:
- Using instantiable pallets with v2 requires a different approach than for v1. See the guide [here](https://substrate.dev/rustdocs/v3.0.0/frame_support/attr.pallet.html#example-for-pallet-with-instance) for more information on how that works.

- In v2, `pub(super)` is used to make things private to the pallet but accessible to the associated namespace. 

- v2 is backwards compatible with v1, however v1 will cease getting improvement features. Storage will remain the same.

- Use [subsee](https://github.com/ascjones/subsee) as a tool to query metadata. 

- `RawEvent` is no longer used in v2, all instances of events are declred as `Event`. 

Here's a brief comparative overview:
- v2 leans more heavily on Rust to define types and uses crates by writing code within the constaints of the macro being used, whereas v1 relies on runtime engineers to write more code to declare traits and types
- v2 macros removes the need to write attributes 

The main difference is how concepts are declared to use the crates that make up FRAME. Both approaches are just a different way to express the logic and types declared inside a pallet, yet both serve the same purpose, which is to aggregate logic together that defines how the runtime is implemented. The big improvements that v2 brings is better developer experienece.

## Additional FRAME Macros
### construct_runtime!

**When to Use**

To construct Substrate runtime and integrating various pallets into the runtime.

**What It Does**

The macro declares and implements various struct and enum, e.g.`Runtime`, `Event`, `Origin`, `Call`,
`GenesisConfig` etc, and implements various helper traits for these struct types. The macro also
adds logics of mapping different events and dispatchable calls from the overarching runtime back to
a particular pallet.

**Docs and Notes**

- [API Documentation](https://substrate.dev/rustdocs/v3.0.0/frame_support/macro.construct_runtime.html)
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

- [API Documentation](https://substrate.dev/rustdocs/v3.0.0/frame_support/macro.parameter_types.html)

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

- [API Documentation](https://substrate.dev/rustdocs/v3.0.0/frame_support/macro.impl_outer_origin.html)

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

- [API Documentation](https://substrate.dev/rustdocs/v3.0.0/frame_support/macro.impl_outer_event.html)

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

- [API Documentation](https://substrate.dev/rustdocs/v3.0.0/frame_support/macro.impl_outer_dispatch.html)

## Substrate Core Macros
### impl_runtime_apis!

**When to Use**

This macro generates the API implementations for the client side through the `RuntimeApi` and
`RuntimeApiImpl` struct type.

**What It Does**

The macro defines the `RuntimeApi` and `RuntimeApiImpl` exposed to the Substrate node client. It
provides implementation details of the RuntimeApiImpl based on the setup and appended user specified
implementation in the `RuntimeApiImpl`.

**Docs Notes**

- [API Documentation](https://substrate.dev/rustdocs/v3.0.0/sp_api/macro.impl_runtime_apis.html)
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

- [API Documentation](https://substrate.dev/rustdocs/v3.0.0/sp_application_crypto/macro.app_crypto.html)
- `Public` struct type is declared, and implements `sp_application_crypto::AppKey` trait defining
  the public key type, and `sp_application_crypto::RuntimeAppPublic` trait for generating keypairs,
  signing, and verifying signatures.
- `Signature` struct type is declared, and implements `core::hash::Hash` trait on how the data with
  this signature type is hashed.
- `Pair` struct type is declared to wrap over the crypto pair. This type implements
  `sp_application_crypto::Pair` and `sp_application_crypto::AppKey` traits determining how it
  generates public-private key pairs from a phrase or seed.

## References

- [The Rust Programming Language ch 19.5 Macros](https://doc.rust-lang.org/book/ch19-06-macros.html)
- [The Little Book of Rust Macros](https://danielkeep.github.io/tlborm/book/index.html)

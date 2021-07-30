---
title: Runtime Storage
---

Runtime storage allows you to store data in your blockchain that is persisted between blocks and can
be accessed from within your runtime logic. Storage should be one of the most critical concerns of a
blockchain runtime developer. Well designed storage systems reduce the load on nodes in the network, which
ultimately lowers the overhead costs for participants in your blockchain. In other words, the fundamental principle of blockchain runtime storage is to minimize its use.

Substrate exposes a set of layered, modular storage APIs that allow runtime developers to make the storage decisions that suit them
best. This
document is intended to provide information and best practices about Substrate's runtime storage
interfaces. Please refer to [the advanced storage documentation](../advanced/storage) for information about how these interfaces are implemented.

## Storage Items

 In Substrate, any pallet can introduce new storage items that will become part of your blockchain’s state. These storage items can be simple single value items, or more complex storage maps. The type of storage items you choose to implement depends entirely on their intended role within your runtime logic.

FRAME's [`Storage pallet`](https://substrate.dev/rustdocs/latest/frame_support/storage/index.html) gives runtime developers access to Substrate's flexible storage APIs, which can support any value that is encodable
by [Parity's SCALE codec](../advanced/codec). These include:

- [Storage Value](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.StorageValue.html) - used to store any single value, such as a `u64`.
- [Storage Map](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.StorageMap.html) - used to store a key-value hash map, such as a balance-to-account mapping.
- [Storage Double Map](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.StorageDoubleMap.html) - used as an implementation of a storage map with two keys to provide the ability to efficiently removing
  all entries that have a common first key.
- [Storage N Map](https://substrate.dev/rusdocs/v3.0.0/frame_support/storage/trait.StorageNMap.html) - used to store a hash map with any arbitrary number of keys, it can be used as a basis to build a Triple Storage Map, a Quadruple Storage Map and so on.

### Storage Value

This type of storage item should be used for values that are viewed as a single unit by the runtime. This could be a single primitive value, a single `struct`, or a single collection of related
items. If a storage item is used for storing lists of items, runtime developers should be conscious about the size of the lists they use.
Large lists incur storage costs just like large `structs`.
Furthermore, iterating over a large list in your runtime may result in exceeding the block production time. If this occurs your blockchain
will stop producing blocks, which means that it will stop functioning.

> **Important consideration:** although wrapping related items in a shared `struct` is an excellent way to reduce the number
> of storage reads, at some point the size of the object will begin to
> incur costs that may outweigh the optimization in storage reads.

Refer to the Storage Value documentation for
[a comprehensive list of the methods that Storage Value exposes](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.StorageValue.html#required-methods).

### Storage Map

Map data structures are ideal for managing sets of items whose elements will be accessed randomly,
as opposed to iterating over them sequentially in their entirety. Storage Maps in Substrate are
implemented as key-value hash maps. In order to give runtime engineers increased control, Substrate allows developers to select
which hashing algorithms suits their use case the best for generating a map's keys. This is covered in the section on [hashing algorithms](#hashing-algorithms).

Refer to the Storage Map documentation for
[a comprehensive list of the methods that Storage Map exposes](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.StorageMap.html#required-methods).

### Double Storage Map

Double Storage Maps are very similar to single Storage Maps except they contain two keys, which is useful for querying values with common keys.

Refer to the documentation on
[advanced storage](../advanced/storage) to learn more about how different Storage Maps, including Double Storage Maps, are implemented.


### N Storage Map

N Storage Maps are also very similar to its siblings, namely Storage Maps and Double Storage Maps, but with the ability to hold any arbitrary number of keys.

To specify the keys in an N Storage Map in FRAMEv2, a tuple containing the special `NMapKey` struct must be provided as a type to the Key (i.e. second) type parameter while declaring the `StorageNMap`.

Refer to the N Storage Map documentation for [more details about the syntaxes in using a N Storage Map](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.StorageNMap.html).

#### Iterating Over Storage Maps

Substrate Storage Maps are iterable with respect to their keys and values. Because maps are often
used to track unbounded sets of data (such as account balances), iterating over them without caution in the runtime may cause blocks not being able to produced in time.
Furthermore, because accessing the elements of a map requires more database reads than accessing the
elements of a native list, map iterations are significantly _more_ costly than list iterations in terms of execution time.

>**A note on best practices**: in general, Substrate focuses on "[first principles](#best-practices)" as opposed to hard and fast rules
>of right and wrong. The information here aims to help you understand _all_ of Substrate's
>storage capabilities and how to use them in a way that respects the principles around which
>they were designed. For instance, iterating over storage maps in your runtime is neither right nor wrong &mdash; yet, avoiding it would be considered a better approach with respect to best practices.

Substrate's Iterable Storage Map interfaces define the following methods (note that for Iterable
Storage Double Maps, the `iter()` and `drain()` methods require the first key as a parameter):

- `iter()` - enumerate all elements in the map in no particular order. If you alter the map while
  doing this, you'll get undefined results. See the docs:
  [`IterableStorageMap`](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.IterableStorageMap.html#tymethod.iter),
  [`IterableStorageDoubleMap`](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.IterableStorageDoubleMap.html#tymethod.iter) and
  [`IterableStorageNMap`](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.IterableStorageNMap.html#tymethod.iter).
- `drain()` - remove all elements from the map and iterate through them in no particular order. If you
  add elements to the map while doing this, you'll get undefined results. See the docs:
  [`IterableStorageMap`](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.IterableStorageMap.html#tymethod.drain),
  [`IterableStorageDoubleMap`](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.IterableStorageDoubleMap.html#tymethod.drain) and
  [`IterableStorageNMap`](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.IterableStorageNMap.html#tymethod.drain).
- `translate()` - use the provided function to translate all elements of the map, in no particular
  order. To remove an element from the map, return `None` from the translation function. See the docs:
  [`IterableStorageMap`](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.IterableStorageMap.html#tymethod.translate),
  [`IterableStorageDoubleMap`](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.IterableStorageDoubleMap.html#tymethod.translate) and
  [`IterableStorageNMap`](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.IterableStorageNMap.html#tymethod.translate).

## Declaring Storage Items

Runtime storage items are created in the [`decl_storage` macro](https://substrate.dev/rustdocs/latest/frame_support/macro.decl_storage.html) in any FRAME-like pallet. Here is an example of declaring the 3 different types of storage items:

```rust
decl_storage! {
    trait Store for Module<T: Config> as Example {
        // A StorageValue item.
        SomePrivateValue: u32;
        pub SomePrimitiveValue get(fn some_primitive_value): u32;
        // A StorageMap item.
        pub SomeMap get(fn some_map): map hasher(blake2_128_concat) T::AccountId => u32;
        // A StorageDoubleMap item.
        pub SomeDoubleMap: double_map hasher(blake2_128_concat) u32, hasher(blake2_128_concat) T::AccountId => u32;
        // A StorageNMap item.
        pub SomeNMap: nmap hasher(blake2_128_concat) u32, hasher(blake2_128_concat) u32, hasher(twox_64_concat) T::AccountId => u32;
    }
}
```
In FRAME v2 syntax, declaring the above storage items would look like:

```rust
#[pallet::storage]
type SomePrivateValue<T> = StorageValue<_, u32, ValueQuery>;

#[pallet::storage]
#[pallet::getter(fn some_primitive_value)]
pub(super) type SomePrimitiveValue<T> = StorageValue<_, u32, ValueQuery>;

#[pallet::storage]
pub(super) type SomeComplexValue<T> = StorageValue<_, T::AccountId, ValueQuery>;

#[pallet::storage]
#[pallet::getter(fn some_map)]
pub(super) type SomeMap<T> = StorageMap<_, Blake2_128Concat, T::AccountId, u32, ValueQuery>;

#[pallet::storage]
pub(super) type SomeDoubleMap<T> = StorageDoubleMap<_, Blake2_128Concat, u32, Blake2_128Concat, T::AccountId, u32, ValueQuery>;

#[pallet::storage]
#[pallet::getter(fn some_nmap)]
pub(super) type SomeNMap<T> = StorageNMap<
    _,
    (
        NMapKey<Blake2_128Concat, u32>,
        NMapKey<Blake2_128Concat, T::AccountId)>,
        NMapKey<Twox64Concat, u32>,
    ),
    u32,
    ValueQuery,
>;
```
Notice that the map's storage items specify [the hashing algorithm](#hashing-algorithms) that will
be used.

### Visibility

In the examples above, all the storage items except `SomePrivateValue` are made public by way of the
`pub` keyword (`pub(super)` in FRAME v2). Blockchain storage is always publicly
[visible from _outside_ of the runtime](#accessing-storage-items); the visibility of Substrate
storage items only impacts whether or not other pallets _within_ the runtime will be able to access
a storage item.

### Getter Methods

The `decl_storage` macro provides an optional `get` extension that can be used to implement a getter
method for a storage item on the module that contains that storage item; the extension takes the
desired name of the getter function as an argument. If you omit this optional extension, you will
still be able to access the storage item's value, but you will not be able to do so by way of a
getter method implemented on the module; instead, you will need to use
[the storage item's `get` method](#methods). 
In FRAME v2, the equivalent extension is derived by the `#[pallet::getter(..)]` macro attribute.
> **Note:** The optional `get` and `getter` extensions only
impact the way that a storage item can be accessed from _within_ Substrate code &mdash; you will always be
able to [query the storage of your runtime](../advanced/storage#Querying-Storage) to get the value
of a storage item.

Here is an example that implements a getter method named `some_value` for a Storage Value named
`SomeValue`. This pallet would now have access to a `Self::some_value()` method in addition to the
`SomeValue::get()` method:

```rust
// In FRAME v1.
decl_storage! {
    trait Store for Module<T: Config> as Example {
        pub SomeValue get(fn some_value): u64;
    }
}

// In FRAME v2.
#[pallet::storage]
#[pallet::getter(fn some_value)]
pub(super) type SomeValue = StorageValue<_, u64, ValueQuery>;
```

### Default Values

Substrate allows you to specify a default value that is returned when a storage item's value is not
set. Although the default value does **not** actually occupy runtime storage, the runtime logic will see this
value during execution.

Here is an example of specifying the default value for all items in a map:

```rust
//In FRAME v1.
decl_storage! {
    trait Store for Module<T: Config> as Example {
        pub SomeMap: map u64 => u64 = 1337;
    }
}

//In FRAME v2.
#[pallet::type_value]
pub(super) fn MyDefaultMap<T: Config>() -> u64 { 1337u64 }
#[pallet::storage]
pub(super) type MyStorage<T> = StorageMap<_, Blake2_128Concat, u64, u64, ValueStorage, MyDefaultMap>;
```

## Accessing Storage Items

Blockchains that are built with Substrate expose a remote procedure call (RPC) server that can be
used to query runtime storage. You can use software libraries like
[Polkadot JS](https://polkadot.js.org/) to easily interact with the RPC server from your code and
access storage items. The Polkadot JS team also maintains
[the Polkadot Apps UI](https://polkadot.js.org/apps), which is a fully-featured web app for
interacting with Substrate-based blockchains, including querying storage.

Refer to
[the advanced storage documentation](../advanced/storage) to learn more about how to query a Substrate key-value database by using the RPC server.

## Hashing Algorithms

A novel feature of Storage Maps in Substrate is that they allow developers to
specify the hashing algorithm that will be used to generate a map's keys. A Rust object that is used
to encapsulate hashing logic is referred to as a "hasher". Broadly speaking, the hashers that are
available to Substrate developers can be described in two ways:
(1) whether or not they are
cryptographic; and
(2) whether or not they produce a transparent output.

For the sake of
completeness, the characteristics of non-transparent hashing algorithms are described below, but
keep in mind that any hasher that does not produce a transparent output has been deprecated for FRAME-based blockchains.

### Cryptographic Hashing Algorithms

Cryptographic hashing algorithms are those that use cryptography to make it challenging to use the
input to the hashing algorithm to influence its output. For example, a cryptographic hashing
algorithm would produce a wide distribution of outputs even if the inputs were the numbers 1
through 10. It is critical to use cryptographic hashing algorithms when users are able to influence
the keys of a Storage Map. Failure to do so creates an attack vector that makes it easy for
malicious actors to degrade the performance of your blockchain network. An example of a map that
should use a cryptographic hash algorithm to generate its keys is a map used to track account
balances. In this case, it is important to use a cryptographic hashing algorithm so that an attacker
cannot bombard your system with many small transfers to sequential account numbers. Without a
cryptographic hash algorithm this would create an imbalanced storage structure that would suffer in
performance.

> **Note:** cryptographic hashing algorithms are more complex and resource-intensive than their
> non-cryptographic counterparts, which is why it is important for runtime engineers to understand their appropriate usages in order to make the best use of the flexibility Substrate provides.

### Transparent Hashing Algorithms

A transparent hashing algorithm is one that makes it easy to discover and verify the input that was
used to generate a given output. In Substrate, hashing algorithms are made transparent by
concatenating the algorithm's input to its output. This makes it trivial for users to retrieve a
key's original unhashed value and verify it if they'd like (by re-hashing it). The creators of
Substrate have **deprecated the use of non-transparent hashers** within FRAME-based runtimes, so
this information is provided primarily for completeness. In fact, it is _necessary_ to use a
transparent hashing algorithm if you would like to access [iterable map](#iterable-storage-maps)
capabilities. Learn more about the capabilities that transparent hashing algorithms expose in the [advanced storage documentation](../advanced/storage#storage-map-keys).

### Common Substrate Hashers

This table lists some common hashers used in Substrate and denotes those that are cryptographic and
those that are transparent:

| Hasher                                                                                     | Cryptographic | Transparent |
| ------------------------------------------------------------------------------------------ | ------------- | ----------- |
| [Blake2 128 Concat](https://substrate.dev/rustdocs/latest/frame_support/struct.Blake2_128Concat.html)   | X             | X           |
| [TwoX 64 Concat](https://substrate.dev/rustdocs/latest/frame_support/struct.Twox64Concat.html)          |               | X           |
| [Identity](https://substrate.dev/rustdocs/latest/frame_support/struct.Identity.html)                    |               | X           |


The Identity hasher encapsulates a hashing algorithm that has an output equal to its input (the
identity function). This type of hasher should only be used when the starting key is already a
cryptographic hash.

## Genesis Configuration

Substrate's runtime storage APIs include capabilities to initialize storage items in the genesis
block of your blockchain. The genesis storage configuration APIs expose a number of mechanisms for
initializing storage, all of which have entry points in the `decl_storage` macro. These mechanisms
all result in the creation of a `GenesisConfig` data type that implements
the [`BuildModuleGenesisStorage` trait](https://substrate.dev/rustdocs/latest/sp_runtime/trait.BuildModuleGenesisStorage.html)
and will be added to the pallet that contains the storage items.
Storage items that are tagged for genesis configuration, such as [`Struct pallet_balances::GenesisConfig`](https://substrate.dev/rustdocs/latest/pallet_balances/pallet/struct.GenesisConfig.html)) for example, will have a corresponding attribute on this
data type.

In order to consume a pallet's genesis configuration capabilities, you must include the
`Config` element when adding the pallet to your runtime.
All the `GenesisConfig` types for the pallets that inform a runtime will be aggregated into a single
`GenesisConfig` type for that runtime, which implements
the [`BuildStorage` trait](https://substrate.dev/rustdocs/latest/sp_runtime/trait.BuildStorage.html). For example, in [`Struct node_template_runtime::GenesisConfig`](https://substrate.dev/rustdocs/latest/node_template_runtime/struct.GenesisConfig.html),
each attribute on this type corresponds to a `GenesisConfig` from the runtime's pallets that have a `Config` element.
Ultimately, the runtime's `GenesisConfig` is exposed by way of
the [`ChainSpec` trait](https://substrate.dev/rustdocs/latest/sc_chain_spec/trait.ChainSpec.html).

For a complete
and concrete example of using Substrate's genesis storage configuration capabilities, refer to the
`decl_storage` macro in
the [Society pallet](https://github.com/paritytech/substrate/blob/master/frame/society/src/lib.rs)
as well as the genesis configuration for the Society pallet's storage in
the [chain specification that ships with the Substrate code base](https://github.com/paritytech/substrate/blob/master/bin/node/cli/src/chain_spec.rs).
Keep reading for more detailed descriptions of these capabilities.

### `config`

When you use the `decl_storage` macro to declare a storage item, you can provide an optional
`config` extension that will add an attribute to the pallet's `GenesisConfig` data type. The value
of this attribute will be used as the initial value of the storage item in your chain's genesis
block. The `config` extension takes a parameter that will determine the name of the attribute on the
`GenesisConfig` data type &mdash; this parameter is optional if the [`get` extension](#getter-methods) is
provided.

Here is an example that demonstrates using the `config` extension with a Storage Value named `MyVal`
to create an attribute named `init_val` on the `GenesisConfig` data type for the Storage Value's
pallet. This attribute is then used in an example that demonstrates using the `GenesisConfig` types
to set the Storage Value's initial value in your chain's genesis block.

In `my_pallet/src/lib.rs`:

```rust
// In FRAME v1.
decl_storage! {
    trait Store for Module<T: Config> as MyPallet {
        pub MyVal get(fn my_val) config(init_val): u64;
    }
}

// In FRAME v2.
#[pallet::genesis_config]
pub struct GenesisConfig<T: Config> {
		pub init_val: u64,
	}	
```

In `chain_spec.rs`:

```rust
GenesisConfig {
    my_pallet: Some(MyPalletConfig {
        init_val: 221u64 + SOME_CONSTANT_VALUE,
    }),
}
```

### `build`

Whereas [the `config` extension](#config) to the `decl_storage` macro allows you to configure a
module's genesis storage state within a chain specification, the `build` extension allows you to
perform this same task within the pallet itself (this gives you access to the pallet's private
functions). Like `config`, the `build` extension accepts a single parameter, but in this case the
parameter is always required and must be a closure, which is essentially a function. The `build`
closure will be invoked with a single parameter whose type will be the pallet's `GenesisConfig` type. This gives you easy access to all the attributes of the `GenesisConfig` type.

The `build` extension can be used with the `config` extension for a single storage item. In this case, the
pallet's `GenesisConfig` type will have an attribute that corresponds to what was set using `config` and
whose value will be set in the chain specification, but it will be the value returned by the `build`
closure that will be used to set the storage item's genesis value.

Here is an example that demonstrates using `build` to set the initial value of a storage item. In
this case, the example involves two storage items: one that represents a list of member account IDs
and another that designates a special member from the list (the prime member). The list of members is
provided by way of the `config` extension and the prime member &mdash; assumed to be the first
element in the list of members &mdash; is set using the `build` extension.

In `my_pallet/src/lib.rs`:

```rust
// In FRAME v1.
decl_storage! {
    trait Store for Module<T: Config> as MyPallet {
        pub Members config(orig_ids): Vec<T::AccountId>;
        pub Prime build(|config: &GenesisConfig<T>| config.orig_ids.first().cloned()): T::AccountId;
    }
}

// In FRAME v2.
#[pallet::genesis_config]
struct GenesisConfig {
    members: Vec<T::AccountId>,
    prime: T::AccountId,
}

#[pallet::genesis_build]
impl<T: Config> GenesisBuild<T> for GenesisConfig {
    fn build(&self) {
        Module::<T>::initialize_members(&config.members);
        SomeStorageItem::<T>::put(self.prime);
  }
}
```
In `chain_spec.rs`:

```rust
GenesisConfig {
    my_pallet: Some(MyPalletConfig {
        orig_ids: LIST_OF_IDS,
    }),
}
```

### `add_extra_genesis`

The `add_extra_genesis` extension to the `decl_storage` macro allows you to define a scope where the
[`config`](#config) and [`build`](#build) extensions can be provided without the need to bind them
to specific storage items. You can use `config` within an `add_extra_genesis` scope to add an
attribute to a pallet's `GenesisConfig` data type that can be used within any `build` closure. The
`build` closures that are defined within an `add_extra_genesis` scope can be used to execute logic
without binding that logic's return value to the value of a particular storage item. This may be
desireable if you wish to invoke a private helper function within your pallet that sets several
storage items, or invoke a function defined in some other pallets included within your pallet.

Here is an example that encapsulates the same use case described above in the example for `build`. In this
case, however, the `add_extra_genesis` extension is used to define a `GenesisConfig` attribute that
is not bound to a particular storage item as well as a `build` closure that will call a private
function on the pallet to set the values of multiple storage items. For the purposes of this
example, the implementation of the private helper function (`initialize_members`) is left to your
imagination.

In `my_pallet/src/lib.rs`:

```rust
// In FRAME v1.
decl_storage! {
    trait Store for Module<T: Config> as MyPallet {
        pub Members: Vec<T::AccountId>;
        pub Prime: T::AccountId;
    }
    add_extra_genesis {
        config(orig_ids): Vec<T::AccountId>;
        build(|config| Module::<T>::initialize_members(&config.members))
    }
}

// In FRAME v2.
#[pallet::genesis_config]
struct GenesisConfig {
    members: Vec<T::AccountId>,
    prime: T::AccountId,
}

#[pallet::genesis_build]
impl<T: Config> GenesisBuild<T> for GenesisConfig {
    fn build(&self) {
        Module::<T>::initialize_members(&config.members);
        SomeStorageItem::<T>::put(self.prime);
  }
}
```

In `chain_spec.rs`:

```rust
GenesisConfig {
    my_pallet: Some(MyPalletConfig {
        orig_ids: LIST_OF_IDS,
    }),
}
```

## Best Practices

Substrate's goal is to provide a flexible framework that allows people to build the blockchain that
suits their needs &mdash; the creators of Substrate tend not to think in terms of "right" or "wrong". Nonetheless, the Substrate codebase adheres to a number of best practices in order to promote the
creation of blockchain networks that are secure, performant, and maintainable in the long-term. The
following sections outline best practices for using Substrate storage and also describe the
important first principles that motivated them.

### What to Store

Remember, the fundamental principle of blockchain runtime storage is to minimize its use. Only
_consensus-critical_ data should be stored in your runtime. When possible, use techniques like
hashing to reduce the amount of data you must store. For instance, many of Substrate's governance
capabilities (e.g.
the Democracy pallet's [`propose` dispatchable](https://substrate.dev/rustdocs/latest/pallet_democracy/enum.Call.html#variant.propose))
allow network participants to vote on the _hash_ of a dispatchable call, which is always bounded in
size, as opposed to the call itself, which may be unbounded in length. This is especially true in
the case of runtime upgrades where the dispatchable call takes an entire runtime Wasm blob as its
parameter. Because these governance mechanisms are implemented _on-chain_, all the information that
is needed to come to consensus on the state of a given proposal must also be stored on-chain - this
includes _what_ is being voted on. However, by binding an on-chain proposal to its hash, Substrate's
governance mechanisms allow this to be done in a way that defers bringing all the data associated
with a proposal on-chain until _after_ it has been approved. This means that storage is not wasted
on proposals that fail. Once a proposal has passed, someone can initiate the actual dispatchable
call (including all its parameters), which will be hashed and compared to the hash in the proposal.
Another common pattern for using hashes to minimize data that is stored on-chain is to store the
pre-image associated with an object in [IPFS](https://ipfs.io/); this means that only the IPFS
location (a hash that is bounded in size) needs to be stored on-chain.

Hashes are only one mechanism that can be used to control the size of runtime storage. An example of
another mechanism is [bounds](#create-bounds).

### Verify First, Write Last

Substrate does not cache state prior to extrinsic dispatch. Instead, it applies changes directly as
they are invoked. If an extrinsic fails, any state changes will persist. Because of this, it is
important not to make any storage mutations until it is certain that all preconditions have been
met. In general, code blocks that may result in mutating storage should be structured as follows:

```rust
{
  // all checks and throwing code go here

  // ** no throwing code below this line **

  // all event emissions & storage writes go here
}
```

Do not use runtime storage to store intermediate or transient data within the context of an
operation that is logically atomic or data that will not be needed if the operation is to fail. This
does not mean that runtime storage should not be used to track the state of ongoing actions that
require multiple atomic operations, as in the case of
[the multi-signature capabilities from the Utility pallet](https://substrate.dev/rustdocs/latest/pallet_utility/enum.Call.html#variant.as_multi).
In this case, runtime storage is used to track the signatories on a dispatchable call even though a
given call may never receive enough signatures to actually be invoked. In this case, each signature
is considered an atomic event in the ongoing multi-signature operation; the data needed to record a
single signature is not stored until after all the preconditions associated with that signature have
been met.

### Create Bounds

Creating bounds on the size of storage items is an extremely effective way to control the use of
runtime storage and one that is used repeatedly throughout the Substrate codebase. In general, any
storage item whose size is determined by user action should have a bound on it.
[The multi-signature capabilities from the Utility pallet](https://substrate.dev/rustdocs/latest/pallet_utility/trait.Config.html#associatedtype.MaxSignatories)
that were described above are one such example. In this case, the list of signatories associated
with a multi-signature operation is provided by the multi-signature participants. Because this
signatory list is [necessary to come to consensus](#what-to-store) on the state of the
multi-signature operation, it must be stored in the runtime. However, in order to give runtime
developers control over how much space in storage these lists may occupy, the Utility pallet
requires users to configure a bound on this number that will be included as a
[precondition](#verify-first-write-last) before anything is written to storage.

## Next Steps

### Learn More

Read [the advanced storage documentation](../advanced/storage).

### Examples

Check out the Substrate Recipes covering various topics on storage:
- [Storage Maps](https://substrate.dev/recipes/storage-maps.html)
- [Caching Storage Calls](https://substrate.dev/recipes/cache.html)
- [Using Vectors](https://substrate.dev/recipes/vec-set.html)
- [Using Maps](https://substrate.dev/recipes/map-set.html)

### References

- Visit the reference docs for the
  [`decl_storage!` macro](https://substrate.dev/rustdocs/latest/frame_support/macro.decl_storage.html) for more
  details about the available storage declarations.
- Visit the reference docs for
  [StorageValue](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.StorageValue.html),
  [StorageMap](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.StorageMap.html),
  [StorageDoubleMap](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.StorageDoubleMap.html) and
  [StorageNMap](https://substrate.dev/rustdocs/latest/frame_support/storage/trait.StorageNMap.html) to
  learn more about their APIs.

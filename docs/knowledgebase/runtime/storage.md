---
title: Runtime Storage
---

Runtime storage allows you to store data in your blockchain that is persisted between blocks and can
be accessed from within your runtime logic. Storage should be one of the most critical concerns of a
blockchain runtime developer. This statement is somewhat self-evident, since one of the primary
objectives of a blockchain is to provide decentralized consensus about the state of the underlying
storage. Furthermore, well designed storage systems reduce the load on nodes in the network, which
will lower the overhead for participants in your blockchain. Substrate exposes a set of layered,
modular storage APIs that allow runtime developers to make the storage decisions that suit them
best. However, the fundamental principle of blockchain runtime storage is to minimize its use. This
document is intended to provide information and best practices about Substrate's runtime storage
interfaces. Please refer to [the advanced storage documentation](../advanced/storage) for more
information about how these interfaces are implemented.

## Storage Items

The `storage` module in [FRAME Support](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/index.html)
gives runtime developers access to Substrate's flexible storage APIs. Any value that can be encoded
by the [Parity SCALE codec](../advanced/codec) is supported by these storage APIs:

- [Storage Value](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.storagevalue.html) - A single
  value
- [Storage Map](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.storagemap.html) - A key-value
  hash map
- [Storage Double Map](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.storagedoublemap.html) -
  An implementation of a map with two keys that provides the important ability to efficiently remove
  all entries that have a common first key

The type of storage item you select should depend on the logical way in which the value will be used
by your runtime.

### Storage Value

This type of storage item should be used for values that are viewed as a single unit by the runtime,
whether that is a single primitive value, a single `struct`, or a single collection of related
items. Although wrapping related items in a shared `struct` is an excellent way to reduce the number
of storage reads (an important consideration), at some point the size of the object will begin to
incur costs that may outweigh the optimization in storage reads. Storage values can be used to store
lists of items, but runtime developers should take care with respect to the size of these lists.
Large lists incur storage costs just like large `structs`. Furthermore, iterating over a large list
in your runtime may result in exceeding the block production time - if this occurs your blockchain
will stop producing blocks, which means that it will stop functioning.

#### Methods

Refer to the Storage Value documentation for
[a comprehensive list of the methods that Storage Values expose](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageValue.html#required-methods).
Some of the most important methods are summarized here:

- [`get()`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageValue.html#tymethod.get) -
  Load the value from storage.
- [`put(val)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageValue.html#tymethod.put) -
  Store the provided value.
- [`mutate(fn)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageValue.html#tymethod.mutate) -
  Mutate the value with the provided function.
- [`take()`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageValue.html#tymethod.take) -
  Load the value and remove it from storage.

### Storage Maps

Map data structures are ideal for managing sets of items whose elements will be accessed randomly,
as opposed to iterating over them sequentially in their entirety. Storage Maps in Substrate are
implemented as key-value hash maps, which is a pattern that should be familiar to most developers.
In order to give blockchain engineers increased control, Substrate allows developers to select
[the hashing algorithm](#hashing-algorithms) that is used to generate a map's keys. Refer to
[the advanced storage documentation](../advanced/storage) to learn more about how Substrate's
Storage Maps are implemented.

#### Methods

[Storage Maps expose an API](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageMap.html#required-methods)
that is similar to that of Storage Values.

- `get` - Load the value associated with the provided key from storage. Docs:
  [`StorageMap#get(key)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageMap.html#tymethod.get),
  [`StorageDoubleMap#get(key1, key2)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageDoubleMap.html#tymethod.get)
- `insert` - Store the provided value by associating it with the given key. Docs:
  [`StorageMap#insert(key, val)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageMap.html#tymethod.insert),
  [`StorageDoubleMap#insert(key1, key2, val)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageDoubleMap.html#tymethod.insert)
- `mutate` - Use the provided function to mutate the value associated with the given key. Docs:
  [`StorageMap#mutate(key, fn)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageMap.html#tymethod.mutate),
  [`StorageDoubleMap#mutate(key1, key2, fn)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageDoubleMap.html#tymethod.mutate)
- `take` - Load the value associated with the given key and remove it from storage. Docs:
  [`StorageMap#take(key)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageMap.html#tymethod.take),
  [`StorageDoubleMap#take(key1, key2)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageDoubleMap.html#tymethod.take)

#### Iterable Storage Maps

Substrate Storage Maps are iterable with respect to their keys and values. Because maps are often
used to track unbounded sets of data (account balances, for example) it is especially likely to
exceed block production time by iterating over maps in their entirety within the runtime.
Furthermore, because accessing the elements of a map requires more database reads than accessing the
elements of a native list, maps are significantly _more_ costly than lists to iterate over with
respect to time. This is not to say that it is "wrong" to iterate over maps in your runtime; in
general Substrate focuses on "[first principles](#best-practices)" as opposed to hard and fast rules
of right and wrong. Being efficient within the runtime of a blockchain is an important first
principle of Substrate and this information is designed to help you understand _all_ of Substrate's
storage capabilities and use them in a way that respects the important first principles around which
they were designed.

##### Iterable Storage Map Methods

Substrate's Iterable Storage Map interfaces define the following methods. Note that for Iterable
Storage Double Maps, the `iter` and `drain` methods require a parameter, i.e. the first key:

- `iter` - Enumerate all elements in the map in no particular order. If you alter the map while
  doing this, you'll get undefined results. Docs:
  [`IterableStorageMap#iter()`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.IterableStorageMap.html#tymethod.iter),
  [`IterableStorageDoubleMap#iter(key1)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.IterableStorageDoubleMap.html#tymethod.iter)
- `drain` - Remove all elements from the map and iterate through them in no particular order. If you
  add elements to the map while doing this, you'll get undefined results. Docs:
  [`IterableStorageMap#drain()`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.IterableStorageMap.html#tymethod.drain),
  [`IterableStorageDoubleMap#drain(key1)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.IterableStorageDoubleMap.html#tymethod.drain)
- `translate` - Use the provided function to translate all elements of the map, in no particular
  order. To remove an element from the map, return `None` from the translation function. Docs:
  [`IterableStorageMap#translate(fn)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.IterableStorageMap.html#tymethod.translate),
  [`IterableStorageDoubleMap#translate(fn)`](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.IterableStorageDoubleMap.html#tymethod.translate)

#### Hashing Algorithms

As mentioned above, a novel feature of Substrate Storage Maps is that they allow developers to
specify the hashing algorithm that will be used to generate a map's keys. A Rust object that is used
to encapsulate hashing logic is referred to as a "hasher". Broadly speaking, the hashers that are
available to Substrate developers can be described in two ways: whether or not they are
cryptographic and whether or not they produce output that is transparent. For the sake of
completeness, the characteristics of non-transparent hashing algorithms are described below, but
keep in mind that any hasher that does not produce transparent output has been deprecated for use
within FRAME-based blockchains.

##### Cryptographic Hashing Algorithms

Cryptographic hashing algorithms are those that use cryptography to make it challenging to use the
input to the hashing algorithm to influence its output. For example, a cryptographic hashing
algorithm would produce a wide distribution of outputs even if the inputs were the numbers 1
through 10. It is critical to use cryptographic hashing algorithms when users are able to influence
the keys of a Storage Map. Failure to do so creates an attack vector that makes it easy for
malicious actors to degrade the performance of your blockchain network. An example of a map that
should use a cryptographic hash algorithm to generate its keys is a map used to track account
balances. In this case, it is important to use a cryptographic hashing algorithm so that an attacker
cannot bombard your system with many small transfers to sequential account numbers; without a
cryptographic hash algorithm this would create an imbalanced storage structure that would suffer in
performance. Cryptographic hashing algorithms are more complex and resource-intensive than their
non-cryptographic counterparts, which is why Substrate allows developers to select when they are
used.

##### Transparent Hashing Algorithms

A transparent hashing algorithm is one that makes it easy to discover and verify the input that was
used to generate a given output. In Substrate, hashing algorithms are made transparent by
concatenating the algorithm's input to its output. This makes it trivial for users to retrieve a
key's original unhashed value and verify it if they'd like (by re-hashing it). The creators of
Substrate have **deprecated the use of non-transparent hashers** within FRAME-based runtimes, so
this information is provided primarily for completeness. In fact, it is _necessary_ to use a
transparent hashing algorithm if you would like to access [iterable map](#iterable-storage-maps)
capabilities. Refer to [the advanced storage documentation](../advanced/storage#storage-map-keys) to
learn more about the important capabilities that transparent hashing algorithms expose.

##### Common Substrate Hashers

This table lists some common hashers used in Substrate and denotes those that are cryptographic and
those that are transparent:

| Hasher                                                                                     | Cryptographic | Transparent |
| ------------------------------------------------------------------------------------------ | ------------- | ----------- |
| [Blake2 128 Concat](https://substrate.dev/rustdocs/v2.0.0/frame_support/struct.Blake2_128Concat.html)   | X             | X           |
| [TwoX 64 Concat](https://substrate.dev/rustdocs/v2.0.0/frame_support/struct.Twox64Concat.html)          |               | X           |
| [Identity](https://substrate.dev/rustdocs/v2.0.0/frame_support/struct.Identity.html)                    |               | X           |


The Identity hasher encapsulates a hashing algorithm that has an output equal to its input (the
identity function). This type of hasher should only be used when the starting key is already a
cryptographic hash.

## Declaring Storage Items

You can use
[the `decl_storage` macro](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.decl_storage.html) to easily
create new runtime storage items. Here is an example of what it looks like to declare each type of
storage item:

```rust
decl_storage! {
    trait Store for Module<T: Trait> as Example {
        SomePrivateValue: u32;
        pub SomePrimitiveValue get(fn some_primitive_value): u32;
        // types can make use of the generic `T: Trait`
        pub SomeComplexValue: T::AccountId;
        pub SomeMap get(fn some_map): map hasher(blake2_128_concat) T::AccountId => u32;
        pub SomeDoubleMap: double_map hasher(blake2_128_concat) u32, hasher(blake2_128_concat) T::AccountId => u32;
    }
}
```

Notice that the map's storage items specify [the hashing algorithm](#hashing-algorithms) that will
be used.

### Visibility

In the example above, all the storage items except `SomePrivateValue` are made public by way of the
`pub` keyword. Blockchain storage is always publicly
[visible from _outside_ of the runtime](#accessing-storage-items); the visibility of Substrate
storage items only impacts whether or not other pallets _within_ the runtime will be able to access
a storage item.

### Getter Methods

The `decl_storage` macro provides an optional `get` extension that can be used to implement a getter
method for a storage item on the module that contains that storage item; the extension takes the
desired name of the getter function as an argument. If you omit this optional extension, you will
still be able to access the storage item's value, but you will not be able to do so by way of a
getter method implemented on the module; instead, you will need to need to use
[the storage item's `get` method](#methods). Keep in mind that the optional `get` extension only
impacts the way that the storage item can be accessed from within Substrate code; you will always be
able to [query the storage of your runtime](../advanced/storage#Querying-Storage) to get the value
of a storage item.

Here is an example that implements a getter method named `some_value` for a Storage Value named
`SomeValue`. This module would now have access to a `Self::some_value()` method in addition to the
`SomeValue::get()` method:

```rust
decl_storage! {
    trait Store for Module<T: Trait> as Example {
        pub SomeValue get(fn some_value): u64;
    }
}
```

### Default Values

Substrate allows you to specify a default value that is returned when a storage item's value is not
set. The default value does **not** actually occupy runtime storage, but runtime logic will see this
value during execution.

Here is an example of specifying the default value for all items in a map:

```rust
decl_storage! {
    trait Store for Module<T: Trait> as Example {
        pub SomeMap: map u64 => u64 = 1337;
    }
}
```

### Genesis Configuration

Substrate's runtime storage APIs include capabilities to initialize storage items in the genesis
block of your blockchain. The genesis storage configuration APIs expose a number of mechanisms for
initializing storage, all of which have entry points in the `decl_storage` macro. These mechanisms
all result in the creation of a `GenesisConfig` data type that implements
[the `BuildModuleGenesisStorage` trait](https://substrate.dev/rustdocs/v2.0.0/sp_runtime/trait.BuildModuleGenesisStorage.html)
and will be added to the module that contains the storage items (e.g.
[`Struct pallet_balances::GenesisConfig`](https://substrate.dev/rustdocs/v2.0.0/pallet_balances/struct.GenesisConfig.html));
storage items that are tagged for genesis configuration will have a corresponding attribute on this
data type. In order to consume a module's genesis configuration capabilities, you must include the
`Config` element when adding the module to your runtime with
[the `construct_runtime` macro](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.construct_runtime.html).
All the `GenesisConfig` types for the modules that inform a runtime will be aggregated into a single
`GenesisConfig` type for that runtime, which implements
[the `BuildStorage` trait](https://substrate.dev/rustdocs/v2.0.0/sp_runtime/trait.BuildStorage.html) (e.g.
[`Struct node_template_runtime::GenesisConfig`](https://substrate.dev/rustdocs/v2.0.0/node_template_runtime/struct.GenesisConfig.html));
each attribute on this type corresponds to a `GenesisConfig` from one of the runtime's modules.
Ultimately, the runtime's `GenesisConfig` is exposed by way of
[the `ChainSpec` trait](https://substrate.dev/rustdocs/v2.0.0/sc_chain_spec/trait.ChainSpec.html). For a complete
and concrete example of using Substrate's genesis storage configuration capabilities, refer to the
`decl_storage` macro in
[the Society pallet](https://github.com/paritytech/substrate/blob/master/frame/society/src/lib.rs)
as well as the genesis configuration for the Society pallet's storage in
[the chain specification that ships with the Substrate code base](https://github.com/paritytech/substrate/blob/master/bin/node/cli/src/chain_spec.rs).
Keep reading for more detailed descriptions of these capabilities.

#### `config`

When you use the `decl_storage` macro to declare a storage item, you can provide an optional
`config` extension that will add an attribute to the pallet's `GenesisConfig` data type; the value
of this attribute will be used as the initial value of the storage item in your chain's genesis
block. The `config` extension takes a parameter that will determine the name of the attribute on the
`GenesisConfig` data type; this parameter is optional if [the `get` extension](#getter-methods) is
provided (the name of the `get` function is used as the attribute's name).

Here is an example that demonstrates using the `config` extension with a Storage Value named `MyVal`
to create an attribute named `init_val` on the `GenesisConfig` data type for the Storage Value's
module. This attribute is then used in an example that demonstrates using the `GenesisConfig` types
to set the Storage Value's initial value in your chain's genesis block.

In `my_module/src/lib.rs`:

```rust
decl_storage! {
    trait Store for Module<T: Trait> as MyModule {
        pub MyVal get(fn my_val) config(init_val): u64;
    }
}
```

In `chain_spec.rs`:

```rust
GenesisConfig {
    my_module: Some(MyModuleConfig {
        init_val: 221u64 + SOME_CONSTANT_VALUE,
    }),
}
```

#### `build`

Whereas [the `config` extension](#config) to the `decl_storage` macro allows you to configure a
module's genesis storage state within a chain specification, the `build` extension allows you to
perform this same task within the module itself (this gives you access to the module's private
functions). Like `config`, the `build` extension accepts a single parameter, but in this case the
parameter is always required and must be a closure, which is essentially a function. The `build`
closure will be invoked with a single parameter whose type will be the pallet's `GenesisConfig` type
(this gives you easy access to all the attributes of the `GenesisConfig` type). You may use the
`build` extension along with the `config` extension for a single storage item; in this case, the
pallet's `GenesisConfig` type will have an attribute that corresponds to what was set using `config`
whose value will be set in the chain specification, but it will be the value returned by the `build`
closure that will be used to set the storage item's genesis value.

Here is an example that demonstrates using `build` to set the initial value of a storage item. In
this case, the example involves two storage items: one that represents a list of member account IDs
and another that designates a special member from the list, the prime member. The list of members is
provided by way of the `config` extension and the prime member, who is assumed to be the first
element in the list of members, is set using the `build` extension.

In `my_module/src/lib.rs`:

```rust
decl_storage! {
    trait Store for Module<T: Trait> as MyModule {
        pub Members config(orig_ids): Vec<T::AccountId>;
        pub Prime build(|config: &GenesisConfig<T>| config.orig_ids.first().cloned()): T::AccountId;
    }
}
```

In `chain_spec.rs`:

```rust
GenesisConfig {
    my_module: Some(MyModuleConfig {
        orig_ids: LIST_OF_IDS,
    }),
}
```

#### `add_extra_genesis`

The `add_extra_genesis` extension to the `decl_storage` macro allows you to define a scope where the
[`config`](#config) and [`build`](#build) extensions can be provided without the need to bind them
to specific storage items. You can use `config` within an `add_extra_genesis` scope to add an
attribute to the pallet's `GenesisConfig` data type that can be used within any `build` closure. The
`build` closures that are defined within an `add_extra_genesis` scope can be used to execute logic
without binding that logic's return value to the value of a particular storage item; this may be
desireable if you wish to invoke a private helper function within your module that sets several
storage items or invoke a function defined on some other module included within your module.

Here is an example that encapsulates the same use case described above in the example for `build`: a
module that maintains a list of member account IDs along with a designated prime member. In this
case, however, the `add_extra_genesis` extension is used to define a `GenesisConfig` attribute that
is not bound to particular storage item as well as a `build` closure that will call a private
function on the module to set the values of multiple storage items. For the purposes of this
example, the implementation of the private helper function (`initialize_members`) is left to your
imagination.

In `my_module/src/lib.rs`:

```js
decl_storage! {
    trait Store for Module<T: Trait> as MyModule {
        pub Members: Vec<T::AccountId>;
        pub Prime: T::AccountId;
    }
    add_extra_genesis {
        config(orig_ids): Vec<T::AccountId>;
        build(|config| Module::<T>::initialize_members(&config.members))
    }
}
```

In `chain_spec.rs`:

```rust
GenesisConfig {
    my_module: Some(MyModuleConfig {
        orig_ids: LIST_OF_IDS,
    }),
}
```

## Accessing Storage Items

Blockchains that are built with Substrate expose a remote procedure call (RPC) server that can be
used to query your blockchain's runtime storage. You can use software libraries like
[Polkadot JS](https://polkadot.js.org/) to easily interact with the RPC server from your code and
access storage items. The Polkadot JS team also maintains
[the Polkadot Apps UI](https://polkadot.js.org/apps), which is a fully-featured web app for
interacting with Substrate-based blockchains, including querying storage. Refer to
[the advanced storage documentation](../advanced/storage) to learn more about how Substrate uses a
key-value database to implement the different kinds of storage items and how to query this database
directly by way of the RPC server.

## Best Practices

Substrate's goal is to provide a flexible framework that allows people to build the blockchain that
suits their needs - the creators of Substrate tend not to think in terms of "right" or "wrong". That
being said, the Substrate codebase adheres to a number of best practices in order to promote the
creation of blockchain networks that are secure, performant, and maintainable in the long-term. The
following sections outline best practices for using Substrate storage and also describe the
important first principles that motivated them.

### What to Store

Remember, the fundamental principle of blockchain runtime storage is to minimize its use. Only
_consensus-critical_ data should be stored in your runtime. When possible, use techniques like
hashing to reduce the amount of data you must store. For instance, many of Substrate's governance
capabilities (e.g.
[the Democracy pallet's `propose` dispatchable](https://substrate.dev/rustdocs/v2.0.0/pallet_democracy/enum.Call.html#variant.propose))
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
[the multi-signature capabilities from the Utility pallet](https://substrate.dev/rustdocs/v2.0.0/pallet_utility/enum.Call.html#variant.as_multi).
In this case, runtime storage is used to track the signatories on a dispatchable call even though a
given call may never receive enough signatures to actually be invoked. In this case, each signature
is considered an atomic event in the ongoing multi-signature operation; the data needed to record a
single signature is not stored until after all the preconditions associated with that signature have
been met.

### Create Bounds

Creating bounds on the size of storage items is an extremely effective way to control the use of
runtime storage and one that is used repeatedly throughout the Substrate codebase. In general, any
storage item whose size is determined by user action should have a bound on it.
[The multi-signature capabilities from the Utility pallet](https://substrate.dev/rustdocs/v2.0.0/pallet_utility/trait.Trait.html#associatedtype.MaxSignatories)
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

Check out
[the Substrate Recipes section on storage](https://substrate.dev/recipes/3-entrees/storage-api/index.html).

### References

- Visit the reference docs for the
  [`decl_storage!` macro](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.decl_storage.html) for more
  details about the available storage declarations.
- Visit the reference docs for
  [StorageValue](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageValue.html),
  [StorageMap](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageMap.html) and
  [StorageDoubleMap](https://substrate.dev/rustdocs/v2.0.0/frame_support/storage/trait.StorageDoubleMap.html) to
  learn more about their APIs.

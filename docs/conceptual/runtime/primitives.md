---
title: Runtime Primitives
---

The Substrate runtime is composed with a set of primitive types that are expected by the rest of the
Substrate framework.

## Core Primitives

The Substrate framework makes minimal assumptions about what your runtime must provide to the other
layers of Substrate. They are mandatory to define and must fulfil a particular interface in order to
work within the Substrate framework.

They are:

- `Block`: essentially just a combination of `Header` and a series of `Extrinsic`s, together with a
  specification of the hashing algorithm to be used.

- `BlockNumber`: a type which encodes the total number of ancestors any valid block has. Typically a
  32-bit quantity.

- `Extrinsic`: a type to represent a single piece of data external to the blockchain that is
  recognized by the blockchain. This typically involves one or more signatures, and some sort of
  encoded instruction (e.g. for transferring ownership of funds or calling into a smart contract).

- `Hash`: a type which encodes a cryptographic digest of some data. Typically just a 256-bit
  quantity.

- `Header`: a type which is representative (cryptographically or otherwise) of all information
  relevant to a block. It includes the parent hash, the storage root and the extrinsics trie root,
  the digest and a block number.

## SRML Primitives

There are an additional set of primitives that are assumed about a runtime built with the Substrate
Runtime Module Library (SRML):

* `Origin`: The aggregated `Origin` type used by dispatchable calls.

* `Call`: The aggregated `Call` type.

* `Index`: Account index (aka nonce) type. This stores the number of previous transactions
  associated with a sender account.

* `Hashing`: The hashing system (algorithm) being used in the runtime (e.g. Blake2).

* `AccountId`: The user account identifier type for the runtime.

* `Lookup`: Converting trait to take a source type and convert to `AccountId`. Used to define the
  type and conversion mechanism for referencing accounts in transactions. It's perfectly reasonable
  for this to be an identity conversion (with the source type being `AccountId`), but other modules
  (e.g. Indices module) may provide more functional/efficient alternatives.

* `Event`: The aggregated event type of the runtime.

* `BlockHashCount`: Maximum number of block number to block hash mappings to keep (oldest pruned
  first).

* `MaximumBlockWeight`: The maximum weight of a block.

* `MaximumBlockLength`: The maximum length of a block (in bytes).

* `AvailableBlockRatio`: The portion of the block that is available to normal transaction. The rest
  can only be used by operational transactions. This can be applied to any resource limit managed by
  the system module, including weight and length.

* `Version`: Get the chain's current version.


## Next Steps

### Learn More

- 

### Examples

- 

### References

- View the [`traits` defined in
  `sr-primitives`](https://substrate.dev/rustdocs/master/sr_primitives/traits/index.html).
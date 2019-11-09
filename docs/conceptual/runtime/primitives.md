---
title: Runtime Primitives
---

The Substrate runtime is composed with a set of primitive types that are expected by the rest of the
Substrate framework.

## Core Primitives

The Substrate framework makes minimal assumptions about what your runtime must provide to the other
layers of Substrate. These Substrate core data types are all required to develop a Substrate
runtime:

- `Block`, essentially just a combination of `Header` and a series of `Extrinsic`s, together with a
  specification of the hashing algorithm to be used.

- `BlockNumber`, a type which encodes the total number of ancestors any valid block has. Typically a
  32-bit quantity.

- `Digest`, basically just a series of `DigestItem`s, this encodes all information that is relevant
  for a light-client to have on hand within the block.

- `DigestItem`, a type which must be able to encode one of a number of "hard-wired" alternatives
  relevant to consensus and change-tracking as well as any number of "soft-coded" variants, relevant
  to specific modules within the runtime.

- `Extrinsic`, a type to represent a single piece of data external to the blockchain that is
  recognized by the blockchain. This typically involves one or more signatures, and some sort of
  encoded instruction (e.g. for transferring ownership of funds or calling into a smart contract).

- `Hash`, a type which encodes a cryptographic digest of some data. Typically just a 256-bit
  quantity.

- `Header`, a type which is representative (cryptographically or otherwise) of all information
  relevant to a block. It includes the parent hash, the storage root and the extrinsics trie root,
  the digest and a block number.

## SRML Primitives

There are an additional set of primitives that are assumed about a runtime built with the Substrate
Runtime Module Library (SRML):



There are several data types that work with the underlying core of Substrate (thus the "Core" data
types). They are mandatory to define and must fulfil a particular interface in order to work within
the Substrate framework.

Each of these data types corresponds to a Rust `trait`. They are:





Generic reference implementations for each of these traits are provided in the
[SRML](overview/glossary.md#srml-substrate-runtime-module-library). Technically these need not be
used, but there are few cases where they are insufficiently generic for a use case.

* What are the core Substrate Runtime primitives?

* What restrictions do these primitives have?

## Next Steps

### Learn More

- 

### Examples

-

### References

- View the [`traits` defined in
  `sr-primitives`](https://substrate.dev/rustdocs/master/sr_primitives/traits/index.html).
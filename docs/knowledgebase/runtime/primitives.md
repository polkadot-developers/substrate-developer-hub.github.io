---
title: Runtime Primitives
---

The Substrate runtime is composed with a set of primitive types that are expected by the rest of the
Substrate framework.

## Core Primitives

The Substrate framework makes minimal assumptions about what your runtime must provide to the other
layers of Substrate. They are mandatory to define and must fulfill a particular interface in order
to work within the Substrate framework.

They are:

- `Hash`: A type which encodes a cryptographic digest of some data. Typically just a 256-bit
  quantity.

- `DigestItem`: A type which must be able to encode one of a number of "hard-wired" alternatives
  relevant to consensus and change-tracking as well as any number of "soft-coded" variants, relevant
  to specific modules within the runtime.

- `Digest`: A series of DigestItems. This encodes all information that is relevant for a
  light-client to have on hand within the block.

- `Extrinsic`: A type to represent a single piece of data external to the blockchain that is
  recognized by the blockchain. This typically involves one or more signatures, and some sort of
  encoded instruction (e.g. for transferring ownership of funds or calling into a smart contract).

- `Header`: A type which is representative (cryptographically or otherwise) of all information
  relevant to a block. It includes the parent hash, the storage root and the extrinsics trie root,
  the digest and a block number.

- `Block`: Essentially just a combination of `Header` and a series of `Extrinsic`s, together with a
  specification of the hashing algorithm to be used.

- `BlockNumber`: A type which encodes the total number of ancestors any valid block has. Typically a
  32-bit quantity.

## FRAME Primitives

There are an additional set of primitives that are assumed about a runtime built with the Substrate
FRAME:

- `Call`: The dispatch type that can be called via an extrinsic.

- `Origin`: Represents where a call came from. For example, a signed message (a transaction), an
  unsigned message (an inherent extrinsic), and a call from the runtime itself (a root call).

- `Index`: An account index (aka nonce) type. This stores the number of previous transactions
  associated with a sender account.

- `Hashing`: The hashing system (algorithm) being used in the runtime (e.g. Blake2).

- `AccountId`: The type used to identify user accounts in the runtime.

- `Event`: The type used for events emitted by the runtime.

- `Version`: A type which represents the version of the runtime.

## Next Steps

### Learn More

- Learn about the [Substrate FRAME](frame).

### Examples

- See how these generic types are implemented
  [in the Substrate node](https://github.com/paritytech/substrate/blob/master/bin/node/runtime/src/lib.rs).

### References

- View the
  [primitive types defined in `node-primitives`](https://substrate.dev/rustdocs/v2.0.0-rc4/node_primitives/index.html).

- View the
  [`traits` defined in `sp-runtime`](https://substrate.dev/rustdocs/v2.0.0-rc4/sp_runtime/traits/index.html)

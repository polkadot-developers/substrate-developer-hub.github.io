---
title: SS58 Address Format
---
SS58 is a simple checksummed encoding designed for Substrate addresses. It is based on Bitcoin's Base-58-check format with a few alterations. SS58 addresses are used in the Substrate node itself and serve as a robust default for custom chains. Other address formats may be used in addition to or instead of SS58. Because different chains have different means of identifying accounts, SS58 is designed to be extensible.

## Basic Format

SS58 addresses are created by performing a [base58 encoding](https://en.wikipedia.org/wiki/Base58) on the concatenation of three fields:

* A chain identifier (42 for Substrate)
* The raw public key bytes (format agnostic)
* A checksum on the first two fields

```
base58encode(
    <chain id>,
    <public key>,
    checksum (
        <chain id>,
        <public key>
    )
)
```
The `base58encode` function is identical to Bitcoin's and IPFS's implementation.

## Chain Identifier

The chain identifier is a one-byte magic number used to specify on which chain the address is intended to be used. The Substrate default is 42, which is intended as a "wildcard" meant to be equally valid on all Substrate-based chains.

For production networks, a network-specific chain identifier may be desirable to help avoid key-reuse and some of the problems it can cause.

TODO citation needed

A few chain identifier values are known to have been used. This list is for convenience and not intended to serve as any kind of registry.

| ID (hex) | ID (decimal) | Description |
| --- | --- | --- |
| 0x00 | 0   | Polkadot |
| 0x01 | 1   | Polkadot (legacy checksum) |
| 0x2A | 42 | Substrate wildcard |
| 0x2B | 43 | Substrate wildcard (legacy checksum) |

## Public Key Formats

The [Ss58Codec](https://crates.parity.io/substrate_primitives/crypto/trait.Ss58Codec.html) itself is designed to handle input data of arbitrary length. Substrate uses 32-byte Ed25519 and Sr25519 public keys.

After being prepended with a 1-byte chain identifier and appended with a 2-byte checksum, the raw data that is to be SS58 encoded will always be 3 bytes longer than the raw public key. That condition is checked when determining an address's validity.

## Checksum Details

The preimage is the concatenation of the following data:

* The constant bytestring `b"SS58PRE"`
* The chain identifier
* The raw public key

The checksum is the first 2 bytes of the [blake2b hash](https://en.wikipedia.org/wiki/BLAKE_(hash_function)) of the the preimage.

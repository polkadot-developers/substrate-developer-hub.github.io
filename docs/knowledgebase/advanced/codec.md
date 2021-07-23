---
title: SCALE Codec
---

The SCALE (Simple Concatenated Aggregate Little-Endian) Codec is a lightweight, efficient, binary
serialization and deserialization codec.

It is designed for high-performance, copy-free encoding and decoding of data in resource-constrained
execution contexts, like the [Substrate runtime](../runtime/). It is not self-describing in any way
and assumes the decoding context has all type knowledge about the encoded data.

## SCALE for Substrate

Substrate uses the [`parity-scale-codec`](https://github.com/paritytech/parity-scale-codec), a Rust
implementation of the SCALE Codec. This library and the SCALE codec are advantageous for Substrate
and blockchain systems because:

- It is lightweight relative to generic serialization frameworks like [serde](https://serde.rs/),
  which add significant boilerplate that can bloat the size of the binary.
- It does not use Rust STD, and thus can compile to Wasm for the Substrate runtime.
- It is built to have great support in Rust for deriving codec logic for new types:
  ```
  #[derive(Encode, Decode)]
  ```

It is important to define the encoding scheme used on Substrate rather than reuse an existing Rust
codec library because this codec needs to be re-implemented on other platforms and languages that
want to support interoperability.

## Codec Definition

Here you will find how the SCALE codec encodes different types.

### Fixed-width Integers

Basic integers are encoded using a fixed-width little-endian (LE) format.

#### Example

- `signed 8-bit integer 69`: `0x45`
- `unsigned 16-bit integer 42`: `0x2a00`
- `unsigned 32-bit integer 16777215`: `0xffffff00`

### Compact/General Integers

A "compact" or general integer encoding is sufficient for encoding large integers (up to 2\*\*536)
and is more efficient at encoding most values than the fixed-width version. (Though for single-byte
values, the fixed-width integer is never worse.)

It is encoded with the two least significant bits denoting the mode:

- `0b00`: single-byte mode; upper six bits are the LE encoding of the value (valid only for values
  of 0-63).
- `0b01`: two-byte mode: upper six bits and the following byte is the LE encoding of the value
  (valid only for values `64-(2**14-1)`).
- `0b10`: four-byte mode: upper six bits and the following three bytes are the LE encoding of the
  value (valid only for values `(2**14)-(2**30-1)`).
- `0b11`: Big-integer mode: The upper six bits are the number of bytes following, less four. The
  value is contained, LE encoded, in the bytes following. The final (most significant) byte must be
  non-zero. Valid only for values `(2**30)-(2**536-1)`.

#### Example

- `unsigned integer 0`: `0x00`
- `unsigned integer 1`: `0x04`
- `unsigned integer 42`: `0xa8`
- `unsigned integer 69`: `0x1501`

Error:

- ~~`0x0100`: Zero encoded in mode 1~~

### Boolean

Boolean values are encoded using the least significant bit of a single byte.

#### Example

- `boolean false`: `0x00`
- `boolean true`: `0x01`

### Options

One or zero values of a particular type. Encoded as:

- `0x00` if it is `None` ("empty" or "null").
- `0x01` followed by the encoded value if it is `Some`.

As an exception, in the case that the type is a boolean, then it is always one byte:

- `0x00` if it is `None` ("empty" or "null").
- `0x01` if it is the `true` value.
- `0x02` if it is the `false` value.

### Results

Results are commonly used enumerations which indicate whether certain operations were successful or
unsuccessful. Encoded as:

- `0x00` if the operation was successful, followed by the encoded value.
- `0x01` if the operation was unsuccessful, followed by the encoded error.

#### Example

```rust
// A custom result type used in a crate.
let Result = std::result::Result<u8, bool>;
```

- `Ok(42)`: `0x002a`
- `Err(false)`: `0x0100`

### Vectors (lists, series, sets)

A collection of same-typed values is encoded, prefixed with a _compact_ encoding of the number of
items, followed by each item's encoding concatenated in turn.

#### Example

Vector of unsigned 16-bit integers:

```
[4, 8, 15, 16, 23, 42]
```

SCALE Bytes:

```
0x18040008000f00100017002a00
```

### Strings

Strings are Vectors containing a valid UTF8 sequence.

### Tuples

A fixed-size series of values, each with a possibly different but predetermined and fixed type. This
is simply the concatenation of each encoded value.

#### Example

Tuple of compact unsigned integer and boolean:

`(3, false)`: `0x0c00`

### Data Structures

For structures, the values are named, but that is irrelevant for the encoding (names are ignored -
only order matters). **All containers store elements consecutively. The order of the elements is not
fixed, depends on the container, and cannot be relied on at decoding.**

This implicitly means that decoding some byte-array into a specified structure that enforces an
order and then re-encoding it could result in a different byte array than the original that was
decoded.

#### Example

Imagine a `SortedVecAsc<u8>` structure that always has byte-elements in ascending order and you have
`[3, 5, 2, 8]`, where the first element is the number of bytes following (i.e. `[3, 5, 2]` would be
invalid).

`SortedVecAsc::from([3, 5, 2, 8])` would decode to `[3, 2, 5, 8]`, which does not match the original
encoding.

### Enumerations (tagged-unions)

A fixed number of variants, each mutually exclusive and potentially implying a further value or
series of values.

Encoded as the first byte identifying the index of the variant that the value is. Any further bytes
are used to encode any data that the variant implies. Thus, no more than 256 variants are supported.

#### Example

```rust
enum IntOrBool {
  Int(u8),
  Bool(bool),
}
```

- `Int(42)`: `0x002a`
- `Bool(true)`: `0x0101`

## Implementations

The Parity SCALE Codec has been implemented in many languages, including a reference implementation
that is written in Rust and maintained by Parity Technologies.

- Rust: [`paritytech/parity-scale-codec`](https://github.com/paritytech/parity-scale-codec)
- Python: [`polkascan/py-scale-codec`](https://github.com/polkascan/py-scale-codec)
- Golang: [`itering/scale.go`](https://github.com/itering/scale.go)
- C++: [`soramitsu/scale`](https://github.com/soramitsu/kagome/tree/master/core/scale)
- JavaScript: [`polkadot-js/api`](https://github.com/polkadot-js/api)
- AssemblyScript: [`LimeChain/as-scale-codec`](https://github.com/LimeChain/as-scale-codec)
- Haskell: [`airalab/hs-web3`](https://github.com/airalab/hs-web3/tree/master/packages/scale)
- Java: [`emeraldpay/polkaj`](https://github.com/emeraldpay/polkaj)
- Ruby: [`itering/scale.rb`](https://github.com/itering/scale.rb)

## References

- Visit the reference docs for the
  [`parity-scale-codec`](https://substrate.dev/rustdocs/latest/parity_scale_codec/index.html).

- Visit the auxiliary encoding section of the
  [Polkadot runtime environment specification](https://github.com/w3f/polkadot-spec/).

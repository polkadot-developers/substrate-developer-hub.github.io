---
title: Runtime Metadata
---

Blockchains that are built on Substrate expose metadata in order to make it easier to interact with
them. This metadata is separated by the different [pallets](pallets) that inform your blockchain.
For each module, the metadata provides information about the [storage items](storage),
[extrinsic calls](../learn-substrate/extrinsics), [events](events), constants, and errors that are
exposed by that module. Substrate automatically generates this metadata for you and makes it
available through RPC calls.

Since the runtime of a Substrate blockchain is an evolving part of the blockchain's state,
blockchain metadata is stored on a per-block basis. Be aware that querying the metadata for an older
block (with an archive node, for example) could result in acquiring out-of-date metadata that is not
compatible with a blockchain's current state.

All examples in this document were taken from block 1,768,321 on Kusama. You can look at the
[full metadata](https://gist.github.com/insipx/db5e49c0160b1f1bd421a3c34fefdf48) before reading the
rest of this document and continue to refer to it as you proceed.

## How to Get the Metadata

There are a number of language-specific libraries that you can use to fetch metadata from a
Substrate node, as well as language-agnostic HTTP and WebSocket APIs.

### Rust

The easiest way to get the metadata is by querying the automatically-generated JSON-RPC function
`state_getMetadata`. This will return a vector of SCALE-encoded bytes. You can decode this using the
[`frame-metadata`](https://substrate.dev/rustdocs/v2.0.0/frame_metadata/index.html) and
[`parity-scale-codec`](https://substrate.dev/rustdocs/v2.0.0/parity_scale_codec/index.html) libraries.

Some helpful libraries like [`substrate-subxt`](https://github.com/paritytech/substrate-subxt) fetch
the metadata and decode them for you. Once decoded, the structure may be serialized into JSON with
[`serde`](https://serde.rs/). If you'd prefer to use the RPC more directly, the
[JSONRPC](https://github.com/paritytech/jsonrpc) and
[jsonrpsee](https://github.com/paritytech/jsonrpsee) Rust libraries provide interfaces to do so.

### Javascript

If you are using Javascript, [`polkadot-js/api`](https://polkadot.js.org/api/) already provides APIs
to interact with a Substrate blockchain, including the
[`getMetadata`](https://polkadot.js.org/api/substrate/rpc.html#getmetadata-at-blockhash-metadata) function.

You can try the following code snippets to fetch the metadata in this
[Substrate UI](https://polkadot.js.org/apps/#/js) page:

```javascript
const { magicNumber, metadata } = await api.rpc.state.getMetadata();

console.log("Magic number: " + magicNumber);
console.log("Metadata: " + metadata.raw);
```

### HTTP & WebSocket APIs

Substrate nodes expose [a JSON-RPC API](https://substrate.dev/rustdocs/v2.0.0/sc_rpc/index.html) that you can
access by way of **HTTP** or **WebSocket** requests. The message to
[request metadata](https://substrate.dev/rustdocs/v2.0.0/sc_rpc/state/struct.StateClient.html#method.metadata)
from a node looks like this:

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "state_getMetadata",
  "params": []
}
```

You can leave `params` empty, or if you want to fetch the metadata for a specific block, provide the
block's hash:

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "state_getMetadata",
  "params": ["0xca15c2f1e1540517697b6b5f2cc6bc0c60876a1a1af604269b7215970798bbed"]
}
```

In the example above, `0xca15c2f1e1540517697b6b5f2cc6bc0c60876a1a1af604269b7215970798bbed` is the
hash of block 1,768,321.

The response has the following format:

```json
{
  "jsonrpc": "2.0",
  "result": "0x6d6574610b7c1853797374656d011853797374656d3c1c4163636f756e7401010230543a3a4163636f756e744964944163...",
  "id": 1
}
```

The `result` field contains the blockchain metadata as a [SCALE-encoded](../advanced/codec)
hexadecimal string. The example above represents the actual value that is returned for block
1,768,321; you can check for yourself by using a WebSocket client to query a node. Continue reading
to learn more about the format of this encoded blob as well as
[its decoded format](https://gist.githubusercontent.com/insipx/db5e49c0160b1f1bd421a3c34fefdf48/raw/2c33ff080bec84f0627610124c732deb30a0adc7/meta_block_1768321.json).

## Metadata Format

This section will briefly review the SCALE-encoded metadata that is represented as a hexadecimal
string before taking a more detailed look at the metadata's decoded format.

### Encoded Metadata Format

The hex blob that is returned by the JSON-RPCs `state_getMetadata` method starts with a hard-coded
magic number, `0x6d657461`, which represents "meta" in plain text. The next piece of data (`0x0b` in
the example above) represents the metadata version; decoding the hexadecimal value `0x0b` yields the
decimal value 11, which is
[the version of the Substrate metadata format](https://substrate.dev/rustdocs/v2.0.0/frame_metadata/enum.RuntimeMetadata.html)
that the result encodes. After the metadata version, the next piece of information encoded in the
result field is the number of pallets that inform the blockchain's runtime; in the example above,
the hexadecimal value `0x7c` represents the decimal number 31, which is SCALE-encoded by taking its
binary representation (`11111` or `0x1F` in hex), shifting it two bits to the left (`1111100`) and
encoding that as hex.

The remaining blob encodes
[the metadata of each pallet](https://substrate.dev/rustdocs/v2.0.0/frame_metadata/struct.ModuleMetadata.html),
which will be reviewed below as well as some
[extrinsic metadata](https://substrate.dev/rustdocs/v2.0.0/frame_metadata/struct.ExtrinsicMetadata.html), which
is mostly out of the scope of this document.

## Decoded Metadata Format

Here is a condensed version of decoded metadata:

```json
{
  "magicNumber": 1635018093,
  "metadata": {
    "V12": {
      "modules": [
        {
          // ...
        },
        {
          // ...
        }
      ],
      "extrinsic": {
        "version": 4,
        "signedExtensions": [
          "CheckSpecVersion",
          "CheckTxVersion",
          "CheckGenesis",
          "CheckMortality",
          "CheckNonce",
          "CheckWeight",
          "ChargeTransactionPayment"
        ]
      }
    } 
  }
}
```

As described above, the integer `1635018093` is a "magic number" that represents "meta" in plain
text. The rest of the metadata has two sections: `modules` and `extrinsic`. The `modules` section
contains information about the runtime's pallets, while the extrinsic section describes the version
of extrinsics that the runtime is using. Different extrinsic versions may have different formats,
especially when considering [signed extrinsics](../learn-substrate/extrinsics).

#### Modules

Here is a condensed example of a single element in the `modules` array:

```json
{
  "name": "System",
  "storage": {
    // ..
  },
  "calls": [
    // ..
  ],
  "events": [
    // ..
  ],
  "constants": [
    // ..
  ],
  "errors": [
    // ..
  ],
  "index": 0
}
```

Every element contains the name of the pallet that it represents, as well as a `storage` object,
`calls` array, `event` array, and `errors` array.

> Note: If `calls` or `event` are empty, they will be represented as `null`; if `constants` or
> `errors` are empty, they will be represented as an empty array.

##### Storage

Here is a condensed example of a single element in the `modules` array that highlights metadata
about the module's storage:

```json
{
  "name": "System",
  "storage": {
    "prefix": "System",
    "items": [
      {
        "name": "Account",
        "modifier": "Default",
        "type": {
          "Map": {
            "hasher": "Blake2_128Concat",
            "key": "AccountId",
            "value": "AccountInfo",
            "linked": false
          }
        },
        "fallback": "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "documentation": [
          " The full account information for a particular account ID."
        ]
      },
      {
        "name": "ExtrinsicCount",
        // ..
      },
      {
        "name": "AllExtrinsicsLen",
        // ..
      }
    ]
  },
  "calls": [/*...*/],
  "events": [/*...*/],
  "constants": [/*...*/],
  "errors": [/*...*/],
  "index": 0
}
```

Every storage item that is defined in a pallet will have a corresponding metadata entry. For
example, the `Account` item is generated from this in `frame-system`:

```rust
decl_storage! {
    trait Store for Module<T: Trait> as System {
        /// The full account information for a particlar account ID.
        pub Account get(fn account):
            map hasher(blake2_128_concat) T::AccountId => AccountInfo<T::Index, T::AccountData>;
    }
}
```

Storage metadata provides blockchain clients with the information that is required to query
[the JSON-RPC's storage function](https://substrate.dev/rustdocs/v2.0.0/sc_rpc/state/struct.StateClient.html#method.storage)
to get information for a specific storage item.

##### Calls

Module metadata includes information about the runtime calls that are defined with the
`decl_module!` macro. For each call, the metadata will include:

- `name`: Name of the function in the module.
- `args`: Arguments in function definition. Includes the name and type of each argument.
- `Documentation`: Documentation of the function.

For example, this comes from the Timestamp pallet:

```rust
decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        // ... snip

        /// Set the current time.
        ///
        /// This call should be invoked exactly once per block. It will panic at the finalization
        /// phase, if this call hasn't been invoked by that time.
        ///
        /// The timestamp should be greater than the previous one by the amount specified by
        /// `MinimumPeriod`.
        ///
        /// The dispatch origin for this call must be `Inherent`.
        #[weight = (
            T::DbWeight::get().reads_writes(2, 1) + 9_000_000,
            DispatchClass::Mandatory
        )]
        fn set(origin, #[compact] now: T::Moment) {
            // ... snip
        }
    }
}
```

This materializes in the metadata as follows:

```json
"calls": [
  {
    "name": "set",
    "args": [
      {
        "name": "now",
        "ty": "Compact<T::Moment>"
      }
    ],
    "documentation": [
      " Set the current time.",
      "",
      " This call should be invoked exactly once per block. It will panic at the finalization",
      " phase, if this call hasn't been invoked by that time.",
      "",
      " The timestamp should be greater than the previous one by the amount specified by",
      " `MinimumPeriod`.",
      "",
      " The dispatch origin for this call must be `Inherent`."
    ]
  }
],
```

##### Events

This metadata snippet is generated from this declaration in `frame-system`:

```rust
decl_event!(
    /// Event for the System module
    pub enum Event<T> where AccountId = <T as Trait>::AccountId {
        /// An extrinsic completed successfully.
        ExtrinsicSuccess(DispatchInfo),
        /// An extrinsic failed.
        ExtrinsicFailed(DispatchError, DispatchInfo),
        // ... snip
    }
)
```

Substrate's metadata would describe these events as follows:

```json
"event": [
  {
    "name": "ExtrinsicSuccess",
    "arguments": [
      "DispatchInfo"
    ],
    "documentation": [
      " An extrinsic completed successfully."
    ]
  },
  {
    "name": "ExtrinsicFailed",
    "arguments": [
      "DispatchError",
      "DispatchInfo"
    ],
    "documentation": [
      " An extrinsic failed."
    ]
  },
],
```

##### Constants

The metadata will include any module constants. From `pallet-babe`:

```rust
decl_module! {
    /// The BABE Pallet
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        /// The number of **slots** that an epoch takes. We couple sessions to
        /// epochs, i.e. we start a new session once the new epoch begins.
        const EpochDuration: u64 = T::EpochDuration::get();

        // ... snip
    }
}
```

The metadata for this constant looks like this:

```json
"constants": [
  {
    "name": "EpochDuration",
    "type": "u64",
    "value": "0x6009000000000000",
    "documentation": [
      " The number of **slots** that an epoch takes. We couple sessions to",
      " epochs, i.e. we start a new session once the new epoch begins."
    ]
  },
  // ...
]
```

The metadata also includes constants defined in the runtime's `lib.rs`. For example, from Kusama:

```rust
parameter_types! {
    pub const EpochDuration: u64 = EPOCH_DURATION_IN_BLOCKS as u64;
}
```

Where `EPOCH_DURATION_IN_BLOCKS` is a constant defined in `runtime/src/constants.rs`.

##### Errors

Metadata will pull all the possible runtime errors from `decl_error!`. For example, from
`frame-system`:

```rust
decl_error! {
    /// Error for the system module
    pub enum Error for Module<T: Trait> {
        /// The name of specification does not match between the current runtime
        /// and the new runtime.
        InvalidSpecName,
        // ... snip
    }
}
```

This will expose the following metadata:

```json
"errors": [
  {
    "name": "InvalidSpecName",
    "documentation": [
      " The name of specification does not match between the current runtime",
      " and the new runtime."
    ]
  },
  // ...
]
```

These are errors that could occur during the submission or execution of an extrinsic. In this case,
the FRAME System pallet is declaring that it may raise the
[the `InvalidSpecName` error](https://substrate.dev/rustdocs/v2.0.0/frame_system/enum.Error.html#variant.InvalidSpecName).

## Next Steps

### Learn More

- [Storage](storage)
- [SCALE](../advanced/codec)
- [Macros](macros)
- [Events](events)
- [Extrinsics](../learn-substrate/extrinsics)

<!--
### Examples
-->

### References

- [Metadata](https://substrate.dev/rustdocs/v2.0.0/frame_metadata/index.html)

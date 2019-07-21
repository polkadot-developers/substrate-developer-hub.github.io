---
title: "The Metadata of Runtime"
---

In blockchain, the logic to process transactions and modify storage is usually called STF (State Transition Function). The more popular name among Substrate developers is runtime. 

Substrate module-based metadata provides an overview of blockchain runtime. It helps external code introspect modules, storage items, dispatchable functions and events.

## SRML Metadata

**[Srml-metadata](https://github.com/paritytech/substrate/tree/master/srml/metadata)** is not a "well-known" component of [SRML](runtime/substrate-runtime-module-library.md), since it doesn't provide additional storage entries, dispatchable functions and events. 

It simply provides the data structure to store the overall runtime's metadata, and related codec to convert between raw data and bytes literal. Substrate framework uses the data format called SCALE (Simple Concatenated Aggregate Little-Endian), refer to [Low-level Data Format](overview/low-level-data-format.md) page for more information. 

The structure of the runtime metadata could be changed in the future since Substrate framework is still in rapid evolvement. Here we are using `RuntimeMetadataV4` with Substrate v1.0 branch.

```rust
pub struct RuntimeMetadataV4 {
    pub modules: DecodeDifferentArray<ModuleMetadata>,
}
```

As you can see, the overall runtime's metadata is an array of module's metadata. These modules includes predefined SRML and your custom runtime modules. Each runtime module is mainly composed by storage entries, dispatchable functions and events.

```rust
pub struct ModuleMetadata {
    pub name: DecodeDifferentStr,
    pub prefix: DecodeDifferent<FnEncode<&'static str>, StringBuf>,
    pub storage: ODFnA<StorageFunctionMetadata>,
    pub calls: ODFnA<FunctionMetadata>,
    pub event: ODFnA<EventMetadata>,
}
```

Let's dig into the detail:
* `name`: a string shows module's name.
* `prefix`: an encodable function that produces store's metadata name.
* `storage`: an array of storage entry's metadata which described in `StorageFunctionMetadata`. 
* `calls`: an array of dispatchable function's metadata which described in `FunctionMetadata`.
* `event`: an array of event's metadata which described in `EventMetadata`.

```rust
// The metadata about one storage entry
pub struct StorageFunctionMetadata {
    // The name of the storage entry
    pub name: DecodeDifferentStr,
    // The storage entry modifier: Optional or Default
    pub modifier: StorageFunctionModifier,
    // The storage entry type: Plain, Map or DoubleMap
    pub ty: StorageFunctionType,
    // The initiated byte value for this entry
    pub default: ByteGetter,
    // The documents of the storage entry
    pub documentation: DecodeDifferentArray<&'static str, StringBuf>,
}

// The metadata about a function
pub struct FunctionMetadata {
    // The name of the function
    pub name: DecodeDifferentStr,
    // The arguments in function's definition, each includes parameter name and type.
    pub arguments: DecodeDifferentArray<FunctionArgumentMetadata>,
    // The documents of the function
    pub documentation: DecodeDifferentArray<&'static str, StringBuf>,
}

// The metadata about an event
pub struct EventMetadata {
    // The name of the event
    pub name: DecodeDifferentStr,
    // The arguments of the event
    pub arguments: DecodeDifferentArray<&'static str, StringBuf>,
    // The documents of the event
    pub documentation: DecodeDifferentArray<&'static str, StringBuf>,
}
```

Substrate framework then prefixes the runtime metadata with a hard coded `u32` for reserved usage, and encodes to `Vec<u8>` blob for transferring.

## How to Use The Metadata

The metadata of runtime is consolidated and encoded automatically when developing runtime modules. There are a few scenarios that the metadata can really help you out:

* You want to interact with a Substrate blockchain, but don't have much idea about what features the blockchain provides.
* Show the available storage entries and dispatchable functions for blockchain users on your GUI.

If you are using **Javascript**,  [polkadot-js/api](https://polkadot.js.org/api/) already provides friendly APIs to interact with Substrate blockchain, includes the function [getMetadata](https://polkadot.js.org/api/METHODS_RPC.html#json-rpc) to fetch the metadata of runtime.
You can try following code snippets to fetch the metadata in this [Substrate UI](https://polkadot.js.org/apps/#/js) page:

```javascript
const { magicNumber, metadata } = await api.rpc.state.getMetadata();

console.log( 'Magic number: ' + magicNumber );
console.log( 'Metadata: ' + metadata.raw );
```

For demo purpose, we will show the metadata only includes `sudo` runtime module in JSON format:

```json
{
    "modules":[
        {
            "name":"sudo",
            "prefix":"Sudo",
            "storage":[
                {
                    "name":"Key",
                    "modifier":"Default",
                    "type":{
                        "PlainType":"AccountId"
                    },
                    "fallback":"0x0000000000000000000000000000000000000000000000000000000000000000",
                    "documentation":[
                        " The `AccountId` of the sudo key."
                    ]
                }
            ],
            "calls":[
                {
                    "name":"sudo",
                    "args":[
                        {
                            "name":"proposal",
                            "type":"Proposal"
                        }
                    ],
                    "documentation":[
                        " Authenticates the sudo key and dispatches a function call with `Root` origin.",
                        "",
                        " The dispatch origin for this call must be _Signed_."
                    ]
                },
                {
                    "name":"set_key",
                    "args":[
                        {
                            "name":"new",
                            "type":"Address"
                        }
                    ],
                    "documentation":[
                        " Authenticates the current sudo key and sets the given AccountId (`new`) as the new sudo key.",
                        "",
                        " The dispatch origin for this call must be _Signed_."
                    ]
                }
            ],
            "events":[
                {
                    "name":"Sudid",
                    "args":[
                        "bool"
                    ],
                    "documentation":[
                        " A sudo just took place."
                    ]
                },
                {
                    "name":"KeyChanged",
                    "args":[
                        "AccountId"
                    ],
                    "documentation":[
                        " The sudoer just switched identity; the old key is supplied."
                    ]
                }
            ]
        }
    ]
}
```

If you are using other languages to build your client, you can easily send **WebSocket message** or **HTTP POST request** to Substrate node endpoint with any existing client. The message or body for `getMetadata` is:

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "state_getMetadata",
  "params": []
}
```

The response looks like following content, but with much more information in `result` field:

```json
{
    "jsonrpc": "2.0",
    "result": "0x6d6574610324187379737......44964244163636f756e74496400",
    "id": 1
}
```

The hexadecimal string in `result` field conforms to SCALE data format. Go to [parity-scale-codec](https://github.com/paritytech/parity-scale-codec) project to learn how to decode the value and get more information about specification and implementations.

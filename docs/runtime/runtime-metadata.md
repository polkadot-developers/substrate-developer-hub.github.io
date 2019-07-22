---
title: "The Metadata of Runtime"
---

The metadata of runtime can really help you out in following scenarios:

* You want to interact with a Substrate blockchain, but don't have much idea about what features the blockchain provides.
* You want to show the available storage entries and dispatchable functions for users who are using the GUI.

Substrate provides module-based metadata to give an overview of your blockchain runtime. It helps external client to introspect modules, storage items, dispatchable functions and events.

## SRML Metadata

In Substrate, runtime metadata is consolidated and encoded automatically when developing runtime modules. The build-in **[srml-metadata](https://substrate.dev/rustdocs/v1.0/srml_metadata/index.html)** doesn't provide any additional storage entries, dispatchable functions or events. It simply provides the data structure to store the metadata of your blockchain runtime, and related codec to convert between raw data and bytes literal in [SCALE (Simple Concatenated Aggregate Little-Endian)](overview/low-level-data-format.md) format.

Before we dive into more detail, let's have a quick look at what information is included in the metadata. For demo purpose, we'll only show the metadata of [srml-sudo](https://substrate.dev/rustdocs/v1.0/srml_sudo/index.html) module in JSON format:

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

As you can see, the metadata of overall runtime is an array of module's metadata. The included modules contain all the dependent SRML and custom runtime modules in your blockchain. 

Now let's walk through each field in module's metadata:

* `name`: the module's name.
* `prefix`: the name of module's store.
* `storage`: all the available storage entries in one module, each storage entry is then composed by:
  * `name`: the storage entry's name.
  * `modifier`: whether the entry is `Optional` or `Default`.
  * `type`: the type of the storage entry, could be `PlainType`, `MapType` or `DoubleMapType`.
  * `documentation`: notes for the entry.
* `calls`: an array of dispatchable functions:
  * `name`: the function's name.
  * `args`: the arguments in function's definition, each includes parameter name and type.
  * `documentation`: notes for the function.
* `event`: all the defined events in a module:
  * `name`: the event's name.
  * `args`: the arguments in the event definition.
  * `documentation`: notes for the event.
  
## Fetch The Metadata

If you are using **Javascript**,  [polkadot-js/api](https://polkadot.js.org/api/) already provides friendly APIs to interact with Substrate blockchain, includes the [getMetadata](https://polkadot.js.org/api/METHODS_RPC.html#json-rpc) function.
You can try following code snippets to fetch the metadata in this [Substrate UI](https://polkadot.js.org/apps/#/js) page:

```javascript
const { magicNumber, metadata } = await api.rpc.state.getMetadata();

console.log( 'Magic number: ' + magicNumber );
console.log( 'Metadata: ' + metadata.raw );
```

If you are using **other languages** to build your client, you can easily send **WebSocket message** or **HTTP POST request** to Substrate node endpoint by using any existing client. The message or body for `getMetadata` is:

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

The hexadecimal string in `result` field wraps the runtime metadata in SCALE format. Go to [Low-level Data Format](overview/low-level-data-format.md) page to learn how to decode the value and get more information about the specification and implementations.

> Notes: The encoded hex-string also wraps the information of metadata version and the hard coded metadata identifier. Check the [code](https://github.com/paritytech/substrate/blob/v1.0/srml/metadata/src/lib.rs#L321) if you are interested.

After decoding, you should be able to see similar metadata in above example.

---
title: "Runtime Metadata"
---

Inspecting a Runtime's Metadata can help you out in the following scenarios:

* You want to interact with a Substrate blockchain, but don't have much idea about what features the blockchain provides.
* You want to show the available storage entries and dispatchable functions for users who are using the GUI.

Substrate provides module-based metadata to give an overview of your blockchain runtime. It helps an external client to introspect each module's, storage items, dispatchable functions, and events.

## SRML Metadata

In Substrate, the runtime metadata is consolidated and encoded automatically when developing runtime modules. The built-in [Metadata module](https://substrate.dev/rustdocs/v1.0/srml_metadata/index.html) doesn't provide any additional storage entries, dispatchable functions or events. It simply provides the data structure to store the metadata of your blockchain runtime, and related codec to convert between raw data and bytes literal in [SCALE (Simple Concatenated Aggregate Little-Endian)](overview/low-level-data-format.md) format.

Before we dive into more detail, let's have a quick look at what information is included in the metadata. For demo purposes, we'll only show metadata of the [Sudo module](https://substrate.dev/rustdocs/v1.0/srml_sudo/index.html) in JSON format:

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
                        " Authenticates the sudo key and dispatches a function call with `Root` origin."
                    ]
                },
                ...
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
                ...
            ]
        }
    ]
}
```

> Here we are using `V4` of the runtime metadata. Go to [its reference document](https://substrate.dev/rustdocs/v1.0/srml_metadata/enum.RuntimeMetadata.html) for more versioning information.

The metadata of an entire runtime is an array of its modules' metadata, including all SRML and custom runtime modules in your blockchain. You can also find [the decoded metadata](https://github.com/polkadot-js/api/blob/master/packages/types/src/Metadata/v4/latest.substrate.v4.json) of all built-in modules in Polkadot-js/api.

Now let's walk through each field in module's metadata:

* `name`: the module's name.
* `prefix`: the name of module's store.
* `storage`: all the available storage entries in the module. Each storage entry is composed of:
  * `name`: the storage entry's name.
  * `modifier`: whether the entry is `Optional` or `Default`.
  * `type`: the type of the storage entry, could be `PlainType`, `MapType` or `DoubleMapType`.
  * `fallback`: the default value if the entry has not been set.
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

If you are using **Javascript**,  [polkadot-js/api](https://polkadot.js.org/api/) already provides friendly APIs to interact with Substrate blockchain, including the [getMetadata](https://polkadot.js.org/api/METHODS_RPC.html#json-rpc) function.
You can try the following code snippets to fetch the metadata in this [Substrate UI](https://polkadot.js.org/apps/#/js) page:

```javascript
const { magicNumber, metadata } = await api.rpc.state.getMetadata();

console.log( 'Magic number: ' + magicNumber );
console.log( 'Metadata: ' + metadata.raw );
```

If you are using **other languages** to build your client, you can easily send a **WebSocket message** or **HTTP POST request** to a Substrate node endpoint by using any existing client. The message or body for `getMetadata` is:

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "state_getMetadata",
  "params": []
}
```

The response looks like following contents, but with much more information in `result` field:

```json
{
    "jsonrpc": "2.0",
    "result": "0x6d65746104241873797374656d1853797374656d012c304163636f756e744e6f6e636501010130543a3a4163636f756e74...",
    "id": 1
}
```

The hexadecimal string in the `result` field wraps the runtime metadata in SCALE format. Go to [Low-level Data Format](overview/low-level-data-format.md) page to learn how to decode different types and get more information about the specification and implementations.

Our hex blob starts with a hard coded magic number `6d657461` which represents *meta* in plain text. The next piece of data shows the version number of the metadata, here we are using `04` to represent version 4. We already mentioned that runtime metadata is composed by available modules. In our case we have 9 modules. After shifting 9 in binary representation two bits to the left, we get `24` in hex to represent the length of the array.

The remaining blob encodes the metadata of each module. Learning more about decoding different types in the [struct](https://substrate.dev/rustdocs/v1.0/srml_metadata/struct.ModuleMetadata.html), please refer to the [reference docs](https://substrate.dev/rustdocs/v1.0/srml_metadata/index.html) and [Low-level Data Format](overview/low-level-data-format.md) page.

After decoding the hex blob successfully, you should be able to see similar metadata in the above example.

---
title: "Substrate Runtime Recipes"
---
[block:callout]
{
  "type": "warning",
  "body": "Substrate is a rapidly evolving project, which means that breaking changes may cause you problems when trying to follow the instructions below. Feel free to [contact us](https://substrate.readme.io/v1.0.0/docs/feedback) with any problems you encounter.",
  "title": "Troubleshooting"
}
[/block]
This page will contain a series of minimal working samples which demonstrate different features and functionalities available to you when developing a custom Substrate runtime.

If you have not followed our tutorial on [creating a custom substrate chain](https://substrate.readme.io/docs/creating-a-custom-substrate-chain), we recommend you do that before working with the samples below.

# Prerequisites
If you do not have `substrate` installed on your machine, run:
[block:code]
{
  "codes": [
    {
      "code": "curl https://getsubstrate.io -sSf | bash",
      "language": "shell"
    }
  ]
}
[/block]
## Create a Substrate Node Template

In this tutorial we will be using the [Polkadot UI](https://github.com/polkadot-js/apps) to interact with our node. To start, create an instance of the `substrate-node-template` using the following command:
[block:code]
{
  "codes": [
    {
      "code": "substrate-node-new substrate-example <name>",
      "language": "shell"
    }
  ]
}
[/block]
To extend the default implementation of the `substrate-node-template`, you will need to modify `substrate-example/runtime/src/lib.rs`.

* Add these two lines after the initial declarations:
[block:code]
{
  "codes": [
    {
      "code": "mod runtime_example;\nimpl runtime_example::Trait for Runtime {}",
      "language": "rust",
      "name": "lib.rs"
    }
  ]
}
[/block]
* Then modify the `construct_runtime!()` macro to include `RuntimeExample` at the end:
[block:code]
{
  "codes": [
    {
      "code": "construct_runtime!(\n\tpub enum Runtime with Log(InternalLog: DigestItem<Hash, Ed25519AuthorityId>) where\n\t\tBlock = Block,\n\t\tNodeBlock = opaque::Block,\n\t\tUncheckedExtrinsic = UncheckedExtrinsic\n\t{\n\t\tSystem: system::{default, Log(ChangesTrieRoot)},\n\t\tTimestamp: timestamp::{Module, Call, Storage, Config<T>, Inherent},\n\t\tConsensus: consensus::{Module, Call, Storage, Config<T>, Log(AuthoritiesChange), Inherent},\n\t\tAura: aura::{Module},\n\t\tIndices: indices,\n\t\tBalances: balances,\n\t\tSudo: sudo,\n\t\tRuntimeExample: runtime_example::{Module, Call, Storage},\n\t}\n);",
      "language": "rust",
      "name": "lib.rs"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "NOTE",
  "body": "We may continue to update this file depending on the needs of our runtime example. However, you should only need to modify these sections, and the examples below should make clear what needs to change."
}
[/block]
Finally, you need to create a new file called `runtime_example.rs` in the same folder as `lib.rs`.

## Updating Your Runtime

You can paste any of the runtime samples below into that `runtime_examples.rs` file and compile the new runtime binaries with:
[block:code]
{
  "codes": [
    {
      "code": "cd substrate-example\ncargo build --release",
      "language": "shell"
    }
  ]
}
[/block]
You should delete the old chain before you start the new one:
[block:code]
{
  "codes": [
    {
      "code": "substrate purge-chain --dev\n./target/release/substrate-example --dev",
      "language": "shell"
    }
  ]
}
[/block]
## Using the Polkadot UI to Interact

To simplify interactions with your custom Substrate runtime, we will take advantage of the [Polkadot JS UI for Substrate](https://polkadot.js.org/apps/next/).

By default, this UI is configured to interact with the public Substrate test-network BBQ Birch. To have it connect to your local node, simply go to:

```
Settings > remote node/endpoint to connect to > Local Node (127.0.0.1:9944)
```

![A picture of the Polkadot UI Settings Tab](https://i.imgur.com/1FpB5aM.png)


If the UI connected successfully, you should be able to go to the **Explorer** tab and see the block production process running.

![A picture of the block production process running in Explorer tab](https://i.imgur.com/TXmM0cB.png)

You can then interact with your custom functions in the **Extrinsics** tab under **runtimeExample**:

![A picture of custom functions appearing in the Extrinsics tab](https://i.imgur.com/JFXSaHw.png)

### Viewing Storage Variables

If you want to check the value of a storage variable that you created, you can go to:

```
Chain State > runtimeExampleStorage > (variable name)
```

From there you should be able to query the state of the variable. It may return `<unknown>` if the value has not been set yet.

![A picture of viewing a storage variable in the Polkadot UI](https://i.imgur.com/JLoWxc3.png)


### Viewing Events

Some runtime examples below generate `Events` when functions are run. You can temporarily view these events in the **Explorer** tab under **recent events** if any get generated.

![A picture of an event getting generated in the Explorer tab](https://i.imgur.com/2jUtBUk.png)

### WASM Runtime Upgrade

Rather than restarting your chain for each update, you can also do an in-place runtime upgrade using the Polkadot UI. If you do this, you will not get runtime messages appearing in your terminal, but you should be able to interact with the chain via the UI just fine. To perform the upgrade, go to:

```
Extrinsics > Upgrade Key > upgrade(new)
```

There, you can select the file icon and upload the wasm file generated when you run `./build.sh`

```
substrate-example/runtime/wasm/target/wasm32-unknown-unknown/release/node_runtime.compact.wasm
```

![A picture of upgrading the Substrate runtime](https://i.imgur.com/rujS3p6.png)


Once the upgrade is finalized, you should be able to refresh the UI and see your updates.


# Recipes

A good general reference for Substrate runtime development can be found in the [`srml/example` source](https://github.com/paritytech/substrate/blob/master/srml/example/src/lib.rs) and the [other SRML modules](https://github.com/paritytech/substrate/blob/master/srml/). The examples below are meant to be minimal working samples of specific features.

## Simple Storage
Create a simple single value storage.
[block:code]
{
  "codes": [
    {
      "code": "use support::{decl_module, decl_storage, StorageValue, dispatch::Result};\n\npub trait Trait: system::Trait {}\n\ndecl_module! {\n  pub struct Module<T: Trait> for enum Call where origin: T::Origin {\n    fn set_value(_origin, value: u32) -> Result {\n      <Value<T>>::put(value);\n      Ok(())\n    }\n  }\n}\n\ndecl_storage! {\n  trait Store for Module<T: Trait> as RuntimeExampleStorage {\n    Value: u32;\n  }\n}",
      "language": "rust",
      "name": "runtime_example.rs"
    }
  ]
}
[/block]
## Account Mapping
Create an account to value mapping in storage.
[block:code]
{
  "codes": [
    {
      "code": "use support::{decl_module, decl_storage, StorageMap, dispatch::Result};\nuse system::ensure_signed;\n\npub trait Trait: system::Trait {}\n\ndecl_module! {\n\tpub struct Module<T: Trait> for enum Call where origin: T::Origin {\n\t\tfn set_account_value(origin, value: u32) -> Result {\n\t\t\tlet sender = ensure_signed(origin)?;\n\t\t\t<Value<T>>::insert(sender.clone(), value);\n\t\t\tOk(())\n\t\t}\n\t}\n}\n\ndecl_storage! {\n\ttrait Store for Module<T: Trait> as RuntimeExampleStorage {\n\t\tValue: map T::AccountId => u32;\n\t}\n}",
      "language": "rust",
      "name": "runtime_example.rs"
    }
  ]
}
[/block]
## Storage Mapping
Create a key/value mapping in storage.
[block:code]
{
  "codes": [
    {
      "code": "use support::{decl_module, decl_storage, StorageMap, dispatch::Result};\n\npub trait Trait: system::Trait {}\n\ndecl_module! {\n\tpub struct Module<T: Trait> for enum Call where origin: T::Origin {\n\t\tfn set_mapping(_origin, key: u32, value: u32) -> Result {\n\t\t\t<Value<T>>::insert(key, value);\n\t\t\tOk(())\n\t\t}\n\t}\n}\n\ndecl_storage! {\n\ttrait Store for Module<T: Trait> as RuntimeExampleStorage {\n\t\tValue: map u32 => u32;\n\t}\n}",
      "language": "rust",
      "name": "runtime_example.rs"
    }
  ]
}
[/block]
## String Storage (as Bytemap)
How to store a string in the runtime using JavaScript to convert the string to hex and back.

Substrate does not directly support Strings. Runtime storage is there to store the state of the business logic on which the runtime operates. It is not to store general data that the UI needs. If you really need to store some arbitrary data into your runtime, you can always create a bytearray (Vec<u8>), however the more logical thing to do is to store a hash to a service like IPFS to then use to fetch data for your UI.
[block:code]
{
  "codes": [
    {
      "code": "use support::{decl_module, decl_storage, ensure, StorageValue, dispatch::Result};\nuse rstd::prelude::*;\n\npub trait Trait: system::Trait {}\n\nconst BYTEARRAY_LIMIT: usize = 500;\n\ndecl_module! {\n  pub struct Module<T: Trait> for enum Call where origin: T::Origin {\n    fn set_value(_origin, value: Vec<u8>) -> Result {\n      ensure!(value.len() <= BYTEARRAY_LIMIT, \"Bytearray is too large\");\n      <Value<T>>::put(value);\n      Ok(())\n    }\n  }\n}\n\ndecl_storage! {\n  trait Store for Module<T: Trait> as RuntimeExampleStorage {\n    Value: Vec<u8>;\n  }\n}",
      "language": "rust",
      "name": "runtime_example.rs"
    }
  ]
}
[/block]
### JavaScript Helper for String Storage

We store the string as a bytearray, which is inputted into the Polkadot UI as a hex string. These helper functions can allow you to convert a string to hex and back right in your browser console.
[block:code]
{
  "codes": [
    {
      "code": "function toHex(s) {\n    var s = unescape(encodeURIComponent(s))\n    var h = '0x'\n    for (var i = 0; i < s.length; i++) {\n        h += s.charCodeAt(i).toString(16)\n    }\n    return h\n}\n\nfunction fromHex(h) {\n    var s = ''\n    for (var i = 0; i < h.length; i+=2) {\n        s += String.fromCharCode(parseInt(h.substr(i, 2), 16))\n    }\n    return decodeURIComponent(escape(s))\n}",
      "language": "javascript"
    }
  ]
}
[/block]
## Adder with Simple Event

A simple adding machine which checks for overflow and emits an event with the result, without using storage.

You will need to modify `lib.rs` for ths example. Add `type Event = Event;` to the trait implementation, remove `Storage`, and add `Event` to `construct_runtime!()` like so:
[block:code]
{
  "codes": [
    {
      "code": "impl runtime_example::Trait for Runtime {\n\ttype Event = Event;\n}\n\n...\nRuntimeExample: runtime_example::{Module, Call, Event},\n...",
      "language": "rust",
      "name": "lib.rs"
    }
  ]
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "use support::{decl_module, decl_storage, decl_event, dispatch::Result};\n\npub trait Trait: system::Trait {\n    type Event: From<Event> + Into<<Self as system::Trait>::Event>;\n}\n\ndecl_module! {\n    pub struct Module<T: Trait> for enum Call where origin: T::Origin {\n        fn deposit_event() = default;\n\n        fn add(_origin, val1: u32, val2: u32) -> Result {\n            let result = match val1.checked_add(val2) {\n                Some(r) => r,\n                None => return Err(\"Addition overflowed\"),\n            };\n            Self::deposit_event(Event::Added(val1, val2, result));\n            Ok(())\n        }\n    }\n}\n\ndecl_event!(\n    pub enum Event {\n        Added(u32, u32, u32),\n    }\n);",
      "language": "rust",
      "name": "runtime_example.rs"
    }
  ]
}
[/block]
## Permissioned Function with Generic Event (OnlyOwner, Ownable)
A basic implementation of a permissioned function which can only be called by the "owner". An event is emitted when the function is successfully run.

You will need to modify `lib.rs` for this example. Add `type Event = Event;` to the trait implementation, and add `Event<T>` to the `construct_runtime()` macro:
[block:code]
{
  "codes": [
    {
      "code": "impl runtime_example::Trait for Runtime {\n\ttype Event = Event;\n}\n\n...\nRuntimeExample: runtime_example::{Module, Call, Storage, Event<T>},\n...",
      "language": "rust",
      "name": "lib.rs"
    }
  ]
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "use support::{decl_module, decl_storage, decl_event, StorageValue, dispatch::Result, ensure};\nuse system::ensure_signed;\n\npub trait Trait: system::Trait {\n    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;\n}\n\ndecl_module! {\n    pub struct Module<T: Trait> for enum Call where origin: T::Origin {\n        fn deposit_event<T>() = default;\n\n        fn init_ownership(origin) -> Result {\n            ensure!(!<Owner<T>>::exists(), \"Owner already exists\");\n            let sender = ensure_signed(origin)?;\n            <Owner<T>>::put(&sender);\n            Self::deposit_event(RawEvent::OwnershipTransferred(sender.clone(), sender));\n            Ok(())\n        }\n\n        fn transfer_ownership(origin, newOwner: T::AccountId) -> Result {\n            let sender = ensure_signed(origin)?;\n            ensure!(sender == Self::owner(), \"This function can only be called by the owner\");\n            <Owner<T>>::put(&newOwner);\n            Self::deposit_event(RawEvent::OwnershipTransferred(sender, newOwner));\n            Ok(())\n        }\n    }\n}\n\ndecl_storage! {\n\ttrait Store for Module<T: Trait> as RuntimeExampleStorage {\n\t\tOwner get(owner): T::AccountId;\n    }\n}\n\ndecl_event!(\n\tpub enum Event<T> where AccountId = <T as system::Trait>::AccountId {\n\t\tOwnershipTransferred(AccountId, AccountId),\n\t}\n);",
      "language": "rust",
      "name": "runtime_example.rs"
    }
  ]
}
[/block]
## Hashing data

Substrate provides in-built support for hashing data with BlakeTwo256 algorithm. This is available as part of the `system` trait. The Hashing type under the system trait exposes a function called `hash`. This function takes a reference of a byte array (`Vec<u8>`) and produces a BlakeTwo256 hash digest of it. 

In the following code snippet, our custom module has a function `get_hash` which takes a `Vec<u8>` parameter `data` and calls the `hash` function on it.
[block:code]
{
  "codes": [
    {
      "code": "use runtime_primitives::traits::Hash;\nuse support::{decl_module, dispatch::Result};\nuse {system::{self}};\n\npub trait Trait: system::Trait {}\n\ndecl_module! {\n  pub struct Module<T: Trait> for enum Call where origin: T::Origin {\n    pub fn get_hash(_origin, data: Vec<u8>) -> Result {\n      let _digest = <<T as system::Trait>::Hashing as Hash>::hash(&data);\n      Ok(())\n    }\n  }\n}\n",
      "language": "rust"
    }
  ]
}
[/block]
## Storing Structs with Generics

A basic runtime which stores custom, nested structs using a combination of Rust primitive types and Substrate specific types via generics. We also show you how to import and use this custom type in both the Polkadot-UI and Substrate-UI.
[block:code]
{
  "codes": [
    {
      "code": "use support::{decl_module, decl_storage, StorageMap, dispatch::Result};\n\npub trait Trait: balances::Trait {}\n\n#[derive(Encode, Decode, Default)]\npub struct Thing <Hash, Balance> {\n    my_num: u32,\n    my_hash: Hash,\n    my_balance: Balance,\n}\n\n#[derive(Encode, Decode, Default)]\npub struct SuperThing <Hash, Balance> {\n    my_super_num: u32,\n    my_thing: Thing<Hash, Balance>,\n}\n\ndecl_module! {\n    pub struct Module<T: Trait> for enum Call where origin: T::Origin {\n        fn set_mapping(_origin, key: u32, num: u32, hash: T::Hash, balance: T::Balance) -> Result {\n            let thing = Thing { \n                            my_num: num, \n                            my_hash: hash, \n                            my_balance: balance\n                        };\n            <Value<T>>::insert(key, thing);\n            Ok(())\n        }\n\n        fn set_super_mapping(_origin, key: u32, super_num: u32, thing_key: u32) -> Result {\n            let thing = Self::value(thing_key);\n            let super_thing = SuperThing { \n                            my_super_num: super_num, \n                            my_thing: thing\n                        };\n            <SuperValue<T>>::insert(key, super_thing);\n            Ok(())\n        }\n    }\n}\n\ndecl_storage! {\n    trait Store for Module<T: Trait> as RuntimeExampleStorage {\n        Value get(value): map u32 => Thing<T::Hash, T::Balance>;\n        SuperValue get(super_value): map u32 => SuperThing<T::Hash, T::Balance>;\n    }\n}",
      "language": "rust"
    }
  ]
}
[/block]
To access the value of this struct via the UI, you will need to import the structure of your new type so that the UI understand how to decode it.

### Polkadot UI
For the Polkadot-UI, you will need to create a JSON file which describes your struct:
[block:callout]
{
  "type": "warning",
  "title": "NOTE",
  "body": "The order of the struct definitions matter here since the UI registers one by one in order."
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "{\n    \"Thing\": {\n        \"my_num\": \"u32\",\n        \"my_hash\": \"Hash\",\n        \"my_balance\": \"Balance\"\n    },\n    \"SuperThing\": {\n        \"my_super_num\": \"u32\",\n        \"my_thing\": \"Thing\"\n    }\n}",
      "language": "json"
    }
  ]
}
[/block]
Then go into the Polkadot UI, and navigate to:

    Settings > developer > additional type definitions (JSON)

Import your JSON file there and press "Save and Reload". If all went well, you should be able to interact with this value just like any other primitive type.

### Substrate UI

For the Substrate UI, you need to take advantage of a registration function provided by the oo7-substrate module: `addCodecTransform()`.

In the console, simply type:
[block:code]
{
  "codes": [
    {
      "code": "addCodecTransform('Thing<Hash,Balance>', { my_num: 'u32', my_hash: 'Hash', my_balance: 'Balance' });\naddCodecTransform('SuperThing<Hash,Balance>', { my_super_num: 'u32', my_thing: 'Thing' });",
      "language": "javascript"
    }
  ]
}
[/block]
You can add these lines in your **app.jsx** `constructor()` function to automatically import these types when the page loads.

## Working with Custom Enums in Polkadot Apps

If you want to register custom Substrate enums in Polkadot Apps, here is a working example.

First, you need to define enums in your Substrate module (Rust):
[block:code]
{
  "codes": [
    {
      "code": "// Example 1: Simple enum\npub enum VoteKind {\n    Approve,\n    Reject,\n    Slash,\n}\n\n// Example 2: Parametrized enum\npub enum ElectionStage<BlockNumber> {\n    Announcing(BlockNumber),\n    Voting(BlockNumber),\n    Revealing(BlockNumber),\n}",
      "language": "rust"
    }
  ]
}
[/block]
Second, registers previous enums in TypeScript code of Polkadot Apps. This code  could be placed somewhere around https://github.com/polkadot-js/apps/blob/master/packages/apps/src/index.tsx#L47 
[block:code]
{
  "codes": [
    {
      "code": "import { BlockNumber } from '@polkadot/types';\nimport { Enum, EnumType } from '@polkadot/types/codec';\n\n// Example 1: Simple enum\n\nclass VoteKind extends Enum {\n  constructor (value?: any) {\n    super([\n      'Approve',\n      'Reject',\n      'Slash'\n    ], value);\n  }\n}\n\ntypeRegistry.register({\n  VoteKind\n});\n\n// Example 2: Parametrized enum\n\nclass Announcing extends BlockNumber { }\nclass Voting extends BlockNumber { }\nclass Revealing extends BlockNumber { }\nclass ElectionStage extends EnumType<Announcing | Voting | Revealing> {\n  constructor(value?: any, index?: number) {\n    super({\n      Announcing,\n      Voting,\n      Revealing\n    }, value, index);\n  }\n}\n\ntypeRegistry.register({\n  Announcing,\n  Voting,\n  Revealing,\n  ElectionStage\n});",
      "language": "javascript"
    }
  ]
}
[/block]

## Print a message

Sometimes we need to print debug messages while building applications. This recipe shows how to print messages for debugging your Substrate runtime code.

You need to include `runtime_io` crate from the Substrate core in order to use IO functions from within the runtime modules.
[block:code]
{
  "codes": [
    {
      "code": "use support::{decl_module, dispatch::Result};\nuse runtime_io;\n\npub trait Trait: system::Trait {}\n\ndecl_module! {\n  pub struct Module<T: Trait> for enum Call where origin: T::Origin {\n    pub fn print_something(_origin) -> Result {\n      // the following line prints a message on the node's terminal/console\n      runtime_io::print(\"Hello World from Substrate Runtime!\");\n      Ok(())\n    }\n  }\n}",
      "language": "rust",
      "name": "runtime_examples.rs"
    }
  ]
}
[/block]
When this function is executed, the message will appear on the terminal where the Substrate node is running. The following screenshot shows the printed message.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/16b213f-Screenshot_from_2019-01-11_16-29-09.png",
        "Screenshot from 2019-01-11 16-29-09.png",
        612,
        92,
        "#35383a"
      ]
    }
  ]
}
[/block]
## Make a Balance Transfer

You can use the `Balances` module to safely transfer funds between two accounts. Note that this module does not use the `Storage` type.
[block:code]
{
  "codes": [
    {
      "code": "use support::{decl_module, dispatch::Result};\nuse system::ensure_signed;\n\npub trait Trait: balances::Trait {}\n\ndecl_module! {\n  pub struct Module<T: Trait> for enum Call where origin: T::Origin {\n    fn transfer_proxy(origin, to: T::AccountId, value: T::Balance) -> Result {\n      let sender = ensure_signed(origin)?;\n      <balances::Module<T>>::make_transfer(&sender, &to, value)?;\n\n      Ok(())\n    }\n  }\n}",
      "language": "rust"
    }
  ]
}
[/block]
---
title: "Substrate Runtime Recipes"
---


This page contains a some minimal working samples which demonstrate different features and functionalities available when developing a custom Substrate runtime.

This content is also hosted at [https://substrate.recipes/](https://substrate.recipes/).

## Prerequisites
If you do not have `substrate` installed on your machine yet, check out the [installation instructions](../quickstart/installing-substrate). For this tutorial you will probably want the fast installation.
```bash
curl https://getsubstrate.io -sSf | bash
```

### Create a Substrate Node Template

In this tutorial we will be using the [Polkadot UI](https://github.com/polkadot-js/apps) to interact with our node. To start, create an instance of the `substrate-node-template` using the following command:

```bash
substrate-node-new substrate-example <name>
```

To extend the default implementation of the `substrate-node-template`, you will need to modify `substrate-example/runtime/src/lib.rs`.

* Add these two lines after the initial declarations:
```bash
mod runtime_example
impl runtime_example::Trait for Runtime {}
```

* Then modify the `construct_runtime!()` macro to include `RuntimeExample` at the end:

```bash
construct_runtime!(
    pub enum Runtime with Log(InternalLog: DigestItem<Hash, Ed25519AuthorityId>) where
        Block = Block,
        NodeBlock = opaque::Block,
        UncheckedExtrinsic = UncheckedExtrinsic
    {
        System: system::{default, Log(ChangesTrieRoot)},
        Timestamp: timestamp::{Module, Call, Storage, Config<T>, Inherent},
        Consensus: consensus::{Module, Call, Storage, Config<T>, Log(AuthoritiesChange), Inherent},
        Aura: aura::{Module},
        Indices: indices,
        Balances: balances,
        Sudo: sudo,
        RuntimeExample: runtime_example::{Module, Call, Storage},
    }
);
```

> We may continue to update this file depending on the needs of our runtime example. However, you should only need to modify these sections, and the examples below should make clear what needs to change.

Finally, you need to create a new file called `runtime_example.rs` in the same folder as `lib.rs`.

### Updating Your Runtime

You can paste any of the runtime samples below into that `runtime_examples.rs` file and compile the new runtime binaries with:

```bash
cd substrate-example
cargo build --release
```

You should delete the old chain before you start the new one:
```bash
substrate purge-chain --dev
./target/release/substrate-example --dev
```

### Using the Polkadot UI to Interact

To simplify interactions with your custom Substrate runtime, we will take advantage of the [Polkadot JS UI for Substrate](https://polkadot.js.org/apps/next/).

By default, this UI is configured to interact with the public Substrate test-network BBQ Birch. To have it connect to your local node, simply go to:

```plaintext
Settings > remote node/endpoint to connect to > Local Node (127.0.0.1:9944)
```

![Polkadot UI Settings Tab](https://i.imgur.com/1FpB5aM.png)


If the UI connected successfully, you should be able to go to the **Explorer** tab and see the block production process running.

![Block production process running in Explorer tab](https://i.imgur.com/TXmM0cB.png)

You can then interact with your custom functions in the **Extrinsics** tab under **runtimeExample**:

![Custom functions appearing in the Extrinsics tab](https://i.imgur.com/JFXSaHw.png)

#### Viewing Storage Variables

If you want to check the value of a storage variable that you created, you can go to:

```plaintext
Chain State > runtimeExampleStorage > (variable name)
```

From there you should be able to query the state of the variable. It may return `<unknown>` if the value has not been set yet.

![Viewing a storage variable in the Polkadot UI](https://i.imgur.com/JLoWxc3.png)


#### Viewing Events

Some runtime examples below generate `Events` when functions are run. You can temporarily view these events in the **Explorer** tab under **recent events** if any get generated.

![An event getting generated in the Explorer tab](https://i.imgur.com/2jUtBUk.png)

#### WASM Runtime Upgrade

Rather than restarting your chain for each update, you can also do an in-place runtime upgrade using the Polkadot UI. If you do this, you will not get runtime messages appearing in your terminal, but you should be able to interact with the chain via the UI just fine. To perform the upgrade, go to:

```plaintext
Extrinsics > Upgrade Key > upgrade(new)
```

There, you can select the file icon and upload the wasm file generated when you run `./build.sh`

```plaintext
substrate-example/runtime/wasm/target/wasm32-unknown-unknown/release/node_runtime.compact.wasm
```

![Upgrading the Substrate runtime](https://i.imgur.com/rujS3p6.png)


Once the upgrade is finalized, you should be able to refresh the UI and see your updates.


## Recipes

A good general reference for Substrate runtime development can be found in the [`srml/example` source](https://github.com/paritytech/substrate/blob/master/srml/example/src/lib.rs) and the [other SRML modules](https://github.com/paritytech/substrate/blob/master/srml/). The examples below are meant to be minimal working samples of specific features.

### Simple Storage
Create a simple single value storage.

```rust
use support::{decl_module, decl_storage, StorageValue, dispatch::Result};

pub trait Trait: system::Trait {}

decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    fn set_value(_origin, value: u32) -> Result {
      <Value<T>>::put(value);
      Ok(())
    }
  }
}

decl_storage! {
  trait Store for Module<T: Trait> as RuntimeExampleStorage {
    Value: u32;
  }
}
```

### Account Mapping
Create an account to value mapping in storage.

```rust
use support::{decl_module, decl_storage, StorageMap, dispatch::Result};
use system::ensure_signed;

pub trait Trait: system::Trait {}

decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        fn set_account_value(origin, value: u32) -> Result {
            let sender = ensure_signed(origin)?;
            <Value<T>>::insert(sender.clone(), value);
            Ok(())
        }
    }
}

decl_storage! {
    trait Store for Module<T: Trait> as RuntimeExampleStorage {
        Value: map T::AccountId => u32;
    }
}
```

### Storage Mapping
Create a key/value mapping in storage.

```rust
use support::{decl_module, decl_storage, StorageMap, dispatch::Result};

pub trait Trait: system::Trait {}

decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        fn set_mapping(_origin, key: u32, value: u32) -> Result {
            <Value<T>>::insert(key, value);
            Ok(())
        }
    }
}

decl_storage! {
    trait Store for Module<T: Trait> as RuntimeExampleStorage {
        Value: map u32 => u32;
    }
}
```

### Simple Token Transfer <a name = "ex"></a>

If we want to implement a simple token transfer with Substrate, we need to:

1. Set total supply
2. Establish ownership upon configuration of circulating tokens
3. Coordinate token transfers with our runtime functions

```rust
decl_storage! {
  trait Store for Module<T: Trait> as Template {
    pub TotalSupply get(total_supply): u64 = 21000000; // (1)

    pub BalanceOf get(balance_of): map T::AccountId => u64; // (3)

    Init get(is_init): bool; // (2)
  }
}
```

We should also set an event for when token transfers occur to notify clients:

```rust
decl_event!(
    pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
        // event for transfer of tokens
        // from, to, value
        Transfer(AccountId, AccountId, u64),
    }
);
```

To integrate this logic into our module, we could write the following code:

```rust
decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
      // initialize default event handling for this module
      fn deposit_event<T>() = default;

      // initialize the token
      // transfers the total_supply amount to the caller
      fn init(origin) -> Result {
        let sender = ensure_signed(origin)?;
        ensure!(Self::is_init() == false, "Already initialized.");

        <BalanceOf<T>>::insert(sender, Self::total_supply());

        <Init<T>>::put(true);

        Ok(())
      }

      // transfer tokens from one account to another
      fn transfer(origin, to: T::AccountId, value: u64) -> Result {
        let sender = ensure_signed(origin)?;
        let sender_balance = Self::balance_of(sender.clone());
        ensure!(sender_balance >= value, "Not enough balance.");

        let updated_from_balance = sender_balance.checked_sub(value).ok_or("overflow in calculating balance")?;
        let receiver_balance = Self::balance_of(to.clone());
        let updated_to_balance = receiver_balance.checked_add(value).ok_or("overflow in calculating balance")?;

        // reduce sender's balance
        <BalanceOf<T>>::insert(sender.clone(), updated_from_balance);

        // increase receiver's balance
        <BalanceOf<T>>::insert(to.clone(), updated_to_balance);

        Self::deposit_event(RawEvent::Transfer(sender, to, value));

        Ok(())
      }
  }
}
```

See the [full code](https://github.com/gautamdhameja/substrate-demo/blob/master/runtime/src/template.rs) from this example.

### Adding/Removing Elements in an Unbounded List

If the size of our list is not relevant to how we access data, the implementation is straightforward.

For example, let's say that we have a list of `proposal`s (defined as a struct in our runtime). When a `proposal` expires, we remove it from our list, but it is not necessary to update the indices of other `proposal`s that have been added (*if* we perform checks that a proposal exists in the map before accessing it).

We can store our `proposal`s in a key-value mapping similar to the initial example:

```rust
#[cfg_attr(feature = "std", derive(Serialize, Deserialize, Debug))]
#[derive(Encode, Decode, Clone, PartialEq, Eq)]
struct Proposal<Hash> {
    details: Hash,
}

decl_storage! {
    trait Store for Module<T: Trait> as Example {
        Proposals get(proposals): map u32 => Proposal<T::Hash>;
        LargestIndex get(largest_index): u32;
    }
}
```

To add a `proposal`, we would increment the `largest_index` and add a `proposal` at that index:

```rust
decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        // other methods

        fn add_proposal(hash: Hash) -> Result {
            // any necessary checks here

            // instantiate new proposal
            let prop = Proposal { details: hash.clone() };

            // increment largest index
            <LargestIndex<T>>::mutate(|count| count + 1);

            // add a proposal at largest_index
            let largest_index = Self::largest_index::get();
            <Proposals<T>>::insert(largest_index, prop);

            Ok(())
        }
    }
}
```

To remove a `proposal`, we can simple invoke the `remove` method for the `StorageMap` type at the relevant index. In this case, we do not need to update the indices of other `proposal`s. This is because order does not matter for this sample.

```rust
decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        // other methods

        fn remove_proposal(index: u32) -> Result {
            // any necessary checks here

            // remove proposal at the given index
            <Proposals<T>>::remove(index);

            Ok(())
        }
    }
}
```

Because we are not updating the indices of other `proposal`s in our map, we have to check that a proposal exists before removing it, mutating it, or performing any other relevant operation.

```rust
// index is the `u32` that corresponds to the proposal in the `<Proposals<T>>` map
ensure!(<Proposals<T>>::exists(index), "proposal does not exist at the provided index");
```

For a more extensive and complete example of this pattern, see [SunshineDAO](https://github.com/AmarRSingh/SunshineDAO/runtime/src/dao.rs).

### Swap and Pop for Ordered Lists

When we want to preserve storage such that our list doesn't continue growing even after we remove elements, we can invoke the **swap and pop** method:

1. Swap the element to be removed with the element at the head of our *list* (the element with the highest index in our map).
2. Remove the element recently placed at the highest index.
3. Decrement the `LargestIndex` value.

Continuing with our example, we maintain the same logic for adding proposals (increment `LargestIndex` and insert entry at the head of our *list*).  However, we invoke the *swap and pop* algorithm when removing elements from our list:

```rust
decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        // other methods

        fn remove_proposal(index: u32) -> Result {
            // check that a proposal exists at the given index
            ensure!(<Proposals<T>>::exists(index), "A proposal does not exist at this index");

            let largest_index = Self::largest_index::get();
            let proposal_to_remove = <Proposals<T>>::take(index);
            // swap
            if index != largest_index {
                let temp = <Proposals<T>>::take(largest_index);
                <Proposals<T>>::insert(index, temp);
                <Proposals<T>>::insert(largest_index, proposal_to_remove);
            }
            // pop
            <Proposals<T>>::remove(largest_index);
            <LargestIndex<T>>::mutate(|count| count - 1);

            Ok(())
        }
    }
}
```

### Linked Map

To trade performance for simpler code, utilize the `linked_map` data structure. By implementing [`EnumarableStorageMap`](https://crates.parity.io/srml_support/storage/trait.EnumerableStorageMap.html) in addition to [`StorageMap`](https://crates.parity.io/srml_support/storage/trait.StorageMap.html), `linked_map` provides a method `head` that yields the head of the *list*, thereby making it unnecessary to also store the `LargestIndex`. The `enumerate` method also returns an `Iterator` ordered according to when (key, value) pairs were inserted into the map.

To use `linked_map`, we also need to import `EnumerableStorageMap`. Here is the new declaration in the `decl_storage` block:

```rust
use support::{StorageMap, EnumerableStorageMap}; // no StorageValue necessary

decl_storage! {
    trait Store for Module<T: Trait> as Example {
        Proposals get(proposals): linked_map u32 => Proposal<T::Hash>;
        // no largest_index value necessary
    }
}
```

Here is our new `remove_proposal` method:

```rust
decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        // other methods

        fn remove_proposal(index: u32) -> Result {
            // check that a proposal exists at the given index
            ensure!(<Proposals<T>>::exists(index), "A proposal does not exist at this index");

            let head_index = Self::proposals::head();
            let proposal_to_remove = <Proposals<T>>::take(index);
            <Proposals<T>>::insert(index, <Proposals<T>>::get(head_index));
            <Proposals<T>>::remove(head_index);

            Ok(())
        }
    }
}
```

The only caveat is that this implementation incurs some performance costs (vs. solely using `StorageMap` and `StorageValue`) because `linked_map` heap allocates the entire map as an iterator in order to implement the [`enumerate` method](https://crates.parity.io/srml_support/storage/trait.EnumerableStorageMap.html#tymethod.enumerate).

### Higher Order Arrays with Tuples and Maps

To represent ownership of multiple items across multiple users, tuples can be used alongside maps in order to emulate arrays.

For example, consider a scenario in which persistent storage keeps track of a *social network graph* in which each user (represented by an `AccountId`) has a list of other friends. In this case, it would be convenient to use a 2 dimensional array like:

```rust
SocialNetwork[AccountId][Index] -> AccountId
```

With this data structure, we could see how many friends a given `AccountId` has by calling:

```rust
SocialNetwork[AccountId].length()
```

To emulate this data structure in the context of the Substrate runtime storage, we can use tuples and maps (declared in a `decl_storage!{}` block like previous examples):

```rust
SocialNetwork get(my_friend): map (T::AccountId, u32) => T::AccountId;
SocialNetwork get(friends_count): map T::AccountId => u32;
```

Patterns that use mappings to emulate higher order data structures are common when managing runtime storage on Substrate. To see this pattern in action, check out [the Substratekitties Collectables Tutorial](https://shawntabrizi.github.io/substrate-collectables-workshop/#/2/owning-multiple-kitties?id=using-tuples-to-emulate-higher-order-arrays).

### String Storage (as Bytemap)

How to store a string in the runtime using JavaScript to convert the string to hex and back.

Substrate does not directly support Strings. Runtime storage is there to store the state of the business logic on which the runtime operates. It is not to store general data that the UI needs. If you really need to store some arbitrary data into your runtime, you can always create a bytearray (Vec<u8>), however the more logical thing to do is to store a hash to a service like IPFS to then use to fetch data for your UI.

```rust
use support::{decl_module, decl_storage, ensure, StorageValue, dispatch::Result};
use rstd::prelude::*;

pub trait Trait: system::Trait {}

const BYTEARRAY_LIMIT: usize = 500;

decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    fn set_value(_origin, value: Vec<u8>) -> Result {
      ensure!(value.len() <= BYTEARRAY_LIMIT, Bytearray is too large);
      <Value<T>>::put(value);
      Ok(())
    }
  }
}

decl_storage! {
  trait Store for Module<T: Trait> as RuntimeExampleStorage {
    Value: Vec<u8>;
  }
}
```

#### JavaScript Helper for String Storage

We store the string as a bytearray, which is inputted into the Polkadot UI as a hex string. These helper functions can allow you to convert a string to hex and back right in your browser console.

```javascript
function toHex(s) {
    var s = unescape(encodeURIComponent(s))
    var h = '0x'
    for (var i = 0; i < s.length; i++) {
        h += s.charCodeAt(i).toString(16)
    }
    return h
}

function fromHex(h) {
    var s = ''
    for (var i = 0; i < h.length; i+=2) {
        s += String.fromCharCode(parseInt(h.substr(i, 2), 16))
    }
    return decodeURIComponent(escape(s))
}
```
### Adder with Simple Event

A simple adding machine which checks for overflow and emits an event with the result, without using storage.

You will need to modify `lib.rs` for this example. Add `type Event = Event;` to the trait implementation, remove `Storage`, and add `Event` to `construct_runtime!()` like so:

```rust
impl runtime_example::Trait for Runtime {
    type Event = Event;
}

...
RuntimeExample: runtime_example::{Module, Call, Event},
...
```

```rust
use support::{decl_module, decl_storage, decl_event, dispatch::Result};

pub trait Trait: system::Trait {
    type Event: From<Event> + Into<<Self as system::Trait>::Event>;
}

decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        fn deposit_event() = default;

        fn add(_origin, val1: u32, val2: u32) -> Result {
            let result = match val1.checked_add(val2) {
                Some(r) => r,
                None => return Err(Addition overflowed),
            };
            Self::deposit_event(Event::Added(val1, val2, result));
            Ok(())
        }
    }
}

decl_event!(
    pub enum Event {
        Added(u32, u32, u32),
    }
);
```

### Permissioned Function with Generic Event (OnlyOwner, Ownable)
A basic implementation of a permissioned function which can only be called by the "owner". An event is emitted when the function is successfully run.

You will need to modify `lib.rs` for this example. Add `type Event = Event;` to the trait implementation, and add `Event<T>` to the `construct_runtime()` macro:

```rust
impl runtime_example::Trait for Runtime {
    type Event = Event;
}

...
RuntimeExample: runtime_example::{Module, Call, Storage, Event<T>},
...
```

```rust
use support::{decl_module, decl_storage, decl_event, StorageValue, dispatch::Result, ensure};
use system::ensure_signed;

pub trait Trait: system::Trait {
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        fn deposit_event<T>() = default;

        fn init_ownership(origin) -> Result {
            ensure!(!<Owner<T>>::exists(), Owner already exists);
            let sender = ensure_signed(origin)?;
            <Owner<T>>::put(&sender);
            Self::deposit_event(RawEvent::OwnershipTransferred(sender.clone(), sender));
            Ok(())
        }

        fn transfer_ownership(origin, newOwner: T::AccountId) -> Result {
            let sender = ensure_signed(origin)?;
            ensure!(sender == Self::owner(), This function can only be called by the owner);
            <Owner<T>>::put(&newOwner);
            Self::deposit_event(RawEvent::OwnershipTransferred(sender, newOwner));
            Ok(())
        }
    }
}

decl_storage! {
    trait Store for Module<T: Trait> as RuntimeExampleStorage {
        Owner get(owner): T::AccountId;
    }
}

decl_event!(
    pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
        OwnershipTransferred(AccountId, AccountId),
    }
);
```

### Hashing data

Substrate provides in-built support for hashing data with BlakeTwo256 algorithm. This is available as part of the `system` trait. The Hashing type under the system trait exposes a function called `hash`. This function takes a reference of a byte array (`Vec<u8>`) and produces a BlakeTwo256 hash digest of it.

In the following code snippet, our custom module has a function `get_hash` which takes a `Vec<u8>` parameter `data` and calls the `hash` function on it.

```rust
use runtime_primitives::traits::Hash;
use support::{decl_module, dispatch::Result};
use {system::{self}};

pub trait Trait: system::Trait {}

decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    pub fn get_hash(_origin, data: Vec<u8>) -> Result {
      let _digest = <<T as system::Trait>::Hashing as Hash>::hash(&data);
      Ok(())
    }
  }
}
```

### Storing Structs with Generics

A basic runtime which stores custom, nested structs using a combination of Rust primitive types and Substrate specific types via generics. We also show you how to import and use this custom type in both the Polkadot-UI and Substrate-UI.

```rust
use support::{decl_module, decl_storage, StorageMap, dispatch::Result};

pub trait Trait: balances::Trait {}

#[derive(Encode, Decode, Default)]
pub struct Thing <Hash, Balance> {
    my_num: u32,
    my_hash: Hash,
    my_balance: Balance,
}

#[derive(Encode, Decode, Default)]
pub struct SuperThing <Hash, Balance> {
    my_super_num: u32,
    my_thing: Thing<Hash, Balance>,
}

decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        fn set_mapping(_origin, key: u32, num: u32, hash: T::Hash, balance: T::Balance) -> Result {
            let thing = Thing {
                            my_num: num,
                            my_hash: hash,
                            my_balance: balance
                        };
            <Value<T>>::insert(key, thing);
            Ok(())
        }

        fn set_super_mapping(_origin, key: u32, super_num: u32, thing_key: u32) -> Result {
            let thing = Self::value(thing_key);
            let super_thing = SuperThing {
                            my_super_num: super_num,
                            my_thing: thing
                        };
            <SuperValue<T>>::insert(key, super_thing);
            Ok(())
        }
    }
}

decl_storage! {
    trait Store for Module<T: Trait> as RuntimeExampleStorage {
        Value get(value): map u32 => Thing<T::Hash, T::Balance>;
        SuperValue get(super_value): map u32 => SuperThing<T::Hash, T::Balance>;
    }
}
```

To access the value of this struct via the UI, you will need to import the structure of your new type so that the UI understand how to decode it.

#### Structs in the Polkadot UI
For the Polkadot-UI, you will need to create a JSON file which describes your struct:

> The order of the struct definitions matter here since the UI registers one by one in order.

```json
{
    "Thing": {
        "my_num": "u32",
        "my_hash": "Hash",
        "my_balance": "Balance"
    },
    "SuperThing": {
        "my_super_num": "u32",
        "my_thing": "Thing"
    }
}
```

Then go into the Polkadot UI, and navigate to:

```plaintext
Settings > developer > additional type definitions (JSON)
```

Import your JSON file there and press "Save and Reload". If all went well, you should be able to interact with this value just like any other primitive type.

#### Structs in the Substrate UI

For the Substrate UI, you need to take advantage of a registration function provided by the oo7-substrate module: `addCodecTransform()`.

In the console, simply type:

```javascript
addCodecTransform('Thing<Hash,Balance>', { my_num: 'u32', my_hash: 'Hash', my_balance: 'Balance' });
addCodecTransform('SuperThing<Hash,Balance>', { my_super_num: 'u32', my_thing: 'Thing' });
```

You can add these lines in your **app.jsx** `constructor()` function to automatically import these types when the page loads.

### Working with Custom Enums in Polkadot Apps

If you want to register custom Substrate enums in Polkadot Apps, here is a working example.

First, you need to define enums in your Substrate module (Rust):

```rust
// Example 1: Simple enum
pub enum VoteKind {
    Approve,
    Reject,
    Slash,
}

// Example 2: Parametrized enum
pub enum ElectionStage<BlockNumber> {
    Announcing(BlockNumber),
    Voting(BlockNumber),
    Revealing(BlockNumber),
}
```

Second, registers previous enums in TypeScript code of Polkadot Apps. This code could be placed somewhere around https://github.com/polkadot-js/apps/blob/master/packages/apps/src/index.tsx#L47

```javascript
import { BlockNumber } from '@polkadot/types';
import { Enum, EnumType } from '@polkadot/types/codec';

// Example 1: Simple enum

class VoteKind extends Enum {
  constructor (value?: any) {
    super([
      'Approve',
      'Reject',
      'Slash'
    ], value);
  }
}

typeRegistry.register({
  VoteKind
});

// Example 2: Parametrized enum

class Announcing extends BlockNumber { }
class Voting extends BlockNumber { }
class Revealing extends BlockNumber { }
class ElectionStage extends EnumType<Announcing | Voting | Revealing> {
  constructor(value?: any, index?: number) {
    super({
      Announcing,
      Voting,
      Revealing
    }, value, index);
  }
}

typeRegistry.register({
  Announcing,
  Voting,
  Revealing,
  ElectionStage
});
```

### Print a message

Sometimes we need to print debug messages while building applications. This recipe shows how to print messages for debugging your Substrate runtime code.

You need to include `runtime_io` crate from the Substrate core in order to use IO functions from within the runtime modules.

```rust
use support::{decl_module, dispatch::Result};
use runtime_io;

pub trait Trait: system::Trait {}

decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    pub fn print_something(_origin) -> Result {
      // the following line prints a message on the node's terminal/console
      runtime_io::print(Hello World from Substrate Runtime!);
      Ok(())
    }
  }
}
```

When this function is executed, the message will appear on the terminal where the Substrate node is running. The following screenshot shows the printed message.
![Text "Hello World from Substrate Runtime!"](/docs/assets/16b213f-Screenshot_from_2019-01-11_16-29-09.png)

### Make a Balance Transfer

You can use the `Currency` type to safely transfer funds between two accounts. Note that this module does not use the `Storage` type.

```rust
use support::{decl_module, dispatch::Result, Currency, LockableCurrency};
use system::ensure_signed;

pub trait Trait: system::Trait {
    type Currency: LockableCurrency<Self::AccountId, Moment=Self::BlockNumber>;

    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    fn transfer_proxy(origin, to: T::AccountId, value: T::Balance) -> Result {
      let sender = ensure_signed(origin)?;
      T::Currency::make_transfer(&sender, &to, value)?;

      Ok(())
    }
  }
}
```

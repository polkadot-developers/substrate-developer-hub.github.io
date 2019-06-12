---
title: "Event Enum"
---
Substrate runtimes provide events to communicate information for end-users and clients.

## Declaring Events

In Substrate runtime modules, events are declared using the `decl_event!` macro. For example, in the SRML sudo module (`srml-sudo`), the following events are declared.

```rust
decl_event!(
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
		/// A sudo just took place.
		Sudid(bool),
		/// The sudoer just switched identity; the old key is supplied.
		KeyChanged(AccountId),
	}
);
```

## The _Module_ Event Enum

At compile time, the `decl_event!` macro expands to generate the `RawEvent` enum for each module. The `Event` type is then generated as a concrete implementation of `RawEvent` using the traits specified in the macro.

The following are the generated `RawEvent` and `Event` types for the SRML sudo module (`srml-sudo`) after macro expansion.

```rust
pub enum RawEvent<AccountId> {
    Sudid(bool),
    KeyChanged(AccountId),
}

pub type Event<T> = RawEvent<<T as system::Trait>::AccountId>;
```

## The _Outer_ Event Enum

In addition to the `Event` type for each module, there is an _outer_ `Event` type generated for the entire runtime using the [`construct_runtime!`](runtime/macros/construct_runtime.md) macro. This _outer_ event type consolidates the `Event` enums of all the modules that are part of the runtime.

For example, in the default Substrate `node-template` runtime, we find the following declaration, which shows all the modules that are declared in the `construct_runtime!` macro. Only some of its modules have the `Event` type, including: `System`, `Indices`, `Balances`, `Sudo` and `TemplateModule`.

```rust
construct_runtime!(
	pub enum Runtime with Log(InternalLog: DigestItem<Hash, AuthorityId, AuthoritySignature>) where
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
		// Used for the module template in `./template.rs`
		TemplateModule: template::{Module, Call, Storage, Event<T>},
	}
);
```

When the `construct_runtime!` macro expands, it generates the following _outer_ `Event` enum for the runtime:

```rust
pub enum Event {
    system(system::Event),
    indices(indices::Event<Runtime>),
    balances(balances::Event<Runtime>),
    sudo(sudo::Event<Runtime>),
    template(template::Event<Runtime>),
}
```

The _outer_ `Event` type enumerates the _inner_ `Event` types of each module that has events.

## Events Metadata

In order to subscribe to relevant events, clients and applications need to know which events are part of each module in the runtime. For this, Substrate's RPC API has the `getMetadata` endpoint, which exposes information about events (and other metadata).

For example, the SRML sudo module (`srml-sudo`) lists the following events when the response of the `getMetadata` API is converted to JSON.

```json
{
    "metadata": {
        "MetadataV1": {
            "modules": [
                {
                    "name": "sudo",
                    "prefix": "Sudo",
                    "events": [
                        {
                            "name": "Sudid",
                            "args": [
                                "bool"
                            ],
                            "docs": [
                                " A sudo just took place."
                            ]
                        },
                        {
                            "name": "KeyChanged",
                            "args": [
                                "AccountId"
                            ],
                            "docs": [
                                " The sudoer just switched identity; the old key is supplied."
                            ]
                        }
                    ]
                }
            ]
        }
    }
}
```
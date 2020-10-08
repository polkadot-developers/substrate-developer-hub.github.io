---
title: Runtime Events
---

A Substrate runtime module can emit events when it wants to notify external entities about changes
or conditions in the runtime to external entities like users, chain explorers, or dApps.

You can define what events your module emits, what information is contained within those events, and
when those events are emitted.

## Declaring an Event

Runtime events are created with the `decl_event!` macro.

```rust
decl_event!(
	pub enum Event<T> where AccountId = <T as Trait>::AccountId {
		/// Set a value.
		ValueSet(u32, AccountId),
	}
);
```

The `Event` enum needs to be declared in your runtime's configuration trait.

```rust
pub trait Trait: system::Trait {
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}
```

## Exposing Events to Your Runtime

The events for your module need to be exposed to your Substrate's runtime (`/runtime/src/lib.rs`).

First you need to implement the Event type in your module's configuration trait:

```rust
// runtime/src/lib.rs
impl template::Trait for Runtime {
	type Event = Event;
}
```

Then you need to add the `Event` type to your `construct_runtime!` macro:

```rust
// runtime/src/lib.rs
construct_runtime!(
	pub enum Runtime where
		Block = Block,
		NodeBlock = opaque::Block,
		UncheckedExtrinsic = UncheckedExtrinsic
	{
		// --snip--
		TemplateModule: template::{Module, Call, Storage, Event<T>},
		//--add-this------------------------------------->^^^^^^^^
	}
);
```

> **Note:** You may or may not need the `<T>` parameter depending on whether your events use generic
> types. In our example it does, and is included above.

## Depositing an Event

Substrate provides a default implementation of how to deposit an event that is defined in the
`decl_module!` macro.

```rust
decl_module! {
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		// Default implementation of `deposit_event`
		fn deposit_event() = default;

		fn set_value(origin, value: u64) {
			let sender = ensure_signed(origin)?;
			// --snip--
			Self::deposit_event(RawEvent::ValueSet(value, sender));
		}
	}
}
```

The default behavior of this function is to call
[`deposit_event`](https://substrate.dev/rustdocs/v2.0.0/frame_system/struct.Module.html#method.deposit_event)
from the FRAME system, which writes the event to storage.

This function places the event in the System module's runtime storage for that block. At the
beginning of a new block, the System module automatically removes all events that were stored from
the previous block.

Events deposited using the default implementation will be directly supported by downstream libraries
like the [Polkadot-JS api](../integrate/polkadot-js), however you can implement your own
`deposit_event` function if you want to handle events differently.

## Supported Types

Events can emit any type which supports the [Parity SCALE codec](../advanced/codec).

In the case where you want to use Runtime generic types like `AccountId` or `Balances`, you need to
include a [`where` clause](https://doc.rust-lang.org/rust-by-example/generics/where.html) to define
those types as shown in the example above.

## Listening To Events

The Substrate RPC does not directly expose an endpoint for querying events. If you used the default
implementation, you can see the list of events for the current block by querying the storage of the
System module. Otherwise, the [Polkadot-JS api](../integrate/polkadot-js) supports a WebSocket
subscription on runtime events.

## Next Steps

### Learn More

- Learn more about the [macros](macros) used in Substrate runtime development.
- Learn more about using the [Polkadot JS api](../integrate/polkadot-js).

### Examples

These [Substrate Recipes](https://github.com/substrate-developer-hub/recipes) offer examples of how
runtime events are used:

- [A pallet that implements standard events](https://github.com/substrate-developer-hub/recipes/blob/master/pallets/last-caller/src/lib.rs)
- [A pallet that does not emit events with generic types](https://github.com/substrate-developer-hub/recipes/blob/master/pallets/adding-machine/src/lib.rs)

### References

- [`decl_event!` macro](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.decl_event.html)
- [`decl_module!` macro](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.decl_module.html)
- [`construct_runtime!` macro](https://substrate.dev/rustdocs/v2.0.0/frame_support/macro.construct_runtime.html)

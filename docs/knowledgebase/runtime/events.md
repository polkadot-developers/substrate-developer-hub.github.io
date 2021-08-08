---
title: Events
---

A Substrate runtime module can emit events when it wants to notify external entities about changes
or conditions in the runtime to external entities like users, chain explorers, or dApps.

You can define what events your module emits, what information is contained within those events, and
when those events are emitted.

## Declaring an Event

Runtime events are created with the `decl_event!` macro (FRAME v1) or the `#[pallet::event]` macro (in FRAME v2).

```rust
// In FRAME v1.
decl_event!(
  pub enum Event<T: Config> {
    /// Set a value.
    ValueSet(u32, T::AccountId),
  }
);

// In FRAME v2.
#[pallet::event]
#[pallet::metadata(u32 = "Metadata")]
pub enum Event<T: Config> {
  /// Set a value.
  ValueSet(u32, T::AccountId),
}
```

The `Event` enum needs to be declared in your runtime's configuration trait.

```rust
// In FRAME v1.
pub trait Config: system::Config {
  /// The overarching event type.
  type Event: From<Event<Self>> + Into<<Self as system::Config>::Event>;
}

// In FRAME v2.
#[pallet::config]
  pub trait Config: frame_system::Config {
    /// The overarching event type.
    type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
  }
```

## Exposing Events to Your Runtime

Your pallet's events need to be exposed to your node's runtime (`/runtime/src/lib.rs`).

First, you need to implement the `Event` type in your module's configuration trait:

```rust
// runtime/src/lib.rs
impl template::Config for Runtime {
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

Substrate provides a default implementation of how to deposit an event using macros, which varies slightly depending on [FRAME version adopted](/docs/en/knowledgebase/runtime/macros#overview-of-frame-versioning). In FRAME v1:

```rust
decl_module! {
  pub struct Module<T: Config> for enum Call where origin: T::Origin {
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
In FRAME v2, depositing an event adopts a slightly different structure:

```rust
// 1. Use the `generate_deposit` attribute when declaring the Events enum.
#[pallet::event]
  #[pallet::generate_deposit(pub(super) fn deposit_event)] // <------ here ----
  #[pallet::metadata(...)]
  pub enum Event<T: Config> {
    // --snip--
  }

// 2. Use `deposit_event` inside the dispatchable function
#[pallet::call]
  impl<T: Config> Pallet<T> {
    #[pallet::weight(1_000)]
    pub(super) fn set_value(
      origin: OriginFor<T>,
      value: u64,
    ) -> DispatchResultWithPostInfo {
      let sender = ensure_signed(origin)?;
      // --snip--
      Self::deposit_event(RawEvent::ValueSet(value, sender));
    }
  }
```

The default behavior of this function is to call
[`deposit_event`](https://substrate.dev/rustdocs/latest/frame_system/pallet/struct.Pallet.html#method.deposit_event)
from the FRAME system, which writes the event to storage.

This function places the event in the System module's runtime storage for that block. At the
beginning of a new block, the System module automatically removes all events that were stored from
the previous block.

Events deposited using the default implementation will be directly supported by downstream libraries
like the [Polkadot-JS API](../integrate/polkadot-js), however you can implement your own
`deposit_event` function if you want to handle events differently.

## Supported Types

Events can emit any type which supports the [Parity SCALE codec](../advanced/codec).

In the case where you want to use Runtime generic types like `AccountId` or `Balances`, you need to
include a [`where` clause](https://doc.rust-lang.org/rust-by-example/generics/where.html) to define
those types as shown in the example above.

## Listening To Events

The Substrate RPC does not directly expose an endpoint for querying events. If you used the default
implementation, you can see the list of events for the current block by querying the storage of the
System module. Otherwise, the [Polkadot-JS API](../integrate/polkadot-js) supports a WebSocket
subscription on runtime events.

## Next Steps

### Learn More

- Learn more about the [macros](macros) used in Substrate runtime development.
- Learn more about using the [Polkadot-JS API](../integrate/polkadot-js).

### Examples

These [Substrate Recipes](https://github.com/substrate-developer-hub/recipes) offer examples of how
runtime events are used:

- [A pallet that implements standard events](https://github.com/substrate-developer-hub/recipes/blob/master/pallets/last-caller/src/lib.rs)

### References

- [`decl_event!` macro](https://substrate.dev/rustdocs/latest/frame_support/macro.decl_event.html)
- [`decl_module!` macro](https://substrate.dev/rustdocs/latest/frame_support/macro.decl_module.html)
- [`construct_runtime!` macro](https://substrate.dev/rustdocs/latest/frame_support/macro.construct_runtime.html)
- [`#[frame_support::pallet]` macro](https://crates.parity.io/frame_support/attr.pallet.html)

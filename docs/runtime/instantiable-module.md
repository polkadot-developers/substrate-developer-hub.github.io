---
title: "Instantiable Modules"
---

Substrate runtimes are typically created by composing multiple runtime modules. Many such modules are available for re-use in the Substrate Runtime Module Library, while others may be written with a particular runtime in mind. Many such modules are intended to be re-used in a variety of runtimes. For example most blockchains have notion of a currency and may use the SRML's Balances module. But what if a single runtime wants to use the same module twice? This is exactly what instantiable modules are for.


## What is an Instantiable Module?
An instantiable runtime module is, in most ways, just like any other runtime module. It defines storage items, events, dispatchable calls, and a genesis configuration. But with just a few extra bits of syntax, the module can be made instantiable which means it can be deployed multiple times in the same runtime.

Some use cases:

* Token chain hosts two independent cryptocurrencies.
* Marketplace track users' reputations as buyers separately from their reputations as sellers.
* Governance has two (or more) houses which act similarly internally.

The SRML's Balances and Collective modules are good examples of real-world code using this technique.

## Writing an Instantiable Module
Writing an instantiable module is almost entirely the same process as writing a plain non-instantiable module. There are just a few places where the syntax differs. If you prefer video walkthroughs, you can see a [recording](https://www.youtube.com/watch?v=XEl59hVcyI8) of making these changes.

### Configuration Trait
```rust
pub trait Trait<I: Instance>: system::Trait {
	// TODO: Add other types and constants required configure this module.

	/// The overarching event type.
	type Event: From<Event<Self, I>> + Into<<Self as system::Trait>::Event>;
}
```

### Storage Declaration
```rust
decl_storage! {
	trait Store for Module<T: Trait<I>, I: Instance> as TemplateModule {
		...
	}
}
```

### Declaring the Module Struct
```rust
decl_module! {
	/// The module declaration.
	pub struct Module<T: Trait<I>, I: Instance> for enum Call where origin: T::Origin {
		...
	}
}
```
### Accessing Storage
```rust
<Something<T, I>>::put(something);
```

<!-- In v2.0 the T is omitted for both instantiable and non-instantiable modules
<Something<I>>::put(something); -->

### Event initialization
```rust
fn deposit_event<T, I>() = default;
```

### Event Declaration
```rust
decl_event!(
	pub enum Event<T, I> where AccountId = <T as system::Trait>::AccountId {
		...
	}
}
```

## Deploying an Instantiable Module

When composing a runtime, one must take care to use the proper syntax for instantiable modules. As before it is slightly different.

### Implementing the Configuration Trait
When implementing the module's configuration trait, you need to be explicit which instance you are configuring, because in general the instances need not have identical configurations. In this snippet we've named the instance `Instance1`.
```rust
impl template::Trait<template::Instance1> for Runtime {
	type Event = Event;
}
```

### In the `construct_runtime!` Macro
Finally, in the `construct_runtime!` macro, we give a more human-friendly name to each instance of the module. Here I've called `Instance1` `FirstTemplate`.
```rust
FirstTemplate: template::<Instance1>::{Module, Call, Storage, Event<T>, Config},
```

The default Substrate node does a similar thing with its council and technical committee.
```rust
Council: collective::<Instance1>::{Module, Call, Storage, Origin<T>, Event<T>, Config<T>},
TechnicalCommittee: collective::<Instance2>::{Module, Call, Storage, Origin<T>, Event<T>, Config<T>}
```

## Default Instance
One drawback of instantiable modules, as we've presented them so far is that they require the deployer to use the more elaborate syntax even if they only desire a single instance of the module. To alleviate this inconvenience, Substrate provides a feature known as DefaultInstance. This allows runtime developers to deploy an instantiable module exactly as they would if it were not instantiable provided they **only use a single instance**.

To make your instantiable module support DefaultInstance, you must specify it in three places.

```rust
pub trait Trait<I=DefaultInstance>: system::Trait {
```

```rust
decl_storage! {
  trait Store for Module<T: Trait<I>, I: Instance=DefaultInstance> as TemplateModule {
    ...
  }
}
```

```rust
decl_event!(
	pub enum Event<T, I=DefaultInstance> where ... {
    ...
  }
}
```

Having made these three changes, a developer who uses your module doesn't need to know or care that your module is instantable. They can deploy it just as they would any other module.

## Genesis Configuration
Some modules require a genesis configuration to be specified. This process is identical for instantiable and non-instantiable modules, but it is worth mentioning that the configuration is named after the human-friendly name given in `construct_runtime!`, and is different for each instance. That is to say that the configuration is **not** named after the module itself. Let's look to the default Substrate node's use of the Collective module as an example.

In its `chain_spec.rs` file we see
```rust
GenesisConfig {
	...
	collective_Instance1: Some(CouncilConfig {
		members: vec![],
		phantom: Default::default(),
	}),
	collective_Instance2: Some(TechnicalCommitteeConfig {
		members: vec![],
		phantom: Default::default(),
	}),
	...
}
```

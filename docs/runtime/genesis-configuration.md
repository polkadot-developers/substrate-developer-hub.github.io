---
title: "Genesis Configuration"
---

Most runtime modules will contain storage values that may be changed or updated as the blockchain runs and users interact with the module. The ways that data may be changed are coded in the functions (both dispatchable and not) in your runtime module, and are covered in several tutorials.

Each storage value must _start_ with some initial value before any user has ever interacted with it. This is the job of the genesis configuration. There are three ways runtime developers may specify initial values for their storage items, and this article will discuss all three. Another article discusses how the [genesis configuration works behind the macros].

## Defer until Deploy Time with `config()`
One option available to runtime developers is to actually not specify their own genesis values, but to leave that option up to whomever actually deploys the module in a blockchain. This option makes sense when different deployments of the module, may reasonably want different configuration values, and the carious storage values do not need to maintain a particular relationship to one another. The runtime developer can choose this option by adding `config()` to the `decl_storage!` marco call.

Consider this example module where players ante to play a game and add to the pot by raising.

```rust
decl_storage! {
  trait Store for Module<T: Trait> as TemplateModule {
    // Points ante'd to play the game
    pub Ante get(ante) config(): Option<u32>;

    // Minimum raise on each turn
    pub MinRaise get(min_raise) config(): Option<u32>;
  }
}
```

The runtime developer here has explicitly chosen not to initialize this storage value, but to defer to the deployer. The deployer then has two options for how to specify this value.

### Enter Values in Rust Code
When a deployer later includes this runtime module as part of their runtime, they may code the initial storage value directly into rust code. If their node looks similar Substrate's node template, this code would go in `src/chain_spec.rs`. And, for this module, would look like this.

```rust

```

### Enter Values in JSON Config
Alternately, the deployer may choose not to hard-code the genesis values, but rather to specify them via a configuration file. In Substrate-based chains a chainspec can be generated with `substrate build-spec > chainspec.json`. For our example module, the configuration would look like this.

```json

```

## Calculate Individually with `build`

## Calculate Multiple Values with `add-extra-genesis`

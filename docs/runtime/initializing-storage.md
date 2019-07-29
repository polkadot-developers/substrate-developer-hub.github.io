---
title: "Initializing Runtime Storage"
---

Most runtime modules contain storage values that may be changed or updated as the blockchain runs and users interact with the module. The ways that data may change are coded in the runtime module's functions (both dispatchable and not), and are covered in several [tutorials](/tutorials).

In some cases storage should be initialized with a value before any user has interacted with it. This is primarily the job of the genesis configuration. There are four ways runtime developers may specify initial values for their storage items, and this article will cover all four. Another article discusses how the genesis configuration works [behind the macros](runtime/types/genesisconfig-struct.md).

## Hard-Code Default Values

The simplest way (and one that technically does not use genesis configuration) to initialize storage is simply to hard-code default values for each parameter. This option is best when there are clear default values that all deployments of the module will want to use. The runtime developer can choose this option by including `config()` in the `decl_storage!` macro, and an initial value at the end of the line.

Consider this example module where players ante to play a game and add to the pot by raising.

```rust
decl_storage! {
  trait Store for Module<T: Trait> as MyModule {
    // Points ante'd to play the game
    pub Ante get(ante) config(): u32 = 5;

    // Minimum raise on each turn
    pub MinRaise get(min_raise) config(): u32 = 7;
  }
}
```

> Specifying default values this way has the effect that if you ever [`kill`](https://substrate.dev/rustdocs/v1.0/srml_support/storage/trait.StorageValue.html#tymethod.kill) your storage value, it will revert to the specified default value.

## Defer until Deploy Time with `config()`

The second option available to runtime developers is to actually _not_ specify their own genesis values, but to leave that option up to whomever actually deploys the module in a blockchain. This option makes sense when different deployments of the module, may reasonably want different configuration values, and the various storage values do not need to maintain a particular relationship to one another. The runtime developer can choose this option by including `config()` in the `decl_storage!` macro, and nothing more.

```rust
decl_storage! {
  trait Store for Module<T: Trait> as MyModule {
    // Points ante'd to play the game
    pub Ante get(ante) config(): u32;

    // Minimum raise on each turn
    pub MinRaise get(min_raise) config(): u32;
  }
}
```

The runtime developer has explicitly chosen not to initialize storage values, but to defer to the deployer.

> The runtime developer may choose to give the field a specific name by including it in the parentheses like this
>
> `pub Ante get(ante) config(value_to_ante): u32;`
>
> If no name is supplied in `config`, the same name from `get` is used. When no getter is specified, `config` _must_ supply a name.

For this option, and all remaining options, the deployer must use `Config<T>` when installing the module in their runtime with something like.

```rust
MyModule: my_module::{Module, Call, Storage, Event<T>, Config<T>},
```

The deployer then has two options for how to specify this value.

### Enter Values in Rust Code

When a deployer later includes this runtime module as part of their runtime, they may code the initial storage value directly into Rust code. If their node looks similar Substrate's node template, this code would go in `src/chain_spec.rs`. And, for our example module, would look like this.

```rust
use my_blockchain_runtime::MyModuleConfig;
...
GenesisConfig {
  ...
  my_module: Some(MyModuleConfig {
      ante: 5,
      min_raise: 7,
  }),
  ...
}
```

> A bug in the v1.0 branch, occasionally causes a compilation error when specifying the genesis configuration this way. Adding an additional field will resolve it.
>
> `_genesis_phantom_data: Default::default(),`

### Enter Values in Configuration File

While there must always be some value specified in code, the deployer may choose to override those values via a configuration file. In Substrate-based chains a chainspec can be generated with `substrate build-spec > chainspec.json`. For our example module, the configuration would look like this.

```json
{
  ...
  "genesis": {
    "runtime": {
      ...
      "my_module": {
        "ante": 55,
        "minRaise": 77
      }
    }
  }
}
```

## Calculate Individually with `build()`

The third option is ideal when the runtime module developer wants to specify the field's initial value, but it is not known at compile time. For example, it may need to be calculated from other initial values that are deferred to the deployer. To choose this option the runtime developer may include `build(<closure>)` and a [closure](https://doc.rust-lang.org/stable/book/ch13-01-closures.html) that returns the desired initial value.

In our example game, the minimum raise must always be twice the ante. But the ante may be configured by the module deployer.
```rust
decl_storage! {
  trait Store for Module<T: Trait> as MyModule {
    // Points ante'd to play the game
    pub Ante get(ante) config(): u32;

    // Minimum raise on each turn
    pub MinRaise get(min_raise) build(|config: &GenesisConfig<T>| config.ante * 2): u32;
  }
}
```
> A bug in the v1.0 branch, occasionally causes a compilation error when specifying the genesis configuration this way. Adding an additional field will resolve it.
>
> `_genesis_phantom_data: Default::default(),`

## Calculate Multiple Values with `add-extra-genesis`

A final option available to runtime developers is to manually add additional fields to the genesis configuration that are not associated with specific storage values. This is useful when all of the initial storage values can be calculated, and they can be calculated from parameters configurable by the deployer. The subtlety here is that the deployer _does_ specify parameters, but those parameters are not, themselves, put into storage. Rather they are used to calculate the values that are put into storage.

In our example game, the module author may want to allow the deployer to specify the smallest number of points worth considering, and calculate both the initial ante and minimum raise from those values.

```rust
decl_storage! {
  trait Store for Module<T: Trait> as MyModule {
    // Points ante'd to play the game
    pub Ante get(ante) build(|config: &GenesisConfig<T>| config.atom * 2): u32;

    // Minimum raise on each turn
    pub MinRaise get(min_raise) build(|config: &GenesisConfig<T>| config.atom * 3): u32;
  }

  add_extra_genesis {
    // The smallest (atomic) number of points worth considering
    config(atom): u32;
  }
}
```

It is also possible to use `build()` inside of `add_extra_genesis`. Doing so is not necessary in our simple game, but there is an [excellent example](https://github.com/paritytech/substrate/blob/v1.0/srml/staking/src/lib.rs#L525) in the SRML's Staking module. The module deployer specifies a `Vec` of stakers and their roles. Then different parts of storage are modified depending on whether each staker is a nominator or validator.

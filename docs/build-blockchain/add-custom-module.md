---
title: "Add Your Runtime Module"
---

After completing [Initialize Your Blockchain](./initialize-your-blockchain.md), you are now ready to write your own runtime module. A runtime module is usually a wrapper for the certain features of blockchain, includes storage, dispatchable functions and events. Take a look at the pre-defined `template` module in the node that you just initialized, the path is `runtime/src/template.rs`:
* Storage: `Something get(something): Option<u32>`
* Dispatchable function:
  ```rust
  pub fn do_something(origin, something: u32) -> Result {
      // --snip--
  }
  ```
* Event: `SomethingStored(u32, AccountId)`

## Create a new module

Do you still remember the `substrate-up` scripts that help us initialize a new node with `substrate-node-new` command? It also provides a command named `substrate-module-new` to ease the process to create a module.

The `substrate-module-new` command creates a new runtime module based on a [template](https://github.com/paritytech/substrate/blob/v1.0/node-template/runtime/src/template.rs). This gives you a ready-to-hack runtime module with all necessary imports, entry-points and sample tests. We recommend using this script to create new modules, especially for users who are just getting started with Substrate, as it also gives you good information on how a typical Substrate runtime module is structured.

To use the `substrate-module-new` command,

1. Make sure you have Substrate installed, have a local runtime created using `substrate-node-new`.
2. Go to the node runtime source directory by running `cd runtime/src`.
3. Run `substrate-module-new` command with the following parameters,

```bash
substrate-module-new <module-name>
```

Where:

* `<module-name>` is the name for your new module. This is a _required_ parameter.

This will create a new file named `<module-name>.rs` in your working directory. In order to use this module, you need to add references to this module in the `lib.rs` file of your node runtime.

For example, if you create a module as,

```
substrate-module-new mymodule
```

Then add the following line in the `lib.rs` to have this module initialized in your runtime,

```
mod mymodule;
```

Further, implement the module trait for your module in the `lib.rs`

```
impl mymodule::Trait for Runtime {
    // add required types here
    type Event = Event;
}
```

Finally, add this module to the `construct_runtime` macro in `lib.rs`,

```
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
		MyModule: mymodule::{Module, Call, Storage, Event<T>},
	}
);
```

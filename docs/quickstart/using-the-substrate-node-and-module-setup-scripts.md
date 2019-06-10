---
title: "Using the Substrate node and module setup scripts"
---
The following scripts allow you to set-up ready-to-hack Substrate runtimes node and modules.

## substrate-node-new

The `substrate-node-new` script downloads a compressed copy of the [Substrate node template codebase](https://github.com/paritytech/substrate/tree/master/node-template) and compiles it. This gives you a ready-to-hack Substrate node with a template runtime module.

To use the `substrate-node-new` script,

1. First, install Substrate using `curl https://getsubstrate.io -sSf | bash`. This installation also adds the Substrate scripts to the system path so that you can call them from anywhere.
1. Run `substrate-node-new` command with the following parameters,

```
substrate-node-new <node-name> <author>
```

where,

`<node-name>` is the name for your substrate runtime. This is a _required_ parameter.

`<author>` is the name of the author of this node runtime. This is _optional_.

Once you run the `substrate-node-new` command, it will take a few minutes (depending on your hardware) to finish compilation.


## substrate-module-new

Once you have your local node up and running using the `substrate-node-new` script, you can add more modules to your runtime using the `substrate-module-new` script.

The `substrate-module-new` script creates a new runtime module based on a [template](https://github.com/paritytech/substrate/blob/master/node-template/runtime/src/template.rs). This gives you a ready-to-hack runtime module with all necessary imports, entry-points and sample tests. We recommend using this script to create new modules, specially for users who are just getting started with Substrate, as it also gives you good information on how a typical Substrate runtime module is structured.

To use the `substrate-module-new` script,

1. Make sure you have Substrate installed, have a local runtime created using `substrate-node-new`.
1. `cd` into the node runtime directory
1. Run `substrate-module-new` command with the following parameters,

```
substrate-module-new <module-name> <author>
```

where,

`<module-name>` is the name for your new module. This is a _required_ parameter.

`<author>` is the name of the author of this module. This is _optional_.

This will create a new file named `<module-name>.rs` inside `runtime/src` sub-directory in your node runtime directory. Make sure you add references to this module in the `lib.rs` file of your node runtime.

For example, if you create a module as,

```
substrate-module-new mymodule myname
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

---
title: Using the Substrate Scripts
id: version-1.0-using-the-substrate-scripts
original_id: using-the-substrate-scripts
---

The [`substrate-up`](https://github.com/paritytech/substrate-up) scripts allow you to set up ready-to-hack Substrate nodes or runtime modules.

To use these scripts, make sure you have completed the [Fast Installation](getting-started/installing-substrate.md#fast-installation) for running Substrate.

These scripts update from time to time, so before you run them locally, make sure they are up to date by running:

```bash
f=`mktemp -d`
git clone https://github.com/paritytech/substrate-up $f
cp -a $f/substrate-* ~/.cargo/bin
cp -a $f/polkadot-* ~/.cargo/bin
```

## substrate-node-new

The `substrate-node-new` script downloads and compiles a copy of the [Substrate node template](https://github.com/paritytech/substrate/tree/v1.0/node-template). This gives you a ready-to-hack Substrate node with a template runtime module.

Run the `substrate-node-new` command with the following parameters:

```bash
substrate-node-new <node-name> <author>
```

Where:

* `<node-name>` is the name for your Substrate runtime. This is a _required_ parameter.

* `<author>` shows the people or team who maintains this node runtime. This is a _required_ parameter.

Once you run the `substrate-node-new` command, it will take a few minutes (depending on your hardware) to finish compilation.

## substrate-module-new

Once you have your local node up and running using the `substrate-node-new` script, you can add more modules to your runtime using the `substrate-module-new` script.

The `substrate-module-new` script creates a new runtime module based on a [template](https://github.com/paritytech/substrate/blob/v1.0/node-template/runtime/src/template.rs). This gives you a ready-to-hack runtime module with all necessary imports, entry-points and sample tests. We recommend using this script to create new modules, especially for users who are just getting started with Substrate, as it also gives you good information on how a typical Substrate runtime module is structured.

To use the `substrate-module-new` script,

1. Make sure you have Substrate installed, have a local runtime created using `substrate-node-new`.
2. Go to the node runtime source directory by running `cd runtime/src`.
3. Run `substrate-module-new` command with the following parameters,

```
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

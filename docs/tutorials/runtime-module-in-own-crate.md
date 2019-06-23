---
title: "Write a Runtime Module in its Own Crate"
---

In this tutorial you'll write substrate runtime module that lives in its own crate, and include it in a node based on the node-template. If you prefer you can follow along with the [video walkthrough](todo record after initial feedback).

## Setup a Development Environment
If you haven't already, follow the guide to [install substrate](../getting-started/installing-substrate). You'll need the substrate-up scripts, but not the standard substrate node, so the `--fast` option is what you want here.

## Create a new Node Template
We'll begin by creating a brand new node template.
```bash
substrate-node-new modular-chain <your name>
```
If you've followed other runtime tutorials, you've probably started this way.

In this tutorial, we're not going to write our module directly as part of the node template, but rather as a separate rust crate. This approach provides a few advantages:
1. Our module can be easily imported into other nodes in the future.
2. Our module can be published to places like github or crates.io without publishing our entire node in the same place.

We do still need the node template, however, to actually run our module.

## Create a Rust Library Crate
So if our module isn't going to live in the node template, where _is_ it going to live? In a rust library crate. We can create a blank one with
```bash
cargo new --lib test_module
```

If you aren't familiar with library crates or how to use them in other rust projects, it's probably worth reading the [cargo docs](https://doc.rust-lang.org/cargo/guide/creating-a-new-project.html). In the video walkthrough of this tutorial, I briefly describe a simple number doubling program that uses a library crate for the doubling.

## Make the Crate a Runtime Module
The cargo command has created the appropriate files and directories for us.
Let's replace the contents of `lib.rs` in our new crate with the module template from `runtime/template.rs`. (You can also use `substrate-module-new` to create such a file.)

Go ahead and compile your new crate with `cargo build`. It won't compile yet, because that template module has some dependencies from substrate itself. The compiler errors give you clues about what you need to include. We can just copy the relevant dependencies from the original node template runtime's `Cargo.toml`. Add these lines to your crate's `Cargo.toml`.

```toml
[features]
default = ['std']
std = [
    'parity-codec/std',
    'support/std',
    'system/std',
]

[dependencies.parity-codec]
default-features = false
features = ['derive']
version = '3.5'

[dependencies.support]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-support'
rev = 'bb68456966bf9d767651773dbaadd6787bce1884'

[dependencies.system]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-system'
rev = 'bb68456966bf9d767651773dbaadd6787bce1884'
```

At this point we have a runtime module that compiles. It comes with a test, so let's see if that test passes .
```bash
cargo test
```

Turns out we'll need some additional dependencies to make the test pass. You can see this from the error messages, or by looking at the test module itself. Let's add `primitives`, `runtime-primitives`, and `runtime-io` as dev dependencies. The dev dependencies do not need to be listed as part of `std`. TODO is that even proper phrasing?

Add these lines to your `Cargo.toml`.
```toml

[dev-dependencies.primitives]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'substrate-primitives'
rev = 'bb68456966bf9d767651773dbaadd6787bce1884'

[dev-dependencies.runtime-primitives]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'sr-primitives'
rev = 'bb68456966bf9d767651773dbaadd6787bce1884'

[dev-dependencies.runtime-io]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'sr-io'
rev = 'bb68456966bf9d767651773dbaadd6787bce1884'
```

We're now good to go for this particular module. It will take a little experimentation to gain familiarity with what dependencies you need for each module you dream up. So the take-away from this section is not that `Cargo.toml` should always look like it did today. Rather, `Cargo.toml` needs to have the correct dependencies and you now know a few places to look for how to specify them when you get stuck.

## Add your Runtime Module to your Node
With our runtime module now compiling and passing tests (well, passing test anyway) we're ready to add it to our node template.

First we need to add our newly-created crate as a dependency in the node runtime's `Cargo.toml`.

```toml
[dependencies.test_module]
default_features = false
path = "../../test_module"
# Optionally specify a version
# version = "0.1.0"
```

And remember to update the `std` section/
```toml
'test_module/std'
```

Next we'll update `runtime/lib.rs` in modular-chain to actually use the new runtime module. The lines that bring in the template module from when it was coded directly in the node runtime are still there, so we just need to update them in three places.

1. Remove `mod template` as we've already brought that dependency in via `Cargo.toml`
2. Update the trait implementation
```rust
/// Used for the module test_module
impl test_module::Trait for Runtime {
	type Event = Event;
}
```

3. Update `construct_runtime`
```rust
TestModule: test_module::{Module, Call, Storage, Event<T>},
```

## Appreciate your Work
At this point you have the template module packaged up as it's own crate, and running as part of your `modular-node`. You can now run your chain with `./target/release/modular-chain --dev` and start the [Apps UI](https://polkadot.js.org/apps/#/explorer) to confirm that the module is working as expected. If you aren't familiar with the Apps UI, you will need to navigate to the settings tab, and select 'Local Node'.

## Customize your Module
In this tutorial you've learned to create a runtime module as a it's own crate. You're now ready to replace the template module logic with your own logic. If you're not sure what to code, check out one of our runtime module [tutorials](https://substrate.dev/en/tutorials).

---
title: "Write a Runtime Module in its Own Crate"
---

In this tutorial, you'll write a Substrate runtime module that lives in its own crate, and include it in a node based on the node-template. If you prefer you can follow along with the [video walkthrough](todo record after initial feedback).

## Setup a Development Environment
If you haven't already, follow the guide to [install substrate](getting-started/installing-substrate.md). You'll need the substrate-up scripts, but not the standard substrate node, so the `--fast` option is what you want here.

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

## Clone the Module Template Repository
So if our module isn't going to live in the node template, where _is_ it going to live? If you aren't familiar with library crates or how to use them in other rust projects, it's may be worth reading the [cargo docs](https://doc.rust-lang.org/cargo/guide/creating-a-new-project.html).

While it's perfectly possible to create a new crate from scratch, the fastest way to get going with a new module is to clone the template repository.

```bash
git clone https://github.com/shawntabrizi/substrate-module-template
```

You should be able to immediately compile this template module with
```bash
cargo build --release
```

But before we jump straight to including our module in a runtime, let's take a look at the `Cargo.toml` file.

After the standard naming and authorship information, we see a few lines about the `std` feature. Because substrate runtime code targets wasm, all the dependencies we use must be able to compile with `no_std`. Our `Cargo.toml` file begins by telling dependencies to only use their `std` feature when this module also uses its `std` feature. You will need to add each dependency you include here.

```toml
[features]
default = ['std']
std = [
    'parity-codec/std',
    'support/std',
    'system/std',
]
```
Our module will depend on low level features such as `system` and `support` from substrate itself. It will also be depended upon by a substrate-based runtime from above. So some care may be needed to ensure version compatibility on both sides. Substrate does not yet have releases published on crates.io, so instead we'll use git-based versioning.
If you plan for third parties to use your module, you should develop against the `v1.0` branch as the template demonstrates. It is also acceptable to develop against specific git commit revisions.

```toml
# This dependency is published on crates.io so just use a version
[dependencies.parity-codec]
default-features = false
features = ['derive']
version = '3.5'

# These dependencies specify a git branch
[dependencies.support]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-support'
branch = 'v1.0'

[dependencies.system]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-system'
branch = 'v1.0'
# Could also use a specific revision
# rev = '<commit hash>'
```

The final section of the `Cargo.toml` file specifies the dev dependencies, and is not necessary to make the template compile. Remove that final section to confirm this for yourself.

At this point we have a runtime module that compiles. It comes with a test, so let's see if that test passes.
```bash
cargo test
```

Turns out we'll need some additional dependencies to make the test pass. You can see this from the error messages, or by looking at the test module itself. Let's add `primitives`, `runtime-primitives`, and `runtime-io` as dev dependencies. The dev dependencies do not need to be listed as part of the `std` feature because they will not be part of the release.

Add these lines back to your `Cargo.toml`.
```toml

[dev-dependencies.primitives]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'substrate-primitives'
branch = 'v1.0'

[dev-dependencies.runtime-primitives]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'sr-primitives'
branch = 'v1.0'

[dev-dependencies.runtime-io]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'sr-io'
branch = 'v1.0'
```

It will take a little experimentation to gain familiarity with what dependencies you need for each module you dream up. So the take-away from this section is not that `Cargo.toml` should always look like it does in the template. Rather, `Cargo.toml` needs to have the correct dependencies and you now know how to specify them.

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

And just as before, we need to tell the module to only build its `std` feature when the runtime itself does.
```toml
std = [
  ...
  'test_module/std',
]
```

Next we'll update `runtime/lib.rs` in modular-chain to actually use the new runtime module. The lines that bring in the template module that is coded directly in the node runtime are still there, so we just need to update them in three places.

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
At this point you have the template module packaged up as it's own crate, and included in your `modular-chain` runtime.

Build the `modular-chain` node with
```bash
./scripts/build.sh
cargo build --release
```

And run your node with
```bash
# Clear the data directory in case you've done this before
./target/release/modular-chain purge-chain --dev

# Start the chain
./target/release/modular-chain --dev
```

Finally, start the [Apps UI](https://polkadot.js.org/apps/#/explorer) to confirm that the module is working as expected. If you aren't familiar with the Apps UI, you will need to navigate to the settings tab, and select 'Local Node'.

## Customize your Module
In this tutorial you've learned to create a runtime module as a it's own crate. You're now ready to replace the template module logic with your own logic. If you're not sure what to code, check out one of our runtime module [tutorials](https://substrate.dev/en/tutorials).

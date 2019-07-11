---
title: "Creating a Runtime Module"
---

In this tutorial, you'll write a Substrate runtime module that lives in its own crate, and include it in a node based on the node-template.

## Setup Your Development Environment

If you haven't already, follow the [fast installation](getting-started/installing-substrate.md#fast-installation) for getting started on Substrate. It will provide you with all the development resources you need to build Substrate and the [`substrate-up` scripts](getting-started/using-the-substrate-scripts) for quickly setting up new nodes.

## Create your Node

We'll begin by creating a brand new node template. If you've followed other runtime tutorials, you've probably started this way before:

```bash
substrate-node-new modular-chain <your name>
```

In this tutorial, we're not going to write our module directly as part of the node template, but rather as a separate Rust crate. This approach provides a few advantages:

1. Our module can be easily imported into other nodes in the future.
2. Our module can be published to places like GitHub or Crates.io without publishing our entire node in the same place.

However, we do still need to set up a Substrate node to actually run our module.

## Clone the Module Template Repository

So if our module isn't going to live in the node template, where _is_ it going to live?

If you aren't familiar with creating Rust libraries or using them in other Rust projects, you can get a more in-depth explanation by reading [the Cargo book](https://doc.rust-lang.org/cargo/guide/creating-a-new-project.html).

While it's perfectly possible to create a new Substrate runtime module from scratch, the fastest way to get started is to clone a Substrate module template we have created for you:

```bash
git clone https://github.com/shawntabrizi/substrate-module-template
```

In the `Cargo.toml` file, update the module's name and authorship to something meaningful. In this tutorial we're focusing on how to create and use the module rather than writing interesting module logic, so I'll call mine `test_module`. The beginning of my `Cargo.toml` now looks like.

```toml
[package]
name = "test_module"
version = "0.1.0"
authors = ["Joshy Orndorff"]
edition = "2018"
```

You should be able to successfully compile this template module with:

```bash
cargo build
```

Let's explore some of the things we did for you in this Substrate module template. We will start by looking at the `Cargo.toml` file.

### Your Module's `std` Feature

In your `Cargo.toml` file, you will notice a few lines about the "`std` feature". In Rust, when you enable `std`, you give your project access to [the Rust standard libraries](https://doc.rust-lang.org/std/). This works just fine when building native binaries.

However, Substrate also builds the runtime code to Wasm. In this case we use cargo features to disable the Rust standard library when compiling for Wasm because [wasm-unknown-unknown](https://github.com/rust-lang/rust/pull/45905) does not know which allocator to use.

Thus, all the dependencies we use for our module, and our entire runtime, must be able to compile with [`no_std`](https://rust-embedded.github.io/book/intro/no-std.html). Our `Cargo.toml` file tells our module's dependencies to only use their `std` feature when this module also uses its `std` feature like so:

```toml
[features]
default = ['std']
std = [
    'parity-codec/std',
    'support/std',
    'system/std',
]
```

> In general, when adding dependencies to your runtime, follow this pattern.
>
> 1. Add a feature called `std`
> 2. Enable this feature by default in your Cargo.toml
> 3. When compiling for Wasm, the feature is disabled

### Consistent Substrate Dependencies

All Substrate modules will depend on some low level module libraries such as `srml-system` and `srml-support`. These libraries are pulled from the main Substrate GitHub repository. When people build their own Substrate nodes, they will also have dependencies on the main Substrate repository.

Because of this, you will need to be careful to ensure consistent dependencies from your module and the node integrating your module to the Substrate repository. If your module is dependent on one version of Substrate, and the node is dependent on another, compilation will run into errors where the Substrate versions may be incompatible, or the two versions of the same library are being used. Ultimately Cargo will not be able to resolve those conflicts and you will get a compile time error.

So when building your module have two options:

**Option 1 (recommended)**

Develop against the `v1.0` branch as the template demonstrates. In this case you will need to update your node template's `Cargo.toml` to depend on Substrate's `branch = 'v1.0'` like the module template currently does, rather than `rev = <git commit hash>`. This will ensure that your module can be used by any node who is also based on the `v1.0` branch

**Option 2**

It is also acceptable to develop your module for a specific git commit. In this case you'll need to change the Substrate module template's `Cargo.toml` to use `rev = <git commit hash>` rather than `branch = 'v1.0'`. This means that only nodes which use the exact same git commit hash for their project can use your module.

If you follow our recommended option 1, your dependency definitions will look like:

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

### Your Module's Dev Dependencies

The final section of the `Cargo.toml` file specifies the dev dependencies. These are the dependencies that are needed in your module's tests, but not necessary the actual module itself.


```toml

[dev-dependencies.primitives]
git = 'https://github.com/paritytech/substrate.git'
package = 'substrate-primitives'
branch = 'v1.0'

[dev-dependencies.runtime-primitives]
git = 'https://github.com/paritytech/substrate.git'
package = 'sr-primitives'
branch = 'v1.0'

[dev-dependencies.runtime-io]
git = 'https://github.com/paritytech/substrate.git'
package = 'sr-io'
branch = 'v1.0'
```

You can confirm for yourself that the Substrate module template's test passes with:

```bash
cargo test
```

> Optional: You can remove these dev dependencies from your `Cargo.toml` file and confirm that the module still compiles with `cargo build`. However, you will notice that `cargo test` does not compile! If you do this experiment, remember to restore the dev dependencies afterward.

It will take a little experimentation to gain familiarity with what dependencies you need for each module you dream up. So the take-away from this section is not that `Cargo.toml` should always look like it does in the template. Rather, `Cargo.toml` needs to have the correct dependencies and you now know how to specify them.

## Add your Runtime Module to your Node

With our runtime module now compiling and passing it's test, we're ready to add it to our node template.

First we need to add our newly-created crate as a dependency in the node runtime's `Cargo.toml`.

```toml
[dependencies.test_module]
default_features = false
path = "../../test_module"
```

> You **must** set `default_features = false` so that your runtime will successfully compile to wasm.

And just as before, we need to tell the module to only build its `std` feature when the runtime itself does.
```toml
std = [
  ...
  'test_module/std',
]
```

Next we'll update `runtime/lib.rs` in `modular-chain` to actually use our new runtime module. The lines that bring in the template module that is coded directly in the node runtime are still there, so we just need to update them in three places.

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
So far in this tutorial you've learned to create a runtime module as a Rust crate. You're now ready to replace the template logic with your own. If you're not sure what to code, check out one of our runtime modules in [tutorials](https://substrate.dev/en/tutorials).

## Publish your Module
Once your module is no longer just a template, you should consider publishing it. We'll cover publishing your module to GitHub here, but Crates.io is another good option. Go ahead and [create a GitHub repository](https://help.github.com/en/articles/create-a-repo) and [push your module's code](https://help.github.com/en/articles/pushing-to-a-remote) to it.

With the code on GitHub, your module is properly published. Congratulations! We now need to update your node to use the code that is on GitHub instead of a hard-coded file system path.

The final edit to your runtime's `Cargo.toml` file will update its dependency on your module. The new code is
```toml
[dependencies.<your-module-name>]
default_features = false
git = "https://github.com/<you>/<your-module>"
branch = "master"

# You may choose a specific commit or tag instead of branch
# rev = "<some commit hash>"
# tag = "<some tag>"
```

Compile one more time and notice that Cargo now grabs your module from GitHub instead of using the local files.

Congratulations! You've written a Substrate runtime module in its own Rust crate, and published that crate to GitHub. Other blockchain developers can now easily use your module in their runtime by simply including those same four lines of code in their runtime's `Cargo.toml` files and updating their runtime's `lib.rs` file.

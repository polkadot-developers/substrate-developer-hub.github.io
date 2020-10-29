---
title: "Write a Pallet in its Own Crate"
---

In this tutorial, you'll write a Substrate pallet that lives in its own crate, and include it in a
node based on the `substrate-node-template`.

## Install the Node Template

You should already have version `v2.0.0` of the
[Substrate Node Template](https://github.com/substrate-developer-hub/substrate-node-template)
compiled on your computer from when you completed the
[Create Your First Substrate Chain Tutorial](../create-your-first-substrate-chain/). If you do not,
please complete that tutorial.

> Experienced developers who truly prefer to skip that tutorial, you may install the node template
> according to the instructions in its readme.

### Clone the Pallet Template

We're not going to write our pallet directly as part of the node template, but rather as a separate
Rust crate. This approach allows us to publish our pallet separately from our node and also allows
others to easily import this pallet into their own Substrate runtime.

Clone the Substrate pallet template in the `pallets` directory of your node template:

```bash
cd pallets
git clone -b v2.0.0 https://github.com/substrate-developer-hub/substrate-pallet-template test-pallet
```

> In this tutorial we have placed the pallet template _inside_ the node template's directory
> structure. This pattern is not required, and you can place the pallet template anywhere you like.
> Another popular option would be as a _sibling_ to the node template.

## The Substrate Pallet Template

Let's explore the Substrate pallet template, starting with the `Cargo.toml` file.

### Renaming Your Crate

In the `Cargo.toml` file, you must update the crate's name. In this tutorial, we're focusing on how
to create and use the pallet rather than writing interesting pallet logic. So let's update the value
of the `package.name` attribute in the `Cargo.toml` file to `test-pallet`.

The `package` section of the `Cargo.toml` file now looks like:

**`pallets/test-pallet/Cargo.toml`**

```toml
[package]
authors = ['Substrate DevHub <https://github.com/substrate-developer-hub>']
description = 'FRAME pallet template'
edition = '2018'
homepage = 'https://substrate.dev'
license = 'Unlicensed'
name = 'test-pallet'
repository = 'https://github.com/substrate-developer-hub/substrate-pallet-template/'
version = '2.0.0'
```

Update the `Cargo.toml` file in the root directory of the template node to include a reference to
the new pallet:

**`Cargo.toml`**

```toml
[profile.release]
panic = 'unwind'

[workspace]
members = [
    'node',
    'pallets/template',
    'pallets/test-pallet',  # <-- add this
    'runtime',
]
```

### Compile the Template Pallet

You should be able to successfully check the Substrate pallet template with:

```bash
cd test-pallet
cargo check
```

### Your Pallet's `std` Feature

In your `pallets/test-pallet/Cargo.toml` file, you will notice a few lines about the "`std`
feature". In Rust, when you enable `std`, you give your project access to
[the Rust standard libraries](https://doc.rust-lang.org/std/). This works just fine when building
native binaries.

However, Substrate also builds the runtime code to WebAssembly (Wasm). In this case we use cargo
features to disable the Rust standard library. Thus, all the dependencies we use for our pallet, and
our entire runtime, must be able to compile with
[`no_std`](https://rust-embedded.github.io/book/intro/no-std.html) feature. Our `Cargo.toml` file
tells our pallet's dependencies to only use their `std` feature when this pallet also uses its `std`
feature, like so:

**`pallets/test-pallet/Cargo.toml`**

```TOML
[features]
default = ['std']
std = [
    'codec/std',
    'frame-support/std',
    'frame-system/std',
]
```

### Consistent Substrate Dependencies

All Substrate pallets will depend on some low-level FRAME libraries such as `frame-system` and
`frame-support`. These libraries are pulled from crates.io. When people build their own FRAME-based
runtimes, they will also have dependencies on these low-level libraries. You will need to ensure
consistent dependencies between your pallet and your runtime.

**`pallets/test-pallet/Cargo.toml`**

```TOML
# --snip--
[dependencies]
frame-support = { default-features = false, version = '2.0.0' }
# --snip--
```

From the above snippet, we see that this pallet template depends on version `2.0.0` of the low-level
libraries. Thus it can be used in runtimes that also depend on `2.0.0`.

### Your Pallet's Dev Dependencies

The final section of the `Cargo.toml` file specifies the dev dependencies. These are the
dependencies that are needed in your pallet's tests, but not the actual pallet itself.

**`pallets/test-pallet/Cargo.toml`**

```TOML
# --snip--
[dev-dependencies]
sp-core = { default-features = false, version = '2.0.0' }
# --snip--
```

You can confirm that the tests in the Substrate pallet template pass with:

```bash
cargo test
```

When updating this pallet to include your own custom logic, you will likely add dependencies of your
own to this `Cargo.toml` file.

## Add Your Pallet to Your Node

With our pallet now compiling and passing it's tests, we're ready to add it to our node.

> If you aren't familiar with including and using other crates, refer to
> [the Cargo book](https://doc.rust-lang.org/cargo/guide/creating-a-new-project.html) for an
> in-depth explanation.

We first add our newly-created crate as a dependency in the node's runtime `Cargo.toml`. Then we
tell the pallet to only build its `std` feature when the runtime itself does, as follows:

**`runtime/Cargo.toml`**

```TOML
# --snip--
test-pallet = { path = '../pallets/test-pallet', default-features = false, version = '2.0.0' }

# toward the bottom
[features]
default = ['std']
std = [
    'test-pallet/std',
    # --snip--
]
```

> You **must** set `default-features = false` so that your runtime will successfully compile to
> Wasm.

Next we will update `runtime/src/lib.rs` to actually use our new runtime pallet, by adding a trait
implementation with our `test_pallet` and add it in our `construct_runtime!` macro.

**`runtime/src/lib.rs`**

```rust
// add the following code block
impl test_pallet::Trait for Runtime {
  type Event = Event;
}

// --snip--
construct_runtime!(
  pub enum Runtime where
    Block = Block,
    NodeBlock = opaque::Block,
    UncheckedExtrinsic = UncheckedExtrinsic
  {
    // --snip--
    // add the following line
    TestPallet: test_pallet::{Module, Call, Storage, Event<T>},
  }
);
```

## Run Your Node

At this point you have the pallet packaged up as it's own crate and included in your node's runtime.

Make sure you're back in the node template's root directory, then compile the node and start in
development mode with the following command:

```bash
cargo run -- --dev --tmp
```

Now, start the
[Polkadot-JS Apps connecting to your local node](https://polkadot.js.org/apps/#/extrinsics?rpc=ws://127.0.0.1:9944)
to confirm that the pallet is working as expected.

> **Notes:** You can also manually set the node URL in Polkadot-JS Apps by navigating to the
> **Settings** tab, and have the **remote node/endpoint to connect to** set to **Local Node**.

## Publish Your Pallet

Once your pallet is no longer in test phase, you should consider publishing it to GitHub or
crates.io.

### Publishing on GitHub

To publish on GitHub, you need to
[create a GitHub repository](https://help.github.com/en/articles/create-a-repo) and
[push your pallet's code](https://help.github.com/en/articles/pushing-to-a-remote) to it.

### Publishing on Crates.io

Crates.io allows permissionless publishing. Learn the procedure following their own guide about
[publishing on crates.io](https://doc.rust-lang.org/cargo/reference/publishing.html)

## Updating your Runtime's Dependency

With your pallet now published on GitHub, crates.io, or both, we can update your runtime to use the
code that is published instead of a hard-coded file system path.

### Dependencies from GitHub

**`runtime/Cargo.toml`**

```TOML
[dependencies.your-pallet-name]
default_features = false
git = 'https://github.com/your-username/your-pallet'
branch = 'master'

# You may choose a specific commit or tag instead of branch
# rev = '<git-commit>'
# tag = '<some tag>
```

### Dependencies from Crates.io

**`runtime/Cargo.toml`**

```TOML
[dependencies.your-pallet-name]
default_features = false
version = 'some-compatible-version'
```

## One Last Build

Compile one more time and notice that Cargo now grabs your pallet from GitHub or crates.io instead
of using the local files.

## Next Steps

Congratulations! You've written a Substrate pallet in its own Rust crate, and published it. Other
blockchain developers can now easily use your pallet in their runtime by simply including those same
four lines of code in their runtime's `Cargo.toml` files and updating their runtime's `lib.rs` file.

### Learn More

- We have [plenty of tutorials](/tutorials) to showcase Substrate development concepts and
  techniques.
- For more information about runtime development tips and patterns, refer to our
  [Substrate Recipes](https://substrate.dev/recipes/).
- For a bare FRAME pallet with higly detailed doc comments on specifics of what more you can access within FRAME, see [this example in `substrate`](https://github.com/paritytech/substrate/tree/master/frame/example)

### References

- [The Cargo book](https://doc.rust-lang.org/stable/cargo/)
- More about [Rust and WebAssembly](https://rustwasm.github.io/)

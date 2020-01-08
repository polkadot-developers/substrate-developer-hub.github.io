---
title: Creating an External Pallet
id: version-pre-2.0-creating-a-runtime-module
original_id: creating-a-runtime-module
---

In this tutorial, you'll write a Substrate pallet that lives in its own
crate, and include it in a node based on the `substrate-node-template`.

## Prerequisites

If you haven't already done so, follow the [Getting Started](getting-started.md)
guide to download necessary tools to build Substrate.

### Clone the Node and Module Template

We're not going to write our pallet directly as part of the node template, but
rather as a separate Rust crate. This approach allows us to publish our pallet
separate from our node and also allows other to easily import this pallet into
their own Substrate runtime.

1. Clone the Substrate node template:

    ```bash
    git clone https://github.com/substrate-developer-hub/substrate-node-template.git my-node
    ```

2. Clone the Substrate pallet template:

    ```bash
    git clone https://github.com/substrate-developer-hub/substrate-module-template.git my-pallet
    ```

3. Build the Substrate node template:

    ```bash
    cd my-node
    cargo build --release
    ```

The `substrate-node-template` contains a working Substrate node, and the
`substrate-pallet-template` contains an independent Rust crate which is a
Substrate pallet that can be included in your node. The compilation of
the node may take up to 30 minutes depending on your hardware, so let that run
while you continue to follow this guide.

If you aren't familiar with Rust including and using other pallets, you can
refer to [the Cargo
book](https://doc.rust-lang.org/cargo/guide/creating-a-new-project.html) for a
more in-depth explanation.

## The Substrate Pallet Template

You should be able to successfully compile the Substrate pallet template with:

```bash
cd my-pallet
cargo build --release
```

Let's explore the Substrate pallet template, starting with the `Cargo.toml`
file.

### Renaming Your Crate

In the `Cargo.toml` file, you can update the crate's name and authorship. In
this tutorial, we're focusing on how to create and use the pallet rather than
writing interesting pallet logic. So let's call it `test_pallet`.

The beginning of the `Cargo.toml` now looks like:

**`my-pallet/Cargo.toml`**

```toml
[package]
name = "test_pallet"
version = "0.1.0"
authors = ["Your Name"]
edition = "2018"
```

### Your Pallet's `std` Feature

In your `my-pallet/Cargo.toml` file, you will notice a few lines about the
"`std` feature". In Rust, when you enable `std`, you give your project access to
[the Rust standard libraries](https://doc.rust-lang.org/std/). This works just
fine when building native binaries.

However, Substrate also builds the runtime code to WebAssembly (Wasm). In this
case we use cargo features to disable the Rust standard library. Thus, all the
dependencies we use for our pallet, and our entire runtime, must be able to
compile with [`no_std`](https://rust-embedded.github.io/book/intro/no-std.html)
feature. Our `Cargo.toml` file tells our pallet's dependencies to only use their
`std` feature when this pallet also uses its `std` feature, like so:

**`my-pallet/Cargo.toml`**

```TOML
[features]
default = ['std']
std = [
    'serde',
    'codec/std',
    'support/std',
    'system/std',
    'sp-runtime/std',
    'sp-io/std',
]
```

### Consistent Substrate Dependencies

All Substrate pallets will depend on some low-level FRAME libraries such as
`frame-system` and `frame-support`. These libraries are pulled from the main
[Substrate GitHub repository](https://github.com/paritytech/substrate). When
people build their own Substrate nodes, they will also have dependencies on the
main Substrate repository.

Because of this, you will need to be careful to ensure consistent dependencies
from your pallet and the your Substrate node. If your pallet is dependent on 
one version of Substrate, and thenode on another, compilation will run into errors 
where the Substrate versions may be incompatible, or different version of the 
same library are being used.
Ultimately Cargo will not be able to resolve those conflicts and you will get a
compile time error.

When building your pallet, we recommend to develop against the `v2.0` branch as
the template demonstrates. This ensures your pallet has the latest stable code.
If you later prefer to have the freshly-baked features from Substrate, you can
then choose to use a specific git commit of Substrate, as shown in the following
code comment.

**`my-pallet/Cargo.toml`**

```TOML
# --snip--

[dependencies.support]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'frame-support'
branch = 'v2.0'

# Develop against a git commit by specifying the same Substrate commit as your main node. 
# It is important to use the same Substrate commit to prevent dependencies mismatch.
# rev = "<some commit hash>"

```

### Your Pallet's Dev Dependencies

The final section of the `Cargo.toml` file specifies the dev dependencies. These
are the dependencies that are needed in your pallet's tests, but not necessary
the actual pallet itself.

**`my-pallet/Cargo.toml`**

```TOML
# --snip--

[dev-dependencies.primitives]
git = 'https://github.com/paritytech/substrate.git'
package = 'sp-core'
branch = 'v2.0'
```

You can confirm that the tests in the Substrate pallet template pass with:

```bash
cargo test
```

You may need to modify the dependencies you need for the pallets you create.

## Add Your Pallet to Your Node

With our pallet now compiling and passing it's tests, we're ready to add
it to our node.

We first add our newly-created crate as a dependency in the node's runtime
`Cargo.toml`. Then we tell the pallet to only build its `std` feature when the
runtime itself does, as follows:

**`my-node/runtime/Cargo.toml`**

```TOML
# --snip--

[dependencies.test_pallet]
default_features = false
path = "../../my-pallet"

# toward the bottom
[features]
default = ['std']
std = [
    'test_pallet/std',
    # --snip--
]
```

> You **must** set `default_features = false` so that your runtime will
successfully compile to Wasm.

Next we will update `my-node/runtime/src/lib.rs` to actually use our new runtime
pallet, by adding a trait implementation with our `test_pallet` and add it in
our `construct_runtime!` macro.

**`my-node/runtime/src/lib.rs`**

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

At this point you have the pallet packaged up as it's own crate and included in
your node's runtime.

1. Compile and run your node with:

    ```bash
    cd my-node
    cargo build --release
    ```

2. Purge any existing dev chain (Enter `y` on prompt):

    ```bash
    ./target/release/node-template purge-chain --dev
    ```

3. Start your node:

    ```bash
    ./target/release/node-template --dev
    ```

Finally, start the [Polkadot-JS Apps connecting to your local
node](https://polkadot.js.org/apps/#/explorer?rpc=ws://127.0.0.1:9944) to
confirm that the pallet is working as expected.

> **Notes:** You can also manually set the node URL in Polkadot-JS Apps by
navigating to the **Settings** tab, and have the **remote node/endpoint to
connect to** set to **Local Node**.

## Publish Your Pallet

Once your pallet is no longer in test phase, you should consider publishing
it to GitHub. Go ahead and [create a GitHub
repository](https://help.github.com/en/articles/create-a-repo) and [push your
pallet's code](https://help.github.com/en/articles/pushing-to-a-remote) to it.

With the code on GitHub, your pallet is properly published. Congratulations! Now
we just need to update your node to use the code that is on GitHub instead of a
hard-coded file system path. The final edit to your runtime's `Cargo.toml` file
is to update its dependency on your pallet. The new code is:

**`my-node/runtime/Cargo.toml`**

```TOML
[dependencies.your-pallet-name]
default_features = false
git = "https://github.com/your-username/your-pallet"
branch = "master"

# You may choose a specific commit or tag instead of branch
# rev = "<some commit hash>"
# tag = "<some tag>"
```

Compile one more time and notice that Cargo now grabs your pallet from GitHub
instead of using the local files.

## Next Steps

Congratulations! You've written a Substrate pallet in its own Rust
crate, and published that crate to GitHub. Other blockchain developers can now
easily use your pallet in their runtime by simply including those same four
lines of code in their runtime's `Cargo.toml` files and updating their runtime's
`lib.rs` file.

If you're not sure what to do next, check out the resources below.

### Learn More

- We have [plenty of tutorials](https://substrate.dev/en/tutorials) to showcase
  Substrate development concepts and techniques.
- To learn more about writing your own runtime with a front end, we have a
  [Substrate Collectables
  Workshop](https://substrate.dev/substrate-collectables-workshop) for building
  an end-to-end application.
- For more information about runtime development tips and patterns, refer to our
  [Substrate Recipes](https://substrate.dev/recipes/).

### Examples

- Tutorial on [adding a `Contracts` Pallet into
  runtime](tutorials/adding-a-module-to-your-runtime), so your node can run
  smart contract.

### References

- [The Cargo book](https://doc.rust-lang.org/stable/cargo/)
- More about [Rust and WebAssembly](https://rustwasm.github.io/)

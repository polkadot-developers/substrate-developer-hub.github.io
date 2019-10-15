---
title: "Creating a Runtime Module"
---

In this tutorial, you'll write a Substrate runtime module that lives in its own
crate, and include it in a node based on the node-template.

## Setup Your Development Environment

If you haven't already, follow the
[fast installation](getting-started/installing-substrate#fast-installation) for
getting started on Substrate. It will provide you with all the development
resources you need to build Substrate and the
[`substrate-up` scripts](getting-started/using-the-substrate-scripts) for
quickly setting up new nodes.

### Cloning Node and Module Template to Start

We're not going to write our module directly as part of the node template, but
rather as a separate Rust crate. This approach provides a few advantages:

1. Our module can be easily imported into other nodes in the future.
2. Our module can be published to places like GitHub or Crates.io without
publishing our entire node in the same place.

However, to effectively develop and test with your own runtime module, you need
to first setup a single-node Substrate blockchain. Then inside the node runtime
add in your own additional module.

We'll begin from cloning the necessary repositories:

```bash
cd my-playground-folder
# cloning from a standard node template
git clone https://github.com/substrate-developer-hub/substrate-node-template.git my-node
# cloning from a standard module template
git clone https://github.com/substrate-developer-hub/substrate-module-template.git my-module

# kicking off the node compilation
cd my-node
cargo build --release
```

The compilation of the node may take up to 30 minutes, depending on your hardware.
So let us kickstarted it first.

Now, if our module isn't going to live in the node template, where _is_ it going
to live? If you aren't familiar with creating Rust libraries or using them in
other Rust projects, you can get a more in-depth explanation by reading
[the Cargo book](https://doc.rust-lang.org/cargo/guide/creating-a-new-project.html).

While it's perfectly possible to create a new Substrate runtime module from
scratch, the fastest way is to clone from a Substrate module template, as we
have just done above.

In the `Cargo.toml` file, update the module's name and authorship to something
meaningful. In this tutorial we're focusing on how to create and use the module
rather than writing interesting module logic, so let's call it `test_module`.
The beginning of the `Cargo.toml` now looks like:

**`my-module/Cargo.toml`**

```toml
[package]
name = "test_module"
version = "0.1.0"
authors = ["Your Name"]
edition = "2018"
```

You should be able to successfully compile this template module with:

```bash
cargo build
```

Let's explore some of the things Substrate module template do for us, starting
from the `Cargo.toml` file.

## Development

### Your Module's `std` Feature

In your `my-module/Cargo.toml` file, you will notice a few lines about the
"`std` feature". In Rust, when you enable `std`, you give your project access to
[the Rust standard libraries](https://doc.rust-lang.org/std/). This works just
fine when building native binaries.

However, Substrate also builds the runtime code to WebAssembly(Wasm). In this
case we use cargo features to disable the Rust standard library when compiling
for Wasm because the compiler does not know which allocator to use. See
Reference section for the details.

Thus, all the dependencies we use for our module, and our entire runtime, must
be able to compile with
[`no_std`](https://rust-embedded.github.io/book/intro/no-std.html) feature.
Our `Cargo.toml` file tells our module's dependencies to only use their `std`
feature when this module also uses its `std` feature like so:

**`my-module/Cargo.toml`**

```TOML
[features]
default = ['std']
std = [
    'serde',
    'codec/std',
    'support/std',
    'system/std',
    'sr-primitives/std',
    'runtime-io/std',
]
```

> In general, when adding dependencies to your runtime, follow this pattern.
>
> 1. Add a feature called `std`
> 2. Enable this feature by default in your `Cargo.toml`
> 3. When compiling for Wasm, disable the feature

### Consistent Substrate Dependencies

All Substrate modules will depend on some low-level module libraries such as
`srml-system` and `srml-support`. These libraries are pulled from the main
Substrate GitHub repository. When people build their own Substrate nodes, they
will also have dependencies on the main Substrate repository.

Because of this, you will need to be careful to ensure consistent dependencies
from your module and the node integrating your module to the Substrate
repository. If your module is dependent on one version of Substrate, and the
node is dependent on another, compilation will run into errors where the
Substrate versions may be incompatible, or the two versions of the same library
are being used. Ultimately Cargo will not be able to resolve those conflicts
and you will get a compile time error.

So when building your module have two options:

**Option 1**

If you prefer to have the freshly-baked features from Substrate, you can develop
your module against a specific git commit of Substrate. In future to upgrade,
you can update to a newer git commit of Substrate, recompile and test your
module against the runtime, and then release your module.

In this case you change the Substrate module `Cargo.toml` to use
`rev = <git commit hash>`, e.g.:

```TOML
#--snip--

[dependencies.support]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-support'
rev = '3dedd246c62255ba6f9b777ecba318dfc2078d85'

#--snip--
```

This means that only nodes which use the exact same git commit hash for their
projects can use your module.

**Option 2**

If you prefer to have more stability, you can develop your module against
Substrate's known release tags (e.g.
[`v1.0.0`](https://github.com/paritytech/substrate/tree/v1.0.0)). In this case
you will need to update your node template's `Cargo.toml` to depend on
Substrate's `tag = 'v1.0.0'`, e.g.:

```TOML
#--snip--

[dependencies.support]
default_features = false
git = 'https://github.com/paritytech/substrate.git'
package = 'srml-support'
tag = 'v1.0.0'

#--snip--
```

### Your Module's Dev Dependencies

The final section of the `Cargo.toml` file specifies the dev dependencies.
These are the dependencies that are needed in your module's tests, but not
necessary the actual module itself.

```TOML
#--snip--

[dev-dependencies.primitives]
git = 'https://github.com/paritytech/substrate.git'
package = 'substrate-primitives'
rev = '3dedd246c62255ba6f9b777ecba318dfc2078d85'
```

You can confirm for yourself that the Substrate module template's test passes
with:

```bash
cargo test
```

> Optional: You can remove these dev dependencies from your `Cargo.toml` file
> and confirm that the module still compiles with `cargo build`. However, you
> will notice that `cargo test` does not compile!
>
> If you do this experiment, remember to restore the dev dependencies afterward.

It will take a little experimentation to gain familiarity with what dependencies
you need for each module you dream up. So the take-away is not that `Cargo.toml`
should always look like it does in the template. Rather, `Cargo.toml` needs to
have the correct dependencies and you now know how to specify them.

### Add your Runtime Module to your Node

With our runtime module now compiling and passing it's test, we're ready to add
it to our node.

Continued working in your playground folder, we first need to add our
newly-created crate as a dependency in the node runtime's `Cargo.toml`. Then we
need to tell the module to only build its `std` feature when the runtime itself
does, as followed:

**`my-node/runtime/Cargo.toml`**

```TOML
#--snip--

[dependencies.test_module]
default_features = false
path = "../../my-module"

# toward the bottom
[features]
default = ['std']
std = [
    'test_module/std',
    #--snip--
]
```

> You **must** set `default_features = false` so that your runtime will
successfully compile to wasm.

Next we'll update `runtime/src/lib.rs` to actually use our new runtime module.
We will update the trait implementation with our `test_module` and add it in
our runtime construction macro.

**`my-node/runtime/src/lib.rs`**

```rust
// already existed
impl template::Trait for Runtime {
  type Event = Event;
}

// add the following code block
impl test_module::Trait for Runtime {
	type Event = Event;
}

//...
construct_runtime!(
  pub enum Runtime where
    Block = Block,
    NodeBlock = opaque::Block,
    UncheckedExtrinsic = UncheckedExtrinsic
  {
    //...
    // add the following line
    TestModule: test_module::{Module, Call, Storage, Event<T>},
  }
);
```

### Appreciate your Work 😊

At this point you have the module packaged up as it's own crate, and included in
your node runtime. Compile and run your node with:

```bash
cd my-playground-folder/my-node
# compiling your node
cargo build --release
# purge any existing chain
cargo run --release -- purge-chain --dev
# start the node
cargo run --release -- --dev
```

Finally, start the [Polkadot apps UI](https://polkadot.js.org/apps/#/explorer)
to confirm that the module is working as expected. In the apps UI, you will need
to navigate to the `Settings` tab, and have the `remote node/endpoint to connect to`
set to `Local Node`.

### Publish your Module

Once your module is no longer just testing code, you should consider publishing
it. We'll cover publishing your module to GitHub here, but [crates.io](https://crates.io/)
is another good option. Go ahead and
[create a GitHub repository](https://help.github.com/en/articles/create-a-repo)
and [push your module's code](https://help.github.com/en/articles/pushing-to-a-remote)
to it.

With the code on GitHub, your module is properly published. Congratulations! We
now need to update your node to use the code that is on GitHub instead of a
hard-coded file system path.

The final edit to your runtime's `Cargo.toml` file will update its dependency
on your module. The new code is:

**`my-node/runtime/Cargo.toml`**

```TOML
[dependencies.your-module-name]
default_features = false
git = "https://github.com/your-username/your-module"
branch = "master"

# You may choose a specific commit or tag instead of branch
# rev = "<some commit hash>"
# tag = "<some tag>"
```

Compile one more time and notice that Cargo now grabs your module from GitHub
instead of using the local files.

Congratulations! You've written a Substrate runtime module in its own Rust crate,
and published that crate to GitHub. Other blockchain developers can now easily
use your module in their runtime by simply including those same four lines of
code in their runtime's `Cargo.toml` files and updating their runtime's `lib.rs` file.

## Next Steps

In this tutorial, you've learned to create a runtime module as a Rust crate.
You're now ready to replace the template logic with your own. If you're not sure
what to code, check out [one of our tutorials](https://substrate.dev/en/tutorials).


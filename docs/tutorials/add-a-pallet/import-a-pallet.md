---
title: Import the Nicks Pallet
---

We will now modify the Substrate Developer Hub Node Template to include the Nicks pallet; this
pallet allows blockchain users to pay a deposit to reserve a nickname and associate it with an
account they control.

Open the Node Template in your favorite code editor. We will be editing two files:
`runtime/src/lib.rs`, and `runtime/Cargo.toml`.

```
substrate-node-template
|
+-- runtime
|   |
|   +-- Cargo.toml    <-- One change in this file
|   |
|   +-- build.rs
|   |
|   +-- src
|       |
|       +-- lib.rs     <-- Most changes in this file
|
+-- pallets
|
+-- scripts
|
+-- node
|
+-- ...
```

## Importing a Pallet Crate

The first thing you need to do to add the Nicks pallet is to import the `pallet-nicks` crate in your
runtime's `Cargo.toml` file. If you want a proper primer into Cargo References, you should check out
[their official documentation](https://doc.rust-lang.org/cargo/reference/index.html).

Open `substrate-node-template/runtime/Cargo.toml` and you will see a list of all the dependencies
your runtime has. For example, it depends on the
[Balances pallet](https://substrate.dev/rustdocs/v2.0.0-rc6):

**`runtime/Cargo.toml`**

```TOML
[dependencies.pallet-balances]
default-features = false
git = 'https://github.com/paritytech/substrate.git'
tag = 'v2.0.0-rc6'
version = '2.0.0-rc6'
```

### Crate Features

One important thing we need to call out with importing pallet crates is making sure to set up the
crate `features` correctly. In the code snippet above, you will notice that we set
`default_features = false`. If you explore the `Cargo.toml` file even closer, you will find
something like:

**`runtime/Cargo.toml`**

```TOML
[features]
default = ['std']
std = [
    'codec/std',
    'frame-executive/std',
    'frame-support/std',
    'frame-system/std',
    'frame-system-rpc-runtime-api/std',
    'pallet-aura/std',
    'pallet-balances/std',
    #--snip--
]
```

This second line defines the `default` features of your runtime crate as `std`. You can imagine,
each pallet crate has a similar configuration defining the default feature for the crate. Your
feature will determine the features that should be used on downstream dependencies. For example, the
snippet above should be read as:

> The default feature for this Substrate runtime is `std`. When `std` feature is enabled for the
> runtime, `codec`, `frame-executive`, `frame-support`, and all the other listed dependencies should
> use their `std` feature too.

This is important to enable the Substrate runtime to compile to both native binaries, which support
Rust [`std`](https://doc.rust-lang.org/std/), and [Wasm](https://webassembly.org/) binaries, which
do not (see: [`no_std`](https://rust-embedded.github.io/book/intro/no-std.html)).

The use of Wasm runtime binaries is one of Substrate's defining features. It allows the runtime code
to become a part of a blockchain's evolving state; it also means that the definition of the runtime
itself is subject to the cryptographic consensus mechanisms that ensure the security of the
blockchain network. The usage of Wasm runtimes enables one of Substrate's most innovative features:
forkless runtime upgrades, which means that Substrate blockchain nodes can stay up-to-date and even
acquire new features without needing to be replaced with an updated application binary.

To see how the `std` and `no_std` features are actually used in the runtime code, we can open the
project file:

**`runtime/src/lib.rs`**

```rust
#![cfg_attr(not(feature = "std"), no_std)]
// `construct_runtime!` does a lot of recursion and requires us to increase the limit to 256.
#![recursion_limit="256"]

// Make the WASM binary available.
#[cfg(feature = "std")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

// --snip--
```

You can see that at the top of the file, we define that we will use `no_std` when we are _not_ using
the `std` feature. A few lines lower you can see `#[cfg(feature = "std")]` above the
`wasm_binary.rs` import, which is a flag saying to only import the Wasm binary when we have enabled
the `std` feature.

### Importing the Nicks Pallet Crate

Okay, now that we have covered the basics of crate features, we can actually import the Nicks
pallet. The Nicks pallet is one of the simpler pallets in FRAME, so it makes for a good example of
the common points you need to consider when adding a pallet to your runtime.

First we will add the new dependency by simply copying an existing pallet and changing the values.
So based on the `balances` import shown above, the `nicks` import will look like:

**`runtime/Cargo.toml`**

```TOML
[dependencies.pallet-nicks]
git = 'https://github.com/paritytech/substrate.git'
default-features = false
tag = 'v2.0.0-rc6'
version = '2.0.0-rc6'
```

As with other pallets, the Contracts pallet has an `std` feature. We should build its `std` feature
when the runtime is built with its own `std` feature. Add the following line to the runtime's `std`
feature.

**`runtime/Cargo.toml`**

```TOML
[features]
default = ["std"]
std = [
    #--snip--
    'pallet-nicks/std',
    #--snip--
]
```

If you forget to set the feature, when building to your native binaries you will get errors like:

```rust
error[E0425]: cannot find function `memory_teardown` in module `sandbox`
  --> ~/.cargo/git/checkouts/substrate-7e08433d4c370a21/83a6f1a/primitives/sandbox/src/../without_std.rs:53:12
   |
53 |         sandbox::memory_teardown(self.memory_idx);
   |                  ^^^^^^^^^^^^^^^ not found in `sandbox`

error[E0425]: cannot find function `memory_new` in module `sandbox`
  --> ~/.cargo/git/checkouts/substrate-7e08433d4c370a21/83a6f1a/primitives/sandbox/src/../without_std.rs:72:18
   |
72 |         match sandbox::memory_new(initial, maximum) {
   |

...
```

Before moving on, check that the new dependencies resolve correctly by running:

```bash
cargo check
```

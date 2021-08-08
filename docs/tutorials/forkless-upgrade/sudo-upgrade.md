---
title: Sudo Upgrade
---

## Start the Template Node

Since forkless runtime upgrades do not require network participants to restart their blockchain
clients, the first step of this tutorial is to start the template node as-is. Build and start the
unmodified [Node Template](https://github.com/substrate-developer-hub/substrate-node-template).

```shell
cargo run --release -- --dev --tmp
```

> **Leave this node running!** Notice that the node will not be restarted as part of this tutorial
> despite the fact that two runtime upgrades are performed.
> You will be editing and re-compiling the node's runtime code, but _do not_ stop and restart the
> node to prove to yourself that the runtime upgrade is in fact done on an _active_ (dev) network,
> not a rebuilt or restarted one.

By default, the [well-known Alice account](../../knowledgebase/integrate/subkey#well-known-keys) is
configured as the holder of the Sudo pallet's key in the `development_config` function of the
template node's
[chain specification file](https://github.com/substrate-developer-hub/substrate-node-template/blob/v3.0.0/node/src/chain_spec.rs) -
this is the configuration that is used when the node is launched with the `--dev` flag. This means
that Alice's account will be the one used to perform runtime upgrades throughout this tutorial.

## Runtime Upgrade Resource Accounting

Dispatchable calls in Substrate are always associated with a
[weight](../../knowledgebase/learn-substrate/weight), which is used for resource accounting. FRAME's
System module bounds extrinsics to a block
[`BlockLength`](https://substrate.dev/rustdocs/latest/frame_system/limits/struct.BlockLength.html) and
[`BlockWeights`](https://substrate.dev/rustdocs/latest/frame_system/limits/struct.BlockWeights.html) limit.
The `set_code` function in
[the `System` module](https://github.com/paritytech/substrate/blob/v3.0.0/frame/system/src/lib.rs) is
intentionally designed to consume the maximum weight that may fit in a block.

> The runtime upgrade should consume the entire block to avoid extrinsics trying to execute
> on a different version of a runtime when called. Although theoretically one may be able to
> use [transaction priority](../../knowledgebase/learn-substrate/tx-pool#transaction-priority)
> and carefully study the FRAME logic involved to allow for other extrinsics to be dispatched
> in the same block as the upgrade, it is a very poor idea to try to do this for almost
> any blockchain: it is worth to spend one block to keep this operation clean and reduce
> chance of error. This study is outside the scope of this tutorial.

The [`set_code` function](https://substrate.dev/rustdocs/latest/src/frame_system/lib.rs.html#329-337)'s
weight annotation also specifies that the extrinsic call is in
[the `Operational` class](../../knowledgebase/runtime/fees#operational-dispatches) of dispatchable
function, which identifies it as relating to network _operations_ and impacts the accounting of its
resources, such as by exempting it from the
[`TransactionByteFee`](https://substrate.dev/rustdocs/latest/pallet_transaction_payment/trait.Config.html#associatedtype.TransactionByteFee).

### Use `sudo` to dispatch

As the name of the [Sudo pallet](../../knowledgebase/runtime/frame#sudo) implies, it provides
capabilities related to the management of a single
[`sudo` ("superuser do")](https://en.wikipedia.org/wiki/Sudo) administrator. In FRAME, the `Root`
Origin is used to identify the runtime administrator; some of FRAME's features, including the
ability to update the runtime by way of
[the `set_code` function](https://substrate.dev/rustdocs/latest/frame_system/pallet/enum.Call.html#variant.set_code),
are only accessible to this administrator. The Sudo pallet maintains a single
[storage item](../../knowledgebase/runtime/storage): the ID of the account that has access to the
pallet's [dispatchable functions](../../knowledgebase/getting-started/glossary#dispatch). The Sudo
pallet's `sudo` function allows the holder of this account to invoke a dispatchable as the `Root`
origin.

The following pseudo-code demonstrates how this is achieved, refer to the
[Sudo pallet's source code](https://github.com/paritytech/substrate/blob/v3.0.0/frame/sudo/src/lib.rs)
to learn more.

```rust
fn sudo(origin, call) -> Result {
  // Ensure caller is the account identified by the administrator key
  let sender = ensure_signed(origin)?;
  ensure!(sender == Self::key(), Error::RequireSudo);

  // Dispatch the specified call as the Root origin
  let res = call.dispatch(Origin::Root);
  Ok()
}
```

### `sudo` to Override Resource Accounting

In order to work around resource accounting within FRAME's safeguards, the Sudo pallet provides the
[`sudo_unchecked_weight`](https://substrate.dev/rustdocs/latest/pallet_sudo/enum.Call.html#variant.sudo_unchecked_weight)
function, which provides the same capability as the `sudo` function, but accepts an additional
parameter that is used to specify the (possibly zero) weight to use for the call. The
`sudo_unchecked_weight` function is what will be used to invoke the runtime upgrade in this section
of this tutorial; in the next section, the Scheduler pallet will be used to manage the resources
consumed by the `set_code` function.

> Here we allow for a block that may take _an indefinite time to compute_ intentionally: to ensure
> that our runtime upgrade does not fail, no matter how complex the operation is. It could take all
> the time it needs to succeed or fail.

## Prepare an Upgraded Runtime

### Add the `Scheduler` Pallet

Because the template node doesn't come with the
[Scheduler pallet](https://substrate.dev/rustdocs/latest/pallet_scheduler/index.html) included in
its runtime, the first runtime upgrade performed in this tutorial will add that pallet.
First, add the Scheduler pallet as a dependency in the template node's runtime Cargo file.

**`runtime/Cargo.toml`**

```toml
pallet-scheduler = { default-features = false, version = '3.0.0' }

#--snip--

[features]
default = ['std']
std = [
    #--snip--
    'pallet-scheduler/std',
    #--snip--
]
```

Next, add the pallet to the runtime:

**`runtime/src/lib.rs`**

```rust
/// Define the types required by the Scheduler pallet.
parameter_types! {
  pub MaximumSchedulerWeight: Weight = 10_000_000;
  pub const MaxScheduledPerBlock: u32 = 50;
}

/// Configure the runtime's implementation of the Scheduler pallet.
impl pallet_scheduler::Config for Runtime {
  type Event = Event;
  type Origin = Origin;
  type PalletsOrigin = OriginCaller;
  type Call = Call;
  type MaximumWeight = MaximumSchedulerWeight;
  type ScheduleOrigin = frame_system::EnsureRoot<AccountId>;
  type MaxScheduledPerBlock = MaxScheduledPerBlock;
  type WeightInfo = ();
}

// Add the Scheduler pallet inside the construct_runtime! macro.
construct_runtime!(
  pub enum Runtime where
    Block = Block,
    NodeBlock = opaque::Block,
    UncheckedExtrinsic = UncheckedExtrinsic
  {
    /*** snip ***/
    Scheduler: pallet_scheduler::{Module, Call, Storage, Event<T>},
  }
);
```

The final step to preparing an upgraded FRAME runtime is to increment its
[`spec_version`](https://substrate.dev/rustdocs/latest/sp_version/struct.RuntimeVersion.html#structfield.spec_version),
which is a member of
[the `RuntimeVersion` struct](https://substrate.dev/rustdocs/latest/sp_version/struct.RuntimeVersion.html):

**`runtime/src/lib.rs`**

```rust
pub const VERSION: RuntimeVersion = RuntimeVersion {
  spec_name: create_runtime_str!("node-template"),
  impl_name: create_runtime_str!("node-template"),
  authoring_version: 1,
  spec_version: 101,  // *Increment* this value, the template uses 100 as a base
  impl_version: 1,
  apis: RUNTIME_API_VERSIONS,
  transaction_version: 1,
};
```

Take a moment to review the components of the `RuntimeVersion` struct:

- `spec_name`: The name of the runtime/chain, e.g. Ethereum.
- `impl_name`: The name of the client, e.g. OpenEthereum.
- `authoring_version`: The authorship version for
  [block authors](../../knowledgebase/getting-started/glossary#author).
- `spec_version`: The version of the runtime/chain.
- `impl_version`: The version of the client.
- `apis`: The list of supported APIs.
- `transaction_version`: The version of the
  [dispatchable function](../../knowledgebase/getting-started/glossary#dispatch) interface.

In order to upgrade the runtime it is _required_ to _increase_ the `spec_version`; refer to the
implementation of the
[FRAME System](https://github.com/paritytech/substrate/blob/v3.0.0/frame/system/src/lib.rs) module
and in particular the `can_set_code` function to to see how this requirement and others are enforced
by runtime logic.

### Build the Upgraded Runtime

Note: keep your node running! You should use a new terminal to compile the runtime:

```shell
# Here we *only* build the runtime, the node has not been changed.
cargo build --release -p node-template-runtime
```

> Get stuck? Here is a
> [solution](https://github.com/substrate-developer-hub/substrate-node-template/tree/tutorials/solutions/runtime-upgrade-v3)
> to check against. See the `diff` in the commit history for details.

Here the `--release` flag will result in a longer compile time, but also generate a smaller build
artifact that is better suited for submitting to the blockchain network: storage minimization
and optimizations are _critical_ for any blockchain.

As we are _only_ building the runtime, Cargo looks in runtime
`cargo.toml` file for requirements and only executes these. Notice the
[`runtime/build.rs` file](https://doc.rust-lang.org/cargo/reference/build-scripts.html) that
cargo looks for build the Wasm of your runtime that is specified in `runtime/lib.rs`.

When the `--release` flag is specified, build artifacts are output to the
`target/release` directory; when the flag is omitted they will be sent to `target/debug`. Refer to
[the official documentation](https://doc.rust-lang.org/cargo/commands/cargo-build.html) to learn
more about building Rust code with Cargo.

## Upgrade the Runtime

Use this link to open the Polkadot JS Apps UI and automatically configure the UI to connect to the
local node: https://polkadot.js.org/apps/#/extrinsics?rpc=ws://127.0.0.1:9944.

> Some ad blockers and browser restrictions (e.g. the built-in Shield in Brave browser, and https
> requirement for socket connection in Firefox) interfere with connecting to a local node. Make sure
> to check them and, if needed, turn them off. You may not get connecting from a remote IP (like `polkadot.js.org/apps/`)
> to a local node working. If you are unable to solve this, we encourage you to
> host your app locally, like [the apps UI](https://github.com/polkadot-js/apps#development).

Use Alice's account to invoke the `sudoUncheckedWeight` function and use the `setCode` function from the system
pallet as its parameter. In order to supply the build artifact that was generated by the previous
build step, toggle the "file upload" switch on the right-hand side of the "code" input field for the
parameter to the `setCode` function. Click the "code" input field, and select the Wasm binary that
defines the upgraded runtime:
`target/release/wbuild/node-template-runtime/node_template_runtime.compact.wasm`. Leave the value
for the `_weight` parameter at the default of `0`. Click "Submit Transaction" and then "Sign and
Submit".

![Sudo Upgrade Panel](assets/tutorials/forkless-upgrade/sudo-upgrade.png)

After the transaction has been included in a block, the version number in the upper-left-hand corner
of Polkadot JS Apps UI should reflect that the runtime version is now `101`.

![Runtime Version 101](assets/tutorials/forkless-upgrade/version-101.png)

If you still see your node producing blocks in the terminal it's running and reported
on the UI, you have performed a successful _forkless_ runtime upgrade! Congrats!!!

## Next Steps

<!--
TODO: add reference to tutorial or recipe on storage migrations when avalible
https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/issues/766
-->

- Learn about [storage migrations](../../knowledgebase/runtime/upgrades#storage-migrations) and
attempt one alongside a runtime upgrade.

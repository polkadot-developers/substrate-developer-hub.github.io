---
title: Upgrades
---

The enablement of forkless runtime upgrades is one of the defining characteristics of the Substrate
framework for blockchain development. This capability is made possible by including the definition
of the state transition function, i.e. the runtime itself, as an element in the blockchain's
evolving runtime state. This allows network maintainers to leverage the blockchain's capabilities
for trustless, decentralized consensus to securely make enhancements to the runtime.

In the FRAME system for runtime development, the System library defines
[the `set_code` call](https://substrate.dev/rustdocs/latest/frame_system/pallet/enum.Call.html#variant.set_code)
that is used to update the definition of the runtime. The
[Forkless Upgrade a Chain tutorial](../../tutorials/forkless-upgrade/scheduled-upgrade) describes the details
of FRAME runtime upgrades and demonstrates two mechanisms for performing them. Both upgrades
demonstrated in that tutorial are strictly _additive_, which means that they modify the runtime by
means of _extending_ it as opposed to _updating_ the existing runtime state. In the event that a
runtime upgrade defines changes to existing state, it will likely be necessary to perform a "storage
migration".

## Runtime Versioning

In order for the [executor](../advanced/executor) to be able to select the appropriate runtime
execution environment, it needs to know the `spec_name`, `spec_version` and `authoring_version` of
both the native and Wasm runtime.

The runtime provides a
[runtime version struct](https://substrate.dev/rustdocs/latest/sp_version/struct.RuntimeVersion.html).
A sample runtime version struct is shown below:

```rust
pub const VERSION: RuntimeVersion = RuntimeVersion {
  spec_name: create_runtime_str!("node-template"),
  impl_name: create_runtime_str!("node-template"),
  authoring_version: 1,
  spec_version: 1,
  impl_version: 1,
  apis: RUNTIME_API_VERSIONS,
  transaction_version: 1,
};
```

- `spec_name`: The identifier for the different Substrate runtimes.

- `impl_name`: The name of the implementation of the spec. This is of little consequence for the
  node and serves only to differentiate code of different implementation teams.

- `authoring_version`: The version of the authorship interface. An authoring node will not attempt
  to author blocks unless this is equal to its native runtime.

- `spec_version`: The version of the runtime specification. A full node will not attempt to use its
  native runtime in substitute for the on-chain Wasm runtime unless all of `spec_name`,
  `spec_version`, and `authoring_version` are the same between Wasm and native.

- `impl_version`: The version of the implementation of the specification. Nodes are free to ignore
  this; it serves only as an indication that the code is different; as long as the other two
  versions are the same then while the actual code may be different, it is nonetheless required to
  do the same thing. Non-consensus-breaking optimizations are about the only changes that could be
  made which would result in only the `impl_version` changing.

- `transaction_version`: The version of the extrinsics interface. This number must be updated in the
  following circumstances: extrinsic parameters (number, order, or types) have been changed;
  extrinsics or pallets have been removed; or the pallet order in the `construct_runtime!` macro
  _or_ extrinsic order in a pallet has been changed. If this number is updated, then the
  `spec_version` must also be updated.

- `apis` is a list of supported
  [runtime APIs](https://substrate.dev/rustdocs/latest/sp_api/macro.impl_runtime_apis.html) along
  with their versions.

As mentioned above, the executor always verifies that the native runtime has the same
consensus-driven logic before it chooses to execute it, independent of whether the version is higher
or lower.

> **Note:** The runtime versioning is manually set. Thus the executor can still make inappropriate
> decisions if the runtime version is misrepresented.

### Accessing the Runtime Version

The runtime version is useful for application or integration developers that are building on a FRAME
runtime. The FRAME runtime system exposes this information by way of the `state.getRuntimeVersion`
RPC endpoint, which accepts an optional block identifier. Most developers building on a FRAME-based
blockchain will use the [runtime's metadata](metadata) to understand the APIs the runtime exposes
and the requirements for interacting with these APIs. The runtime's metadata should _only_ change
when the chain's
[runtime `spec_version`](https://substrate.dev/rustdocs/latest/sp_version/struct.RuntimeVersion.html#structfield.spec_version)
changes.

## Forkless Runtime Upgrades

Traditional blockchains require a [hard fork](<https://en.wikipedia.org/wiki/Fork_(blockchain)>)
when upgrading the state transition function of their chain. This requires node operators to stop
their nodes and manually upgrade to the latest executable. For distributed production networks,
coordination of a hard fork upgrades can be a complex process.

The culmination of the properties listed on this page allows for Substrate-based blockchains to
perform "forkless runtime upgrades". This means that the upgrade of the runtime logic can happen in
real time without causing a fork in the network.

To perform a forkless runtime upgrade, Substrate uses existing runtime logic to update the Wasm
runtime stored on the blockchain to a new consensus-breaking version with new logic. This upgrade
gets pushed out to all syncing nodes on the network as a part of the consensus process. Once the
Wasm runtime is upgraded, the executor will see that the native runtime `spec_name`, `spec_version`,
or `authoring_version` no longer matches this new Wasm runtime. As a result, it will fall back to
execute the canonical Wasm runtime instead of using the native runtime in any of the execution
processes.

## Storage Migrations

Storage migrations are custom, one-time functions that allow developers to rework existing storage
in order to convert it to conform to updated expectations. For instance, imagine a runtime upgrade
that changes the data type used to represent user balances from an _unsigned_ integer to a _signed_
integer - in this case, the storage migration would read the existing value as an unsigned integer
and write back an updated value that has been converted to a signed integer. Failure to perform a
storage migration when needed will result in the runtime execution engine misinterpreting the
storage values that represent the runtime state and lead to undefined behavior. Substrate runtime
storage migrations fall into a category of storage management broadly referred to as
"[data migrations](https://en.wikipedia.org/wiki/Data_migration)".

### Storage Migrations with FRAME

FRAME storage migrations are implemented by way of
[the `OnRuntimeUpgrade` trait](https://substrate.dev/rustdocs/latest/frame_support/traits/trait.OnRuntimeUpgrade.html),
which specifies a single function, `on_runtime_upgrade`. This function provides a hook that allows
runtime developers to specify logic that will run immediately _after_ a runtime upgrade but _before_
any [extrinsics or even the `on_initialize` function](execution#executing-a-block) has executed.

### Preparing for a Migration

Preparing for a storage migration means understanding the changes that are defined by a runtime
upgrade. The Substrate repository uses
[the `D1-runtime-migration` label](https://github.com/paritytech/substrate/pulls?q=is%3Apr+label%3AD1-runtime-migration)
to designate such changes.

### Writing a Migration

Each runtime migration will be different, but there are certain conventions and best practices that
should be followed.

- Extract migrations into reusable functions and write tests for them.
- Include logging in migrations to assist in debugging.
- Remember that migrations are executed within the context of the _upgraded_ runtime, which means
  that migration code may need to include deprecated types, as in
  [this example](https://github.com/hicommonwealth/substrate/blob/5f3933f5735a75d2d438341ec6842f269b886aaa/frame/indices/src/migration.rs#L5-L22).
- Use storage versions to make migrations safer by making them more declarative, as in
  [this example](https://github.com/paritytech/substrate/blob/c79b522a11bbc7b3cf2f4a9c0a6627797993cb79/frame/elections-phragmen/src/lib.rs#L119-L157).

### Ordering Migrations

By default, FRAME will order the execution of `on_runtime_upgrade` functions according to the order
in which the pallets appear in the `construct_runtime!` macro - in particular, they will run in
_reverse_ (top-to-bottom) order. FRAME exposes a capability to inject storage migrations in a custom
order, if needed (see an
[example here](https://github.com/hicommonwealth/edgeware-node/blob/7b66f4f0a9ec184fdebcccd41533acc728ebe9dc/node/runtime/src/lib.rs#L845-L866)).

FRAME storage migrations will run in this order:

1. `frame_system::on_runtime_upgrade`
2. Custom `on_runtime_upgrade`, as described above
3. All `on_runtime_upgrade` functions defined in the pallets included in the runtime, in the order
   described above

> **Note**
>
> If you are running on a Substrate version after [commit `#bd8c1cae`](https://github.com/paritytech/substrate/commit/bd8c1cae434dd6050833555e14967e3cd936e004), the storage migration order has been updated
> to:
>
> 1. Custom `on_runtime_upgrade`
> 2. `frame_system::on_runtime_upgrade`
> 3. All `on_runtime_upgrade` functions defined in all included pallets.
>
> The reason is to cater for scenarios where one needs to write custom code to make
> `frame_system::on_runtime_upgrade` run and return successfully. Refer to the details [here](https://github.com/paritytech/substrate/issues/8683).

### Testing Migrations

It is important to test storage migrations and a number of utilities exist to assist in this
process. The [Substrate Debug Kit](https://github.com/paritytech/substrate-debug-kit) includes a
[Remote Externalities](https://github.com/paritytech/substrate-debug-kit/tree/master/remote-externalities)
tool that allows storage migration unit testing to be safely performed on live chain data. The
[Fork Off Substrate](https://github.com/maxsam4/fork-off-substrate) script makes it easy to create a
chain specification that can be used to bootstrap a local test chain for testing runtime upgrades
and storage migrations.

## Learn More

- Parity Runtime Engineer Alexander Popiak maintains a
  [Substrate Migrations](https://github.com/apopiak/substrate-migrations) repository with lots of
  helpful information about Substrate runtime upgrades and storage migrations.

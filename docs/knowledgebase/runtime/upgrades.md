---
title: Runtime Upgrades
---

The enablement of forkless runtime upgrades is one of the defining characteristics of the Substrate
framework for blockchain development. This capability is made possible by including the definition
of the state transition function, i.e. the runtime itself, as an element in the blockchain's
evolving runtime state. This allows network maintainers to leverage the blockchain's capabilities
for trustless, decentralized consensus to securely make enhancements to the runtime.

In the FRAME system for runtime development, the System library defines
[the `set_code` call](https://substrate.dev/rustdocs/v2.0.0/frame_system/enum.Call.html#variant.set_code)
that is used to update the definition of the runtime. The
[Upgrade a Chain tutorial](../../tutorials/upgrade-a-chain/scheduled-upgrade) describes the details
of FRAME runtime upgrades and demonstrates two mechanisms for performing them. Both upgrades
demonstrated in that tutorial are strictly _additive_, which means that they modify the runtime by
means of _extending_ it as opposed to _updating_ the existing runtime state. In the event that a
runtime upgrade defines changes to existing state, it will likely be necessary to perform a "storage
migration".

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
[the `OnRuntimeUpgrade` trait](https://substrate.dev/rustdocs/v2.0.0/frame_support/traits/trait.OnRuntimeUpgrade.html),
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
1. Custom `on_runtime_upgrade`, as described above
1. All `on_runtime_upgrade` functions defined in the pallets included in the runtime, in the order
   described above

### Testing Migrations

It is important to test storage migrations and a number of utilities exist to assist in this
process. The [Substrate Debug Kit](https://github.com/paritytech/substrate-debug-kit) includes a
[Remote Externalities](https://github.com/paritytech/substrate-debug-kit/tree/master/remote-externalities)
tool that allows storage migration unit testing to be safely performed on live chain data. The
[Fork Off Substrate](https://github.com/maxsam4/fork-off-substrate) script makes it easy to create a
chain specification that can be used to bootstrap a local test chain for testing runtime upgrades
and storage migrations.

## Learn More

- Read more about runtime upgrades in the [Executor documentation](../advanced/executor).
- Parity Runtime Engineer Alexander Popiak maintains a
  [Substrate Migrations](https://github.com/apopiak/substrate-migrations) repository with lots of
  helpful information about Substrate runtime upgrades and storage migrations.

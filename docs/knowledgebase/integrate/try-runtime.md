---
title: Try Runtime
---

The `try-runtime` tool is built to query a snapshot of runtime storage, using an [in-memory-externalities][testextern-rustdocs] to store state. In this way,
it enables runtime engineers to write tests for a specified runtime state.
Being part of [`sc-cli`][sc-cli-rustdocs], it is designed to be used as a command line interface to specify at which block to query state.

In its simplest form, `try-runtime` is a tool that enables:

1. Connecting to a remote node and calling into some runtime API.
2. Scraping the specified state from a node at a given block.
3. Writing tests for that data.

> **Note:** This tool is designed to be used for testing against real chain state _before_ going to production.

## Motivation

The initial motivation for `try-runtime` came from the need to test runtime changes against state from a real chain. Prior [`TestExternalities`][testextern-rustdocs] and [`BasicExternalities`][basicextern-rustdocs] existed for writing unit and integrated tests with mock data, but lacked an avenue to test against a chain's actual state. `try-runtime` extends [`TestExternalities`][testextern-rustdocs] and [`BasicExternalities`][basicextern-rustdocs] by scraping state (which is stored with key value pairs) via a node's RPC endpoints [`getStorage`][get-storage] and [`getKeysPaged`][storage-keys-paged] and inserting them into `TestExternalities`.

## How it works

The `try-runtime` tool has its own implementation of externalities called [`remote_externalities`][remoteextern-rustdocs] which is just a builder wrapper around `TestExternalities` that uses
a generic [key-value store](/docs/en/knowledgebase/advanced/storage) where data is [SCALE encoded](/docs/en/knowledgebase/advanced/codec).

The diagram below illustrates the way externalities sits outside a compiled runtime as a means to capture
the storage of that runtime.

|                 Storage externalities                 |              Testing with externalities               |
| :---------------------------------------------------: | :---------------------------------------------------: |
| ![image](/docs/assets/advanced/try-runtime-ext-1.png) | ![image](/docs/assets/advanced/try-runtime-ext-2.png) |

With `remote_externalities`, developers can capture some chain state and run tests on it. Essentially, `RemoteExternalities` will populate a `TestExternalities` with a real chain's data.

In order to query state, `try-runtime` makes use of Substrate's RPCs, namely [`StateApi`][stateapi-rustdocs]. In particular:

- [`storage`][stateapi-storage-rustdocs]: A method which returns a storage value under the given key.
- [`storage_key_paged`][stateapi-storage-keys-paged-rustdocs]: A method which returns the keys with prefix with pagination support.

## Usage

The most common use case for `try-runtime` is with storage migrations and runtime upgrades.

There are a number of flags that should be set on the node try-runtime is completing RPC queries against in order to work well with the large payloads, namely:

- set `--rpc-max-payload 1000` to ensure large RPC queries can work.
- set `--rpc-cors all` to ensure ws connections can come through.

> **Tip:** Combine `try-runtime` with [`fork-off-substrate`][fork-off-gh] to test your chain before
> production. Use `try-runtime` to test your chain's migration and its pre and post states. Then,
> use `fork-off-substrate` if you want to check that block production continues fine after the
> migration, and do some other arbitrary testing.

### Calling into hooks from `OnRuntimeUpgrade`

By default, there are two ways of defining a runtime upgrade in the runtime. The `OnRuntimeUpgrade` trait provides the [different methods][onruntimeupgrade-method-rustdocs] to achieve this.

- **From inside a runtime**. For example:

  ```rust
  struct Custom;
  impl OnRuntimeUpgrade for Custom {
  	fn on_runtime_upgrade() -> Weight {
  		// -- snip --
  	}
  }
  ```

- **From inside a pallet**. For example:
  ```rust
  #[pallet::hooks]
  impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
  	fn on_runtime_upgrade() -> Weight {
  		// -- snip --
  	}
  }
  ```

These hooks will specify _what should happen upon a runtime upgrade_. For testing purposes, we prefer having hooks that allow us to inspect the state _before_ and _after_ a runtime upgrade as well.

These hooks are not available by default, and are only available under a specific feature flag, named `try-runtime`.

> Refer to [this how-to guide][integrate-try-runtime-htg] on how to integrate `try-runtime` to your project.

The new hooks are as follows:

```rust
#[cfg(feature = "try-runtime")]
fn pre_upgrade() -> Result<(), &'static str> { Ok(()) }

#[cfg(feature = "try-runtime")]
fn post_upgrade() -> Result<(), &'static str> { Ok(()) }
```

### Helper functions

[`OnRuntimeUpgradeHelpersExt`][oru-helpers-ext-rustdocs] are a set of helper functions made available from
[`frame_support::hooks`][hooks-rustdocs] in order to use `try-runtime` for testing storage migrations. These include:

- **`storage_key`**: Generates a storage key unique to this runtime upgrade. This can be used to communicate data from pre-upgrade to post-upgrade state and check them.
- **`set_temp_storage`**: Writes some temporary data to a specific storage that can be read (potentially in the post-upgrade hook).
- **`get_temp_storage`** : Gets temporary storage data written by `set_temp_storage`.

Using the [`frame_executive::Executive`][executive-rustdocs] struct, these helper functions in action would look like:

```rust
pub struct CheckTotalIssuance;
impl OnRuntimeUpgrade for CheckTotalIssuance {
	#[cfg(feature = "try-runtime")]
	fn post_upgrade() {
		// iterate over all accounts, sum their balance and ensure that sum is correct.
	}
}

pub struct EnsureAccountsWontDie;
impl OnRuntimeUpgrade for EnsureAccountsWontDie {
	#[cfg(feature = "try-runtime")]
	fn pre_upgrade() {
		let account_count = frame_system::Accounts::<Runtime>::iter().count();
		Self::set_temp_storage(account_count, "account_count");
	}

	#[cfg(feature = "try-runtime")]
	fn post_upgrade() {
		// ensure that this migration doesn't kill any account.
		let post_migration = frame_system::Accounts::<Runtime>::iter().count();
		let pre_migration = Self::get_temp_storage::<u32>("account_count");
		ensure!(post_migration == pre_migration, "error ...");
	}
}

pub type CheckerMigrations = (EnsureAccountsWontDie, CheckTotalIssuance);
pub type Executive = Executive<_, _, _, _, (CheckerMigrations)>;
```

### CLI interface

To use `try-runtime` from the command line, run your node with the `--features=try-runtime` flag.

The possible sub-commands include:

- **`on-runtime-upgrade`**: Executes "tryRuntime_on_runtime_upgrade" against the given runtime state.
- **`offchain-worker`**: Executes "offchainWorkerApi_offchain_worker" against the given runtime state.
- **`execute-block`**: Executes "core_execute_block" using the given block and the runtime state of the parent block.
- **`follow-chain`**: Follows a given chain's finalized blocks and applies to all its extrinsics. This allows the
  behavior of a new runtime to be inspected over a long period of time, with real transactions coming as input.

For example, running `try-runtime` with the "on-runtime-upgrade" subcommand on a chain
running locally:

```bash
cargo run --release --features=try-runtime try-runtime on-runtime-upgrade live ws://localhost:9944
```

#### Other scenarios

Using it to re-execute code from a `ElectionProviderMultiPhase` off-chain worker:

```bash
cargo run -- --release \
	--features=try-runtime \
	try-runtime \
	--execution Wasm \
	--wasm-execution Compiled \
	offchain-worker \
	--header-at 0x491d09f313c707b5096650d76600f063b09835fd820e2916d3f8b0f5b45bec30 \
	live \
	-b 0x491d09f313c707b5096650d76600f063b09835fd820e2916d3f8b0f5b45bec30 \
	-m ElectionProviderMultiPhase
	ws//$HOST:9944
```

> **Tip:** pass in the --help flag after each subcommand to see the command's different options.

Run the migrations of the local runtime on the state of SomeChain, for example:

```bash
RUST_LOG=runtime=trace,try-runtime::cli=trace,executor=trace \
	cargo run try-runtime \
	--execution Native \
	--chain somechain-dev \
	on-runtime-upgrade \
	live \
	--uri wss://rpc.polkadot.io
```

Running it at a specific block number's state:

```bash
RUST_LOG=runtime=trace,try-runtime::cli=trace,executor=trace \
	cargo run try-runtime \
	--execution Native \
	--chain dev \
	--no-spec-name-check \ # mind this one!
	on-runtime-upgrade \
	live \
	--uri wss://rpc.polkadot.io \
	--at <block-hash>
```

## Next Steps

### Learn More

- [Integrate `try-runtime`][integrate-tryruntime-htg] how-to guide
- [Storage keys](/docs/en/knowledgebase/advanced/storage#storage-value-keys)
- [`OnRuntimeUpgrade`][onruntimeupgrade-method-rustdocs] FRAME trait
- [`try-runtime-upgrade`][executive-try-runtime-rustdocs] from `frame_executive`
- [`set_storage`][get-storage-rustdocs] from `sp_core::traits::Externalities`
- [storage_keys_paged][storage-keys-paged-rustdocs] from `sc_rpc::state::StateApi`

## Examples

- `try-runtime` in [FRAME's Staking pallet][staking-frame]

[tryruntime-api-rustdocs]: https://substrate.dev/rustdocs/latest/frame_try_runtime/trait.TryRuntime.html
[testextern-rustdocs]: https://substrate.dev/rustdocs/latest/sp_state_machine/struct.TestExternalities.html
[basicextern-rustdocs]: https://substrate.dev/rustdocs/latest/sp_state_machine/struct.BasicExternalities.html
[remoteextern-rustdocs]: https://substrate.dev/rustdocs/latest/remote_externalities/index.html#
[stateapi-rustdocs]: https://substrate.dev/rustdocs/latest/sc_rpc/state/trait.StateApi.html#
[stateapi-storage-rustdocs]: https://substrate.dev/rustdocs/latest/sc_rpc/state/trait.StateApi.html#tymethod.storage
[stateapi-storage-keys-paged-rustdocs]: https://substrate.dev/rustdocs/latest/sc_rpc/state/trait.StateApi.html#tymethod.storage_keys_paged
[executive-example-frame]: https://substrate.dev/rustdocs/latest/src/frame_executive/lib.rs.html#221-238
[oru-helpers-ext-rustdocs]: https://substrate.dev/rustdocs/latest/frame_support/traits/trait.OnRuntimeUpgradeHelpersExt.html
[hooks-rustdocs]: https://substrate.dev/rustdocs/latest/src/frame_support/traits/hooks.rs.html#109
[executive-rustdocs]: https://substrate.dev/rustdocs/latest/frame_executive/struct.Executive.html
[sc-cli-rustdocs]: https://substrate.dev/rustdocs/latest/sc_cli/index.html#
[staking-frame]: https://github.com/paritytech/substrate/blob/fc49802f263529160635471c8a17888846035f5d/frame/staking/src/lib.rs#L1399-L1406
[onruntimeupgrade-method-rustdocs]: https://substrate.dev/rustdocs/latest/frame_support/traits/trait.OnRuntimeUpgrade.html#on_runtime_upgrade
[executive-try-runtime-rustdocs]: https://substrate.dev/rustdocs/latest/frame_executive/struct.Executive.html#method.try_runtime_upgrade
[get-storage-rustdocs]: https://substrate.dev/rustdocs/latest/sp_core/traits/trait.Externalities.html#method.set_storage
[get-storage]: https://polkadot.js.org/docs/substrate/rpc/#getstoragechildkey-prefixedstoragekey-key-storagekey-at-hash-optionstoragedata
[storage-keys-paged]: https://polkadot.js.org/docs/substrate/rpc/#getkeyspagedchildkey-prefixedstoragekey-prefix-storagekey-count-u32-startkey-storagekey-at-hash-vecstoragekey
[storage-keys-paged-rustdocs]: https://substrate.dev/rustdocs/latest/sc_rpc/state/trait.StateApi.html#tymethod.storage_keys_paged
[integrate-tryruntime-htg]: https://substrate.dev/substrate-how-to-guides/docs/tools/integrate-try-runtime
[fork-off-gh]: https://github.com/maxsam4/fork-off-substrate
[integrate-try-runtime-htg]: https://substrate.dev/substrate-how-to-guides/docs/tools/integrate-try-runtime

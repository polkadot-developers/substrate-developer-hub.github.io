---
title: try-runtime
---

The `try-runtime` tool is built to query a snapshot of runtime storage, using an in-memory-externalities to store state. In this way, 
it enables runtime engineers to write tests for a specified runtime state.
Being part of [`sc-cli`][sc-cli-rustdocs], it is designed to be used as a command line interface to specify 
what block to capture and which pallets to run tests on.

In its simplest form, `try-runtime` is a tool that enables:

1. Connecting to a remote node and calling into some runtime API.
2. Scraping the specified state from a node at a given block.
3. Writing tests for that data.

> **Note:** This tool is designed to be used for testing against real chain state _before_ going to production.

## Motivation

The initial motivation for `try-runtime` came from the need to test runtime changes against state from a real chain. Prior [`TestExternalities`][testextern-rustdocs] and [`BasicExternalities`][basicextern-rustdocs] existed for writing unit and integrated tests with mock data, but lacked an avenue to test against a chain's actual state. `try-runtime` extends [`TestExternalities`][testextern-rustdocs] and [`BasicExternalities`][basicextern-rustdocs] by scraping state (which is stored with key value pairs) via a node's RPC endpoints and inserting them into `TestExternalites`.

## How it works
The `try-runtime` tool has its own implementation of externalities called [`remote_externalities`][remoteextern-rustdocs], with its hash-map containing:

- a **Key**: the `Hash` of `hash(pallet_name) + hash(storage)`; and
- a **Value**: some SCALE encoded `Vec<u8>` Rust value. 

The diagram below illustrates the way externalities sits outside a compiled runtime as a means to capture 
the storage of that runtime. 

Storage externalities            |  Testing with externalities
:-------------------------:|:-------------------------:
![image](./../assets/advanced/try-runtime-ext-1.png)  |  ![image](./../assets/advanced/try-runtime-ext-2.png)

With `remote_externalities`, developers can capture some chain state and run tests on it. Essentially, `RemoteExterrnalities` will populate a `TestExternalities` with a real chain's data. 

In order to query state, `try-runtime` makes use of Substrate's RPCs, namely [`StateApi`][stateapi-rustdocs]. In particular:
- [`storage`][stateapi-storage-rustdocs]: A method which returns a storage value under the given key.
- [`storage_key_paged`][stateapi-storage-keys-paged-rustdocs]: A method which returns the keys with prefix with pagination support.

// TODO: Add about frame::Executor

## Usage

The most common use case for `try-runtime` is with storage migrations and runtime upgrades.

### Calling into hooks from `OnRuntimeUpgrade`
There's two ways of defining an runtime upgrade hook in the runtime:
- **From inside a runtime**. For example:
    ```rust
    struct Custom;
    impl OnRuntimeUpgrade for Custom {
        fn on_runtime_upgrade() -> Weight { }
    }
    ```

- **From a pallet**. For example:
    ```rust
    #[pallet::hooks]
    fn on_runtime_upgrade() -> Weight { }
    ```

To call into these hooks with `try-runtime`, a cargo `feature` is used. This requires specifying a `features` 
dependency in your projects' relevant `Cargo.toml` files. 

> Refer to this how-to guide on integrating `try-runtime` to your project. (TODO)

With this feature tag, `try-runtime` can call into `OnRuntimeUpgrade` hooks using the 
`#[cfg(feature = "try-runtime")]` macro. This macro must be 
declared before each function being tested in order for `try-runtime` to capture the relevant state 
that its user specified. For example, in a storage migration, `try-runtime` can allow developers to 
examine state both before and after a runtime upgrade:

```rust
    #[cfg(feature = "try-runtime")]
    fn pre_upgrade() -> Result<(), &'static str> { Ok(()) }

    #[cfg(feature = "try-runtime")]
    fn post_upgrade() -> Result<(), &'static str> { Ok(()) }
```

> See how the Executive pallet implements the `try_runtime_upgrade` method [here][executive-example-frame] to 
> aggregate all `OnRuntimeUpgrade` calls from a runtime and return a `Weight`, which could be used for testing.  

### Helper functions

A set of helper functions are made available from [`frame_support::hooks`][hooks-rustdocs] called
[`OnRuntimeUpgradeHelpersExt`][oru-helpers-ext-rustdocs] in order to use `try-runtime` for testing storage migrations. These include:

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

// TODO: basic commands / common combinations

The possible sub-commands include:

- **`on-runtime-upgrade`**: Executes "tryRuntime_on_runtime_upgrade" against the given runtime state.
- **`offchain-worker`**: Executes "offchainWorkerApi_offchain_worker" against the given runtime state.
- **`execute-block`**: Executes "core_execute_block" using the given block and the runtime state of the parent block.

For example, running `try-runtime` with the "on-runtime-upgrade" subcommand on a chain
running locally:

```bash
cargo run -- --release --features=try-runtime try-runtime on-runtime-upgrade live ws://localhost:9944
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

## Next Steps

### Learn More
// TODO: Link how-to guides

## Examples
- `try-runtime` in [FRAME's Staking pallet][staking-frame].

[tryruntime-api-rustdocs]: https://crates.parity.io/frame_try_runtime/trait.TryRuntime.html
[testextern-rustdocs]: https://substrate.dev/rustdocs/v3.0.0/sp_state_machine/struct.TestExternalities.html
[basicextern-rustdocs]: https://substrate.dev/rustdocs/v3.0.0/sp_state_machine/struct.BasicExternalities.html
[remoteextern-rustdocs]: https://crates.parity.io/remote_externalities/index.html#
[stateapi-rustdocs]: https://crates.parity.io/sc_rpc/state/trait.StateApi.html# 
[stateapi-storage-rustdocs]: https://crates.parity.io/sc_rpc/state/trait.StateApi.html#tymethod.storage
[stateapi-storage-keys-paged-rustdocs]: https://crates.parity.io/sc_rpc/state/trait.StateApi.html#tymethod.storage_keys_paged
[executive-example-frame]: https://crates.parity.io/src/frame_executive/lib.rs.html#221-238
[oru-helpers-ext-rustdocs]: https://crates.parity.io/frame_support/traits/trait.OnRuntimeUpgradeHelpersExt.html
[hooks-rustdocs]: https://crates.parity.io/src/frame_support/traits/hooks.rs.html#109
[executive-rustdocs]: https://crates.parity.io/frame_executive/struct.Executive.html 
[sc-cli-rustdocs]: https://crates.parity.io/sc_cli/index.html#
[staking-frame]: https://github.com/paritytech/substrate/blob/fc49802f263529160635471c8a17888846035f5d/frame/staking/src/lib.rs#L1399-L1406

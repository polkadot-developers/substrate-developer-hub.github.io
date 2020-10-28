---
title: Executor
---

The executor is responsible for dispatching and executing calls into the Substrate runtime.

## Runtime Execution

The Substrate runtime is compiled into a native executable and a WebAssembly (Wasm) binary.

The native runtime is included as part of the node executable, while the Wasm binary is stored on
the blockchain under a well known storage key.

These two representations of the runtime may not be the same. For example: when the runtime is
upgraded. The executor determines which version of the runtime to use when dispatching calls.

### Execution Strategy

Before runtime execution begins, the Substrate client proposes which runtime execution environment
should be used. This is controlled by the execution strategy, which can be configured for the
different parts of the blockchain execution process. The strategies are:

- `NativeWhenPossible`: Execute with the native equivalent if it is compatible with the given
wasm module; otherwise fall back to the wasm.
- `Wasm`: Use the given wasm module..
- `Both`: Run with both the wasm and the native variant (if compatible).
Report any discrepancy as an error.
- `NativeElseWasm`: First native, then if that fails or is not possible, wasm.

The default execution strategies for the different parts of the blockchain execution process are:

- Syncing: `NativeElseWasm`
- Block Import: `NativeElseWasm`
- Block Construction: `Wasm`
- Off-Chain Worker: `NativeWhenPossible`
- Other: `NativeWhenPossible`

### Wasm Execution

The Wasm representation of the Substrate runtime is considered the canonical runtime. Because this
Wasm runtime is placed in the blockchain storage, the network must come to consensus about this
binary. Thus it can be verified to be consistent across all syncing nodes.

The Wasm execution environment can be more restrictive than the native execution environment. For
example, the Wasm runtime always executes in a 32-bit environment with a configurable memory limit
(up to 4 GB).

For these reasons, the blockchain prefers to do block construction with the Wasm runtime even though
Wasm execution is measurably slower than native execution. Some logic executed in Wasm will always
work in the native execution environment, but the same cannot be said the other way around. Wasm
execution can help to ensure that block producers create valid blocks.

### Native Execution

The native runtime will only be used by the executor when it is chosen as the execution strategy and
it is compatible with the requested runtime version. For all other execution processes other than
block construction, the native runtime is preferred since it is more performant. In any situation
where the native executable should not be run, the canonical Wasm runtime is executed instead.

## Runtime Upgrades

The Substrate runtime is designed to be upgraded so that you can continue to iterate on your state
transition function even after your blockchain goes live.

### Runtime Versioning

In order for the executor to be able to select the appropriate runtime execution environment, it
needs to know the `spec_name`, `spec_version` and `authoring_version` of both the native and Wasm
runtime.

The runtime provides the following
[versioning properties](https://substrate.dev/rustdocs/v2.0.0/sp_version/struct.RuntimeVersion.html):

- `spec_name`: The identifier for the different Substrate runtimes.

- `impl_name`: The name of the implementation of the spec. This is of little consequence for the
  node and serves only to differentiate code of different implementation teams.

- `authoring_version`: The version of the authorship interface. An authoring node will not attempt
  to author blocks unless this is equal to its native runtime.

- `spec_version`: The version of the runtime specification. A full-node will not attempt to use its
  native runtime in substitute for the on-chain Wasm runtime unless all of `spec_name`,
  `spec_version`, and `authoring_version` are the same between Wasm and native.

- `impl_version`: The version of the implementation of the specification. Nodes are free to ignore
  this; it serves only as an indication that the code is different; as long as the other two
  versions are the same then while the actual code may be different, it is nonetheless required to
  do the same thing. Non-consensus-breaking optimizations are about the only changes that could be
  made which would result in only the `impl_version` changing.

As mentioned above, the executor always verifies that the native runtime has the same
consensus-driven logic before it chooses to execute it, independent of whether the version is higher
or lower.

> **Note:** The runtime versioning is manually set. Thus the executor can still make inappropriate
> decisions if the runtime version is misrepresented.

### Forkless Runtime Upgrades

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

## Next Steps

### Learn More

- Read more about runtime upgrades in the [Runtime documentation](../runtime/upgrades).

### Examples

TODO

### References

- Check out the different
  [Execution Strategies](https://substrate.dev/rustdocs/v2.0.0/sc_client_api/execution_extensions/struct.ExecutionStrategies.html).

- Take a look at the different
  [Execution Strategy Options](https://substrate.dev/rustdocs/v2.0.0/sp_state_machine/enum.ExecutionStrategy.html)

- Review the
  [Runtime Version definition](https://substrate.dev/rustdocs/v2.0.0/sp_version/struct.RuntimeVersion.html).

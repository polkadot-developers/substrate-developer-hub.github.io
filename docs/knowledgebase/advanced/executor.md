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

## Next Steps

### Learn More

- Read more about runtime upgrades in the [Runtime documentation](../runtime/upgrades).

### References

- Check out the different
  [Execution Strategies](https://substrate.dev/rustdocs/v3.0.0/sc_client_api/execution_extensions/struct.ExecutionStrategies.html).

- Take a look at the different
  [Execution Strategy Options](https://substrate.dev/rustdocs/v3.0.0/sp_state_machine/enum.ExecutionStrategy.html)

- Review the
  [Runtime Version definition](https://substrate.dev/rustdocs/v3.0.0/sp_version/struct.RuntimeVersion.html).

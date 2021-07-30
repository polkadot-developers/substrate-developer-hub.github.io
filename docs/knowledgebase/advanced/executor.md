---
title: Runtime Executor
---

The executor is responsible for dispatching and executing calls into the Substrate runtime.

## Runtime Execution

The Substrate runtime is compiled into a native executable and a WebAssembly (Wasm) binary.

The native runtime is included as part of the node executable, while the Wasm binary is stored on
the blockchain under a well known storage key.

These two representations of the runtime may not be the same. For example, after the runtime is
upgraded. The executor determines which version of the runtime to use when dispatching calls.

### Execution Strategy

Before runtime execution begins, the Substrate client proposes which runtime execution environment
should be used. This is controlled by the execution strategy, which can be configured for the
different parts of the blockchain execution process. The strategies are listed in the
[`ExecutionStrategy` enum](https://substrate.dev/rustdocs/latest/sp_state_machine/enum.ExecutionStrategy.html):

- `NativeWhenPossible`: Execute with native build (if available, WebAssembly otherwise).
- `AlwaysWasm`: Only execute with the WebAssembly build.
- `Both`: Execute with both native (where available) and WebAssembly builds.
- `NativeElseWasm`: Execute with the native build if possible; if it fails, then execute with WebAssembly.

All strategies respect the runtime version, meaning if the native and wasm runtime versions differ
(which the wasm runtime is more updated then the native one), the wasm runtime is chosen to run.

The default execution strategies for the different parts of the blockchain execution process are:

- Syncing: `NativeElseWasm`
- Block Import (for non-validator): `NativeElseWasm`
- Block Import (for validator): `AlwaysWasm`
- Block Construction: `AlwaysWasm`
- Off-Chain Worker: `NativeWhenPossible`
- Other: `NativeWhenPossible`

Source: [[1]](#footnote-execution-strategies-src01), [[2]](#footnote-execution-strategies-src02)

They can be overridden via the command line argument `--execution-{block-construction, import-block, offchain-worker, other, syncing} <strategy>`, or `--execution <strategy>` to apply the specified strategy to all five aspects. Details can be seen at `substrate --help`. When specifying on cli, the following shorthand strategy names are used:

- `Native` mapping to the `NativeWhenPossible` strategy
- `Wasm` mapping to the `AlwaysWasm` strategy
- `Both` mapping to the `Both` strategy
- `NativeElseWasm` mapping to `NativeElsmWasm` strategy

### Wasm Execution

The Wasm representation of the Substrate runtime is considered the canonical runtime. Because this
Wasm runtime is placed in the blockchain storage, the network must come to consensus about this
binary. Thus it can be verified to be consistent across all syncing nodes.

The Wasm execution environment can be more restrictive than the native execution environment. For
example, the Wasm runtime always executes in a 32-bit environment with a configurable memory limit
(up to 4 GB).

For these reasons, the blockchain prefers to do block construction with the Wasm runtime. Some logic
executed in Wasm will always work in the native execution environment, but the same cannot be said
the other way around. Wasm execution can help to ensure that block producers create valid blocks.

### Native Execution

The native runtime will only be used by the executor when it is chosen as the execution strategy and
it is compatible with the requested runtime version (see
[Runtime Versioning](https://substrate.dev/docs/en/knowledgebase/runtime/upgrades#runtime-versioning)).
For all other execution processes other than block construction, the native runtime is preferred
since it is more performant. In any situation where the native executable should not be run, the
canonical Wasm runtime is executed instead.

## Next Steps

### Learn More

- Read more about runtime upgrades in the [Runtime documentation](../runtime/upgrades).

### References

- Check out the different
  [Execution Strategies](https://substrate.dev/rustdocs/latest/sc_client_api/execution_extensions/struct.ExecutionStrategies.html).

- Take a look at the different
  [Execution Strategy Options](https://substrate.dev/rustdocs/latest/sp_state_machine/enum.ExecutionStrategy.html)

- Review the
  [Runtime Version definition](https://substrate.dev/rustdocs/latest/sp_version/struct.RuntimeVersion.html).

## Footnotes

1. <span id="footnote-execution-strategies-src01">Substrate</span> codebase [`client/cli/src/params/import_params.rs`](https://github.com/paritytech/substrate/blob/9b08105b8c/client/cli/src/params/import_params.rs#L115-L124)
2. <span id="footnote-execution-strategies-src02">Substrate</span> codebase [`client/cli/src/arg_enums.rs`](https://github.com/paritytech/substrate/blob/9b08105b8c/client/cli/src/arg_enums.rs#L193-L203)

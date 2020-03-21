---
title: EVM Module
id: version-v2.0.0-alpha.3-evm_module
original_id: evm_module
---

The SRML provides an EVM execution module that allows unmodified EVM code to be executed in a
Substrate-based blockchain.

## EVM Engine

The SRML EVM module uses [SputnikVM](https://github.com/sorpaas/rust-evm) as the underlying EVM engine. The engine is
overhauled so that it's [modular](https://github.com/corepaper/evm). In the future, we will want to
allow users to swap out components like gasometer, and inject their own customized ones.

## Execution Lifecycle

There are a separate set of accounts managed by the EVM module. Substrate based accounts can
call the EVM Module to deposit or withdraw balance from the Substrate base-currency into a different
balance managed and used by the EVM module. Once a user has populated their balance, they can create
and call smart contracts using this module.

There's one-to-one mapping from Substrate accounts and EVM external accounts that is defined by a
conversion function.

## EVM Module vs Ethereum Network

The EVM module should be able to produce nearly identical results compared to the Ethereum mainnet,
including gas cost and balance changes.

Observable differences include:

* The available length of block hashes may not be 256 depending on the configuration of the System
  module in the Substrate runtime.
* Difficulty and coinbase, which do not make sense in this module and is currently hard coded to
  zero.

We currently do not aim to make unobservable behaviors, such as state root, to be the same. We also
don't aim to follow the exact same transaction / receipt format. However, given one Ethereum
transaction and one Substrate account's private key, one should be able to convert any Ethereum
transaction into a transaction compatible with this module.

The gas configurations are currently hard-coded to the Istanbul hard fork. It can later be expanded
to support earlier hard fork configurations.

## Next Steps

### Learn More

- Learn about our [SRML Contracts module](conceptual/runtime/contracts/contracts_module.md), which
  supports deployment and execution of Wasm smart contracts.

### Examples

- Follow a [tutorial to add a runtime module to your Substrate
  runtime](tutorials/adding-a-module-to-your-runtime.md).

### References

- Visit the reference docs for the [EVM module](https://substrate.dev/rustdocs/master/pallet_evm/index.html).

- Visit the reference docs for [SputnikVM's `evm` crate](https://docs.rs/evm/).

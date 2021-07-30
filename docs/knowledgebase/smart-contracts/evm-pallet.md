---
title: EVM Pallet
---

FRAME provides an EVM execution pallet that allows unmodified EVM code to be executed in a
Substrate-based blockchain. As a key part to Substrate's Ethereum compatibility layer, also known as [Frontier](https://github.com/paritytech/frontier), it works
together with the [Ethereum pallet](https://docs.rs/pallet-ethereum/2.0.0/pallet_ethereum/) and the 
[Dynamic Fee pallet](https://docs.rs/pallet-dynamic-fee/2.0.0/pallet_dynamic_fee/) to enable the creation of runtimes 
capable of fully emulating Ethereum block production and transaction processing. 

<a class="btn btn-secondary primary-color text-white"
href="https://substrate.dev/frontier-workshop/">Start the Frontier workshop!</a>

## EVM Engine

The EVM pallet uses [SputnikVM](https://github.com/rust-blockchain/evm) as the underlying EVM engine.
The engine is overhauled so that it's [modular](https://github.com/corepaper/evm). In the future, we
will want to allow users to swap out components like gasometer, and inject their own customized
ones.

## Execution Lifecycle

There are a separate set of accounts managed by the EVM pallet. Substrate based accounts can call
the EVM pallet to deposit or withdraw balance from the Substrate base-currency into a different
balance managed and used by the EVM pallet. Once a user has populated their balance, they can create
and call smart contracts using this pallet.

There's one-to-one mapping from Substrate accounts and EVM external accounts that is defined by a
conversion function.

## EVM Pallet vs. Ethereum Network

The EVM pallet should be able to produce nearly identical results compared to the Ethereum mainnet,
including gas cost and balance changes.

Observable differences include:

- The available length of block hashes may not be 256 depending on the configuration of the 
[System pallet](https://substrate.dev/rustdocs/latest/frame_system/index.html#system-pallet) in the Substrate runtime.
- Difficulty and coinbase, which do not make sense in this pallet and is currently hard coded to
  zero.

We currently do not aim to make unobservable behaviors, such as state root, to be the same. We also
don't aim to follow the exact same transaction / receipt format. However, given one Ethereum
transaction and one Substrate account's private key, one should be able to convert any Ethereum
transaction into a transaction compatible with this pallet.

The gas configurations are currently hard-coded to the Istanbul hard fork. It can later be expanded
to support earlier hard fork configurations.

## Next Steps

### Learn More

- Learn about our [Contracts pallet](https://docs.rs/pallet-contracts/), which supports deployment
  and execution of Wasm smart contracts.

### Examples

- Follow a [tutorial to add a pallet to your FRAME runtime](../../tutorials/add-a-pallet/).

### References

- Visit the reference docs for the [EVM pallet](https://docs.rs/pallet_evm/) and [`fp_evm`](https://docs.rs/fp-evm/2.0.0/fp_evm/).
- Visit the reference docs for [SputnikVM's `evm` crate](https://docs.rs/evm/).

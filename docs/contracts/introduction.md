---
title: "Introduction to Smart Contracts on Substrate"
---

Welcome to the smart contracts section of the Developer Hub!

Here you can lean how to write WebAssembly ([Wasm](overview/glossary.md#webassembly-wasm)) smart contracts for Substrate block chains using the [Contract](https://github.com/paritytech/substrate/tree/master/srml/contract) module from the Substrate Module Runtime Library ([SRML](https://substrate.dev/docs/en/overview/glossary#srml-substrate-runtime-module-library)).

Because Substrate supports Wasm smart contracts, it means that any language that can compile to Wasm could be used to write these contracts. ink! is Parity's answer for writing smart contracts using the Rust programming language.

## Contract Module

The SRML Contract module provides the ability for the runtime to deploy and execute WebAssembly smart contracts. Here we will provide a short overview of the major features of the contracts module. To really learn all of the fine details, you can take a look at the [reference documentation for `srml_contract`](https://crates.parity.io/srml_contract/index.html).

### Account Based

The Contract module uses an account based system similar to many existing smart contract platforms. To the Substrate runtime, contract accounts are just like normal user accounts; however in addition to an `AccountID` and `Balance` that normal accounts have, a contract account can also have associated contract code and some persistent contract storage.

### Two Step Deployment

Deploying a contract with the Contract module takes two steps:

1. Store the Wasm contract on the blockchain.
2. Instantiate a new account, with new storage, associated with that Wasm contract.

This means that multiple contract instances can be initialized using the same Wasm code, reducing the amount of storage space needed by the Contract module on your blockchain.

### Contract Calls

Calls to contracts can alter the storage of the contract, create new contracts, and call other contracts. Because Substrate provides you with the ability to write custom runtime modules, the Contract module also enables you to make asynchronous calls directly to those runtime functions on behalf of the contract's account.

### Sandboxed

The Contract module is intended to be used by any user on a public network. This means that contracts only have the ability to directly modify their own storage. To provide safety to the underlying blockchain state, the Contract module enables revertable transactions, which rollback any changes to the storage by contract calls which do not complete successfully.

### Gas

Contract calls are charged gas fee to limit the amount of computational resources a transaction can use. When forming a contract transaction, a gas limit is specified. As the contract executes, gas is incrementally used up depending on the complexity of the computation. If the gas limit is reached before the contract execution completes, the transaction fails, contract storage is reverted, and the gas fee is **not** returned to the user. If the contract executed completes with extra gas, it is returned to the user at the end of the transaction.

The Contract module determines the gas price, which is a conversion between the Substrate `Currency` and a single unit of gas, thus to execute a transaction, a user must have a free balance of at least `gas price` * `gas limit` which can be spent.

### Storage Rent

Similar to how gas limits the amount of computational resources that can be used during a transaction, storage rent limits the footprint that a contract can have on the blockchain storage. Contracts accounts are charged proportionally to the amount of storage their account uses, and when a contract account's balance goes below the [existential deposit](overview/glossary.md#existential-deposit), the account and storage is cleaned up. 

### Comparison to Ethereum

Substrate is heavily influenced by existing contract platforms like Ethereum. Here is a comparison showing similarities and differences between these two platforms:

<table class="table">
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Substrate Contract Module</th>
      <th scope="col">Ethereum</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Virtual Machine</th>
      <td>Wasm</td>
      <td>EVM</td>
    </tr>
    <tr>
      <th scope="row">Contract Instance</th>
      <td>Account Based</td>
      <td>Account Based</td>
    </tr>
    <tr>
      <th scope="row">Computational Limits</th>
      <td>Gas/Fee System</td>
      <td>Gas/Fee System</td>
    </tr>
    <tr>
      <th scope="row">Storage Limits</th>
      <td>Storage Rent</td>
      <td>None</td>
    </tr>
    <tr>
      <th scope="row">Primary Development Language</th>
      <td>Rust</td>
      <td>Solidity</td>
    </tr>
  </tbody>
</table>

## ink!

ink! is Rust based embedded domain specific language ([eDSL](https://wiki.haskell.org/Embedded_domain_specific_language)) for writing Wasm smart contracts specifically for the SRML Contract module. The main goals of ink! are user friendliness, conciseness, and efficiency.

### Abstraction Layers

The ink! language is composed of three different layers of abstractions with which you can write smart contracts:

* Lang: The actual eDSL to provide a user friendly interface to writing smart contract code.
* [Model](https://paritytech.github.io/ink/ink_model/index.html): Medium-level abstractions to write smart contracts heavily inspired by [Fleetwood](https://github.com/paritytech/fleetwood).
* [Core](https://paritytech.github.io/ink/ink_core/index.html): The core utilities and APIs used to interact with the Contract module.

### Similarities to Solidity

ink! should feel familiar in structure to developers who have used Solidity:

* The skeleton of a contract has all of the same components that you might expect:

    * Events
    * Storage
    * Deployment (Constructor) Function
    * Public Functions
    * Internal functions

* Just like Ethereum, function mutability and visibility are explicit in ink!.

* ink! exposes a number of environment variables to the contract developer like the `caller`, `balance`, `gas_left`, and more!

### Differences to Solidity

Being based in Rust, the list of differences to Solidity far surpass what can be written here, but we will touch on some notable ones:

* Through Rust, ink! can provide compile time overflow/underflow safety. Using a Rust compiler configuration, you can specify whether you want to support overflowing math, or if you want contract execution to panic when overflows occur. No need to continually import "Safe Math" libraries, although Rust also provides [integrated checked, wrapped, and saturated math functions](https://doc.rust-lang.org/std/primitive.u32.html).

* Rust also provides a safe API for describing values which are not set with the [Option](https://doc.rust-lang.org/std/option/index.html) type. In Ethereum, you would use the `0x0` address to represent "no one" when checking ownership of an asset or burning tokens. With ink! and Rust, you can explicitly specify a value as `None` which has no disambiguous meaning.

* Through Substrate, ink! gains access to a ["low influence" random number generator](https://crates.parity.io/srml_system/struct.Module.html#method.random). 

* Finally, ink! provides a built in test environment which can be used to perform off-chain unit testing with the Rust framework.

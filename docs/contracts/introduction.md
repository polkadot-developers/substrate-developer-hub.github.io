---
title: "Introduction to Smart Contracts on Substrate"
---

Welcome to the smart contracts section of the Developer Hub!

Here you can lean how to write WebAssembly ([Wasm](overview/glossary.md#webassembly-wasm)) smart contracts for Substrate block chains using the [Contract](https://github.com/paritytech/substrate/tree/master/srml/contract) module from the Substrate Module Runtime Library ([SRML](https://substrate.dev/docs/en/overview/glossary#srml-substrate-runtime-module-library)).

Because Substrate supports Wasm smart contracts, it means that any language that can compile to Wasm could be used to write these contracts. ink! is Parity's answer for writing smart contracts using the Rust programming language.

Existing smart contract platforms like [Ethereum](https://www.ethereum.org/) have heavily influenced the design of both the Contract module and the ink! programming language. The documentation in this section may make assumptions that you have previous knowledge of common concepts and patterns of these platforms.

## Contract Module

The SRML Contract module provides the ability for the runtime to deploy and execute WebAssembly smart contracts. Here we will provide a short overview of the common similarities and differences between the Contract module and Ethereum. To really learn all of the fine details, you can take a look at the [reference documentation for `srml_contract`](https://crates.parity.io/srml_contract/index.html).

### Similarities to Ethereum

As mentioned above, the Contract module shares many similarities to Ethereum. It uses an account based system where each smart contract instance has:

* AccountId
* Balance
* Associated Code
* Storage

The [halting problem](https://en.wikipedia.org/wiki/Halting_problem) is solved by using a gas/fee system.

The Contract module provides safety to the blockchain state by enabling revertable transactions, which rollback any changes to the storage by contract calls which fail.

Contract calls can change alter the storage of the contract, create new contracts, and call other contracts.

### Differences to Ethereum

Unlike Ethereum, the Contracts module uses a WebAssembly interpreter ([wasmi](https://github.com/paritytech/wasmi/)) to execute smart contracts.

Smart contract deployment in the Contract module uses a two step process:

1. First, the compiled Wasm is placed on the chain, and stored in the Contract module internal storage using the hash of the blob.
2. Then, an instance of that contract can be deployed, where an account will be created to host the storage and balance for that instance.

This means that unlike Ethereum, standardized contract code like an [ERC-20](https://en.wikipedia.org/wiki/ERC-20) token only need to be uploaded once, reducing the amount of storage space used by the contract platform on your blockchain.

The contract module has implemented storage rent mechanisms which will continually charge contracts for the storage they use. In combination with [existential deposit](overview/glossary.md#existential-deposit), this means that contract storage will be freed when its balance becomes too low.

Because Substrate provides you with the ability to write custom runtime modules, the Contract module enables you to make asynchronous calls directly to those runtime functions on behalf of the contract account.

## ink!

ink! is Rust based embedded domain specific language ([eDSL](https://wiki.haskell.org/Embedded_domain_specific_language)) for writing Wasm smart contracts specifically for the SRML Contract module. The main goals of ink! are user friendliness, conciseness, and efficiency.

### Abstraction Layers

The ink! language is composed of three different layers of abstractions with which you can write smart contracts:

* Lang: The actual eDSL to provide a user friendly interface to writing smart contract code.
* [Model](https://paritytech.github.io/ink/ink_model/index.html): Medium-level abstractions to write smart contracts heavily inspired by [Fleetwood](https://github.com/paritytech/fleetwood).
* [Core](https://paritytech.github.io/ink/ink_core/index.html): The core utilities and APIs used to interact with the Contract module.

### Similarities to Solidity

ink! should feel familiar in structure to developers who have used Solidity. The skeleton of a contract has all of the same components that you might expect:

* Events
* Storage
* Deployment (Constructor) Function
* Public Functions
* Internal functions

Just like Ethereum, function mutability and visibility are explicit in ink!.

ink! exposes a number of environment variables to the contract developer like the `caller`, `balance`, `gas_left`, and more!

### Differences to Solidity

Being based in Rust, the list of differences to Solidity far surpass what can be written here, but we will touch on some notable differences.

Through Rust, ink! can provide compile time overflow/underflow safety. Using a Rust compiler configuration, you can specify whether you want to support overflowing math, or if you want contract execution to panic when overflows occur. No need to continually import "Safe Math" libraries, although Rust also provides [integrated checked, wrapped, and saturated math functions](https://doc.rust-lang.org/std/primitive.u32.html).

Rust also provides a safe API for describing values which are not set with the [Option](https://doc.rust-lang.org/std/option/index.html) type. In Ethereum, you would use the `0x0` address to represent "no one" when checking ownership of an asset or burning tokens. With ink! and Rust, you can explicitly specify a value as `None` which has no disambiguous meaning.

Through Substrate, ink! gains access to a ["low influence" random number generator](https://crates.parity.io/srml_system/struct.Module.html#method.random). 

Finally, ink! provides a built in test environment which can be used to perform off-chain unit testing with the Rust framework.
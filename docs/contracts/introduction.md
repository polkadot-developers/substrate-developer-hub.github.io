---
title: "Introduction to Smart Contracts on Substrate"
---

Welcome to the smart contracts section of the Developer Hub!

Here you can lean how to write WebAssembly ([Wasm](overview/glossary.md#webassembly-wasm)) smart contracts for Substrate block chains using the [Contract](https://github.com/paritytech/substrate/tree/master/srml/contract) module from the Substrate Module Runtime Library ([SRML](https://substrate.dev/docs/en/overview/glossary#srml-substrate-runtime-module-library)).

Because Substrate supports Wasm smart contracts, it means that any language that can compile to Wasm could be used to write these contracts. ink! is Parity's answer for writing smart contracts and is an embedded domain specific language (eDSL) based on the Rust programming language.

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

Contract calls can alter the storage of the contract, create new contracts, and call other contracts.

### Differences to Ethereum

Unlike Ethereum, the Contracts module uses a WebAssembly interpreter ([wasmi](https://github.com/paritytech/wasmi/)) to execute smart contracts.

Smart contract deployment in the Contract module uses a two step process:

1. First, the compiled Wasm is placed on the chain, and stored in the Contract module internal storage using the hash of the blob.
2. Then, an instance of that contract can be deployed, where an account will be created to host the storage and balance for that instance.

This means that unlike Ethereum, standardized contract code like an [ERC-20](https://en.wikipedia.org/wiki/ERC-20) token only need to be uploaded once, reducing the amount of storage space used by the contract platform on your blockchain.

The contract module has implemented storage rent mechanisms which will continually charge contracts for the storage they use. In combination with [existential deposit](overview/glossary.md#existential-deposit), this means that contract storage will be freed when its balance becomes too low.

Because Substrate provides you with the ability to write custom runtime modules, the Contract module enables you to make asynchronous calls directly to those runtime functions on behalf of the contract account.

## ink!

The main goals of ink! are user friendliness, conciseness as well as efficiency.

## Abstraction Layers

ink! offers three different layers of abstractions to write smart contracts in.

- [Core][Core Docs]
    - **Users:** Not user friendly, low-level abstraction, provides most freedom in writing a smart contract.
    - Provides data structures that can operate on contract storage, such as `storage::Vec`.
    - Implements a storage allocator infrastructure and environment definitions to interoperate with [SRML contracts].
- [Model][Model Docs]
    - **Users:** Users have to be proficient in Rust to make use of this abstraction.
    - Data structures modeling smart contracts virtually.
    - Provide clean way to specify smart contract dispatch for messages and deployment.
- Lang
    - **Users:** Beginner friendly abstraction to write Wasm smart contract.
    - Provides clean, concise and robust way to specify Wasm smart contracts.
    - Helps in communicating Wasm interfaces and remote calls.

## Want to write smart contracts?

- Examples
    - [Erc20 Token][Erc20 Lang Example]
- Tutorial
    - [Writing Your First Contract](Writing-Your-First-Contract)
    - [Deploying Your First Contract](Deploying-Your-First-Contract)

[Core Docs]: https://paritytech.github.io/ink/ink_core/index.html
[Model Docs]: https://paritytech.github.io/ink/ink_model/index.html
[Erc20 Lang Example]: https://github.com/paritytech/ink/blob/master/examples/lang/erc20/src/lib.rs

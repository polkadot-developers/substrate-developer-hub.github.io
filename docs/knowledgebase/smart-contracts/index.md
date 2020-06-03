---
title: ink! Smart Contracts
---

Welcome to the smart contracts section of the Developer Hub!

Because Substrate supports Wasm smart contracts, it means that any language that can compile to Wasm
could be used to write these contracts. ink! is Parity's answer for writing smart contracts using
the Rust programming language.

## Contracts Pallet

The Contracts pallet provides the ability for the runtime to deploy and execute WebAssembly smart
contracts. Here we will provide a short overview of the major features of the contracts pallet. To
really learn all of the fine details, you can take a look at the
[reference documentation for `pallet-contracts`](https://docs.rs/pallet-contracts).

### Account Based

The Contracts pallet uses an account-based system similar to many existing smart contract platforms.
To the Substrate runtime, contract accounts are just like normal user accounts; however, in addition
to an `AccountID` and `Balance` that normal accounts have, a contract account also has associated
contract code and some persistent contract storage.

### Two Step Deployment

Deploying a contract with the Contracts pallet takes two steps:

1. Store the Wasm contract on the blockchain.
2. Instantiate a new account, with new storage, associated with that Wasm contract.

This means that multiple contract instances, with different constructor arguments, can be
initialized using the same Wasm code, reducing the amount of storage space needed by the Contracts
pallet on your blockchain.

### Runtime Environment Types

For writing contracts and interacting with the runtime, a set of types are available (e.g.
`AccountId`, `Balance`, `Hash`, `Timestamp`). These types can be user defined for custom runtimes,
or the supplied defaults can be used. See: [EnvTypes](env-types)

### Contract Calls

Calls to contracts can alter the storage of the contract, create new contracts, and call other
contracts. Because Substrate provides you with the ability to write custom runtime pallets, the
Contracts pallet also enables you to make asynchronous calls directly to those runtime functions on
behalf of the contract's account.

### Sandboxed

The Contracts pallet is intended to be used by any user on a public network. This means that
contracts only have the ability to directly modify their own storage. To provide safety to the
underlying blockchain state, the Contracts pallet enables revertible transactions, which roll back
any changes to the storage by contract calls that do not complete successfully.

### Gas

Contract calls are charged a gas fee to limit the amount of computational resources a transaction
can use. When forming a contract transaction, a gas limit is specified. As the contract executes,
gas is incrementally used up depending on the complexity of the computation. If the gas limit is
reached before the contract execution completes, the transaction fails, contract storage is
reverted, and the gas fee is **not** returned to the user. If the contract execution completes with
remaining gas, it is returned to the user at the end of the transaction.

The Contracts pallet determines the gas price, which is a conversion between the Substrate
`Currency` and a single unit of gas. Thus, to execute a transaction, a user must have a free balance
of at least `gas price` \* `gas limit` which can be spent.

### Storage Rent

Similar to how gas limits the amount of computational resources that can be used during a
transaction, storage rent limits the footprint that a contract can have on the blockchain's storage.
A contract account is charged proportionally to the amount of storage its account uses. When a
contract's balance goes below a defined limit, the contract's account is turned into a "tombstone"
and its storage is cleaned up. A tombstone contract can be restored by providing the data that was
cleaned up when it became a tombstone as well as any additional funds needed to keep the contract
alive.

## ink!

ink! is a Rust-based embedded domain specific language
([eDSL](https://wiki.haskell.org/Embedded_domain_specific_language)) for writing Wasm smart
contracts specifically for the Contracts pallet. The main goals of ink! are user friendliness,
conciseness, and efficiency.

### Abstraction Layers

The ink! language is composed of three different layers of abstractions with which you can write
smart contracts:

- [Lang](https://github.com/paritytech/ink/tree/master/lang): The actual eDSL to provide a
  user-friendly interface to writing smart contract code.
- [Core](https://github.com/paritytech/ink/tree/master/core): The core utilities and APIs used to
  interact with the Contracts pallet.

We expect that most users will develop using the language layer, but thanks to the other
abstractions, it is possible for developers to create their own Rust eDSL for their specific needs.

### Contract Components

ink! should feel familiar to developers who have programmed using other modern smart contract
languages. The skeleton of a contract has all of the same components that you might expect:

- Events
- Storage
- Deployment (Constructor) Function
- Public Functions
- Internal functions

In ink!, mutability and visibility are explicitly defined per contract function. In these functions,
you gain access to a number of common Substrate types like `AccountId`, `Balances`, `Hash`, etc.
Additionally, you gain access to commonly used environment variables like the `caller`, `balance`,
`gas_left`, and more!

### Overflow Safety

Being written in Rust, ink! can provide compile-time overflow/underflow safety. Using a Rust
compiler configuration, you can specify whether you want to support overflowing math, or if you want
contract execution to panic when overflows occur. No need to continually import "Safe Math"
libraries, although Rust also provides
[integrated checked, wrapped, and saturated math functions](https://doc.rust-lang.org/std/primitive.u32.html).

### Test Environment

ink! provides a built in test environment that can be used to perform off-chain unit testing with
the Rust framework. This makes it simple and easy to ensure that your contract code functions as
expected, without the need for third party testing platforms.

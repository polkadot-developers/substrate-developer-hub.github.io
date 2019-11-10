---
title: Contracts Module
---

The SRML Contracts module provides the ability for the runtime to deploy and execute WebAssembly
smart contracts. Here we will provide a short overview of the major features of the contracts
module. To really learn all of the fine details, you can take a look at the [reference documentation
for `srml_contracts`](https://crates.parity.io/srml_contracts/index.html).

## Account Based

The Contracts module uses an account-based system similar to many existing smart contract platforms.
To the Substrate runtime, contract accounts are just like normal user accounts; however, in addition
to an `AccountID` and `Balance` that normal accounts have, a contract account also has associated
contract code and some persistent contract storage.

## Two Step Deployment

Deploying a contract with the Contracts module takes two steps:

1. Store the Wasm contract on the blockchain.
2. Instantiate a new account, with new storage, associated with that Wasm contract.

This means that multiple contract instances, with different constructor arguments, can be
initialized using the same Wasm code, reducing the amount of storage space needed by the Contracts
module on your blockchain.

## Runtime Environment Types

For writing contracts and interacting with the runtime, a set of types are available (e.g.
`AccountId`, `Balance`, `Hash`, `Moment`). These types can be user defined for custom runtimes, or
the supplied defaults can be used.

## Contract Calls

Calls to contracts can alter the storage of the contract, create new contracts, and call other
contracts. Because Substrate provides you with the ability to write custom runtime modules, the
Contracts module also enables you to make asynchronous calls directly to those runtime functions on
behalf of the contract's account.

## Sandboxed

The Contracts module is intended to be used by any user on a public network. This means that
contracts only have the ability to directly modify their own storage. To provide safety to the
underlying blockchain state, the Contracts module enables revertible transactions, which roll back
any changes to the storage by contract calls that do not complete successfully.

## Gas

Contract calls are charged a gas fee to limit the amount of computational resources a transaction
can use. When forming a contract transaction, a gas limit is specified. As the contract executes,
gas is incrementally used up depending on the complexity of the computation. If the gas limit is
reached before the contract execution completes, the transaction fails, contract storage is
reverted, and the gas fee is **not** returned to the user. If the contract execution completes with
remaining gas, it is returned to the user at the end of the transaction.

The Contracts module determines the gas price, which is a conversion between the Substrate
`Currency` and a single unit of gas. Thus, to execute a transaction, a user must have a free balance
of at least `gas price` * `gas limit` which can be spent.

## Storage Rent

Similar to how gas limits the amount of computational resources that can be used during a
transaction, storage rent limits the footprint that a contract can have on the blockchain's storage.
A contract account is charged proportionally to the amount of storage its account uses. When a
contract's balance goes below a defined limit, the contract's account is turned into a "tombstone"
and its storage is cleaned up. A tombstone contract can be restored by providing the data that was
cleaned up when it became a tombstone as well as any additional funds needed to keep the contract
alive.

## Contracts Module vs EVM


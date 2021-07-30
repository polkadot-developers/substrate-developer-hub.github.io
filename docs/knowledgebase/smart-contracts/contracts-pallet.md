---
title: Contracts Pallet
---

The [Contracts pallet](https://substrate.dev/rustdocs/latest/pallet_contracts/index.html) provides
the ability for the runtime to deploy and execute [WebAssembly (Wasm)](https://webassembly.org/)
smart contracts. It uses [ink!](https://paritytech.github.io/ink-docs/), a [Rust](https://www.rust-lang.org/)-based embedded domain specific language
([eDSL](https://wiki.haskell.org/Embedded_domain_specific_language)) for writing
[WebAssembly](https://webassembly.org/) smart contracts.

Here are some of ink!'s key features:

- Designed for correctness, conciseness and efficiency, ink! carries familiar concepts from other modern smart contract
languages. Learn more about [how it compares to Solidity](https://paritytech.github.io/ink-docs/ink-vs-solidity).
- ink! provides a built in test environment that can be used to perform off-chain unit testing with
the Rust framework. This makes it simple and easy to ensure that your contract code functions as
expected, without the need for third party testing platforms. Learn more [here](https://paritytech.github.io/ink-docs/basics/contract-testing/).
- Because ink! follows Rust standards, tools like [`rustfmt`](https://github.com/rust-lang/rustfmt) 
and [`rust-analyzer`](https://github.com/rust-analyzer/rust-analyzer) already work out of the box.

<a class="btn btn-secondary primary-color text-white"
href="https://substrate.dev/substrate-contracts-workshop/">Start the ink! workshop!</a>

## Wasm Engine

The Contracts pallet depends on a Wasm sandboxing interface defining the Wasm execution engine
available within the runtime. This is currently implemented with
[`wasmi`](https://github.com/paritytech/wasmi), a Wasm interpreter.

## Features

The Contracts pallet has a number of familiar and new features for the deployment and execution of
smart contracts.

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

### Contract Calls

Calls to contracts can alter the storage of the contract, create new contracts, and call other
contracts. Because Substrate provides you with the ability to write custom runtimes, the
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
[**weight system**](../learn-substrate/weight) and a single unit of gas. Thus, to execute a transaction, a user must have a free balance
of at least `gas price` \* `gas limit` which can be spent.

### Storage Rent

Similar to how gas limits the amount of computational resources that can be used during a
transaction, storage rent limits the footprint that a contract can have on the blockchain's storage.
A contract account is charged proportionally to the amount of storage its account uses. When a
contract's balance goes below a defined limit, the contract's account is turned into a "tombstone"
and its storage is cleaned up. A tombstone contract can be restored by providing the data that was
cleaned up when it became a tombstone as well as any additional funds needed to keep the contract
alive.

## Contracts Pallet vs. EVM

The Contracts pallet iterates on existing ideas in the smart contract ecosystem, particularly
Ethereum and the EVM.

The most obvious difference between the Contracts pallet and the EVM is the underlying execution
engine used to run smart contracts. The EVM is a good theoretical execution environment, but it is
not very practical to use with modern hardware. For example, manipulation of 256 bit integers on
modern architectures is significantly more complex than standard types. Even the Ethereum team has
investigated the use of [Wasm](https://github.com/ewasm/design) for the next generation of the
network.

The EVM charges for storage fees only at the time of storage. This one-time cost results in some
permanent amount of storage being used on the blockchain, _forever_, which is economically unsound.
The Contracts pallet attempts to repair this through [storage rent](#storage-rent) which ensures
that any data that persists on the blockchain is appropriately charged for those resources.

The Contracts pallet chooses to approach contract creation using a
[two-step process](#two-step-deployment), which fundamentally changes how contracts are stored on
chain. Contract addresses, their storage, and balances are now separated from the underlying
contract logic. This could enable behavior like what
[`create2`](https://eips.ethereum.org/EIPS/eip-1014) provided to Ethereum or even enable repairable
or upgradeable contracts on a Substrate based blockchain.

## Next Steps

### Learn More

- Learn about ink! by [reading its documentation](https://github.com/paritytech/ink).

### Examples

- Follow a
  [tutorial to add this Contracts pallet to your Substrate runtime](../../tutorials/add-contracts-pallet/).

### References

- Visit the reference docs for the
  [Contracts pallet](https://substrate.dev/rustdocs/latest/pallet_contracts/index.html).
- Take a look at the [repository for `wasmi`](https://github.com/paritytech/wasmi).
- Take a look at the [repository for ink!](https://github.com/paritytech/ink).

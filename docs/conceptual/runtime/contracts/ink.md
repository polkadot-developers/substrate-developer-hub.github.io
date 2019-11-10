---
title: ink!
---

ink! is a Rust-based embedded domain specific language
([eDSL](https://wiki.haskell.org/Embedded_domain_specific_language)) for writing Wasm smart
contracts specifically for the SRML Contracts module. The main goals of ink! are user friendliness,
conciseness, and efficiency.

## Abstraction Layers

The ink! language is composed of three different layers of abstractions with which you can write
smart contracts:

* [Lang](https://github.com/paritytech/ink/tree/master/lang): The actual eDSL to provide a
  user-friendly interface to writing smart contract code.
* [Model](https://github.com/paritytech/ink/tree/master/model): Medium-level abstractions to write
  smart contracts heavily inspired by [Fleetwood](https://github.com/paritytech/fleetwood).
* [Core](https://github.com/paritytech/ink/tree/master/core): The core utilities and APIs used to
  interact with the Contracts module.

We expect that most users will develop using the language layer, but thanks to the other
abstractions, it is possible for developers to create their own Rust eDSL for their specific needs.

## Contract Components

ink! should feel familiar to developers who have programmed using other modern smart contract
languages. The skeleton of a contract has all of the same components that you might expect:

  * Events
  * Storage
  * Deployment (Constructor) Function
  * Public Functions
  * Internal functions

In ink!, mutability and visibility are explicitly defined per contract function. In these functions,
you gain access to a number of common Substrate types like `AccountId`, `Balances`, `Hash`, etc.
Additionally, you gain access to commonly used environment variables like the `caller`, `balance`,
`gas_left`, and more!

## Overflow Safety

Being written in Rust, ink! can provide compile-time overflow/underflow safety. Using a Rust
compiler configuration, you can specify whether you want to support overflowing math, or if you want
contract execution to panic when overflows occur. No need to continually import "Safe Math"
libraries, although Rust also provides [integrated checked, wrapped, and saturated math
functions](https://doc.rust-lang.org/std/primitive.u32.html).

## Test Environment

ink! provides a built in test environment that can be used to perform off-chain unit testing with
the Rust framework. This makes it simple and easy to ensure that your contract code functions as
expected, without the need for third party testing platforms.

## ink! vs Solidity

Rust is an ideal smart contract language. It is type safe, memory safe, and free of undefined behaviors. It generates small binaries because it doesn’t include extra bloat, like a garbage collector, and advanced optimizations and tree shaking remove dead code. Through compiler flags, Rust can automatically protect against integer overflow.

ink! chooses not to invent a new programming language, but rather adapt a subset of Rust to serve this purpose. As a result, you gain from all of the tooling and support available to the Rust ecosystem for free. In addition, as the language develops, ink! will automatically gain access to new features and functionality, improving how you can write smart contracts in the future.

Here is a brief comparison of features between ink! and Solidity:

|   | ink! | Solidity |
|---|------|----------|
| Virtual Machine | Any Wasm VM | EVM |
| Encoding | Wasm | EVM Byte Code |
| Language | Rust | Standalone |
| Overflow Protection | Enabled by default | None |
| Constructor Functions | Multiple | Single |
| Tooling | Anything that supports Rust | Custom |
| Versioning | Semantic | Semantic |
| Has Metadata? | Yes | Yes |
| Multi-File Project | Planned | Yes |
| Storage Entries | Variable | 256 bits |
| Supported Types | [Docs](conceptual/core/codec.md) | [Docs](https://solidity.readthedocs.io/en/latest/types.html) |
| Has Interfaces? | Planned (Rust Traits) | Yes |

## Next Steps

### Learn More

- Learn about the [SRML Contracts module](conceptual/runtime/contracts/contracts_module.md) which is
  used to deploy and execute ink! contracts.

### Examples

- Follow our [tutorial to create your first ink! smart
  contract](https://substrate.dev/substrate-contracts-workshop/).

### References

- Visit the [ink! repository for additional docs and to look at the
  source](https://github.com/paritytech/ink).

- Visit the reference docs for the [ink! abi](https://paritytech.github.io/ink/ink_abi/).

- Visit the reference docs for the [ink! core](https://paritytech.github.io/ink/ink_core/).

- Visit the reference docs for the [ink! model](https://paritytech.github.io/ink/ink_model/).

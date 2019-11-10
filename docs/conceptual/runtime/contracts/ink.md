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

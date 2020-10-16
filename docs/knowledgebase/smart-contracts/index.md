---
title: ink! Smart Contracts
---

Welcome to the smart contracts section of the Developer Hub!

Because Substrate supports Wasm smart contracts, it means that any language that can compile to Wasm
could be used to write these contracts. ink! is Parity's answer for writing smart contracts using
the Rust programming language.

## ink!

ink! is a Rust-based embedded domain specific language
([eDSL](https://wiki.haskell.org/Embedded_domain_specific_language)) for writing Wasm smart
contracts specifically for the Contracts pallet. The main goals of ink! are user friendliness,
conciseness, and efficiency.

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
Additionally, you gain access to commonly used environment variable like the `caller`, and more!

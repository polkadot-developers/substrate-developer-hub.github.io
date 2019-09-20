---
title: Runtime Execution
---

The execution of the Substrate runtime is orchestrated by the Executive module in the Substrate Runtime Module Library (SRML).

Unlike the other modules in the SRML, this is not a _runtime_module, but just a normal Rust module which calls into the various runtime modules included in your blockchain.

The Executive module provides functions to:

* [Check transaction validity](#validating-a-transaction).

* [Initialize a block](#initializing-a-block).

* [Apply extrinsics](#applying-extrinsics).

* [Execute a block](#executing-a-block).

* [Finalize a block](#finalizing-a-block).

* [Start an off-chain worker](#off-chain-workers).

## Validating a Transaction

## Initializing a Block

## Applying Extrinsics

## Executing a Block

## Finalizing a Block

## Off-Chain Workers

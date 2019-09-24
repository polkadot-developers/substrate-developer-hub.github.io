---
title: Storage
---

The Substrate uses a simple key-value storage abstraction to represent the client database.

## Key-Value Store

Substrate implements it's storage database with RocksDB, a persistent key-value store for fast storage environments.

This is used for all the components of Substrate which require persistent storage such as:

* Substrate clients
* Substrate light-clients
* Off-chain workers

## Abstractions

One advantage of using a simple key-value store is that you are able to easily abstract other storage structures on top.

## Trie Abstraction

Substrate uses a Base-16 Modified Merkle Patricia tree ("trie") based on [`paritytech/trie`](https://github.com/paritytech/trie).

TODO

## Runtime Storage abstraction



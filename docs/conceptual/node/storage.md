---
title: Storage
---

The Substrate uses a simple a key-value data store implemented as a database-backed modified Merkle tree.

## Key-Value Database

Substrate implements it's storage database with [RocksDB](https://rocksdb.org/), a persistent key-value store for fast storage environments.

This is used for all the components of Substrate which require persistent storage such as:

* Substrate clients
* Substrate light-clients
* Off-chain workers

## Trie Abstraction

One advantage of using a simple key-value store is that you are able to easily abstract other storage structures on top.

Substrate uses a Base-16 Modified Merkle Patricia tree ("trie") from [`paritytech/trie`](https://github.com/paritytech/trie) to provide a trie structure whose contents can be modified and whose root hash is recalculated efficiently.

### Main Trie

Substrate has a single main trie whose storage root hash is placed in the block header. This is used to easily verify the state of the blockchain and provide a basis for light clients to verify proofs.

### Child Trie

Substrate also provides an API to generate new child tries with their own root hash that can be used in the runtime.

The root hash of these child tries are automatically stored in the main trie to maintain easy verification of the complete node state.

## Runtime Storage API

The Substrate runtime support library provides utilities which generates unique, deterministic keys for your runtime module storage items. These storage items are placed in the main trie and are accessible by querying the trie by key.

## Next Steps

### Learn More

* Learn how to add [storage items](development/module/storage.md) into your Substrate runtime modules.

### Examples

* View an example of creating [child tries]() in your Substrate runtime module.

### References

* Visit the reference docs for [`paritytech/trie`](https://substrate.dev/rustdocs/master/trie_db/trait.Trie.html).
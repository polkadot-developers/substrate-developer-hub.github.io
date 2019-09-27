---
title: Storage
---

The Substrate uses a simple a key-value data store implemented as a database-backed modified Merkle tree.

## Key-Value Database

Substrate implements its storage database with [RocksDB](https://rocksdb.org/), a persistent key-value store for fast storage environments.

This is used for all the components of Substrate which require persistent storage such as:

* Substrate clients
* Substrate light-clients
* Off-chain workers

## Trie Abstraction

One advantage of using a simple key-value store is that you are able to easily abstract other storage structures on top.

Substrate uses a Base-16 Modified Merkle Patricia tree ("trie") from [`paritytech/trie`](https://github.com/paritytech/trie) to provide a trie structure whose contents can be modified and whose root hash is recalculated efficiently.

Tries are important tool for blockchains because they allow for efficient storing and sharing of historical of block state. You don't have a state trie per block, but a trie hash that will point to the trie nodes from previous block states. However, accessing data to trie data is costly. Each read operation takes O(log N) time, where N is the number of elements stored in the trie. To mitigate this, we use a key value cache.

All trie node are stored in RocksDB and part of the trie state can get pruned, i.e. a key-value pair can be deleted from the storage when it is out of pruning range for non archive nodes. The trie nodes partial path prefixes the hash of the encoded node for the RocksDB key to avoid key collision. We do not use [reference counting](http://en.wikipedia.org/wiki/Reference_counting) for performance reasons.

### State Trie

Substrate has a single main trie, called the state trie, whose changing root hash is placed in each block header. This is used to easily verify the state of the blockchain and provide a basis for light clients to verify proofs.

This trie only stores content for the canonical chain, not forks. There is a separate `state_db` layer that maintain the trie state with references counted in memory for all that is non canonical. See JournalDB.

### Child Trie

Substrate also provides an API to generate new child tries with their own root hash that can be used in the runtime.

Child tries are identical to main state trie, except their root is stored and updated in the main trie instead of the block header. Since their headers are a part of the main state trie, it is still easy to verify of the complete node state when it includes child tries.

## Runtime Storage API

The Substrate runtime support library provides utilities which generates unique, deterministic keys for your runtime module storage items. These storage items are placed in the main trie and are accessible by querying the trie by key.

## Next Steps

### Learn More

* Learn how to add [storage items](development/module/storage.md) into your Substrate runtime modules.

### Examples

* View an example of creating [child tries]() in your Substrate runtime module.

### References

* Visit the reference docs for [`paritytech/trie`](https://substrate.dev/rustdocs/master/trie_db/trait.Trie.html).
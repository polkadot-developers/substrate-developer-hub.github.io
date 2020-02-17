---
title: Storage
---

Substrate uses a simple key-value data store implemented as a database-backed,
modified Merkle tree.

## Key-Value Database

Substrate implements its storage database with [RocksDB](https://rocksdb.org/),
a persistent key-value store for fast storage environments.

This is used for all the components of Substrate that require persistent
storage, such as:

- Substrate clients
- Substrate light-clients
- Off-chain workers

## Trie Abstraction

One advantage of using a simple key-value store is that you are able to easily
abstract storage structures on top of it.

Substrate uses a Base-16 Modified Merkle Patricia tree ("trie") from
[`paritytech/trie`](https://github.com/paritytech/trie) to provide a trie
structure whose contents can be modified and whose root hash is recalculated
efficiently.

Tries allow efficient storing and sharing of the historical block state. The
trie root is a representation of the data within the trie; that is, two tries
with different data will always have different roots. Thus, two blockchain nodes
can easily verify that they have the same state by simply comparing their trie
roots.

Accessing trie data is costly. Each read operation takes O(log N) time, where N
is the number of elements stored in the trie. To mitigate this, we use a
key-value cache.

All trie nodes are stored in RocksDB and part of the trie state can get pruned,
i.e. a key-value pair can be deleted from the storage when it is out of pruning
range for non-archive nodes. We do not use [reference
counting](http://en.wikipedia.org/wiki/Reference_counting) for performance
reasons.

### State Trie

Substrate based chains have a single main trie, called the state trie, whose
root hash is placed in each block header. This is used to easily verify the
state of the blockchain and provide a basis for light clients to verify proofs.

This trie only stores content for the canonical chain, not forks. There is a
separate [`state_db`
layer](https://substrate.dev/rustdocs/master/sc_state_db/index.html) that
maintains the trie state with references counted in memory for all that is
non-canonical.

### Child Trie

Substrate also provides an API to generate new child tries with their own root
hashes that can be used in the runtime.

Child tries are identical to the main state trie, except that a child trie's
root is stored and updated as a node in the main trie instead of the block
header. Since their headers are a part of the main state trie, it is still easy
to verify the complete node state when it includes child tries.

Child tries are useful when you want your own independent trie with a separate
root hash that you can use to verify the specific content in that trie.
Subsections of a trie do not have a root-hash-like representation that satisfy
these needs automatically; thus a child trie is used instead.

## Runtime Storage API

The Substrate's [Support
module](https://substrate.dev/rustdocs/master/frame_support/index.html) provides
utilities to generate unique, deterministic keys for your runtime module storage
items. These storage items are placed in the state trie and are accessible by
querying the trie by key.

## Next Steps

### Learn More

- Learn how to add [storage items](development/module/storage.md) into your
  Substrate runtime modules.

### Examples

- View an example of creating [child tries](https://substrate.dev/recipes/3-entrees/storage-api/childtries.html) in your Substrate runtime module.

### References

- Visit the reference docs for
  [`paritytech/trie`](https://substrate.dev/rustdocs/master/trie_db/trait.Trie.html).

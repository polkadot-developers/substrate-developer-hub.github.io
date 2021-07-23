---
title: The Block Import Pipeline
---

## The Import Queue

The import queue is an abstract worker queue present in every Substrate node. It is not part of the
runtime. The import queue is responsible for processing pieces of incoming information, verifying
them, and if they are valid, importing them into the node's state. The most fundamental piece of
information that the import queue processes is blocks themselves, but it is also responsible for
importing consensus-related messages such as justifications and, in light clients, finality proofs.

The import queue collects incoming elements from the network and stores them in a pool. The elements
are later checked for validity and discarded if they are not valid. Elements that are valid are then
imported into the node's local state.

The import queue is codified abstractly in Substrate by means of the
[`ImportQueue` trait](https://substrate.dev/rustdocs/latest/sp_consensus/import_queue/trait.ImportQueue.html).
The use of a trait allows each consensus engine to provide its own specialized implementation of the
import queue, which may take advantage of optimization opportunities such as verifying multiple
blocks in parallel as they come in across the network.

The import queue also provides some hooks via the
[`Link` trait](https://substrate.dev/rustdocs/latest/sp_consensus/import_queue/trait.Link.html) that can be used
to follow its progress.

## The Basic Queue

Substrate provides a default in-memory implementation of the `ImportQueue` known as the
[`BasicQueue`](https://substrate.dev/rustdocs/latest/sp_consensus/import_queue/struct.BasicQueue.html). The
`BasicQueue` does not do any kind of optimization, rather it performs the verification and import
steps sequentially. It does, however, abstract the notion of verification through the use of the
[`Verifier`](https://substrate.dev/rustdocs/latest/sp_consensus/import_queue/trait.Verifier.html) trait.

Any consensus engine that relies on the `BasicQueue` must implement the `Verifier` trait. The
`Verifier` is typically responsible for tasks such as checking
[inherent data](../learn-substrate/extrinsics#inherents), and ensuring that
the block is signed by the appropriate authority.

## The Block Import Trait

When the import queue is ready to import a block, it passes the block in question to a method
provided by the
[`BlockImport` trait](https://substrate.dev/rustdocs/latest/sp_consensus/block_import/trait.BlockImport.html).
This `BlockImport` trait provides the behavior of importing a block into the node's local state
database.

One implementor of the `BlockImport` trait that is used in every Substrate node is the
[`Client`](https://substrate.dev/rustdocs/latest/sc_service/client/index.html), which contains the node's entire
block database. When a block is imported into the client, it is added to the main database of blocks
that the node knows about.

## The Block Import Pipeline

In the simplest cases, blocks are imported directly into the client. But most consensus engines will
need to perform additional verification on incoming blocks, update their own local auxiliary
databases, or both. To allow consensus engines this opportunity, it is common to wrap the client in
another struct that also implements `BlockImport`. This nesting leads to the term "block import
pipeline".

An example of this wrapping is the
[`PowBlockImport`](https://substrate.dev/rustdocs/latest/sc_consensus_pow/struct.PowBlockImport.html), which
holds a reference to another type that also implements `BlockImport`. This allows the PoW consensus
engine to do its own import-related bookkeeping and then pass the block to the nested `BlockImport`,
probably the client. This pattern is also demonstrated in
[`AuraBlockImport`](https://substrate.dev/rustdocs/latest/sc_consensus_aura/struct.AuraBlockImport.html),
[`BabeBlockImport`](https://substrate.dev/rustdocs/latest/sc_consensus_babe/struct.BabeBlockImport.html), and
[`GrandpaBlockImport`](https://substrate.dev/rustdocs/latest/sc_finality_grandpa/struct.GrandpaBlockImport.html).

`BlockImport` nesting need not be limited to one level. In fact, it is common for nodes that use
both an authoring engine and a finality gadget to layer the nesting even more deeply. For example,
Polkadot's block import pipeline consists of a `BabeBlockImport`, which wraps a
`GrandpaBlockImport`, which wraps the `Client`.

## Learn More

Several of the Recipes' nodes demonstrate the block import pipeline:

- [Basic PoW](https://substrate.dev/recipes/basic-pow.html) - the import pipeline includes
  PoW and the client
- [Hybrid Consensus](https://substrate.dev/recipes/hybrid-consensus.html) - the import
  pipeline is PoW, then Grandpa, then the client

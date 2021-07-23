---
title: Why are there no Hash collections in sp_std?
---

Collections such as maps and sets are fundamental data structures. `sp_std` exposes them via
[`BTreeMap`](https://substrate.dev/rustdocs/latest/sp_std/collections/btree_map/struct.BTreeMap.html)
and
[`BTreeSet`](https://substrate.dev/rustdocs/latest/sp_std/collections/btree_set/struct.BTreeSet.html)
respectively. These map closely to the implementations in Rust's standard library. However, the
standard library also contains
[`HashMap`](https://doc.rust-lang.org/std/collections/struct.HashMap.html) and
[`HashSet`](https://doc.rust-lang.org/std/collections/struct.HashSet.html). Let's look into why
those types are not also exposed in `sp_std`.

## Trees vs Hashes

Trees and hashes are two distinct approaches to implementing the interface of a map or set.
Fundamentally, trees operate by comparing items: a node in the tree contains an item, and might
contain references to a set of items less than the node item, and a set of items greater than the
node item. Tree-based maps and sets have `O(log n)` performance characteristics for `insert`,
`remove`, and `contains`, where `n` is the number of items currently contained in the collection.

Hashes, on the other hand, lay out a number of "buckets" in memory. Each bucket contains a list of
items. Their method of operation is to hash each item: reduce it via some hash function into a
number. Then, they use the hash value to select which bucket should contain the item. Finally, in
the event that the bucket is not empty, items are handled in unordered manner; the list is scanned
linearly. Hash-based maps and sets have `O(1)` performance characteristics for `insert`, `remove`,
and `contains`: their performance does not depend on the number of items they contain.

Clearly, hash-based implementations are faster than tree-based implementations for large `n`.
However, most modern hash implementations require non-determinism in order to operate properly.

## Non-determinism in Hash Collections

The transform from an arbitrary hashable piece of data into a hash bucket for a particular hash
table typically occurs in two phases: first, the data is hashed into a single number, the hash
value. Then, the hash value is transformed into the index of a particular bucket. While in principle
an attack could target either phase of that process, in practice, existing attacks focus on the
hasher, because that requires less knowledge about the program's internal state.

In 2003, researchers discovered [an
attack](https://static.usenix.org/event/sec03/tech/full_papers/crosby/crosby_html/) on hash
collections which operate in this way. In 2011, other researchers
[demonstrated](https://www.youtube.com/watch?v=R2Cq3CLI6H8) a way to use this attack on software
written in several languages popular at the time.

The attack is simple: generate a large number of inputs, all of which hash into the same bucket.
This means that instead of taking constant time for an insert, you need to spend time proportional
to the number of items already in the bucket. This in turn transforms the total cost required to
insert a list of `n` items from `O(n)` to `O(n**2)`.

The mitigation was also simple: generate a random value at program initialization, then include that
value in the hash function's input. This makes it impossible to pre-compute a set of inputs which
will generate a collision. In 2012, it was
[shown](https://fahrplan.events.ccc.de/congress/2012/Fahrplan/events/5152.en.html) that a
cryptographic hash function is necessary to effectively defend against hash-flooding attacks. The
same presentation introduced [SipHash](https://github.com/veorq/SipHash) for that purpose. That hash
function and strategy remains the state of the art as of 2021, and forms the basis for hashes in
many languages, including Rust.

However, the foundation of the strategy remains a single, random number. This is incompatible with
blockchain applications.

## Non-determinism on the Blockchain

Blockchains are fundamentally consensus engines. At heart, this means that all the validators have
to do the same thing.

It's trivial to imagine a runtime which intentionally behaves non-deterministically based on things
like the [location of hashmap values in
memory](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=55aaf4b234e2b9f70f10a11bb775bad4).
That's straightforward operator error; it will only happen to users who are doing things they
shouldn't.

However, non-determinism can occur for other reasons. Consider a hashmap implementation which uses
the max quantity of items in a bucket as a heuristic for when to resize itself. Now consider how
that system behaves as it runs out of memory. Some nodes will believe that the block is invalid:
they happened to generate internal hash seeds which prompted them to grow past the memory limits.
Other nodes will believe that the block is valid: their seeds prompted less growth, resulting in
successful block execution. This forks the blockchain.

This particular scenario is straightforward to guard against; just make resizing behavior a simple
function of total items contained, without any bucket size heuristics. However, it illustrates the
broader case: it is very difficult to encapsulate non-determinism in a way which is
deterministic across nodes. Parity has chosen not to spend the R&D effort which would be required to
solve that problem.

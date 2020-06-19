---
title: On-Chain Randomness
---

Randomness has many applications in computer science and beyond. For example it is used to select councilors in some governance systems, perform statistical analyses, performing cryptographic operations, and gaming and gambling. Many randomness-requiring applications are already finding a home on blockchain networks. This article describes how randomness is produced and used in Substrate runtimes.

## Deterministic Randomness

In traditional non-blockchain computing, an application that required randomness could choose to use a real random value drawn from hardware, or a pseudo-random value that is actually deterministic, but impractical to predict thanks to cryptography.

Applications that run on the blockchain are more tightly constrained because all authorities in the network must agree on any on-chain value, including any randomness data that is injected. Because of this constraint, using real randomness directly is impossible.

Luckily, advancements in cryptographic primitives like [Verifiable Random Functions](https://en.wikipedia.org/wiki/Verifiable_random_function) and the development of multi-party randomness computation allow application that require randomness to still be used in the Blockchain.


## Substrate's Randomness Trait

Substrate provides a trait called `Randomness` that codifies the interface between the logic that generates randomness and the logic that consumes it. This trait allows the two pieces of logic to be written independently of each other.

### Consuming Randomness

A developer who is writing a pallet that needs randomness, does not need to worry about providing that randomness. Rather, the pallet can imply require a randomness source that implements the trait be provided. The `Randomness` Trait provides two methods for gaining randomness.

The first method is called `random_seed`. It takes no parameters and gives back a raw piece of randomness. Calling this method multiple times in a block will return the same value each time. Thus, it is not recommended to use this method directly.

The second method is called `random`. It takes a byte-array which is used as a context identifier. It returns a result that is influenced by both the raw random seed and the context provided. This method may be called multiple times in the same block and will return a result that is specific to the context provided and independently low-influence from any other context.

### Generating Randomness

The interface looks like...

Substrate provides two implementations...

Additional implementations could be written such as randao or babe-like without the coupling to consensus.

## Security Properties



## Next Steps

### Examples

- Explore the [Recipe about Randomness](https://substrate.dev/recipes/3-entrees/randomness.html).

### References

- Read more in the [Polkadot Wiki](https://wiki.polkadot.network/docs/en/learn-randomness)
- View the Rustdocs on the
  [`Randomness` Trait](https://crates.parity.io/frame_support/traits/trait.Randomness.html).

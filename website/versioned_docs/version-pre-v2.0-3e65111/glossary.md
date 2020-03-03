---
title: Glossary
id: version-pre-v2.0-3e65111-glossary
original_id: glossary
---

The purpose of this document is to provide short definitions for a collection of technical terms used in Substrate.

### Adding new definitions

* A definition should provide a high-level description of a term and in most cases should not be longer than two or three sentences.
* When another non-trivial technical term needs to be employed as part of the description, consider adding a definition for that term and linking to it from the original definition.
* A definition should be complemented by a list of links to more detailed documentation and related topics.

## Terms

### Authority

Authorities are the actors, keys or identities who, as a collective, manage consensus on the network. `AuthorityId` can be used to identify them. In a [Proof of Stake](#proof-of-stake) chain (such as one using the FRAME's Staking pallet), authorities are determined through a token-weighted nomination/voting system.

### Block Author

The node, actor, or identity that is responsible for the creation of a block. Synonymous with "miner" or "coinbase" on legacy [Proof of Work](#proof-of-work) chains.

### Block Producer

See [Block Author](#block-author)

### GRANDPA

GRANDPA (GHOST-based Recursive ANcestor Deriving Prefix Agreement) is a finality gadget for blockchains. The formal specification can be found at the [W3F research wiki](https://research.web3.foundation/en/latest/polkadot/GRANDPA/).

### Runtime

The block execution logic of a blockchain, i.e. the state transition function. In Substrate, this is stored on-chain in an implementation-neutral, machine-executable format as a WebAssembly binary.

### Proof of Stake

TODO

### Proof of Work

TODO

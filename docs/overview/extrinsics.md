---
title: "Extrinsics"
---
Extrinsics in Substrate are pieces of information from "the outside world" (i.e. not from within the state of the chain itself) that are contained in the blocks of the chain. You might think "ahh, that means *transactions*": in fact, no. Extrinsics fall into two broad categories of which only one is *transactions*. The other type is known as inherent extrinsics or *inherents*.

## Transactions

Transactions are generally signed statements from a party or parties that stand to lose (or pay) funds for those pieces of data to be included/recognized on the chain. Though a signature is typical for these, other cryptographic means of strongly indicating economic value is possible such as a hash-pre-image. Because the value of including them on-chain can be recognized prior to execution, they can be gossiped around on the network between nodes without (too much) risk of spam.

Broadly speaking, they fit the mold of what you would call a "transaction" in Bitcoin or Ethereum.

## Inherent Extrinsics (aka Inherents)

Inherents are, generally speaking, not signed nor do they have any other cryptographic indication of intrinsic value. Because of this, they do not get gossiped as transactions do. (There is nothing technically preventing a Substrate chain that gossips inherents, but there would be no fee-based spam prevention mechanism.) Rather, they represent data that, in an opinionated fashion, describes one of a number of valid pieces of information. Aside from this, they are assumed to be "true" simply because a sufficiently large number of validators have agreed on them being reasonable.

To give an example, there is the timestamp inherent, which sets the current timestamp of the block. This is not a fixed part of Substrate, but does come as part of the [SRML](overview/glossary.md#srml-substrate-runtime-module-library) to be used as desired. No signature could fundamentally prove that a block were authored at a given time in quite the same way that a signature can "prove" the desire to transfer some particular funds. Rather, it is the business of each validator to ensure that they believe the timestamp is set to something reasonable before they agree that the block candidate is valid.

Another example is the "note-missed-proposal" extrinsic used in the [SRML](overview/glossary.md#srml-substrate-runtime-module-library) to determine and punish or deactivate offline validators. Again, this is little more than the declaration of a validator's opinion and it is up to the chain's runtime logic to determine what action to take on that "opinion", if any.

## Blocks and the Extrinsic Trie

Extrinsics are bundled together into a block as a series to be executed as defined in the runtime. There is an explicit field in the block's header `extrinsics_root`, which is a cryptographic digest of this series of extrinsics. This serves two purposes; first it prevents any alterations (by malicious parties or otherwise) to the series of extrinsics after the header has been built and distributed. Second, it provides a means of allowing light-client nodes to succinctly verify that any given extrinsic did indeed exist in a block given only knowledge of the header.

## Extrinsics in the SRML

The SRML provides two underlying generic implementations for an extrinsic: `UncheckedExtrinsic` (the basic variation) and `UncheckedMortalExtrinsic` (the more complex), the latter being a superset of functionality of the former. The basic variation provides a minimal, though complete, implementation of an Extrinsic under the SRML model of at most one signature together with a dispatchable call. The more complex variation provides this functionality together with the possibility of having an "era" encoded, thereby allowing a transaction to be valid only for a particular range of blocks.

These implementation are generic over four types:

- `Address`: the format of the sender, if any, as recorded in the transaction. Irrelevant for Inherents.
- `Index`: the type that encodes the transaction index. Irrelevant for Inherents.
- `Signature`: the signature type, which both defines the datatype that holds the signature and implies the logic that verifies it. (Currently `sr25519Signature` is implemented.) Irrelevant for Inherents.
- `Call`: a type to inform the on-chain logic which code should be called in order to execute this extrinsic. Generally speaking, this must implement a special dispatch trait.

Further generic capability within an SRML runtime is created when the `Executive` and `Block` are specialized. These determine how an `Address` is transformed into an `AccountId` and may pass in a typed piece of context data to help doing that.

## Block-authoring Logic

In Substrate, there is a distinction between blockchain *syncing* and block *authoring*. Full nodes (and light nodes) that are solely involved in syncing do not exercise the same functionality as authoring nodes. Specifically, authoring nodes require transaction queue logic, inherent transaction knowledge, and BFT consensus logic in addition to full synchronization. BFT consensus logic is provided as a core element of Substrate and can be ignored since it is only exposed in the SDK under the `authorities()` API entry.

Transaction queue logic in Substrate is designed to be as generic as possible, allowing a runtime to express which transactions are fit for inclusion in a block through the `initialise_block` and `apply_extrinsic` calls (full (syncing) nodes will only run `execute_block`). However, more subtle aspects like the prioritization and replacement policy must currently be "hard coded" as part of the blockchain's authoring logic. That said, Substrate's reference implementation for a transaction queue should be sufficient for an initial chain implementation.

Inherent extrinsic knowledge is also somewhat generic, and the actual construction of the extrinsics is, by convention, delegated to the "soft code" in the runtime. If there ever needs to be additional extrinsics information in the chain, then:

- The block authoring logic will need to be altered to provide it into the runtime; and
- The runtime's `inherent_extrinsics` call will need to use this extra information in order to construct any additional extrinsics for inclusion in the block.

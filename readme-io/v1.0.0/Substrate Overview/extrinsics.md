---
title: "Extrinsics"
excerpt: "What is an Extrinsic, anyway?"
---
Extrinsics in Substrate are pieces of information from "the outside world" (i.e. not from within the state of the chain itself) that are contained in the blocks of the chain. You might think "ahh, that means *transactions*": in fact, no. Extrinsics fall into two broad categories of which only one is *transactions*. The other type are known as inherent extrinsics or *inherents*.
[block:api-header]
{
  "title": "Transactions"
}
[/block]
Transactions are generally signed statements from party or parties that stand to lose (or pay) funds for those pieces of data to be included/recognised on the chain. Though a signature is typical for these, other cryptographic means of strongly indicating economic value is possible such as a hash-pre-image. Because the value of including them on-chain can be recognised prior to execution, they can be gossiped around on the network between nodes without (too much) risk of spam.

Broadly speaking, they fit the mould of what you would call a "transaction" in Bitcoin or Ethereum.
[block:api-header]
{
  "title": "Inherent Extrinsics (aka Inherents)"
}
[/block]
Inherents are, generally speaking, not signed nor do they have any other cryptographic indication of intrinsic value. Because of this, they cannot be gossiped as transactions are. Rather, they represent data which, in an opinionated fashion describes one of a number of valid pieces of information. Aside from they are assumed to be "true" simply because a sufficiently large number of validators have agreed on them being reasonable.

To give an example, there is the timestamp inherent, which sets the current timestamp of the block. This is not a fixed part of Substrate, but does come as part of the <<glossary:SRML>> to be used as desired. No signature could fundamentally prove that a block were authored at a given time in quite the same way that a signature can "prove" the desire to transfer some particular funds. Rather, it is the business of each validator to ensure that they believe the timestamp is set to something reasonable before they agree that the block candidate is valid.

Another example is the the "note-missed-proposal" extrinsic used in the <<glossary:SRML>> to determine and punish or deactivate offline validators. Again, this is little more than the declaration of a validator's opinion and it is up to the chain's runtime logic to determine what action to take on that "opinion", if any.
[block:api-header]
{
  "title": "Blocks and the Extrinsic Trie"
}
[/block]
Extrinsics are bundled together into a block as a series to be executed in some way. There is an explicit field in the block's header `extrinsics_root` which is a cryptographic digest of this series of extrinsics. This serves two purposes; first it prevents any alterations (by malicious parties or otherwise) to the series of extrinsics after the header has been built and distributed. Secondly, it provides a means of allowing light-client nodes to succinctly verify that any given extrinsic did indeed exist in a block given only knowledge of the header.
[block:api-header]
{
  "title": "Extrinsics in the SRML"
}
[/block]
The SRML provides two underlying generic implementations for an extrinsic: `UncheckedExtrinsic` (the basic variation) and `UncheckedMortalExtrinsic` (the more complex), the latter being a superset of functionality of the former. The basic variation provides a minimal, though complete, implementation of an Extrinsic under the SRML model of at most one signature together with a dispatchable call. The more complex variation provides this functionality together with the possibility of having an "era" encoded, thereby allowing a transaction to be valid only for a particular range of blocks.

These implementation are generic over four types:

- `Address`: the format of the sender, if any, as recorded in the transaction. Irrelevant for Inherents.
- `Index`: the type that encodes the transaction index. Irrelevant for Inherents.
- `Signature`: the signature type, which both defines the datatype which holds the signature and implies the logic that verifies it. (Currently `Ed25519Signature` is implemented.) Irrelevant for Inherents.
- `Call`: a type to inform the on-chain logic which code should be called in order to execute this extrinsic. Generally speaking, this must implement a special dispatch trait.

Further generic capability within an SRML runtime is created when the `Executive` and `Block` are specialised. These determine how an `Address` is transformed into an `AccountId` and may pass in a typed piece of context data to help doing that.
[block:api-header]
{
  "title": "Block-authoring Logic"
}
[/block]
TODO
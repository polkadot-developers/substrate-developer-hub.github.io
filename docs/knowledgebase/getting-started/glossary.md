---
title: Glossary
---

Glossary (alphabetical) of terms and lingo used in the Substrate and Polkadot codebases, as well as
architecture.

## Author (aka Block Author, Block Producer)

The node, actor or identity that is responsible for the creation of a block. Synonymous with "miner"
or "coinbase" on legacy PoW chains.

## Adaptive Quorum Biasing (AQB)

A means of specifying the quorum needed for a proposal to pass dependent upon voter turnout.
Positive bias means requiring increasingly more aye votes than nay votes as there is lower turnout;
negative (aka inverted) bias is the opposite (see the
[graphs](https://youtu.be/VsZuDJMmVPY?t=25413)). It avoids the need for strict quorums, which are
arbitrary and bring about undesirable mechanics.

## AfG

An internal codename for "Al's Finality Gadget", which is named after Alistair Stewart who invented
it. See GRANDPA.

## Aggregation

Used in the context of "module aggregation", this means combining analogous types from multiple
runtime modules into a single `enum` type with variants allowing each module's analogous type to be
represented. Currently there are five such datatypes:

- `Log` (an extensible header item)
- `Event` (an indicator of some particular state-transition)
- `Call` (a functor allowing a published function to be called with a set of arguments)
- `Origin` (the provenance of a function call)
- `Metadata` (information allowing introspection of the above)

## Approval Voting

Voting system where voter can vote for as many candidates as desired. The candidate with highest
overall amount of votes wins. Notably:

- voting for all candidates is exactly equivalent to voting for none; and
- it is possible to vote "against" a single candidate by voting for all other candidates.

## Authority

Authorities are the actors, keys or identities who, as a collective, manage consensus on the
network. `AuthorityId` can be used to identify them. In a PoS chain (such as one using the SRML's
Staking module), authorities are determined through a token-weighted nomination/voting system.

> We sometimes use "authorities" and "validators" to refer to what seems like the same thing.
> "Validators" is a broader term that can include other aspects of chain maintenance such as
> parachain validation. In general authorities are a (non-strict) subset of validators and many
> validators will be authorities.

## Aura (aka "Authority Round")

Deterministic consensus protocol with Non-Instant Finality where block production is achieved by a
rotating list of authorities that take turns issuing blocks over time, and where the majority of
those online are honest authorities. See https://wiki.parity.io/Aura

### Aurand

A variant of Aura where authorities are shuffled randomly on each round, increasing security.

### Aurand/Ouroboros

Extension of Aurand where block production involves validators competing over limited slots that
move very quickly, where most slots are not populated, but with rare slot collisions.

### Aurand+GRANDPA

A hybrid consensus scheme where Aurand is used for block production and short-term
probabilistic-finality, with long-term absolute finality provided through GRANDPA.

---

## Blind Assignment of Blockchain Extension (BABE)

Block authoring protocol similar to Aura where authorities are chosen with a verifiable random
function (VRF) instead of a rotating list. Authorities are assigned a time slot in which they can
select a chain and submit a new block for it. See
https://w3f-research.readthedocs.io/en/latest/polkadot/BABE.html

## Block

A single item of a block chain (or parachain) that amalgamates a series of extrinsic data (the
"body") together with some cryptographic information (the "header"). Blocks are arranged into a tree
through parent pointers (implemented as cryptographic digests of the parent) and the tree is pruned
into a list via a "fork-choice rule".

## Byzantine Fault Tolerance (BFT)

The ability of a distributed computer system to remain operational in the face of a proportion of
defective nodes or actors. "Byzantine" refers to the ultimate level of defectiveness, with such
nodes assumed to be actively malicious and coordinating rather than merely offline or buggy.
Typically BFT systems remain functional with up to around one third of Byzantine nodes.

### Byzantine Failure

The loss of a system service due to a Byzantine Fault (i.e. components in the system fail and there
is imperfect information about whether a component has failed) in systems that require consensus.

---

## Consensus

The process by which validators agree upon the next valid block to be added to the relay chain.

### Consensus Engine

A means for forming consensus over what constitutes the (one true) canonical chain. In the context
of Substrate, it refers to a set of trait implementations that dictate which of a number of input
blocks form the chain.

### Consensus Algorithms

An algorithm that is able to ensure that a set of actors who don't necessarily trust each other can
come to consensus over some computation. Often mentioned alongside "safety" (the ability to ensure
that any progression will eventually be agreed as having happened by all honest nodes) and
"liveness" (the ability to keep making progress).

See
https://medium.com/polkadot-network/grandpa-block-finality-in-polkadot-an-introduction-part-1-d08a24a021b5

## Crypto Primitives

The signature scheme and hashing algorithm. These are used for:

- The blockchain: blocks must be hashed under some algorithm and reference their parent block's
  hash.
- State: the storage is encoded as a trie allowing a cryptographic reference to any given state of
  it, which uses a hashing algorithm.
- Consensus: authorities must often use digital signature schemes of some kind.
- Transaction authentication: in runtimes where transactions and accounts are used, accounts must be
  associated with some digital identity.

In the SRML, SR25519 and ED25519 is favoured over ECDSA/SECP256k1.

## Council

The council is one of the SRML governance primitives and is a body of delegates chosen from a number
of approval votes for fixed terms. The council primarily serves as a body to optimise and
check/balance the more inclusive referendum system. It has a number of powers:

- introduce referenda with a removed or inverted (when unanimous only) AQB; and
- cancel a referendum (when unanimous only); and
- give up their seat.

---

## Database Backend

The means by which data relating to the blockchain is persisted between invocations of the node.

## Dev Phrase

A Mnemonic phrase which is intentionally made public. All of the well-known development accounts
(Alice, Bob, Charlie, Dave, Ferdie, and Eve) are generated from the same dev phrase. The dev phrase
is: `bottom drive obey lake curtain smoke basket hold race lonely fit walk`.

Many tools in the Substrate ecosystem, such as subkey, allow users to implicitly specify the dev
phrase with by only specifying a derivation path such as `//Alice`.

## Digest

An extensible field of the block header that encodes information needed by header-only ("light")
clients for chain synchronisation.

## Dispatch

The execution of a function with a pre-defined set of arguments. In the context of the SRML, this
refers specifically to the "runtime dispatch" system, a means of taking some pure data (the type is
known as `Call` by convention) and interpreting it in order to call a published function in a
runtime module with some arguments. Such published functions take one additional parameter known as
`origin` allowing the function to securely determine the provenance of its execution.

---

## Equivocating

Voting or otherwise backing multiple mutually-exclusive options within the consensus mechanism. This
is considered fundamentally Byzantine behaviour.

## Ethash

One of a number of proofs of work, to be used in a Proof-of-Work (PoW) consensus algorithm.
Originally developed for, and used in, Ethereum by a team led by Tim Hughes.

## Events

A means of recording, for the benefit of the off-chain world, that some particular state transition
has happened. Within the context of the SRML, events are one of a number of amalgamatable datatypes
that each module defines individually and which are aggregated together into a single overall `enum`
type that can represent all module's types. Events are implemented through a transient set of
storage items which are inspected immediately after a block has executed and reset during
block-initialisation.

## Executor

A means of executing a function call in a given runtime with a set of externalities. There are two
executor implementations present in Substrate, _Wasm_ and _Native_.

### Wasm Executor

An Executor that uses the Wasm binary and a Wasm interpreter to execute the needed call. This tends
to be slow but is guaranteed correct.

### Native Executor

An Executor that uses the current inbuilt and natively compiled runtime to execute the needed call.
If the code is compatible with the on-chain Wasm code, then it will be a lot faster and correct.
Incorrect versioning will result in a consensus error.

## Extrinsic

A piece of data bundled into a block that expresses something from the "external" (i.e. off-chain)
world. There are, broadly speaking, two types of extrinsic: transactions (which tend to be signed)
and inherents (which don't).

## Existential Deposit

Within the SRML Balances module, this is the minimum balance an account may have. Accounts cannot be
created with a balance less than some minimal amount, and if an account's balance ever drops below
amount, then it is removed entirely from the system.

> As long as both the sender and receiver keep a balance of at least the existential deposit,
> transfers, including of very small amounts, will work intuitively. However, an attempt to transfer
> a small balance from one account to another can have slightly less-than-intuitive consequences
> when either the sender or receiver balances are very low.
>
> If the amount transferred is less than the existential deposit and the destination account did not
> previously exist, then the transfer will "succeed" without actually creating and crediting the
> destination account; this appears to essentially just burn the transfer balance from the sender.
> If the transfer takes the sender to below the existential balance, then its account will be
> deleted. In this way, a transfer can even "successfully" result in the sender account being
> completely deleted, with the receiver account never being created.
>
> It is up to middleware to ensure that end-users are made aware of and/or protected from these edge
> cases.

---

## Finality

A part of consensus dealing with making a progression be irreversible. If a block is finalised, then
any real-world repercussions can be effected. The consensus algorithm must guarantee that finalised
blocks never need reverting.

One example of a work in progress provable finality gadget is being used in Polkadot:
[GRANDPA](#grandpa).

See also: [Aurand+GRANDPA](#aurand-grandpa), [Instant Finality](#instant-finality),
[Proof-of-Finality](#proof-of-finality), [Probabilistic Finality](#probabilistic-finality),
[Provable Finality](#provable-finality)

## Full Client

A node able to synchronise a block chain in a maximally secure manner through execution (and thus
verification) of all logic. Compare to Light Client.

---

## Genesis Configuration

A JSON-based configuration file that can be used to determine a genesis block and which thus allows
a single blockchain runtime to underpin multiple independent chains. Analogous to a "chain spec"
file in Parity Ethereum, and, when used with Substrate Node, could be considered the third and
highest-level usage paradigm of Substrate. The SRML provides a means of automatically generating the
chain configuration logic from the modules and their persistent storage items.

## GRANDPA

GRANDPA (GHOST-based Recursive ANcestor Deriving Prefix Agreement), also previously known as SHAFT
(SHared Ancestry Finality Tool), and originally known as AfG, is a finality gadget for blockchains,
implemented in Rust. The formal specification is published at
https://github.com/w3f/consensus/blob/master/pdf/grandpa-old.pdf.

---

## Header

Pieces of primarily cryptographic information that summarise a block. This information is used by
light-clients to get a minimally-secure but very efficient synchronisation of the chain.

## HoneyBadgerBFT

Instant-finality consensus algorithm with asynchronous "safety" and asynchronous "liveness" if
tweaked. Originally slated as one of a number of directions that Polkadot might explore, but
unlikely to be used now.

## Hybrid Consensus Protocol

Split blockchain consensus into Block Production and a Finality Gadget. This allows chain growth
speed to be as fast as in probabilistic "safety" consensus such as Ouroboros or Aurand but with same
level of security guarantees as in Instant-Finality Consensus Protocols. See
[the first implementation in Rust](https://github.com/paritytech/finality-afg), and
[the GRANDPA article](https://github.com/w3f/consensus/blob/master/pdf/grandpa-old.pdf).

---

## Instant-Finality

A non-probabilistic consensus protocol that gives a guarantee of finality immediately upon block
production, for example Tendermint and Rhododendron. These tend to be PBFT based and thus very
expensive in terms of communication requirements.

---

## JSON-RPC

A standard to call functions on a remote system using a JSON protocol. For Substrate, this is
implemented through the [Parity JSONRPC](https://github.com/paritytech/jsonrpc) crate.

### JSON-RPC Core Crate

Allows creation of JSON-RPC server handler, with supported methods registered. Exposes the Substrate
Core via different types of Transport Protocols (i.e. WS, HTTP, TCP, IPC)

### JSON-RPC Macros Crate

Allows simplifying in code the creation process of the JSON-RPC server through creating a Rust Trait
that is annotated with RPC method names, so you can just implement the methods names

### JSON-RPC Proxy Crate

Expose a simple server such as TCP from binaries, with another binary in front to serve as a proxy
that will expose all other Transport Protocols, and process incoming RPC calls before reaching an
upstream server, making it possible to implement Caching Middleware (saves having to go all the way
to the node), Permissioning Middleware, load balancing between node instances, or moving account
management to the proxy which processes the signed transaction. This provides an alternative to
embedding the whole JSON-RPC in each project and all the configuration options for each server.

### JSON-RPC PubSub Crate

Custom (though conventional) extension that is useful for Dapp developers. It allows "subscriptions"
so that the server sends notifications to the client automatically (instead of having to call and
poll a remote procedure manually all the time) but only with Transport Protocols that support
persistent connection between client and server (i.e. WS, TCP, IPC)

---

## Keystore

A subsystem in Substrate for managing keys for the purpose of producing new blocks.

---

## Libp2p Rust

Peer-to-peer networking library. Based on Protocol Labs' Libp2p implementations in Go and
JavaScript, and their (somewhat incomplete) specifications. Allows use of many transport protocols
including WebSockets (usable in a web browser).

---

## Metadata

Information capture allowing external code to introspect runtime data structures. Includes
comprehensive descriptions of the dispatch functions, events and storage items for each module in
the runtime.

---

## Nominated Proof-of-Stake (NPoS)

A means of determining a set of validators (and thus authorities) from a number of accounts willing
to commit their stake to the proper (non-Byzantine) functioning of one or more authoring/validator
nodes. This was originally proposed in the Polkadot paper and phrases a set of staked nominations as
a constraint optimisation problem to eventually give a maximally staked set of validators each with
a number of supporting nominators lending their stake. Slashing and rewards are done in a pro-rata
manner.

---

## OAS3

OpenAPI Specification 3 (OAS3), which was formally referred to as a Swagger API Specification, is
the specification used to author a Swagger File in either JSON or YAML format that may be used to
generate API Reference documentation.

## Origin

The provenance of a dispatched function call into the runtime. Can be customised (e.g. the Council
"Motion" origin), but there are two special "built-in"s:

- Root: system level origin, assumed to be omnipotent;
- Signed: transaction origin, includes the account identifier of the signer;

---

## Practical Byzantine Fault Tolerance (pBFT)

An original method to address the Byzantine Generals Problem. This allows for a system tolerant to
Byzantine behaviour from up to one third of its participants with an `O(2N**2)` communications
overhead per node.

## Probabilistic Finality

In a probabilistic finality based chain (e.g. Bitcoin), network participants rely on some
probability p that a proposed block B will remain in the canonical chain indefinitely, with p
approaching 1 as further blocks are produced on top of the block B.

## Proof-of-Finality

A piece of data that can be used to prove that a particular block is finalised. Potentially very
large unless signature aggregation is used.

## Provable Finality

Some consensus mechanisms aim for provable finality, whereby all blocks are guaranteed to be the
canonical block for that chain upon block inclusion. Provable finality is desirable in cases such as
when light clients do not have the full chain state, or when communicating with other chains, where
interchain data is not ubiquitously distributed. See: [GRANDPA](#grandpa)

---

## Rhododendron

An Instant-Finality BFT consensus algorithm, one of a number of adaptions of PBFT for the
blockchain. Others include Stellar's consensus algorithm and Tendermint. See the
[Rhododendron crate](https://github.com/paritytech/rhododendron).

## Runtime

The block execution logic of a blockchain, i.e. the state transition function. In Substrate, this is
stored on-chain in an implementation-neutral, machine-executable format as a WebAssembly binary.
Other systems tend to express it only in human-readable format (e.g. Ethereum) or not at all (e.g.
Bitcoin).

---

## SHAFT

SHAFT (SHared Ancestry Finality Tool). See [GRANDPA](#grandpa).

## Stake-Weighted Voting

Democratic system with one-vote-per-token, rather than one-vote-per-head.

## State

The data that can be drawn upon by, and that persists between, the executions of sequential blocks.
State is stored in a "Trie", a cryptographic immutable data-structure that makes incremental digests
very efficient. In Substrate, this trie is exposed to the runtime as a simple key/value map where
both keys and values can be arbitrary byte arrays.

## SRML (Substrate Runtime Module Library)

An extensible, generic, configurable and modular system for constructing runtimes and sharing
reusable components of them. Broadly speaking, this corresponds to the second usage paradigm of
Substrate, higher-level than using Substrate Core, but lower-level than simply running Substrate
Node with a custom configuration.

## STF (State Transition Function)

The logic of a blockchain that determines how the state changes when any given block is executed. In
Substrate, this is essentially equivalent to the Runtime.

## Storage Items

Within the SRML, storage items are a means of providing type-safe persistent data for the runtime,
achieved with a compiler macro, the `parity-codec` crate and the State API. All storage items must
have a type for which the `parity-codec::Codec` trait is implemented, and, if they have a
corresponding JSON Genesis Configuration entry, then also the `serde` traits.

## Substrate

A framework and toolkit for building and deploying upgradable, modular and efficient blockchains.
There are three usage paradigms in increasing levels of functionality and opinionation: Core, SRML
and Node.

### Substrate Core

The lowest level of the three Substrate usage paradigms, this is a minimalist/purist blockchain
building framework that contains essential functionality at the lowest level including consensus,
block production, chain synchronisation, I/O for JSON-RPC, runtime, network synchronisation,
database backend, telemetry, sandboxing, and versioning.

### Substrate Execution Environment

The runtime environment under which WebAssembly code runs in order to execute blocks.

---

## Transaction

A type of Extrinsic that includes a signature, and all valid instances cost the signer some amount
of tokens when included on-chain. Because validity can be determined efficiently, transactions can
be gossipped on the network with reasonable safety against DoS attacks, much as with Bitcoin and
Ethereum.

## Transaction Era

A definable period, expressed as a range of block numbers, where a transaction may validly be
included in a block. Eras are a backstop against transaction replay attacks in the case that an
account is reaped and its (replay-protecting) nonce is reset to zero. Eras are efficiently
expressible in transactions and cost only two bytes.

See [reclaiming an account](https://github.com/paritytech/substrate/wiki/Reclaiming-an-index).

## Transaction Pool

A collection of transactions that are not yet included in blocks but have been determined to be
valid.

### Tagged Transaction Pool

A "generic" transaction pool implementation allowing the runtime to specify whether a given
transaction is valid, how it should be prioritised and how it relates to other transactions in terms
of dependency and mutual exclusivity. It is designed to be easily extensible and general enough to
have both UTXO and account-based transaction modules be trivially expressible.

## Trie (Patricia Merkle Tree)

An immutable cryptographic data-structure typically used to express maps or sets of items where:

- a cryptographic digest of the dataset is needed; and/or
- it is cheap to recompute the digest with incremental changes to the dataset even when it is very
  large; and/or
- a concise proof that the dataset contains some item/pair (or lacks it) is needed.

---

## Validator

A semi-trusted (or untrusted but well-incentivised) actor that helps maintain the network. In
Substrate, validators broadly correspond to the authorities running the consensus system. In
Polkadot, validators also manage other duties such as guaranteeing data availability and validating
parachain candidate blocks.

See https://wiki.parity.io/Validator-Set.html

---

## WebAssembly (Wasm)

An execution architecture based upon a virtual machine that allows for the efficient, platform
neutral expression of deterministic machine-executable logic. Wasm is used across the Web platform
and well-tooled and easily compiled from Rust.

---

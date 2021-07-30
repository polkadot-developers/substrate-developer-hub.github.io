---
title: Glossary
---

This page defines and explains many of the domain-specific terms that are common to the Substrate
ecosystem. This is a helpful resource for even the most experienced Substrate developers.

---

## Adaptive Quorum Biasing (AQB)

A means of specifying a passing threshold for a referendum based on voter turnout. Positive turnout
bias means that as more votes are cast, the passing threshold _decreases_; i.e. a higher turnout
positively increases the likelihood of a referendum passing. Negative turnout bias means that the
passing threshold _increases_ as more votes are cast. Negative turnout bias is also called "default
carries" as, given an apathetic voting body, the referendum will pass by default. A neutral turnout
bias specifies a simple majority passing threshold. AQB removes the need for strict quorums, which
are arbitrary and create undesirable governance mechanics. AQB is implemented in the
[Democracy pallet](../runtime/frame#democracy), which provides the interfaces for a number of
on-chain bodies (e.g. a [Collective](#council) or any token holder) to call referenda with positive,
neutral, or negative biases.

## AfG

An internal codename for "Al's Finality Gadget", which is named after
[Alistair Stewart](https://w3f-research.readthedocs.io/en/latest/team_members/alistair.html)
who invented it. AfG is synonymous with [GRANDPA](#grandpa).

## Aggregation

Used in the context of [FRAME](#frame), "[pallet](#pallet) aggregation" means combining analogous
types from multiple runtime modules into a single type. This allows each module's analogous types to
be represented. Currently there are six such data types:

- `Call` - published functions that may be called with a set of arguments
- `Error` - used to inform users why a function invocation (`Call`) failed
- `Event` - pallets can emit events to make users aware of some state changes
- `Log` - an extensible header item
- `Metadata` - information that allows inspection of the above
- `Origin` - specifies the source of a function invocation (`Call`)

## Approval Voting

Voting system where voter can vote for as many candidates as desired. The candidate with highest
overall amount of votes wins. Notably:

- voting for all candidates is exactly equivalent to voting for none; and
- it is possible to vote "against" a single candidate by voting for all other candidates.

Approval voting is used by the
[FRAME Elections Phragmen pallet](../runtime/frame#elections-phragmen) that materializes as a
governing [Council](#council) on a number of Substrate-based chains.

## Author

The [node](#node) that is responsible for the creation of a [block](#block); block authors may be
referred to as block "producers". In a proof-of-work chain these nodes are called "miners".

## Authority

Authorities are the [nodes](#node) who, as a collective, manage [consensus](#consensus) on a
[blockchain](#blockchain) network. In a [proof-of-stake](#nominated-proof-of-stake-npos) network
(such as one using [the Staking pallet](../runtime/frame#staking) from [FRAME](#frame)), authorities
are determined through a token-weighted nomination/voting system.

> The terms "authorities" and "[validators](#validator)" may sometimes seem to refer the same thing.
> "Validators" is a broader term that can include other aspects of chain maintenance such as
> parachain validation. In general authorities are a (non-strict) subset of validators and many
> validators will be authorities.

## Aura (aka "Authority Round")

Deterministic [consensus](#consensus) protocol where [block](#block) production is limited to a
rotating list of [authorities](#authority) that take turns creating blocks; the majority of online
authorities are assumed to be honest. Learn more by reading
[the official wiki article](https://openethereum.github.io/Aura) for the Aura consensus
algorithm.

### Aura + GRANDPA

A [hybrid consensus](#hybrid-consensus) scheme where [Aura](#aura) is used for block production and
short-term [probabilistic finality](#probabilistic-finality), with
[deterministic finality](#deterministic-finality) provided through [GRANDPA](#grandpa).

---

## Blind Assignment of Blockchain Extension (BABE)

[Block authoring](#author) protocol similar to [Aura](#aura), however [authorities](#authority) win
[slots](#slot) based on a verifiable random function (VRF) as opposed to Aura's round-robin
selection method. The winning authority can select a chain and submit a new block for it. Learn more
about BABE by referring to its
[official Web3 Foundation research document](https://research.web3.foundation/en/latest/polkadot/block-production/Babe.html).

## Block

A single element of a blockchain that [cryptographically](#cryptographic-primitives) binds a set of
[extrinsic](#extrinsic) data (the "body") to a "[header](#header)". Blocks are arranged into a tree
through parent pointers (implemented as a hash of the parent) and the tree is pruned into a list via
a [fork-choice rule](../advanced/consensus#fork-choice-rules), and optional
[finality gadget](#finality).

## Blockchain

A blockchain is a distributed network of computers that uses
[cryptography](#cryptographic-primitives) to allow a group of participants to trustlessly come to
[consensus](#consensus) on the [state](#state) of a system as it evolves over time. The computers
that compose the blockchain network are called [nodes](#node).

## Byzantine Fault Tolerance (BFT)

The ability of a distributed computer system to remain operational in the face of a proportion of
defective [nodes](#node) or [actors](#authority). "Byzantine" refers to the ultimate level of
defectiveness, with such nodes assumed to be actively malicious and coordinating rather than merely
offline or buggy. Typically, BFT systems remain functional with up to around one-third of Byzantine
nodes.

### Byzantine Failure

The loss of a system service due to a Byzantine Fault (i.e. components in the system fail and there
is imperfect information about whether a component has failed) in systems that require consensus.

### Practical Byzantine Fault Tolerance (pBFT)

An early approach to Byzantine fault tolerance. pBFT systems tolerate Byzantine behavior from up to
one-third of participants. The communication overhead for such systems is `O(n²)`, where `n` is the
number of nodes (participants) in the system.

---

## Consensus

In the context of a [blockchain](#blockchain), consensus is the process nodes use to agree on the
canonical [fork](#fork) of a chain. Consensus is comprised of [authorship](#author),
[finality](#finality), and [fork-choice rule](../advanced/consensus#fork-choice-rules). In the
Substrate ecosystem, these three components are cleanly separated from one another, and the term
consensus often refers specifically to authorship.

### Consensus Engine

A subsystem of a Substrate [node](#node) that is responsible for consensus tasks.

### Consensus Algorithms

An algorithm that is able to ensure that a set of [actors](#authority), who don't necessarily trust
each other, can come to consensus over some computation. Often mentioned alongside "**safety**" (the
ability to ensure that any progression will eventually be agreed as having happened by all honest
nodes) and "**liveness**" (the ability to keep making progress). Many consensus algorithm are
referred to as being [Byzantine-fault-tolerant](#byzantine-fault-tolerance-bft).

There is
[a comprehensive blog series](https://polkadot.network/polkadot-consensus-part-1-introduction/) that
provides a deep dive into the consensus strategies of [the Polkadot Network](#polkadot-network).

### Hybrid Consensus

A blockchain consensus protocol that consists of independent or loosely coupled mechanisms for
[block production](#author) and [finality](#finality). This allows the chain to grow as fast as
probabilistic consensus protocols, such as [Aura](#aura-aka-authority-round), while still maintaining the same level of
security as [deterministic finality](#deterministic-finality) consensus protocols, such as
[GRANDPA](#grandpa). In general, block production algorithms tend to be faster than finality
mechanisms; separating these concerns gives Substrate developers greater control of their chain's
performance.

## Cryptographic Primitives

A term that refers to concepts like signature schemes and hashing algorithms. Cryptographic
primitives are essential to many aspects of the Substrate ecosystem:

- [Blockchains](#blockchain): [blocks](#block) must be hashed under some algorithm and reference
  their parent block's hash.
- [State](#state): Substrate storage is encoded as a [trie](#trie-patricia-merkle-tree), a data
  structure that uses hashing to facilitate efficient verification.
- [Consensus](#consensus): [authorities](#authority) often use digital signature schemes of some
  kind.
- [Transaction](#transaction) authentication: in [runtimes](#runtime) where transactions and
  [accounts](../learn-substrate/account-abstractions) are used, accounts are identified and
  authenticated through the use of cryptography.

## Council

The term "Council" is used on a number of Substrate-based networks, such as [Kusama](#kusama) and
[Polkadot](#polkadot) to refer to an instance of
[the Collective pallet](../runtime/frame#collective) that is used as a part of the network's
[FRAME](#frame)-based [runtime](#runtime). The Council primarily serves as a body to optimize and
check/balance the more inclusive referendum system.

---

## Database Backend

The means by which the [state](#state) of a [blockchain](#blockchain) network is persisted between
invocations of the [blockchain node](#node) application. There is
[documentation](../advanced/storage) that explains the implementation of the database backend that
is used by Substrate-based chains.

## Dev Phrase

A
[mnemonic phrase](https://en.wikipedia.org/wiki/Mnemonic#For_numerical_sequences_and_mathematical_operations)
that is intentionally made public. All of the
[well-known development accounts](../integrate/subkey#well-known-keys) (Alice, Bob, Charlie, Dave,
Ferdie, and Eve) are generated from the same dev phrase. The dev phrase is:
`bottom drive obey lake curtain smoke basket hold race lonely fit walk`.

Many tools in the Substrate ecosystem, such as [`subkey`](../integrate/subkey), allow users to
implicitly specify the dev phrase by only specifying a derivation path such as `//Alice`.

## Digest

An extensible field of the [block header](#header) that encodes information needed by several actors
in a blockchain network including, [light clients](#light-client) for chain synchronization,
consensus engines for block verification, and the runtime itself in the case of pre-runtime digests.

## Dispatch

A dispatch is the execution of a function with a pre-defined set of arguments. In the context of
[runtime](#runtime) development with [FRAME](#frame), this refers specifically to the "runtime
dispatch" system, a means of taking some pure data (the type is known as `Call` by convention) and
interpreting it in order to call a published function in a runtime module ("[pallet](#pallet)") with
some arguments. Such published functions take one additional parameter, known as
[`origin`](#origin), that allows the function to securely determine the provenance of its execution.

---

## Equivocating

A type of [Byzantine](#byzantine-fault-tolerance-bft) (erroneous/malicious) behavior that involves
backing multiple mutually-exclusive options within the [consensus](#consensus) mechanism.

## Ethash

A function used by some [proof-of-work](#proof-of-work) [consensus](#consensus) systems, notably
that which is used by the Ethereum blockchain. It was developed by
[a team led by Tim Hughes](https://github.com/ethereum/ethash/graphs/contributors).

## Events

A means of recording, for the benefit of the off-chain world, that some particular [state](#state)
transition happened. Within the context of [FRAME](#frame), events are one of a number of composable
data types that each [pallet](#pallet) may individually define. Events in FRAME are implemented as a
set of transient storage items that are inspected immediately after a block has executed and reset
during block-initialization.

## Executor

A means of executing a function call in a given [runtime](#runtime) with a set of dependencies.
There are two [executor](../../knowledgebase/advanced/executor) implementations present in
Substrate, _Wasm_ and _Native_.

### Native Executor

This executor uses a natively compiled runtime embedded in the [node](#node) to execute calls. This
is a performance optimization that up-to-date nodes can take advantage of.

### Wasm Executor

This executor uses a [Wasm](#webassembly-wasm) binary and a Wasm interpreter to execute calls. The
binary is guaranteed to be up-to-date regardless of the version of the blockchain [node](#node)
since it is persisted in the [state](#state) of the Substrate-based chain.

## Extrinsic

A piece of data that is bundled into a [block](#block) in order to express something from the
"external" (i.e. off-chain) world. There are, broadly speaking, two types of extrinsics:
transactions, which may be
[signed](../../knowledgebase/learn-substrate/extrinsics#signed-transactions) or
[unsigned](../../knowledgebase/learn-substrate/extrinsics#unsigned-transactions), and
[inherents](../../knowledgebase/learn-substrate/extrinsics#inherents), which are inserted by
[block authors](#author).

## Existential Deposit

Within the [Balances pallet](../../knowledgebase/runtime/frame#balances), this is the minimum
balance an account may have. Accounts cannot be created with a balance less than this amount, and if
an account's balance ever drops below this amount, the Balances pallet will use
[a FRAME System API](https://substrate.dev/rustdocs/latest/frame_system/pallet/struct.Pallet.html#method.dec_ref)
to drop its references to that account. If all the references to an account are dropped, it
[may be reaped](https://substrate.dev/rustdocs/latest/frame_system/pallet/struct.Pallet.html#method.allow_death).

---

## Finality

A part of [consensus](#consensus) that deals with making a progression irreversible. If a
[block](#block) is "finalized", then any [state](#state) changes it encapsulates are irreversible
without a hard fork and it is safe to effect any off-chain repercussions that depend on them. The
consensus algorithm _must_ guarantee that finalized blocks never need reverting.

[GRANDPA](#grandpa) is the [deterministic finality](#deterministic-finality) gadget that is used by
the [Polkadot Network](#polkadot-network).

### Deterministic Finality

In these systems, all blocks are guaranteed to be the canonical block for that chain upon block
inclusion. Deterministic finality is desirable in situations where the full chain is not available,
such as in the case of [light clients](#light-client). [GRANDPA](#grandpa) is a deterministic
finality gadget.

### Instant Finality

A non-probabilistic consensus protocol that gives a guarantee of finality immediately upon block
production. These tend to be [pBFT](#practical-byzantine-fault-tolerance-pbft)-based and thus very
expensive in terms of communication requirements.

### Probabilistic Finality

In these systems, finality is expressed in terms of a probability, denoted by `p`, that a proposed
block, denoted by `B`, will remain in the canonical chain; as more blocks are produced on top of
`B`, `p` approaches 1.

### Proof-of-Finality

A piece of data that can be used to prove that a particular block is finalized.

## Fork

Forks occur when two [blocks](#block) have the same parent. Forks must be
[resolved](../advanced/consensus#fork-choice-rules) so that only one canonical chain exists.

## Flaming Fir

Flaming Fir is a [Parity](https://www.parity.io/)-maintained Substrate-based
[blockchain](#blockchain) that exists for developing and testing the Substrate blockchain
development framework.

## FRAME

[FRAME](../runtime/frame) is Substrate's system for [**runtime**](#runtime) development. The name is
an acronym for the "Framework for Runtime Aggregation of Modularized Entities". FRAME allows
developers to create blockchain runtimes by composing modules, called "[pallets](#pallet)". Runtime
developers interact with FRAME by way of a [macro](#macro) language that makes it easy for
developers to define custom pallets (e.g. [`decl_event!`](../runtime/macros#decl_event),
[`decl_error!`](../runtime/macros#decl_error), [`decl_storage!`](../runtime/macros#decl_storage),
[`decl_module!`](../runtime/macros#decl_module) and compose pallets (e.g.
[`construct_runtime!`](../runtime/macros#construct_runtime) into a working runtime that can easily
be used to power a Substrate-based blockchain. The convention used in
[the Substrate codebase](https://github.com/paritytech/substrate/tree/master/frame) is to preface
FRAME's core modules with `frame_` and the optional pallets with `pallet_*`. For instance, the
macros mentioned above are all defined in the [`frame_support`](../runtime/frame#support-library)
module and all FRAME-based runtimes _must_ include the
[`frame_system`](../runtime/frame#system-library) module. Once the
`frame_support::construct_runtime` macro has been used to create a runtime that includes the
`frame_system` module, optional pallets such as the [Balances](../runtime/frame#balances) pallet may
be used to extend the runtimes core capabilities.

## Full Client

A [node](#node) that is able to synchronize a block chain in a maximally secure manner through
execution (and thus verification) of all logic. Full clients stand in contrast to
[light clients](#light-client).

---

## Genesis Configuration

A mechanism for specifying the initial (genesis) [state](#state) of a [blockchain](#blockchain).
Genesis configuration of Substrate-based chains is accomplished by way of a
[chain specification](../../knowledgebase/integrate/chain-spec) file, which makes it easy to use a
single Substrate codebase to underpin multiple independently configured chains.

## GRANDPA

A [deterministic finality](#deterministic-finality) gadget for [blockchains](#blockchain) that is
implemented in the [Rust](https://www.rust-lang.org/) programming language. The
[formal specification](https://github.com/w3f/consensus/blob/master/pdf/grandpa-old.pdf) is
maintained by the [Web3 Foundation](https://web3.foundation/)

---

## Header

A structure that is used to aggregate pieces of (primarily
[cryptographic](#cryptographic-primitives)) information that summarize a [block](#block). This
information is used by [light-clients](#light-client) to get a minimally-secure but very efficient
synchronization of the chain.

---

## Keystore

A subsystem in Substrate for managing keys for the purpose of producing new blocks.

## Kusama

[Kusama](https://kusama.network/) is a Substrate-based [blockchain](#blockchain) that implements a
design similar to the [Polkadot Network](#polkadot-network). Kusama is a
"[canary](https://en.wiktionary.org/wiki/canary_in_a_coal_mine)" network and is referred to as
[Polkadot's "wild cousin"](https://polkadot.network/kusama-polkadot-comparing-the-cousins/). The
differences between a canary network and a true test network are related to the expectations of
permanence and stability; although Kusama is expected to be more stable than a true test network,
like [Westend](#westend), it should not be expected to be as stable as an enterprise production
network like [Polkadot](#polkadot). Unlike Westend, which is maintained by
[Parity Technologies](https://www.parity.io/), Kusama (like Polkadot) is
[controlled by its network participants](../runtime/frame#democracy). The level of stability offered
by canary networks like Kusama is intended to encourage meaningful experimentation.

---

## libp2p

A peer-to-peer networking stack that allows use of many transport mechanisms, including WebSockets
(usable in a web browser). Substrate uses the
[Rust implementation](https://github.com/libp2p/rust-libp2p) of the libp2p networking stack.

## Light Client

A light client is a type of blockchain [node](#node) that does not store the [chain state](#state)
or produce ([author](#author)) blocks. It encapsulates basic capabilities for verifying
[cryptographic primitives](#cryptographic-primitives) and exposes an
[RPC (remote procedure call)](https://en.wikipedia.org/wiki/Remote_procedure_call) server to allow
blockchain users to interact with the blockchain network.

---

## Macro

Macros are features of some programming languages,
[including Rust](https://doc.rust-lang.org/1.7.0/book/macros.html), that allow developers to "write
code that writes code". [FRAME](#frame) provides a number of [macros](../runtime/macros) that make
it easy to compose a [runtime](#runtime).

## Metadata

Metadata is information about a system, such as a [blockchain](#blockchain), that makes it easier to
interact with that system. Blockchain [runtimes](#runtime) that are built with [FRAME](#frame)
expose [lots of helpful metadata](../../knowledgebase/runtime/metadata).

---

## Node

A node correlates to a running instance of a blockchain client; it is part of the
[peer-to-peer](https://en.wikipedia.org/wiki/Peer-to-peer) network that allows blockchain
participants to interact with one another. Substrate nodes can fill a number of roles in a
blockchain network. For instance, [validators](#validator) are the block-producing nodes that power
the blockchain, while [light-clients](#light-client) facilitate scalable interactions in
resource-constrained environments like [UIs](https://github.com/paritytech/substrate-connect) or
embedded devices.

## Nominated Proof-of-Stake (NPoS)

A means of determining a set of [validators](#validator) (and thus [authorities](#authority)) from a
number of accounts willing to commit their stake to the proper (non-[Byzantine](#byzantine-failure))
functioning of one or more [authoring](#author)/validator nodes. The Polkadot protocol describes
validator selection as a constraint optimization problem to eventually give a maximally staked set
of validators each with a number of supporting nominators lending their stake. Slashing and rewards
are done in a pro-rata manner.

---

## Origin

A [FRAME](#frame) primitive that identifies the source of a [dispatched](#dispatch) function call
into the [runtime](#runtime). The FRAME System module defines
[three built-in origins](../../knowledgebase/runtime/origin#raw-origins); [pallet](#pallet)
developers can easily define custom origins, such as those defined by the
[Collective pallet](https://substrate.dev/rustdocs/latest/pallet_collective/enum.RawOrigin.html).

---

## Parachain

A parachain is a [blockchain](#blockchain) that derives shared infrastructure and security from a
"[relay chain](#relay-chain)". You can
[learn more about parachains on the Polkadot Wiki](https://wiki.polkadot.network/docs/en/learn-parachains).

## Pallet

A module that can be used to extend the capabilities of a [FRAME](#frame)-based [runtime](#runtime).
Pallets bundle domain-specific logic along with related runtime primitives like [events](#event),
and [storage items](#storage-items).

## Polkadot Network

The [Polkadot Network](https://polkadot.network/) is a [blockchain](#blockchain) that serves as the
central hub of a heterogeneous blockchain network. It serves the role of
"[relay chain](#relay-chain)" and supports the other chains (the "[parachains](#parachain)") by
providing shared infrastructure and security. The Polkadot Network is progressing through a
[multi-phase launch process](https://polkadot.network/explaining-the-polkadot-launch-process/) and
does not currently support parachains.

## Proof-of-Work

A [consensus](#consensus) mechanism that deters attacks by requiring work on the part of network
participants. For instance, some proof-of-work systems require participants to use the
[Ethash](#ethash) function to calculate a hash as a proof of completed work.

---

## Relay Chain

The central hub in a heterogenous ("chain-of-chains") network. Relay chains are
[blockchains](#blockchain) that provide shared infrastructure and security to the other blockchains
in the network (the "[parachains](#parachain)"). In addition to providing [consensus](#consensus)
capabilities, relay chains also allow parachains to communicate and exchange digital assets without
needing to trust one another.

## Remote Procedure Call (RPC)

A mechanism for interacting with a computer program that allows developers to easily query the
computer program or even invoke its logic with parameters they supply. Substrate nodes expose an RPC
server on HTTP and WebSocket endpoints.

### JSON-RPC

A standard way to call functions on a remote system by using a JSON protocol. For Substrate, this is
implemented through the [Parity JSON-RPC](https://github.com/paritytech/jsonrpc) crate.

## Rhododendron

An [instant finality](#instant-finality),
[Byzantine fault tolerant (BFT)](#byzantine-fault-tolerance-bft) [consensus](#consensus) algorithm.
One of a number of adaptions of [pBFT](#practical-byzantine-fault-tolerance-pbft) for blockchains.
Refer to its [implementation on GitHub](https://github.com/paritytech/rhododendron).

## Rococo

Rococo is the [Polkadot](#polkadot) Network's [parachain](#parachain) test network. It is a
Substrate-based [blockchain](#blockchain) that is an evolving testbed for the capabilities of
heterogeneous blockchain networks.

## Runtime

The block execution logic of a blockchain, i.e. the
[state transition function](#state-transition-function-stf). In Substrate, this is stored as a
[WebAssembly](#webassembly-wasm) binary in the [chain state](#state).

---

## Slot

A fixed, equal interval of time used by consensus engines such as [Aura](#aura-aka-authority-round)
and [BABE](#blind-assignment-of-blockchain-extension-babe). In each slot, a subset of
[authorities](#authority) is permitted (or obliged, depending on the engine) to [author](#author) a
[block](#block).

## Stake-Weighted Voting

Democratic voting system that uses one-vote-per-token, rather than one-vote-per-head.

## State

In a [blockchain](#blockchain), the state refers to the cryptographically secure data that persists
between blocks and can be used to create new blocks as part of the state transition function. In
Substrate-based blockchains, state is stored in a [trie](#trie-patricia-merkle-tree), a data structure that supports the
efficient creation of incremental digests. This trie is exposed to the [runtime](#runtime) as
[a simple key/value map](../../knowledgebase/advanced/storage) where both keys and values can be
arbitrary byte arrays.

## State Transition Function (STF)

The logic of a [blockchain](#blockchain) that determines how the state changes when a
[block](#block) is processed. In Substrate, this is effectively equivalent to the
[runtime](#runtime).

## Storage Items

[FRAME](#frame) primitives that provide type-safe data persistence capabilities to the
[runtime](#runtime). Learn more about storage items in the Knowledge Base article for
[runtime storage](../../knowledgebase/runtime/storage).

## Substrate

A flexible framework for building modular, efficient, and upgradeable [blockchains](#blockchain).
Substrate is written in the [Rust](https://www.rust-lang.org/) programming language and is
maintained by [Parity Technologies](https://www.parity.io/).

---

## Transaction

A type of [extrinsic](#extrinsic) that can be safely gossiped between [nodes](#node) on the network
thanks to efficient [verification](#cryptographic-primitives) through
[signatures](../../knowledgebase/learn-substrate/extrinsics#signed-transactions) or
[signed extensions](../../knowledgebase/learn-substrate/extrinsics#signed-extension).

## Transaction Era

A definable period, expressed as a range of [block](#block) numbers, where a transaction may be
included in a block. Transaction eras are used to protect against transaction replay attacks in the
event that an account is reaped and its (replay-protecting) nonce is reset to zero.

## Transaction Pool

A collection of transactions that are not yet included in [blocks](#block) but have been determined
to be valid.

### Tagged Transaction Pool

A generic Substrate-based transaction pool implementation that allows the [runtime](#runtime) to
specify whether a given transaction is valid, how it should be prioritized, and how it relates to
other transactions in the pool in terms of dependency and mutual-exclusivity. It is designed to be
easily extensible and general enough to express both the
[UTXO](https://github.com/danforbes/danforbes/blob/master/writings/utxo.md) and account-based
transaction models.

## Trie (Patricia Merkle Tree)

An data structure that is used to represent sets of items where:

- a cryptographic digest of the dataset is needed; and/or
- it is cheap to recompute the digest with incremental changes to the dataset even when it is very
  large; and/or
- a concise proof that the dataset contains some item/pair (or lacks it) is needed.

---

## Validator

A semi-trusted (or untrusted but well-incentivized) actor that helps maintain a
[blockchain](#blockchain) network. In Substrate, validators broadly correspond to the
[authorities](#authority) running the [consensus](#consensus) system. In
[Polkadot](#polkadot-network), validators also manage other duties such as guaranteeing data
availability and validating [parachain](#parachain) candidate [blocks](#block).

---

## WebAssembly (Wasm)

An execution architecture that allows for the efficient, platform-neutral expression of
deterministic, machine-executable logic. [Wasm](https://webassembly.org/) is easily compiled from
the [Rust](http://rust-lang.org/) programming language and is used by Substrate-based chains to
provide portable [runtimes](#runtime) that can be included as part of the chain's [state](#state).

## Westend

Westend is a [Parity](https://www.parity.io/)-maintained, Substrate-based [blockchain](#blockchain)
that serves as the test network for [the Polkadot Network](#polkadot).

---

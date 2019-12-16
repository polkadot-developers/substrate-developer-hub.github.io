---
title: Consensus
---

Blockchain nodes use consensus engines to agree on the blockchain's state. This article covers the
fundamentals of consensus in blockchain systems, consensus interacts with the runtime in the
Substrate framework, and the consensus engines available with the framework.

## State Machines and Conflicts

A blockchain runtime is a [state machine](https://en.wikipedia.org/wiki/Finite-state_machine). It
has some internal state, and state transition function that allows it to transition from its current
state to a future state. In most runtimes there are states that have valid transitions to multiple
future states, but a single transition must be selected. Consider the following examples.

### Voting Conflict

A blockchain runtime tallys simple two-option votes for a DAO. When a new election is opened, Alice,
a member of the DAO, can vote Aye. Alice could also vote Nay. But Alice cannot vote both Aye and Nay
in the same election.

### Land Registry Conflict

Consider a blockchain runtime that serves as a land registry for a futuristic nation-state. The
registry keeps track of transfers of land ownership among citizens, and occasionally opens new plots
of land to be claimed. For a particular newly opened land run, Alice could claim the plot, or Bob
could claim it. But they cannot both claim it.

### Double Spend Conflict

A pure cryptocurrency, like Bitcoin, tracks the minting and spending of tokens. Alice holds a
particular coin, so she can pay it to Bob. She could also pay that coin to Carol. But she cannot pay
the same coin to both Bob and Carol.

The unifying property in these examples is that there are multiple transactions, each of which is
individually valid, but are mutually exclusive. Among the alternatives, a single transaction must be
chosen.


## Conflict Exclusion

In centralized systems, the central authority chooses among mutually exclusive alternatives by
recording transactions in the order it sees them, and choosing the first of the competing
alternatives when a conflict arises. In decentralized systems, the nodes will see transactions in
different orders, and thus they must use a more elaborate method to exclude transactions. As a
further complication, blockchain networks strive to be fault tolerant, which means that they should
continue to provide consistent data even if up to one third of participants are not following the
rules.

One practical solution, and the one taken in Substrate, is to find a decentralized way to agree on
transaction ordering, and then resolve conflicts by selecting the first alternative seen just as the
centralized authority did.

> In general a blockchain just needs some method to choose among conflicting transactions, and there
> are interesting paradigms that do not involve a total ordering. Such methods will not be
> considered further here.

## Fork Choice Rules

A block contains many transactions (technically it contains zero or more transactions), and a
reference to its parent block. A blockchain is any block, and all of its parents recursively.

The first step in resolving conflicting transactions is insisting that no blockchain can ever have
two conflicting transactions. If a block comes along that conflicts with one of its ancestors, that
block is invalid, and the nodes in the network will reject it.

With this rule in place, it is guaranteed that when conflicting blocks (blocks that contain
conflicting transactions) exist, there must be a fork. Each side of the fork represents a separate
blockchain. Thus, the problem of transaction conflict exclusion is reduced to choosing a fork in the chain.

A fork choice rule is an algorithm that takes a blockchain and selects the "best" block, and thus
the one that should be authored on. Substrate exposes this concept through the [SelectChain
Trait](https://substrate.dev/rustdocs/master/sp_consensus/trait.SelectChain.html).

In order for a blockchain to continue growing, a property often called liveness, the fork choice
rule must continue to select newer blocks as the chain grows. The following two examples have this
property. But a rule such as "shortest chain" would not.

### Longest Chain Rule

First introduced in Bitcoin, the ubiquitous longest chain rule, simply says that the cannonical
chain is the longest chain. Substrate provides this chain selection rule with the [LongestChain Struct](https://crates.parity.io/sc_client/struct.LongestChain.html).

DIAGRAM

### GHOST Rule

The Greedy Heaviest Observed SubTree rule says that, starting at the genesis block, each fork is
resolved by choosing the branch that has the most blocks built on it recursively.

DIAGRAM

## Block Production

Some nodes in a blockchain network are able to produce new blocks, a process known as authoring.
Exactly which nodes may author blocks depends on which consensus engine you're using. In a
centralized network, a single node might author all the blocks, whereas in a completely
permissionless network, any node that wishes to, may produce a block.

Nodes that are following the rules of the consensus protocol always produce new blocks on top of the
chain that the fork choice rule tells them to. But blockchains still must tolerate nodes that cheat
and build blocks in the wrong place. Considering the example fork choice rules we studied above,
it's easy to see that an attacker who wanted to revert many blocks worth of transactions could do so
by building a longer chain.

DIAGRAM

To prevent malicious nodes from creating such attack chains and overwhelming the honest chain
whenever they please, block production must be throttled so that nodes can only produce blocks at a
given rate. There are two common ways of achieving this throttling.

### Proof of Work

In proof of work systems like Bitcoin, any node may produce a block at any time, so long as it has
solved a computationally-intensive problem. Solving the problem takes CPU time, and thus miners can
only produce blocks in proportion with their computing resources. Substrate provides a Proof of Work
consensus engine.

### Slots

When using a slot based consensus algorithm, there must be a known set of validators who are
permitted to produce blocks. Time is divided up into discrete slots, and during each slot only some
of the validators may produce a block. The specifics of which validators can author blocks during
each slot vary from engine to engine. Substrate provides Aura and Babe, both of which are slot-based
block authoring engines.

## Finality

Transactors in any system want to know when their transactions are finalized, and blockchain is no
different. In some traditional systems, finality happens when a receipt is handed over, or papers
are signed.

Using the block authoring schemes and fork choice rules described so far, transactions are never
entirely finalized. There is always a chance that a longer (or heavier) chain will come along and
revert your transaction. However, the more blocks are built on top of a particular block, the less
likely it is to ever be reverted. In this way block authoring along with a proper fork choice rule
provide probabilistic finality.

When deterministic finality is desired, an additional game, known as a finality gadget can be added
to the blockchain's logic. In such a game, members of a fixed authority set cast finality votes, and
when enough votes have been cast, the block is deemed finalized. Blocks that have been finalized by
such a gadget cannot be reverted without external coordination such as a hard fork.

Properly-designed finality gadgets provide an additional desirable property known as safety which
guarantees that no two honest participants in the blockchain network will finalize conflicting
blocks. This safety condition is always contingent on a certain threshold of the participants, often
2/3, be follow the protocol honestly.

> There are systems that couple block authoring more tightly with finality by considering the act of
> building a block as a finality vote for that block. However the two can always be separated.

In systems that use a finality gadget, the fork choice rule must be modified to consider the results
of the finality game. For example, instead of taking the longest chain period, a node would take the
longest chain that contains the most recently finalized block. Substrate provides the GRANDPA
finality gadget.

## Consensus in Substrate

The Substrate framework ships with several consensus engines that provide block authoring, or
finality. This article provides a brief overview of the offerings included with Substrate itself. Developers are always welcome to provide their own custom consensus algorithms.

### Aura

[Aura](https://crates.parity.io/substrate_consensus_aura/index.html) provides a slot-based block
authoring mechanism. In aura a known set of authorities take turns producing blocks in order
forever.

### Babe

[Babe](https://crates.parity.io/substrate_consensus_babe/index.html) also provides slot-based block
authoring with a known set of validators. In these ways it is similar to Aura. Unlike Aura, each
validator is assigned a weight which must be assigned before block production begins. Instead of
simply taking turns, during each slot, each authority generates a pseudorandom number using a VRF.
If the random number is lower than the validator's weight, they are allowed to author a block.

Because multiple validators may be able to produce a block during the same slot, forks are more
common in Babe than they are in Aura, and are common even in good network conditions.

Substrate's implementation of Babe also has a fallback mechanism for when no authorities are chosen
in a given slot.

### Proof of Work

[Proof of Work](https://crates.parity.io/substrate_consensus_pow/index.html) block authoring was
first introduced in Bitcoin, and has served many production blockchains to date. Unlike Babe and
Aura, it is not slot-based, and does not have a known authority set. In proof of Work, anyone can
produce a block at any time, so long as they can solve a computationally challenging problem
(typically a hash preimage search). The difficulty of this problem can be tuned to provide a
statistical target block time.

### GRANDPA

[GRANDPA](https://crates.parity.io/substrate_finality_grandpa/index.html) provides block
finalization. It has a known weighted authority set like Babe. However, GRANDPA does not author
blocks; it just listens to gossip about blocks that have been produced by some authoring engine like
the three discussed above. Each GRANDPA authority participates in two rounds of voting on blocks.
The [details of grandpa voting](https://research.web3.foundation/en/latest/polkadot/GRANDPA.html)
are published by the Web 3 Foundation. Once 2/3 of the GRANDPA authorities have voted for a
particular block, it is considered finalized.

### Coordination with the Runtime

The simplest static consensus algorithms work entirely outside of the runtime as we've described so
far. However many consensus games are made much more powerful by adding features that require
coordination with the runtime. Examples include adjustable difficulty in Proof of Work, Authority
rotation in Proof of Authority, and Stake-based Weighting in Proof of Stake networks.

To accommodate these consensus features, Substrate has the concept of a [DigestItem](https://substrate.dev/rustdocs/master/sr_primitives/enum.DigestItem.html), a message passed from the outer part of the node, where consensus lives, to the runtime, or vice versa.


## Learn More
Dag Protocols
* Casper Labs
* Casanova

Note to reviewers: I was looking for a citation for the 1/3 byzantine threshold.
 I know the argument that if more than 1/3 are byzantine and the honest 2/3 are evenly spilt, the the 1/3 byzantine group could cause a safety violation by equivocating.

But when looking for the citation for the original source of that argument, I found these three sources which all seem to suggest that total_nodes > 3 * malicious_nodes + 1 is the threshold, which is 3/4, not 2/3.

https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.68.4044
https://arxiv.org/pdf/1507.06165.pdf
https://en.wikipedia.org/wiki/Byzantine_fault




Web3 research https://research.web3.foundation/en/latest/polkadot/GRANDPA.html

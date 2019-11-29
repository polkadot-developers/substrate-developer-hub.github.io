---
title: Consensus
---

## State Machines and Conflicts
A blockchain runtime is a [state machine](https://en.wikipedia.org/wiki/Finite-state_machine). It has some internal state, and state transition function that allows it to transition from its current state to a future state. In most runtimes there are states that have valid transitions to multiple future states, but a single transition must be selected. Consider the following examples.

### Voting Conflict
A blockchain runtime tallys simple two-option votes for a DAO. When a new election is opened, Alice, a member of the DAO, can vote Aye. Alice could also vote Nay. But Alice cannot vote both Aye and Nay in the same election.

### Land Registry Conflict
Consider a blockchain runtime that serves as a land registry for a futuristic nation-state. The registry keeps track of transfers of land ownership among citizens, and occasionally opens new plots of land to be claimed. For a particular newly opened land run, Alice could claim the plot, or Bob could claim it. But they cannot both claim it.

### Classic Double Spend Conflict
A pure cryptocurrency, like Bitcoin, tracks the minting and spending of tokens. Alice holds a particular coin, so she can pay it to Bob. She could also pay that coin to Carol. But she cannot pay the same coin to both Bob and Carol.

The unifying property in these examples is that there are multiple transactions, each of which is individually valid, but are mutually exclusive. Among the alternatives, a single transaction must be chosen.


## Conflict Exclusion
In centralized systems, the central authority chooses among mutually exclusive alternatives by recording transactions in the order it sees them, and choosing the first of the competing alternatives when a conflict arises. In decentralized systems, the nodes will see transactions in different orders, and thus they must use a more elaborate method to exclude transactions. As a further complication, blockchain networks strive to be fault tolerant, which means that they should continue to provide consistent data even if up to one third of participants are not following the rules.

One practical solution, and the one taken in Substrate, is to find a decentralized way to agree on transaction ordering, and then resolve conflicts by selecting the first alternative seen just as the centralized authority did.

> In general a blockchain just needs some method to choose among conflicting transactions, and there are interesting paradigms that do not involve a total ordering. Such methods will not be considered further here.

## Fork Choice Rules

A block contains many transactions (technically it contains zero or more transactions), and a reference to its parent block. A blockchain is any block, and all of its parents recursively.

The first step to resolve the conflicting transactions is insisting that no blockchain can ever have two conflicting transactions. If a block comes along that conflicts with one of its ancestors, that block is invalid, and the nodes in the network will reject it.

DIAGRAM

So when conflicting blocks (blocks that contain conflicting transactions) exist, there must be a fork. Each side of the fork represents a separate blockchain. Because no individual blockchain can contain conflicting transactions, we have reduced the problem of transaction conflict exclusion to choosing a fork in the chain.

One necessary property in a fork choice rule is "liveness". A rule with liveness guarantees that the chain will keep growing. Consider the following fork choice rules as examples.

### Longest Chain Rule
First introduced in Bitcoin, the ubiquitous longest chain rule, simply says that the cannonical chain is the longest chain.

DIAGRAM

### GHOST Rule
The Greedy Heaviest Observed SubTree rule says that, starting at the genesis block, each fork is resolved by choosing the branch that has the most blocks built on it recursively.

DIAGRAM

## Block Production
Some nodes in a blockchain network are able to produce new blocks. Exactly which nodes may author blocks depends on which consensus engine you're using. In a centralized network, a single node might author all the blocks, whereas in a completely permissionless network, any node that wishes to, may produce a block.

Nodes that are following the rules of the consensus protocol always produce new blocks on top of the chain that the fork choice rule tells them to. But blockchains still must tolerate nodes that cheat and build blocks in the wrong place. Considering the example fork choice rules we studied above, it's easy to see that an attacker who wanted to revert many blocks worth of transactions could do so by building a longer chain.

To prevent malicious nodes from creating attack chains and overwhelming the honest chain whenever they please, block production must be throttled so that nodes can only produce blocks at a given rate. There are two common ways of achieving this throttling.

### Proof of Work
In proof of work systems like Bitcoin, any node may produce a block at any time, so long as it has solved a computationally-intensive problem. Solving the problem takes CPU time, and thus miners can only produce blocks in proportion with their computing resources. Substrate provides a Proof of Work consensus engine.

### Slots
When using a slot based consensus algorithm, there must be a known set of validators who are permitted to produce blocks. Time is divided up into discrete slots, and during each slot only some of the validators may produce a block. The specifics of which validators can author blocks during each slot vary from engine to engine. Substrate provides Aura and Babe, both of which are slot-based block authoring engines.

## Finality
Transactors in any system want to know when their transaction is finalized, and blockchain is no different. In some traditional systems, finality happens when a receipt is handed over, or papers are signed.

Using the block authoring schemes and fork choice rules described so far, transactions are never truly finalized with certainty. There is always a chance that a longer (or heavier) chain will come along and revert your transaction. However, the more blocks are built on top of a particular block, the less likely it is to ever be reverted. In this way block authoring along with a proper fork choice rule provide probabilistic finality.

When true finality is desired, an additional game, known as a finality gadget can be added to the blockchain's logic. In such a game, members of a fixed authority set cast finality votes, and when a certain threshold is reached, the block is deemed finalized, and will never be reverted.

> There are systems that couple block authoring more tightly with finality by considering the act of building a block as a finality vote for that block. However the two can always be separated.

In systems that use a finality gadget, the fork choice rule must be modified to consider the results of the finality game. For example, instead of taking the longest chain period, a node would take the longest chain that contains the most recently finalized block. Substrate provides the Grandpa finality gadget.

## Consensus in Substrate
The Substrate framework ships with several consensus engines that provide block authoring, finality, or both.

Learn more about each of them in their respective articles
[Aura]()
[Babe]()
[Grandpa]()
[Proof of Work]()

This API can best be seen in the node examples in service.rs. This would be a good place to link to a recipe's example.

### Coordination with the Runtime
The simplest static consensus algorithms work entirely outside of the runtime as we've described so far. However many consensus games are made much more powerful by adding features that require coordination with the runtime. Examples include adjustable difficulty in Proof of Work, Authority rotation in Proof of Authority, and Stake-based Weighting in Proof of Stake networks.

To accommodate these consensus features, Substrate has the concept of a [DigestItem](https://substrate.dev/rustdocs/master/sr_primitives/enum.DigestItem.html), a message passed from the outer part of the node, where consensus lives, to the runtime.

TODO What is a concrete example of when a pre-runtime digest is used. And wth is ChangesTrie?


## Learn More
Dag Protocols
* Casper Labs
* Casanova

Why 1/3? Byzantine Generals Problem

Web3 research

Exercises
* Longest Chain
* GHOST
* 2/3 GHOST
*

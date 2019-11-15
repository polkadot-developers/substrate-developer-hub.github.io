---
title: "Overview"
---

This page is an overview on the state of smart contracts in Substrate.

## Overview



## Virtual Machines

The Substrate Runtime Module Library (SRML) provides two smart contract virtual machines which can be added to your Substrate runtime.

### Contracts Module

The [SRML Contracts module](conceptual/runtime/contracts/contracts_module.md) is a 

### EVM Module



### Custom

It should be stated clearly that Substrate is not a platform limited by what comes out of the box. We believe that 



## Smart Contract Languages

## ink!





## Smart Contracts vs Runtime Modules

Substrate Runtime Modules and Substrate Smart Contracts are two different approaches to building "decentralized applications" using the Substrate framework.

#### Smart Contracts

A traditional smart contract platform allows users to publish additional logic on top of some core blockchain logic. Since smart contract logic can be published by anyone, including malicious actors and inexperienced developers, there are a number of intentional safe guards built around the smart contract platform. Some examples are:

* Fees: Ensuring that contract developers are charged for the computation and storage they force on the computers running their contract, and not allowed to abuse the block creators.
* Sandbox: A contract is not able to modify core blockchain storage or the storage of other contracts directly. It's power is limited to only modifying it's own state, and the ability to make outside calls to other contracts or runtime functions.
* State Rent: A contract takes up space on the blockchain, and thus should be charged for simply existing. This ensures that people don't take advantage of "free, unlimited storage".
* Revert: A contract can be prone to have situations which lead to logical errors. The expectations of a contract developer are low, so extra overhead is added to support reverting transactions when they fail so no state is updated when things go wrong.

These different overheads makes running contracts slower and more costly, but again, the "target audience" for contract development is different than runtime developers.

Contracts can allow your community to extend and develop on top of your runtime logic without needing to go through all the craziness of proposals, runtime upgrades, etc... It may even be used as a testing grounds for future runtime changes, but done in a way that isolates your network from any of the growing pains or errors which may occur.

**In summary**, Substrate Smart Contracts:

* Are inherently safer to the network.
* Have built in economic incentives against abuse.
* Have computational overhead to support graceful failures in logic.
* Have a lower bar to entry for development.
* Enable fast pace community interaction through a playground to write new logic.

### Runtime Modules

Runtime modules on the other hand afford none of these protections or safe guards that Smart Contracts give you. As a runtime developer, the bar to entry on the code you produce jumps way up.

You have full control of the underlying logic that each node on your network will run. You have full access to each and every storage item across all of your modules, which you can modify and control. You can even brick your chain with incorrect logic or poor error handling.

Substrate Runtime Module development has the intention of producing lean, performant, and fast nodes. It affords none of the protections or overhead of transaction reverting, and does not implicitly introduce any fee system to the computation which nodes on your chain run. This mean while you are developing runtime functions, it is up to _you_ to correctly asses and apply fees to the different parts of your runtime logic such that it will not be abused by bad actors and hurt your network.

**In summary**, Substrate Runtime Modules:

* Provide low level access to your entire blockchain.
* Have removed the overhead of built-in saftey for performance.
* Have a high bar to entry for developers.
  * Not necessarily to write working code, but to avoid writing broken code.
* Has no inherent economic incentives to repel bad actors.


### The Right Tool For You

Substrate Runtime Modules and Substrate Smart Contracts are tools made available to you to solve problems.

There is likely some amount of overlap in the kinds of problems each one can solve, but there is also a clear set of problems suited for only one of the two. Two give just one example in each category:

* Runtime Module: Building a privacy layer on top of transactions in your blockchain.
* Shared: Building a DApp like Cryptokitties which may need to build up a community of users (leaning toward Smart Contract), or may need to scale to millions of transactions a day (leaning toward Runtime Module).
* Smart Contract: Introducing 2nd layer tokens and custom assets to your network.

In addition to everything written above, you also need to take into account the costs to set up a DApp using a certain tool. Deploying a contract is a relatively simple and easy process since you take advantage of the existing network. The only costs to you are those fees which you pay to deploy and maintain your contract.

Setting up your own blockchain on the other hand has the cost of building a community who find value in your service or establishing a private network with the overhead of cloud computing system and general network maintenance.

I think that now is really the first time it has been so easy and approachable to build runtime logic. In the past, everyone built their "decentralized application idea" using the tool available to them, Smart Contracts, even when that wasn't the best tool for the job.

With the introduction of Substrate, there is a new tool available for building your decentralized applications; but again, it would be wrong to think that all of your ideas should be a Substrate Runtime Module.

Instead, for the first time as a community, we have two tools, and we need to figure out together which one is best to use for each scenario. I don't think all the answers to this exist today, but we can learn and make some educated guesses along the way.

## Next Steps

### Learn More

- Learn how to [develop custom Substrate runtime
  modules](development/module/index.md).

### Examples

- Follow a [tutorial to add a runtime module to your Substrate
  runtime](tutorials/adding-a-module-to-your-runtime.md).

### References

- Visit the reference docs for the [System
  module](/rustdocs/master/srml_system/index.html).

- Visit the reference docs for the [Executive
  module](/rustdocs/master/srml_executive/index.html).

- Visit the reference docs for the [SRML support
  library](https://substrate.dev/rustdocs/master/srml_support/index.html).

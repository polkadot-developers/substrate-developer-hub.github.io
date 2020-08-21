---
title: Overview
---

This page is an overview on the state of smart contracts in Substrate.

## Virtual Machines

FRAME provides two smart contract virtual machines which can be added to your Substrate runtime.

### Contracts Module

The **FRAME Contracts pallet** (SEAL) provides functionality for the runtime to deploy and execute
WebAssembly smart-contracts. It is designed to iterate on the design of modern smart contract
platforms.

### EVM Module

The [FRAME EVM pallet](evm-pallet) provides an EVM execution environment that allows unmodified EVM
code to be executed in a Substrate-based blockchain. It is designed to most closely emulate the
functionality of executing contracts on the Ethereum mainnet within the Substrate runtime.

### Custom

Substrate is not a platform where you are limited with what comes out of the box.

We encourage further development of alternative smart contract platforms on top of the Substrate
runtime. Use these pre-built modules to inform how you might design your own system or port over
existing systems to work on a Substrate based chain.

## Smart Contract Languages

### ink!

[ink!](ink-fundamentals) is a Rust-based eDSL for writing Wasm smart contracts specifically for the
[Contracts module](#contracts-module). It is designed for correctness, conciseness and efficiency.

## Smart Contracts vs Runtime Modules

Substrate runtime modules and Substrate smart contracts are two different approaches to building
"decentralized applications" using the Substrate framework.

### Smart Contracts

A traditional smart contract platform allows users to publish additional logic on top of some core
blockchain logic. Since smart contract logic can be published by anyone, including malicious actors
and inexperienced developers, there are a number of intentional safe guards built around these
public smart contract platform.

Some examples are:

- **Fees**: Ensuring that contract developers are charged for the computation and storage they force
  on the computers running their contract, and not allowed to abuse the block creators.
- **Sandbox**: A contract is not able to modify core blockchain storage or the storage of other
  contracts directly. It's power is limited to only modifying it's own state, and the ability to
  make outside calls to other contracts or runtime functions.
- **State Rent**: A contract takes up space on the blockchain, and thus should be charged for simply
  existing. This ensures that people don't take advantage of "free, unlimited storage".
- **Reversion**: A contract can be prone to have situations which lead to logical errors. The
  expectations of a contract developer are low, so extra overhead is added to support reverting
  transactions when they fail so no state is updated when things go wrong.

These different overheads makes running contracts slower and more costly, but again, the "target
audience" for contract development is different than runtime developers.

Contracts can allow your community to extend and develop on top of your runtime logic without
needing to go through all the craziness of proposals, runtime upgrades, etc... It may even be used
as a testing grounds for future runtime changes, but done in a way that isolates your network from
any of the growing pains or errors which may occur.

**In summary**, Substrate Smart Contracts:

- Are inherently safer to the network.
- Have built in economic incentives against abuse.
- Have computational overhead to support graceful failures in logic.
- Have a lower bar to entry for development.
- Enable fast pace community interaction through a playground to write new logic.

### Runtime Modules

Runtime modules on the other hand afford none of these protections or safe guards that Smart
Contracts give you. As a runtime developer, the bar to entry on the code you produce jumps way up.

You have full control of the underlying logic that each node on your network will run. You have full
access to each and every storage item across all of your modules, which you can modify and control.
You can even brick your chain with incorrect logic or poor error handling.

Substrate runtime module development has the intention of producing lean, performant, and fast
nodes. It provides none of the protections or overhead of transaction reverting, and does not
implicitly introduce any fee system to the computation which nodes on your chain run. This mean
while you are developing runtime functions, it is up to _you_ to correctly assess and apply fees to
the different parts of your runtime logic such that it will not be abused by bad actors and hurt
your network.

**In summary**, Substrate Runtime Modules:

- Provide low level access to your entire blockchain.
- Have removed the overhead of built-in safety for performance.
- Have a high bar to entry for developers.
  - Not necessarily to write working code, but to avoid writing broken code.
- Has no inherent economic incentives to repel bad actors.

### The Right Tool For You

Substrate runtime modules and Substrate smart contracts are tools made available to you to solve
problems.

There is likely some amount of overlap in the kinds of problems each one can solve, but there is
also a clear set of problems suited for only one of the two. To give just one example in each
category:

- Runtime Module: Building a privacy layer on top of transactions in your blockchain.
- Shared: Building a gaming dApp which may need to build up a community of users (leaning toward
  Smart Contract), or may need to scale to millions of transactions a day (leaning toward Runtime
  Module).
- Smart Contract: Introducing multi-signature wallets over the currency of your blockchain.

In addition to everything written above, you also need to take into account the costs to set up a
DApp using a certain tool. Deploying a contract is a relatively simple and easy process since you
take advantage of the existing network. The only costs to you are those fees which you pay to deploy
and maintain your contract.

Setting up your own blockchain on the other hand has the cost of building a community who find value
in your service or establishing a private network with the overhead of cloud computing system and
general network maintenance.

It is hard to provide direct guidance on every possible scenario, but use the table below to help
influence your decision on the kinds of situations you may want to use these different tools:

<table>
<tr>
<th>Runtime Module</th>
<th>Either</th>
<th>Smart Contract</th>
</tr>
<tr>
<td>

- Privacy Layer
- Feeless Token
- Light-Client Bridge
- Decentralized Exchange
- Oracles
- Stable Coin

</td>
<td>

- Game dApp
  - Small scale (contract)
  - Large scale (runtime)
- Decentralized Autonomous Organizations (DAO)
  - Community driven (contract)
  - Protocol driven (runtime)
- Treasury
  - Community driven (contract)
  - Protocol driven (runtime)

</td>
<td>

- Multi-signature Wallet

</td>
</tr>
</table>

## Next Steps

### Learn More

- See how Substrate is iterating on smart contract blockchains with the
  [Contracts pallet](contracts-pallet).
- Investigate the [EVM pallet](evm-pallet) to see if it is what you need for your next project.
- Read about the [ink! smart contract language](ink-fundamentals).

### Examples

- Follow a
  [tutorial to add the Contracts pallet to your FRAME runtime](../../tutorials/add-contracts-pallet/).
- Learn how to
  [start developing with the Contracts pallet and ink!](ink-development).

### References

- Visit the reference docs for the
  [Contracts pallet](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_contracts/index.html).
- Visit the reference docs for the
  [EVM pallet](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_evm/index.html).
- Take a look at the [repository for ink!](https://github.com/paritytech/ink).

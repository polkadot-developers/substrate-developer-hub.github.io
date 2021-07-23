---
title: Overview
---

This article gives a brief overview of the different ways to implement
smart contracts for Substrate-based blockchains. It also aims to provide insight on
reasons for choosing smart contract development over runtime development for your on-chain logic.

## Smart Contract Toolkits

Substrate provides two smart contract virtual machines which can be added to your runtime. Each come 
with additional tools to ease development depending on your use cases.

### Contracts Pallet

The [**FRAME Contracts pallet**](https://substrate.dev/rustdocs/latest/pallet_contracts/index.html)
provides functionality for a Substrate runtime to deploy
and execute WebAssembly Smart Contracts. It has its
own smart contract language, specially designed to write contracts that optimize for correctness, conciseness and efficiency.
Learn more [in this section](contracts-pallet).

### EVM Pallet

The [**FRAME EVM pallet**](https://docs.rs/pallet_evm/) provides an EVM execution environment for Substrate's Ethereum 
compatibility layer, known as [Frontier](https://github.com/paritytech/frontier). It allows unmodified EVM
code to be executed in a Substrate-based blockchain, designed to closely emulate the
functionality of executing contracts on the Ethereum mainnet within the Substrate runtime.
Learn more in [this section](evm-pallet).

> **Note:** Substrate is built to enable developers to extend what's provided out of the box. 
We encourage further development of alternative smart contract platforms on top of the Substrate
runtime. 
Use these pre-built pallets to inform how you might design your own system or how you could port over an
existing system to work on a Substrate-based chain.

## Smart Contracts vs. Runtime Development

Developing Substrate runtimes and smart contracts are two different approaches to building
"decentralized applications" using Substrate.

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

Contracts allow your community to extend and develop on top of your runtime logic without
needing to go through all the craziness of proposals, runtime upgrades, etc... It may even be used
as a testing grounds for future runtime changes, but done in a way that isolates your network from
any of the growing pains or errors which may occur.

**In summary, Substrate Smart Contracts:**:

- Are inherently safer to the network.
- Have built in economic incentives against abuse.
- Have computational overhead to support graceful failures in logic.
- Have a lower bar to entry for development.
- Enable fast pace community interaction through a playground to write new logic.

### Runtime Development

On the other hand, runtime development affords none of these protections or safe guards that Smart
Contracts give you. As a runtime developer, the barrier to entry on the code you produce jumps way up.

You have full control of the underlying logic that each node on your network will run. You have full
access to each and every storage item across all of your pallets, which you can modify and control.
You can even brick your chain with incorrect logic or poor error handling. In essence, runtime engineers
have a lot more responsibility for the correctness and robustness of the code they write.

Substrate runtime development has the intention of producing lean, performant, and fast nodes.
It provides none of the protections or overhead of transaction reverting, and does not
implicitly introduce any fee system to the computation which nodes on your chain run. This means
while you are developing runtime functions, it is up to _you_ to correctly assess and apply fees to
different parts of your runtime logic such that it will not be abused by malicious actors.

**In summary, Substrate Runtime Development:**

- Provides low level access to your entire blockchain.
- Removes the overhead of built-in safety for performance,
giving developers increased flexibility at the cost of increased responsibility.
- Raises the entry bar for developers, where developers are 
not only responsible for writing working code but must constantly check to avoid writing broken code.
- Has no inherent economic incentives to repel bad actors.

### Choosing the Right Approach

Substrate runtime development and Smart Contracts each provide tools designed for different problem spaces. There is likely some amount of overlap in the kinds of problems each one can solve, but
there is also a clear set of problems suited for only one of the two. To give just one example in
each category:

- **Runtime Development**: Building a privacy layer on top of transactions in your blockchain.
- **Smart Contract**: Introducing multi-signature wallets over the currency of your blockchain.
- **Use Case Specific**: Building a gaming dApp which may need to build up a community of users (leaning towards a
  Smart Contract), or may need to scale to millions of transactions a day (leaning more towards Runtime
  Development).

In addition to everything written above, you also need to take into account the associated costs of setting up your
dApp using one approach over the other. Deploying a contract is a relatively simple and easy process since you
take advantage of the existing network. The only costs to you are the fees which you pay to deploy
and maintain your contract.

Setting up your own blockchain, on the other hand has the cost of building a community who find value
in the service you provide. Or, the additional costs 
associated with establishing a private network with the overhead of a cloud computing based architecture and
general network maintenance.

It is hard to provide guidance on every possible scenario 
as each one depends on specific use cases and design decisions. 
In general, runtime development is most favorable for applications that
require higher degrees of flexibility and adaptability &mdash; for example,
applications that require accomodating different types of users or layers of 
governance. The table below is meant to help inform your 
decisions on which approach to use based on different situations.

<table>
  <tr>
    <th>Runtime Development </th>
    <th>Smart Contract</th>
    <th>Use Case Specific</th>
  </tr>
  <tr>
    <td>
      <ul>
      <li> Privacy Layer </li>
      <li> Feeless Token </li>
      <li> Light-Client Bridge </li>
      <li> Decentralized Exchange </li>
      <li> Oracles </li>
      <li> Stable Coin </li>
      </ul>      
    </td>
    <td>
      <ul>
      <li>Multi-signature Wallet </li>
      <li>Data services </li>
      <li>Simple fundraiser </li>
      </ul>
    </td>
    <td>
      Gaming dApp
        <ul><li>Small scale (contract)</li>
        <li> Large scale (runtime)</li></ul>
      Decentralized Autonomous Organizations (DAO)
        <ul><li>Community driven (contract)</li>
        <li>Protocol driven (runtime)</li></ul>
      Treasury
        <ul><li>Community driven (contract)</li>
        <li>Protocol driven (runtime)</li></ul>
    </td>
  </tr>
</table>

> If you are building on Polkadot, you can also
[deploy smart contracts on its parachain](https://wiki.polkadot.network/docs/en/build-smart-contracts). Check here for
[comparison between developing on parachain, parathread, and smart contract](https://wiki.polkadot.network/docs/en/build-build-with-polkadot#what-is-the-difference-between-building-a-parachain-a-parathread-or-a-smart-contract).

### Learn More

- See how Substrate is iterating on smart contract blockchains with the
  [Contracts pallet](contracts-pallet).
- Investigate the [EVM pallet](evm-pallet) to see if it is what you need for your next project.
- Learn more about [why Rust is an ideal smart contract language](https://paritytech.github.io/ink-docs/why-rust-for-smart-contracts).
### Examples

- Follow a
  [tutorial to add the Contracts pallet to your FRAME runtime](../../tutorials/add-contracts-pallet/).
- Learn how to
  [start developing with the Contracts pallet and ink!](https://substrate.dev/substrate-contracts-workshop/#/).

### References

- Visit the reference docs for the
  [Contracts pallet](https://substrate.dev/rustdocs/latest/pallet_contracts/index.html).
- View source code and documentation of the
  [EVM pallet](https://github.com/paritytech/frontier/tree/master/frame/evm).
- Visit the
  [ink! repository to look at the source](https://github.com/paritytech/ink).
- Visit [ink! main documentation site](https://paritytech.github.io/ink-docs/).

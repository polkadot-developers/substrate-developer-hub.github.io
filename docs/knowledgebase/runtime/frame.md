---
title: FRAME
---

The **Framework for Runtime Aggregation of Modularized Entities (FRAME)** is a set of modules
(called pallets) and support libraries that simplify runtime development. Pallets are individual
modules within FRAME that host domain-specific logic.

FRAME provides some helper modules to interact with Substrate Primitives, which provide the
interface to the core client.

## Overview

The following diagram shows the architectural overview of FRAME and its support libraries:

![FRAME Architecture](assets/frame-arch.png)

### Pallets

When building with FRAME, the Substrate runtime is composed of several smaller components called
pallets. A pallet contains a set of types, storage items, and functions that define a set of
features and functionality for a runtime.

![FRAME Runtime](assets/frame-runtime.png)

### System Library

The [System library](https://substrate.dev/rustdocs/v2.0.0-rc6/frame_system/index.html) provides
low-level types, storage, and functions for your blockchain. All other pallets depend on the System
library as the basis of your Substrate runtime.

The System library defines all the core types for the Substrate runtime, such as:

- Origin
- Block Number
- Account Id
- Hash
- Header
- Version
- etc...

It also has a number of system-critical storage items, such as:

- Account Nonce
- Block Hash
- Block Number
- Events
- etc...

Finally, it defines a number of low level functions which can access your blockchain storage, verify
the origin of an extrinsic, and more.

### Executive Module

The [FRAME Executive module](https://substrate.dev/rustdocs/v2.0.0-rc6/frame_executive/index.html) acts as the
orchestration layer for the runtime. It dispatches incoming extrinsic calls to the respective
pallets in the runtime.

### Support Library

The [FRAME Support library](https://substrate.dev/rustdocs/v2.0.0-rc6/frame_support/index.html) is a
collection of Rust macros, types, traits, and functions that simplify the development of Substrate
pallets.

The support macros expand at compile time to generate code that is used by the runtime and reduce
boilerplate code for the most common components of a pallet.

### Runtime

The runtime library brings together all these components and pallets. It defines which pallets are
included with your runtime and configures them to work together to compose your final runtime. When
calls are made to your runtime, it uses the Executive pallet to dispatch those calls to the
individual pallets.

### Benchmarking

Macro for benchmarking a FRAME runtime.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/frame_benchmarking/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/benchmarking/src/lib.rs)

## Prebuilt Pallets

Some pallets will be sufficiently general-purpose to be reused in many blockchains. Anyone is free
to write and share useful pallets. There is a collection of popular pallets provided with Substrate.
Let's explore them.

### Assets

The Assets pallet is a simple, secure module for dealing with fungible assets.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_assets/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/assets/src/lib.rs)

### Atomic Swap

A module for atomically sending funds from an origin to a target. A proof is used to allow the
target to approve (claim) the swap. If the swap is not claimed within a specified duration of time,
the sender may cancel it.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_atomic_swap/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/atomic-swap/src/lib.rs)

### Aura

The Aura pallet extends Aura consensus by managing offline reporting.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_aura/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/aura/src/lib.rs)

### Authority Discovery

The Authority Discovery pallet is used by `core/authority-discovery` to retrieve the current set of
authorities, learn its own authority ID, as well as to sign and verify messages to and from other
authorities.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_authority_discovery/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/authority-discovery/src/lib.rs)

### Authorship

The Authorship pallet tracks the current author of the block and recent uncles.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_authorship/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/authorship/src/lib.rs)

### BABE

The BABE pallet extends BABE consensus by collecting on-chain randomness from VRF outputs and
managing epoch transitions.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_babe/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/babe/src/lib.rs)

### Balances

The Balances pallet provides functionality for handling accounts and balances.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_balances/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/balances/src/lib.rs)

### Benchmark

A pallet that contains common runtime patterns in an isolated manner. This pallet is not meant to be
used in a production blockchain, just for benchmarking and testing purposes.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_benchmark/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/benchmark/src/lib.rs)

### Collective

The Collective pallet allows a set of account IDs to make their collective feelings known through
dispatched calls from specialized origins.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_collective/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/collective/src/lib.rs)

### Contracts

The Contracts pallet provides functionality for the runtime to deploy and execute WebAssembly
smart-contracts.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_contracts/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/contracts/src/lib.rs)

### Democracy

The Democracy pallet provides a democratic system that handles administration of general stakeholder
voting.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_democracy/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/democracy/src/lib.rs)

### Elections Phragmen

The Phragmen Elections pallet is an election module based on
[sequential phragmen](https://research.web3.foundation/en/latest/polkadot/NPoS/4.%20Sequential%20Phragm%C3%A9n%E2%80%99s%20method.html).

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_elections_phragmen/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/elections-phragmen/src/lib.rs)

### Elections

The Elections pallet is an election module for stake-weighted membership selection of a collective.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_elections/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/elections/src/lib.rs)

### EVM

The EVM pallet is an [Ethereum](https://en.wikipedia.org/wiki/Ethereum) virtual machine (EVM)
execution module for Substrate.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_evm/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/evm/src/lib.rs)

### Example Offchain Worker

The Offchain Worker Example: A simple pallet demonstrating concepts, APIs and structures common to
most offchain workers.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_example_offchain_worker/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/example-offchain-worker/src/lib.rs)

### Example

The Example pallet is a simple example of a pallet demonstrating concepts, APIs, and structures
common to most pallets.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_example/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/example/src/lib.rs)

### Finality Tracker

The Finality Tracker pallet tracks the last finalized block, as perceived by block authors.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_finality_tracker/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/finality-tracker/src/lib.rs)

### Generic Asset

The Generic Asset pallet provides functionality for handling accounts and asset balances.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_generic_asset/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/generic-asset/src/lib.rs)

### GRANDPA

The GRANDPA pallet extends GRANDPA consensus by managing the GRANDPA authority set ready for the
native code.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_grandpa/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/grandpa/src/lib.rs)

### Identity

A federated naming system, allowing for multiple registrars to be added from a specified origin.
Registrars can set a fee to provide identity-verification service. Anyone can put forth a proposed
identity for a fixed deposit and ask for review by any number of registrars (paying each of their
fees). Registrar judgements are given as an enum, allowing for sophisticated, multi-tier opinions.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_identity/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/identity/src/lib.rs)

### I'm Online

The I'm Online pallet allows validators to gossip a heartbeat transaction with each new session to
signal that the node is online.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_im_online/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/im-online/src/lib.rs)

### Indices

The Indices pallet allocates indices for newly created accounts. An index is a short form of an
address.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_indices/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/indices/src/lib.rs)

### Membership

The Membership pallet allows control of membership of a set of `AccountId`s, useful for managing
membership of a collective.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_membership/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/membership/src/lib.rs)

### Multisig

A module for doing multi-signature dispatches.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_multisig/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/multisig/src/lib.rs)

### Nicks

Nicks is a trivial module for keeping track of account names on-chain. It makes no effort to create
a name hierarchy, be a DNS replacement or provide reverse lookups.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_nicks/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/nicks/src/lib.rs)

### Offences

The Offences pallet tracks reported offences.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_offences/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/offences/src/lib.rs)

### Proxy

A module allowing accounts to give permission to other accounts to dispatch types of calls from
their signed origin.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_proxy/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/proxy/src/lib.rs)

### Randomness Collective Flip

The Randomness Collective Flip pallet provides a `random` function that can be used in tests and
generates low-influence random values based on the block hashes from the previous `81` blocks. This
pallet is not intended for use in production.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_randomness_collective_flip/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/randomness-collective-flip/src/lib.rs)

### Recovery

The Recovery pallet is an M-of-N social recovery tool for users to gain access to their accounts if
the private key or other authentication mechanism is lost. Through this pallet, a user is able to
make calls on-behalf-of another account which they have recovered. The recovery process is protected
by trusted "friends" whom the original account owner chooses. A threshold (M) out of N friends are
needed to give another account access to the recoverable account.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_recovery/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/recovery/src/lib.rs)

### Scheduler

This module exposes capabilities for scheduling dispatches to occur at a specified block number or
at a specified period. These scheduled dispatches may be named or anonymous and may be canceled.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_scheduler/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/scheduler/src/lib.rs)

### Scored Pool

The Scored Pool pallet maintains a scored membership pool where the highest scoring entities are
made members.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_scored_pool/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/scored-pool/src/lib.rs)

### Session

The Session pallet allows validators to manage their session keys, provides a function for changing
the session length, and handles session rotation.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_session/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/session/src/lib.rs)

### Society

The Society module is an economic game which incentivizes users to participate and maintain a
membership society.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_society/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/society/src/lib.rs)

### Staking

The Staking pallet is used to manage funds at stake by network maintainers.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_staking/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/staking/src/lib.rs)

### Sudo

The Sudo pallet allows for a single account (called the "sudo key") to execute dispatchable
functions that require a `Root` origin or designate a new account to replace them as the sudo key.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_sudo/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/sudo/src/lib.rs)

### Timestamp

The Timestamp pallet provides functionality to get and set the on-chain time.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_timestamp/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/timestamp/src/lib.rs)

### Transaction Payment

The Transaction Payment pallet provides the basic logic to compute pre-dispatch transaction fees.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_transaction_payment/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/transaction-payment/src/lib.rs)

### Treasury

The Treasury pallet provides a "pot" of funds that can be managed by stakeholders in the system and
a structure for making spending proposals from this pot.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_treasury/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/treasury/src/lib.rs)

### Utility

A stateless module with helpers for dispatch management.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_utility/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/utility/src/lib.rs)

### Vesting

A simple module providing a means of placing a linear curve on an account's locked balance. This
module ensures that there is a lock in place preventing the balance to drop below the unvested
amount for any reason other than transaction fee payment.

- [Docs](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_vesting/index.html)
- [Source](https://github.com/paritytech/substrate/blob/master/frame/vesting/src/lib.rs)

## Next Steps

### Learn More

- Learn how to [develop custom Substrate pallets](pallets).

### Examples

- Follow a
  [tutorial to add a pallet to your FRAME runtime](../../tutorials/add-a-pallet/).

### References

- Visit the reference docs for the
  [System library](https://substrate.dev/rustdocs/v2.0.0-rc6/frame_system/index.html).

- Visit the reference docs for the
  [Executive pallet](https://substrate.dev/rustdocs/v2.0.0-rc6/frame_executive/index.html).

- Visit the reference docs for the
  [FRAME support library](https://substrate.dev/rustdocs/v2.0.0-rc6/frame_support/index.html).

---
title: FRAME
---

The __Framework for Runtime Aggregation of Modularized Entities (FRAME)__ is a set of modules (called pallets) and support libraries that simplify runtime development. Pallets are individual modules within FRAME that host domain-specific logic.

FRAME provides some helper modules to interact with Substrate Primitives, which provide the interface to the core client.

## Overview

The following diagram shows the architectural overview of FRAME and its support libraries:

![frame-arch](/docs/assets/frame-arch.png)

### Pallets

When building with FRAME, the Substrate runtime is composed of several smaller components called pallets. A pallet contains a set of types, storage items, and functions that define a set of features and functionality for a runtime.

### System Library

The [System library](https://substrate.dev/rustdocs/master/frame_system/index.html) provides low-level types, storage, and
functions for your blockchain. All other pallets depend on the System library as the basis of your
Substrate runtime.

The System library defines all the core types for the Substrate runtime, such as:

* Origin
* Block Number
* Account Id
* Hash
* Header
* Version
* etc...

It also has a number of system-critical storage items, such as:

* Account Nonce
* Block Hash
* Block Number
* Events
* etc...

Finally, it defines a number of low level functions which can access your blockchain storage, verify
the origin of an extrinsic, and more.

### Executive Pallet

The [Executive pallet](https://substrate.dev/rustdocs/master/frame_executive/index.html) acts as the orchestration layer
for the runtime. It dispatches incoming extrinsic calls to the respective pallets in the runtime.

### Support Library

The [FRAME support library](https://substrate.dev/rustdocs/master/frame_support/index.html) is a collection of Rust macros,
types, traits, and functions that simplify the development of Substrate pallets.

The support macros expand at compile time to generate code that is used by the runtime and reduce
boilerplate code for the most common components of a pallet.

### Runtime

The runtime library brings together all these components and pallets. It defines which pallets are
included with your runtime and configures them to work together to compose your final runtime. When
calls are made to your runtime, it uses the Executive pallet to dispatch those calls to the
individual pallets.

## Prebuilt Pallets

Some pallets will be sufficiently general-purpose to be reused in many blockchains. Anyone is free to write and share useful pallets. There is a collection of popular pallets provided with Substrate. Let's explore them.

### Assets

The Assets pallet is a simple, secure module for dealing with fungible assets.

* [Docs](https://substrate.dev/rustdocs/master/pallet_assets/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/assets/src/lib.rs)

### Aura

The Aura pallet extends Aura consensus by managing offline reporting.

* [Docs](https://substrate.dev/rustdocs/master/pallet_aura/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/aura/src/lib.rs)

### Authority Discovery

The Authority Discovery pallet is used by `core/authority-discovery` to retrieve the current set of
authorities, learn its own authority ID, as well as to sign and verify messages to and from other
authorities.

* [Docs](https://substrate.dev/rustdocs/master/pallet_authority_discovery/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/authority-discovery/src/lib.rs)

### Authorship

The Authorship pallet tracks the current author of the block and recent uncles.

* [Docs](https://substrate.dev/rustdocs/master/pallet_authorship/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/authorship/src/lib.rs)

### BABE

The BABE pallet extends BABE consensus by collecting on-chain randomness from VRF outputs and
managing epoch transitions.

* [Docs](https://substrate.dev/rustdocs/master/pallet_babe/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/babe/src/lib.rs)

### Balances

The Balances pallet provides functionality for handling accounts and balances.

* [Docs](https://substrate.dev/rustdocs/master/pallet_balances/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/balances/src/lib.rs)

### Collective

The Collective pallet allows a set of account IDs to make their collective feelings known through
dispatched calls from specialized origins.

* [Docs](https://substrate.dev/rustdocs/master/pallet_collective/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/collective/src/lib.rs)

### Contracts

The Contracts pallet provides functionality for the runtime to deploy and execute WebAssembly
smart-contracts.

* [Docs](https://substrate.dev/rustdocs/master/pallet_contracts/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/contracts/src/lib.rs)

### Democracy

The Democracy pallet provides a democratic system that handles administration of general stakeholder
voting.

* [Docs](https://substrate.dev/rustdocs/master/pallet_democracy/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/democracy/src/lib.rs)

### Elections Phragmen

The Phragmen Elections pallet is an election module based on [sequential
phragmen](https://research.web3.foundation/en/latest/polkadot/NPoS/4.%20Sequential%20Phragm%C3%A9n%E2%80%99s%20method/).

* [Docs](https://substrate.dev/rustdocs/master/pallet_elections_phragmen/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/elections-phragmen/src/lib.rs)

### Elections

The Elections pallet is an election module for stake-weighted membership selection of a collective.

* [Docs](https://substrate.dev/rustdocs/master/pallet_elections/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/elections/src/lib.rs)

### EVM

The EVM pallet is an [Ethereum](https://en.wikipedia.org/wiki/Ethereum) virtual machine (EVM)
execution module for Substrate.

* [Docs](https://substrate.dev/rustdocs/master/pallet_evm/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/evm/src/lib.rs)

### Example

The Example pallet is a simple example of a pallet demonstrating concepts, APIs, and
structures common to most pallets.

* [Docs](https://substrate.dev/rustdocs/master/pallet_example/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/example/src/lib.rs)

### Finality Tracker

The Finality Tracker pallet tracks the last finalized block, as perceived by block authors.

* [Docs](https://substrate.dev/rustdocs/master/pallet_finality_tracker/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/finality-tracker/src/lib.rs)

### Generic Asset

The Generic Asset pallet provides functionality for handling accounts and asset balances.

* [Docs](https://substrate.dev/rustdocs/master/pallet_generic_asset/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/generic-asset/src/lib.rs)

### GRANDPA

The GRANDPA pallet extends GRANDPA consensus by managing the GRANDPA authority set ready for the
native code.

* [Docs](https://substrate.dev/rustdocs/master/pallet_grandpa/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/grandpa/src/lib.rs)

### I'm Online

The I'm Online pallet allows validators to gossip a heartbeat transaction with each new session to
signal that the node is online.

* [Docs](https://substrate.dev/rustdocs/master/pallet_im_online/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/im-online/src/lib.rs)

### Indices

The Indices pallet allocates indices for newly created accounts. An index is a short form of an
address.

* [Docs](https://substrate.dev/rustdocs/master/pallet_indices/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/indices/src/lib.rs)

### Membership

The Membership pallet allows control of membership of a set of `AccountId`s, useful for managing
membership of a collective.

* [Docs](https://substrate.dev/rustdocs/master/pallet_membership/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/membership/src/lib.rs)

### Offences

The Offences pallet tracks reported offences.

* [Docs](https://substrate.dev/rustdocs/master/pallet_offences/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/offences/src/lib.rs)

### Randomness Collective Flip

The Randomness Collective Flip pallet provides a `random` function that generates low-influence
random values based on the block hashes from the previous `81` blocks.

* [Docs](https://substrate.dev/rustdocs/master/pallet_randomness_collective_flip/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/randomness-collective-flip/src/lib.rs)

### Scored Pool

The Scored Pool pallet maintains a scored membership pool where the highest scoring entities are
made members.

* [Docs](https://substrate.dev/rustdocs/master/pallet_scored_pool/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/scored-pool/src/lib.rs)

### Session

The Session pallet allows validators to manage their session keys, provides a function for changing
the session length, and handles session rotation.

* [Docs](https://substrate.dev/rustdocs/master/pallet_session/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/session/src/lib.rs)

### Staking

The Staking pallet is used to manage funds at stake by network maintainers.

* [Docs](https://substrate.dev/rustdocs/master/pallet_staking/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/staking/src/lib.rs)

### Sudo

The Sudo pallet allows for a single account (called the "sudo key") to execute dispatchable
functions that require a `Root` origin or designate a new account to replace them as the sudo key.

* [Docs](https://substrate.dev/rustdocs/master/pallet_sudo/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/sudo/src/lib.rs)

### Timestamp

The Timestamp pallet provides functionality to get and set the on-chain time.

* [Docs](https://substrate.dev/rustdocs/master/pallet_timestamp/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/timestamp/src/lib.rs)

### Transaction Payment

The Transaction Payment pallet provides the basic logic to compute pre-dispatch transaction fees.

* [Docs](https://substrate.dev/rustdocs/master/pallet_transaction_payment/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/transaction-payment/src/lib.rs)

### Treasury

The Treasury pallet provides a "pot" of funds that can be managed by stakeholders in the system and
a structure for making spending proposals from this pot.

* [Docs](https://substrate.dev/rustdocs/master/pallet_treasury/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/frame/treasury/src/lib.rs)

## Next Steps

### Learn More

- Learn how to [develop custom Substrate pallets](development/module/index.md).

### Examples

- Follow a [tutorial to add a pallet to your Substrate
  runtime](tutorials/adding-a-module-to-your-runtime.md).

### References

- Visit the reference docs for the [System library](https://substrate.dev/rustdocs/master/frame_system/index.html).

- Visit the reference docs for the [Executive pallet](https://substrate.dev/rustdocs/master/frame_executive/index.html).

- Visit the reference docs for the [FRAME support
  library](https://substrate.dev/rustdocs/master/frame_support/index.html).

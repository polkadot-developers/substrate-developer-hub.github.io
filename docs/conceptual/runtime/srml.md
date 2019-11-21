---
title: Substrate Runtime Module Library
---

The Substrate Runtime Module Library (SRML) is a collection of prebuilt runtime modules and support
libraries which simplify development of a Substrate runtime.

## Overview

The following diagram shows the architectural overview of the SRML and its support libraries:

![srml-arch](/docs/assets/srml-arch.png)

### Runtime Modules

The Substrate runtime is composed of several smaller components called runtime modules. A runtime
module contains a set of types, storage items, and functions that define a set of features and
functionality for a runtime.

### System Module

The [System module](https://substrate.dev/rustdocs/master/palette_system/index.html) provides low-level types, storage, and
functions for your blockchain. All other modules depend on the System module as the basis of your
Substrate runtime.

The System module defines all the core types for the Substrate runtime, such as:

* Origin
* Block Number
* Account Id
* Hash
* Header
* Version
* etc...

It also has a number of system critical storage items, such as:

* Account Nonce
* Block Hash
* Block Number
* Events
* etc...

Finally, it defines a number of low level functions which can access your blockchain storage, verify
the origin of an extrinsic, and more.

### Executive Module

The [Executive module](https://substrate.dev/rustdocs/master/srml_executive/index.html) acts as the orchestration layer
for the runtime. It dispatches incoming extrinsic calls to the respective modules in the runtime.

### Support Library

The [SRML support library](https://substrate.dev/rustdocs/master/palette_support/index.html) is a collection of Rust macros,
types, traits, and functions that simplify the development of Substrate runtime modules.

The support macros expand at compile time to generate code which is used by the runtime and reduce
boilerplate code for the most common components of a module.

### Runtime

The runtime library brings together all these components and modules. It defines which modules are
included with your runtime and configures them to work together to compose your final runtime. When
calls are made to your runtime, it uses the Executive module to dispatch those calls to the
individual runtime modules.

## SRML Modules

The SRML contains a set of prebuilt runtime modules that can be used in your Substrate chain.

### Assets

The Assets module is a simple, secure module for dealing with fungible assets.

* [Docs](https://substrate.dev/rustdocs/master/srml_assets/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/assets/src/lib.rs)

### Aura

The Aura module extends Aura consensus by managing offline reporting.

* [Docs](https://substrate.dev/rustdocs/master/srml_aura/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/aura/src/lib.rs)

### Authority Discovery

The Authority Discovery module is used by `core/authority-discovery` to retrieve the current set of
authorities, learn its own authority id, as well as to sign and verify messages to and from other
authorities.

* [Docs](https://substrate.dev/rustdocs/master/srml_authority_discovery/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/authority-discovery/src/lib.rs)

### Authorship

The Authorship module tracks the current author of the block and recent uncles.

* [Docs](https://substrate.dev/rustdocs/master/srml_authorship/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/authorship/src/lib.rs)

### BABE

The BABE module extends BABE consensus by collecting on-chain randomness from VRF outputs and
managing epoch transitions.

* [Docs](https://substrate.dev/rustdocs/master/srml_babe/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/babe/src/lib.rs)

### Balances

The Balances module provides functionality for handling accounts and balances.

* [Docs](https://substrate.dev/rustdocs/master/srml_balances/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/balances/src/lib.rs)

### Collective

The Collective module allows a set of account IDs to make their collective feelings known through
dispatched calls from specialized origins.

* [Docs](https://substrate.dev/rustdocs/master/srml_collective/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/collective/src/lib.rs)

### Contracts

The Contracts module provides functionality for the runtime to deploy and execute WebAssembly
smart-contracts.

* [Docs](https://substrate.dev/rustdocs/master/srml_contracts/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/contracts/src/lib.rs)

### Democracy

The Democracy module provides a democratic system that handles administration of general stakeholder
voting.

* [Docs](https://substrate.dev/rustdocs/master/srml_democracy/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/democracy/src/lib.rs)

### Elections Phragmen

The Phragmen Elections module is an election module based on [sequential
phragmen](https://research.web3.foundation/en/latest/polkadot/NPoS/4.%20Sequential%20Phragm%C3%A9n%E2%80%99s%20method/).

* [Docs](https://substrate.dev/rustdocs/master/srml_elections_phragmen/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/elections-phragmen/src/lib.rs)

### Elections

The Elections module is an election module for stake-weighted membership selection of a collective.

* [Docs](https://substrate.dev/rustdocs/master/srml_elections/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/elections/src/lib.rs)

### EVM

The EVM Module is an [Ethereum](https://en.wikipedia.org/wiki/Ethereum) virtual machine (EVM)
execution module for Substrate.

* [Docs](https://substrate.dev/rustdocs/master/srml_evm/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/evm/src/lib.rs)

### Example

The Example module is a simple example of a runtime module demonstrating concepts, APIs and
structures common to most runtime modules.

* [Docs](https://substrate.dev/rustdocs/master/srml_example/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/example/src/lib.rs)

### Finality Tracker

The Finality Tracker module tracks the last finalized block, as perceived by block authors.

* [Docs](https://substrate.dev/rustdocs/master/srml_finality_tracker/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/finality-tracker/src/lib.rs)

### Generic Asset

The Generic Asset module provides functionality for handling accounts and asset balances.

* [Docs](https://substrate.dev/rustdocs/master/srml_generic_asset/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/generic-asset/src/lib.rs)

### GRANDPA

The GRANDPA module extends GRANDPA consensus by managing the GRANDPA authority set ready for the
native code.

* [Docs](https://substrate.dev/rustdocs/master/srml_grandpa/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/grandpa/src/lib.rs)

### I'm Online

The I'm Online module allows validators to gossip a heartbeat transaction with each new session to
signal that the node is online in the current era.

* [Docs](https://substrate.dev/rustdocs/master/srml_im_online/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/im-online/src/lib.rs)

### Indices

The Indices module allocates indices for newly created accounts. An index is a short form of an
address.

* [Docs](https://substrate.dev/rustdocs/master/srml_indices/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/indices/src/lib.rs)

### Membership

The Membership module allows control of membership of a set of `AccountId`s, useful for managing
membership of a collective.

* [Docs](https://substrate.dev/rustdocs/master/srml_membership/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/membership/src/lib.rs)

### Offences

The Offences module tracks reported offences.

* [Docs](https://substrate.dev/rustdocs/master/srml_offences/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/offences/src/lib.rs)

### Randomness Collective Flip

The Randomness Collective Flip module provides a `random` function that generates low-influence
random values based on the block hashes from the previous `81` blocks.

* [Docs](https://substrate.dev/rustdocs/master/srml_randomness_collective_flip/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/randomness-collective-flip/src/lib.rs)

### Scored Pool

The Scored Pool module maintains a scored membership pool where the highest scoring entities are
made members.

* [Docs](https://substrate.dev/rustdocs/master/srml_scored_pool/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/scored-pool/src/lib.rs)

### Session

The Session module allows validators to manage their session keys, provides a function for changing
the session length, and handles session rotation.

* [Docs](https://substrate.dev/rustdocs/master/srml_session/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/session/src/lib.rs)

### Staking

The Staking module is used to manage funds at stake by network maintainers.

* [Docs](https://substrate.dev/rustdocs/master/srml_staking/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/staking/src/lib.rs)

### Sudo

The Sudo module allows for a single account (called the "sudo key") to execute dispatchable
functions that require a `Root` origin or designate a new account to replace them as the sudo key.

* [Docs](https://substrate.dev/rustdocs/master/srml_sudo/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/sudo/src/lib.rs)

### Timestamp

The Timestamp module provides functionality to get and set the on-chain time.

* [Docs](https://substrate.dev/rustdocs/master/srml_timestamp/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/timestamp/src/lib.rs)

### Transaction Payment

The Transaction Payment module provides the basic logic needed to pay the absolute minimum amount
needed for a transaction to be included.

* [Docs](https://substrate.dev/rustdocs/master/srml_transaction_payment/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/transaction-payment/src/lib.rs)

### Treasury

The Treasury module provides a "pot" of funds that can be managed by stakeholders in the system and
a structure for making spending proposals from this pot.

* [Docs](https://substrate.dev/rustdocs/master/srml_treasury/index.html)
* [Source](https://github.com/paritytech/substrate/blob/master/palette/treasury/src/lib.rs)

## Next Steps

### Learn More

- Learn how to [develop custom Substrate runtime modules](development/module/index.md).

### Examples

- Follow a [tutorial to add a runtime module to your Substrate
  runtime](tutorials/adding-a-module-to-your-runtime.md).

### References

- Visit the reference docs for the [System module](https://substrate.dev/rustdocs/master/palette_system/index.html).

- Visit the reference docs for the [Executive module](https://substrate.dev/rustdocs/master/srml_executive/index.html).

- Visit the reference docs for the [SRML support
  library](https://substrate.dev/rustdocs/master/palette_support/index.html).

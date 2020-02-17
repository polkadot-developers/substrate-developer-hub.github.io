---
title: "Introduction"
---
Substrate is a blockchain platform with a completely generic State Transition Function ([STF](../conceptual/runtime/index.md)) and modular components for consensus, networking, and configuration.

Despite being "completely generic", it comes with both standards and conventions - particularly with the Substrate Runtime Module Library ([SRML](overview/glossary.md#srml-substrate-runtime-module-library)) - regarding the underlying data-structures that power the STF, thereby making rapid blockchain development a reality.

## Core Datatypes

There are several data types that work with the underlying core of Substrate (thus the "Core" data types). They are mandatory to define and must fulfil a particular interface in order to work within the Substrate framework.

Each of these data types corresponds to a Rust `trait`. They are:

- `Hash`, a type which encodes a cryptographic digest of some data. Typically just a 256-bit quantity.
- `BlockNumber`, a type which encodes the total number of ancestors any valid block has. Typically a 32-bit quantity.
- `DigestItem`, a type which must be able to encode one of a number of "hard-wired" alternatives relevant to consensus and change-tracking as well as any number of "soft-coded" variants, relevant to specific modules within the runtime.
- `Digest`, basically just a series of `DigestItem`s, this encodes all information that is relevant for a light-client to have on hand within the block.
- `Header`, a type which is representative (cryptographically or otherwise) of all information relevant to a block. It includes the parent hash, the storage root and the extrinsics trie root, the digest and a block number.
- `Extrinsic`, a type to represent a single piece of data external to the blockchain that is recognized by the blockchain. This typically involves one or more signatures, and some sort of encoded instruction (e.g. for transferring ownership of funds or calling into a smart contract).
- `Block`, essentially just a combination of `Header` and a series of `Extrinsic`s, together with a specification of the hashing algorithm to be used.

Generic reference implementations for each of these traits are provided in the [SRML](overview/glossary.md#srml-substrate-runtime-module-library). Technically these need not be used, but there are few cases where they are insufficiently generic for a use case.

> **Some Expertise Needed**
>
> In order to get the most out of Substrate, you should have a good knowledge of blockchain concepts and basic cryptography. Terminology like header, block, client, hash, transaction and signature should be familiar. At present you will need a working knowledge of Rust to be able to do any significant customization/adaption of Substrate (though eventually, we aim for this not to be the case).

## Usage

Substrate is designed to be used in one of three ways:

1. **With our bundled Node**: By running the pre-designed Substrate Node (`substrate`) and configuring it with a genesis block that includes the current demonstration runtime. In this case just configure a JSON file and launch your own blockchain. This affords you the least amount of customizability, primarily allowing you to change the genesis parameters of the various included runtime modules such as balances, staking, block-period, fees and governance. For a tutorial on doing this, see [Deploying a Substrate Node chain](tutorials/start-a-private-network-with-substrate).

2. **With the SRML**: By composing modules from the [SRML](overview/glossary.md#srml-substrate-runtime-module-library) into a new runtime, perhaps adding new custom modules and possibly altering or reconfiguring the Substrate client's block authoring logic. This affords you a very large amount of freedom over your own blockchain's logic, letting you change datatypes, select from the library of modules and, crucially, add your own modules. Much can be changed without touching the block-authoring logic since it is directed through on-chain logic. If this is the case, then the existing Substrate binary can be used for block authoring and syncing. If the block authoring logic needs to be tweaked, then a new altered block-authoring binary must be built as a separate project and used by validators. This is how the Polkadot relay chain is built and should suffice for almost all circumstances in the near to mid-term. For a tutorial on this, see [creating your first Substrate chain](tutorials/creating-your-first-substrate-chain).

3. Generic: The entire [SRML](overview/glossary.md#srml-substrate-runtime-module-library) can be ignored and the entire runtime designed and implemented from scratch. If desired, this can be done in a language other than Rust, providing it can target WebAssembly. If the runtime can be made to be compatible with Substrate Node's abstract block authoring logic, then you can simply construct a new genesis block from your Wasm blob and launch your chain with the existing Rust-based Substrate client. If not, then you'll need to alter the client's block authoring logic accordingly, potentially even altering the header and block serialization formats. In terms of development effort this is by far the most arduous means to use Substrate, but also gives you the most freedom to innovate. It reflects a long-term far-reaching upgrade path for the Substrate paradigm.

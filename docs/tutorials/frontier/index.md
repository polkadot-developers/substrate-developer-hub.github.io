---
title: Frontier Tutorial
---

[Frontier](https://github.com/paritytech/frontier) is a set of modules to build an
**Ethereum-compatible blockchain with Substrate**.

## Before You Begin

You should have completed _at least_ the following three Substrate tutorials before attempting this tutorial:

- [Create Your First Substrate Chain](../../tutorials/create-your-first-substrate-chain/)
- [Add a Pallet to Your Runtime](../../tutorials/add-a-pallet/)
- [Build a PoE Decentralized Application](../../tutorials/build-a-dapp/)

Before attempting this tutorial, you should be familiar with the concepts listed below:

- Launching a Substrate chain
- Submitting extrinsics
- Adding, Removing, and configuring pallets in a runtime
- Ethereum and EVM basics
- Pallet design

## Frontier Template

This tutorial is presently a little bit out of date. While it is still a good reference, it refers
to an older version of Substrate template. It is thus encouraged to generate your own template based
of whatever commit you desire from frontier itself to start working with many of the core features
of Frontier installed and enabled.

The Frontier project currently does not use the published Substrate
crates; it refers to Substrate code from github directly. Take note of this in your `Cargo` files.
You _must_ use the _matching_ version of dependencies for all of Substrate and Frontier in your
project.

This is a stop-gap solution while Frontier is being updated to the latest Substrate tag/release.

There's also a github repo `template` that is available for major Frontier releases pre-generated
for you.

#### Generation Script

You can generate a version of the Frontier template by running the
[generation script](https://github.com/paritytech/frontier/blob/master/.maintain/node-template-release.sh)
included in Frontier.

```bash
# from the top working dir of Frontier:
cd .maintain/
# set the *full file name with .tar.gz extension* for your output file
./node-template-release.sh TEMPLATE.tar.gz
# Note the file will be placed in the top level working dir of frontier
# Move the archive to wherever you like...
tar xvzf TEMPLATE.tar.gz
# this unpacks into `frontier-node-template` with all your files
cd frontier-node-template
```

The Substrate Developer Hub has generated the template using the
[included release guide](https://github.com/paritytech/frontier/blob/master/docs/node-template-release.md)
, and intends to update with major releases of Frontier moving forward.

You can `use` the pre-generated template or `fork` it from here:
https://github.com/substrate-developer-hub/frontier-node-template/ .

### Build & Config Setup

#### Genesis Configuration

The development [chain spec](https://github.com/paritytech/frontier/blob/master/template/node/src/chain_spec.rs)
included with this project defines a genesis block that has been pre-configured with an EVM account
for [Alice](https://substrate.dev/docs/en/knowledgebase/integrate/subkey#well-known-keys). When
[a development chain is started](https://github.com/substrate-developer-hub/substrate-node-template#run),
Alice's EVM account will be funded with a large amount of Ether. The
[Polkadot UI](https://polkadot.js.org/apps/#?rpc=ws://127.0.0.1:9944) can be used to see the details
of Alice's EVM account. In order to view an EVM account, use the `Developer` tab of the Polkadot UI
`Settings` app to define the EVM `Account` type as below. It is also necessary to define the
`Address` and `LookupSource` to send transaction, and `Transaction` and `Signature` to be able to
inspect blocks:

```json
{
  "Address": "MultiAddress",
  "LookupSource": "MultiAddress",
  "Account": {
    "nonce": "U256",
    "balance": "U256"
  },
  "Transaction": {
    "nonce": "U256",
    "action": "String",
    "gas_price": "u64",
    "gas_limit": "u64",
    "value": "U256",
    "input": "Vec<u8>",
    "signature": "Signature"
  },
  "Signature": {
    "v": "u64",
    "r": "H256",
    "s": "H256"
  }
}
```

#### Build & Run

To build the chain, execute the following commands from the project root:

```
cargo build --release
```

To execute the chain, run:

```
./target/release/frontier-template-node --dev
```

The node also supports to use manual seal (to produce block manually through RPC).

```
./target/release/frontier-template-node --dev --manual-seal
```

### Query Balance Using RPC

Once your node is running, use the Polkadot JS Apps' `RPC calls` under the `Developer` tab to query
`eth > getBalance(address, number)` with Alice's EVM account ID
(`0xd43593c715fdd31c61141abd04a99fd6822c8558`); the value that is returned should be:

```text
x: eth.getBalance
340,282,366,920,938,463,463,374,607,431,768,211,455
```

> Further reading:
> [EVM accounts](https://github.com/danforbes/danforbes/blob/master/writings/eth-dev.md#Accounts)

Alice's EVM account ID was calculated using
[an included utility script](https://github.com/paritytech/frontier/blob/master/template/utils/README.md#--evm-address-address).

### Deploy & Call Ethereum Smart Contracts

To deploy and call Ethereum smart contracts and test the related functionality follow the next steps
at:

- [Testing Ethereum Smart Contracts Functionality](ethereum-contracts).

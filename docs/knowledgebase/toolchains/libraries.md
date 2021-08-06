---
title: Client Libraries
---

There are a number of language-specific client libraries that can be used to interact with
Substrate-based blockchains. In general, the capabilities that these libraries expose are
implemented on top of the Substrate remote procedure call (RPC) API.

## Javascript

The Polkadot JS team maintains a rich set of tools for interacting with Substrate-based blockchains.
Refer to [the main Polkadot JS page](./polkadot-js) to learn more about that suite of tools.

Parity also maintains [`txwrapper`](https://github.com/paritytech/txwrapper), which is a Javascript
library for offline generation of Substrate transactions.

## Go

[The Go Substrate RPC Client](https://github.com/centrifuge/go-substrate-rpc-client/), AKA GSRPC, is
maintained by [Centrifuge](https://centrifuge.io/).

## C#

[Polkadot API DotNet](https://github.com/usetech-llc/polkadot_api_dotnet) is a Substrate RPC client
library for .Net programmers. It is maintained by [Usetech](https://usetech.com/blockchain/).

[SubstrateNetApi](https://github.com/dotmog/SubstrateNetApi) .NET Standard API ([nuget](https://www.nuget.org/packages/SubstrateNetApi/)) allowing full substrate integration in Unity3D for gaming development, [starter template project](https://github.com/darkfriend77/Unity3DExample). It is maintained by [DOTMog Team](https://www.dotmog.com/).

## C++

[Usetech](https://usetech.com/blockchain/) also maintains Polkadot API CPP, which is a C++ library
for interacting with the Substrate RPC.

## Rust

Parity maintains [`substrate-subxt`](https://github.com/paritytech/substrate-subxt), which is a Rust
library specifically designed for submitting extrinsics to Substrate blockchains. The
[the Substrate API Client](https://github.com/scs/substrate-api-client) is another Substrate client
library for Rust that is maintained by Supercomputing Systems; its API is more general-purpose than
`substrate-subxt`.

## Python

[py-substrate-interface](https://github.com/polkascan/py-substrate-interface) is a Python
library for interacting with the Substrate RPC. It supports a wide range of capabilities and
powers the [Polkascan multi-chain block explorer](https://polkascan.io/). This library is
maintained by [Polkascan Foundation](https://polkascan.org/).

---
title: Off-Chain Indexing
---

## Overview

When we think about storage in the context of blockchains, we usually think about the On-Chain state.
Using on-chain storage is expensive and not recommended for historical or user-generated data
which can exponentialy accumulate over time.
Luckily every Substrate node comes with Off-chain Database as well. It is usually associated
with [Off-chain Workers](./off-chain-workers) and it is valid, since the main use case for the
Off-chain DB is exactly this, but Substrate includes a feature called "Off-chain Indexing",
which allows the Runtime to write directly to the Off-chain DB independently from OCWs. Nodes
have to opt-in for persistency of this data via `--enable-offchain-indexing` CLI flag.

Unlike Off-chain workers, which are not executed during initial blockchain synchronization,
Indexing is populating the DB every time a block is processed, so the data is always consistent
and will be exactly the same for every node with indexing enabled.

Off-chain DB can be read using RPC calls so this makes it an interesting use case for storing
historical data for the UI without polluting the on-chain state.

To use indexing data from Runtime:
```rust
sp_io::offchain_index::set(&b"my_key", &"my_value".encode());
```

Data in Off-chain DB can be either read by Off-chain workers (local storage API) or via RPC, using
`offchain_localStorageGet` method.



---
title: Install the Frontier Block Import
---

In this section we'll install the `FrontierBlockImport` in the node. This is the first change we are
making outside of the runtime. In the Frontier repository, this crate is called "frontier-consensus".
Although the block import pipeline is most typically used by consensus-related tasks, we are not using
it in that way, and so I'll avoid the term consensus in this writeup.

For reference, you can see this work in commit [1c0931c](https://github.com/JoshOrndorff/substrate-node-template/commit/1c0931c59122d02b6ee8b3c55d35532f2c2174ce).

![architecture diagram](assets/tutorials/frontier/block-import.png)

## Using the Aux Store

Substrate's [auxiliary storage](https://substrate.dev/rustdocs/v2.0.0/sc_client_api/backend/trait.AuxStore.html) provides an off-chain scratchpad for the node to record any data it likes. We'll use to store some mappings from Ethereum-style data to Substrate-style data.

The auxstore is completely untyped, and so we write typed accessor methods ([code link](https://github.com/PureStake/frontier/blob/c5fe2a61f2aecd6cba62e7163b44af5a38bac6ad/consensus/src/aux_schema.rs)) to use it more safely. I prefer to understand the schema declaratively, but pretending it were runtime storage.

```rust
decl_storage! {
	trait Store for AuxiliaryStorage as Ethereum {
		/// A one-to-many mapping from Ethereum block hashes to Substrate block hashes
		Hashes: map hasher(kaccak256) EthereumHeader => Vec<H256>;
		/// A mapping from Ethereum transaction hashes to Ethereum block hashes and
		/// the transaction's index within that block.
		Metadata: map hasher(keccak256) EthereumTransaction => (H256, u32);
	}
}
```

## Snippets

`node/Cargo.toml`

```toml
frontier-consensus = { git = 'https://github.com/PureStake/frontier.git', branch = 'substrate-v2' }
```

`node/src/service.rs`

```rust
use frontier_consensus::FrontierBlockImport;
```

Update the type of our block import pipeline in the return type of the `new_partial` function.
`node/src/service.rs`

```rust
sc_consensus_aura::AuraBlockImport<
	Block,
	FullClient,
	FrontierBlockImport<
		Block,
		sc_finality_grandpa::GrandpaBlockImport<FullBackend, Block, FullClient, FullSelectChain>,
		FullClient
	>,
	AuraPair
>
```

Install the block import pipeline.

`node/src/service.rs`

```rust
// Here we inert a piece in the block import pipeline
// The old pipeline was Aura -> Grandpa -> Client
// The new pipeline is Aura -> Frontier -> Grandpa -> Client
let frontier_block_import = FrontierBlockImport::new(
	grandpa_block_import.clone(),
	client.clone(),
	true
);

// Be sure to update the existing aura block import to use the new piece.
let aura_block_import = sc_consensus_aura::AuraBlockImport::<_, _, _, AuraPair>::new(
	frontier_block_import.clone(), client.clone(),
);
```


## Helpful Resources

* Block import pipeline docs https://substrate.dev/docs/en/knowledgebase/advanced/block-import
* Frontier consensus code https://github.com/paritytech/frontier/tree/master/consensus

## Check Your Work

At this point the entire node should build with `cargo check`.

---
title: Chain Specification
---

A chain specification, or "chain spec", is a collection of configuration information that dictates
which network a blockchain node will connect to, which entities it will initially communicate with,
and what consensus-critical state it must have at genesis.

## Structure of a Chain Spec

The [`ChainSpec` struct](https://substrate.dev/rustdocs/latest/sc_service/struct.GenericChainSpec.html)
separates the information contained in a chain spec into two parts. A node can use a `ChainSpec`
instance to create a genesis block.

### The Client Spec

The first part of the chain spec, is the `ClientSpec`. The `ClientSpec` contains configuration
information used by the Substrate client, the part of the node outside of the runtime. Much of this
information is used to communicate with other parties in the network such as a set of bootnodes, a
set of telemetry endpoints to which the node will send data, and human- and machine-readable names
for the network to which the node will connect. Many of these items can be overridden by
command-line flags, and the values can be changed after the blockchain has been launched.

> Caution: While all properties in this section can be changed after genesis, nodes will only add
> peers who use the same `protocolId`.

#### Extension

Because the Substrate framework is extensible, it provides a way to customize the client spec with
additional data to configure customized parts of the client. One example use case is telling the
node about well-known blocks at specific heights, to prevent long range attacks when syncing a new
node from genesis.

### The Genesis State

The second part of the chain spec is the consensus-critical genesis configuration. All nodes in the
network must agree on this initial state before they can agree on any subsequent blocks. Therefore,
this information must be established at the outset of the chain and cannot be changed thereafter
without starting an entirely new blockchain. There are no command-line flags to override values in
the genesis portion of a chain spec.

Examples of what information might be included in the genesis portion of a chain spec include
initial token balances, the accounts that are initially part of a governance council, or the holder
of the sudo key. Substrate nodes also place the compiled Wasm runtime logic on chain, so the initial
runtime must also be supplied in the chain spec.

It is this second part of the chain spec that is used when creating a genesis block.

## Storing Chain Spec Information

The information that comprises a chain spec can be stored in either of two ways. Being a Rust
struct, the first way to store this information is as Rust code. Indeed, Substrate nodes typically
include at least one, and often many, chain specs hard-coded into the client. Including this
information directly in the client ensures that the node will know how to connect to at least one
chain without any additional information supplied by the node operator. In protocols that have a
notion of "main net" this spec is usually hard-coded in the client.

Another common way to store chain spec information is in JSON format. The chain spec struct has a
method for serializing its data into JSON as well as a function for de-serializing JSON data into an
instance of a chain spec. When launching testnets or private chains, it is common to distribute a
JSON-encoded chain spec along with the node binary.

## Using Chain Specs

Node operators and runtime developers will encounter chain specifications when performing common
tasks.

### Launching a Chain

Each time a node operator starts a node, they provide a chain specification that the node should
use. In the simplest case, the chain spec is provided implicitly and the node uses a default chain
spec that is hard-coded into the node binary.

A common task is to start a testnet or private network that behaves similarly to an existing
protocol, but is not connected to the mainnet. To achieve this, the operator may choose an
alternative hard-coded chain spec by using a command-line flag such as `--chain local` that
instructs the node to use the spec associated with the string "local". A third option available to
node operators is to provide a chain spec as a JSON file with a command-line flag such as
`--chain=someCustomSpec.json`, in which case the node will attempt to de-serialize the provided JSON
chain spec, and then use it.

### Developing a Runtime

Nearly every Substrate runtime will have storage items that need to be configured at genesis. When
developing with [FRAME](../runtime/frame), any storage item that is declared with the `config()`
option requires configuration at genesis. It is the job of the chain spec, specifically the genesis
portion, to configure such storage values.

### Customizing a Chain Spec

When creating a one-off network for development, testing, or demonstration purposes, a truly
customized chain spec may be desired. Node operators may export the default chain spec for the
protocol to JSON format and then make edits. Substrate-based nodes are equipped with a `build-spec`
sub-command that does this exporting.

```bash
substrate build-spec > myCustomSpec.json
```

Once the chain spec has been exported, the node operator is free to modify any of its fields. It is
common to modify the network's name and bootnodes as well as any genesis storage items, such as
token balances, that the operator wishes. Once the edits are made, the operator may launch their
customized chain by supplying the customized JSON.

```bash
substrate --chain=myCustomSpec.json
```

## Raw Chain Specs

Substrate nodes support runtime upgrades, which means a blockchain's runtime may be different than
when the chain began. Chain specs, as discussed so far, contain information structured in a way that
can be understood by the node's runtime. For example, consider this excerpt from the default
Substrate node's chainspec json.

```json
"sudo": {
  "key": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
}
```

Before this spec can be used to initialize a node's genesis storage, the human-readable keys must be
transformed into actual storage keys for the [storage trie](../advanced/storage). This
transformation is straight-forward, but it requires that the node's runtime be able to understand
the chain spec.

If a node with an upgraded runtime attempts to synchronize a chain from genesis, it will not
understand the information in this human-readable chain spec. For this reason, there is a second
encoding of the chain spec known as the "raw" chain spec.

When distributing chain specs in JSON format, they should be distributed in this raw format to
ensure that all nodes can sync the chain even after runtime upgrades. Substrate-based nodes support
the `--raw` flag to produce such raw chain specs.

```bash
substrate build-spec --chain=myCustomSpec.json --raw > customSpecRaw.json
```

After the conversion process, the above snippet looks like this:

```json
"0x50a63a871aced22e88ee6466fe5aa5d9": "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
```

## Next Steps

### Learn More

- Rustdocs for the
  [`ChainSpec` struct](https://substrate.dev/rustdocs/latest/sc_service/struct.GenericChainSpec.html)
- Rustdocs for the
  [`ProtocolId` struct](https://substrate.dev/rustdocs/latest/sc_network/config/struct.ProtocolId.html)

### Examples

- Gain hands-on experience with chain specs by
  [starting a private network](../../tutorials/start-a-private-network/).
- The
  [Node Template's Chainspec](https://github.com/substrate-developer-hub/substrate-node-template/blob/master/node/src/chain_spec.rs)
  stored as rust code.

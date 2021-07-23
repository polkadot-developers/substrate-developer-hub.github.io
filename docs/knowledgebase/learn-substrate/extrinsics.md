---
title: Extrinsics
---

An extrinsic is a piece of information that comes from outside the chain and is included in a block.
Extrinsics fall into three categories: inherents, signed transactions, and unsigned transactions.

Note that [events](../runtime/events) are not extrinsics. The chain emits events for pieces of
information that are intrinsic to the chain itself. For example, staking rewards are events, not
extrinsics, because the reward is triggered by circumstances intrinsic to the chain's logic.

## Block Structure

A block in Substrate is composed of a header and an array of extrinsics. The header contains a  
block height, parent hash, extrinsics root, state root, and digest. This section will only focus on
the extrinsics root.

Extrinsics are bundled together into a block as a series to be executed as each is defined in the
runtime. The extrinsics root is a cryptographic digest of this series. This serves two purposes.
First, it prevents any alterations to the series of extrinsics after the header has been built and
distributed. Second, it provides a means of allowing light clients to succinctly verify that any
given extrinsic did indeed exist in a block given only knowledge of the header.

- [Block Reference](https://substrate.dev/rustdocs/latest/sp_runtime/traits/trait.Block.html)

## Inherents

Inherents are pieces of information that are not signed and only inserted into a block by the block
author. They are not gossiped on the network or stored in the transaction queue. There is nothing
technically preventing a Substrate chain that gossips inherents, but there would be no fee-based
spam prevention mechanism.

Inherents represent data that, in an opinionated fashion, describes one of a number of valid pieces
of information. They are assumed to be "true" simply because a sufficiently large number of
validators have agreed on them being reasonable.

For example, the author of the block may insert a timestamp inherent into the block. There is no way
to prove that a timestamp is true the way the desire to send funds is proved with a signature.
Rather, validators accept or reject the block based on how reasonable the other validators find the
timestamp, which may mean it is within some acceptable range of their own system clocks.

- [Inherents Reference](https://substrate.dev/rustdocs/latest/sp_inherents/index.html)

## Signed Transactions

Signed transactions contain a signature of the account that issued the transaction and stands to pay
a fee to have the transaction included on chain. Because the value of including signed transactions
on-chain can be recognized prior to execution, they can be gossiped on the network between nodes
with a low risk of spam.

Signed transactions fit the concept of a transaction in Ethereum or Bitcoin.

## Unsigned Transactions

Some cases call for unsigned transactions. Use unsigned transactions with care, as their validation
logic can be difficult.

Since the transaction is not signed, there is nobody to pay a fee. Because of this, the transaction
queue lacks economic logic to prevent spam. Unsigned transactions also lack a nonce, making replay
protection difficult. A few transactions warrant using the unsigned variant, but they will require
some form of spam prevention based on a custom implementation of
[signed extension](#signed-extension), which can exist on unsigned transactions.

An example of unsigned transactions in Substrate is the [I'm Online](../runtime/frame#im-online)
heartbeat transaction sent by authorities. The transaction includes a signature from a Session key,
which does not control funds and therefore cannot pay a fee. The transaction pool controls spam by
checking if a heartbeat has already been submitted in the session.

## Signed Extension

`SignedExtension` is a trait by which a transaction can be extended with additional data or logic.
Signed extensions are used anywhere you want some information about a transaction prior to
execution. This is heavily used in the transaction queue.

The runtime can use some of this data, for example the `Call` that will be dispatched, to calculate
transaction fees. Signed extensions also include an `AdditionalSigned` type that can hold any
encodable data, and therefore allow you to perform any custom logic prior to including or
dispatching a transaction. The transaction queue regularly calls functions from `SignedExtension` to
validate transactions prior to block construction to avoid including transactions that will fail in
blocks.

Despite the name, `SignedExtension` can also be used to verify unsigned transactions. The
`*_unsigned` set of methods can be implemented to encapsulate validation, spam, and replay
protection logic that is needed by the transaction pool.

- [Signed Extension Reference](https://substrate.dev/rustdocs/latest/sp_runtime/traits/trait.SignedExtension.html)

## Further Reading

- [Reference Documentation](https://substrate.dev/rustdocs/latest/sp_runtime/traits/trait.Extrinsic.html)
- [Runtime Execution](../runtime/execution)
- [Transaction Fees](../runtime/fees)
- [Transaction Pool](../learn-substrate/tx-pool)

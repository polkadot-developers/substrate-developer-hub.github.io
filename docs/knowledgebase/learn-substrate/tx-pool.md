---
title: Transaction Pool
---

The transaction pool contains all transactions (signed and unsigned) broadcasted to the network that
have been received and validated by the local node.

**Validity**

The transaction pool checks for transaction validity. Note that `validity` of the transaction is not
hard-wired to the transaction pool, but is defined by the runtime. Example validity checks are:

- Checking if the Transaction Index (nonce) is correct.
- Checking if the account has enough funds to pay for the associated fees.
- Checking if the signature is valid.

The transaction pool also regularly checks validity of existing transactions within the pool. A
transaction will be dropped from the pool if it is found to be invalid or is an expired mortal transaction.

**Sorting**

If the transaction is valid, the transaction queue sorts transactions into two groups:

- _Ready Queue_ - Contains transactions that can be included in a new pending block. For runtimes
  built with FRAME, the transactions must follow the exact order in the ready queue.
- _Future Queue_ - Contains transactions that may become valid in the future. For example, a
  transaction may have a `nonce` that is too high for its account. This transaction will wait in the
  future queue until the preceding transactions are included in the chain.

Note: It's possible to design a custom runtime to remove the strict transaction ordering
requirement. This would allow full nodes to implement different strategies on transaction
propagation and block inclusion.

## Transaction Dependencies

The `ValidTransaction`
[struct](https://substrate.dev/rustdocs/latest/sp_runtime/transaction_validity/struct.ValidTransaction.html)
defines the `requires` and `provides` parameters to build a dependency graph of transactions.
Together with `priority` (discussed below), this dependency graph allows the pool to produce a valid
linear ordering of transactions.

For runtimes built with FRAME, the nodes order transactions with an account-based system. Every
signed transaction needs to contain a nonce, which is incremented by 1 every time a new transaction
is made. For example, the first transaction from a new account will have `nonce = 0` and the second
transaction will have `nonce = 1`.

At minimum, FRAME transactions have a `provides` tag of `encode(sender ++ nonce)` and a `requires`
tag of `encode(sender ++ (nonce -1)) if nonce > 1`. Transactions do not require anything if
`nonce=0`. As a result, all transactions coming from a single sender will form a sequence in which
they should be included.

Substrate supports multiple `provides` and `requires` tags, so custom runtimes can create alternate
dependency (ordering) schemes.

## Transaction Priority

Transaction `priority` in the `ValidTransaction`
[struct](https://substrate.dev/rustdocs/latest/sp_runtime/transaction_validity/struct.ValidTransaction.html)
determines the ordering of transactions that are in the ready queue. If a node is the next block
author, it will order transactions from high to low priority in the next block until it reaches the
weight or length limit of the block.

`priority` defines the linear ordering of a graph in the case of one transaction unlocking multiple
dependent transactions. For example, if we have two (or more) transactions that have their
dependencies satisfied, then we use `priority` to choose the order for them.

For runtimes built with FRAME, `priority` is defined as the `fee` that the transaction is going to
pay. For example:

- If we receive 2 transactions from _different_ senders (with `nonce=0`), we use `priority` to
  determine which transaction is more important and included in the block first.
- If we receive 2 transactions from the _same_ sender with an identical `nonce`, only one
  transaction can be included on-chain. We use `priority` to choose the transaction with a higher
  `fee` to store in the transaction pool.

Note that the pool does not know about fees, accounts, or signatures - it only deals with the
validity of the transaction and the abstract notion of the `priority`, `requires`, and `provides`
parameters. All other details are defined by the runtime via the `validate_transaction` function.

## Transaction Lifecycle

A transaction can follow two paths:

### Block Produced by our Node

1. Our node listens for transactions on the network.
2. Each transaction is verified and valid transactions are placed in the transaction pool.
3. The pool is responsible for ordering the transactions and returning ones that are ready to be
   included in the block. Transactions in the ready queue are used to construct a block.
4. Transactions are executed and state changes are stored in local memory. Transactions from the
   `ready` queue are also propagated (gossiped) to peers over the network. We use the exact ordering
   as the pending block since transactions in the front of the queue have a higher priority and are
   more likely to be successfully executed in the next block.
5. The constructed block is published to the network. All other nodes on the network receive and
   execute the block.

Note that transactions are not removed from the ready queue when blocks are authored, but removed
_only_ on block import. This is due to the possibility that a recently-authored block may not make
it into the canonical chain.

### Block Received from Network

The block is executed and the entire block either succeeds or fails.

## Transaction Validity

`validate_transaction` is called from the runtime, checks for a valid signature and nonce (or output
for a UTXO chain) and returns a `Result`. `validate_transaction` checks transactions in isolation,
so it will not catch errors like the same output being spent twice.

Although it is possible, `validate_transaction` does not check whether calls to pallets will
succeed. It is a potential DoS vector since all transactions in the network will be passed into
`validate_transaction`.

The `validate_transaction` function should focus on providing the necessary information for the pool
to order and prioritize transactions, and quickly reject all transactions that are invalid or
outdated. The function will be called frequently, potentially multiple times for the same
transaction. It is also possible for `validate_transaction` to fail a dependent transaction that
would pass `execute_block` if it were executed in the correct order.

## Further Reading

- [Extrinsics](extrinsics)
- [Transaction Fees](../runtime/fees)

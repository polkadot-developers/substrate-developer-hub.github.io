---
title: Transaction Pool
---


The transaction pool contains all transactions (signed and unsigned) broadcasted to the network that have been *received* and *validated* by the local node. The pool is responsible for:


1) Checking if transactions are valid. `validity` of the transaction is not hard wired to the transaction pool, but is defined by the runtime through the `validate_transaction` function ([code](https://github.com/paritytech/substrate/blob/20a9b15cdbed4bf962a4447e8bfb812f766f2fbc/frame/executive/src/lib.rs#L304)). Example validity checks are:

* Transaction Index (nonce) correctness.
* The account has enough funds to pay for the associated fees.
* The signature is valid.

2) If the transaction is valid, sorting the transactions into 2 transaction queues:
   - **Ready Queue** -  Contains transactions that can be included in a new pending block and must follow the *exact* order in the ready queue.

   - **Future Queue** - Contains transactions that *seem* valid so far, but the full node has yet to see the remaining transactions it depends on. For example, *Transaction B* is in the future queue and can only be included in a block after *Transaction A* has been included. However, the node is yet to see *Transaction A* in its transaction pool.

Full nodes in the network all have their own local transaction pool and transaction queues. Therefore, full nodes may have a different view of the queues and transactions in the network.

Dependent on the runtime, strict ordering may not be a requirement. This could enable full nodes to implement different strategies on how they prioritise propagating transactions and how they're included into blocks.

## Transaction Dependencies

Transaction [dependencies](https://substrate.dev/rustdocs/master/sp_runtime/transaction_validity/struct.ValidTransaction.html) are defined by the `requires` and `provides` parameters in `ValidTransaction` to build a dependency graph of transactions. Together with `priority`, this allows the pool to traverse the graph and produce a valid linear ordering of transactions to be propagated and included in the next block.

For `Frame` based runtimes, an account based system is used for transaction ordering. Every signed transaction needs to contain a nonce, which is incremented by 1 every time a new transaction is made. For example, the first transaction from a new account will have `nonce=0` and the second transaction will have `nonce=1`.

At minimum, `Frame` transactions have a `provide` tag of `encode(sender ++ nonce)` and a `require` tag of `encode(sender ++ (nonce -1)) if nonce > 1`. Transactions do not `require` anything if `nonce=0`. As a result, all transactions coming from a single sender will form a sequence in which they should be included.

Substrate supports multiple `provide` and `require` tags, so custom runtimes can create alternate dependency (ordering) schemes.

## Transaction Priority

Transaction `priority` in the `ValidTransaction` [struct](https://substrate.dev/rustdocs/master/sp_runtime/transaction_validity/struct.ValidTransaction.html), helps determine the ordering of transactions that have their dependencies satisfied. The higher the priority number, the more important the transaction is.

`Priority` helps define the linear ordering of a graph in the case of one transaction unlocking multiple dependent transactions. For example, if we have two (or more) transactions that have their dependencies satisfied, then we use `priority` to choose the order for them.


For `Frame` based runtimes, `priority` is defined as the `fee` that the transaction is going to pay. For example:

  * If we receive 2 transactions from *different* senders (with `nonce=0`), we use `priority` to determine which transaction is more important and included in the block first.

  * If we receive 2 transactions from the *same* sender with an identical `nonce`, only one transaction can be included on-chain. We use `priority` to choose the transaction with a higher `fee` to store in the transaction pool.

Note that the pool does not know about fees, accounts or signatures - it only deals with the validity of the transaction and the abstract notion of `priority`, `requires` and `provides` parameters. All other details are defined by the runtime via the `validate transction` implementation.

## Transaction Lifecycle

There are two paths a transaction can follow:

1. **A block is received from the network**

  The block is run through `execute_block`([code](https://github.com/paritytech/substrate/blob/20a9b15cdbed4bf962a4447e8bfb812f766f2fbc/frame/executive/src/lib.rs#L196)), and the entire block either succeeds or fails.

2. **A block is produced by our own node**

  a) Our node listens for transactions on the network.

  b) Each transaction is verified through the `validate_transaction` ([code](https://github.com/paritytech/substrate/blob/20a9b15cdbed4bf962a4447e8bfb812f766f2fbc/frame/executive/src/lib.rs#L304)) function and places valid transactions in the transaction pool.

  c) The pool is responsible for ordering the transactions and returning ones that are ready to be included in the block. Transactions in the ready queue are used to construct a block with `BlockBuilder`.

  d) `BlockBuilder`([code](https://github.com/paritytech/substrate/blob/master/client/block-builder/src/lib.rs)) uses the `apply_extrinsic`([code](https://github.com/paritytech/substrate/blob/20a9b15cdbed4bf962a4447e8bfb812f766f2fbc/frame/executive/src/lib.rs#L235)) function to execute the transaction and apply the state changes in local memory. Transactions from the `ready` queue are also propagated (gossiped) to peers over the network. We use the exact ordering as the pending block since transactions in the front of the queue have a higher priority and are more likely to be successfully executed in the next block.

  e) The constructed block is published to the network (where all other nodes run it through `execute_block`).

Note that transactions are not removed from the ready queue when blocks are authored, but removed *only* on block import. This is due to the possibility that a recently authored block may be orphaned off.

## Transaction Validity

`validate_transaction` is called from the runtime, checks for a valid signature and nonce (or output for a UTXO chain) and returns a [`Result`](https://github.com/paritytech/substrate/blob/20a9b15cdbed4bf962a4447e8bfb812f766f2fbc/primitives/runtime/src/transaction_validity.rs#L150). `validate_transaction` checks transactions in isolation, so it will not catch errors like the same output being spent twice.

Although it is possible, `validate_transaction` does not check whether calls to pallets will succeed. It is a potential DoS vector since all transactions in the network will be passed into `validate_transaction`.

The `validate_transaction` function should focus on providing the necessary information for the pool to order and prioritise transactions, and quickly reject all transactions that are invalid or outdated. The function will be called frequently, potentially multiple times for the same transaction. It is also possible for `validate_transaction` to fail a dependent transaction that would pass `execute_block` if it were executed in the correct order.

## Further Reading
- [Extrinsics](conceptual/node/extrinsics.md)
- [Transaction Fees](development/module/fees.md)

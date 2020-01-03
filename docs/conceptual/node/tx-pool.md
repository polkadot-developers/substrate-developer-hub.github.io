---
title: Transaction Pool
---


The transaction pool contains all transactions (signed & unsigned) broadcasted to the network. The pool is responsible for:

1) Checking if transactions are valid or invalid. For example, ensuring the account that issued the transaction has enough funds to pay the associated fees.

2) If the transaction is valid, sorting the transactions into 2 transaction queues:
   - **Ready Queue** -  Contains transactions that can be included in a new pending block and must follow the *exact* order in the ready queue.

   - **Future Queue** - Contains transactions that *seem* valid, but the full node has yet to see the remaining transactions it depends on. For example, *Transaction B* is in the future queue and can only be included in the block after *Transaction A* has been included. However, the node is yet to see *Transaction A* in its transaction pool.

Full nodes in the network all have their own local transaction pool and transaction queues. Therefore, full nodes can implement different strategies on how they prioritise importing transactions.

## Transaction Dependencies

Transaction dependencies are defined by the `requires` and `provides` parameters in `ValidTransaction` to build a dependency graph of transactions. This allows the importation of transactions in a correct and linear order.

For `Frame` based runtimes, an account based system is used for transaction ordering. Every signed transaction needs to contain a nonce, which is incremented by 1 every time a new transaction is made. For example, the first transaction from a new account will have `nonce=0` and the second transaction will have `nonce=1`.

Transactions have a `provide` tag of `encode(sender ++ nonce)` and a `require` tag of `encode(sender ++ (nonce -1)) if nonce > 1`. Transactions do not `require` anything if `nonce=0`.

Substrate supports multiple `provide` and `require` tags, so custom runtimes can create alternate dependency (ordering) schemes.

## Transaction Priority

Transaction `priority` in the `ValidTransaction` ([struct](https://github.com/paritytech/substrate/blob/95cffde19d32aa998295cbe36b20168f4dd57fee/primitives/runtime/src/transaction_validity.rs#L166)), helps determine the ordering of transactions that have their dependencies satisfied. The higher the priority number, the more important the transaction is.

`Priority` helps define the linear ordering of a graph in the case of one transaction unlocking multiple dependent transactions. For example, if we have two (or more) transactions that have their dependencies satisfied, then we use `priority` to choose the order for them.


For `Frame` based runtimes, `priority` is defined as the `fee` that the transaction is going to pay. For example, if we receive two transactions from the same sender with an identical `nonce`, only one transaction can be included on-chain. We use `priority` to choose the transaction with a higher `fee` to store in the transaction pool.

Note that the pool does not know about fees, accounts or signatures - it only deals with the validity of the transaction and the abstract notion of `priority`, `requires` and `provides` parameters.

## Transaction Lifecycle

There are two paths an extrinsic can follow:

1. **A block is received from the network**

  The block is run through `execute_block`([code](https://github.com/paritytech/substrate/blob/20a9b15cdbed4bf962a4447e8bfb812f766f2fbc/frame/executive/src/lib.rs#L196)), and the entire block either succeeds or fails.

2. **A block is produced by our own node**

  a) Our node listens for transactions on the network.

  b) Each transaction is verified through the `validate_transaction` ([code](https://github.com/paritytech/substrate/blob/20a9b15cdbed4bf962a4447e8bfb812f766f2fbc/frame/executive/src/lib.rs#L304)) function and places valid transactions in the transaction pool.

  c) The pool is responsible for ordering the transactions and returning ones that are ready to be included in the block. Transactions in the ready queue are used to construct a block with `BlockBuilder`.

  d) `BlockBuilder`([code](https://github.com/paritytech/substrate/blob/master/client/block-builder/src/lib.rs)) uses the `apply_extrinsic`([code](https://github.com/paritytech/substrate/blob/20a9b15cdbed4bf962a4447e8bfb812f766f2fbc/frame/executive/src/lib.rs#L235)) function to execute the transaction and apply the state changes in local memory.

  e) The constructed block is published to the network (where all other nodes run it through `execute_block`).

## Transaction Validity

`validate_transaction` is called from the runtime, checks for a valid signature and nonce (or output for a UTXO chain) and returns a [`Result`](https://github.com/paritytech/substrate/blob/20a9b15cdbed4bf962a4447e8bfb812f766f2fbc/primitives/runtime/src/transaction_validity.rs#L150). `validate_transaction` checks transactions in isolation, so it will not catch errors like the same output being spent twice.

Although it is possible, `validate_transaction` does not check if calls to modules will succeed. It is a potential DoS vector since all transactions in the network will be passed into `validate_transaction`.

The `validate_transaction` function should focus on providing the necessary information for the pool to order and prioritize transactions, and quickly reject all transactions that are invalid or outdated. The function will be called frequently, potentially multiple times for the same transaction. It is also possible for `validate_transaction` to fail a dependent transaction that would pass `execute_block` if it were executed in the correct order.

## Further Reading
- [Extrinsics](conceptual/node/extrinsics.md)
- [Transaction Fees](development/module/fees.md)

---
title: "Transaction Lifecycle"
---
Substrate allows developers to make a custom runtime - or application logic - that can put any kind of information in blocks. Although some primitive functionality is provided in Substrate Core and the SRML, the chain developer has responsibility for validating the information that goes into blocks before it is finalized by the network.

This article will cover the tools provided by Substrate and some guidance on where to place your checks in your runtime.

Any information in a block is called an “extrinsic” and the term is divided into two types:

* Transactions are information that is signed, and can be thought of like a Bitcoin or Ethereum transaction. Transactions are gossiped on the network and can be submitted by any node for inclusion in a block.
* Inherents are information that is not signed whose origin, authenticity and content is not (necessarily) provable, they are added to the block by block authors at their discretion. Example inherents are timestamp modifications (in state) or a list of validators needed for consensus. These are “true” because other actors in the network agree with them by verifying and building on top of the block that contains them. Inherents are not gossiped on the network; instead, the block author writes them to a block. However, inherents still affect state, so you need a method of validating that they will affect storage as planned before finalizing them.

There are two paths that a transaction can follow:

1. A block is received from the network
2. A block is produced ourselves

In the first case, the block is run through `execute_block`, and the entire block either succeeds or fails.

In the second case, we have more checks to perform before publishing our block.

1. We listen for transactions on the network.
2. We verify each transaction through the `validate_transaction` function and put valid transactions in the pool.
3. The pool is responsible for ordering the transactions and returning the ones that are ready to be included in the block. We use ready transactions to construct a block with `BlockBuilder`.
4. `BlockBuilder` uses the `apply_extrinsic` function to execute the transaction and apply the state changes in local memory.
5. The constructed block is published to the network (where all other participants run it using `execute_block`).

In step 2, `validate_transaction` does some rudimentary checks and [returns an enum](https://github.com/paritytech/substrate/blob/250bbe1d72b928ef771325e0ed6980a52e38c322/core/sr-primitives/src/transaction_validity.rs#L31) with variants Valid, Invalid, and Unknown. `validate_transaction` [is called from the runtime](https://github.com/paritytech/substrate/blob/v0.9.2/srml/executive/src/lib.rs#L225) and checks for a valid signature and nonce (or output in the case of a UTXO chain), but does not check to see if any calls to modules will succeed. `validate_transaction` checks transactions in isolation, so it will not catch errors like the same output being spent twice.

In fact, it is usually possible to use `validate_transaction` to check calls to modules because it is available in the runtime. However, we do not recommend doing that as it is a potential DoS vector since all transactions in the network will be passed into `validate_transaction`. The `validate_transaction` function should focus on providing the necessary information for the pool to order and prioritize transactions and quickly reject all transactions that are definitely invalid or outdated. Note that the function will be called frequently (also potentially multiple times for the same transaction). It is also possible for `validate_transaction` to fail a dependent transaction that would pass `execute_block` if it were executed in the correct order.

We use the outputs from `validate_transaction` to order the transactions in the pool and construct a block candidate with `BlockBuilder` ([code](https://github.com/paritytech/substrate/blob/v0.9.2/core/client/src/block_builder/block_builder.rs)). All extrinsics within the constructed block are executed via `apply_extrinsic` ([code](https://github.com/paritytech/substrate/blob/v0.9.2/srml/executive/src/lib.rs#L144)), which makes all the module calls and applies the state transition to our local memory. If that passes without any problems, then the block is propagated to the network where, like in the first case, everyone will run `execute_block` ([example here](https://github.com/paritytech/substrate/blob/v0.9.2/srml/executive/src/lib.rs#L112)). Locally, the block is imported to the chain without running `execute_block` (we reuse the in memory change set).

Remember that with Substrate, token transfers are not the only state transitions: any information can be written to a block. `execute_block` should never panic, and if a call to a module returns `Err`, it will be finalized and changes to storage will not be reverted. This is because reverting changes would require that each node copy storage at every block. 

When you are going to modify storage, the best practice is to do every check necessary to ensure that the call will succeed, execute all the storage changes, and finally emit an event so you know that the function has not returned early. For an example, see the `transfer` ([code](https://github.com/paritytech/substrate/blob/v0.9.2/srml/balances/src/lib.rs#L142)) function in the balances module - all checks are performed before touching storage.

If you are designing your own modules, you have the responsibility to ensure that invalid extrinsics never panic and never modify module state when returning `Err`. A correctly implemented module may also secure a bond to penalize malicious parties from submitting invalid extrinsics in the first place (preventing DoS attacks).

Substrate grants developers an immense amount of freedom in their block and storage construction. As a result, not all errors can be caught in the Substrate toolkit because the number of runtimes is essentially infinite. Application developers need to implement their own error checking to prevent faulty storage modifications.
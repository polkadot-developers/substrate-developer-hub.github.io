---
title: Transaction Weight
---

A number of resources in any chain can be limited, such as storage or computation. Weights exist to
prevent individual components of the chain from consuming too much of any resource.

Consuming some weights should generally incur a fee. The fee implications of the weight system are
covered in the [Fee Developer document](development/module/fees.md).

## Weight Fundamentals

Weights represent the _limited_ resources of your blockchain, for example computational cycles,
memory, storage, etc. A custom implementation may use complex structures to express this. Substrate
weights are simply a [numeric value](https://substrate.dev/rustdocs/master/palette_support/weights/type.Weight.html).

A weight calculation should always:

- Be computable __ahead of dispatch__. A block producer should be able to examine the weight of a
  dispatchable before actually deciding to accept it or not.
- Consume few resources itself. It does not make sense to consume similar resources computing a
  transaction's weight as would be spent to execute it. Thus, weight computation should be much
  lighter than dispatch.
- Delegate _variable_ resource consumption costs and limitations to the dispatched logic. Weights
  are good at representing _fixed_ measurements, whereas logic may not be consistently heavy. The
  implementation of the dispatch should take the state of the change into account and manually take
  extra fees or bonds or take any other measures to make sure that the transaction is safe.

The [System module](https://substrate.dev/rustdocs/master/frame_system/struct.Module.html) is
responsible for accumulating the weight of each block as it gets executed and making sure that it
does not exceed the limit. The [Transaction Payment
module](https://substrate.dev/rustdocs/master/pallet_transaction_payment/index.html) is responsible
for interpreting these weights and deducting fees based upon them. The weighing function is part of
the runtime so it can be upgraded if needed.

## Block Weight and Length Limit

Aside from affecting fees, the main purpose of the weight system is to prevent a block from being
filled with too many transactions. While processing transactions within a block, the System module
accumulates both the total length of the block (sum of encoded transactions in bytes) and the total
weight of the block. If either of these numbers surpass the limits, no further transactions are
accepted in that block. These limits are defined in
[`MaximumBlockLength`](https://substrate.dev/rustdocs/master/frame_system/trait.Trait.html#associatedtype.MaximumBlockLength)
and
[`MaximumBlockWeight`](https://substrate.dev/rustdocs/master/frame_system/trait.Trait.html#associatedtype.MaximumBlockLength).

One important note about these limits is that a portion of them are reserved for the `Operational`
dispatch class. This rule applies to both of the limits and the ratio can be found in
[`AvailableBlockRatio`](https://substrate.dev/rustdocs/master/frame_system/trait.Trait.html#associatedtype.AvailableBlockRatio).

For example, if the block length limit is 1 megabyte and the ratio is set to 80%, all transactions
can fill the first 800 kilobytes of the block while the last 200 can only be filled by the
operational class.

## Next Steps

### Learn More

- Substrate Recipes contains examples of both [custom
  weights](https://github.com/substrate-developer-hub/recipes/tree/master/kitchen/pallets/weights)
  and custom
  [WeightToFee](https://github.com/substrate-developer-hub/recipes/tree/master/kitchen/runtimes/weight-fee-runtime).
- The [srml-example](https://github.com/paritytech/substrate/blob/master/frame/example/src/lib.rs)
  module.

### Examples

- See an example of [adding a transaction
  weight](https://substrate.dev/recipes/traits/fees.html#assigning-transaction-weights)
  to a custom runtime function.

### References

- Take a look at the [SRML Transaction Payment
  module](https://github.com/paritytech/substrate/blob/master/frame/transaction-payment/src/lib.rs).
- Find info about weights including the `SimpleDispatchInfo` enum in
  [weights.rs](https://github.com/paritytech/substrate/blob/master/primitives/sr-primitives/src/weights.rs).

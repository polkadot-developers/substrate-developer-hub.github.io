---
title: Transaction Weight and Fees
---

When transactions are submitted to a blockchain, they are executed by the nodes
in the network. To be economically sustainable, the cost nodes incur to execute
a transaction must be covered by the submitter of the transaction. The cost to
execute transactions could vary over orders of magnitude, and thus Substrate
provides a flexible mechanism for characterizing the total, presumably minimum,
cost of a transaction in order to be included into a block.

Furthermore, a number of resources in any chain can be limited by definition
such as time, memory and computation. A mechanism should exist to prevent
individual resource-consuming components of the chain, including but not limited
to dispatchables, to consume too much of any of the mentioned resources. This
concept is represented in substrate by weights.

## Weights Basics

The fee system is dependent on the
[weight](https://crates.parity.io/sr_primitives/weights/index.html) system.
Hence, we will first briefly describe how weights work.

As mentioned, weights can technically refer to, or represent, numerous _limited_
resources. A custom implementation may use complex structures to demonstrate
this. At the time of this writing, substrate weights are simply a [numeric
value](https://crates.parity.io/sr_primitives/weights/type.Weight.html). Each
dispatchable function is given a weight using the `#[weight = $x]` annotation,
where `$x` is some function capable of determining the weight of the dispatch.
`$x` can access and examine the arguments of the dispatch. Nonetheless, a weight
calculation should always:
- Be computable __ahead of dispatch__. A block producer, or a validator, should
  be able to examine the weight of a dispatchable before actually deciding to
  accept it or not.
- While not enforced, calculating the weight should not consume much resource
  itself. It does not make much sense to spend almost the same amount of time as
  dispatching a transaction to estimate how much weight it will consume. Thus,
  weight computation should typically be very fast, much faster than
  dispatching. This is analogous to a `poll()` function of the `Future` trait.
  It really doesn't make sense to poll a future if it is going to stall us until
  the future itself is resolved; A sensible `poll` must return fast.
- Finally, if a transaction is very variable in the amount of resources it
  consumes, it should manually prevent restrict certain dispatches through any
  means that makes sense to that particular chain. An example of such dispatches
  in substrate is the call to a smart contract (todo: link when this is
  implemented).

Given the above details, one can write their own weight computation function,
`$x` in the above listing, to determine the weight of dispatchable. The
programming details of doing this is beyond the scope of this document. For more
information on that, refer to:
- the [weight
  module's](https://crates.parity.io/sr_primitives/weights/index.html)
  documentation in substrate-primitives.
- the
  [`srml-example`](https://github.com/paritytech/substrate/blob/master/srml/example/src/lib.rs)
  module and the inline documentation. Skim the code for `#[weight]` attributes
  and all the related documentations.
- the section on weights in Substrate recipes. TODO

The system module is responsible for accumulating the weight of each block as it
gets executed and making sure that it does not exceed the limit. The
transaction-payment module is responsible for interpreting these weights and
deducting fees based upon them.

## Fees Calculation

The fee to include a transaction consists of three parts:

* `base_fee` a fixed fee that is applied to every single transaction. See
  [`TransactionBaseFee`](https://crates.parity.io/srml_transaction_payment/trait.Trait.html#associatedtype.TransactionBaseFee)
* `length_fee` a per-byte fee that is multiplied by the length, in bytes, of the
  encoded transaction. See
  [`TransactionByteFee`](https://crates.parity.io/srml_transaction_payment/trait.Trait.html#associatedtype.TransactionByteFee)
* `weight_fee` a per-weight-unit fee that is multiplied by the weight of the
  transaction. As mentioned, weight of each dispatch is denoted via the flexible
  `#[weight]` annotation. Knowing the weight, it must be converted to a
  deductible `balance` type (typically denoted by a module that implements
  `Currency`, `srml-balances` in substrate node). For this, each runtime must
  define a
  [`WeightToFee`](https://crates.parity.io/srml_transaction_payment/trait.Trait.html#associatedtype.WeightToFee)
  type that makes the conversion.

based on the above, the final fee of a dispatchable is:

```
fee =
  base_fee +
  len(tx) * length_fee +
  WeightToFee(weight)
```

## Adjusting Multiplier
The above formula gives a fee which is __logically constant through time__. Of
course, the weight can, in practice, be dynamic and based on what `WeightToFee`
is defined to be, the final fee can have some degree of variability. As for the
length fee, the inputs of the transaction could change the length and hence
affecting the length fee. Nonetheless, these changes are independent and a
_general update logic to the entire fee cannot be composed out of them
trivially_. In other words, for any dispatchable, given the same inputs, _it
will always incur the same cost_. This might not always be desirable. Chains
might need to increase or decrease fees based on sime condition.  To fulfill
this requirement, Substrate provides:
  - a multiplier stored in the transaction-payment module that is applied to the
    outcome of the above formula by default (needless to say, the default value
    of which is _multiplication identity_, meaning that it has no effect). This
    is stored in
    [`NextFeeMultiplier`](https://crates.parity.io/srml_transaction_payment/struct.Module.html#method.next_fee_multiplier)
    storage.
  - a configurable parameter for a runtime to describe how this multiplier can
    change. This is expressed via
    [`FeeMultiplierUpdate`](https://crates.parity.io/srml_transaction_payment/trait.Trait.html#associatedtype.FeeMultiplierUpdate)

## More on Weights: Block Weight and Length Limit

Aside from affecting the fees, the main purpose of the weight system is to
prevent a block from being too filled with transactions. The system module,
while processing blocks≠transactions within a block, accumulates both the total
length of the block (sum of encoded transactions in number of bytes) and the
total weight of the blocks. At any points, if these numbers surpass the limits,
no further transactions are accepted to the block. These limits are defined in
[`MaximumBlockLength`](https://crates.parity.io/srml_system/trait.Trait.html#associatedtype.MaximumBlockLength)
and
[`MaximumBlockWeight`](https://crates.parity.io/srml_system/trait.Trait.html#associatedtype.MaximumBlockLength)
respectively.

One important note about these limits is that a ratio of them are reserved for
the `Operational` dispatch class. This rule applies to both of the limits and
the ratio can be found in
[`AvailableBlockRatio`](https://crates.parity.io/srml_system/trait.Trait.html#associatedtype.AvailableBlockRatio).
For example, if the block length limit is 1 mega bytes and the ratio is set the
80%, all transactions can fill the first 800 kilo bytes of the block while the
last 200 can only be filled by the operation class.


## Gluing it Together: How Things Work in Substrate

All of the above parameters are configurable and having a look at the runtime
crate in substrate should demonstrate the concrete values.

The configurable values (such as `MaximumBlockWeight`) are created using the
`parameter_types!` macro and passed to the associated module (`system` and
`transaction-payment`).

The default and minimum `Weight` is defined as `FixedNormal(10_000)` and the
`WeightToFee` is configured to map this value to `10^7` as the minimum weight
fee of substrate.

The update function is inspired by the Polkadot network and implements a
targeted adjustment in which a target saturation level of block weight is
defined. If the previous block is more saturated, then the fees are slightly
increases. Similarly, if less transaction than the target are in the previous
block, fees are decreased by a small amount. More information about this can be
found in the [web3 research
page](https://research.web3.foundation/en/latest/polkadot/Token%20Economics/#relay-chain-transaction-fees).

> Note that this section demonstrates the configuration of the fee/weight system
> at the time of this writing in `substrate-node`. This can change over time and
> any other substrate chain is indeed encouraged to parameterize its fee system
> according to its own logic and economic incentives.

## Frequent Questions

> _Some operations get more expensive as storage grows and shrinks. How can the
> weight system represent that?_

As mentioned, weight should be known _readily_ and _ahead of dispatch_. Peeking
the storage and analyzing it just to determine how much weight might be consumed
does not fit this definition quite well. In this case the implementation of the
dispatch should take the state of the change into account and manually take
extra fees, bonds or take any other measures to make sure that the transaction
is safe.

> _Is the weighting function open to change through governance short of a
> runtime upgrade?_

Yes, it is part of a runtime itself, hence any runtime upgrade is an upgrade to
the weight system as well. A upgrade can just update weight functions if needed.

## Next Steps

### Learn More

TODO

### Examples

TODO

### References

TODO


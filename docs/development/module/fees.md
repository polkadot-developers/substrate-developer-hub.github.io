---
title: Transaction Weight and Fees
---

When transactions are submitted to a blockchain, they are executed by the nodes
in the network. To be economically sustainable, nodes charge a fee to execute a
transaction that must be covered by the submitter of the transaction. The cost
to execute transactions could vary over orders of magnitude, and thus Substrate
provides a flexible mechanism for characterizing the total, presumably minimum,
cost of a transaction in order to be included into a block.

Make sure to read [Weights] before implementing fees.

## Transaction Fee

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

TODO: Examples

## Substrate Default Fee System

How to use the base fee system

### Declaring a Trasnaction Weight

### Changing the Default Weight

### Changing the fee calculation

### Using Operational Transactions

### Adjusting Multiplier
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

## Building a Custom Fee System



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

## Next Steps

### Learn More

Read about weights

### Examples

TODO

### References

TODO


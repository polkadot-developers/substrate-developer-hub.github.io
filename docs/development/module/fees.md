---
title: Transaction Fees
---

When transactions are submitted to a blockchain, they are executed by the nodes in the network. To
be economically sustainable, nodes charge a fee to execute a transaction. This fee must be covered
by the submitter of the transaction. The cost to execute transactions can vary, so Substrate 
provides a flexible mechanism to characterize the minimum cost to include a transaction in a block.

The fee system is heavily linked to the [weight system](conceptual/runtime/weight.md). Make sure to
understand weights before continuing this document.

## Transaction Fees

The fee to include a transaction consists of three parts:

* `base_fee`: a fixed fee that is applied to every transaction. See
  [`TransactionBaseFee`](/rustdocs/master/srml_transaction_payment/trait.Trait.html#associatedtype.TransactionBaseFee).
* `length_fee`: a per-byte fee that is multiplied by the length, in bytes, of the encoded
  transaction. See
  [`TransactionByteFee`](/rustdocs/master/srml_transaction_payment/trait.Trait.html#associatedtype.TransactionByteFee).
* `weight_fee`: a per-weight-unit fee that is multiplied by the weight of the transaction. The 
  weight of each dispatch is denoted via the flexible `#[weight]` annotation. Knowing the
  weight, it must be converted to a deductible `balance` type (typically denoted by a module that
  implements `Currency`, `srml-balances` in Substrate node). For this, each runtime must define a
  [`WeightToFee`](/rustdocs/master/srml_transaction_payment/trait.Trait.html#associatedtype.WeightToFee)
  type that makes the conversion. `WeightToFee` must be a struct that implements [`Convert<Weight,
  Balance>`](/rustdocs/master/sr_primitives/traits/trait.Convert.html).

Based on the above, the final fee of a dispatchable is:

```
fee =
  base_fee +
  len(tx) * length_fee +
  WeightToFee(weight)
```

This `fee` is known as the "inclusion fee." Even if the extrinsic fails, the sender must pay this
inclusion fee.

## Adjusting Multiplier

The above formula gives a fee that is logically constant through time. Because the weight can be
dynamic and based on how `WeightToFee` is defined, the final fee can have some degree of 
variability. As for the length fee, the inputs of the transaction could change the length and
affect the length fee.

Nonetheless, these changes are independent and _general update logic to the
entire fee cannot be composed out of them trivially_. In other words, for any dispatchable, given
the same inputs, _it will always incur the same cost_. This might not always be desirable. Chains
might need to increase or decrease fees based on some condition. To fulfill this requirement,
Substrate provides:

  - A multiplier stored in the Transaction Payment module that is applied to the outcome of the
    above formula by default (the default value of which is _multiplication identity_, meaning that
    it has no effect). This is stored in
    [`NextFeeMultiplier`](/rustdocs/master/srml_transaction_payment/struct.Module.html#method.next_fee_multiplier)
    and can be configured through the genesis spec of the module.
  - A configurable parameter for a runtime to describe how this multiplier can change. This is
    expressed via
    [`FeeMultiplierUpdate`](/rustdocs/master/srml_transaction_payment/trait.Trait.html#associatedtype.FeeMultiplierUpdate).

`NextFeeMultiplier` has the type `Fixed64`, which can represent a fixed point number. So, given the
inclusion fee formula above, the final version would be:

```
fee =
  base_fee +
  len(tx) * length_fee +
  WeightToFee(weight)

final_fee = fee * NextFeeMultiplier
```

Updating the `NextFeeMultiplier` has a similar effect as updating `WeightToFee`. The
[`FeeMultiplierUpdate`](/rustdocs/master/srml_transaction_payment/trait.Trait.html#associatedtype.FeeMultiplierUpdate)
associated type in `transaction-payment` is defined as a `Convert<Fixed64, Fixed64>`, which should
be read: "it receives the previous multiplier and returns the next one".

The default update function is inspired by the Polkadot network and implements a targeted adjustment
in which a target saturation level of block weight is defined. If the previous block is more
saturated, then the fees are slightly increased. Similarly, if the previous block has fewer
transactions than the target, fees are decreased by a small amount. More information about this can
be found in the [Web3 research
page](https://research.web3.foundation/en/latest/polkadot/Token%20Economics/#relay-chain-transaction-fees).

## Substrate Weight System

> This section assumes that you have already read the `Weight` section.

The entire SRML is already annotated with a simple and fixed weight system. A user can decide to
use the same system or implement a new one from scratch. The latter is outside the scope of this
document and is explained in the dedicated [`Weight`](/docs/conceptual/runtime/weight) conceptual 
document.

### Using the Default Weight

The default weight annotation is simple. Substrate, by default, uses _fixed_ weights and the enum
representing them is as follows:

```rust
pub enum SimpleDispatchInfo {
    /// A normal dispatch with fixed weight.
    FixedNormal(Weight),
    /// A normal dispatch with the maximum weight.
    MaxNormal,
    /// A normal dispatch with no weight.
    FreeNormal,
    /// An operational dispatch with fixed weight.
    FixedOperational(Weight),
    /// An operational dispatch with the maximum weight.
    MaxOperational,
    /// An operational dispatch with no weight.
    FreeOperational,
}
```

This enum groups all dispatches into _normal_ and _operational_ (which makes the implementation of
`ClassifyDispatch` trivial) and gives them a fixed weight. Fixed in this context means that the
arguments of the dispatch do not play any role in the weight. Dispatches classified as
_operational_ are exempt from paying both the `base_fee` and the `length_fee`.

A simple example of using this enum in your runtime is:

```rust
use sr_primitives::weights::{SimpleDispatchInfo};

decl_module! {
    // This means that this function has no weight. It will not contribute to block fullness at all,
    // and no weight-fee is applied.
    #[weight = SimpleDispatchInfo::FreeNormal]
    pub fn some_normal_function_light() { noop(); }

    // This function will always have a weight `10`.
    #[weight = SimpleDispatchInfo::FixedNormal(10)]
    pub fn some_normal_function_heavy() { some_computation(); }

    // This function will have a fixed weight but can consume the reserved operational portion as
    // well.
    #[weight = SimpleDispatchInfo::FixedOperational(20)]
    pub fn mission_critical_function() { some_sudo_op(); }

    // This will automatically get `#[weight = SimpleDispatchInfo::default()]`.
    pub fn something_else
}
```

> **Note:** Be careful! The default implementation of `SimpleDispatchInfo` resolves to
> `FixedNormal(10_000)`. This is due to how things work in `substrate-node` and the desired
> granularity of substrate. Even if you want to use the `SimpleDispatchInfo`, it is very likely that
> you would want it to have a different `Default`.

## Other Fees

Inclusion fees don't know anything about the logic of the transaction being executed. That is, 
Substrate doesn't care what happens in the transaction, it only cares about the size and weight of 
the transaction. The inclusion fee will always be paid by the sender.

It's possible to add fees inside dispatchable functions that are only paid if certain logic paths 
are executed. Most likely, this will be if the transaction succeeds. The `transfer` function in the 
Balances module, for example, takes a fixed fee for transferring tokens.

It is important to note that if you query the chain for a transaction fee, it will only return the 
inclusion fee. If you want to query internal function fees, you should emit Events for them.

## Custom Inclusion Fee Example

This is an example of how to customize your inclusion fee. You must configure the appropriate 
associated types in the respective module.

```rust
use sr_primitives::{traits::Convert, weights::Weight}
// Assume this is the balance type
type Balance = u64;

// Assume we want all the weights to have a `100 + 2 * w` conversion to fees
struct CustomWeightToFee;
impl Convert<Weight, Balance> for CustomWeightToFee {
    fn convert(w: Weight) -> Balance {
        let a = Balance::from(100);
        let b = Balance::from(2);
        let w = Balance::from(w);
        a + b * w
    }
}

parameter_types! {
    TransactionBaseFee: Balance = 10;
    TransactionByteFee: Balance = 10;
}

impl transaction_payment::Trait {
    TransactionBaseFee = TransactionBaseFee;
    TransactionByteFee = TransactionByteFee;
    WeightToFee = CustomWeightToFee;
    // we will get to this one soon enough
    FeeMultiplierUpdate = ();
}
```

## Next Steps

The entire logic of fees is encapsulated in `srml-transaction-payment` via a `SignedExtension`.
While this module provides a high degree of flexibility, a user can opt to build their custom
payment module drawing inspiration from Transaction Payment.

### Learn More

- Dedicated [weight documentation](/docs/conceptual/runtime/weight)
- [Example module](https://github.com/paritytech/substrate/blob/master/srml/example/src/lib.rs)
- [SignedExtension](/rustdocs/master/sr_primitives/traits/trait.SignedExtension.html)

### Examples

Substrate Recipes contains examples of both
[custom weights](https://github.com/substrate-developer-hub/recipes/tree/master/kitchen/modules/weights)
and custom
[WeightToFee](https://github.com/substrate-developer-hub/recipes/tree/master/kitchen/runtimes/weight-fee-runtime).

### References

- [Web3 Foundation Research](https://research.web3.foundation/en/latest/polkadot/Token%20Economics/#relay-chain-transaction-fees-and-per-block-transaction-limits)

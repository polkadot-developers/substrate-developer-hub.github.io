---
title: Transaction Fees
---

When transactions are submitted to a blockchain, they are executed by the nodes in the network. To
be economically sustainable, nodes charge a fee to execute a transaction. This fee must be covered
by the submitter of the transaction. The cost to execute transactions could vary over orders of
magnitude, and thus Substrate provides a flexible mechanism for characterizing the total, presumably
minimum, cost of a transaction in order to be included into a block.

The fee system is heavily linked to the [weight system](). Make sure to read and understand weights
section before continuing this document.

## Transaction Fees

The fee to include a transaction consists of three parts:

* `base_fee` a fixed fee that is applied to every single transaction. See
  [`TransactionBaseFee`](https://crates.parity.io/srml_transaction_payment/trait.Trait.html#associatedtype.TransactionBaseFee)
* `length_fee` a per-byte fee that is multiplied by the length, in bytes, of the encoded
  transaction. See
  [`TransactionByteFee`](https://crates.parity.io/srml_transaction_payment/trait.Trait.html#associatedtype.TransactionByteFee)
* `weight_fee` a per-weight-unit fee that is multiplied by the weight of the transaction. As
  mentioned, weight of each dispatch is denoted via the flexible `#[weight]` annotation. Knowing the
  weight, it must be converted to a deductible `balance` type (typically denoted by a module that
  implements `Currency`, `srml-balances` in substrate node). For this, each runtime must define a
  [`WeightToFee`](https://crates.parity.io/srml_transaction_payment/trait.Trait.html#associatedtype.WeightToFee)
  type that makes the conversion. `WeightToFee` must be a struct that implements a [`Convert<Weight,
  Balance>`](https://crates.parity.io/sr_primitives/traits/trait.Convert.html).

based on the above, the final fee of a dispatchable is:

```
fee =
  base_fee +
  len(tx) * length_fee +
  WeightToFee(weight)
```

Customizing the above would be as simple as configuring the appropriate associated type in the
respective module.

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

Two further questions need to be answered, given the above snippet.

1. What is the purpose of `FeeMultiplierUpdate`?
2. Knowing how we are capable of defining the conversion of weights to fees (via `WeightToFee`), the
   question remains, how can we define and customize the weights in the first place?

We will answer each question in the following sections, respectively.

## Adjusting Multiplier
The above formula gives a fee which is __logically constant through time__. Of course, the weight
can be dynamic and based on what `WeightToFee` is defined to be, the final fee can have some degree
of variability. As for the length fee, the inputs of the transaction could change the length and
hence affecting the length fee. Nonetheless, these changes are independent and a _general update
logic to the **entire fee** cannot be composed out of them trivially_. In other words, for any
dispatchable, given the same inputs, _it will always incur the same cost_. This might not always be
desirable. Chains might need to increase or decrease fees based on some condition.  To fulfill this
requirement, Substrate provides:
  - a multiplier stored in the transaction-payment module that is applied to the outcome of the
    above formula by default (needless to say, the default value of which is _multiplication
    identity_, meaning that it has no effect). This is stored in
    [`NextFeeMultiplier`](https://crates.parity.io/srml_transaction_payment/struct.Module.html#method.next_fee_multiplier)
    storage and can be configured through the genesis spec of the module.
  - a configurable parameter for a runtime to describe how this multiplier can change. This is
    expressed via
    [`FeeMultiplierUpdate`](https://crates.parity.io/srml_transaction_payment/trait.Trait.html#associatedtype.FeeMultiplierUpdate).

`NextFeeMultiplier` has the type `Fixed64`, which can represent a fixed point number with a billion
points accuracy. So, given the final fee formula above, the final version would be:

```
fee =
  base_fee +
  len(tx) * length_fee +
  WeightToFee(weight)

final_fee = fee * NextFeeMultiplier
```

Updating the `NextFeeMultiplier` has a similar manner as `WeightToFee`. The
[`FeeMultiplierUpdate`](https://crates.parity.io/srml_transaction_payment/trait.Trait.html#associatedtype.FeeMultiplierUpdate)
associated type in `transaction-payment` is defined as a `Convert<Fixed64, Fixed64>`, which should
be read as: it receives the previous multiplier and spits out the next one.

The default update function is inspired by the Polkadot network and implements a targeted adjustment
in which a target saturation level of block weight is defined. If the previous block is more
saturated, then the fees are slightly increases. Similarly, if less transaction than the target are
in the previous block, fees are decreased by a small amount. More information about this can be
found in the [web3 research
page](https://research.web3.foundation/en/latest/polkadot/Token%20Economics/#relay-chain-transaction-fees).

## Substrate Weight System

> This section assumes that you have already read the `Weight` section

The entire substrate runtime module library is already annotated with a simple and fixed weight
system. A user can decide to use the same system or implement a new one from scratch. The latter is
outside the scope of this document and is explained int he dedicated [`Weight`]() conceptual
document.

### Using the Default Weight

The default weight annotation is beyond _simple_. Substrate, by default, uses _fixed_ weights and
the struct representing them is as follows:

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

This struct simple groups all dispatches into _normal_ and _operational_ (which makes the
implementation of `ClassifyDispatch` pretty trivial) and gives them a fixed Weight. Fixed in this
context means that the arguments of the dispatch do not play any role in the weight; the weight of a
dispatch is always fixed.

A simple example of using this simple struct in your runtime would be:

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

    // This function will have a fixed weight but can consume the reserved operational portion as well.
    #[weight = SimpleDispatchInfo::FixedOperational(20)]
    pub fn mission_critical_function() { some_sudo_op(); }

    // This will automatically get `#[weight = SimpleDispatchInfo::default()]`
    pub fn something_else
}
```

**Be careful!** The default implementation of `SimpleDispatchInfo` resolves to
`FixedNormal(10_000)`. This is entire due to how things work in `substrate-node` and the desired
granularity of substrate. Even if you want to use the `SimpleDispatchInfo`, it is very likely that
you would want it to have a different `Default`.



## Next Steps

One important note is that the entire logic of fees is encapsulated in `srml-transaction-payment`
via a `SignedExtension`. While this module provides a high degree of flexibility, a user can opt to
build their custom payment module while inspiring from transaction-payment.

### Learn More

- Dedicated weight document
- srml-example
- SignedExtensions

### Examples

TODO

### References

TODO


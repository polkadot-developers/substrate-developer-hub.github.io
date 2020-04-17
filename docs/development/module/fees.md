---
title: Transaction Fees
---

When a block author constructs a block, it must limit the block's execution time. A block body
consists of a series of [extrinsics](conceptual/node/extrinsics.md). Since the resources
needed to execute an extrinsic can vary, Substrate provides a flexible mechanism called "weights"
to characterize the _time_ it takes to execute an extrinsic. To be economically sustainable and to
limit spam, some transactions --- primarily those dispatched by users --- require a fee prior to
transaction execution.

Although an extrinsic's weight is only one component of the fee charged to its sender, it is
recommended to understand the [weight system](conceptual/runtime/weight.md) before reading
this document.

## Fee Calculation

The final fee of a dispatch is calculated using the weight of the dispatchable function and a number
of configurable parameters.

### Inclusion Fee

A transaction fee consists of three parts:

* `base_fee`: A fixed fee that is applied to every transaction. See
  [`TransactionBaseFee`](https://substrate.dev/rustdocs/master/pallet_transaction_payment/trait.Trait.html#associatedtype.TransactionBaseFee).
* `length_fee`: A per-byte fee that is multiplied by the length, in bytes, of the encoded extrinsic. See
  [`TransactionByteFee`](https://substrate.dev/rustdocs/master/pallet_transaction_payment/trait.Trait.html#associatedtype.TransactionByteFee).
* `weight_fee`: A fee based on the weight of the extrinsic. The weight of each dispatch is denoted
  via the flexible `#[weight]` annotation. The weight must be converted to the `Currency` type. For
  this, each runtime must define a
  [`WeightToFee`](https://substrate.dev/rustdocs/master/pallet_transaction_payment/trait.Trait.html#associatedtype.WeightToFee)
  type that makes the conversion. `WeightToFee` must be a struct that implements [`Convert<Weight,
  Balance>`](https://substrate.dev/rustdocs/master/sp_runtime/traits/trait.Convert.html).

Based on the above, the final fee of a dispatchable is:

```
fee =
  base_fee +
  len(tx) * length_fee +
  WeightToFee(weight)
```

This `fee` is known as the "inclusion fee". Note that the extrinsic sender is charged the inclusion
fee _prior_ to the actual invocation of the extrinsic, so its cost will still be incurred if execution
fails. In the event that an account does not have a sufficient balance to pay the fee and remain
alive (i.e. existential deposit + inclusion fee), no fee will be deducted and the transaction will
not begin execution. This latter case should be rare as the transaction queue and block construction
logic perform checks prior to adding an extrinsic to a block.

### Fee Multiplier

The above formula gives a fee that is always the same for the same input. However, weight can be
dynamic and, based on how
[`WeightToFee`](https://substrate.dev/rustdocs/master/pallet_transaction_payment/trait.Trait.html#associatedtype.WeightToFee)
is defined, the final fee can include some degree of variability. To fulfill this requirement,
Substrate provides:

  - [`NextFeeMultiplier`](https://substrate.dev/rustdocs/master/pallet_transaction_payment/struct.Module.html#method.next_fee_multiplier):
    A multiplier stored in the Transaction Payment module and configurable.
  - [`FeeMultiplierUpdate`](https://substrate.dev/rustdocs/master/pallet_transaction_payment/trait.Trait.html#associatedtype.FeeMultiplierUpdate):
    A configurable parameter for a runtime to describe how this multiplier can change.

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
`FeeMultiplierUpdate` associated type in Transaction Payment module is defined as a
`Convert<Fixed64, Fixed64>`, which should be read:

> "it receives the previous multiplier and returns the next one".

The default update function is inspired by the Polkadot network and implements a targeted adjustment
in which a target saturation level of block weight is defined. If the previous block is more
saturated, then the fees are slightly increased. Similarly, if the previous block has fewer
transactions than the target, fees are decreased by a small amount. More information about this can
be found in the [Web3 research
page](https://research.web3.foundation/en/latest/polkadot/Token%20Economics.html#relay-chain-transaction-fees-and-per-block-transaction-limits).

### Additional Fees

Inclusion fees don't know anything about the logic of the transaction being executed. That is,
Substrate doesn't care what happens in the transaction, it only cares about the size and weight of
the transaction. The inclusion fee will always be paid by the sender.

It's possible to add fees inside dispatchable functions that are only paid if certain logic paths
are executed. Most likely, this will be if the transaction succeeds. The `transfer` function in the
Balances module, for example, takes a fixed fee for transferring tokens.

It is important to note that if you query the chain for a transaction fee, it will only return the
inclusion fee.

## Default Weight Fees

All dispatchable functions in Substrate must specify a weight. Substrate provides flexible mechanisms
for defining custom weight logic as well as a default weight system that uses _fixed_ weights, which
means that the arguments to a dispatch do not affect its weight. The tiers in the default system are
represented by the following enum:

```rust
pub enum SimpleDispatchInfo {
    FixedNormal(Weight),
    MaxNormal,
    InsecureFreeNormal,
    FixedOperational(Weight),
    MaxOperational,
    FixedMandatory(Weight),
}
```

In order to delineate their purposes, the enums in this group are separated into _dispatch classes_,
which are also defined by an enum:

```rust
pub enum DispatchClass {
    Normal,
    Operational,
    Mandatory,
}
```

### Normal Dispatches

Dispatches in this class represent normal user-triggered transactions. These types of dispatches may
only consume a portion of a block's total weight limit; this portion can be found by examining the
[`AvailableBlockRatio`](https://substrate.dev/rustdocs/master/frame_system/trait.Trait.html#associatedtype.AvailableBlockRatio).
Normal dispatches are sent to the [transaction pool](conceptual/node/tx-pool.md).

#### `FixedNormal`

Describes a normal function that will always have the specified weight.

```rust
#[weight = SimpleDispatchInfo::FixedNormal(10)]
pub fn some_normal_function_heavy() { some_computation(); }
```

#### `MaxNormal`

This is equivalent to `SimpleDispatchInfo::FixedNormal(Weight::max_value())`.

#### `InsecureFreeNormal`

This means that the function has no weight; it will not contribute to the block's weight at all,
and no weight fee is applied. Although the `base_fee` and `length_fee` still need to be paid, as
the name indicates a lack of weight fees also implies a lack of security, so developers should use
care when when adding dispatches of this type to their runtime.

```rust
#[weight = SimpleDispatchInfo::InsecureFreeNormal]
pub fn some_normal_function_light() { noop(); }
```

### Operational Dispatches

As opposed to normal dispatches, which represent _usage_ of network capabilities, operational dispatches
are those that _provide_ network capabilities. These types of dispatches may consume the entire weight
limit of a block, which is to say that they are not bound by the
[`AvailableBlockRatio`](https://substrate.dev/rustdocs/master/frame_system/trait.Trait.html#associatedtype.AvailableBlockRatio).
Dispatches in this class are given maximum priority and are exempt from paying the `base_fee` and
`length_fee`.

#### `FixedOperational`

Describes a function that will have a fixed weight and can consume the reserved operational portion
as well.

```rust
#[weight = SimpleDispatchInfo::FixedOperational(20)]
pub fn mission_critical_function() { some_sudo_op(); }
```

#### `MaxOperational`

This is equivalent to `SimpleDispatchInfo::FixedOperational(Weight::max_value())`.

### Mandatory Dispatches

Mandatory dispatches will be included in a block even if they cause the block to surpass its weight
limit. This dispatch class may only be applied to
[inherents](conceptual/node/extrinsics.md#Inherents) and is intended to represent functions
that are part of the block validation process. Since these kinds of dispatches are always included
in a block regardless of the function weight, it is critical that the function's validation process
prevents malicious validators from abusing the function in order to craft blocks that are valid but
impossibly heavy. This can typically be accomplished by ensuring that the operation is always very
light and can only be included in a block once. In order to make it more difficult for malicious
validators to abuse these types of dispatches, they may not be included in blocks that return errors.
This dispatch class exists to serve the assumption that it is better to allow an overweight block
to be created than to not allow any block to be created at all.

#### `FixedMandatory`

This function will have a fixed weight and be allowed in a block even if the function makes the block
overweight.

```rust
#[weight = SimpleDispatchInfo::FixedMandatory(20)]
pub fn block_validation_critical_function() { block_validation_op(); }
```

## Custom Fees

You can also define custom fee systems through custom weight functions or inclusion fee functions.

### Custom Weights

Implementing a custom weight calculation function can vary in complexity. Using the
`SimpleDispatchInfo` struct provided by Substrate is the easiest approach.

A weight calculation function must provide two trait implementations:

  - [`WeightData<T>`]: To determine the weight of the dispatch.
  - [`ClassifyDispatch<T>`]: To determine the class of the dispatch.

Substrate then bundles the output information of the two traits into the [`DispatchInfo`] struct and
provides it by implementing the [`GetDispatchInfo`] for all `Call` variants and opaque extrinsic
types. This is used internally by the System and Executive modules; you probably won't use it.

Both `ClassifyDispatch` and `WeightData` are generic over `T`, which gets resolved into the tuple of
all dispatch arguments except for the origin. To demonstrate, we will craft a struct that calculates
the weight as `m * len(args)` where `m` is a given multiplier and `args` is the concatenated tuple
of all dispatch arguments. Further, the dispatch class is `Operational` if the transaction has more
than 100 bytes of length in arguments.

```rust
use coded::Encode;
use sr_primitives::weights::{DispatchClass, ClassifyDispatch, WeightData}

// self.0 is the multiplier, `m`
struct LenWeight(u32);

// We don't quite know what T is. After all, different dispatches have different arguments, hence
// `T` will be different. All that we care about is that `T` is encodable. That is always true by
// definition. All dispatch arguments are encodable.
impl<T: Encode> WeighData<T> for LenWeight {
    fn weigh_data(&self, target: T) -> Weight {
        let multiplier = self.0;
        let encoded_len = target.encode().len() as u32;
        multiplier * encoded_len
    }
}

impl<T: Encode> ClassifyDispatch<T> for LenWeight {
    fn classify_dispatch(&self, target: T) -> DispatchClass {
        let encoded_len = target.encode().len() as u32;
        if encoded_len > 100 {
            DispatchClass::Operational
        } else {
            DispatchClass::Normal
        }
    }
}
```

A weight calculator function can also be coerced to the final type of the argument, instead of
defining it as a vague type that is encodable. `srml-example` contains an example of how to do this.
Just note that, in that case, your code would roughly look like:

```rust
struct CustomWeight;
impl WeighData<(&u32, &u64)> for CustomWeight {
    fn weigh_data(&self, target: (&u32, &u64)) -> Weight {
        ...
    }
}

// given dispatch:
decl_module! {
    fn foo(a: u32, b: u64) { ... }
}
```

This means that `CustomWeight` can only be used in conjunction with a dispatch with a particular
signature `(u32, u64)`, as opposed to `LenWeight`, which can be used with anything because they
don't make any strict assumptions about `<T>`.

### Custom Inclusion Fee

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

- Dedicated [weight documentation](conceptual/runtime/weight.md)
- [Example module](https://github.com/paritytech/substrate/blob/master/frame/example/src/lib.rs)
- [SignedExtension](https://substrate.dev/rustdocs/master/sp_runtime/traits/trait.SignedExtension.html)

### Examples

Substrate Recipes contains examples of both [custom
weights](https://github.com/substrate-developer-hub/recipes/tree/master/pallets/weights) and
custom
[WeightToFee](https://github.com/substrate-developer-hub/recipes/tree/master/runtimes/weight-fee-runtime).

### References

- [Web3 Foundation
  Research](https://research.web3.foundation/en/latest/polkadot/Token%20Economics.html#relay-chain-transaction-fees-and-per-block-transaction-limits)

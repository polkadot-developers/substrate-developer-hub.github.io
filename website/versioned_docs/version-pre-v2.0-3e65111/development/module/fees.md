---
title: Transaction Fees
id: version-pre-v2.0-3e65111-fees
original_id: fees
---

When transactions are submitted to a blockchain, they are executed by the nodes in the network. To
be economically sustainable, nodes charge a fee to execute a transaction. This fee must be covered
by the sender of the transaction. The cost to execute transactions can vary, so Substrate provides a
flexible mechanism to characterize the minimum cost to include a transaction in a block.

The fee system is heavily linked to the [weight system](conceptual/runtime/weight.md). Make sure to
understand weights before reading this document.

## Default Fees

The default fee system uses the uses _fixed_ weights represented by the following enum:

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

This enum groups all dispatches into _normal_ or _operational_ and gives them a fixed weight. This
means that the arguments of a dispatchable function do not affect the weight. A dispatch classified
as _operational_ is exempt from paying both the `base_fee` and the `length_fee`.

### Free Normal

This means that this function has no weight. It will not contribute to block fullness at all, and no
weight-fee is applied.

```rust
#[weight = SimpleDispatchInfo::FreeNormal]
pub fn some_normal_function_light() { noop(); }
```

### Fixed Normal

This function will always have a weight `10`.

```rust
#[weight = SimpleDispatchInfo::FixedNormal(10)]
pub fn some_normal_function_heavy() { some_computation(); }
```

### Fixed Operational

This function will have a fixed weight but can consume the reserved operational portion as well.

```rust
#[weight = SimpleDispatchInfo::FixedOperational(20)]
pub fn mission_critical_function() { some_sudo_op(); }
```

### Default

This function will automatically get `#[weight = SimpleDispatchInfo::default()]`.

```rust
pub fn something_else() { noop(); }
```

> **Note:** Be careful! The default implementation of `SimpleDispatchInfo` resolves to
> `FixedNormal(10_000)`. This is due to how things work in `substrate-node` and the desired
> granularity of substrate. Even if you want to use the `SimpleDispatchInfo`, it is very likely that
> you would want it to have a different `Default`.

## Fee Calculation

The final fee of a dispatch is calculated using the weight of the function and a number of
configurable parameters.

### Inclusion Fee

A transaction fee consists of three parts:

* `base_fee`: A fixed fee that is applied to every transaction. See
  [`TransactionBaseFee`](https://substrate.dev/rustdocs/pre-v2.0-3e65111/pallet_transaction_payment/trait.Trait.html#associatedtype.TransactionBaseFee).
* `length_fee`: A per-byte fee that is multiplied by the length, in bytes, of the encoded
  transaction. See
  [`TransactionByteFee`](https://substrate.dev/rustdocs/pre-v2.0-3e65111/pallet_transaction_payment/trait.Trait.html#associatedtype.TransactionByteFee).
* `weight_fee`: A per-weight-unit fee that is multiplied by the weight of the transaction. The
  weight of each dispatch is denoted via the flexible `#[weight]` annotation. Knowing the weight, it
  must be converted to the `Currency` type. For this, each runtime must define a
  [`WeightToFee`](https://substrate.dev/rustdocs/pre-v2.0-3e65111/pallet_transaction_payment/trait.Trait.html#associatedtype.WeightToFee)
  type that makes the conversion. `WeightToFee` must be a struct that implements [`Convert<Weight,
  Balance>`](https://substrate.dev/rustdocs/pre-v2.0-3e65111/sp_runtime/traits/trait.Convert.html).

Based on the above, the final fee of a dispatchable is:

```
fee =
  base_fee +
  len(tx) * length_fee +
  WeightToFee(weight)
```

This `fee` is known as the "inclusion fee." Even if the extrinsic fails, the signer must pay this
inclusion fee.

### Fee Multiplier

The above formula gives a fee that is always the same for the same input. However, weight can be
dynamic and based on how `WeightToFee` is defined, the final fee can include some degree of
variability. To fulfill this requirement, Substrate provides:

  - [`NextFeeMultiplier`](https://substrate.dev/rustdocs/pre-v2.0-3e65111/pallet_transaction_payment/struct.Module.html#method.next_fee_multiplier):
    A multiplier stored in the Transaction Payment module and configurable.
  - [`FeeMultiplierUpdate`](https://substrate.dev/rustdocs/pre-v2.0-3e65111/pallet_transaction_payment/trait.Trait.html#associatedtype.FeeMultiplierUpdate):
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
- [SignedExtension](https://substrate.dev/rustdocs/pre-v2.0-3e65111/sp_runtime/traits/trait.SignedExtension.html)

### Examples

Substrate Recipes contains examples of both [custom
weights](https://github.com/substrate-developer-hub/recipes/tree/master/pallets/weights) and
custom
[WeightToFee](https://github.com/substrate-developer-hub/recipes/tree/master/runtimes/weight-fee-runtime).

### References

- [Web3 Foundation
  Research](https://research.web3.foundation/en/latest/polkadot/Token%20Economics.html#relay-chain-transaction-fees-and-per-block-transaction-limits)

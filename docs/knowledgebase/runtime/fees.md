---
title: Transaction Fees and Weights
---

When a block author constructs a block, it must limit the block's execution time. A block body
consists of a series of [extrinsics](../learn-substrate/extrinsics). Since the resources needed to
execute an extrinsic can vary, Substrate provides a flexible mechanism called "weights" to
characterize the _time_ it takes to execute an extrinsic. To be economically sustainable and to
limit spam, some transactions --- primarily those dispatched by users --- require a fee prior to
transaction execution.

Although an extrinsic's weight is only one component of the fee charged to its sender, it is
recommended to understand the [weight system](../learn-substrate/weight) before reading this
document.

## Fee Calculation

The final fee of a dispatch is calculated using the weight of the dispatchable function and a number
of configurable parameters.

### Inclusion Fee

A transaction fee consists of two parts:

- `length_fee`: A per-byte fee that is multiplied by the length, in bytes, of the encoded extrinsic.
  See
  [`TransactionByteFee`](https://substrate.dev/rustdocs/latest/pallet_transaction_payment/trait.Config.html#associatedtype.TransactionByteFee).
- `weight_fee`: A fee based on the weight of the extrinsic, which is a function of two parameters.
  One, an `ExtrinsicBaseWeight` that is declared in the runtime and applies to all extrinsics. The
  base weight covers inclusion overhead like signature verification. Two, a flexible `#[weight]`
  annotation that accounts for an extrinsic's complexity. In order to convert the weight to
  `Currency`, the runtime must define a
  [`WeightToFee`](https://substrate.dev/rustdocs/latest/pallet_transaction_payment/trait.Config.html#associatedtype.WeightToFee)
  struct that implements a conversion function,
  [`Convert<Weight,Balance>`](https://substrate.dev/rustdocs/latest/sp_runtime/traits/trait.Convert.html).

Based on the above, the final fee of a dispatchable is:

```
fee =
  len(tx) * length_fee +
  WeightToFee(weight)
```

This `fee` is known as the "inclusion fee". Note that the extrinsic sender is charged the inclusion
fee _prior_ to the actual invocation of the extrinsic, so its cost will still be incurred if
execution fails. In the event that an account does not have a sufficient balance to pay the fee and
remain alive (i.e. existential deposit plus inclusion fee), no fee will be deducted and the
transaction will not begin execution. This latter case should be rare as the transaction queue and
block construction logic perform checks prior to adding an extrinsic to a block.

### Fee Multiplier

The above formula gives a fee that is always the same for the same input. However, weight can be
dynamic and, based on how
[`WeightToFee`](https://substrate.dev/rustdocs/latest/pallet_transaction_payment/trait.Config.html#associatedtype.WeightToFee)
is defined, the final fee can include some degree of variability. To fulfill this requirement,
Substrate provides:

- [`NextFeeMultiplier`](https://substrate.dev/rustdocs/latest/pallet_transaction_payment/struct.Module.html#method.next_fee_multiplier):
  A configurable multiplier stored in the Transaction Payment module.
- [`FeeMultiplierUpdate`](https://substrate.dev/rustdocs/latest/pallet_transaction_payment/trait.Config.html#associatedtype.FeeMultiplierUpdate):
  A configurable parameter for a runtime to describe how this multiplier can change.

`NextFeeMultiplier` has the type `Fixed64`, which can represent a fixed point number. So, given the
inclusion fee formula above, the final version would be:

```
fee =
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
be found in the
[Web3 research page](https://w3f-research.readthedocs.io/en/latest/polkadot/overview/2-token-economics.html#relay-chain-transaction-fees-and-per-block-transaction-limits).

## Additional Fees

Inclusion fees must be computable prior to execution, and therefore can only represent fixed logic.
Some transactions warrant limiting resources with other strategies. For example:

- Bonds: A bond is a type of fee that will either be returned or slashed after some on-chain event.
  For example, runtime developers may want to implement a bond in order to participate in a vote; in
  this example the bond could be returned at the end of the referendum or slashed if the voter tried
  anything malicious.
- Deposits: Deposits are fees that may be returned later. For example, users may be required to pay
  a deposit in order to execute an operation that uses storage; if a subsequent operation frees that
  storage, the user's deposit could be returned.
- Burns: A transaction may burn funds internally based on its logic. For example, a transaction may
  burn funds from the sender if it creates new storage entries, thus increasing the state size.
- Limits: Runtime developers are free to enforce constant or configurable limits on certain
  operations. For example, the default Staking pallet only allows nominators to nominate 16
  validators in order to limit the complexity of the validator election process.

It is important to note that if you query the chain for a transaction fee, it will only return the
inclusion fee.

## Default Weight Annotations

All dispatchable functions in Substrate must specify a weight. The way of doing that is using the
annotation-based system that lets you combine fixed values for database read/write weight and/or
fixed values based on benchmarks. The most basic example would look like this:

```rust
#[weight = 100_000]
fn my_dispatchable() {
    // ...
}
```

Please note that the `ExtrinsicBaseWeight` is automatically added to the declared weight in order to
account for the costs of simply including an empty extrinsic into a block.

### Parameterizing over Database Accesses

In order to make weight annotations independent of the deployed database backend, they are defined
as a constant and then used in the annotations when expressing database accesses performed by the
dispatchable:

```rust
#[weight = T::DbWeight::get().reads_writes(1, 2) + 20_000]
fn my_dispatchable() {
    // ...
}
```

This dispatchable does one database read and two database writes in addition to other things that
add the additional 20,000. A database access is generally every time a value that is declared inside
the `decl_storage!` block is accessed. However, only unique accesses are counted because once a
value is accessed it is cached and accessing it again does not result in a database operation. That
is:

- Multiple reads of the same value count as one read.
- Multiple writes of the same value count as one write.
- Multiple reads of the same value, followed by a write to that value, count as one read and one
  write.
- A write followed by a read only counts as one write.

### Dispatch Classes

Dispatches are broken into three classes: `Normal`, `Operational`, and `Mandatory`. When not defined
otherwise in the weight annotation, a dispatch is `Normal`. The developer can specify that the
dispatchable uses another class like this:

```rust
#[weight = (100_000, DispatchClass::Operational)]
fn my_dispatchable() {
    // ...
}
```

This tuple notation also allows specifying a final argument that determines whether or not the user
is charged based on the annotated weight. When not defined otherwise, `Pays::Yes` is assumed:

```rust
#[weight = (100_000, DispatchClass::Normal, Pays::No)]
fn my_dispatchable() {
    // ...
}
```

#### Normal Dispatches

Dispatches in this class represent normal user-triggered transactions. These types of dispatches may
only consume a portion of a block's total weight limit; this portion can be found by examining the
[`AvailableBlockRatio`](https://substrate.dev/rustdocs/latest/frame_system/limits/struct.BlockLength.html#method.max_with_normal_ratio).
Normal dispatches are sent to the [transaction pool](../learn-substrate/tx-pool).

#### Operational Dispatches

As opposed to normal dispatches, which represent _usage_ of network capabilities, operational
dispatches are those that _provide_ network capabilities. These types of dispatches may consume the
entire weight limit of a block, which is to say that they are not bound by the
[`AvailableBlockRatio`](https://substrate.dev/rustdocs/latest/frame_system/limits/struct.BlockLength.html#method.max_with_normal_ratio).
Dispatches in this class are given maximum priority and are exempt from paying the `length_fee`.

#### Mandatory Dispatches

Mandatory dispatches will be included in a block even if they cause the block to surpass its weight
limit. This dispatch class may only be applied to
[inherents](../learn-substrate/extrinsics#Inherents) and is intended to represent functions that are
part of the block validation process. Since these kinds of dispatches are always included in a block
regardless of the function weight, it is critical that the function's validation process prevents
malicious validators from abusing the function in order to craft blocks that are valid but
impossibly heavy. This can typically be accomplished by ensuring that the operation is always very
light and can only be included in a block once. In order to make it more difficult for malicious
validators to abuse these types of dispatches, they may not be included in blocks that return
errors. This dispatch class exists to serve the assumption that it is better to allow an overweight
block to be created than to not allow any block to be created at all.

### Dynamic Weights

In addition to purely fixed weights and constants, the weight calculation can consider the input
arguments of a dispatchable. The weight should be trivially computable from the input arguments with
some basic arithmetic:

```rust
#[weight = FunctionOf(
  |args: (&Vec<User>,)| args.0.len().saturating_mul(10_000),
  DispatchClass::Normal,
  Pays::Yes,
)]
fn handle_users(origin, calls: Vec<User>) {
    // Do something per user
}
```

## Post Dispatch Weight Correction

Depending on the execution logic, a dispatchable may consume less weight than was prescribed
pre-dispatch. Why this is useful is explained in the
[weights article](../learn-substrate/weight#post-dispatch-weight-correction). In order to correct
weight, the dispatchable declares a different return type and then returns its actual weight:

```rust
#[weight = 10_000 + 500_000_000]
fn expensive_or_cheap(input: u64) -> DispatchResultWithPostInfo {
    let was_heavy = do_calculation(input);

    if (was_heavy) {
        // None means "no correction" from the weight annotation.
        Ok(None.into())
    } else {
        // Return the actual weight consumed.
        Ok(Some(10_000).into())
    }
}
```

## Custom Fees

You can also define custom fee systems through custom weight functions or inclusion fee functions.

### Custom Weights

Instead of using the default weight annotations described above, one can create a custom weight
calculation type. This type must implement the follow traits:

- [`WeighData<T>`]: To determine the weight of the dispatch.
- [`ClassifyDispatch<T>`]: To determine the class of the dispatch.
- [`PaysFee<T>`]: To determine whether the dispatchable's sender pays fees.

Substrate then bundles the output information of the two traits into the [`DispatchInfo`] struct and
provides it by implementing the [`GetDispatchInfo`] for all `Call` variants and opaque extrinsic
types. This is used internally by the System and Executive modules; you probably won't use it.

`ClassifyDispatch`, `WeighData`, and `PaysFee` are generic over `T`, which gets resolved into the
tuple of all dispatch arguments except for the origin. To demonstrate, we will craft a struct that
calculates the weight as `m * len(args)` where `m` is a given multiplier and `args` is the
concatenated tuple of all dispatch arguments. Further, the dispatch class is `Operational` if the
transaction has more than 100 bytes of length in arguments and will pay fees if the encoded length
is greater than 10 bytes.

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

impl<T: Encode> PaysFee<T> {
    fn pays_fee(&self, target: T) -> Pays {
        let encoded_len = target.encode().len() as u32;
        if encoded_len > 10 {
            Pays::Yes
        } else {
            Pays::No
        }
    }
}
```

A weight calculator function can also be coerced to the final type of the argument, instead of
defining it as a vague type that is encodable. `pallet-example` contains an example of how to do
this. Just note that, in that case, your code would roughly look like:

```rust
struct CustomWeight;
impl WeighData<(&u32, &u64)> for CustomWeight {
    fn weigh_data(&self, target: (&u32, &u64)) -> Weight {
        ...
    }
}

// given dispatch:
decl_module! {
    #[weight = CustomWeight]
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
    pub const ExtrinsicBaseWeight: Weight = 10_000_000;
}

impl frame_system::Config for Runtime {
    type ExtrinsicBaseWeight = ExtrinsicBaseWeight;
}

parameter_types! {
    pub const TransactionByteFee: Balance = 10;
}

impl transaction_payment::Config {
    type TransactionByteFee = TransactionByteFee;
    type WeightToFee = CustomWeightToFee;
    type FeeMultiplierUpdate = TargetedFeeAdjustment<TargetBlockFullness>;
}

struct TargetedFeeAdjustment<T>(sp_std::marker::PhantomData<T>);
impl<T: Get<Perquintill>> Convert<Fixed128, Fixed128> for TargetedFeeAdjustment<T> {
    fn convert(multiplier: Fixed128) -> Fixed128 {
        // Don't change anything. Put any fee update info here.
        multiplier
    }
}
```

## Next Steps

The entire logic of fees is encapsulated in `pallet-transaction-payment` via a `SignedExtension`.
While this module provides a high degree of flexibility, a user can opt to build their custom
payment module drawing inspiration from Transaction Payment.

Given now you know what Substrate weight system is, how it affect the transaction fee computation, and how to specify them for your dispatchables, the last question is how to find the right weights for your dispatchables. That is what **Substrate Benchmarking** is for. By writing benchmarking functions and running them, the system (`frame-benchmarking`) calls these functions repeatedly with different numerical parameters and empirically determine the weight functions for dispatchables in their worst case scenarios, within a certain limit. [Learn more here](./benchmarking).

### Learn More

- Dedicated [weight documentation](../learn-substrate/weight)
- [Example module](https://github.com/paritytech/substrate/blob/master/frame/example/src/lib.rs)
- [SignedExtension](https://substrate.dev/rustdocs/latest/sp_runtime/traits/trait.SignedExtension.html)

### Examples

Substrate Recipes contains examples of both
[custom weights](https://github.com/substrate-developer-hub/recipes/tree/master/pallets/weights) and
custom
[WeightToFee](https://github.com/substrate-developer-hub/recipes/tree/master/runtimes/weight-fee-runtime).

### References

- [Web3 Foundation Research](https://w3f-research.readthedocs.io/en/latest/polkadot/overview/2-token-economics.html#relay-chain-transaction-fees-and-per-block-transaction-limits)

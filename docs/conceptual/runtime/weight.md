---
title: Transaction Weight
---

A number of resources in any chain can be limited, such as storage or computation. A mechanism
should exist to prevent individual resource-consuming components of the chain, including but not
limited to dispatchable functions, from consuming too much of any resource. This concept is
represented in the Substrate runtime by weights. Further, consuming some weights could incur a fee.

The fee implications of the weight system are covered in the [Fee Developer
document](development/module/fees.md). This document mostly covers the concept of weights.

## Transaction Weight

Weights represent the _limited_ resources of your blockchain, for example computational cycles,
memory, storage, etc. A custom implementation may use complex structures to express this. At the
time of this writing, Substrate weights are simply a [numeric
value](/rustdocs/master/sr_primitives/weights/type.Weight.html).

A weight calculation should always:

- Be computable __ahead of dispatch__. A block producer, or a validator, should be able to examine
  the weight of a dispatchable before actually deciding to accept it or not.
- While not enforced, calculating the weight should not consume many resources itself. It does not
  make sense to consume similar resources computing a transaction's weight as would be spent to
  execute it. Thus, weight computation should typically be much faster than dispatch.
- Finally, if a transaction's resource consumption varies over a wide range, it should manually
  restrict certain dispatches through any means that make sense to that particular chain. An example
  of such a dispatch in Substrate is a call to a smart contract.
  <!--TODO: add example from recipes when ready.-->

The System module is responsible for accumulating the weight of each block as it gets executed and
making sure that it does not exceed the limit. The Transaction Payment module is responsible for
interpreting these weights and deducting fees based upon them.

## Block Weight and Length Limit

Aside from affecting fees, the main purpose of the weight system is to prevent a block from being
filled with too many transactions. The System module, while processing transactions within a block,
accumulates both the total length of the block (sum of encoded transactions in bytes) and the total
weight of the block. If either of these numbers surpass the limits, no further transactions are
accepted in that block. These limits are defined in
[`MaximumBlockLength`](/rustdocs/master/srml_system/trait.Trait.html#associatedtype.MaximumBlockLength)
and
[`MaximumBlockWeight`](/rustdocs/master/srml_system/trait.Trait.html#associatedtype.MaximumBlockLength).

One important note about these limits is that a portion of them are reserved for the `Operational`
dispatch class. This rule applies to both of the limits and the ratio can be found in
[`AvailableBlockRatio`](/rustdocs/master/srml_system/trait.Trait.html#associatedtype.AvailableBlockRatio).

For example, if the block length limit is 1 megabyte and the ratio is set to 80%, all transactions
can fill the first 800 kilobytes of the block while the last 200 can only be filled by the
operational class.

## Custom Weight Implementation

Implementing a custom weight calculation function can vary in complexity. Using the
`SimpleDispatchInfo` struct provided by Substrate is one of the easiest approaches. Anything more
sophisticated would require more work.

Any weight calculation function must provide two trait implementations:

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

## Frequently Asked Questions

> _Some operations get more expensive as storage grows and shrinks. How can the weight system
> represent that?_

As mentioned, weight should be known _readily_ and _ahead of dispatch_. Peeking the storage and
analyzing it just to determine how much weight might be consumed does not fit this definition quite
well. In this case, the implementation of the dispatch should take the state of the change into
account and manually take extra fees or bonds or take any other measures to make sure that the
transaction is safe.

> _Is the weighting function open to change through governance or any sort of a runtime upgrade?_

Yes, it is part of the runtime itself, hence any runtime upgrade is an upgrade to the weight system
as well. An upgrade can update weight functions if needed.

## Next Steps

### Learn More

- Substrate Recipes contains examples of both [custom
  weights](https://github.com/substrate-developer-hub/recipes/tree/master/kitchen/modules/weights)
  and custom
  [WeightToFee](https://github.com/substrate-developer-hub/recipes/tree/master/kitchen/runtimes/weight-fee-runtime).
- The [srml-example](https://github.com/paritytech/substrate/blob/master/srml/example/src/lib.rs)
  module.

### References

- SRML's [transaction-payment
  module](https://github.com/paritytech/substrate/blob/master/srml/transaction-payment/src/lib.rs).
- Much about weights including the `SimpleDispatchInfo` enum is defined in
  [weights.rs](https://github.com/paritytech/substrate/blob/master/core/sr-primitives/src/weights.rs).

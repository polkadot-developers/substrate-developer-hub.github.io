---
title: Transaction Weight
---

A number of resources in any chain can be limited by definition, such as time, memory and
computation. A mechanism should exist to prevent individual resource-consuming components of the
chain, including but not limited to dispatchable functions, from consume too much of any of the
mentioned resources. This concept is represented in substrate by weights. Furthermore, consuming
some weights could optionally incur some fee.

The fee implications of the weight system is covered in the [Fee Developer document](). This
document mostly covers the concept of weights.

## Transaction Weight

As mentioned, weights can technically refer to, or represent, numerous _limited_ resources. A custom
implementation may use complex structures to demonstrate this. At the time of this writing,
substrate weights are simply a [numeric
value](/rustdocs/master/sr_primitives/weights/type.Weight.html). Each dispatchable function
is given a weight using the `#[weight = $x]` annotation, where `$x` is some function capable of
determining the weight of the dispatch. `$x` can access and examine the arguments of the dispatch.
Nonetheless, a weight calculation should always:
- Be computable __ahead of dispatch__. A block producer, or a validator, should be able to examine
  the weight of a dispatchable before actually deciding to accept it or not.
- While not enforced, calculating the weight should not consume much resource itself. It does not
  make sense to consume similar resources computing a transaction's weight as would be spent while
  executing it. Thus, weight computation should typically be very fast, much faster than
  dispatching.
- Finally, if a transaction's resource consumption varies over a wide range, it should manually
  prevent restrict certain dispatches through any means that makes sense to that particular chain.
  An example of such dispatches in substrate is the call to a smart contract (todo: link when this
  is implemented).

The system module is responsible for accumulating the weight of each block as it gets executed and
making sure that it does not exceed the limit. The transaction-payment module is responsible for
interpreting these weights and deducting fees based upon them.


## Block Weight and Length Limit

Aside from affecting the fees, the main purpose of the weight system is to prevent a block from
being too filled with transactions. The system module, while processing transactions within a block,
accumulates both the total length of the block (sum of encoded transactions in number of bytes) and
the total weight of the blocks. At any points, if these numbers surpass the limits, no further
transactions are accepted to the block. These limits are defined in
[`MaximumBlockLength`](/rustdocs/master/srml_system/trait.Trait.html#associatedtype.MaximumBlockLength)
and
[`MaximumBlockWeight`](/rustdocs/master/srml_system/trait.Trait.html#associatedtype.MaximumBlockLength)
respectively.

One important note about these limits is that a ratio of them are reserved for the `Operational`
dispatch class. This rule applies to both of the limits and the ratio can be found in
[`AvailableBlockRatio`](/rustdocs/master/srml_system/trait.Trait.html#associatedtype.AvailableBlockRatio).
For example, if the block length limit is 1 mega bytes and the ratio is set the 80%, all
transactions can fill the first 800 kilo bytes of the block while the last 200 can only be filled by
the operation class.

## Custom Weight Implementation

Implementation a custom weight calculation function can vary from _very easy_ to _super
complicated_. The `SimpleDispatchInfo` struct provided by substrate is fairly one of the easiest
appraoches. Anything more sophisticated would require a bit more work.

Any weight calculation function must provide two trait implementations:
  - [`WeightData<T>`]: To determine the weight of the dispatch.
  - [`ClassifyDispatch<T>`]: To determine the class of the dispatch. See the enum definition for
    more information on dispatch classes. This struct can then be used with `#[weight]` annotation.

Substrate then bundles then output information of the two traits into [`DispatchInfo`] struct and
provides it by implementing the [`GetDispatchInfo`] for all `Call` variants, and opaque extrinsic
types. This is used internally by the system and executive module; you won't use it most likely.

Both `ClassifyDispatch` and `WeightData` are generic over `T` which gets resolved into the tuple of
all dispatch arguments except for the origin. To demonstrate, we will craft a struct that calculates
the weight as `m * len(args)` where `m` is a given multiplier and `args` is the concatenated tuple
of all dispatch arguments. Furthermore, the dispatch class is Operational if the transaction has
more than 100 bytes of length in arguments.

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

A weight calculator function can also be entirely coerced to the final type of the argument, instead
of defining it as a vague type that is encodable. This is also possible and `srml-example` contains
an example of how to do this. Just note that in that case your code would roughly look like:

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

which means **`CustomWeight` can only be used in conjunction with a dispatch with a particular
signature (u32, u64)**, as opposed to `LenWeight` which can be used with literally anything because
they don't make any strict assumptions about `<T>`.


## Frequent Questions

> _Some operations get more expensive as storage grows and shrinks. How can the weight system
> represent that?_

As mentioned, weight should be known _readily_ and _ahead of dispatch_. Peeking the storage and
analyzing it just to determine how much weight might be consumed does not fit this definition quite
well. In this case the implementation of the dispatch should take the state of the change into
account and manually take extra fees, bonds or take any other measures to make sure that the
transaction is safe.

> _Is the weighting function open to change through governance or any sort of a runtime upgrade?_

Yes, it is part of a runtime itself, hence any runtime upgrade is an upgrade to the weight system as
well. A upgrade can just update weight functions if needed.

## Next Steps

### Learn More

- Substrate Recipes contains examples of both [custom weights](https://github.com/substrate-developer-hub/recipes/tree/master/kitchen/modules/weights) and custom [WeightToFee](https://github.com/substrate-developer-hub/recipes/tree/master/kitchen/runtimes/weight-fee-runtime).
- The [srml-example](https://github.com/paritytech/substrate/blob/master/srml/example/src/lib.rs) module

### References

- SRML's [transaction-payment module](https://github.com/paritytech/substrate/blob/master/srml/transaction-payment/src/lib.rs)
- Much about weights including the `SimpleDispatchInfo` enum is defined in [weights.rs](https://github.com/paritytech/substrate/blob/master/core/sr-primitives/src/weights.rs).

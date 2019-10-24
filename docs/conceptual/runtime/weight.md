---
title: Transaction Weight
---

When transactions are submitted to a blockchain, they are executed by the nodes
in the network. To be economically sustainable, nodes charge a fee to execute a
transaction that must be covered by the submitter of the transaction. The cost
to execute transactions could vary over orders of magnitude, and thus Substrate
provides a flexible mechanism for characterizing the total, presumably minimum,
cost of a transaction in order to be included into a block.

Furthermore, a number of resources in any chain can be limited by definition
such as time, memory and computation. A mechanism should exist to prevent
individual resource-consuming components of the chain, including but not limited
to dispatchables, to consume too much of any of the mentioned resources. This
concept is represented in substrate by weights.

## Transaction Weight

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


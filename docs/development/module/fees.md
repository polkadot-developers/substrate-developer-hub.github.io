---
title: Transaction Weight and Fees
---

When transactions are submitted to a blockchain, they are executed by the nodes in the network. To
be economically sustainable, the cost nodes incur to execute a transaction must be covered by the
submitter of the transaction. The cost to execute transactions could vary over orders of magnitude,
and thus Substrate provides a flexible mechanism for characterizing the total, presumably minimum,
cost of a transaction in order to be included into a block.

Furthermore, a number of resources in any chain can be limited by nature such as time, memory and
computation. A mechanism should exist to prevent individual resource-consuming components of the
chain, including dispatchables, to consume too much of any of the mentioned resources. This concept
is represented in substrate by weights.

## Weights Basics

The fee system is dependent on the weight system. Hence, we will first briefly describe the weights.

As mentioned, weights can technically refer to, or represent, numerous _limited_ resources. However,
at the time of this writing, substrate weights are simply a numeric value (todo: link). Each
dispatchable function is given a weight using the `#[weight = $x]` annotation, where `$x` is some
function capable of determining the weight of the dispatch. `$x` can access and examine the
arguments of the dispatch. Nonetheless, a weight calculation should always:
- Be computable __ahead of dispatch__. A block producer, or a validator, should be able to examine
  the weight of a dispatchable before actually deciding to accept it or not.
- While not enforced, calculating the weight should not consume much resource itself. It does not
  make much sense to spend almost the same amount of time as dispatching a transaction to estimate
  how much weight it will consume. Thus, weight computation should typically be very fast, much
  faster than dispatching. This is analogous to a `poll()` function of the `Future` trait. It really
  doesn't make sense to poll a future if it is going to stall us until the future itself is
  resolved; A sensible `poll` must return fast.
- Finally, if a transaction is very variable in the amount of resources it consumes, it should
  manually prevent restrict certain dispatches through any means that makes sense to that particular
  chain. An example of such dispatches in substrate is the call to a smart contract (todo: link when
  this is implemented).

TODO: a very small paragraph linking to _how to denote the weights_ in your custom runtime either
via using the simple default stuff of substrate or Joshy's example or the `srml/example` also has
some good material. Link and don't write too much.

The system module is responsible for storing the weight of each block and making sure that it does
not exceed the limit (todo: link to section down). The transaction-payment module is responsible for
interpreting these weights and deducting fees based upon them.

## Fees Calculation

The fee to include a transaction consists of three parts:

* `base_fee` a fixed fee that is applied to every single transaction.
* `length_fee` a per-byte fee that is multiplied by the length, in bytes, of the encoded
  transaction.
* `weight_fee` a per-weight-unit fee that is multiplied by the weight of the transaction. As
  mentioned, weight of each dispatch is denoted via the flexible `#[weight]` annotation. Knowing the
  weight, it must be converted to a deductible `balance` type (typically denoted by a module that
  implements `Currency`, `srml-balances` in substrate node). For this, each runtime must define a
  `WeightToFee` type that makes the conversion.

TODO: all three items need linkage to proper parameter type. Generally everything can use better linking.

> Transactors may also include optional tips in transactions to incentivize validators to include
> the transactions faster. Tips will include the chance of inclusion. More details are outside the
> scope of this writing.

based on the above, the final fee of a dispatchable is:

`fee = base_fee + len(tx) * length_fee + WeightToFee(weight)`

## Adjusting Multiplier
The above formula gives a fee which is constant through time. Except for transaction version updates
or minor changes in length due to different arguments, any dispatchable, given the same inputs,
_will always incur the same cost_. This might not always be desirable. Chains might need to increase
or decrease fees based on sime circumstance.  To fulfill this requirement, Substrate provides:
  - a multiplier stored in the system module that is applied to the outcome of the above formula by
    default (needless to say, the default value of which is `One`, meaning that it has no effect)
  - a configurable parameter for a runtime to describe how this multiplier can change.

  TODO more about it should be said + links

## More on Weights: Block Weight and Length Limit
Must cover:
- dispatch class and how it must be implemented (briefly, similar to above just link to a
  tutorial or srml/example)
-  MaximumBlockWeight + Maximum Block Length + how a ratio of it is for operational ones.
- glue it together by linking to CheckWeight

> Here we've presented the Normal variants. There is also `FixedOperational` and its relatives.
> Explain the difference and decide whether this article should be about dispatch info more
> generally.

## Gluing it Together: How Things Work in Substrate
explain:
- the implementation of our targetedMultiplierAdjustment
- our weightToFee
- our SimpleDispatchInfo

Basically until this point all links should be to traits, now we link them to implementations.
Again, a good place to link to an example of how you can ditch our SimpleDispatchInfo and make your
own.

## Examples
O(n) in an integer parameter
link to recipes

## Limitations
Some operations get more expensive as storage grows and shrinks.
  - Yes and a static weight will not help with that. As mentioned, weight should be known rapidly
    ahead of dispatch. In this case the implementation of the dispatch should for example charge
    manually more money etc.
Is the weighting function open to change through governance short of a
    runtime upgrade?
  - Yes, it is part of a runtime upgrade. A upgrade can just update weight functions.

## What is the default weight if left undefined?
I think it's `FreeNormal`
Kian: can remove this and cover in the section `## Gluing it Together: How Things Work in Substrate`


## How should I measure the "weight" of a function?
@kianenigma Can you explain the fundamentals of what you did for
https://docs.google.com/spreadsheets/d/1h0RqncdqiWI4KgxO0z9JIpZEJESXjX_ZCK6LFX6veDo/edit?ts=5d8b02b7#gid=765851977
Kian: I will fill this in later in the section `## Gluing it Together: How Things Work in
Substrate`. But I don't like to imply that everyone should do that, this is merely one example.

Material to link
https://en.wikipedia.org/wiki/Analysis_of_algorithms
https://en.wikipedia.org/wiki/Computational_complexity

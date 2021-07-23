---
title: Transaction Weights
---

Resources available to chains are limited. These resources include memory usage, storage I/O,
computation, transaction/block size and state database size. Substrate makes several 
mechanisms available to manage
access to resources and to prevent individual components of the chain from consuming too much of any
resource. Weights are the mechanism used to manage the _time it takes to validate_ a block.
Generally speaking, this comes from limiting the storage I/O and computation.

> **Note:** Weights are not used to restrict access to other resources, such as storage itself or memory
footprint. Other mechanisms must be used for this.

The amount of weight a block may contain is limited, and optional weight consumption (i.e. weight
that is not required to be deployed as part of the block's initialization or finalization phases nor
used in mandatory inherent extrinsics) will generally be limited through economic measures &mdash; or in
simple terms, through transaction fees. The fee implications of the weight system are covered in the
[Transaction Fees document](../runtime/fees).

Substrate defines one unit of weight as one picosecond of execution time, that is **10<sup>12</sup>
weight = 1 second**, or 1,000 weight = 1 nanosecond, on fixed reference hardware (Intel Core
i7-7700K CPU with 64GB of RAM and an NVMe SSD).

Benchmarking on reference hardware makes
weights comparable across runtimes, which allows composability of software components from different
sources. In order to tune a runtime for different validator hardware assumptions, you can set a
different maximum block weight. For example, in order to allow validators to participate that are
only half as fast as the reference machine, the maximum block weight should be half of the default,
keeping the default block time.

The maximum block weight should be equivalent to one-third of the target block time, allocating one
third for block construction, one third for network propagation, and one third for import and
verification. Doubling the block time would allow a doubling of the maximum block weight. These
tuning options give runtime developers a way to make the optimal transaction per second vs. hardware
requirement trade-offs for their use case. These trade-offs can be tuned with runtime updates to
keep up with hardware and software improvements.

## Weight Fundamentals

Weights represent the _limited_ time that your blockchain has to validate a block. This includes
computational cycles, and storage I/O. A custom implementation may use complex structures to express
this. Substrate weights are simply a
[numeric value](https://substrate.dev/rustdocs/latest/frame_support/weights/type.Weight.html).

A weight calculation should always:

- Be computable **ahead of dispatch**. A block producer should be able to examine the weight of a
  dispatchable before actually deciding to accept it or not.
- Consume few resources itself. It does not make sense to consume similar resources computing a
  transaction's weight as would be spent to execute it. Thus, weight computation should be much
  lighter than dispatch.
- Be able to determine resources used without consulting on-chain state. Weights are good at
  representing _fixed_ measurements or measurements based solely on the parameters of the
  dispatchable function where no expensive I/O is necessary. Weights are not so useful when the cost
  is dependent on the chain-state.

In the case that the weight of a dispatchable is heavily dependent on chain-state case, two options
are available:

- Determine or introduce a forced upper limit to the amount of weight a dispatchable could possibly
  take. If the difference between the enforced upper limit and the least possible amount of weight a
  dispatchable could take is small, then it can just be assumed to always be at the upper limit of
  the weight without consulting the state. If the difference is too great, however, then the
  economic cost of making lesser transactions might be too great which will warp the incentives and
  create inefficiencies in throughput.
- Require the effective weight (or precursors that can be used to efficiently compute it) be passed
  in as parameters to the dispatch. The weight charged should be based on these parameters but also
  cover the amount of time it takes to verify them during dispatch. Verification must take place to
  ensure the weighing parameters correspond accurately to on-chain state and if they don't then the
  operation should gracefully error.

### Weight Factors

Several factors impact execution time, and therefore weight calculation. One large contributor is
the number of database accesses that are performed by a dispatchable. Because the cost of a database
access is greatly dependent on the database backend and storage hardware, the weight calculations
are parameterized over the weight costs of database reads and writes. These costs are determined by
benchmarking each available database backend on some reference hardware. This allows switching
database backends without changing all weight calculations.

In addition to only using constants for the pre-dispatch weight calculation, the developer has the
ability to factor in the input parameters of the given dispatchable. This can be useful when the
execution time depends on, for example, the length of one parameter. It is important that these
calculations do not entail any meaningful work themselves. The pre-dispatch maximum weight should be
trivially computable from the input arguments with some basic arithmetic.

The [System pallet](https://substrate.dev/rustdocs/latest/frame_system/pallet/index.html) is
responsible for accumulating the weight of each block as it gets executed and making sure that it
does not exceed the limit. The
[Transaction Payment pallet](https://substrate.dev/rustdocs/latest/pallet_transaction_payment/index.html)
is responsible for interpreting these weights and deducting fees based upon them. The weighing
function is part of the runtime so it can be upgraded if needed.

## Post Dispatch Weight Correction

There are cases where the actual weight of a dispatchable is not trivially computable from its
inputs. For example, the weight could depend on the logic path of the dispatchable. Without any
means of correcting the weight after dispatch, we would constantly overestimate and subsequently
overcharge for those dispatchables as we must assume the worst case ahead of dispatch for the chain
to be safe.

The post-dispatch weight correction allows any dispatchable to return its _actual weight_ after it
was executed. This weight must be less than or equal to the pre-dispatch worst case weight. For a
user to be allowed to include an extrinsic, they still must be able to pay for the maximum weight,
even though the final payment will be based on the actual weight.

## Block Weight and Length Limit

Aside from affecting fees, the main purpose of the weight system is to prevent a block from being
filled with transactions that would take too long to execute. While processing transactions within a
block, the System pallet accumulates both the total length of the block (sum of encoded transactions
in bytes) and the total weight of the block. If either of these numbers surpass the limits, no
further transactions are accepted in that block. These limits are defined in
[`MaximumBlockLength`](https://substrate.dev/rustdocs/latest/frame_system/limits/struct.BlockLength.html)
and
[`MaximumBlockWeight`](https://substrate.dev/rustdocs/latest/frame_system/limits/struct.BlockWeights.html).

One important note about these limits is that a portion of them are reserved for the `Operational`
dispatch class. This rule applies to both of the limits and the ratio can be found in
[`AvailableBlockRatio`](https://substrate.dev/rustdocs/latest/frame_system/limits/struct.BlockLength.html#method.max_with_normal_ratio).

For example, if the block length limit is 1 megabyte and the ratio is set to 80%, all transactions
can fill the first 800 kilobytes of the block while the last 200 can only be filled by the
operational class.

There is also a `Mandatory` dispatch class that can be used to ensure an extrinsic is always
included in a block regardless of its impact on block weight. Please refer to the article on 
[Transaction Fees](../runtime/fees) to learn more about the different dispatch classes and
when to use them.

### Learn More

- [Example](https://github.com/paritytech/substrate/blob/master/frame/example/src/lib.rs)
  pallet.
- [Transaction Payment pallet](https://github.com/paritytech/substrate/blob/master/frame/transaction-payment/src/lib.rs)
- [Weights](https://github.com/paritytech/substrate/blob/master/frame/support/src/weights.rs)

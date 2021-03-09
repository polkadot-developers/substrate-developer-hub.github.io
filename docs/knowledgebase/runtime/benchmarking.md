---
title: Runtime Benchmarking
---

## What Is Runtime Benchmarking?

In Substrate, each block must be produced within a certain time limit to keep the blockchain healthy
and functional. This is the target blocktime. So in each block production phase, Substrate can only
take so many extrinsic calls and compute for their results. We use weight to represent how much
computations are needed for a runtime extrinsic.

Some extrinsics have more computation and therefore have a larger weight. If this extrinsic is included, then
there is less capacity left to include other extrinsics in the block. This is further explained in
the [Transaction Weight chapter](../learn-substrate/weight).

In Substrate, **10^12 Weight = 1 Second**, and i.e 1,000 weight = 1 nanosecond, measured on a
referenced hardware<sup>[#1](#footnote-ref-hardware)</sup>.

So we want to have an estimate of how much computation it takes before actually running the
extrinsics, and this will also affect how much transaction fee we charge beforehand. If the
extrinsic turns out to run with less computation, some of the estimated weight can be returned, and
eventually causing the transaction fee returned back to user. This is further explained in the
[Transaction Fees chapter](./fees).

Now the question is how do we determine the computation time and weight of our extrinsics? There
might also be a relationship between the time and the input or the existing state (the current
database storage) when running the extrinsic. As any computer scientist can tell, we are getting
into a time complexity analysis of the function.

This is where Substrate Runtime Benchmarking comes in. It has a set of toolchains to help determine
the computation time and thus the transaction weight of a runtime extrinsic. It runs the benchmarked
extrinsic over and over with varying inputs and the computation time is measured. At the end, it:

- returns the raw data of these measured time with these varying input and how many database read
  write has been performed.

- deduces the coefficient on how the computation time changes with respect to the input using linear
  regression, assuming a linear relationship. It is up to the runtime developer to review the raw
  data and check if it is indeed a linear relationship. If not, either optimize the extrinsic for
  its time complexity or adjust the weight function accordingly.

- outputs a rust file with these weight functions that can be easily integrated in our runtime.

## Why Benchmark a Runtime Pallet?

Denial-of-service (DoS) is a common attack vector for distributed systems, including blockchain
networks. A simple example would be for any user repeatedly requesting a function that involve
intensive computation. An effective counter-measure is that such a request would bear a certain cost
to the user. For a fair system, the user cost should reflect the computation and storage cost
incurred to the system. To encourage users to use such system, we want to estimate this cost
relatively accurately and not overcharging users.

Now with Substrate benchmarking toolchain, runtime developers can estimate the weight of their
runtime extrinsics which translate to the transaction fee charged to the runtime users. So it is
critical to benchmark our runtime extrinsics to measure how the extrinsic computation changes with
repect to its input and set the proper weight functions for these extrinsics. Setting a proper
weight function that reflects accurately on the underlying computation and storage is an important
security safeguard in Substrate.

## Features of Substrate Benchamrking Toolchain

- You can configure multiple input variables to be used when benchmarking an extrinsic. For each
  input, you can configure the varying range and the number of times to repeat to avoid outlier
  effect.

- The toolchain leverages on rust macro and have a flexible structure of:

  1. Setting up the initial state before running the benchmark
  2. Measuring the execution time and database storage read write
  3. Finally verifying the result

    ```rust
    benchmarks! {
      extrinsic1_name {
        /* setup initial state */
      }: {
        /* the code to be benchmarked */
      }
      verify {
        /* verifying final state */
      }
    }
    ```

  The full syntax and functionality can be seen in the [`benchmarks!` macro API documentation](https://substrate.dev/rustdocs/v3.0.0/frame_benchmarking/macro.benchmarks.html).

- At the end, it deduces a multi-variable linear equation for the weight function on how the
  execution time changes with respect to the change of your specified variables.

- It generates a `WeightInfo` structure in Rust that can either be further tweaked, or easily
  integrated into your runtime.

## How to Benchmark?

We will outline the the benchmarking procedure here, listing key commands and paramters used, or
section of code to be written using [Substrate
`pallet-example`](https://github.com/paritytech/substrate/tree/master/frame/example) as an example.
To see a step-by-step detail procedure, please refer to our [Tutorial on Runtime
Benchmarking](../../tutorials/runtime-benchmarking).

1. In [the pallet
   `Cargo.toml`](https://github.com/paritytech/substrate/blob/master/frame/example/Cargo.toml), add
   the dependent benchmarking crates.

    ```toml
    # ...

    [dependencies]
    # -- snip --
    frame-benchmarking = { version = "3.1.0", default-features = false, path = "../benchmarking", optional = true }

    [features]
    # -- snip --
    runtime-benchmarks = ["frame-benchmarking"]
    ```

2. Start writing our benchmarking code. The code can be placed either in a `mod` module inside the
   `src/lib.rs`, or be put in a separate file and include the module back in `src/lib.rs`. We will
   use the first approach in the following to create the basic structure.

    ```rust
    #[cfg(feature = "runtime-benchmarks")]
    mod benchmarking {
      use super::*;
      use frame_benchmarking::{benchmarks, account, impl_benchmark_test_suite};
      use frame_system::RawOrigin;

      benchmarks!{
        // Individual benchmark cases here
      }

      impl_benchmark_test_suite!(
        Pallet,
        crate::tests::new_test_ext(),
        crate::tests::Test,
      );
    }
    ```

3. Each benchmark case has three sections, setup section, execution section, and optionally a
   verification section at the end.

    ```rust
    benchmarks!{
      extrinsic_name {
        // setup initial state
      }: {
        // running the benchmark
      }
      verify {
        // Using assert statements to verify the result, or check certain on-chain event has been emitted.
      }
    }
    ```

    An example in
    [`example/src/lib.rs`](https://github.com/paritytech/substrate/blob/master/frame/example/src/lib.rs):

    ```rust
    // This will measure the execution time of `set_dummy` for b in [1..1000] range.
    set_dummy {
      let b in 1 .. 1000;
    }: {
      set_dummy(RawOrigin::Root, b.into());
    }
    ```

    The name of the benchmark case is `set_dummy`. Here `b` is the input that passed into
    the extrinsic `set_dummy` that we believe will affect the extrinsic execution time. `b` will be
    varied from 1 to 1,000 and run repeatedly for each value of `b` according to the arguments we
    passed when running the benchmark command. We will get back to this in the following.

    The function `set_dummy` is called in the execution section, and we do not verify the result at
    the end.

    You will also see code like this:

    ```rust
    accumulate_dummy {
      let b in 1 .. 1000;
      let caller = account("caller", 0, 0);
    }: _(RawOrigin::Signed(caller), b.into())
    ```

    This is when the execution section is just a one-line code that call the extrinsic with the same
    name as the benchmarking case name. Our `benchmark!` macro is smart enough to know that!

4.
    ```rust
    benchmarks! {
      // -- snip
      impl_benchmark_test_suite!(Pallet, crate::tests::new_test_ext(),
        crate::tests::Test);
    }
    ```

    At the last line in the `benchmarks!` macro, `impl_benchmark_test_suite!` takes three input: the
    module name, the function that generates a test genesis storage (i.e. `new_text_ext()`), and a test
    runtime, and expand them into testing code. The test runtime can often be the same one used for testing.

    Ultimately benchmarking code is expanded as testing code, so it takes the code you write in
    testing (you do, right?) to build up [the mock
    runtime](https://substrate.dev/docs/en/knowledgebase/runtime/tests#mock-runtime-environment). If
    you are not familiar with how to write pallet test cases, please refer to our [Runtime Tests
    chapter](tests).

5. With all the code completed on the pallet side, you need to add code in the node runtime. First
   add the necessary dependencies in [the runtime
   `Cargo.toml`](https://github.com/paritytech/substrate/blob/master/bin/node/runtime/Cargo.toml).

    ```toml
    [dependencies]
    # -- snip --
    pallet-you-named = { version = ..., default-features = false, path = ... }

    [features]
    std = [
      # -- snip --
      "pallet-you-named/std"
    ]
    runtime-benchmarks = [
      # -- snip --
      "pallet-you-named/runtime-benchmarks"
    ]
    ```

    Then in the node runtime, as usual, have your runtime implemements the pallet configurable trait
    and add the pallet in `construct_runtime!`. For details, refer to [Add a Pallet to Your Runtime
    Tutorial](../../tutorials/add-a-pallet). Then our runtime also implements
    `frame_benchmarking::Benchmark` trait under a feature flag and implement the
    `dispatch_benchmark` method, as [shown in the
    file](https://github.com/paritytech/substrate/blob/v3.0.0/bin/node/runtime/src/lib.rs#L1328).

    ```rust
    #[cfg(feature = "runtime-benchmarks")]
    impl frame_benchmarking::Benchmark<Block> for Runtime {
      fn dispatch_benchmark(
        config: frame_benchmarking::BenchmarkConfig
      ) -> Result<Vec<frame_benchmarking::BenchmarkBatch>, sp_runtime::RuntimeString> {
        // -- snip --

        let whitelist: Vec<TrackedStorageKey> = vec![
          // whitelisting a set of storage keys here
        ];

        let mut batches = Vec::<BenchmarkBatch>::new();
        let params = (&config, &whitelist);

        // Adding the pallet you will perform thee benchmarking
        add_benchmark!(params, batches, pallet_you_named, YourPallet);

        // -- snip --

        if batches.is_empty() { return Err("Benchmark not found for this pallet.".into()) }
        Ok(batches)
      }
    }
    ```

    There seems to be a lot of code, but we are mainly setting up an environment that all
    benchmarking code will run. For example, we pass in a set of storage keys that should not be counted
    as pallet-specific database read-write, because these read-write are issued from the Substrate
    system (`frame-system`).

    We add the benchmark code with the `add_benchmark!` macro, passing the parameters we made at the
    beginning, and batching them up together in the `batches` variable.

    Once this is done, we also need to configure the node side to include our runtime to have a
    feature section for `runtime-benchmarks`. We are not going into the detail steps here. For those
    interested, please refer to the [Tutorial on Runtime
    Benchmarking](../../tutorials/runtime-benchmarking).

    Now we are ready to compile the project and run the benchmark.

6. We need to compile our Substrate node that includes the runtime with benchmarking code. We cannot
   run `cargo` with `--features` flag in the root directory so we need to go into [the directory of
   the node](https://github.com/paritytech/substrate/tree/master/bin/node/cli) and run the `cargo`
   command.

    ```
    cd substrate/bin/node/cli
    # We build the release version so the benchmarking result is comparable to how it is run in production.

    cargo build --release --features runtime-benchmarks
    ```

    Once this is done, we can run the `benchmark` subcommand.

    ```
    cd ../../../
    target/release/substrate benchmark --help
    ```

    This will output the help instructions for the subcommand.

    Now to run benchmarking for all extrinsics in `pallet-example` we will run the following
    command.

    ```bash
    ./target/release/substrate benchmark \
        --chain dev \               # Configurable Chain Spec
        --execution wasm \          # Always test with Wasm
        --wasm-execution compiled \ # Always used `wasm-time`
        --pallet pallet_example \   # Select the pallet
        --extrinsic '\*' \          # Select the benchmark case name, using '*' for all
        --steps 20 \                # Number of steps across component ranges
        --repeat 10 \               # Number of times we repeat a benchmark
        --raw \                     # Optionally output raw benchmark data to stdout
        --output ./                 # Output results into a Rust file
    ```

    - `chain` specifies the chain-spec we will use
    - `execution` and `wasm-execution` specify we are benchmarking the compiled wasm code (vs the
      native code as an alternative)
    - `pallet` and `extrinsic` specify which pallet and extrinsics we are benchmarking. With the
      above arguments we are benchmarking all extrinsics of `pallet_example`.
    - `steps` and `repeat` means how many steps will be taken to walk through each variable range,
      and how many time the execution state will be repeated.

        ![multi-variables-regression](assets/runtime/benchmarking/multi-variables-regression.png)

        Let's take `accumulate_dummy` benchmark case as an example.

        ```rust
        accumulate_dummy {
          let b in 1 .. 1000;
          let caller = account("caller", 0, 0);
        }: _ (RawOrigin::Signed(caller), b.into())
        ```

        With `--steps 20 --repeat 10` in the benchmark input arguments, `b` will walk 20 steps to
        reach 1,000, so `b` will start from 1 and increment by about 50. For each value of `b`, it
        will be repeated 10 times and the extrinsic execution time be recorded.

    - `raw` indicates whether to output all the runs with different input values and their
      respective execution time. You will want to set this flag during development to check if the
      execution time match your expectation as inputs vary.

    - `output` indicates where to save the `WeightInfo` implementation Rust file.

    Here we explain enough so you know what is going on. The details and all possible values of each
    parmeter can be seen with `benchmark --help`.

## Benchmarking Output

After running the `benchmark` command above, we have two outputs. The raw data with benchmarked time
and the auto-generated Rust file of `WeightInfo` implementation.

### Raw Data

The first output is the raw data recording how much time is spent on running the execution state
when varying the input variables. At the end for each variable, the coefficient, assuming linear
relationship, between the execution time with respect to change in the variable is determined.

This is a snippet of the output:

```csv
Pallet: "pallet_example", Extrinsic: "accumulate_dummy", Lowest values: [], Highest values: [], Steps: [10], Repeat: 5
b,extrinsic_time,storage_root_time,reads,repeat_reads,writes,repeat_writes
1,1231926,162640,1,4,1,2
1,1245146,128021,1,4,1,2
1,1238746,126051,1,4,1,2
1,1206004,126391,1,4,1,2
1,1212564,127941,1,4,1,2
100,1257646,129750,1,4,1,2
100,1232476,125780,1,4,1,2
100,1215466,128310,1,4,1,2
100,1205835,129070,1,4,1,2
...
991,1208294,125820,1,4,1,2
991,1209305,126921,1,4,1,2
991,1203275,125031,1,4,1,2
991,1234855,124190,1,4,1,2
991,1337136,125060,1,4,1,2

Median Slopes Analysis
========
-- Extrinsic Time --

Model:
Time ~=     1231
    + b        0
              µs

Reads = 1 + (0 * b)
Writes = 1 + (0 * b)

Min Squares Analysis
========
-- Extrinsic Time --

Data points distribution:
    b   mean µs  sigma µs       %
    1      1230     12.61    1.0%
  100      1230     16.53    1.3%
  199      1227     12.88    1.0%
  298      1215     12.94    1.0%
  397      1239     19.83    1.6%
  496      1234     18.51    1.5%
  595      1228     7.167    0.5%
  694      1233     13.51    1.0%
  793      1218     9.876    0.8%
  892      1225     14.15    1.1%
  991      1220     11.63    0.9%

Quality and confidence:
param     error
b         0.006

Model:
Time ~=     1230
    + b        0
              µs

Reads = 1 + (0 * b)
Writes = 1 + (0 * b)

// -- snipped on the second benchmark case
```

With the median slopes analysis, this is the weight function:

```
1231 µs + (0 * b) +
  [1 + (0 * b)] * db read time +
  [1 + (0 * b)] * db write time
```

We separate the db/storage read and write out because they are particularly expensive and their
respective operation time will be retrieved from the runtime. We just need to measure how many db
read write are performed with respect to the change of `b`.

The benchmark result is telling us that it will always perform 1 db read and 1 db write no matter
how `b` changes.

The benchmark library gives us both a median slope analysis; that the execution time of a particular
`b` value is taken as the median value of the repeated runs, and a [min. square
analysis](https://en.wikipedia.org/wiki/Least_squares) that is better explained in a statistics
primer.

You can also derive your own coefficients given you have the raw data on each run, say maybe you
know the computation time will not be a linear but an *O(nlogn)* relationship with the input
variable. So you need to determine the coefficient differently.

### Auto-generated `WeightInfo` Implementation

The second output is an autogenerated `WeightInfo` implementation. This file defines weight
functions of benchmarked extrinsics with the computed coefficient above. We can directly integrated
this file in your extrinsics weight function or further customize them if so desired. The
auto-generated implementation is designed to make end-to-end benchmark automation easy.

To use this file, we first define a `WeightInfo` trait in
[`frame/example/src/lib.rs`](https://github.com/paritytech/substrate/blob/master/frame/example/src/lib.rs):

```rust
pub trait WeightInfo {
  fn accumulate_dummy(_b: u32, ) -> Weight;
  fn set_dummy(_b: u32, ) -> Weight;
  fn another_set_dummy(b: u32, ) -> Weight;
  fn sort_vector(x: u32, ) -> Weight;
}
```

Here, associated function `set_dummy` take a parameter. This is because we have the line
`let b in 1 .. 1000;` in our `set_dummy` benchmarking function, indicating the execution time
likely be affected by this parameter.

The generated file implements these associated functions. To integrate them, we can copy the
generated file into the directory where `lib.rs` is located and named it as `weights.rs`.

In the `frame/example/src/lib.rs`, we have:

```rust
// importing the `weights.rs` here
pub mod weights;

pub mod pallet {
  // -- snip --
  #[pallet::call]
  impl<T: Config> Pallet<T> {
    #[pallet::weight(
      T::WeightInfo::set_dummy((*new_value).saturated_into())
    )]
    pub(super) fn set_dummy(
      origin: OriginFor<T>,
      #[pallet::compact] new_value: T::Balance,
    ) -> DispatchResultWithPostInfo {
      // -- snip

      // All good, no refund.
      Ok(().into())
    }
  }
}
```

For each extrinsic, we add an attribute macro `pallet::weight` and pass in the weight implementation
function with the same name as the extrinsic and variables that affect the weight. We can pass
extrinsic parameters as weight function inputs to estimated the final weight.

## Best Practice and Common Patterns

There are a few best practices for writing extrinsics in order to avoid any surprise on your
extrinsics computation time and benchmarking.

### Initial Weight Calculation Must be Lightweight

Extrinsic weight function will be called, probably multiple times, when an extrinsic is going to be
called. So the weight function must be lightweight and should not perform any storage read/write, an
expensive operation.

### Set Bounds and Assume the Worst

If the extrinsic computation time depends on existing storage value, then set a maximum bound on
those storages and assume the worst case. Later on, weight can be returned in the extrinsic when it
is returned.

### Keep Extrinsics Simple

Try to keep extrinsic simple and to perform only one function. Sometimes it maybe better to separate
the complex logic into multiple extrinsic calls and have a front-end abstracting these extrinsic
interaction away to provide a clean and friendly user experience.

### Separate Benchmarks per Logical Path and Use the Worst Case

If your extrinsic has multiple logical paths with signficantly different execution time, separate
these paths in multiple benchmarking cases and measure them. In the actual pallet weight macro above
the extrinsics, you could combine them with a `max` function, e.g.

```rust
#[pallet::weight(
  <T::WeightInfo::path_a()
    .max(T::WeightInfo::path_b())
    .max(T::WeightInfo::path_c())>
)]
```

Note the weight returned here is more as the worst case of the weight estimate. You can then decide
if you want to return some weight value back at the end of the extrinsic once you what computation
have happened. Otherwise it will be always overcharging users for calling this extrinsic.

### Minimize Usage of `on_finalize`, and trasition logic to `on_initialize`

Substrate provides runtime developers with multiple hooks when writing their own runtime, with
`on_initialize` and `on_finalize` being two of them. As `on_finalize` is the last thing happening in
a block, variable weight needs in `on_finalize` can easily lead to overweight block and should be
avoided.

![on-finalize-blocktime.png](assets/runtime/benchmarking/on-finalize-blocktime.png)

If possible, move the logic to `on_intialize` hook that happens at the beginning of the block. Then
the number of extrinsics to be included in the block can be adjusted accordingly. Another trick is
to put the weight of `on_finalize` on to `on_initialize` or the extrinsic itself. This leads to
another tip of trying to keep the pallet hook execution in constant time for only set up and clean
up, but not doing fancy computation.

## Reference

  - [Substrate Seminar: Benchmarking Your Substrate
    Pallet](https://www.youtube.com/watch?v=Qa6sTyUqgek)

  - [Tutorial: Runtime Benchmarking](../../tutorials/runtime-benchmarking)

## Footnotes

  1. <span id="footnote-ref-hardware">The</span> reference hardware has a spec of Intel Core
  i7-7700K CPU with 64GB of RAM and an NVMe SSD.

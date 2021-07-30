---
title: Benchmarking
---

## What Is Runtime Benchmarking?

The default Substrate block production systems produce blocks at consistent intervals. This is the
known as the target block time. Given this requirement, Substrate based blockchains are only be able
to execute a limited number of extrinsics per block. The time it takes to execute an extrinsic may
vary based on the computational complexity, storage complexity, hardware used, and many other
factors. We use generic measurement called **weight** to represent how many extrinsics can fit into
one block. This is further explained in the [transaction weight section](../learn-substrate/weight).

In Substrate, **10^12 Weight = 1 Second**, and i.e 1,000 weight = 1 nanosecond, measured on a
specific reference hardware<sup>[[1]](#footnote-ref-hardware)</sup>.

Substrate does not use a mechanism similar to "gas metering" for extrinsic measurement due to the
large overhead such a process would introduce. Instead, Substrate expects benchmarking to provide an
approximate maximum for the worst case scenario of executing an extrinsic. Substrate will charge the
user assuming this worst case scenario path was taken, and if the extrinsic turns out needing less
resources, some of the estimated weight and fees can be returned. This is further explained in the
[Transaction Fees chapter](./fees).

So how do we determine the worst case scenario computation time and weight of our extrinsics?

This is where Substrate Runtime Benchmarking comes in. It has a set of tools to help determine the
weight of a runtime extrinsic. It execute the extrinsics in a pallet multiple times within the
runtime environment, and keeps track of the execution time.

In total, it:

- Sets up and executes extrinsics from your pallets.

- Captures the raw data of these benchmarks over with these varying inputs, including how many
  database reads and writes have been performed.

- Uses linear regression analysis to determine the relationship between computation time and the
  extrinsic input.

- Outputs a rust file with ready to use weight functions that can be easily integrated in your
  runtime.

## Why Benchmark a Runtime Pallet?

Denial-of-service (DoS) is a common attack vector for distributed systems, including blockchain
networks. A simple example of such an attack would be for a user to repeatedly execute an extrinsic
that involve intensive computation. To prevent users from spamming the network, we charge fee to the
user for making that call. The cost of the call should reflect the computation and storage cost
incurred to the system, to the more complex the call, the more we charge. However, we still want to
encourage users to use our blockchain system, so we also want this estimate cost to be relatively
accurate so we don't charge users more than necessary.

With the Substrate benchmarking framework, runtime developers can estimate the weight of their
extrinsics and charge an appropriate transaction fee to the end users. So it is critical to
benchmark our runtime extrinsics to measure how the extrinsic computation changes with respect to
its input and set the proper weight functions for these extrinsics. Setting a proper weight function
that reflects accurately on the underlying computation and storage is an important security
safeguard in Substrate.

## How to Benchmark?

The benchmarking framework uses Rust macros to help users easily integrate them into their runtime.
A Substrate benchmark will look something like this:

```rust
benchmarks! {
  benchmark_name {
    /* setup initial state */
  }: {
    /* the code to be benchmarked */
  } verify {
    /* verifying final state */
  }
}
```

You can see that the benchmark macro:

  1. Sets up the initial state before running the benchmark.
  2. Measures the execution time, along with the number of and database reads and writes.
  3. Verifies the final state of the runtime, ensuring that the benchmark executed as expected.

You can configure your benchmark to run over different varying inputs. For each input, you can
configure the range of those variables, and use them within the benchmark setup or execution logic.

The full syntax and functionality can be seen in the [`benchmarks!` macro API
documentation](https://substrate.dev/rustdocs/latest/frame_benchmarking/macro.benchmarks.html).

### Adding Benchmarking to Your Pallet

1. In [the pallet's
   `Cargo.toml`](https://github.com/paritytech/substrate/blob/master/frame/example/Cargo.toml), add
   the `frame-benchmarking` crate and the `runtime-benchmarks` feature.

    ```toml
    [dependencies]
    # -- snip --
    frame-benchmarking = { version = "3.1.0", default-features = false, path = "../benchmarking", optional = true }

    [features]
    # -- snip --
    runtime-benchmarks = ["frame-benchmarking"]
    ```

2. Create a new sub-module for your benchmarks within your pallet, and create a basic structure
   similar to this:

    ```rust
    #[cfg(feature = "runtime-benchmarks")]
    mod benchmarking {
      use crate::{*, Module as PalletModule};
      use frame_benchmarking::{benchmarks, account, impl_benchmark_test_suite};
      use frame_system::RawOrigin;

      benchmarks!{
        // Individual benchmarks are placed here
      }
    }
    ```

3. Each benchmark case has up to three sections: a setup section, an execution section, and
   optionally a verification section at the end.

    ```rust
    benchmarks!{
      benchmark_name {
        /* setup initial state */
      }: {
        /* the code to be benchmarked */
      }
      verify {
        /* verifying final state */
      }
    }
    ```

    An extremely basic example of a benchmark can be found in the Example pallet:
    [`example/src/lib.rs`](https://github.com/paritytech/substrate/blob/master/frame/example/src/lib.rs):

    ```rust
    // This will measure the execution time of `set_dummy` for b in [1..1000] range.
    set_dummy {
      let b in 1 .. 1000;
    }: set_dummy(RawOrigin::Root, b.into());
    ```

    The name of the benchmark is `set_dummy`. Here `b` is a variable input that passed into the
    extrinsic `set_dummy` which may affect the extrinsic execution time. `b` will be varied between
    1 to 1,000, where we will repeat and measure the benchmark at the different values.

    The extrinsic `set_dummy` is called in the execution section, and we do not verify the result at
    the end.

    You will also see code like this:

    ```rust
    accumulate_dummy {
      let b in 1 .. 1000;
      let caller = account("caller", 0, 0);
    }: _(RawOrigin::Signed(caller), b.into())
    ```

    Here you can see we can replace the extrinsic name with `_` when it matches the name of the
    benchmark.

4. Once you have written your benchmarks, you should make sure they execute properly by testing
   them. You can add this macro at the bottom of your module:

    ```rust
    impl_benchmark_test_suite!(
      PalletModule,
      crate::tests::new_test_ext(),
      crate::tests::Test,
    );
    ```

    The `impl_benchmark_test_suite!` takes three input: the Module struct generated by your pallet,
    a function that generates a test genesis storage (i.e. `new_text_ext()`), and a full runtime
    struct. These things you should get from your normal pallet unit tests.

    We will use your test environment and execute the benchmarks similar to how they would execute
    when actually running the benchmarks. If everything passes, then it is likely that things will
    work when you actually run your benchmarks!

### Add Benchmarking to Your Runtime

With all the code completed on the pallet side, you need to also enable your full runtime to allow
benchmarking.

1. Update your runtime `Cargo.toml` file to include the `runtime-benchmarking` features:

    ```toml
    [dependencies]
    # -- snip --
    pallet-you-created = { version = ..., default-features = false, path = ... }

    [features]
    std = [
      # -- snip --
      "pallet-you-created/std"
    ]
    runtime-benchmarks = [
      # -- snip --
      "pallet-you-created/runtime-benchmarks"
    ]
    ```

2. Add your new pallet to your runtime just as you would any other pallet. If you need more details
   check out our tutorial to [Add a Pallet to Your Runtime Tutorial](../../tutorials/add-a-pallet).

3. Then, in addition to your normal runtime configuration, you also need to update the benchmarking
   section of your runtime:

    ```rust
    #[cfg(feature = "runtime-benchmarks")]
    impl frame_benchmarking::Benchmark<Block> for Runtime {
      fn dispatch_benchmark(
        config: frame_benchmarking::BenchmarkConfig
      ) -> Result<Vec<frame_benchmarking::BenchmarkBatch>, sp_runtime::RuntimeString> {
        let whitelist: Vec<TrackedStorageKey> = vec![
          // you can whitelist any storage keys you do not want to track here
        ];

        let mut batches = Vec::<BenchmarkBatch>::new();
        let params = (&config, &whitelist);

        // Adding the pallet you will perform thee benchmarking
        add_benchmark!(params, batches, pallet_you_crated, YourPallet);

        // -- snip --

        if batches.is_empty() { return Err("Benchmark not found for this pallet.".into()) }
        Ok(batches)
      }
    }
    ```

    This code should already exist within your runtime assuming you use any of our starting
    templates. There seems to be a lot of code, but we are mainly just setting up the environment
    where your benchmarking code will run.

4. To add our new benchmarks, we simply add a new line with the `add_benchmark!` macro.

Now we are ready to compile the project and run the benchmark!

### Running Your Benchmarks

Benchmarking code is not included with your runtime by default since it would bloat the size of your
Wasm. Instead, we need to compile our Substrate node with a feature flag that includes the runtime
benchmarking code.

Depending on your project, you may need to navigate to your node's crate to be able to compile for
benchmarks, since virtual workspaces in Rust do not support the `--features` flag. For example, when
using the main Substrate repository, you need to navigate to the `/node/cli/` folder:

```bash
cd substrate/bin/node/cli
```

Then you can build your project with the benchmarks enabled:

```bash
cargo build --release --features runtime-benchmarks
```

Once this is done, you should be able to run the `benchmark` subcommand.

```bash
cd ../../../
target/release/substrate benchmark --help
```

The Benchmarking CLI has a lot of options which can help you automate your benchmarking. A minimal
command to execute benchmarks for a pallet will look like this:

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
- `execution` and `wasm-execution` specify we are benchmarking the compiled wasm code (vs the native
  code as an alternative)
- `pallet` and `extrinsic` specify which pallet and extrinsics we are benchmarking. With the above
  arguments we are benchmarking all extrinsics of `pallet_example`.
- `steps` and `repeat` means how many steps will be taken to walk through each variable range, and
  how many time the execution state will be repeated.

Let's take `accumulate_dummy` benchmark case as an example.

```rust
accumulate_dummy {
  let b in 1 .. 1000;
  let caller = account("caller", 0, 0);
}: _ (RawOrigin::Signed(caller), b.into())
```

With `--steps 20 --repeat 10` in the benchmark input arguments, `b` will walk 20 steps to reach
1,000, so `b` will start from 1 and increment by about 50. For each value of `b`, we will execute
the benchmark 10 times and record the benchmark information.

![multi-variables-regression](assets/runtime/benchmarking/multi-variables-regression.png)

A more complete command that we use for the Substrate benchmarking output looks like this:

```bash
cargo run --release
  --features=runtime-benchmarks
  --manifest-path=bin/node/cli/Cargo.toml
  --
  benchmark
  --chain=dev
  --steps=50
  --repeat=20
  --pallet=frame_system
  --extrinsic="*"
  --execution=wasm
  --wasm-execution=compiled
  --heap-pages=4096
  --output=./frame/system/src/weights.rs
  --template=./.maintain/frame-weight-template.hbs
```

However, the exact command you run will depend on your needs.

> **Notes**
>
> Another argument introduced above is `--template`. We allow you to specify your own weight
> template file and the benchmarking toolchain will fill in the exact numbers from the measured
> result. This enables automating weight generation in your desired code format and integrates this
> in your CI process.
>
> The template is in [rust handlebars](https://docs.rs/handlebars/) format.

### Analyzing and Outputting Your Benchmarks

After running the `benchmark` command above, we have two outputs. The raw data with benchmarked time
and the auto-generated Rust file of `WeightInfo` implementation.

#### Raw Data

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

The second output is an auto-generated `WeightInfo` implementation. This file defines weight
functions of benchmarked extrinsics with the computed coefficient above. We can directly integrated
this file in your pallet or further customize them if so desired. The auto-generated implementation
is designed to make end-to-end weight updates easy.

To use this file, we first define a `WeightInfo` trait in
[`frame/example/src/lib.rs`](https://github.com/paritytech/substrate/blob/master/frame/example/src/lib.rs):

```rust
pub trait WeightInfo {
  fn accumulate_dummy(b: u32, ) -> Weight;
  fn set_dummy(b: u32, ) -> Weight;
  fn sort_vector(x: u32, ) -> Weight;
}
```

Here, associated function `set_dummy` take a parameter. This is because we have the line `let b in 1
.. 1000;` in our `set_dummy` benchmarking function, indicating the execution time likely be affected
by this parameter.

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
    ) -> DispatchResult {
      // -- snip
      Ok(())
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

  - [`frame-benchmarking` README](https://github.com/paritytech/substrate/blob/master/frame/benchmarking/README.md)
  - [Substrate Seminar: Benchmarking Your Substrate
    Pallet](https://www.youtube.com/watch?v=Qa6sTyUqgek)
  - [Benchmarking and Weights for a New Pallet](https://hackmd.io/041uMXYXR8y6nBWUnQ6uCQ)

## Footnotes

  1. <span id="footnote-ref-hardware">The</span> reference hardware use for benchmarking Substrate
     is an Intel Core i7-7700K CPU with 64GB of RAM and an NVMe SSD.

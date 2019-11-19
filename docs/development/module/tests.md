---
title: Runtime Tests
---

Runtime tests allow you to verify the logic in your runtime module by mocking a Substrate runtime environment.

## Unit Testing

Substrate uses the existing [unit testing](https://doc.rust-lang.org/rust-by-example/testing/unit_testing.html) framework provided by Rust. To run tests, the command is 

```bash
cargo test <optional: test_name>
```

## Mock Runtime Environment

To test a Substrate runtime, construct a mock runtime environment. The [substrate recipes](https://substrate.dev/recipes/testing/mock.html) provides a simple example of using a mocked runtime to test module logic. For more examples, see the modules in [`paint`](https://github.com/paritytech/substrate/tree/master/paint).

### Mock Runtime Storage

The [`runtime-io`](https://crates.parity.io/sr_io/index.html#enums) crate exposes a [`TestExternalities`](https://crates.parity.io/sr_io/type.TestExternalities.html) implementation frequently used for mocking storage in tests. It is the type alias for an in-memory, hashmap-based externalities implementation in [`substrate_state_machine`](https://crates.parity.io/substrate_state_machine/index.html)] referred to as [`TestExternalities`](https://crates.parity.io/substrate_state_machine/struct.TestExternalities.html).

In the recipe on mock runtimes, an `ExtBuilder` object is defined to build an instance of [`TestExternalities`](https://crates.parity.io/sr_io/type.TestExternalities.html).

```rust
pub struct ExtBuilder;

impl ExtBuilder {
	pub fn build() -> runtime_io::TestExternalities {
		let mut storage = system::GenesisConfig::default().build_storage::<TestRuntime>().unwrap();
		runtime_io::TestExternalities::from(storage)
	}
}
```

To create the test environment in unit tests, the build method is called to generate a `TestExternalities` using the default genesis configuration. Then, [`with_externalities`](https://crates.parity.io/substrate_externalities/fn.with_externalities.html) provides the runtime environment in which we may call the module's methods to test that storage, events, and errors behave as expected.

```rust
#[test]
fn fake_test_example() {
	ExtBuilder::build().execute_with(|| {
		// ...test conditions...
	}) 
}
```

Custom implementations of [Externalities](https://crates.parity.io/substrate_externalities/index.html) allow developers to construct runtime environments that provide access to features of the outer node. Another example of this can be found in [`substrate-offchain`](https://crates.parity.io/substrate_offchain/), which maintains its own [Externalities](https://crates.parity.io/substrate_offchain/testing/index.html) implementation. 

**TODO** (everything below)

#### Configuring Genesis

You can set custom values for the genesis configuration for modules you include in your mock runtime.

### Block Production

Your tests may require you to simulate block production to move forward the state of your chain.

You will need to emulate the orchestration provided by the Executive module in order for your runtime to behave correctly.

Usually this means executing the `on_initialize` and `on_finalize` functions of all the modules included in your test, and incrementing the block number tracked by the System module. This can be written as a function you include in your unit tests:

```rust
fn run_to_block(n: u64) {
	while System::block_number() < n {
		MyModule::on_finalize(System::block_number());
		System::on_finalize(System::block_number());
		System::set_block_number(System::block_number() + 1);
		System::on_initialize(System::block_number());
		MyModule::on_initialize(System::block_number());
	}
}
```

You can then use this function in your unit tests:

```rust
#[test]
fn my_runtime_test() {
	with_externalities(&mut new_test_ext(), || {
		assert_ok!(MyModule::start_auction());
		run_to_block(10);
		assert_ok!(MyModule::end_auction());
	});
}
```

## Next Steps

* discuss some more examples of more complex `TestExternalities` storage configuration

### Examples

* list more examples in the substrate recipes
* start knocking out a few more tests for the recipes

### References

* of interesting module test patterns? Reference them and discuss a bit
TODO

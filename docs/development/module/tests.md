---
title: Runtime Tests
---

Runtime tests allow you to verify the logic in your runtime module by mocking a Substrate runtime environment.

## Unit Testing

Substrate uses the existing [unit testing](https://doc.rust-lang.org/rust-by-example/testing/unit_testing.html) framework provided by Rust.

To run tests, the command is 

```bash
cargo test <optional: test_name>
```

## Mock Runtime Environment

To support the specific needs of testing a Substrate runtime, you need to construct a "mock" runtime environment. This involves importing the logic of other runtime modules, such as the System module, and establishing runtime storage.

In general, we suggest looking at and mimicking the various examples of runtime tests in `paint`. This document won't be as comprehensive as what is provided in `paint`.

### Mock Runtime Modules

To test your module, you will need to construct a configuration type (`Test`) which implements each of the configuration traits of modules you want to use.

```rust
pub struct Test;
// Implement the System module traits
impl system::Trait for Test { ... }
// Implement your custom module traits
impl Trait for Test { ... }
// Create a friendly alias to access your module
type System = system::Module<Test>;
type MyModule = Module<Test>;
```

#### Mock Primitives

When implementing the configuration traits of modules you want to use in your tests, you should choose primitives which makes your life easier. For example:

```rust
impl system::Trait for Test {
	type Origin = Origin;
	type Index = u64;
	type BlockNumber = u64;
	type Hash = H256;
	type Call = ();
	type Hashing = BlakeTwo256;
	type AccountId = u64;
	//--snip--
}
```

Here you can see that a core runtime type like `AccountId` can simply be set to `u64` rather than using real cryptographic primitives like `SR25519`. This means that to access accounts in your test, you simply need to pass an integer rather than more complicated stuff.

In cases where you do not need to use a type, like `Call` in the example above, you can pass the unit type `()`.

### Mock Runtime Storage

The `runtime-io` crate exposes two helpers for establishing storage for tests:

* `TestExternalities`: An in-memory, hashmap-based externalities implementation. In other words, it mocks a test storage needed for the runtime to execute in a minimal fashion.

* `with_externalities`: A function that allows you to run logic on top of a `TestExternalities` storage.

`TestExternalities` is generated from building storage off of a genesis configuration. That looks like:

```rust
// This function basically just builds a genesis storage key/value store according to our desired mockup.
fn new_test_ext() -> runtime_io::TestExternalities<Blake2Hasher> {
	system::GenesisConfig::default().build_storage::<Test>().unwrap().into()
}
```

#### Configuring Genesis

You can set custom values for the genesis configuration for modules you include in your mock runtime.

**TODO**

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

### Learn More

TODO

### Examples

See the [mock runtime](https://substrate.dev/recipes/testing/mock.html) examples in the substrate recipes.

### References

TODO

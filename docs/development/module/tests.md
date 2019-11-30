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

To test a Substrate runtime, construct a mock runtime environment. The [substrate recipes](https://substrate.dev/recipes/testing/mock.html) provides a simple example of using a mocked runtime to test module logic. For more examples, see the `mock.rs` and `test.rs` files in most substrate modules.

### Mock Runtime Storage

The [`runtime-io`](https://crates.parity.io/sr_io/index.html#enums) crate exposes a [`TestExternalities`](https://crates.parity.io/sr_io/type.TestExternalities.html) implementation frequently used for mocking storage in tests. It is the type alias for an in-memory, hashmap-based externalities implementation in [`substrate_state_machine`](https://crates.parity.io/substrate_state_machine/index.html)] referred to as [`TestExternalities`](https://crates.parity.io/substrate_state_machine/struct.TestExternalities.html).

In the [basic mock runtime's recipe](https://substrate.dev/recipes/testing/mock.html), an `ExtBuilder` object is defined to build an instance of [`TestExternalities`](https://crates.parity.io/sr_io/type.TestExternalities.html).

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

Custom implementations of [Externalities](https://crates.parity.io/substrate_externalities/index.html) allow developers to construct runtime environments that provide access to features of the outer node. Another example of this can be found in [`substrate-offchain`](https://crates.parity.io/substrate_offchain/), which maintains its own [Externalities](https://crates.parity.io/substrate_offchain/testing/index.html) implementation. [Implementing configurable externalities](https://substrate.dev/recipes/testing/externalities.htm) is covered in more depth in the recipes.

#### Genesis Config

The previously shown `ExtBuilder::build()` method used the default genesis configuration for building the mock runtime environment. In many cases, it is convenient to set storage before testing.

An example might involve pre-seeding account balances before testing. The `TestRuntime` implements `balances::Trait`, 

```rust
parameter_types! {
	pub const ExistentialDeposit: u64 = 1;
	pub const TransferFee: u64 = 0;
	pub const CreationFee: u64 = 0;
}

impl balances::Trait for TestRuntime {
	type Balance = u64;
	type OnNewAccount = ();
	type OnFreeBalanceZero = ();
	type Event = ();
	type TransferPayment = ();
	type DustRemoval = ();
	type ExistentialDeposit = ExistentialDeposit;
	type TransferFee = TransferFee;
	type CreationFee = CreationFee;
}
```

In the implementation of `system::Trait`, `AccountId` is set to `u64` just like `Balance` shown above. Place `(u64, u64)` pairs in the `balances` vec to seed `(AccountId, Balance)` pairs as the account balances.

```rust
pub fn build(self) -> runtime_io::TestExternalities {
	GenesisConfig {
		balances: Some(balances::GenesisConfig::<TestRuntime>{
			balances: vec![
				(1, 10),
				(2, 20),
				(3, 30),
				(4, 40),
				(5, 50),
				(6, 60)
			],
			vesting: vec![],
		}),
	}.build_storage().unwrap().into()
}
```

Account 1 has balance 10, account 2 has balance 20, and so on.

### Block Production

It will be useful to simulate block production to verify that expected behavior holds during block time dependent changes. 

A simple way of doing this increments the System module's block number between `on_initialize` and `on_finalize` calls from all modules with `System::block_number()` as the sole input.

```rust
fn run_to_block(n: u64) {
	while System::block_number() < n {
		let current_block = System::block_number();
		ExampleModule::on_finalize(current_block);
		System::on_finalize(current_block);
		System::set_block_number(current_block + 1u64.into());
		System::on_initialize(current_block);
		ExampleModule::on_initialize(System::block_number());
	}
}
```

`on_finalize` and `on_initialize` are only called from `ExampleModule` if the module's trait implements the `sr_primitives::traits::{OnInitialize, OnFinalize}` traits to execute the logic encoded in the runtime methods before and after each block respectively.

To use this function in unit tests,

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

## References and Examples

The [testing](https://substrate.dev/recipes/base/testing/index.html) chapter of the [Substrate Recipes](https://github.com/substrate-developer-hub/recipes/) compliments the samples shown above, and the [kitchen](https://github.com/substrate-developer-hub/recipes/tree/master/kitchen) provides an environment to run the tests, change the logic, and tinker with the code.

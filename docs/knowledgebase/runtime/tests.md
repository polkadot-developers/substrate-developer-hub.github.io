---
title: Tests
---

Runtime tests allow you to verify the logic in your runtime module by mocking a Substrate runtime
environment.

## Unit Testing

Substrate uses the existing
[unit testing](https://doc.rust-lang.org/rust-by-example/testing/unit_testing.html) framework
provided by Rust. To run tests, the command is

```bash
cargo test <optional: test_name>
```

## Mock Runtime Environment

To test a Substrate runtime, construct a mock runtime environment. The configuration type `Test` is
defined as a unit struct with implementations for each of the configuration traits that need to be
used in the mock runtime.

```rust
#[derive(Clone, PartialEq, Eq, Debug)]
pub struct Test;
```

If `Test` implements `balances::Config`, the assignment might use `u64` for the `Balance` type.

```rust
impl balances::Config for TestRuntime {
  type Balance = u64;
  //..
}
```

By assigning `balances::Balance` and `system::AccountId` to `u64`, mock runtimes ease the mental
overhead of comprehensive, conscientious testers. Reasoning about accounts and balances only
requires tracking a `(AccountId: u64, Balance: u64)` mapping.

### Mock Runtime Storage

The [`sp-io`](https://substrate.dev/rustdocs/latest/sp_io/index.html) crate exposes a
[`TestExternalities`](https://substrate.dev/rustdocs/latest/sp_io/type.TestExternalities.html)
implementation frequently used for mocking storage in tests. It is the type alias for an in-memory,
hashmap-based externalities implementation in
[`substrate_state_machine`](https://substrate.dev/rustdocs/latest/sp_state_machine/index.html)]
referred to as
[`TestExternalities`](https://substrate.dev/rustdocs/latest/sp_state_machine/struct.TestExternalities.html).

This examples demonstrates defining a struct called `ExtBuilder` to build an instance of
[`TestExternalities`](https://substrate.dev/rustdocs/latest/sp_io/type.TestExternalities.html).

```rust
pub struct ExtBuilder;

impl ExtBuilder {
  pub fn build() -> sp_io::TestExternalities {
    let mut storage = system::GenesisConfig::default().build_storage::<TestRuntime>().unwrap();
    sp_io::TestExternalities::from(storage)
  }
}
```

To create the test environment in unit tests, the build method is called to generate a
`TestExternalities` using the default genesis configuration. Then,
[`with_externalities`](https://substrate.dev/rustdocs/latest/sp_externalities/fn.with_externalities.html)
provides the runtime environment in which we may call the pallet's methods to test that storage,
events, and errors behave as expected.

```rust
#[test]
fn fake_test_example() {
  ExtBuilder::build().execute_with(|| {
    // ...test conditions...
  })
}
```

Custom implementations of
[Externalities](https://substrate.dev/rustdocs/latest/sp_externalities/index.html) allow developers
to construct runtime environments that provide access to features of the outer node. Another example
of this can be found in
[`offchain`](https://substrate.dev/rustdocs/latest/sp_core/offchain/index.html), which maintains its
own [Externalities](https://substrate.dev/rustdocs/latest/sp_core/offchain/trait.Externalities.html)
implementation.

#### Genesis Config

The previously shown `ExtBuilder::build()` method used the default genesis configuration for
building the mock runtime environment. In many cases, it is convenient to set storage before
testing.

An example might involve pre-seeding account balances before testing.

In the implementation of `system::Config`, `AccountId` is set to `u64` just like `Balance` shown
above. Place `(u64, u64)` pairs in the `balances` vec to seed `(AccountId, Balance)` pairs as the
account balances.

```rust
pub fn build(self) -> sp_io::TestExternalities {
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

It will be useful to simulate block production to verify that expected behavior holds during block
time dependent changes.

A simple way of doing this increments the System module's block number between `on_initialize` and
`on_finalize` calls from all modules with `System::block_number()` as the sole input. While it is
important for runtime code to [cache calls](https://substrate.dev/recipes/cache.html) to storage or
the system module, the test environment scaffolding should prioritize readability to facilitate
future maintenance.

```rust
fn run_to_block(n: u64) {
  while System::block_number() < n {
    ExampleModule::on_finalize(System::block_number());
    System::on_finalize(System::block_number());
    System::set_block_number(System::block_number() + 1);
    System::on_initialize(System::block_number());
    ExampleModule::on_initialize(System::block_number());
  }
}
```

`on_finalize` and `on_initialize` are only called from `ExampleModule` if the pallet's trait
implements the `sr_primitives::traits::{OnInitialize, OnFinalize}` traits to execute the logic
encoded in the runtime methods before and after each block respectively.

To use this function in unit tests,

```rust
#[test]
fn my_runtime_test() {
  with_externalities(&mut new_test_ext(), || {
    assert_ok!(ExampleModule::start_auction());
    run_to_block(10);
    assert_ok!(ExampleModule::end_auction());
  });
}
```

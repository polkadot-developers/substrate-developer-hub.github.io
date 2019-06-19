---
title: "Unit testing the TCR runtime module"
---
This is Part 2 of the guide [Building a Token Curated Registry DAppChain on Substrate](index.md). In [part 1](building-the-substrate-tcr-runtime.md), we built a Substrate runtime module for a simple Token Curated Registry implementation. In this part, we cover unit testing of the TCR runtime module.

## Setup and mocks

To write unit tests for the business logic of our runtime module, we first need to set up the test module. Basically, we would need a mock runtime for testing. We would also need to implement all the traits that we need in our module for this mock runtime.

### Mocking module dependencies

Remember from part 1 that our TCR runtime module trait depends on the `timestamp` and `token` module traits. All modules depend on the `system` module for utilities and cross-cutting functions. So, for our test module, we need to implement the `system`, `timestamp`, and `token` traits.

In the following code snippet, we create the module type for the test module and then implement the required traits for it. Also, note that we have used simpler types for our mock runtime. For example, the `AccountId` is simply a `u64`.

```rust
  pub struct Test;
  impl system::Trait for Test {
    type Origin = Origin;
    type Index = u64;
    type BlockNumber = u64;
    type Hash = H256;
    type Hashing = BlakeTwo256;
    type Digest = Digest;
    type AccountId = u64;
    type Lookup = IdentityLookup<u64>;
    type Header = Header;
    type Event = ();
    type Log = DigestItem;
  }
  impl token::Trait for Test {
    type Event = ();
    type TokenBalance = u64;
  }
  impl timestamp::Trait for Test {
    type Moment = u64;
    type OnTimestampSet = ();
  }
  impl Trait for Test {
    type Event = ();
  }
  type Tcr = Module<Test>;
  type Token = token::Module<Test>;
```

### Mocking genesis config

The next step is to mock the genesis config for the TCR and Token modules. Remember from part 1 that we declared and initialized the genesis config for our runtime modules. When the tests run, they also require the genesis config to be available. In the following code snippet, we have a function that runs before every test and initializes the genesis config with some mock values. Note that wherever we've used `AccountId` in the genesis config (owner), we've set a `u64` value because the `AccountId` type is implemented that way for the mock runtime (see above).

```rust
  fn new_test_ext() -> runtime_io::TestExternalities<Blake2Hasher> {
    let mut t = system::GenesisConfig::<Test>::default()
      .build_storage()
      .unwrap()
      .0;
    t.extend(
      token::GenesisConfig::<Test> { total_supply: 1000 }
        .build_storage()
        .unwrap()
        .0,
    );
    t.extend(
      GenesisConfig::<Test> {
        owner: 1,
        min_deposit: 100,
        apply_stage_len: 10,
        commit_stage_len: 10,
        poll_nonce: 1,
      }
      .build_storage()
      .unwrap()
      .0,
    );
    t.into()
  }
```

Note that we've also mocked the genesis config (`total_supply`) for the `Token` module because it is internally needed in the TCR module's `init` function.

## Writing the tests

Now that we've mocked our runtime and genesis config, we are good to proceed with writing unit tests for the TCR module.

Let's begin with writing a simple test to check if a proposal fails when passed with deposit lower than min_deposit,

```rust
  #[test]
  fn should_fail_low_deposit() {
    with_externalities(&mut new_test_ext(), || {
      assert_noop!(
        Tcr::propose(Origin::signed(1), "ListingItem1".as_bytes().into(), 99),
        "deposit should be more than min_deposit"
      );
    });
  }
```

Note the `assert_noop` macro call in the above snippet. It expects the function to fail with an error message to compare with.

Now, let's write a test for a successful proposal,

```rust
  #[test]
  fn should_pass_propose() {
    with_externalities(&mut new_test_ext(), || {
      assert_ok!(Tcr::init(Origin::signed(1)));
      assert_ok!(Tcr::propose(
        Origin::signed(1),
        "ListingItem1".as_bytes().into(),
        101
      ));
    });
  }
```

In the above snippet, the test first initializes the TCR by calling the `init` function and then calls the propose function with correct values. The `assert_ok` macro expects an `Ok(())` result.

Similarly, we can write other tests covering more logic in our runtime. We have a few more tests in the TCR sample codebase [here](https://github.com/substrate-developer-hub/substrate-tcr/blob/master/runtime/src/tcr.rs#L470).

When writing the unit tests for your runtime modules, it is recommended to refer to the test written for SRML modules which ship with the Substrate framework. The SRML modules have good code coverage and can provide guidance on how to write tests in more complex scenarios.

In the [next part](building-a-ui-for-the-tcr-runtime.md) of this guide, we will learn how we can call these runtime functions from a `reactjs` frontend using the `PolkadotJS` API.

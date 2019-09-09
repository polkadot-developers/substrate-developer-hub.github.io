---
title: Testing Your Contract
id: version-1.0-testing-your-contract
original_id: testing-your-contract
---

You will see at the bottom of the source code there is a simple test which verifies the functionality of the contract. We can quickly test that this code is functioning as expected using the **off-chain test environment** that ink! provides.

In your project folder run:

```bash
cargo +nightly test
```  

To which you should see a successful test completion:

```bash
$ cargo +nightly test
    Finished dev [unoptimized + debuginfo] target(s) in 0.20s
     Running target/debug/deps/flipper-03a085eedcb655b9

running 1 test
test tests::it_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

TODO: We will update this doc to add more instructions and details around creating tests in the near future.

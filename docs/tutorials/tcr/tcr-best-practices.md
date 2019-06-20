---
title: "Best Practices"
---
This is Part 5 of the guide [Building a Token Curated Registry DAppChain on Substrate](index.md). This part of the guide covers some of the best practices and general guidance about building Substrate runtimes and modules.

## Avoiding economic vulnerability in runtime modules

When building Substrate runtime modules we need to be cognizant of the fact that there is no concept of `gas` or metered execution unlike in smart contracts. While this makes our blockchain runtimes more performant and efficient, it also gives us an extra onus of being careful when defining our runtime storage and logic.

Let's take an example: In a typical smart contract, the execution is metered using `gas`. If a transaction is backed with low gas then it's execution is stopped with all changes reverted as soon as it runs out of gas. This is not the case with Substrate runtime extrinsic calls. In Substrate runtimes, the execution continues until it reaches a logical state - `Ok` or `Err`.

Because of this, the runtime could become vulnerable to economic attacks. If our storage and corresponding business logic is not defined carefully then the users can exploit the runtime. For example, if we have a complex data structure stored on-chain and it's manipulation requires a complex logic to be executed, then the users can exploit this to economically attack the runtime. So any resources used by a transaction must explicitly be paid for within the module. If the resources used might be dependent on transaction parameters or pre-existing on-chain state, then your in-module fee structure must adapt accordingly.

If you are building a public DAppChain or Parachain using Substrate, figuring out the balance between `resources used == price paid` should be an important design activity.

## Handling errors gracefully

The runtime modules should handle error properly. Following are some of the guidelines we would like to suggest,

1. **Never panic** - Your runtime module functions should not panic at all. Panics can make the chain prone to attacks. If a runtime function panics during execution, all state changes will be reverted. The user will not be charged anything for this execution. This can be repeated and thus can become an attack vector. The user can do a DoS attack on a panicking node because they won't be charged for any runtime execution that panics. The best approach is to detect situations where a panic may occur later and early-exit in a graceful manner to minimize computation and state inconsistencies. If it's impossible to detect a potential panic without first doing substantial computation, then ensure that the transactor first pays some fee (that can possibly be returned if all goes well) before that computation is done.

2. **Use `ensure`** - The `ensure` macro provided as part of Substrate framework expects a condition and returns an `Err` if the condition gets evaluated to false. Remember from part 1 how we used this macro to check inputs and logic before updating the state in all the runtime functions. The `ensure` macro helps in two ways - keeps the code clean in the runtime module, and automatically exits the function with and `Err` result; reducing chances of unnecessary execution.

## Updating state only after proper checks

Because of no metering on execution and because panicking can make our runtime prone to errors, we do not have any way to revert unintentional state changes. We need to make sure that we are writing to the storage only after proper checks in our logic.

For example, remember from part 1 that in the `challenge` function we check if the apply stage period for the listing has passed or not. If it has, then we do not go further in the execution and return with an `Err` result. If we hadn't placed this check _before_ the insert of challenge instance in the Challenges map, the TCR would have reached a bad state. There was no way we could have reverted this challenge creation.

Another example could be the locking of tokens when a user executes one of the `propose`, `challenge` or `vote` functions. In all these functions, after checking several conditions, we call the `lock` function from the `token` module to take the deposit from the user. If we lock the funds before the checks and if any of these checks fail then the user would lose his deposit without getting the desired outcome.

This is why we need to be very careful when updating the storage. We need to make sure that all `ensure` and other checks on input and logic are done _before_ the state updates. There is no revert. This is a bit of a paradigm shift from smart contracts and we need to be cognizant of it.

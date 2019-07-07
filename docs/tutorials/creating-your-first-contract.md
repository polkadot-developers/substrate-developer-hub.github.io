---
title: "Creating Your First Contract"
---

This guide will cover the basics of smart contract development on Substrate using ink!.

## ink!

ink! is an [eDSL](https://wiki.haskell.org/Embedded_domain_specific_language) to write WebAssembly based smart contracts in the Rust programming language.

ink! exists at 3 different layers:

* Core: The core utilities used to write smart contracts.
* Model: Medium-level abstractions to write smart contracts heavily inspired by [Fleetwood](https://github.com/paritytech/fleetwood).
* Language (Lang): The actual eDSL based on ink! Core and ink! Model to provide a user friendly interface to writing smart contract code.

The Language layer of ink! relies on a single, heavy macro called `contract!`. At compile time, this macro expands to generate code at the Model and Core level. For the purposes of this guide, we will be focusing on the Language layer of ink! where we expect most contract development to take place.

## Skeleton of a Smart Contract

Let's take a look at a high level what is available to you when developing a smart contract using the ink!:

```rust
#![no_std]

// Import to interact with contract storage
use ink_core::storage;
// Import the `contract!` macro
use ink_lang::contract;

// The code for your contract will live entirely in the `contract!` macro
contract! {
    struct ContractName {
        // Contract Storage
    }

    impl Deploy for ContractName {
        fn deploy(&mut self) {
            // Deployment logic that runs once upon contract creation
        }
    }

    impl ContractName {
        // Public/Private Function Definitions
    }
}
```

Let's walk through each part of the contract structure.

## Contract Storage

The entire ink! smart contract is built off of a `struct` which defines your contract storage.

Here is how you would store some simple values in storage:

```rust
contract! {
    struct MyContract {
        // Store a bool
        my_bool: storage::Value<bool>,
        // Store some number
        my_number: storage::Value<u32>,
    }
    ...
}
```

Contract storage like `storage::Value<T>` is allowed to be generic over types that are encodable and decodable which includes the most common types such as `bool`, `u{8,16,32,64,128}` and `i{8,16,32,64,128}`, `AccountId`, `Balance` as well as tuples and arrays.

```rust
// Note that you will need to import `AccountId` and/or `Balance` to use them
use ink_core::env::{AccountId, Balance};

contract! {
    struct MyContract {
        // Store some AccountId
        my_address: storage::Value<AccountId>,
        // Store some Balance
        my_balance: storage::Value<Balance>,
    }
    ...
}
```

You can also store some more complex values like `String` or a mapping:

```rust
use ink_core::env::{AccountId, Balance};
// Note that you will need to import the `String` type to use it
use ink_core::memory::string::String;

contract! {
    struct MyContract {
        // Store a string
        my_string: storage::Value<String>,
        // Store a key/value map; AccountId -> Balance
        my_map: storage::HashMap<AccountId, Balance>,
    }
    ...
}
```

## Contract Deployment

Every ink! smart contract must implement the `Deploy` trait which consists of a single function, `deploy`, which is run once when a contract is created.

```rust
contract! {
    struct MyContract {
        ...
    }

    impl Deploy for MyContract {
        fn deploy(&mut self) {
            // Deployment logic that runs once upon contract creation
        }
    }
}
```

> **Note:** If you are familiar with Solidity, this is similar to the `constructor` function, however in ink!, `deploy` is not optional.

> **Note:** `deploy` can take an arbitrary number of parameters. If you wish to deploy a contract using multiple parameters you can do that like this:

```rust
contract! {
    struct MyContract {
        ...
    }

    impl Deploy for MyContract {
        fn deploy(&mut self, a: bool, b: i32) {
            // Deployment logic that runs once upon contract creation using `a` and `b`
        }
    }
}
```

> **Note:** Parameter types of `deploy` and other contract messages are very restricted. We currently only allow users to pass primitives such as `bool`, `u{8,16,32,64,128}`, `i{8,16,32,64,128}` as well as SRML primitives such as `AccountId` and `Balance`.

### MUST Initialize Value State

In order to correctly access and interact with `Value` in your storage, your `deploy` function must initialize the state of each `storage::Value` item you declared.

**IMPORTANT: If you do not initialize your `storage::Value` items before using them, your contract will panic!**

```rust
contract! {
    struct MyContract {
        // Store a bool
        my_bool: storage::Value<bool>,
        // Store a key/value map
        my_map: storage::HashMap<AccountId, Balance>,
    }

    impl Deploy for MyContract {
        /// Initializes our state to `false` upon deploying our smart contract.
        fn deploy(&mut self) {
            self.my_bool.set(false);
        }
    }
    ...
}
```

### Deployment Variables

You can also deploy a contract with some configurable parameters so that users can customize the contract they are instantiating.

```rust
contract! {
    struct MyContract {
        // Store a number
        my_number: storage::Value<u32>,
    }

    impl Deploy for MyContract {
        /// Allows the user to initialize `my_number` with an input value
        fn deploy(&mut self, init_value: u32) {
            self.my_number.set(init_value);
        }
    }
    ...
}
```

### Contract Caller

When developing a smart contract, you always have access to the contract caller through an environment variable `env.caller()`. This can be used a number of different ways, such as defining a contract owner during contract deployment:

```rust
contract! {
    struct MyContract {
        // Store a number
        owner: storage::Value<AccountId>,
    }

    impl Deploy for MyContract {
        /// Allows the user to initialize `owner` with the contract caller
        fn deploy(&mut self) {
            self.owner.set(env.caller());
        }
    }
    ...
}
```

## Contract Functions

If you have made it this far, it is time to actually start writing the meat of your contract.

All of your contract functions go into an implementation of your contract's `struct`:

```rust
impl MyContract {
    // Public and Private functions can go here
}
```

### Public and Private Functions

As a stylistic choice, we recommend breaking up your implementation definitions for your private and public functions:

```rust
impl MyContract {
    // Public functions go here
    pub(external) fn my_public_function(&self) {
        ...
    } 
}

impl MyContract {
    // Private functions go here
    fn my_private_function(&self) {
        ...
    }
}
```

Note that all public functions must be prefixed with `pub(external)`, not just `pub`.

### Mutable and Immutable Functions

You may have noticed that the function templates included `self` as the first parameter of the contract functions. It is through `self` that you gain access to all your contract functions and storage items.

If you are simply reading from the contract storage, you only need to pass `&self`. But if you want to modify storage items, you will need to explicitly mark it as mutable, `&mut self`.

```rust
impl MyContract {
    // Public functions go here
    pub(external) fn my_getter(&self) -> u32{
        *self.my_number
    } 

    pub(external) fn my_setter(&mut self, some_value: u32) {
        self.my_number = some_value;
    }
}
```

## The Flipper Contract

We now have all the tools needed to build our first smart contract. A simple flipper contract, which stores a boolean value and allows you to "flip" it.

Let's build it starting from our skeleton:

```rust
#![no_std]

use ink_core::storage;
use ink_lang::contract;

contract! {
    struct Flipper {
        // Contract Storage
    }

    impl Deploy for Flipper {
        fn deploy(&mut self) {
            // Deployment logic that runs once upon contract creation
        }
    }

    impl Flipper {
        // Public/Private Function Definitions
    }
}
```

Let's quickly add our boolean to storage and set an initial value:

```rust
struct Flipper {
    /// Store a bool
    value: storage::Value<bool>,
}

impl Deploy for Flipper {
    /// Initializes our state to `false` upon deploying our smart contract.
    fn deploy(&mut self) {
        self.value.set(false);
    }
}
```

Then all we have left to write is a simple function that flips the value of this boolean; remember that this function will modify storage. We can also add a function to get the value that will not.

```rust
impl Flipper {
    /// Flips the current state of our smart contract.
    pub(external) fn flip(&mut self) {
        *self.value = !*self.value;
    }

    /// Returns the current state.
    pub(external) fn get(&self) -> bool {
        *self.value
    }
}
```

If we put everything together, this will be our final Flipper contract code, including a test to verify everything is working:

```rust
#![no_std]

use ink_core::{
    env::println,
    memory::format,
    storage,
};
use ink_lang::contract;

contract! {
    /// This simple dummy contract has a `bool` value that can
    /// alter between `true` and `false` using the `flip` message.
    /// Users can retrieve its current state using the `get` message.
    struct Flipper {
        /// The current state of our flag.
        value: storage::Value<bool>,
    }

    impl Deploy for Flipper {
        /// Initializes our state to `false` upon deploying our smart contract.
        fn deploy(&mut self) {
            self.value.set(false)
        }
    }

    impl Flipper {
        /// Flips the current state of our smart contract.
        pub(external) fn flip(&mut self) {
            *self.value = !*self.value;
        }

        /// Returns the current state.
        pub(external) fn get(&self) -> bool {
            println(&format!("Flipper Value: {:?}", *self.value));
            *self.value
        }
    }
}

#[cfg(test)]
mod tests {
    use super::Flipper;

    #[test]
    fn it_works() {
        let mut flipper = Flipper::deploy_mock();
        assert_eq!(flipper.get(), false);
        flipper.flip();
        assert_eq!(flipper.get(), true);
    }
}
```



## Next Steps

Now that you have gotten a taste for writing smart contracts with ink!, it's time to deploy and test them!

Learn how to [deploy a smart contract](contracts/deploying-a-contract.md).

Join the ink! development community! Check out our resources on our [community page](/community/).

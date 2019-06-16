---
title: "Deploying a Contract"
---

This guide will show you how you can use Substrate and the contract module to deploy and interact with your first smart contract.

## Starting Your Node

After successfully installing `substrate`, you can start a local development chain by running:

```bash
substrate --dev
```

![An image of the terminal starting a Substrate node](./images/start-substrate-node.png)

> **Note:** If you have run this command in the past, you probably want to purge your chain so that you run through this tutorial with a clean slate. You can do this easily with `substrate purge-chain --dev`.

You should start to see blocks being produced by your node in your terminal.

You can interact with your node using the Polkadot UI:

https://polkadot.js.org/apps/

> **Note:** You will need to use Google Chrome to have this site interact with your local node. The Polkadot UI is hosted on a secure server, and your local node is not, which may cause compatibility issues on Firefox or Linux based Chromium. The other option is to [clone and run the Polkadot UI locally](https://github.com/polkadot-js/apps).

If you go into the **Explorer** tab of the UI, you should also see blocks being produced!

![An image of the Substrate UI](./images/start-substrate-ui.png)

## Creating the Flipper "Hello World" Contract

This guide will not teach you about developing smart contracts on Substrate. For that, you can look at our [Substrate Smart Contract Development Tutorial](Writing-Your-First-Contract).

Instead, we will use ink! CLI to automatically generate a Flipper contract, which is about as simple of a smart contract we can build on the platform.

Make sure you are in your working directory, and then run:

```bash
cargo contract new flipper
```

This will create a new folder named `flipper` which we will explore:

```
flipper
|
+-- .cargo
|   |
|   +-- config      <-- Compiler Configuration (Safe Math Flag)
|
+-- src
|   |
|   +-- lib.rs      <-- Flipper Source Code
|
+-- build.sh        <-- Wasm Build Script
|
+-- rust-toolchain
|
+-- Cargo.toml
|
+-- .gitignore
```

### Flipper Source Code

The ink CLI automatically generates the source code for the Flipper contract. You can find it at `flipper/src/lib.rs`.

```rust
#![cfg_attr(not(any(test, feature = "std")), no_std)]

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
            println(&format!("Storage Value: {:?}", *self.value));
            *self.value
        }
    }
}

#[cfg(all(test, feature = "test-env"))]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let mut contract = Flipper::deploy_mock();
        assert_eq!(contract.get(), false);
        contract.flip();
        assert_eq!(contract.get(), true);
    }
}
```

The flipper contract is nothing more than a single contract storage value (bool) which gets flipped from true to false through the `flip()` function. We also provided a getter function, `get()` so that you can return the value currently stored. The source code _should_ be readable as is, but if you want to dive deeper into smart contract development on Substrate, check out [Writing Your First Contract](Writing-Your-First-Contract).

We can quickly test that this code is functioning as expected using the off-chain test environment that ink! provides.

In your project folder run:

```bash
cargo test --features test-env
```

To which you should see a successful test completion:

```bash
Shawns-MBP:flipper shawntabrizi$ cargo test --features test-env
   Compiling flipper v0.1.0 (/Users/shawntabrizi/Documents/GitHub/ink/examples/lang/flipper)
    Finished dev [unoptimized + debuginfo] target(s) in 0.66s
     Running target/debug/deps/flipper-994d43baa19498f9

running 1 test
test tests::it_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

Now that we are feeling confident things are working, we can actually compile this contract to Wasm.


### Compiling To Wasm

The ink! CLI also generates a build script called `flipper/build.sh`:

```bash
#!/bin/bash

PROJNAME=flipper

CARGO_INCREMENTAL=0 &&
cargo +nightly build --release --features generate-api-description --target=wasm32-unknown-unknown --verbose &&
wasm2wat -o target/$PROJNAME.wat target/wasm32-unknown-unknown/release/$PROJNAME.wasm &&
cat target/$PROJNAME.wat | sed "s/(import \"env\" \"memory\" (memory (;0;) 2))/(import \"env\" \"memory\" (memory (;0;) 2 16))/" > target/$PROJNAME-fixed.wat &&
wat2wasm -o target/$PROJNAME.wasm target/$PROJNAME-fixed.wat &&
wasm-prune --exports call,deploy target/$PROJNAME.wasm target/$PROJNAME-pruned.wasm
```

This file will be used to compile the Flipper source code to WASM. You can see that it depends on the Wasm utilities we installed earlier.

> **Note:** One line in this script we should call out is:
>
>```bash
> cat target/$PROJNAME.wat | sed "s/(import \"env\" \"memory\" (memory (;0;) 2))/(import \"env\" \"memory\" (memory (;0;) 2 16))/" > target/$PROJNAME-fixed.wat &&
> ```
> 
> TL;DR, this line is adding a maximum size to the Wasm memory declaration, which by default is not included.
>
> WebAssembly modules can use two parameters to specify how much memory it wants:
>
> 1. Initial Size - the size of the memory when it is first imported.
> 2. Maximum Size - the maximum size the memory can grow to.
>
> It is encoded like:
>
> ```
> (import "env" "memory" (memory <initial> <maximum>))
> ```
>
> Maximum can be absent in this case it is implicitly set to 4GB.

To compile the smart contract, we need to run the included build script:

```bash
./build.sh
```

If all goes well, you should see a `target` folder being created with 5 relevant files corresponding to the steps in the script:

```
flipper.wat
flipper-fixed.wat
flipper.wasm
flipper-pruned.wasm
```

The final, optimized `flipper-pruned.wasm` file is what we will actually deploy to our substrate chain.

### Contract ABI

You will also notice a JSON file which is generated during the build script:

```
Flipper.json
```

This is your contract's application binary interface (ABI). Let's take a look inside:

```json
{
    "name": "Flipper",
    "deploy": {
        "args": []
    },
    "messages": [
        {
            "name": "flip",
            "selector": 970692492,
            "mutates": true,
            "args": [],
            "return_type": null
        },
        {
            "name": "get",
            "selector": 4266279973,
            "mutates": false,
            "args": [],
            "return_type": "bool"
        }
    ]
}
```

You can see that this file describes the interface that can be used to interact with your contract.

If there are any deployment variables needed when instantiating a new contract, those will be defined in the `deploy` section. All the public functions your contract exposes can be found in `messages` along with its function name, function parameters, return type, and whether the function is read-only.

There is also a `selector` which is a hash of the function name and is used to route your contract calls to the correct function.

The Polkadot UI uses this file to generate a friendly interface for deploying and interacting with your contract. :)

## Deploying Your Contract

Now that we have generated a Wasm binary from our source code, we want to deploy this contract onto our Substrate blockchain.

Smart contract deployment on Substrate is a little different than on traditional smart contract blockchains like Ethereum.

Whereas a completely new blob of smart contract source code is deployed each time you push a contract to Ethereum, Substrate opts to optimize this behavior. For example, the standard ERC20 token has been deployed to Ethereum thousands of times, sometimes only with changes to the initial configuration (through the Solidity `constructor` function). Each of these instances take up space on Ethereum equivalent to the contract source code size, even though no code was actually changed.

In Substrate, the contract deployment process is split into two halves:

1. Putting your code on the blockchain
2. Creating an instance of your contract

With this pattern, contract code like the ERC20 standard can be put on the blockchain a single time, but instantiated any number of times. No need to continually upload the same source code over and waste space on the blockchain.

### Putting Your Code on the Blockchain

With your Substrate development node running, you can go back to the [Polkadot UI](https://polkadot.js.org/apps/) where you will be able to interact with your blockchain.

Open the specially designed **Contracts** section of the UI.

In the **Code** section, select a _deployment account_ with some account balance like Alice. In _compiled contract WASM_, select the `flipper-pruned.wasm` file we generated. For the _contract ABI_, select the JSON file. Finally, set the _maximum gas allowed_ to `500,000` units.

![Contracts code page for deploying Flipper](./images/flipper-code-page.png)

After you press **Deploy** and a new block is formed, an extrinsic event is emitted with `contract.codeStored`. This means that you have successfully stored your WASM contract on your Substrate blockchain!

### Creating an Instance of Your Contract

Like Ethereum, smart contracts exist as an extension of the account system on the blockchain. Thus creating an instance of this contract will create a new `AccountId` which will store any balance managed by the smart contract and allow us to interact with the contract.

You will notice on the **Contracts** tab there is a new section called **Instance** where we will now create an instance of this smart contract.

![An image of the Contracts Instance Page](./images/flipper-instance-page.png)

The _code for this contract_ is automatically set to the flipper contract you published, but you can imagine if you created multiple contracts, that you would be able to choose from a drop down of options.

To instantiate our contract we just need to give this contract account an _endowment_ of 1000 and again set the _maximum gas allowed_ to `500,000` units.

> **Note:** As mentioned earlier, contract creation involves creation of a new Account. As such, you must be sure to give the contract account at least the existential deposit defined by your blockchain. This is why we set the `endowment` to `1000`.

When you press **Instantiate**, you should see a flurry of events appear including the creation of a new account (`balances.NewAccount`) and the instantiation of the contract (`contract.Instantiated`):

![An image of events from instantiation of Flipper](./images/flipper-instance-events.png)

## Calling Your Contract

Now that your contract has been fully deployed, we can start to interact with it! Flipper only has two functions, so we will show you what it's like to play with both of them.

### `get()`

If you take a look back at our contract's `deploy()` function, we set the initial value of the Flipper contract to `false`. Let's check that this is the case.

In the **Call** section, set the _message to send_ to `get(): bool`. Send a _value_ of `1` with the _maximum gas allowed_ set to `100,000`.

> **NOTE:** You should not need to send any _value_ when making a contract call, but there is a temporary bug in the UI requiring it, so we just put `1`.

![An image of the Contracts call page](./images/flipper-call-page.png)

Contract calls cannot return a value to the outside world. So when you press **Call**, you will get a pretty unsatisfying `system.ExtrinsicSuccess` message. However, ink! provides a debugging tool to enable you to print messages to your node's terminal.

If we take a look, we can actually see our storage value:

![An image of println in the terminal for Flipper with false](./images/flipper-println-false.png)

> **Note:** `println` is only allowed on `--dev` chains for debugging purposes. If you try to deploy a contract with `println` on a non-dev chain, it will not succeed.

While this is not a great long term solution, it works very well for debugging contracts, and is a placeholder for more mature solutions like contract events and dedicated view RPCs which are still under development.

### `flip()`

So let's make the value turn `true` now!

The alternative _message to send_ we can make with the UI is `flip()`. Again, we will send a _value_ of `1` and a _maximum gas allowed_ of `100,000`.

If the extrinsic was successful, we should then be able to go back to the `get()` function and see our updated storage:

![An image of println in the terminal for Flipper with true](./images/flipper-println-true.png)

Woohoo! You deployed your first smart contract!

## Next Steps

Now that you have gotten a taste for deploying smart contracts on Substrate, it's time to start writing your own!

You can learn to [write your first smart contract](Writing-Your-First-Contract).

Join the ink! development community on [Riot](https://riot.im/) you are welcome to ask questions, get help, and talk with others about this exciting new platform.

[>> Parity ink! Chat <<](https://matrix.to/#/!tYUCYdSvSYPMjWNDDD:matrix.parity.io?via=matrix.parity.io)
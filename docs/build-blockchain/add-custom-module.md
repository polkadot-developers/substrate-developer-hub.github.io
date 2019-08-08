---
title: "Add Custom Runtime Module"
---

After completing [Initialize Your Blockchain](./initialize-your-blockchain.md), you are now ready to write your own runtime module. A runtime module is usually a wrapper for certain features of blockchain, includes storage, callable functions and events. 

Take a look at the pre-defined [template](https://github.com/paritytech/substrate/blob/v1.0/node-template/runtime/src/template.rs) module in the node that you just initialized, the path is `runtime/src/template.rs`. You should see following parts:
* Storage: `Something get(something): Option<u32>`
* Callable function:
  ```rust
  pub fn do_something(origin, something: u32) -> Result {
      // --snip--
  }
  ```
* Event: `SomethingStored(u32, AccountId)`

We will walk you through by writing each part to finish your first runtime module. 

## Create a new module

The `substrate-up` scripts that help us initialize a new node also provides a command `substrate-module-new` to ease the process to create a module based on the **template** module we just mentioned. 

This gives you a ready-to-hack runtime module with all necessary imports, entry-points and sample tests. We recommend using this script to create new modules, especially for users who are just getting started with Substrate, as it also gives you good information on how a typical Substrate runtime module is structured.

To use the `substrate-module-new` command,

1. Make sure you have Substrate installed, have a local runtime created using `substrate-node-new`.
2. Go to the node runtime source directory by running `cd runtime/src`.
3. Run `substrate-module-new` command with the following parameters,

```bash
substrate-module-new <module-name>
```

Where:

* `<module-name>` is the name for your new module. This is a _required_ parameter.

This will create a new file named `<module-name>.rs` in your working directory. In order to use this module, you need to add references to this module in the `lib.rs` file of your node runtime.

For example, if you create a module as,

```
substrate-module-new mymodule
```

Then add the following line in the `lib.rs` to have this module initialized in your runtime,

```
mod mymodule;
```

Further, implement the module trait for your module in the `lib.rs`

```
impl mymodule::Trait for Runtime {
    type Event = Event;
}
```

Finally, add this module to the `construct_runtime!` macro in `lib.rs`,

```rust
construct_runtime!(
    pub enum Runtime with Log(InternalLog: DigestItem<Hash, AuthorityId, AuthoritySignature>) where
        Block = Block,
        NodeBlock = opaque::Block,
        UncheckedExtrinsic = UncheckedExtrinsic
    {
        // --snip--
        MyModule: mymodule::{Module, Call, Storage, Event<T>},
    }
);
```

> A **macro** is code in Rust which can be used to generate other code. This concept is usually called [Metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming). Learn more about [`construct_runtime!`](../runtime/macros/construct_runtime.md).

Re-build your project by running commands:

```bash
# Build wasm version of runtime.
./scripts/build.sh

# Build executable client and native version of runtime.
cargo build --release

# Remove the data storage of our chain, this gives you a fresh start.
./target/release/demo-node purge-chain --dev

# Start a local test chain.
./target/release/demo-node --dev
```

Now you should be able to interact with the new runtime module `mymodule` with [Polkadot/Substrate UI](https://github.com/polkadot-js/apps) just like what you did in [Initialize Your Blockchain](./initialize-your-blockchain.md#interact-with-your-node).

## Add business logic

In this example, we will create a simple "coin flip" game. Users will pay an entry fee to play the game and then "flip a coin". If they win, they will get the contents of the "pot". If they don't win, they will get nothing. No matter what's the outcome, their fee will be placed into the "pot" after the game resolves and wait for next user to try and win.


### Add storage items

To start, we can define the storage items that our module needs to track within the `decl_storage!` macro:

```rust
decl_storage! {
  	trait Store for Module<T: Trait> as mymodule {
        // --snip--
        Payment get(payment): Option<T::Balance>;
        Pot get(pot): T::Balance;
        Nonce get(nonce): u64;
  	}
}
```

> Here we have introduced `decl_storage!` macro and the specific syntax provided by Substrate. It makes our storage code simple and easy to read. The macro itself takes care of generating all of the proper code needed to actually interact with the Substrate storage database behind the scene.

You can see in our storage, we have three items:
* `Payment` item has a type of `Option<T::Balance>` that maintains the entry fee to play the game. It uses an `Option` to wrap the balance so that we can represent whether or not the fee has been initialized with a value.
* `Pot` item has a type of `T::Balance` that keeps all the fees since the last winner.
* `Nonce` item is just an integer in `u64` that will be used to generate random number in our example.

The `Balance` type is provided by [SRML balances](https://substrate.dev/rustdocs/v1.0/srml_balances/index.html) module and holds the balance of an account. To use it, we need to make our module's configuration trait require [balances Trait](https://substrate.dev/rustdocs/v1.0/srml_balances/trait.Trait.html):
```rust
pub trait Trait: balances::Trait {
    // --snip--
}
```

We also defined an alternative getter function for `Payment` storage item by using `get(payment)`. Wanna know how to use it? Read on to find out. 

### Define callable functions

In this section, we will define our callable functions: the ones that a user can use to call into our blockchain system. Our game will have two functions the user can interact with: one that lets us set the initial payment, and one that lets us play and resolve the game.

```rust
decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        fn set_payment(_origin, value: T::Balance) -> Result {
            // Logic for setting the game payment
        }

        play(origin) -> Result {
            // Logic for playing the game
        }
    }
}
```

Now that we have established our module structure, we can add the logic that powers these functions. First, let's write the logic for initializing our storage items within `set_payment` function:

```rust
// This function initializes the `payment` storage item
// It also populates the pot with an initial value
fn set_payment(origin, value: T::Balance) -> Result {
    // Ensure that the function call is a signed message (i.e. a transaction)
    let _ = ensure_signed(origin)?;
  
    // If `payment` is not initialized with some value
    if Self::payment().is_none() {
        // Set the value of `payment`
        <Payment<T>>::put(value);
    
        // Initialize the `pot` with the same value
        <Pot<T>>::put(value);
    }
  
    // Return Ok(()) when everything happens successfully
    Ok(())
}
```
Our `set_payment` function needs two parameters, 
* `origin` has a type of `T::Origin` defined in [SRML system](https://substrate.dev/rustdocs/v1.0/srml_system/type.Origin.html) module and contains the provenance of a function call. This parameter should always come as the first parameter. Since its widely usage, Substrate allows us to eliminate the type signature for it. Refer to the [definition](../overview/glossary.md#origin) of Origin in Glossary page.
* `value` has a type of `T::Balance`. It's used to initialize the `Payment` and `Pot`.

Then, we will write the `play` function which will actually allow users to play our game.
```rust
// This function is allows a user to play our coin-flip game
fn play(origin) -> Result {
    // Ensure that the function call is a signed message (i.e. a transaction)
    // Additionally, derive the sender address from the signed message
    let sender = ensure_signed(origin)?;
  
    // Ensure that `payment` storage item has been set
    let payment = Self::payment().ok_or("Must have payment amount set")?;
  
    // Read our storage values, and place them in memory variables
    let mut nonce = Self::nonce();
    let mut pot = Self::pot();
  
    // Try to withdraw the payment from the account, making sure that it will not kill the account
    let _ = <balances::Module<T> as Currency<_>>::withdraw(&sender, payment, WithdrawReason::Reserve, ExistenceRequirement::KeepAlive)?;
  
    // Generate a random hash between 0-255 using a csRNG algorithm
    if (<system::Module<T>>::random_seed(), &sender, nonce)
      .using_encoded(<T as system::Trait>::Hashing::hash)
      .using_encoded(|e| e[0] < 128)
    {
        // If the user won the coin flip, deposit the pot winnings; cannot fail
        let _ = <balances::Module<T> as Currency<_>>::deposit_into_existing(&sender, pot)
          .expect("`sender` must exist since a transaction is being made and withdraw will keep alive; qed.");
    
        // Reduce the pot to zero
        pot = Zero::zero();
    }
  
    // No matter the outcome, increase the pot by the payment amount
    pot = pot.saturating_add(payment);
  
    // Increment the nonce
    nonce = nonce.wrapping_add(1);
  
    // Store the updated values for our module
    <Pot<T>>::put(pot);
    <Nonce<T>>::put(nonce);
  
    // Return Ok(()) when everything happens successfully
    Ok(())
}
```

Our `play` function only accepts `orgin` parameter. It then checks a few prerequisites like transaction should be signed and payment is not empty. Here we are using `Self::payment()` to get the value from storage, that's how we use the alternative getter function defined as `get(payment)` along with the definition of storage item. Another function to get storage value is using `<Payment<T>>::get()`.

Before throwing the coin in the air, we need to withdraw the entry fee from sender's account so that it can be put into the pot after the game resolves. To use `withdraw` function, import dependencies with:
 ```rust
 use support::traits::{Currency, WithdrawReason, ExistenceRequirement};
 ```

Once the coin is flipped, the user has a 50/50 chance of winning. To simulate this situation, we generate a random number from 0 to 255. If it's smaller than 128, the user wins and deposits the contents in pot. Otherwise the user gets nothing. Finally we can update the storage items for next play. Refer to [Generating Random Data](https://substrate.dev/substrate-collectables-workshop/#/2/generating-random-data) page for more knowledge around randomness in Substrate. 

Now let's add the last missing dependencies:
```rust
use runtime_primitives::traits::{Zero, Hash, Saturating};
use parity_codec::Encode;
```

<!-- TODO: move generate random data page into dev hub -->

### Send events

Due to the asynchronous execution of blockchain, the client has no idea when a callable function will be executed until new block generated. To notify the off-chain world of the result of a function call, Substrate allows developer to deposit an event during function execution. These events will then be listened by clients to build off-chain storage or interact with end users. 

In our example, there are two callable functions `set_payment` and `play`. Let's define an event for each of them:

```rust
decl_event!(
    pub enum Event<T> where
        AccountId = <T as system::Trait>::AccountId,
        Balance = <T as balances::Trait>::Balance {
        // --snip--
        // Deposit this event with the actual value that the Payment storage was set to
        PaymentSet(Balance),
        // Deposit an event which includes player's account id and winnings just before the play function return a success result
        PlayResult(AccountId, Balance),
    }
);
```

We have defined new event type `PaymentSet` and `PlayResult` by putting them in module's `Event` enum and then passing the whole enum code as parameter to `decl_event!` macro. You can find more knowledge in [Event Enum](../runtime/types/event-enum.md) page.

In order to deposit an event, we need to call the predefined `deposit_event` function in our module with the event type that we need. For `set_payment` function, we only need to add one line at the end of the if statement:
```rust
fn set_payment(origin, value: T::Balance) -> Result {
    // --snip--
    if Self::payment().is_none() {
        // --snip--
        // Deposit PaymentSet event with the value
        Self::deposit_event(RawEvent::PaymentSet(value));
    }
    // --snip--
}
```

For `play` function,
* We first initialize the winnings for the player to be zero,
* If the player wins the game, the winnings will be set to the balance in pot,
* The `PlayResult` event is deposited before the function returns no matter what the winnings is.

```rust
fn play(origin) -> Result {
    let sender = ensure_signed(origin)?;
    // --snip--
    // Initialize the winnings to be zero
    let mut winnings = Zero::zero();
    
    if (<system::Module<T>>::random_seed(), &sender, nonce)
      .using_encoded(<T as system::Trait>::Hashing::hash)
      .using_encoded(|e| e[0] < 128)
    {
        // --snip--
        // Set the winnings to the balance in pot
        winnings = pot;
        // Reduce the pot to zero
        pot = Zero::zero();
    }
    // --snip--
    // Deposit PlayResult event with player's account id and winnings
    Self::deposit_event(RawEvent::PlayResult(sender, winnings));

    // Return Ok(()) when everything happens successfully
    Ok(())
}
```

## Summary

That's it! This is how easy it can be to build new runtime modules using Substrate. You can also reference a [complete version](https://github.com/shawntabrizi/substrate-package/blob/gav-demo/substrate-node-template/runtime/src/demo.rs) of this module to check your work.

To play our game, we can interact with the callable functions within [Polkadot/Substrate UI](https://github.com/polkadot-js/apps) by applying Extrinsics. After that, check the Chain state to find out what stores in our module's storage items. Giving yourself some fun!

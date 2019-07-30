---
title: "Add Your Runtime Module"
---

After completing [Initialize Your Blockchain](./initialize-your-blockchain.md), you are now ready to write your own runtime module. A runtime module is usually a wrapper for the certain features of blockchain, includes storage, callable functions and events. 

Take a look at the pre-defined [template](https://github.com/paritytech/substrate/blob/v1.0/node-template/runtime/src/template.rs) module in the node that you just initialized, the path is `runtime/src/template.rs`:
* Storage: `Something get(something): Option<u32>`
* Callable function:
  ```rust
  pub fn do_something(origin, something: u32) -> Result {
      // --snip--
  }
  ```
* Event: `SomethingStored(u32, AccountId)`

## Create a new module

Do you still remember the `substrate-up` scripts that help us initialize a new node with `substrate-node-new` command? It also provides a command `substrate-module-new` to ease the process to create a module based on the **template module** we just mentioned. 

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

## Add real business logic

In this example, we will create a simple "coin flip" game. Users will pay an entry fee to play the game and then "flip a coin". If they win, they will get the contents of the "pot". If they don't win, they will get nothing. No matter the outcome, their fee will be placed into the "pot" after the game resolves for the next user to try and win.


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

> Here we have introduced `decl_storage!` macro and custom syntax to make the declaration of storage simple and easy to read. This macro will take care of generating all of the proper code needed to actually interact with the Substrate storage database.

You can see in our storage, we have three items:
* `Payment` item has a type of `Option<Balance>`. It uses an `Option` to wrap the balance so that we can represent whether or not the `Payment` has been initialized with a value.
* `Pot` item has a type of `Balance`.
* `Nonce` item is just an integer in `u64`.

### Define callable functions

Next we will need to define our callable functions: the ones that a user can use to call into our blockchain system. Our game will have two functions the user can interact with: one that lets us set the initial payment, and one that lets us play the game.

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

Now that we have established our module structure, we can add the logic which powers these functions. First, we will write the logic for initializing our storage items:
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

Then we will write the `play()` function which will actually allow users to play our game.
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

And that's it! This is how easy it can be to build new runtime modules using Substrate. You can also reference a [complete version](https://github.com/shawntabrizi/substrate-package/blob/gav-demo/substrate-node-template/runtime/src/demo.rs) of this file to check your work.


## How to write test

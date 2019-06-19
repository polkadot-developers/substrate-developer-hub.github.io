---
title: "Creating Your First Substrate chain"
---

This document will walk you through the steps required to duplicate the demo that [Gavin Wood presented at the 2018 Web3 Summit](https://youtu.be/0IoUZdDi5Is), showing off how you can build a Runtime Library for a Substrate Blockchain in less than 30 min.

This tutorial will be written for a Mac OS X machine, and may require some finessing to get working on other operating systems.

## Prerequisites

To start, make sure your machine has the latest [node and npm](https://www.npmjs.com/get-npm) installed. Then you're ready to [install substrate](getting-started/installing-substrate.md) itself. It may take a little while, so grab some tea and [optionally walk through this presentation](http://tiny.cc/substrate-getting-started).

You will also need to set up a few more repositories into your working folder which were used in the demo:

 * [Substrate Node Template](https://github.com/paritytech/substrate/tree/master/node-template)
 * [Substrate UI](https://github.com/paritytech/substrate-ui)

You can do that with some [script aliases](https://github.com/paritytech/substrate-up) that were loaded on your machine. You may need to restart your terminal in order for these scripts and other Substrate commands to become available to you.


```bash
substrate-node-new substrate-node-template <author-name>
substrate-ui-new substrate
```

This will create a folder called `substrate-node-template` and `substrate-ui` with the corresponding repositories cloned in them. You can of course rename your projects in these commands, but for the sake of the clarity, we will continue with these folder names.

## Launch a Blockchain

If you have set up everything correctly, you can now start a substrate dev chain! In the `substrate-node-template` folder, you can run the generated executable with:

```bash
./target/release/substrate-node-template --dev
```

If you run into any errors starting or running your node, you may need to purge the chain files on your computer. You can do this by running: `./target/release/substrate-node-template purge-chain --dev`.

If everything is working it should start producing blocks!

To interact with the blockchain, you need to start the Substrate UI. Navigate to the `substrate-ui` folder and run:

```bash
yarn run dev
```

Finally, if open your browser to `http://localhost:8000`, you should be able to interact with your new chain!

## Step 2: Add Alice to your network

Alice is a hard-coded account in your blockchain's [genesis block configuration](https://github.com/paritytech/substrate/blob/master/node-template/src/chain_spec.rs#L43). To make your life easier, this account is automatically pre-funded with currency and made a "super user" to your blockchain's upgrade system.

To access the "Alice" account, go to the `Wallet` section of the Substrate UI, and add Alice using her name and seed URI: `//Alice`.

![Adding Alice to your wallet](https://i.imgur.com/ItPlikV.png)

If all is working correctly, you can now go into the `Send Funds` section and send funds from `Alice` to `Default`. You will see that Alice has a bunch of `units` pre-funded in her account, so send 5000 and wait for the green checkmark and an updated balance for `Default` to show that the transfer has been successfully recorded on the blockchain.

![Sending funds from Alice to your default account](https://i.imgur.com/8IIg292.png)

## Step 3: Create a new runtime module

Now it's time to create our own runtime.

Open up the `substrate-node-template` folder and create a new file:

```bash
./runtime/src/demo.rs
```

This is where our new runtime module will live. Inline comments will hopefully give you insight to what the code is doing.

First, we will need to import a few libraries at the top of our file:

```rust
// Encoding library
use parity_codec::Encode;

// Enables access to store a value in runtime storage
// Imports the `Result` type that is returned from runtime functions
// Imports the `decl_module!` and `decl_storage!` macros
use support::{StorageValue, dispatch::Result, decl_module, decl_storage};

// Traits used for interacting with Substrate's Balances module
// `Currency` gives you access to interact with the on-chain currency
// `WithdrawReason` and `ExistenceRequirement` are enums for balance functions
use support::traits::{Currency, WithdrawReason, ExistenceRequirement};

// These are traits which define behavior around math and hashing
use runtime_primitives::traits::{Zero, Hash, Saturating};

// Enables us to verify an call to our module is signed by a user account
use system::ensure_signed;
```

All modules need to declare a trait named `Trait` which is used to define the unique types needed by the module. In this case, our module does not have any unique types of it own, but does inherit types from the balances module such as a `Balance`, which is the currency of our system.
```rust
pub trait Trait: balances::Trait {}
```

In this example, we will create a simple coin flip game. Users will pay an entry fee to play the game and then "flip a coin". If they win they will get the contents of the pot. If they don't win, they will get nothing. No matter the outcome, their fee will be placed into the pot after the game resolves for the next user to try and win.

To start, we can define the storage items our module needs to track with the [`decl_storage!` macro](../runtime/macros/decl_storage.md):

```rust
decl_storage! {
  trait Store for Module<T: Trait> as Demo {
    Payment get(payment): Option<T::Balance>;
    Pot get(pot): T::Balance;
    Nonce get(nonce): u64;
  }
}
```

A macro is code in Rust which can be used to generate other code. Here we have introduced a macro and custom syntax to make the declaration of storage simple and easy to read. This macro will take care of generating all of the proper code needed to actually interact with the Substrate storage database.

You can see in our storage, we have three items, two of which track a `Balance`, and one that tracks a nonce which is represented as a `u64`. `Payment` uses an `Option` to wrap the balance so that we can represent whether or not the `Payment` has been initialized with a value. Easy enough :)

Next we will need to define our dispatchable functions: the ones that a user can use to call into our blockchain system. This game will have two functions the user can interact with: one that lets us set the initial payment, and one that lets us play the game.

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

## Step 4: Integrate our new module into our runtime

To actually use our module, we need to tell our runtime that it exists. To do this we will be modifying the `./runtime/src/lib.rs` file:

First, we need to include the new file we created into our project:
```rust
...
/// Index of an account's extrinsic in the chain.
pub type Nonce = u64;

mod demo;     // Add this line
```

Next, we need to tell our runtime about the `Trait` we exposed within the demo module.
```rust
...
impl sudo::Trait for Runtime {
  /// The uniquitous event type.
  type Event = Event;
  type Proposal = Call;
}

impl demo::Trait for Runtime {}      // Add this line
```

Finally, we need to include our demo module in the runtime constructor, which is handled by the `construct_runtime!` macro:
```rust
construct_runtime!(
  pub enum Runtime with Log(InternalLog: DigestItem<Hash, Ed25519AuthorityId>) where
    Block = Block,
    NodeBlock = opaque::Block,
    UncheckedExtrinsic = UncheckedExtrinsic
  {
    System: system::{default, Log(ChangesTrieRoot)},
    Timestamp: timestamp::{Module, Call, Storage, Config<T>, Inherent},
    Consensus: consensus::{Module, Call, Storage, Config<T>, Log(AuthoritiesChange), Inherent},
    Aura: aura::{Module},
    Indices: indices,
    Balances: balances,
    Sudo: sudo,
    Demo: demo::{Module, Call, Storage},    // Add this line
  }
);
```

To make it more clear when our upgrade is successful, we can also update the name of our runtime's specification and implementation:
```rust
/// This runtime version.\npub const VERSION: RuntimeVersion = RuntimeVersion {
  spec_name: create_runtime_str!("demo"),      // Update this name
  impl_name: create_runtime_str!("demo-node"), // Update this name
  authoring_version: 3,
  spec_version: 3,
  impl_version: 0,
  apis: RUNTIME_API_VERSIONS,
};
```

Again, you can find a [complete version](https://github.com/shawntabrizi/substrate-package/blob/gav-demo/substrate-node-template/runtime/src/lib.rs) of this file.

## Step 5: Upgrade our chain

Now that we have created a new runtime module, it's time for us to upgrade our blockchain.

To do this, first we will need to compile our new runtime into a Wasm binary. Go into `substrate-node-template` and run:
```
./scripts/build.sh
```

If this completes successfully, it will update the file: `./runtime/wasm/target/wasm32-unknown-unknown/release/node_runtime.compact.wasm`. You can go back to the Substrate UI, and in the `Runtime Upgrade` section, you can select this file and press `upgrade`.

![Successful chain upgrade](https://i.imgur.com/c0O2Pnf.png)


If all went well, you can see at the top of the Substrate UI that the `Runtime` will have our updated name!

![An image of an updated runtime name](https://i.imgur.com/PLe219L.png)

## Step 6: Interacting with our new module

Finally, we can try and play the game we created. We will begin our interaction through the browser console.

On the page with the Substrate UI, press *F12* to open your developer console. We will take advantage of some of the JavaScript libraries loaded on this page.

Before we can play the game, we need to initialize the `set_payment` from an account. We will call the function on behalf of Alice, who will generously initialize the pot with a signed message.
```javascript
post({
  sender: runtime.indices.ss58Decode('F7Hs'),
  call: calls.demo.setPayment(1000),
}).tie(console.log)
```

![Setting the payment in the developer console](https://i.imgur.com/nl0h2Ei.png)


When this call completed, you should see `{finalized: "..."}`, showing that it has been added to the chain. We can check this by reading the balance in the pot:

```javascript
runtime.demo.pot.then(console.log)
```

Which should return `Number {1000}`

## Step 7: Updating our Substrate UI

Now that we see things are working in the background, it's time to give our UI some new legs. Let's add an interface so that someone can play our game. To do this we will need to modify the `substrate-ui` repository.

Open the `./src/app.jsx` file, and in the `readyRender()` function, you will see the code which generates all the different UX components.

For example, this code snippet controls the Runtime Upgrade UX that we most recently interacted with:
```javascript
class UpgradeSegment extends React.Component {
  constructor() {
    super()
    this.conditionBond = runtime.metadata.map(m =>
      m.modules && m.modules.some(o => o.name === 'sudo')
      || m.modules.some(o => o.name === 'upgrade_key')
      )
    this.runtime = new Bond
  }

  render() {
    return <If condition={this.conditionBond} then={
      <Segment style={{ margin: '1em' }} padded>
        <Header as='h2'>
          <Icon name='search' />
          <Header.Content>
            Runtime Upgrade
            <Header.Subheader>Upgrade the runtime using the UpgradeKey module</Header.Subheader>
          </Header.Content>
        </Header>
        <div style={{ paddingBottom: '1em' }}></div>
        <FileUploadBond bond={this.runtime} content='Select Runtime' />
        <TransactButton
          content="Upgrade"
          icon='warning'
          tx={{
            sender: runtime.sudo
              ? runtime.sudo.key
              : runtime.upgrade_key.key,
            call: calls.sudo
              ? calls.sudo.sudo(calls.consensus.setCode(this.runtime))
              : calls.upgrade_key.upgrade(this.runtime)
          }}
        />
      </Segment>
    } />
  }
}
```

We can use this as a template for how we should add our game's UI. At the end of the file, add the following code:
```javascript
class DemoSegment extends React.Component {
  constructor() {
    super()
    this.player = new Bond
  }

  render() {
    return <Segment style={{ margin: '1em' }} padded>
      <Header as='h2'>
        <Icon name='game' />
        <Header.Content>
          Play the game
          <Header.Subheader>Play the game here!</Header.Subheader>
        </Header.Content>
      </Header>
      <div style={{ paddingBottom: '1em' }}>
        <div style={{ fontSize: 'small' }}>player</div>
        <SignerBond bond={this.player} />
        <If condition={this.player.ready()} then={<span>
          <Label>Balance
            <Label.Detail>
              <Pretty value={runtime.balances.balance(this.player)} />
            </Label.Detail>
          </Label>
        </span>} />
      </div>
      <TransactButton
        content="Play"
        icon='game'
        tx={{
          sender: this.player,
          call: calls.demo.play()
        }}
      />
      <Label>Pot Balance
        <Label.Detail>
          <Pretty value={runtime.demo.pot} />
        </Label.Detail>
      </Label>
    </Segment>
  }
}
```

Beyond the updated text, you can see we are accessing a new `this.player` bond, which represents the user context playing the game.

Using this, we can get details like the user's balance:
```javascript
runtime.balances.balance(this.player)
```

And submit transactions on behalf of this user:
```javascript
tx={{
  sender: this.player,
  call: calls.demo.play()
}}
```

Also notice that we are able to dynamically show content like the current balance of the pot in a similar way to how we retrieved it in the developer console:
```javascript
<Label>Pot Balance
  <Label.Detail>
    <Pretty value={runtime.demo.pot}/>
  </Label.Detail>
</Label>
```

The only thing left for us to do, is to add this component into our `App` class at the top of the file:
```javascript
readyRender() {
  return (<div>
    <Heading />
    <WalletSegment />
    <Divider hidden />
    <AddressBookSegment />
    <Divider hidden />
    <FundingSegment />
    <Divider hidden />
    <UpgradeSegment />
    <Divider hidden />
    <PokeSegment />
    <Divider hidden />
    <TransactionsSegment />
    <Divider hidden />
    <DemoSegment />      // Add this line
  </div>)
}
```

If you save your changes and reload the page, you should see your new UI! You can now try playing the game with the `Default` user:

![Player losing the game](https://i.imgur.com/sIspIKE.png)


Here you can see the player lost the game, which means that their 1000 units got added to the pot, and an additional 1 unit transaction fee was taken from their balance.

If we try a few more times, eventually the player will win the game, and the pot will be reset back to its starting amount for the next player:

![Player winning the game](https://i.imgur.com/kqQIF3p.png)

## Final Notes

That's all folks! While you can't actually make a profit playing this game, hopefully you see just how simple Substrate can make it to develop your next blockchain.

In summary, we showed you how to:

 - Download and install `substrate` to your machine in a single command
 - Set up a fresh `substrate-node-template` and `substrate-ui` so that you can start hacking right away
 - Program a new runtime for your blockchain
 - Upgrade your runtime, in real-time and without forking, via the `substrate-ui`
 - Update the `substrate-ui` to reflect your new runtime features and functionality

Substrate is a rapidly developing technology, and we would love to get your feedback, answer questions, and learn more about what you want to build!

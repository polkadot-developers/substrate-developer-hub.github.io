---
title: "Creating a Custom Substrate chain"
---
[block:callout]
{
  "type": "warning",
  "title": "Troubleshooting",
  "body": "Substrate is a rapidly evolving project, which means that breaking changes may cause you problems when trying to follow the instructions below. Feel free to [contact us](https://substrate.readme.io/v1.0.0/docs/feedback) with any problems you encounter."
}
[/block]
This document will walk you through the steps required to duplicate the demo that [Gavin Wood presented at the 2018 Web3 Summit](https://youtu.be/0IoUZdDi5Is), showing off how you can build a Runtime Library for a Substrate Blockchain in less than 30 min.

This tutorial will be written for a Mac OS X machine, and may require some finessing to get working on other operating systems.
[block:api-header]
{
  "title": "Prerequisites"
}
[/block]
To start, make sure your machine has the latest [node and npm](https://www.npmjs.com/get-npm) installed. Then we need to make sure you are able to run Substrate, which means installing Rust and other dependencies.

This can be done with this simple one-liner (it may take a little while, so grab some tea):
[block:code]
{
  "codes": [
    {
      "code": "curl https://getsubstrate.io -sSf | bash",
      "language": "shell"
    }
  ]
}
[/block]
You will also need to set up a few more repositories into your working folder which were used in the demo:

 * [Substrate Node Template](https://github.com/paritytech/substrate/tree/master/node-template)
 * [Substrate UI](https://github.com/paritytech/substrate-ui)

You can do that with some [script aliases](https://github.com/paritytech/substrate-up) that were loaded on your machine:
[block:callout]
{
  "type": "warning",
  "title": "NOTE",
  "body": "You may need to restart your terminal in order for these scripts and other Substrate commands to become available to you."
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "substrate-node-new substrate-node-template <author-name>\nsubstrate-ui-new substrate",
      "language": "shell"
    }
  ]
}
[/block]
This will create a folder called `substrate-node-template` and `substrate-ui` with the corresponding repositories cloned in them. You can of course rename your projects in these commands, but for the sake of the clarity, we will continue with these folder names.

[block:api-header]
{
  "title": "Step 1: Launch a Blockchain"
}
[/block]
If you have set up everything correctly, you can now start a substrate dev chain! In `substrate-node-template` run:
[block:code]
{
  "codes": [
    {
      "code": "./target/release/substrate-node-template --dev",
      "language": "shell"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "title": "Purge the Chain Database",
  "body": "If you run into any errors starting or running your node, you may need to purge the chain files on your computer. You can do this by running: `cargo run -- --dev purge-chain` or by manually removing the chain's folder: `rm -rf ~/Library/Application\\ Support/Substrate/chains/dev/`"
}
[/block]
If everything is working it should start producing blocks!

To interact with the blockchain, you need to start the Substrate UI. Navigate to the `substrate-ui` folder and run:
[block:code]
{
  "codes": [
    {
      "code": "npm run dev",
      "language": "shell"
    }
  ]
}
[/block]
Finally, if open your browser to http://localhost:8000, you should be able to interact with your new chain!
[block:api-header]
{
  "title": "Step 2: Add Alice to your network"
}
[/block]
Alice is a hard-coded account in the substrate system, which is pre-funded to make your life easier. Alice may already be added to your network if you used the latest version of the substrate-node-template. But if she isn't, you can add her easily.

Open a new terminal, and using the installed `substrate/subkey` package, you can retrieve the seed for this pre-funded account:
[block:code]
{
  "codes": [
    {
      "code": "subkey restore Alice\n    \n> Seed\n> 0x416c696365202020202020202020202020202020202020202020202020202020 is account:\n>    SS58: 5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ\n     Hex: 0xd172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f",
      "language": "shell"
    }
  ]
}
[/block]
        
Then in the Substrate UI, you can go into the `Wallet` section and add Alice using her `seed` and `name`.

![An image of adding Alice to your wallet](https://i.imgur.com/34xZZLL.png)


If all is working correctly, you can now go into the `Send Funds` section and send funds from `Alice` to `Default`. You will see that Alice has a bunch of `units` pre-funded in her account, so send some and wait for the green checkmark and an updated balance for `Default` to show that the transfer has been successfully recorded on the blockchain.

![An image of sending funds from alice to your default account](https://i.imgur.com/8IIg292.png)
[block:api-header]
{
  "title": "Step 3: Create a new runtime module"
}
[/block]
Now it's time to create our own runtime.

Open up the `substrate-node-template` folder and create a new file:
[block:code]
{
  "codes": [
    {
      "code": "./runtime/src/demo.rs",
      "language": "text"
    }
  ]
}
[/block]
    
This is where our new runtime module will live. Inline comments will hopefully give you insight to what the code is doing.

First, we will need to import a few libraries at the top of our file:
    
[block:code]
{
  "codes": [
    {
      "code": "// Encoding library\nuse parity_codec::Encode;\n\n// Enables access to the runtime storage\n// Imports the `Result` type that is returned from runtime functions\n// Imports the `decl_module!` and `decl_storage!` macros\nuse support::{StorageValue, dispatch::Result, decl_module, decl_storage};\n\n// Enables us to do hashing\nuse runtime_primitives::traits::Hash;\n\n// Enables access to account balances and interacting with signed messages\nuse {balances, system::{self, ensure_signed}};",
      "language": "rust"
    }
  ]
}
[/block]
All modules need to expose a configuration trait. In this case, our trait inherits from the Balances module's trait since we will be using features and functions made available to us there.
[block:code]
{
  "codes": [
    {
      "code": "pub trait Trait: balances::Trait {}",
      "language": "rust"
    }
  ]
}
[/block]
In this example, we will create a simple coin flip game. Users will pay an entry fee to play the game and then "flip a coin". If they win they will get the contents of the pot. If they don't win, they will get nothing. No matter the outcome, their fee will be placed into the pot after the game resolves for the next user to try and win.

To build this game, we will need to create the module declaration. These are the entry points that we handle, and the macro below takes care of the marshalling of arguments and dispatch.

This game will have two entry points: one that lets us play the game, and one that lets us set the payment.


[block:code]
{
  "codes": [
    {
      "code": "decl_module! {\n  pub struct Module<T: Trait> for enum Call where origin: T::Origin {\n    fn play(origin) -> Result {\n      // Logic for playing the game\n    }\n\n    fn set_payment(_origin, value: T::Balance) -> Result {\n      // Logic for setting the game payment\n    }\n  }\n}",
      "language": "rust"
    }
  ]
}
[/block]
Now that we have established our module structure, we can add the logic which powers these functions. First, we will write the logic for playing our game:
[block:code]
{
  "codes": [
    {
      "code": "fn play(origin) -> Result {\n  // Ensure we have a signed message, and derive the sender's account id from the signature\n  let sender = ensure_signed(origin)?;\n  \n  // Here we grab the payment, and put it into a local variable.\n  // We are able to use Self::payment() because we defined it in our decl_storage! macro below\n  // If there is no payment, exit with an error message\n  let payment = Self::payment().ok_or(\"Must have payment amount set\")?;\n\n  // First, we decrease the balance of the sender by the payment amount using the balances module\n  <balances::Module<T>>::decrease_free_balance(&sender, payment)?;\n  \n  // Then we flip a coin by generating a random seed\n  // We pass the seed with our sender's account id into a hash algorithm\n  // Then we check if the first byte of the hash is less than 128\n  if (<system::Module<T>>::random_seed(), &sender)\n  .using_encoded(<T as system::Trait>::Hashing::hash)\n  .using_encoded(|e| e[0] < 128)\n  {\n    // If the sender wins the coin flip, we increase the sender's balance by the pot amount\n    // `::take()` will also remove the pot amount from storage, which by default will give it a value of 0\n    <balances::Module<T>>::increase_free_balance_creating(&sender, <Pot<T>>::take());\n  }\n\n  // No matter the outcome, we will add the original sender's payment back into the pot\n  <Pot<T>>::mutate(|pot| *pot += payment);\n\n  Ok(())\n}",
      "language": "rust"
    }
  ]
}
[/block]
    
Next we will set up logic for initializing the game with the initial payment:
[block:code]
{
  "codes": [
    {
      "code": "fn set_payment(_origin, value: T::Balance) -> Result {\n  //If the payment has not been set...\n  if Self::payment().is_none() {\n    // ... we will set it to the value we passed in.\n    <Payment<T>>::put(value);\n    \n    // We will also put that initial value into the pot for someone to win\n    <Pot<T>>::put(value);\n  }\n  \n  Ok(())\n}",
      "language": "rust"
    }
  ]
}
[/block]
Then we will create the storage declaration. Using the `decl_storage!` macro, we can define the module specific data entries to be stored on-chain. Learn more about this macro [here](https://github.com/paritytech/wiki/blob/master/decl_storage.md).
[block:code]
{
  "codes": [
    {
      "code": "decl_storage! {\n  trait Store for Module<T: Trait> as Demo {\n    Payment get(payment): Option<T::Balance>;\n    Pot get(pot): T::Balance;\n  }\n}",
      "language": "rust"
    }
  ]
}
[/block]
And that's it! This is how easy it can be to build new runtime modules. You can find a complete version of this file [here](https://github.com/shawntabrizi/substrate-package/blob/gav-demo/substrate-node-template/runtime/src/demo.rs) to check your work.
[block:api-header]
{
  "title": "Step 4: Integrate our new module into our runtime"
}
[/block]
To actually use our module, we need to tell our runtime that it exists. To do this we will be modifying the `./runtime/src/lib.rs` file:

First, we need to declare that we are using the new demo module:
[block:code]
{
  "codes": [
    {
      "code": "...\nextern crate substrate_consensus_aura_primitives as consensus_aura;\n\nmod demo;     // Add this line  ",
      "language": "rust"
    }
  ]
}
[/block]
Next, we need to implement our configuration trait, which we can do at the end of all the other trait implementations:
[block:code]
{
  "codes": [
    {
      "code": "...\n\nimpl sudo::Trait for Runtime {\n\t/// The uniquitous event type.\n\ttype Event = Event;\n\ttype Proposal = Call;\n}\n\nimpl demo::Trait for Runtime {}      // Add this line",
      "language": "rust"
    }
  ]
}
[/block]
Finally, we put our new module into the runtime construction macro, `construct_runtime!`:
[block:code]
{
  "codes": [
    {
      "code": "construct_runtime!(\n\tpub enum Runtime with Log(InternalLog: DigestItem<Hash, Ed25519AuthorityId>) where\n\t\tBlock = Block,\n\t\tNodeBlock = opaque::Block,\n\t\tInherentData = BasicInherentData\n\t{\n\t\tSystem: system::{default, Log(ChangesTrieRoot)},\n\t\tTimestamp: timestamp::{Module, Call, Storage, Config<T>, Inherent},\n\t\tConsensus: consensus::{Module, Call, Storage, Config<T>, Log(AuthoritiesChange), Inherent},\n\t\tAura: aura::{Module},\n\t\tIndices: indices,\n\t\tBalances: balances,\n\t\tSudo: sudo,\n\t\tDemo: demo::{Module, Call, Storage},    // Add this line\n\t}\n);",
      "language": "rust"
    }
  ]
}
[/block]
Again, you can find a complete version of this file [here](https://github.com/shawntabrizi/substrate-package/blob/gav-demo/substrate-node-template/runtime/src/lib.rs).
[block:api-header]
{
  "title": "Step 5: Upgrade our chain"
}
[/block]
Now that we have created a new runtime module, it's time for us to upgrade our blockchain.

To do this, first we will need to build our new runtime. Go into `substrate-node-template` and run:
[block:code]
{
  "codes": [
    {
      "code": "./build.sh",
      "language": "shell"
    }
  ]
}
[/block]
    
If this completes successfully, it will update the following file:
[block:code]
{
  "codes": [
    {
      "code": "./runtime/wasm/target/wasm32-unknown-unknown/release/node_runtime.compact.wasm",
      "language": "text"
    }
  ]
}
[/block]
You can go back to the Substrate UI, and in the `Runtime Upgrade` section, you can select this file and press `upgrade`.

![An image of a successful chain upgrade](https://i.imgur.com/c0O2Pnf.png)


If all went well, you can see at the top of the Substrate UI that the `Runtime` will have our updated name!

![An image of an updated runtime name](https://i.imgur.com/PLe219L.png)

[block:api-header]
{
  "title": "Step 6: Interacting with our new module"
}
[/block]
Finally, we can try and play the game we created. We will begin our interaction through the browser console.

On the page with the Substrate UI, press *F12* to open your developer console. We will take advantage of some of the JavaScript libraries loaded on this page.

Before we can play the game, we need to initialize the `set_payment` from an account. We will call the function on behalf of Alice, who will generously initialize the pot with a signed message.
[block:code]
{
  "codes": [
    {
      "code": "post({sender: runtime.indices.ss58Decode('F7Gh'), call: calls.demo.setPayment(1000)}).tie(console.log)",
      "language": "javascript"
    }
  ]
}
[/block]
![An image of the setting the payment in the developer console](https://i.imgur.com/nl0h2Ei.png)


When this call completed, you should see `{finalized: "..."}`, showing that it has been added to the chain. We can check this by reading the balance in the pot:
[block:code]
{
  "codes": [
    {
      "code": "runtime.demo.pot.then(console.log)",
      "language": "javascript"
    }
  ]
}
[/block]
Which should return `Number {1000}`
[block:api-header]
{
  "title": "Step 7: Updating our Substrate UI"
}
[/block]
Now that we see things are working in the background, it's time to give our UI some new legs. Let's add an interface so that someone can play our game. To do this we will need to modify the `substrate-ui` repository.

Open the `./src/app.jsx` file, and in the `readyRender()` function, you will see the code which generates all the different UX components.

For example, this code snippet controls the Runtime Upgrade UX that we most recently interacted with:
[block:code]
{
  "codes": [
    {
      "code": "<Divider hidden />\n<Segment style={{margin: '1em'}} padded>\n  <Header as='h2'>\n    <Icon name='search' />\n    <Header.Content>\n      Runtime Upgrade\n      <Header.Subheader>Upgrade the runtime using the Sudo module</Header.Subheader>\n    </Header.Content>\n  </Header>\n  <div style={{paddingBottom: '1em'}}></div>\n  <FileUploadBond bond={this.runtime} content='Select Runtime' />\n  <TransactButton\n    content=\"Upgrade\"\n    icon='warning'\n    tx={{\n      sender: runtime.sudo.key,\n      call: calls.sudo.sudo(calls.consensus.setCode(this.runtime))\n    }}\n  />\n</Segment>",
      "language": "xml",
      "name": "React"
    }
  ]
}
[/block]
We can use this as a template for how we should add our game's UX. After the last `</Segment>`,  create a new one with the following code:
[block:code]
{
  "codes": [
    {
      "code": "...\n\n</Segment>\n<Divider hidden />\n<Segment style={{margin: '1em'}} padded>\n  <Header as='h2'>\n    <Icon name='game' />\n    <Header.Content>\n      Play the game\n      <Header.Subheader>Play the game here!</Header.Subheader>\n    </Header.Content>\n  </Header>\n  <div style={{paddingBottom: '1em'}}>\n    <div style={{fontSize: 'small'}}>player</div>\n    <SignerBond bond={this.player}/>\n    <If condition={this.player.ready()} then={<span>\n      <Label>Balance\n        <Label.Detail>\n          <Pretty value={runtime.balances.balance(this.player)}/>\n        </Label.Detail>\n      </Label>\n    </span>}/>\n  </div>\n  <TransactButton\n    content=\"Play\"\n    icon='game'\n    tx={{\n      sender: this.player,\n      call: calls.demo.play()\n    }}\n  />\n  <Label>Pot Balance\n    <Label.Detail>\n      <Pretty value={runtime.demo.pot}/>\n    </Label.Detail>\n  </Label>\n</Segment>",
      "language": "xml",
      "name": "React"
    }
  ]
}
[/block]
Beyond the updated text, you can see we are accessing a new `this.player` bond, which represents the user context playing the game.

Using this, we can get details like the user's balance:
[block:code]
{
  "codes": [
    {
      "code": "runtime.balances.balance(this.player)",
      "language": "javascript"
    }
  ]
}
[/block]
And submit transactions on behalf of this user:
[block:code]
{
  "codes": [
    {
      "code": "tx={{\n  sender: this.player,\n  call: calls.demo.play()\n}}",
      "language": "javascript"
    }
  ]
}
[/block]
Also notice that we are able to dynamically show content like the current balance of the pot in a similar way to how we retrieved it in the developer console:
[block:code]
{
  "codes": [
    {
      "code": "<Label>Pot Balance\n  <Label.Detail>\n    <Pretty value={runtime.demo.pot}/>\n  </Label.Detail>\n</Label>",
      "language": "xml",
      "name": "React"
    }
  ]
}
[/block]
The only thing left for us to do, is to create the new `player` bond in our `constructor()` function at the top of the same file:
[block:code]
{
  "codes": [
    {
      "code": "...\n\nthis.runtime = new Bond;\nthis.player = new Bond;         // Add this line",
      "language": "javascript"
    }
  ]
}
[/block]
If you save your changes and reload the page, you should see your new UX! You can now try playing the game with the `Default` user:

![An image of the player losing the game](https://i.imgur.com/sIspIKE.png)


Here you can see the player lost the game, which means that their 1000 units got added to the pot, and an additional 1 unit transaction fee was taken from their balance.

If we try a few more times, eventually the player will win the game, and the pot will be reset back to its starting amount for the next player:

![An image of the player winning the game](https://i.imgur.com/kqQIF3p.png)
[block:api-header]
{
  "title": "Final Notes"
}
[/block]
That's all folks! While you can't actually make a profit playing this game, hopefully you see just how simple Substrate can make it to develop your next blockchain.

In summary, we showed you how to:

 - Download and install `substrate` to your machine in a single command
 - Set up a fresh `substrate-node-template` and `substrate-ui` so that you can start hacking right away
 - Program a new runtime for your blockchain
 - Upgrade your runtime, in real-time and without forking, via the `substrate-ui`
 - Update the `substrate-ui` to reflect your new runtime features and functionality

Substrate is a rapidly developing technology, and we would love to get your feedback, answer questions, and learn more about what you want to build! Feel free to contact us using the details provided [here](https://substrate.readme.io/v1.0.0/docs/feedback).
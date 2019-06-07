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

This can be done with this simple one-liner (it may take a little while, so grab some tea and [optionally walk through this presentation](http://tiny.cc/substrate-getting-started)):
[block:code]
{
  "codes": [
    {
      "code": "curl https://getsubstrate.io -sSf | bash -s -- --fast",
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
If you have set up everything correctly, you can now start a substrate dev chain! In the `substrate-node-template` folder, you can run the generated executable with:
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
  "body": "If you run into any errors starting or running your node, you may need to purge the chain files on your computer. You can do this by running: `./target/release/substrate-node-template purge-chain --dev`."
}
[/block]
If everything is working it should start producing blocks!

To interact with the blockchain, you need to start the Substrate UI. Navigate to the `substrate-ui` folder and run:
[block:code]
{
  "codes": [
    {
      "code": "yarn run dev",
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
Alice is a hard-coded account in your blockchain's [genesis block configuration](https://github.com/paritytech/substrate/blob/master/node-template/src/chain_spec.rs#L43). To make your life easier, this account is automatically pre-funded with currency and made a "super user" to your blockchain's upgrade system.

To access the "Alice" account, go to the `Wallet` section of the Substrate UI, and add Alice using her name and seed URI: `//Alice`.

![An image of adding Alice to your wallet](https://i.imgur.com/ItPlikV.png)

If all is working correctly, you can now go into the `Send Funds` section and send funds from `Alice` to `Default`. You will see that Alice has a bunch of `units` pre-funded in her account, so send 5000 and wait for the green checkmark and an updated balance for `Default` to show that the transfer has been successfully recorded on the blockchain.

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
      "code": "// Encoding library\nuse parity_codec::Encode;\n\n// Enables access to store a value in runtime storage\n// Imports the `Result` type that is returned from runtime functions\n// Imports the `decl_module!` and `decl_storage!` macros\nuse support::{StorageValue, dispatch::Result, decl_module, decl_storage};\n\n// Traits used for interacting with Substrate's Balances module\n// `Currency` gives you access to interact with the on-chain currency\n// `WithdrawReason` and `ExistenceRequirement` are enums for balance functions\nuse support::traits::{Currency, WithdrawReason, ExistenceRequirement};\n\n// These are traits which define behavior around math and hashing\nuse runtime_primitives::traits::{Zero, Hash, Saturating};\n\n// Enables us to verify an call to our module is signed by a user account\nuse system::ensure_signed;",
      "language": "rust"
    }
  ]
}
[/block]
All modules need to declare a trait named `Trait` which is used to define the unique types needed by the module. In this case, our module does not have any unique types of it own, but does inherit types from the balances module such as a `Balance`, which is the currency of our system.
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

To start, we can define the storage items our module needs to track with the [`decl_storage!` macro](https://github.com/paritytech/wiki/blob/master/decl_storage.md):
[block:code]
{
  "codes": [
    {
      "code": "decl_storage! {\n  trait Store for Module<T: Trait> as Demo {\n    Payment get(payment): Option<T::Balance>;\n    Pot get(pot): T::Balance;\n    Nonce get(nonce): u64;\n  }\n}",
      "language": "rust"
    }
  ]
}
[/block]
A macro is code in Rust which can be used to generate other code. Here we have introduced a macro and custom syntax to make the declaration of storage simple and easy to read. This macro will take care of generating all of the proper code needed to actually interact with the Substrate storage database.

You can see in our storage, we have three items, two of which track a `Balance`, and one that tracks a nonce which is represented as a `u64`. `Payment` uses an `Option` to wrap the balance so that we can represent whether or not the `Payment` has been initialized with a value. Easy enough :)

Next we will need to define our dispatchable functions: the ones that a user can use to call into our blockchain system. This game will have two functions the user can interact with: one that lets us set the initial payment, and one that lets us play the game.
[block:code]
{
  "codes": [
    {
      "code": "decl_module! {\n  pub struct Module<T: Trait> for enum Call where origin: T::Origin {\n    fn set_payment(_origin, value: T::Balance) -> Result {\n      // Logic for setting the game payment\n    }\n    \n    fn play(origin) -> Result {\n      // Logic for playing the game\n    }\n  }\n}",
      "language": "rust"
    }
  ]
}
[/block]
Now that we have established our module structure, we can add the logic which powers these functions. First, we will write the logic for initializing our storage items:
[block:code]
{
  "codes": [
    {
      "code": "// This function initializes the `payment` storage item\n// It also populates the pot with an initial value\nfn set_payment(origin, value: T::Balance) -> Result {\n\t// Ensure that the function call is a signed message (i.e. a transaction)\n\tlet _ = ensure_signed(origin)?;\n\t// If `payment` is not initialized with some value\n\tif Self::payment().is_none() {\n\t\t// Set the value of `payment`\n\t\t<Payment<T>>::put(value);\n\t\t// Initialize the `pot` with the same value\n\t\t<Pot<T>>::put(value);\n\t}\n\t// Return Ok(()) when everything happens successfully\n\tOk(())\n}",
      "language": "rust"
    }
  ]
}
[/block]
Then we will write the `play()` function which will actually allow users to play our game.
[block:code]
{
  "codes": [
    {
      "code": "// This function is allows a user to play our coin-flip game\nfn play(origin) -> Result {\n\t// Ensure that the function call is a signed message (i.e. a transaction)\n\t// Additionally, derive the sender address from the signed message\n\tlet sender = ensure_signed(origin)?;\n\t// Ensure that `payment` storage item has been set\n\tlet payment = Self::payment().ok_or(\"Must have payment amount set\")?;\n\t// Read our storage values, and place them in memory variables\n\tlet mut nonce = Self::nonce();\n\tlet mut pot = Self::pot();\n\n\t// Try to withdraw the payment from the account, making sure that it will not kill the account\n\tlet _ = <balances::Module<T> as Currency<_>>::withdraw(&sender, payment, WithdrawReason::Reserve, ExistenceRequirement::KeepAlive)?;\n\n\t// Generate a random hash between 0-255 using a csRNG algorithm\n\tif (<system::Module<T>>::random_seed(), &sender, nonce)\n\t\t.using_encoded(<T as system::Trait>::Hashing::hash)\n\t\t.using_encoded(|e| e[0] < 128)\n\t{\n\t\t// If the user won the coin flip, deposit the pot winnings; cannot fail\n\t\tlet _ = <balances::Module<T> as Currency<_>>::deposit_into_existing(&sender, pot)\n\t\t.expect(\"`sender` must exist since a transaction is being made and withdraw will keep alive; qed.\");\n\t\t// Reduce the pot to zero\n\t\tpot = Zero::zero();\n\t}\n\n\t// No matter the outcome, increase the pot by the payment amount\n\tpot = pot.saturating_add(payment);\n\t// Increment the nonce\n\tnonce = nonce.wrapping_add(1);\n\n\t// Store the updated values for our module\n\t<Pot<T>>::put(pot);\n\t<Nonce<T>>::put(nonce);\n\n\t// Return Ok(()) when everything happens successfully\n\tOk(())\n}",
      "language": "rust"
    }
  ]
}
[/block]
    
And that's it! This is how easy it can be to build new runtime modules using Substrate. You can find a complete version of this file [here](https://github.com/shawntabrizi/substrate-package/blob/gav-demo/substrate-node-template/runtime/src/demo.rs) to check your work.
[block:api-header]
{
  "title": "Step 4: Integrate our new module into our runtime"
}
[/block]
To actually use our module, we need to tell our runtime that it exists. To do this we will be modifying the `./runtime/src/lib.rs` file:

First, we need to include the new file we created into our project:
[block:code]
{
  "codes": [
    {
      "code": "...\n/// Index of an account's extrinsic in the chain.\npub type Nonce = u64;\n\nmod demo;     // Add this line  ",
      "language": "rust"
    }
  ]
}
[/block]
Next, we need to tell our runtime about the `Trait` we exposed within the demo module.
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
Finally, we need to include our demo module in the runtime constructor, which is handled by the `construct_runtime!` macro:
[block:code]
{
  "codes": [
    {
      "code": "construct_runtime!(\n\tpub enum Runtime with Log(InternalLog: DigestItem<Hash, Ed25519AuthorityId>) where\n\t\tBlock = Block,\n\t\tNodeBlock = opaque::Block,\n\t\tUncheckedExtrinsic = UncheckedExtrinsic\n\t{\n\t\tSystem: system::{default, Log(ChangesTrieRoot)},\n\t\tTimestamp: timestamp::{Module, Call, Storage, Config<T>, Inherent},\n\t\tConsensus: consensus::{Module, Call, Storage, Config<T>, Log(AuthoritiesChange), Inherent},\n\t\tAura: aura::{Module},\n\t\tIndices: indices,\n\t\tBalances: balances,\n\t\tSudo: sudo,\n\t\tDemo: demo::{Module, Call, Storage},\t\t// Add this line\n\t}\n);",
      "language": "rust"
    }
  ]
}
[/block]
To make it more clear when our upgrade is successful, we can also update the name of our runtime's specification and implementation:
[block:code]
{
  "codes": [
    {
      "code": "/// This runtime version.\npub const VERSION: RuntimeVersion = RuntimeVersion {\n    spec_name: create_runtime_str!(\"demo\"),\t\t// Update this name\n    impl_name: create_runtime_str!(\"demo-node\"),\t// Update this name\n    authoring_version: 3,\n    spec_version: 3,\n    impl_version: 0,\n    apis: RUNTIME_API_VERSIONS,\n};",
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

To do this, first we will need to compile our new runtime into a Wasm binary. Go into `substrate-node-template` and run:
[block:code]
{
  "codes": [
    {
      "code": "./scripts/build.sh",
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
      "code": "post({sender: runtime.indices.ss58Decode('F7Hs'), call: calls.demo.setPayment(1000)}).tie(console.log)",
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
      "code": "class UpgradeSegment extends React.Component {\n\tconstructor() {\n\t\tsuper()\n\t\tthis.conditionBond = runtime.metadata.map(m =>\n\t\t\tm.modules && m.modules.some(o => o.name === 'sudo')\n\t\t\t|| m.modules.some(o => o.name === 'upgrade_key')\n\t\t)\n\t\tthis.runtime = new Bond\n\t}\n\trender() {\n\t\treturn <If condition={this.conditionBond} then={\n\t\t\t<Segment style={{ margin: '1em' }} padded>\n\t\t\t\t<Header as='h2'>\n\t\t\t\t\t<Icon name='search' />\n\t\t\t\t\t<Header.Content>\n\t\t\t\t\t\tRuntime Upgrade\n\t\t\t\t\t\t<Header.Subheader>Upgrade the runtime using the UpgradeKey module</Header.Subheader>\n\t\t\t\t\t</Header.Content>\n\t\t\t\t</Header>\n\t\t\t\t<div style={{ paddingBottom: '1em' }}></div>\n\t\t\t\t<FileUploadBond bond={this.runtime} content='Select Runtime' />\n\t\t\t\t<TransactButton\n\t\t\t\t\tcontent=\"Upgrade\"\n\t\t\t\t\ticon='warning'\n\t\t\t\t\ttx={{\n\t\t\t\t\t\tsender: runtime.sudo\n\t\t\t\t\t\t\t? runtime.sudo.key\n\t\t\t\t\t\t\t: runtime.upgrade_key.key,\n\t\t\t\t\t\tcall: calls.sudo\n\t\t\t\t\t\t\t? calls.sudo.sudo(calls.consensus.setCode(this.runtime))\n\t\t\t\t\t\t\t: calls.upgrade_key.upgrade(this.runtime)\n\t\t\t\t\t}}\n\t\t\t\t/>\n\t\t\t</Segment>\n\t\t} />\n\t}\n}",
      "language": "javascript",
      "name": "React"
    }
  ]
}
[/block]
We can use this as a template for how we should add our game's UX. At the end of the file, add the following code:
[block:code]
{
  "codes": [
    {
      "code": "class DemoSegment extends React.Component {\n\tconstructor() {\n\t\tsuper()\n\n\t\tthis.player = new Bond\n\t}\n\n\trender() {\n\t\treturn <Segment style={{ margin: '1em' }} padded>\n\t\t\t<Header as='h2'>\n\t\t\t\t<Icon name='game' />\n\t\t\t\t<Header.Content>\n\t\t\t\t\tPlay the game\n\t\t\t<Header.Subheader>Play the game here!</Header.Subheader>\n\t\t\t\t</Header.Content>\n\t\t\t</Header>\n\t\t\t<div style={{ paddingBottom: '1em' }}>\n\t\t\t\t<div style={{ fontSize: 'small' }}>player</div>\n\t\t\t\t<SignerBond bond={this.player} />\n\t\t\t\t<If condition={this.player.ready()} then={<span>\n\t\t\t\t\t<Label>Balance\n\t\t\t  <Label.Detail>\n\t\t\t\t\t\t\t<Pretty value={runtime.balances.balance(this.player)} />\n\t\t\t\t\t\t</Label.Detail>\n\t\t\t\t\t</Label>\n\t\t\t\t</span>} />\n\t\t\t</div>\n\t\t\t<TransactButton\n\t\t\t\tcontent=\"Play\"\n\t\t\t\ticon='game'\n\t\t\t\ttx={{\n\t\t\t\t\tsender: this.player,\n\t\t\t\t\tcall: calls.demo.play()\n\t\t\t\t}}\n\t\t\t/>\n\t\t\t<Label>Pot Balance\n\t\t  <Label.Detail>\n\t\t\t\t\t<Pretty value={runtime.demo.pot} />\n\t\t\t\t</Label.Detail>\n\t\t\t</Label>\n\t\t</Segment>\n\t}\n}",
      "language": "javascript",
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
The only thing left for us to do, is to add this component into our `App` class at the top of the file:
[block:code]
{
  "codes": [
    {
      "code": "readyRender() {\n\treturn (<div>\n\t\t<Heading />\n\t\t<WalletSegment />\n\t\t<Divider hidden />\n\t\t<AddressBookSegment />\n\t\t<Divider hidden />\n\t\t<FundingSegment />\n\t\t<Divider hidden />\n\t\t<UpgradeSegment />\n\t\t<Divider hidden />\n\t\t<PokeSegment />\n\t\t<Divider hidden />\n\t\t<TransactionsSegment />\n\t\t<Divider hidden />\n\t\t<DemoSegment />\t\t\t// Add this line\n\t</div>);\n}",
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
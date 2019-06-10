---
title: "Deploying a Smart Contract on a Substrate Node Chain"
---

This document will walk you through steps used in the demo that [Sergei Shulepov and Dr Gavin Wood presented at the 2018 Dotcon-0 during the Web3 Summit](https://youtu.be/26ucTSSaqog?t=5298), showing off how you can create a Substrate Node, integrate the Substrate SRML 'Contracts' Module into the Substrate Node's Runtime, and then deploy a WASM-compiled Rust Smart Contract to the Substrate Node in less than 30 min.

In addition, we will show how to use the [Polkadot-JS Apps](https://polkadot.js.org/apps/next/) UI to simplify your workflow interacting with Substrate PoC-3, and how to use the [Polkadot-JS API](https://polkadot.js.org/api/) to learn to author your own custom Dapps that interact with Substrate using JavaScript with a choice of using Promises or RxJS.

This tutorial will be written for a Mac OS X machine, and may require some tweaks to get it working on other operating systems.

## Prerequisites

### Setup Directories for Code
We'll be using code from the following Parity Github repositories:
* [https://github.com/paritytech](https://github.com/paritytech)
* [https://github.com/polkadot-js](https://github.com/polkadot-js)

So we'll start by creating subdirectories to organise the code that we'll be downloading from them. We'll namespace them to match the Github usernames:

```shell
mkdir -p ~/code/paritytech ~/code/polkadot-js
```

### Setup Substrate Node and Substrate UI

Run the following command to install Substrate.
```shell
cd ~/code/paritytech;
curl https://getsubstrate.io -sSf | sh
```

You will also need to set up a few more repositories into your working folder which were used in the demo:

 * [Substrate Node Template](https://github.com/paritytech/substrate-node-template)
 * [Substrate UI](https://github.com/paritytech/substrate-ui)
 * [Polkadot-JS Apps](https://github.com/polkadot-js/apps)

You can do that with some [script aliases](https://github.com/paritytech/substrate-up) that were loaded on your machine:
```shell
cd ~/code/paritytech
substrate-node-new my-substrate-node-template-1 my-name
substrate-ui-new substrate my-substrate-node-template-1
```

This will create folders called 'my-substrate-node-template-1' and 'substrate-ui' within directory ~/code/paritytech, with the corresponding repositories cloned in them. You can of course rename your projects in these commands, but for the sake of the clarity, we will continue with these folder names.

#### Setup Polkadot-JS Apps

We'll also run a couple of other script aliases to install necessary dependencies (Xcode Command Line Tools, Homebrew, Homebrew Cask, RBEnv, Ruby, NVM and Node.js latest LTS, Yarn,) and create a folder called `apps` within directory ~/code/polkadot-js, containing a clone of the Polkadot-JS Apps repository with a branch that supports PoC-4:
```shell
cd ~/code/polkadot-js
polkadot-js-dependencies
```

### View and Run the Rust Program Demo

#### View Rust Code (Easy)
We've bundled all the code samples from this guide in the following [Substrate branch 'deploy-smart-contract-adder'](https://github.com/paritytech/substrate/compare/deploy-smart-contract-adder?expand=1) that you may view in the browser.

#### Run Rust Program (Advanced) <a name="run-rust-program"></a>

Once Substrate is installed. Switch to branch 'deploy-smart-contract-adder', run relevant Git commands that you are familiar with to rebase or merge the latest changes in the 'master' branch into 'deploy-smart-contract-adder'. We'll run yet another script alias 'substrate-dependencies' to install or update necessary Substrate dependencies, and then build and run the program:
```shell
cd ~/code/paritytech
git clone https://github.com/paritytech/substrate
cd substrate
git fetch origin deploy-smart-contract-adder:deploy-smart-contract-adder
git checkout master
git pull --rebase origin master
git checkout deploy-smart-contract-adder
git merge master
substrate-dependencies
./scripts/build.sh
cargo build
cargo run -p deploy-smart-contract-adder
```

**FIXME** - the above rebase/merge from 'master' branch gets Substrate version 0.1.0, whereas using the shell script retrieves version 0.9.0

## Step 1: Integrate Substrate SRML 'Contracts' Module into Substrate Node Runtime

We want to build upon 'smart contract' mechanism dependencies, so we've gone for the most convenient option of cloning the [ParityTech Substrate](https://github.com/paritytech/substrate) repo, which contains **Substrate Core** with the **Substrate (<<glossary:SRML>>)**, including a 'Contracts' Module.
![Source: https://youtu.be/0IoUZdDi5Is?t=1470](https://files.readme.io/d9889e8-Screen_Shot_2018-11-18_at_15.31.36.png)

The [Substrate Node Template](https://github.com/paritytech/substrate/blob/master/node-template) however only includes a minimal Substrate Node chain, so if we had chosen to build upon that instead we'd have had to plugin the 'Contracts' Module manually.

![Source: https://youtu.be/0IoUZdDi5Is?t=1377](https://files.readme.io/ff3a66e-53b8dc8-Screen_Shot_2018-11-18_at_15.31.20.png)

## Step 2: Launch a Substrate Node Blockchain

If you have set up everything correctly, you can now start a Substrate dev chain! In directory 'my-substrate-node-template-1' run the following and it will be published on [Telemetry](https://telemetry.polkadot.io):

```shell
cd ~/code/paritytech/my-substrate-node-template-1
./target/release/my-substrate-node-template-1 \\
  --dev \\
  --telemetry-url ws://telemetry.polkadot.io:1024
```

> If you run into an error like `Error: UnknownBlock: Unknown block Hash(...)`, you will need to purge the chain files from disk, with either of the following commands: `cargo run -- --dev purge-chain --dev` or `rm -rf ~/Library/Application\ Support/Substrate/chains/development/`

```shell
cargo run -- --dev purge-chain --dev
```

If everything is working it should start producing blocks, as shown below:
![Producing Blocks](https://files.readme.io/4876514-Screen_Shot_2018-11-16_at_11.28.02.png]


> To stop running your Substrate node, you can press CTRL+C

## Step 3: Launch UI of Polkadot-JS Apps

To interact with the Substrate Node, we'll start the UI of Polkadot JS Apps.
```shell
cd ~/code/polkadot-js/apps;
yarn run start
```

Open your browser to http://localhost:3000.

Go to the 'Settings' menu item. Select option 'Local Node (127.0.0.1:9944)', then click 'Save & Reload'.
![Configure Local Node is Polkadot-js Apps](https://files.readme.io/d75fe2b-Screen_Shot_2018-11-14_at_13.59.34.png")

It will connect to the local Substrate Node that you're running and update the UI with additional menu items, as shown below:
![More apps appearing](https://files.readme.io/e2836dc-Screen_Shot_2018-11-16_at_11.02.31.png)

## Step 4: Obtain Block Hash of Genesis Block using JSON-RPC

### Option 1: Interact with Polkadot-JS Apps

Let's go to the 'Chain state' menu item and create JSON-RPC calls to the Substrate Node and display the response below. Select 'system' and 'blockHash(BlockNumber): Hash' from the selection boxes, as shown below, and enter value '0' for the 'BlockNumber' label. Lastly click the blue '+' button, and the response will display below. If you click the red 'x' button it removes the response.

* **FIXME** - update the screenshot below when running local node, after this issue resolved https://github.com/polkadot-js/apps/issues/451
![running local node](https://files.readme.io/e6dcf33-Screen_Shot_2018-11-14_at_14.15.50.png)

### Option 2: Interact using cURL

Alternatively we can fetch the block hash of the genesis block in the Substrate Node by using cURL to perform a JSON-RPC call that contains a JSON-RPC request object with members including method `state_getBlockHash` and params `[0]` (the genesis block).

```shell
curl -H 'Content-Type: application/json' \\
     -d '{ "jsonrpc": "2.0", "method":"chain_getBlockHash", "params":[0], "id": 1 }' \\
     -vv http://127.0.0.1:9933/
```

We'll receive a [JSON-RPC response object](https://www.jsonrpc.org/specification#response_object) as follows, where the 'result' member contains the block hash:
```json
{
  "jsonrpc":"2.0",
  "result":"0x0000fcb6a13183bf24669dc6d66ad80eaf20ee17e3712ba79b0285c2b42adc79",
  "id":1
}
```
## Step 5: About the Smart Contract 'Adder' Rust program

The Smart Contract 'Adder' is a basic counter that has two actions that we can execute:
* `Inc(u32)` function that increments the counter by the value of the parameter provided;
* `Get` function that returns the current counter value

When the contract is executed, we read the input data, decode it into an action using the `Action` enumeration, then depending on the action we execute it as follows:
* `Action::Inc(by)`: We query the extrinsic storage using the counter key, then decode and return the resultant u32 value (if any), or return a value of 0 if no value exists yet. We then increment the value by the u32 `by` value that we specified. Lastly we encode the incremented value as u32 and set the updated extrinsic counter key value in storage.
* `Action::Get`: We simply query the extrinsics storage using the counter key and return that value.

* Extracted code snippets from the [Smart Contract 'Adder'](https://github.com/pepyakin/substrate-contracts-adder/blob/master/src/lib.rs) are shown below:

```rust
...

enum Action {
    Inc(u32),
    Get,
}

static COUNTER_KEY: ext::Key = ext::Key([1; 32]);

...

pub extern "C" fn call() {
    let input = ext::input();
    let action = Action::decode(&mut &input[..]).unwrap();

    match action {
        Action::Inc(by) => {
            let mut counter = ext::get_storage(&COUNTER_KEY).and_then(|v| u32::decode(&mut &v[..])).unwrap_or(0);
            counter += by;
            ext::set_storage(&COUNTER_KEY, Some(&u32::encode(&counter)));
        }
        Action::Get => {
            let raw_counter = ext::get_storage(&COUNTER_KEY).unwrap_or(vec![]);
            ext::return_(&raw_counter);
        }
    }
}
```

## Step 6: Generate WASM file from Smart Contract 'Adder' Rust program

Let's clone the 'Adder' Smart Contract Rust library, and compile its Rust code into a WASM file using the provided `./build.sh` Shell script, which runs a `wasm-build` command from the [wasm-utils](https://github.com/paritytech/wasm-utils) repository. The generated WASM file will be located in `~/substrate-contracts-adder/target/wasm32-unknown-unknown/release/substrate_contracts_adder.wasm`

```shell
git clone https://github.com/pepyakin/substrate-contracts-adder
cd substrate-contracts-adder
./build.sh
```

## Step 7: Create Extrinsic and Deploy Smart Contract 'Adder' to Substrate Node

### Option 1: Interact using UI of Polkadot-JS Apps (Easy)

#### Load the in-built Alice account from Substrate
If you're running the Substrate Node on your local machine then the in-built accounts including Alice will be pre-loaded, as shown below in the 'Accounts' menu item:
![Preloaded Accounts](https://files.readme.io/beb78b0-Screen_Shot_2018-11-16_at_14.34.23.png)

#### Submit an Extrinsic with Nonce 0 to Deploy Smart Contract 'Adder' to the Substrate Node

We'll perform the following actions, as shown in the screenshot below:
* Navigate to Polkadot-JS Apps Extrinsics menu item at https://localhost:3000/#/extrinsics.
* Select under label 'from selected account': `ALICE` Alice's account (to send the extrinsic since she has sufficient available balance to cover the fees and any DOTs to be sent)
* Select under label 'from extrinsic section': `contract`
* Select under label 'submit the following extrinsic': `create(value, gas_limit, init_code, data)`
* Enter under label 'value: Balance': `1001`
* Enter under label 'gas_limit: Gas': `9000000`
* Enter under label 'init_code: Bytes': Click the icon to upload a .wasm format file of the Smart Contract 'Adder' that we compiled to WASM from Rust. It should be located at: ~/code/src/pepyakin/substrate-contracts-adder/target/wasm32-unknown-unknown/release/substrate_contracts_adder.wasm
This is equivalent to copy/pasting the hex value `0x____` of the loaded WASM contract obtained later in the section ["Option 2: Write Rust Program"](#write-rust-program)
* Enter under label 'data: Bytes': ???
* Enter under label 'with an index': `0`

Click 'Submit Transaction' to open a modal.
Click 'Sign & Submit' in the modal to add the extrinsic into the 'pending' extrinsics queue.

* **FIXME** - update the screenshot below when running local node, after this issue resolved https://github.com/polkadot-js/apps/issues/451
![https://files.readme.io/dce4586-Screen_Shot_2018-11-15_at_01.33.05.png](https://files.readme.io/dce4586-Screen_Shot_2018-11-15_at_01.33.05.png)

> **Pending Extrinsics**
>
> If you're quick enough at querying the 'pending' extrinsics (after clicking Sign & Submit) then you'll see the extrinsic go in and out of the 'pending' extrinsics queue in the response. We'll use the 'Raw RPC' menu item at https://localhost:3000/#/rpc in the section "author > pendingExtrinsics" to make the query.


**FIXME** - how do we determine the contract address of an extrinsic to create a contract that we submit in the Extrinsics or the Raw RPC sections of the UI?
**FIXME** - how do we determine the storage key of a contract address from an extrinsic that we submit in the Extrinsics or the Raw RPC sections of the UI? we need this to verify the extrinsics are submitted

#### Submit an Extrinsic with Nonce 1 to Increment storage by 7 in the Smart Contract 'Adder'

**FIXME** - why is there a destination address for a `call`? isn't the contract in storage?
**FIXME** - what to paste into the input field for the `data: Bytes` value?

* Select under label 'from selected account': `ALICE` Alice's account (to send the extrinsic since she has sufficient available balance to cover the fees and any DOTs to be sent)
* Select under label 'from extrinsic section': `contract`
* Select under label 'submit the following extrinsic': `call(dest, value, gas_limit, data)`
* Select under label 'dest: AccountId': ???
* Enter under label 'value: Balance': `1001`
* Enter under label 'gas_limit: Gas': `9000000`
* Enter under label 'data: Bytes': ??? `[0x00, 0x07, 0x00, 0x00, 0x00]`
* Enter under label 'with an index': `1`

Click 'Submit Transaction' to open a modal.
Click 'Sign & Submit' in the modal to add the extrinsic into the 'pending' extrinsics queue.

* **FIXME** - update the screenshot below when running local node, after this issue resolved https://github.com/polkadot-js/apps/issues/451
![todo](https://files.readme.io/3d96754-Screen_Shot_2018-11-15_at_01.34.00.png)

Show the extrinsic in the 'pending' extrinsics queue using the Polkadot-JS Apps 'Raw RPC' menu item of the UI at https://localhost:3000/#/rpc in the section "author > pendingExtrinsics"

Once again we'll show the extrinsic go in and out of the 'pending' extrinsics queue in the response using the 'Raw RPC' menu item at https://localhost:3000/#/rpc in the section "author > pendingExtrinsics" to make the query.

### Option 2: Write Rust Program (Advanced) <a name="write-rust-program"></a>

We've provided the following guide to demonstrate an alternate approach, without using a UI, that will give you the opportunity to write a Rust program that uses Substrate. We'll use it to:
* Convert a given WASM Smart Contract into Hex format, which we could then use to submit an extrinsic.
  * Note: Optionally paste this hex value as the value of `init_code: Bytes` when creating a contract extrinsic using the Polkadot-JS Apps Extrinsics menu item at https://localhost:3000/#/extrinsics
* Load the in-built Alice account from Substrate into a Rust variable
* Print an Extrinsic with Nonce 0 in encoded form, where Alice would submit Smart Contract 'Adder' to the Substrate Node.
  * Note: We later provide this value as the value of the `params` member of a JSON-RPC call that we make to submit the contract using cURL. Previously we used the Polkadot-JS Apps 'Chain State' menu item at https://localhost:3000/#/chainstate
* Pre-Determine the Contract Address of a Substrate Node in the Runtime that the Smart Contract 'Adder' would be deployed to by Alice once Submitted
* Print an Extrinsic with Nonce 1 of a Call to Increment storage by 7 in the Smart Contract 'Adder' at the pre-determined Contract Address using the encoded form of the Extrinsic
* Print the Pre-Determined Storage Key of the Pre-Determined Smart Contract 'Adder' Address in Substrate Database Storage.
  * Note: Optionally determine this value using the Polkadot-JS Apps 'Raw RPC' menu item at https://localhost:3000/#/rpc in the section 'state > getStorage(key)'
* Submit the Extrinsic with Nonce 0 using JSON-RPC and cURL to deploy Smart Contract 'Adder' to a Substrate Node.
  * Note: Optionally use the Polkadot-JS Apps 'Raw RPC' menu item at https://localhost:3000/#/rpc in the section "author > submitExtrinsic"
* Check Pending Extrinsics until Extrinsic with Nonce 0 is Submitted.
  * Note: Optionally use the Polkadot-JS Apps 'Raw RPC' menu item at https://localhost:3000/#/rpc in the section "author > pendingExtrinsics"
* Verify Extrinsic with Nonce 0 was Submitted
* Verify the Current Nonce of an Account ID
  * Note: Optionally use the Polkadot-JS Apps 'Chain State' menu item at https://localhost:3000/#/chainstate in the section "state > accountNonce"
* Submit the Extrinsic with Nonce 1 by providing JSON-RPC method `author_submitExtrinsic` and params `["<INSERT_EXTRINSIC_NONCE_1_HASH>"]` using cURL
* Check Pending Extrinsics until Extrinsic with Nonce 1 is Submitted
* Verify Extrinsic with Nonce 1 was Submitted


#### Convert WASM Smart Contract to Hex using Genesis Block Hash

Before we start creating a Rust program that uses Substrate, we'll first need to access to the full Substrate repository on Github to access relevant Substrate dependencies. Unfortunately we can't use the simplified Substrate Node code in directory 'my-substrate-node-template-1' that we generated with the shell script `substrate-node-new`.

* FIXME - is there really no way for us to use the Substrate codebase generated with `substrate-node-new`?

Let's follow similar steps to ["Option 2: Run Rust Program (Advanced)"](#run-rust-program), where we viewed the complete solution, but here we just clone the 'master' branch, checkout a new branch named 'deploy-smart-contract-adder' where we'll create our new Rust program, and build Substrate.

```shell
cd ~/code/paritytech
git clone https://github.com/paritytech/substrate
cd substrate
git fetch origin master
git checkout -b deploy-smart-contract-adder
substrate-dependencies
./scripts/build.sh
cargo build
```

We're ready to [create a new Rust program](https://doc.rust-lang.org/cargo/guide/creating-a-new-project.html).

```shell
cd ~/code/paritytech/substrate
cargo new examples/deploy-smart-contract-adder --bin
```

Add dependencies to Cargo.toml
```toml
[package]
name = "deploy-smart-contract-adder"
version = "0.1.0"
authors = ["Parity Technologies <admin@parity.io>"]
description = "Substrate Deploy Smart Contract."

[dependencies]
hex-literal = "0.1.0"
hex = "0.3"
substrate-primitives = { path = "../../core/primitives" }
```

We'll create the encoded form of an extrinsic (blob of data) to be sent from Alice that contains instructions to deploy a certain WASM smart contract.

Update main.rs (executable file of the program) `~/code/paritytech/substrate/examples/deploy-smart-contract-adder/src/main.rs`, replacing `<INSERT_BLOCK_HASH>` with the block hash obtained in the previous step (i.e. `"0x0000fcb6a13183bf24669dc6d66ad80eaf20ee17e3712ba79b0285c2b42adc79"`)

```rust
extern crate substrate_primitives as primitives;
extern crate hex;

#[macro_use]
extern crate hex_literal;

use std::fmt::Write;
use primitives::hexdisplay::HexDisplay;

/// Display the hex value of the smart contract
fn show_hex_of_smart_contract(raw_bytes: &[u8]) {
    let mut hex_raw_bytes = String::new();
    write!(hex_raw_bytes, "0x");
    for byte in raw_bytes {
        write!(hex_raw_bytes, "{:02x}", byte);
    }
    println!("Smart Contract 'Adder' WASM code in hex is: {}", hex_raw_bytes);
}

fn main() {
    /// Add 0x-prefix to given genesis block hash.
    const GENESIS_BLOCK_HASH: &[u8; 32] = &hex!("771dfd2593b2f07998e3a1ffb196f78ca583c25641a3bc844d3d6a49405acde0");
    println!("Genesis Block Hash is: 0x{}
", HexDisplay::from(GENESIS_BLOCK_HASH));

    /// Load Smart Contract 'Adder' WASM code into a bytes slice
    const ADDER_INIT_CODE: &'static [u8] = include_bytes!("/Users/YOUR_USERNAME/code/src/pepyakin/substrate-contracts-adder/target/wasm32-unknown-unknown/release/substrate_contracts_adder.wasm");
    show_hex_of_smart_contract(&ADDER_INIT_CODE);
}
```

Run the Rust program
```shell
cargo run -p deploy-smart-contract-adder
```

Expect the terminal output to return a similar response to that shown below, but with different values that we'll make use of. The WASM code hex value will be much longer!
```text
Genesis Block Hash is: 0x771dfd2593b2f07998e3a1ffb196f78ca583c25641a3bc844d3d6a49405acde0

Smart Contract 'Adder' WASM code in hex is: 0x0061...7079
```

#### Load In-Built Account 'Alice'

We'll update the Rust program to load the account key of an in-built account named Alice, since we'll be using her account to deploy the Smart Contract 'Adder' to the BBQ Birch PoC-3 chain.

Add additional dependencies to Cargo.toml:
```toml
substrate-primitives = { path = "../../core/primitives" }
substrate-keyring = { path = "../../core/keyring" }
node-primitives = { path = "../../node/primitives" }
```

Add these functions to main.rs
```rust
/// Get Alice's account public key
fn get_alice_public_key() -> AccountId {
    AccountId::from(Keyring::Alice.to_raw_public())
}

fn main() {
    ...

    /// Get Alice's account key
    let pair = Pair::from(Keyring::from_public(Public::from_raw(get_alice_public_key().clone().into())).unwrap());
    let alice = AccountId::from(&pair.public().0[..]);
    println!("Alice's Account Key is: {:?} ({})
", alice, keyring::ed25519::Public(alice.0).to_ss58check());
}
```

#### Print an Extrinsic with Nonce 0 in encoded form where Alice would deploy Smart Contract 'Adder' to the Substrate Node

We'll create the encoded form of an extrinsic (blob of data) sent from Alice that contains instructions to deploy a certain WASM smart contract.

Add additional dependencies to Cargo.toml:
```toml
node-runtime = { path = "../../node/runtime" }
sr-primitives = { path = "../../core/sr-primitives" }
srml-balances = { path = "../../srml/balances" }
srml-contract = { path = "../../srml/contract" }
```

Add the following code to to main.rs that we've explained for you below.

It creates an unchecked extrinsic that's signed with Alice's public key pair. It's been provided with a Nonce (index) value of `0`, assuming this will be the first extrinsic that we'll have submitted to the chain using Alice's account. We'll also provide it with a function call to `create` a contract using the Substrate runtime that has arguments including the funds to send `1001` to the contract, gas limit to allocate `9_000_000` to the extrinsic, and the bytes of the Smart Contract 'Adder' as data.

Note importantly that the `create` function is just an enum variant, it's not a function, so no call to create the contract is performed until we actually submit the extrinsic with a JSON-RPC call.

We've provided it with an era that has an indefinite (immortal) period, which is dangerous since we're using the first index. It means the transaction is not protected from replay attacks.

> **Transaction Eras in Substrate**
>
> We really should be taking advantage of Substrate's **Transaction Eras** so that the transaction is only valid for a certain period of time, as this protects Alice's account from being subjected to malicious replay attacks on the first index if her account is deleted along with its Nonce (enumeration index), perhaps due to insufficient funds, and exposing it to a malicious user who may [reclaim her account](https://github.com/paritytech/substrate/wiki/Reclaiming-an-index).

**FIXME** - reuse to avoid duplicate code in `show_hex_of_extrinsic` and `show_hex_of_smart_contract`

```rust
extern crate node_runtime;
extern crate sr_primitives as runtime_primitives;
extern crate srml_balances as balances;
extern crate srml_contract as contract;

use node_runtime::{UncheckedExtrinsic, Call, Runtime};

/// Display the hex value of the extrinsic
fn show_hex_of_extrinsic(raw_bytes: &[u8]) {
  let mut hex_raw_bytes = String::new();
  write!(hex_raw_bytes, "0x");
  for byte in raw_bytes {
    write!(hex_raw_bytes, "{:02x}", byte);
  }
  println!("Unchecked Extrinsic with Nonce 0: {}", hex_raw_bytes);
}

fn print_extrinsic(pair: &Pair, genesis_hash: &[u8; 32], index: u64, func: Call) {
  let pepa = AccountId::from(&pair.public().0[..]);
  let era = Era::immortal();
  let payload = (index, func.clone(), era, genesis_hash);
  let signature = pair.sign(&payload.encode()).into();
  let uxt = UncheckedExtrinsic {
    signature: Some((balances::address::Address::Id(pepa), signature, index, era)),
    function: func,
  };

  show_hex_of_extrinsic(&raw_uxt);
}

fn main() {
  ...

  /// Print the Extrinsic with Nonce 0 in encoded form where Alice would deploy Smart Contract "Adder" to the Substrate Node
  print_extrinsic(
    &pair,
    GENESIS_BLOCK_HASH,
    0,
    Call::Contract(contract::Call::create::<Runtime>(1001.into(), 9_000_000.into(), ADDER_INIT_CODE.to_vec(), Vec::new()))
  );
}
```

#### Pre-Determine the Contract Address in the Substrate Node's Runtime that the Smart Contract 'Adder' would be deployed to by Alice once Submitted

We're able to determine upfront what the Contract Address would be in the Substrate Node's Runtime if we were to actually submit an extrinsic containing the Smart Contract 'Adder' sent from Alice. Note that queries do not require a Nonce.

Add the following code to to main.rs.
```rust
fn main() {
  ...

  /// Pre-Determine upfront the Contract Address in the Substrate Node's Runtime that the Smart Contract 'Adder' would be deployed to by Alice if an extrinsic was submitted
  let addr = <Runtime as contract::Trait>::DetermineContractAddress::contract_address_for(
    &ADDER_INIT_CODE,
    &[],
    &alice,
  );
}
```

#### Print the Extrinsic with Nonce 1 of a Call to a method to Increment storage by 7 in the Smart Contract 'Adder' at the Pre-Determined Contract Address using the encoded form of the Extrinsic

We'll use the Contract Address that we pre-determined in the previous step to subsequently pre-determine what the response would be if we were to `call` a function of the Smart Contract 'Adder'.

We'll `call` the enum variant `Inc(32)` of the Smart Contract 'Adder', which **increments** the counter stored in it by a value of 7.

We'll determine the Nonce (index) associated with this `call` as follows. Assuming Alice were to submit the extrinsic that we previously generated (that would deploy the smart contract) with a Nonce (index) of 0, then if it were to be the case that this `call` were the next extrinsic that she'd submit, then it'd have a Nonce (index) of 1, so we provide an argument of 1 to `print_extrinsic`.

We'll pass a function to `call` the smart contract, and as arguments to the function we'll provide its pre-determined address `addr`, some funds to send to it `1001`, a gas limit to allocate `9_000_000`, and input data `vec![0x00, 0x07, 0x00, 0x00, 0x00])` representing the value of 7 to increment by.

The input data encodes what method to call (and associated arguments) in the smart contract. In this case it encodes the following:
* First byte `0x00` encodes the index of the `Action`, which corresponds to the [Increment](https://github.com/pepyakin/substrate-contracts-adder/blob/master/src/lib.rs#L53) `Inc(u32)` action of the smart contract.
* Last four bytes `0x07, 0x00, 0x00, 0x00` encodes the `u32` argument provided to the action, which is a value of 7.

Add the following code to to main.rs.
```rust
/// Print the Extrinsic with Nonce 1 of a Call to a method to Increment storage by 7 in the Smart Contract 'Adder' at the Pre-Determined Contract Address using the encoded form of the Extrinsic
print_extrinsic(&pair, GENESIS_BLOCK_HASH, 1, Call::Contract(contract::Call::call::<Runtime>(addr, 1001.into(), 9_000_000.into(), vec![0x00, 0x07, 0x00, 0x00, 0x00])));
```

#### Print the Pre-Determined Storage Key of the Pre-Determined Smart Contract 'Adder' Address in Substrate Database Storage

We'll pre-determine the Storage Key where the Contract Address of the Smart Contract 'Adder' that we pre-determined earlier would be stored in the Substrate Database Storage.

Add additional dependencies to **Cargo.toml**:
```toml
parity-codec = "2.1"
```

Add the following code to to **main.rs**.
```rust
extern crate parity_codec as codec;

use codec::{Encode};
use primitives::{twox_128, blake2_256};
use node_primitives::{AccountId};

use primitives::hexdisplay::HexDisplay;

/// Returns only a first part of the storage key.
///
/// Hashed by 128 bit version of xxHash.
fn first_part_of_key(k1: AccountId) -> [u8; 16] {
  let mut raw_prefix = Vec::new();
  raw_prefix.extend(b"con:sto:");
  raw_prefix.extend(Encode::encode(&k1));
  twox_128(&raw_prefix)
}

/// Returns a compound key that consist of the two parts: (prefix, `k1`) and `k2`.
///
/// The first part is hashed by xxHash and then concatenated with a 256 bit version of blake2 hash of `k2`.
fn db_key_for_contract_storage(k1: AccountId, k2: Vec<u8>) -> Vec<u8> {
  let first_part = first_part_of_key(k1);
  let second_part = blake2_256(&Encode::encode(&k2));

  let mut k = Vec::new();
  k.extend(&first_part);
  k.extend(&second_part);
  k
}

println!("DB Storage Key of Smart Contract code:");
println!("0x{}", HexDisplay::from(&db_key_for_contract_storage(addr.clone(), [1u8; 32].to_vec())));
```

#### Submit the Extrinsic with Nonce 0 using JSON-RPC and cURL to deploy Smart Contract 'Adder' to Substrate Node

**FIXME** - do we need actually use JSON-RPC using cURL to deploy the Smart Contract with Nonce 0?

We'll submit our 1st extrinsic by providing values for members of a JSON-RPC call including method `author_submitExtrinsic` and params `["<INSERT_EXTRINSIC_NONCE_0_HASH>"]` using cURL

```shell
curl -H 'Content-Type: application/json' \\
    -d '{ "jsonrpc": "2.0", "method": "author_submitExtrinsic", "params": ["<INSERT_EXTRINSIC_NONCE_0_HASH>"], "id": 0 }' \\
    -vv http://localhost:9933/
```

#### Check Pending Extrinsics until Extrinsic with Nonce 0 is Submitted

We learnt earlier that we've got to be quick at querying to see an extrinsic in the 'pending' extrinsics queue before it's submitted. Let's try it again, providing values for members of a JSON-RPC call including method `author_pendingExtrinsics` and params `[]` using cURL.

Initially in the JSON-RPC's response the `result` value will be an array containing the extrinsic hash as its value `["<INSERT_EXTRINSIC_NONCE_0_HASH>"]`. However, we'll repeating the command until the `result` value is an empty array `[]` in the value returned of `{ "jsonrpc": "2.0", "result": [], "id": 1 }` to confirm that the extrinsic was executed.
```shell
curl -H 'Content-Type: application/json' \\
    -d '{ "jsonrpc": "2.0", "method": "author_pendingExtrinsics", "params": [], "id": 0 }' \\
    -vv http://localhost:9933/
```

#### Verify Extrinsic with Nonce 0 was Submitted

We'll verify that the extrinsic with Nonce 0 was actually submitted, such that the Smart Contract 'Adder' was actually deployed.

Let's create another JSON-RPC call, and provide values for members including method `state_getStorage` and params `["<INSERT_DB_STORAGE_KEY_OF_SMART_CONTRACT>"]` using cURL.

In the JSON-RPC's response the `result` value is `0x1001000000` in the value returned of `{ "jsonrpc": "2.0", "result": "0x1001000000, "id": 0 }`. It corresponds to a value of 1 in little endian (LE) format `1000000`, which is the length of the data, and means that it worked
```shell
curl -H 'Content-Type: application/json' \\
    -d '{ "jsonrpc": "2.0", "method": "state_getStorage", "params": ["<INSERT_DB_STORAGE_KEY_OF_SMART_CONTRACT>"], "id": 0 }' \\
    -vv http://localhost:9933/
```

#### Verify the Current Nonce of an Account ID

**TODO**: Show how to obtain accountNonce for an Account ID using Polkadot-JS Apps using Chain State > system > accountNonce. Also how to obtain it in the web browser inspector using the Substrate UI

**FIXME**: Update screenshot below:
![todo](https://files.readme.io/34fe214-Screen_Shot_2018-11-15_at_00.22.44.png)

#### Submit the Extrinsic with Nonce 1 using JSON-RPC with cURL

We'll submit our extrinsic with Nonce 1 by providing values for members of a JSON-RPC call including method `author_submitExtrinsic` and params `["<INSERT_EXTRINSIC_NONCE_1_HASH>"]` using cURL
```shell
curl -H 'Content-Type: application/json' \\
    -d '{ "jsonrpc": "2.0", "method": "author_submitExtrinsic", "params": ["<INSERT_EXTRINSIC_NONCE_1_HASH>"], "id": 0 }' \\
    -vv http://localhost:9933/
```

#### Check Pending Extrinsics until Extrinsic with Nonce 1 is Submitted

Repeat the previous step but this time to confirm that Nonce 1 was submitted.

#### Verify Extrinsic with Nonce 1 was Submitted

We'll verify that the extrinsic with Nonce 1 was actually submitted, such that the Smart Contract 'Adder' storage was incremented by 7.

Let's provide values for members of a JSON-RPC call including method `state_getStorage` and params `["<INSERT_DB_STORAGE_KEY_OF_SMART_CONTRACT>"]` using cURL. In the JSON-RPC's response the `result` value is `0x1007000000` in the value returned of `{ "jsonrpc": "2.0", "result": "0x1007000000, "id": 0 }`. It corresponds to a value of 1 in little endian (LE) format `7000000`, which means that it successfully incremented the storage by a value of 7.

```shell
curl -H 'Content-Type: application/json' \\
    -d '{ "jsonrpc": "2.0", "method": "state_getStorage", "params": ["<INSERT_DB_STORAGE_KEY_OF_SMART_CONTRACT>"], "id": 0 }' \\
    -vv http://localhost:9933/
```

## Step 8: Deploy and Call Smart Contract "Adder" to Substrate Node using JavaScript Promises and RxJS

**TODO**: We're in the process of adding this to the [Examples section of Polkadot-JS API Docs](https://polkadot.js.org/api/) in [PR#331](https://github.com/polkadot-js/api/pull/331).

---
title: "Deploying a Smart Contract on a Substrate Node Chain"
---
[block:callout]
{
  "type": "info",
  "body": "Substrate is a rapidly evolving project, which means that breaking changes may cause you problems when trying to follow the instructions below. Feel free to [contact us](https://www.parity.io/contact/) with any problems you encounter.",
  "title": "Troubleshooting"
}
[/block]
This document will walk you through steps used in the demo that [Sergei Shulepov and Dr Gavin Wood presented at the 2018 Dotcon-0 during the Web3 Summit](https://youtu.be/26ucTSSaqog?t=5298), showing off how you can create a Substrate Node, integrate the Substrate SRML 'Contracts' Module into the Substrate Node's Runtime, and then deploy a WASM-compiled Rust Smart Contract to the Substrate Node in less than 30 min.

In addition, we will show how to use the [Polkadot-JS Apps](https://polkadot.js.org/apps/next/) UI to simplify your workflow interacting with Substrate PoC-3, and how to use the [Polkadot-JS API](https://polkadot.js.org/api/) to learn to author your own custom Dapps that interact with Substrate using JavaScript with a choice of using Promises or RxJS.

This tutorial will be written for a Mac OS X machine, and may require some tweaks to get it working on other operating systems.

## Prerequisites

### Setup Directories for Code
We'll be using code from the following Parity Github repositories:
* [https://github.com/paritytech](https://github.com/paritytech)
* [https://github.com/polkadot-js](https://github.com/polkadot-js)

So we'll start by creating subdirectories to organise the code that we'll be downloading from them. We'll namespace them to match the Github usernames:
[block:code]
{
  "codes": [
    {
      "code": "mkdir -p ~/code/paritytech ~/code/polkadot-js;",
      "language": "shell"
    }
  ]
}
[/block]
### Setup Substrate Node and Substrate UI

Run the following command to install Substrate.
[block:code]
{
  "codes": [
    {
      "code": "cd ~/code/paritytech;\ncurl https://getsubstrate.io -sSf | sh",
      "language": "shell"
    }
  ]
}
[/block]
You will also need to set up a few more repositories into your working folder which were used in the demo:

 * [Substrate Node Template](https://github.com/paritytech/substrate-node-template)
 * [Substrate UI](https://github.com/paritytech/substrate-ui)
 * [Polkadot-JS Apps](https://github.com/polkadot-js/apps)

You can do that with some [script aliases](https://github.com/paritytech/substrate-up) that were loaded on your machine:
[block:code]
{
  "codes": [
    {
      "code": "cd ~/code/paritytech;\nsubstrate-node-new my-substrate-node-template-1 my-name\nsubstrate-ui-new substrate my-substrate-node-template-1",
      "language": "shell"
    }
  ]
}
[/block]
This will create folders called 'my-substrate-node-template-1' and 'substrate-ui' within directory ~/code/paritytech, with the corresponding repositories cloned in them. You can of course rename your projects in these commands, but for the sake of the clarity, we will continue with these folder names.

#### Setup Polkadot-JS Apps

We'll also run a couple of other script aliases to install necessary dependencies (Xcode Command Line Tools, Homebrew, Homebrew Cask, RBEnv, Ruby, NVM and Node.js latest LTS, Yarn,) and create a folder called `apps` within directory ~/code/polkadot-js, containing a clone of the Polkadot-JS Apps repository with a branch that supports PoC-3:
[block:code]
{
  "codes": [
    {
      "code": "cd ~/code/polkadot-js;\npolkadot-js-dependencies;\npolkadot-js-apps-new",
      "language": "shell"
    }
  ]
}
[/block]
* **FIXME**: usage of above scripts subject to approval of associated [PRs](https://github.com/paritytech/substrate-up/pulls)

### View and Run the Rust Program Demo

#### View Rust Code (Easy)
We've bundled all the code samples from this guide in the following [Substrate branch 'deploy-smart-contract-adder'](https://github.com/paritytech/substrate/compare/deploy-smart-contract-adder?expand=1) that you may view in the browser.

#### Run Rust Program (Advanced) <a name="run-rust-program"></a>

Once Substrate is installed. Switch to branch 'deploy-smart-contract-adder', run relevant Git commands that you are familiar with to rebase or merge the latest changes in the 'master' branch into 'deploy-smart-contract-adder'. We'll run yet another script alias 'substrate-dependencies' to install or update necessary Substrate dependencies, and then build and run the program:
[block:code]
{
  "codes": [
    {
      "code": "cd ~/code/paritytech;\ngit clone https://github.com/paritytech/substrate;\ncd substrate;\ngit fetch origin deploy-smart-contract-adder:deploy-smart-contract-adder;\ngit checkout master;\ngit pull --rebase origin master;\ngit checkout deploy-smart-contract-adder;\ngit merge master;\nsubstrate-dependencies;\n./scripts/build.sh;\ncargo build;\ncargo run -p deploy-smart-contract-adder",
      "language": "shell"
    }
  ]
}
[/block]
* **FIXME** - the above rebase/merge from 'master' branch gets Substrate version 0.1.0, whereas using the shell script retrieves version 0.9.0

## Step 1: Integrate Substrate SRML 'Contracts' Module into Substrate Node Runtime

We want to build upon 'smart contract' mechanism dependencies, so we've gone for the most convenient option of cloning the [ParityTech Substrate](https://github.com/paritytech/substrate) repo, which contains **Substrate Core** with the **Substrate (<<glossary:SRML>>)**, including a 'Contracts' Module.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/d9889e8-Screen_Shot_2018-11-18_at_15.31.36.png",
        "Screen Shot 2018-11-18 at 15.31.36.png",
        2206,
        1084,
        "#fafafa"
      ],
      "caption": "Source: https://youtu.be/0IoUZdDi5Is?t=1470"
    }
  ]
}
[/block]
The [Substrate Node Template](https://github.com/paritytech/substrate-node-template) however only includes a minimal Substrate Node chain, so if we had chose to build upon that instead we'd have had to plugin the 'Contracts' Module manually.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/ff3a66e-53b8dc8-Screen_Shot_2018-11-18_at_15.31.20.png",
        "53b8dc8-Screen_Shot_2018-11-18_at_15.31.20.png",
        1890,
        1120,
        "#faf7f9"
      ],
      "caption": "Source: https://youtu.be/0IoUZdDi5Is?t=1377"
    }
  ]
}
[/block]
## Step 2: Launch a Substrate Node Blockchain

If you have set up everything correctly, you can now start a Substrate dev chain! In directory 'my-substrate-node-template-1' run the following and it will be published on [Telemetry](https://telemetry.polkadot.io):
[block:code]
{
  "codes": [
    {
      "code": "cd ~/code/paritytech/my-substrate-node-template-1;\n./target/release/my-substrate-node-template-1 \\\n  --dev \\\n  --telemetry-url ws://telemetry.polkadot.io:1024",
      "language": "shell"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "body": "If you run into an error like `Error: UnknownBlock: Unknown block Hash(...)`, you will need to purge the chain files on your computer, with either of the following commands: `cargo run -- --dev purge-chain --dev` or `rm -rf ~/Library/Application\\ Support/Substrate/chains/development/`",
  "title": "Purge the Chain Database"
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "cargo run -- --dev purge-chain --dev",
      "language": "shell"
    }
  ]
}
[/block]
If everything is working it should start producing blocks, as shown below:
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/4876514-Screen_Shot_2018-11-16_at_11.28.02.png",
        "Screen Shot 2018-11-16 at 11.28.02.png",
        1524,
        794,
        "#181818"
      ]
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "If you want to stop running your Substrate node, you can press CTRL+C, however it will not kill the process immediately. You can kill it immediately with the following command:",
  "title": "Kill Substrate Node"
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "ps aux | grep ./target/release | awk 'NR==1{print $2}' | sudo xargs kill -9",
      "language": "shell"
    }
  ]
}
[/block]
## Step 3: Launch UI of Polkadot-JS Apps

To interact with the Substrate Node, we'll start the UI of Polkadot JS Apps.
[block:code]
{
  "codes": [
    {
      "code": "cd ~/code/polkadot-js/apps;\nyarn run start;",
      "language": "shell"
    }
  ]
}
[/block]
Open your browser to http://localhost:3000.

Go to the 'Settings' menu item. Select option 'Local Node (127.0.0.1:9944)', then click 'Save & Reload'.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/d75fe2b-Screen_Shot_2018-11-14_at_13.59.34.png",
        "Screen Shot 2018-11-14 at 13.59.34.png",
        1262,
        654,
        "#cfd1d2"
      ]
    }
  ]
}
[/block]
It will connect to the local Substrate Node that you're running and update the UI with additional menu items, as shown below:
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/e2836dc-Screen_Shot_2018-11-16_at_11.02.31.png",
        "Screen Shot 2018-11-16 at 11.02.31.png",
        1012,
        1228,
        "#cccdcd"
      ]
    }
  ]
}
[/block]
## Step 4: Obtain Block Hash of Genesis Block using JSON-RPC

### Option 1: Interact with Polkadot-JS Apps

Let's go to the 'Chain state' menu item and create JSON-RPC calls to the Substrate Node and display the response below. Select 'system' and 'blockHash(BlockNumber): Hash' from the selection boxes, as shown below, and enter value '0' for the 'BlockNumber' label. Lastly click the blue '+' button, and the response will display below. If you click the red 'x' button it removes the response.

* **FIXME** - update the screenshot below when running local node, after this issue resolved https://github.com/polkadot-js/apps/issues/451
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/e6dcf33-Screen_Shot_2018-11-14_at_14.15.50.png",
        "Screen Shot 2018-11-14 at 14.15.50.png",
        1718,
        708,
        "#e3e2e3"
      ]
    }
  ]
}
[/block]
### Option 2: Interact using cURL

Alternatively we can fetch the block hash of the genesis block in the Substrate Node by using cURL to perform a JSON-RPC call that contains a JSON-RPC request object with members including method `state_getBlockHash` and params `[0]` (the genesis block).
[block:code]
{
  "codes": [
    {
      "code": "curl -H 'Content-Type: application/json' \\\n     -d '{ \"jsonrpc\": \"2.0\", \"method\":\"chain_getBlockHash\", \"params\":[0], \"id\": 1 }' \\\n     -vv http://127.0.0.1:9933/",
      "language": "curl"
    }
  ]
}
[/block]
We'll receive a [JSON-RPC response object](https://www.jsonrpc.org/specification#response_object) as follows, where the 'result' member contains the block hash:
[block:code]
{
  "codes": [
    {
      "code": "{\"jsonrpc\":\"2.0\",\"result\":\"0x0000fcb6a13183bf24669dc6d66ad80eaf20ee17e3712ba79b0285c2b42adc79\",\"id\":1}",
      "language": "curl"
    }
  ]
}
[/block]
## Step 5: About the Smart Contract 'Adder' Rust program

The Smart Contract 'Adder' is a basic counter that has two actions that we can execute:
* `Inc(u32)` function that increments the counter by the value of the parameter provided;
* `Get` function that returns the current counter value

When the contract is executed, we read the input data, decode it into an action using the `Action` enumeration, then depending on the action we execute it as follows:
* `Action::Inc(by)`: We query the extrinsic storage using the counter key, then decode and return the resultant u32 value (if any), or return a value of 0 if no value exists yet. We then increment the value by the u32 `by` value that we specified. Lastly we encode the incremented value as u32 and set the updated extrinsic counter key value in storage.
* `Action::Get`: We simply query the extrinsics storage using the counter key and return that value.

* Extracted code snippets from the [Smart Contract 'Adder'](https://github.com/pepyakin/substrate-contracts-adder/blob/master/src/lib.rs) are shown below:

[block:code]
{
  "codes": [
    {
      "code": "...\n\nenum Action {\n    Inc(u32),\n    Get,\n}\n\nstatic COUNTER_KEY: ext::Key = ext::Key([1; 32]);\n\n...\n\npub extern \"C\" fn call() {\n    let input = ext::input();\n    let action = Action::decode(&mut &input[..]).unwrap();\n\n    match action {\n        Action::Inc(by) => {\n            let mut counter = ext::get_storage(&COUNTER_KEY).and_then(|v| u32::decode(&mut &v[..])).unwrap_or(0);\n            counter += by;\n            ext::set_storage(&COUNTER_KEY, Some(&u32::encode(&counter)));\n        }\n        Action::Get => {\n            let raw_counter = ext::get_storage(&COUNTER_KEY).unwrap_or(vec![]);\n            ext::return_(&raw_counter);\n        }\n    }\n}",
      "language": "rust"
    }
  ]
}
[/block]
## Step 6: Generate WASM file from Smart Contract 'Adder' Rust program

Let's clone the 'Adder' Smart Contract Rust library, and compile its Rust code into a WASM file using the provided `./build.sh` Shell script, which runs a `wasm-build` command from the [wasm-utils](https://github.com/paritytech/wasm-utils) repository. The generated WASM file will be located in ~/substrate-contracts-adder/target/wasm32-unknown-unknown/release/substrate_contracts_adder.wasm
[block:code]
{
  "codes": [
    {
      "code": "git clone https://github.com/pepyakin/substrate-contracts-adder;\ncd substrate-contracts-adder;\n./build.sh",
      "language": "shell"
    }
  ]
}
[/block]
## Step 7: Create Extrinsic and Deploy Smart Contract 'Adder' to Substrate Node

### Option 1: Interact using UI of Polkadot-JS Apps (Easy)

#### Load the in-built Alice account from Substrate
If you're running the Substrate Node on your local machine then the in-built accounts including Alice will be pre-loaded, as shown below in the 'Accounts' menu item:
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/beb78b0-Screen_Shot_2018-11-16_at_14.34.23.png",
        "Screen Shot 2018-11-16 at 14.34.23.png",
        1254,
        602,
        "#d4d0d1"
      ]
    }
  ]
}
[/block]
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
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/dce4586-Screen_Shot_2018-11-15_at_01.33.05.png",
        "Screen Shot 2018-11-15 at 01.33.05.png",
        1624,
        962,
        "#e0e1e1"
      ]
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "Pending Extrinsics",
  "body": "If you're quick enough at querying the 'pending' extrinsics (after clicking Sign & Submit) then you'll see the extrinsic go in and out of the 'pending' extrinsics queue in the response. We'll use the 'Raw RPC' menu item at https://localhost:3000/#/rpc in the section \"author > pendingExtrinsics\" to make the query."
}
[/block]
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
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/3d96754-Screen_Shot_2018-11-15_at_01.34.00.png",
        "Screen Shot 2018-11-15 at 01.34.00.png",
        1626,
        962,
        "#e0e0e1"
      ]
    }
  ]
}
[/block]
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
[block:code]
{
  "codes": [
    {
      "code": "cd ~/code/paritytech;\ngit clone https://github.com/paritytech/substrate;\ncd substrate;\ngit fetch origin master;\ngit checkout -b deploy-smart-contract-adder;\nsubstrate-dependencies;\n./scripts/build.sh;\ncargo build;",
      "language": "shell"
    }
  ]
}
[/block]
We're ready to [create a new Rust program](https://doc.rust-lang.org/cargo/guide/creating-a-new-project.html).
[block:code]
{
  "codes": [
    {
      "code": "cd ~/code/paritytech/substrate;\ncargo new examples/deploy-smart-contract-adder --bin",
      "language": "shell"
    }
  ]
}
[/block]
Add dependencies to Cargo.toml
[block:code]
{
  "codes": [
    {
      "code": "[package]\nname = \"deploy-smart-contract-adder\"\nversion = \"0.1.0\"\nauthors = [\"Parity Technologies <admin@parity.io>\"]\ndescription = \"Substrate Deploy Smart Contract.\"\n\n[dependencies]\nhex-literal = \"0.1.0\"\nhex = \"0.3\"\nsubstrate-primitives = { path = \"../../core/primitives\" }",
      "language": "toml"
    }
  ]
}
[/block]
We'll create the encoded form of an extrinsic (blob of data) to be sent from Alice that contains instructions to deploy a certain WASM smart contract.

Update main.rs (executable file of the program) ~/code/paritytech/substrate/examples/deploy-smart-contract-adder/src/main.rs, replacing <INSERT_BLOCK_HASH> with the block hash obtained in the previous step (i.e. `"0x0000fcb6a13183bf24669dc6d66ad80eaf20ee17e3712ba79b0285c2b42adc79"`)
[block:code]
{
  "codes": [
    {
      "code": "extern crate substrate_primitives as primitives;\nextern crate hex;\n\n#[macro_use]\nextern crate hex_literal;\n\nuse std::fmt::Write;\nuse primitives::hexdisplay::HexDisplay;\n\n/// Display the hex value of the smart contract\nfn show_hex_of_smart_contract(raw_bytes: &[u8]) {\n  let mut hex_raw_bytes = String::new();\n  write!(hex_raw_bytes, \"0x\");\n  for byte in raw_bytes {\n    write!(hex_raw_bytes, \"{:02x}\", byte);\n  }\n  println!(\"Smart Contract 'Adder' WASM code in hex is: {}\", hex_raw_bytes);\n}\n\nfn main() {\n  /// Add 0x-prefix to given genesis block hash.\n  const GENESIS_BLOCK_HASH: &[u8; 32] = &hex!(\"771dfd2593b2f07998e3a1ffb196f78ca583c25641a3bc844d3d6a49405acde0\");\n  println!(\"Genesis Block Hash is: 0x{}\\n\", HexDisplay::from(GENESIS_BLOCK_HASH));\n\n  /// Load Smart Contract 'Adder' WASM code into a bytes slice\n  const ADDER_INIT_CODE: &'static [u8] = include_bytes!(\"/Users/YOUR_USERNAME/code/src/pepyakin/substrate-contracts-adder/target/wasm32-unknown-unknown/release/substrate_contracts_adder.wasm\");\n  show_hex_of_smart_contract(&ADDER_INIT_CODE);\n}",
      "language": "rust"
    }
  ]
}
[/block]
Run the Rust program
[block:code]
{
  "codes": [
    {
      "code": "cargo run -p deploy-smart-contract-adder",
      "language": "shell"
    }
  ]
}
[/block]
Expect the terminal output to return a similar response to that shown below, but with different values that we'll make use of. The WASM code hex value will be much longer!
[block:code]
{
  "codes": [
    {
      "code": "Genesis Block Hash is: 0x771dfd2593b2f07998e3a1ffb196f78ca583c25641a3bc844d3d6a49405acde0\n\nSmart Contract 'Adder' WASM code in hex is: 0x0061...7079",
      "language": "text"
    }
  ]
}
[/block]
#### Load In-Built Account 'Alice'

We'll update the Rust program to load the account key of an in-built account named Alice, since we'll be using her account to deploy the Smart Contract 'Adder' to the BBQ Birch PoC-3 chain.

Add additional dependencies to Cargo.toml:
[block:code]
{
  "codes": [
    {
      "code": "substrate-primitives = { path = \"../../core/primitives\" }\nsubstrate-keyring = { path = \"../../core/keyring\" }\nnode-primitives = { path = \"../../node/primitives\" }",
      "language": "toml"
    }
  ]
}
[/block]
Add these functions to main.rs
[block:code]
{
  "codes": [
    {
      "code": "/// Get Alice's account public key\nfn get_alice_public_key() -> AccountId {\n  AccountId::from(Keyring::Alice.to_raw_public())\n}\n\nfn main() {\n  ...\n\n  /// Get Alice's account key\n  let pair = Pair::from(Keyring::from_public(Public::from_raw(get_alice_public_key().clone().into())).unwrap());\n  let alice = AccountId::from(&pair.public().0[..]);\n  println!(\"Alice's Account Key is: {:?} ({})\\n\", alice, keyring::ed25519::Public(alice.0).to_ss58check());\n}",
      "language": "rust"
    }
  ]
}
[/block]
#### Print an Extrinsic with Nonce 0 in encoded form where Alice would deploy Smart Contract 'Adder' to the Substrate Node

We'll create the encoded form of an extrinsic (blob of data) sent from Alice that contains instructions to deploy a certain WASM smart contract.

Add additional dependencies to Cargo.toml:
[block:code]
{
  "codes": [
    {
      "code": "node-runtime = { path = \"../../node/runtime\" }\nsr-primitives = { path = \"../../core/sr-primitives\" }\nsrml-balances = { path = \"../../srml/balances\" }\nsrml-contract = { path = \"../../srml/contract\" }",
      "language": "toml"
    }
  ]
}
[/block]
Add the following code to to main.rs that we've explained for you below.

It creates an unchecked extrinsic that's signed with Alice's public key pair. It's been provided with a Nonce (index) value of `0`, assuming this will be the first extrinsic that we'll have submitted to the chain using Alice's account. We'll also provide it with a function call to `create` a contract using the Substrate runtime that has arguments including the funds to send `1001` to the contract, gas limit to allocate `9_000_000` to the extrinsic, and the bytes of the Smart Contract 'Adder' as data. 

Note importantly that the `create` function is just an enum variant, it's not a function, so no call to create the contract is performed until we actually submit the extrinsic with a JSON-RPC call. 

We've provided it with an era that has an indefinite (immortal) period, which is dangerous since we're using the first index. It means the transaction is not protected from replay attacks. 
[block:callout]
{
  "type": "danger",
  "title": "Transaction Eras in Substrate",
  "body": "We really should be taking advantage of Substrate's **Transaction Eras** so that the transaction is only valid for a certain period of time, as this protects Alice's account from being subjected to malicious replay attacks on the first index if her account is deleted along with its Nonce (enumeration index), perhaps due to insufficient funds, and exposing it to a malicious user who may [reclaim her account](https://github.com/paritytech/substrate/wiki/Reclaiming-an-index)."
}
[/block]
**FIXME** - reuse to avoid duplicate code in `show_hex_of_extrinsic` and `show_hex_of_smart_contract`
[block:code]
{
  "codes": [
    {
      "code": "extern crate node_runtime;\nextern crate sr_primitives as runtime_primitives;\nextern crate srml_balances as balances;\nextern crate srml_contract as contract;\n\nuse node_runtime::{UncheckedExtrinsic, Call, Runtime};\n\n/// Display the hex value of the extrinsic\nfn show_hex_of_extrinsic(raw_bytes: &[u8]) {\n  let mut hex_raw_bytes = String::new();\n  write!(hex_raw_bytes, \"0x\");\n  for byte in raw_bytes {\n    write!(hex_raw_bytes, \"{:02x}\", byte);\n  }\n  println!(\"Unchecked Extrinsic with Nonce 0: {}\", hex_raw_bytes);\n}\n\nfn print_extrinsic(pair: &Pair, genesis_hash: &[u8; 32], index: u64, func: Call) {\n  let pepa = AccountId::from(&pair.public().0[..]);\n  let era = Era::immortal();\n  let payload = (index, func.clone(), era, genesis_hash);\n  let signature = pair.sign(&payload.encode()).into();\n  let uxt = UncheckedExtrinsic {\n    signature: Some((balances::address::Address::Id(pepa), signature, index, era)),\n    function: func,\n  };\n\n  show_hex_of_extrinsic(&raw_uxt);\n}\n\nfn main() {\n  ...\n\n  /// Print the Extrinsic with Nonce 0 in encoded form where Alice would deploy Smart Contract \"Adder\" to the Substrate Node\n  print_extrinsic(\n    &pair,\n    GENESIS_BLOCK_HASH, \n    0, \n    Call::Contract(contract::Call::create::<Runtime>(1001.into(), 9_000_000.into(), ADDER_INIT_CODE.to_vec(), Vec::new()))\n  );\n}",
      "language": "rust"
    }
  ]
}
[/block]
#### Pre-Determine the Contract Address in the Substrate Node's Runtime that the Smart Contract 'Adder' would be deployed to by Alice once Submitted

We're able to determine upfront what the Contract Address would be in the Substrate Node's Runtime if we were to actually submit an extrinsic containing the Smart Contract 'Adder' sent from Alice. Note that queries do not require a Nonce.

Add the following code to to main.rs.
[block:code]
{
  "codes": [
    {
      "code": "fn main() {\n  ...\n\n  /// Pre-Determine upfront the Contract Address in the Substrate Node's Runtime that the Smart Contract 'Adder' would be deployed to by Alice if an extrinsic was submitted\n  let addr = <Runtime as contract::Trait>::DetermineContractAddress::contract_address_for(\n    &ADDER_INIT_CODE,\n    &[],\n    &alice,\n  );\n}",
      "language": "rust"
    }
  ]
}
[/block]
#### Print the Extrinsic with Nonce 1 of a Call to a method to Increment storage by 7 in the Smart Contract 'Adder' at the Pre-Determined Contract Address using the encoded form of the Extrinsic

We'll use the Contract Address that we pre-determined in the previous step to subsequently pre-determine what the response would be if we were to `call` a function of the Smart Contract 'Adder'.

We'll `call` the enum variant `Inc(32)` of the Smart Contract 'Adder', which **increments** the counter stored in it by a value of 7.

We'll determine the Nonce (index) associated with this `call` as follows. Assuming Alice were to submit the extrinsic that we previously generated (that would deploy the smart contract) with a Nonce (index) of 0, then if it were to be the case that this `call` were the next extrinsic that she'd submit, then it'd have a Nonce (index) of 1, so we provide an argument of 1 to `print_extrinsic`.

We'll pass a function to `call` the smart contract, and as arguments to the function we'll provide its pre-determined address `addr`, some funds to send to it `1001`, a gas limit to allocate `9_000_000`, and input data `vec![0x00, 0x07, 0x00, 0x00, 0x00])` representing the value of 7 to increment by.

The input data encodes what method to call (and associated arguments) in the smart contract. In this case it encodes the following:
* First byte `0x00` encodes the index of the `Action`, which corresponds to the [Increment](https://github.com/pepyakin/substrate-contracts-adder/blob/master/src/lib.rs#L53) `Inc(u32)` action of the smart contract. 
* Last four bytes `0x07, 0x00, 0x00, 0x00` encodes the `u32` argument provided to the action, which is a value of 7.

Add the following code to to main.rs.
[block:code]
{
  "codes": [
    {
      "code": "/// Print the Extrinsic with Nonce 1 of a Call to a method to Increment storage by 7 in the Smart Contract 'Adder' at the Pre-Determined Contract Address using the encoded form of the Extrinsic\nprint_extrinsic(&pair, GENESIS_BLOCK_HASH, 1, Call::Contract(contract::Call::call::<Runtime>(addr, 1001.into(), 9_000_000.into(), vec![0x00, 0x07, 0x00, 0x00, 0x00])));",
      "language": "rust"
    }
  ]
}
[/block]
#### Print the Pre-Determined Storage Key of the Pre-Determined Smart Contract 'Adder' Address in Substrate Database Storage

We'll pre-determine the Storage Key where the Contract Address of the Smart Contract 'Adder' that we pre-determined earlier would be stored in the Substrate Database Storage.

Add additional dependencies to **Cargo.toml**:
[block:code]
{
  "codes": [
    {
      "code": "parity-codec = \"2.1\"",
      "language": "toml"
    }
  ]
}
[/block]
Add the following code to to **main.rs**.
[block:code]
{
  "codes": [
    {
      "code": "extern crate parity_codec as codec;\n\nuse codec::{Encode};\nuse primitives::{twox_128, blake2_256};\nuse node_primitives::{AccountId};\n\nuse primitives::hexdisplay::HexDisplay;\n\n/// Returns only a first part of the storage key.\n///\n/// Hashed by 128 bit version of xxHash.\nfn first_part_of_key(k1: AccountId) -> [u8; 16] {\n  let mut raw_prefix = Vec::new();\n  raw_prefix.extend(b\"con:sto:\");\n  raw_prefix.extend(Encode::encode(&k1));\n  twox_128(&raw_prefix)\n}\n\n/// Returns a compound key that consist of the two parts: (prefix, `k1`) and `k2`.\n///\n/// The first part is hashed by xxHash and then concatenated with a 256 bit version of blake2 hash of `k2`.\nfn db_key_for_contract_storage(k1: AccountId, k2: Vec<u8>) -> Vec<u8> {\n  let first_part = first_part_of_key(k1);\n  let second_part = blake2_256(&Encode::encode(&k2));\n\n  let mut k = Vec::new();\n  k.extend(&first_part);\n  k.extend(&second_part);\n  k\n}\n\nprintln!(\"DB Storage Key of Smart Contract code:\");\nprintln!(\"0x{}\", HexDisplay::from(&db_key_for_contract_storage(addr.clone(), [1u8; 32].to_vec())));",
      "language": "rust"
    }
  ]
}
[/block]
#### Submit the Extrinsic with Nonce 0 using JSON-RPC and cURL to deploy Smart Contract 'Adder' to Substrate Node

**FIXME** - do we need actually use JSON-RPC using cURL to deploy the Smart Contract with Nonce 0?

We'll submit our 1st extrinsic by providing values for members of a JSON-RPC call including method `author_submitExtrinsic` and params `["<INSERT_EXTRINSIC_NONCE_0_HASH>"]` using cURL
[block:code]
{
  "codes": [
    {
      "code": "curl -H 'Content-Type: application/json' \\\n    -d '{ \"jsonrpc\": \"2.0\", \"method\": \"author_submitExtrinsic\", \"params\": [\"<INSERT_EXTRINSIC_NONCE_0_HASH>\"], \"id\": 0 }' \\\n    -vv http://localhost:9933/",
      "language": "curl"
    }
  ]
}
[/block]
#### Check Pending Extrinsics until Extrinsic with Nonce 0 is Submitted

We learnt earlier that we've got to be quick at querying to see an extrinsic in the 'pending' extrinsics queue before it's submitted. Let's try it again, providing values for members of a JSON-RPC call including method `author_pendingExtrinsics` and params `[]` using cURL.

Initially in the JSON-RPC's response the `result` value will be an array containing the extrinsic hash as its value `["<INSERT_EXTRINSIC_NONCE_0_HASH>"]`. However, we'll repeating the command until the `result` value is an empty array `[]` in the value returned of `{ "jsonrpc": "2.0", "result": [], "id": 1 }` to confirm that the extrinsic was executed.
[block:code]
{
  "codes": [
    {
      "code": "curl -H 'Content-Type: application/json' \\\n    -d '{ \"jsonrpc\": \"2.0\", \"method\": \"author_pendingExtrinsics\", \"params\": [], \"id\": 0 }' \\\n    -vv http://localhost:9933/",
      "language": "curl"
    }
  ]
}
[/block]
#### Verify Extrinsic with Nonce 0 was Submitted

We'll verify that the extrinsic with Nonce 0 was actually submitted, such that the Smart Contract 'Adder' was actually deployed.

Let's create another JSON-RPC call, and provide values for members including method `state_getStorage` and params `["<INSERT_DB_STORAGE_KEY_OF_SMART_CONTRACT>"]` using cURL.

In the JSON-RPC's response the `result` value is `0x1001000000` in the value returned of `{ "jsonrpc": "2.0", "result": "0x1001000000, "id": 0 }`. It corresponds to a value of 1 in little endian (LE) format `1000000`, which is the length of the data, and means that it worked
[block:code]
{
  "codes": [
    {
      "code": "curl -H 'Content-Type: application/json' \\\n    -d '{ \"jsonrpc\": \"2.0\", \"method\": \"state_getStorage\", \"params\": [\"<INSERT_DB_STORAGE_KEY_OF_SMART_CONTRACT>\"], \"id\": 0 }' \\\n    -vv http://localhost:9933/",
      "language": "curl"
    }
  ]
}
[/block]
#### Verify the Current Nonce of an Account ID

**TODO**: Show how to obtain accountNonce for an Account ID using Polkadot-JS Apps using Chain State > system > accountNonce. Also how to obtain it in the web browser inspector using the Substrate UI

**FIXME**: Update screenshot below:
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/34fe214-Screen_Shot_2018-11-15_at_00.22.44.png",
        "Screen Shot 2018-11-15 at 00.22.44.png",
        1694,
        706,
        "#e2e2e2"
      ]
    }
  ]
}
[/block]
#### Submit the Extrinsic with Nonce 1 using JSON-RPC with cURL

We'll submit our extrinsic with Nonce 1 by providing values for members of a JSON-RPC call including method `author_submitExtrinsic` and params `["<INSERT_EXTRINSIC_NONCE_1_HASH>"]` using cURL
[block:code]
{
  "codes": [
    {
      "code": "curl -H 'Content-Type: application/json' \\\n    -d '{ \"jsonrpc\": \"2.0\", \"method\": \"author_submitExtrinsic\", \"params\": [\"<INSERT_EXTRINSIC_NONCE_1_HASH>\"], \"id\": 0 }' \\\n    -vv http://localhost:9933/",
      "language": "curl"
    }
  ]
}
[/block]
#### Check Pending Extrinsics until Extrinsic with Nonce 1 is Submitted

Repeat the previous step but this time to confirm that Nonce 1 was submitted.

#### Verify Extrinsic with Nonce 1 was Submitted

We'll verify that the extrinsic with Nonce 1 was actually submitted, such that the Smart Contract 'Adder' storage was incremented by 7.

Let's provide values for members of a JSON-RPC call including method `state_getStorage` and params `["<INSERT_DB_STORAGE_KEY_OF_SMART_CONTRACT>"]` using cURL. In the JSON-RPC's response the `result` value is `0x1007000000` in the value returned of `{ "jsonrpc": "2.0", "result": "0x1007000000, "id": 0 }`. It corresponds to a value of 1 in little endian (LE) format `7000000`, which means that it successfully incremented the storage by a value of 7.
[block:code]
{
  "codes": [
    {
      "code": "curl -H 'Content-Type: application/json' \\\n    -d '{ \"jsonrpc\": \"2.0\", \"method\": \"state_getStorage\", \"params\": [\"<INSERT_DB_STORAGE_KEY_OF_SMART_CONTRACT>\"], \"id\": 0 }' \\\n    -vv http://localhost:9933/",
      "language": "curl"
    }
  ]
}
[/block]
## Step 8: Deploy and Call Smart Contract "Adder" to Substrate Node using JavaScript Promises and RxJS

**TODO**: We're in the process of adding this to the [Examples section of Polkadot-JS API Docs](https://polkadot.js.org/api/) in [PR#331](https://github.com/polkadot-js/api/pull/331).
---
title: "Governance \"Public\" Mechanism with a Substrate Node Chain"
excerpt: ""
---
[block:callout]
{
  "type": "info",
  "title": "Troubleshooting",
  "body": "Substrate is a rapidly evolving project, which means that breaking changes may cause you problems when trying to follow the instructions below. Feel free to [contact us](https://www.parity.io/contact/) with any problems you encounter."
}
[/block]
This document will walk you through steps to create a Substrate Node, integrate the Substrate SRML 'Referenda' Module into the Substrate Node's Runtime, and then create a "public" referendum for approval using [Polkadot-JS Apps](https://polkadot.js.org/apps/next/).

We apply governance mechanisms discussed by [Dr Gavin Wood at EdCon Toronto](https://youtu.be/VsZuDJMmVPY?t=24732) where the runtime was changed (see screenshot below). 

We also explore and reflect upon concepts covered in [Substrate: A Rustic Vision for Polkadot by Dr Gavin Wood at Web3 Summit 2018](https://www.youtube.com/watch?v=0IoUZdDi5Is) where he [created a custom Substrate chain](https://substrate.readme.io/v1.0.0/docs/creating-a-custom-substrate-chain).
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/160cde4-Screen_Shot_2018-11-27_at_22.07.35.png",
        "Screen Shot 2018-11-27 at 22.07.35.png",
        2856,
        1526,
        "#d4d4d4"
      ],
      "caption": "Source: https://youtu.be/VsZuDJMmVPY?t=25194"
    }
  ]
}
[/block]
This tutorial will be written for a Mac OS X machine, and may require some tweaks to get it working on other operating systems.

## Prerequisites

### Setup Code Directories
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
### Setup Substrate Node

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
 * [Polkadot-JS Apps](https://github.com/polkadot-js/apps)

You can do that with some [script aliases](https://github.com/paritytech/substrate-up) that were loaded on your machine:
[block:code]
{
  "codes": [
    {
      "code": "cd ~/code/paritytech;\nsubstrate-node-new my-substrate-node-template-1 my-name",
      "language": "shell"
    }
  ]
}
[/block]
This will create a folder called 'my-substrate-node-template-1' within directory ~/code/paritytech, with the corresponding repository cloned inside. You can of course rename your projects in these commands, but for the sake of the clarity, we will continue with these folder names.

With minimum effort, we've just setup a Substrate Node chain.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/723793b-Screen_Shot_2018-11-18_at_15.29.52.png",
        "Screen Shot 2018-11-18 at 15.29.52.png",
        2012,
        1156,
        "#f3f2f2"
      ],
      "caption": "Source: https://youtu.be/0IoUZdDi5Is?t=415"
    }
  ]
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/790ee2a-Screen_Shot_2018-11-18_at_15.31.36.png",
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
### Setup Polkadot-JS Apps

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

* **FIXME**: Talk about how Polkadot-JS Apps needs to be dynamic, checking what SRML modules are being used by the connected chain and only showing the relevant ones in the UI

## Step 1: Integrate Substrate SRML 'Referenda' Module into Substrate Node Runtime

We're keen to use some governance mechanisms, but we're stumped because we can't find anything 'governance' related in the [Substrate Node Template](https://github.com/paritytech/substrate-node-template) code that we used to create a minimal **Substrate Node chain**.

Fortunately we were tipped by an insider who confirmed that the 'governance' modules that we need aren't yet contained in the Substrate Node's Runtime that we setup in the directory '~/code/paritytech/my-substrate-node-template-1'.

We're reminded of the advantages of the **Substrate (<<glossary:SRML>>)**. We'd like to plugin the 'Referenda' Module and associated configuration from this library into our **Substrate Node's** Runtime, and then tweak it to our liking.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/bd2f854-53b8dc8-Screen_Shot_2018-11-18_at_15.31.20.png",
        "53b8dc8-Screen_Shot_2018-11-18_at_15.31.20.png",
        1890,
        1120,
        "#faf7f9"
      ],
      "caption": "Source: [SRML Modules](https://youtu.be/0IoUZdDi5Is?t=1377)"
    }
  ]
}
[/block]
* **FIXME**: Integrate 'governance' module and configuration into the Runtime of 'my-substrate-node-template-1'

## Step 2: Modify Governance Configuration

* **FIXME**: show how to [increase the Voting Period](https://github.com/polkadot-js/apps/wiki/Troubleshooting) before running the Substrate Node, and how to change the value when using https://github.com/paritytech/substrate-node-template in the integrated 'governance' module and configuration

## Step 3: Launch a Substrate Node Blockchain

If you have set up everything correctly, you can now start a Substrate dev chain! In directory 'my-substrate-node-template-1' run:
[block:code]
{
  "codes": [
    {
      "code": "cd ~/code/paritytech/my-substrate-node-template-1;\n./target/release/my-substrate-node-template-1 \\\n\t--dev \\\n  --telemetry-url ws://telemetry.polkadot.io:1024",
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
        "https://files.readme.io/5ddb46f-4876514-Screen_Shot_2018-11-16_at_11.28.02.png",
        "4876514-Screen_Shot_2018-11-16_at_11.28.02.png",
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
  "title": "Kill Substrate Node",
  "body": "If you want to stop running your Substrate node, you can press CTRL+C, however it will not kill the process immediately. You can kill it immediately with the following command:"
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
## Step 4: Launch UI of Polkadot-JS Apps

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
        "https://files.readme.io/a310b82-d75fe2b-Screen_Shot_2018-11-14_at_13.59.34.png",
        "d75fe2b-Screen_Shot_2018-11-14_at_13.59.34.png",
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
        "https://files.readme.io/4fcefa3-e2836dc-Screen_Shot_2018-11-16_at_11.02.31.png",
        "e2836dc-Screen_Shot_2018-11-16_at_11.02.31.png",
        1012,
        1228,
        "#cccdcd"
      ]
    }
  ]
}
[/block]
## Step 6: Create a "Public" Proposal using the "Public" Mechanism
[block:callout]
{
  "type": "info",
  "title": "Creating \"Public\" Proposals",
  "body": "\"Public\" Proposals (Pre-Referendum) created by \"Public\" Authorities are Queued and then periodically the most Sponsored (aka Seconded) Proposals are elevated to the Table of Referendum where they may be voted upon. The proposer stakes a deposit (above a minimum) and sponsors must match that deposit."
}
[/block]
**Create a Proposal (motion) using the "Public" Mechanism from Charlie to change the balance of Alice's account:**
* Go to Extrinsics tab at: http://localhost:3000/#/extrinsics
* Select for "Account": CHARLIE (associated test DOT balance is shown on the right)
* Select for "Extrinsic Section": democracy
* Select for "Submit the Following Extrinsic": propose(proposal, value)
* Select for "Proposal Section": balances
* Select for "Proposal Extrinsic": setBalance(who, free, reserved)
  * Enter for "who" the address of Alice
* Enter for "value: Balance" the amount to increase the account balance by: 100
* Click "Submit Transaction" to add the extrinsic into the 'pending' extrinsics queue.
* Check that the toaster that appears says "author.submitExtrinsic sent"

* **FIXME** Update screenshot to use localhost
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/34b7f67-Screen_Shot_2018-11-18_at_09.21.21.png",
        "Screen Shot 2018-11-18 at 09.21.21.png",
        2096,
        1338,
        "#dbdcde"
      ]
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "Pending Extrinsics",
  "body": "If you're quick enough at querying the 'pending' extrinsics (after clicking Sign & Submit) then you'll see the extrinsic go in and out of the 'pending' extrinsics queue in the response. We'll use the 'Raw RPC' menu item at https://localhost:3000/#/rpc in the section \"author > pendingExtrinsics\" to make the JSON-RPC query."
}
[/block]
JSON-RPC queries to the chain database are illustrated below:
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/d4ad96d-Screen_Shot_2018-11-18_at_15.30.10.png",
        "Screen Shot 2018-11-18 at 15.30.10.png",
        2110,
        1058,
        "#fbfafb"
      ],
      "caption": "Source: https://youtu.be/0IoUZdDi5Is?t=665"
    }
  ]
}
[/block]
**View "Public" Proposals to obtain its Proposal Index**
* **Option 1**
  * Go to Chain State tab at: http://localhost:3000/#/chainstate
  * Select for "query state section": democracy
  * Select for "with state key": publicProps(): Vec<(PropIndex, Proposal, AccountId)>
  * Click the blue coloured "+" icon
  * Watch for the list of "Public" Proposals to appear. 
  * Remember the `PropIndex`, as Alice will use this Sponsor this "Public" Proposal using its index.

  * **FIXME** Update screenshot to use localhost
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/6cb16b2-Screen_Shot_2018-11-18_at_09.23.20.png",
        "Screen Shot 2018-11-18 at 09.23.20.png",
        2182,
        878,
        "#dadcdd"
      ]
    }
  ]
}
[/block]
* **Option 2**
  * Go to Democracy tab at: http://localhost:3000/#/democracy
  * View list under "Proposals" heading

  * **FIXME** Update screenshot to use localhost and with a proposal in the queue
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/1bb34a4-Screen_Shot_2018-11-18_at_09.25.32.png",
        "Screen Shot 2018-11-18 at 09.25.32.png",
        1684,
        744,
        "#dadada"
      ]
    }
  ]
}
[/block]
## Step 7: Sponsor a "Public" Proposal using the "Public" Mechanism
[block:callout]
{
  "type": "info",
  "title": "Sponsoring \"Public\" Proposals",
  "body": "Sponsorship (aka Seconding) a Queued \"Public\" Proposal is performed by another Authority who stakes a deposit value of the same size.\n\nPeriodically at fixed intervals the most Sponsored (aka Seconded) \"Public\" Proposal is taken off the Queue and elevated to being a \"Public\" Referendum on the Table of Referendum and allocated a Referendum ID, which may be voted upon during the Voting Launch Period. All deposits on the proposal that was elevated are returned to depositors, and those depositors are registered as voting in approval of it."
}
[/block]
**Sponsor the Proposal using the "Public" Mechanism using Alice**
* Go to Extrinsics tab at: http://localhost:3000/#/extrinsics
* Select for "Account": ALICE (associated test DOT balance is shown on the right)
* Select for "Extrinsic Section": democracy
* Select for "Submit the Following Extrinsic": second(proposal)
* Enter for "proposal: PropIndex" the Proposal's Index (obtained in previous step)
* Click "Submit Transaction" to add the extrinsic into the 'pending' extrinsics queue.
* Check that the toaster that appears says "author.submitExtrinsic sent"

* **FIXME** Update screenshot to use localhost and in-built accounts with balance
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/2e38dad-Screen_Shot_2018-11-18_at_09.27.17.png",
        "Screen Shot 2018-11-18 at 09.27.17.png",
        2062,
        956,
        "#dddedf"
      ]
    }
  ]
}
[/block]
**View "Public" Referenda**
* Go to Chain State tab at: http://localhost:3000/#/chainstate
  * Choose: democracy > `nextTally(): ReferendumIndex`
  * Choose: democracy > `referendumCount(): ReferendumIndex`
  * Choose: democracy > `referendumInfoOf(ReferendumIndex): ReferendumIndex`
  * Choose: democracy > `launchPeriod(): BlockNumber`

* **FIXME** Update screenshot to use localhost
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/674a541-Screen_Shot_2018-11-18_at_09.29.22.png",
        "Screen Shot 2018-11-18 at 09.29.22.png",
        2124,
        876,
        "#deddde"
      ]
    }
  ]
}
[/block]
## Step 8: Referendum Approval Voting
[block:callout]
{
  "type": "info",
  "title": "Referendum Approval Voting",
  "body": "Referendum Approval Voting by Authorities during a Voting Launch Period (during a specific Block Number) is achieved through voting `vote` on a Referendum ID in the Table of Referendum (includes the most Sponsored \"Public\" Proposals that were elevated) with a \"Standard\" Adaptive Quorum Biasing (AQB) that uses a \"Positive\" turnout bias (i.e. Yes votes), as shown in the screenshot below:"
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/783d8ee-Screen_Shot_2018-12-17_at_6.25.32_pm.png",
        "Screen Shot 2018-12-17 at 6.25.32 pm.png",
        1514,
        922,
        "#fafaf9"
      ],
      "caption": "Source: https://youtu.be/VsZuDJMmVPY?t=25379"
    }
  ]
}
[/block]
**Referendum Approval Voting**
* Go to Extrinsics tab at: http://localhost:3000/#/extrinsics
* Select for "Account": BOB (associated test DOT balance is shown on the right)
* Select for "Extrinsic Section": democracy
* Select for "Submit the Following Extrinsic": vote(ref_index, approve_proposal)
* Enter for "ref_index: ReferendumIndex" the Referendum's Index (obtained in previous step)
* Enter for "approve_proposal: bool" your vote
* Click "Submit Transaction" to add the extrinsic into the 'pending' extrinsics queue.
* Check that the toaster that appears says "author.submitExtrinsic sent"

* **FIXME** Update screenshot to use localhost
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/58799d7-Screen_Shot_2018-11-18_at_09.30.32.png",
        "Screen Shot 2018-11-18 at 09.30.32.png",
        2138,
        952,
        "#dedfe0"
      ]
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "Level of Approval",
  "body": "Level of Approval once satisfied for a Referendum ID causes it to be accepted and instantly enacted/executed autonomously."
}
[/block]
**Level of Approval Status**
* Go to Chain State tab at: http://localhost:3000/#/chainstate
* Choose: democracy > `voteOf((ReferendumIndex, AccountId)): bool`
* Choose: democracy > `votersFor(ReferendumIndex): Vec<AccountId>`

* **FIXME** Update screenshot to use localhost
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/7b63db8-Screen_Shot_2018-11-18_at_09.32.30.png",
        "Screen Shot 2018-11-18 at 09.32.30.png",
        2122,
        1304,
        "#dddddd"
      ]
    }
  ]
}
[/block]
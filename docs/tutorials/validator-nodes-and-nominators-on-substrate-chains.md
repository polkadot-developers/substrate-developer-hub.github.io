---
title: "Validator Nodes and Nominators on Substrate chains"
---

This document will walk you through steps to create a Substrate Node, integrate both the Substrate SRML 'Staking' and 'Referenda' Modules into the Substrate Node's Runtime, and then become a validator or a nominator using a Substrate Node using [Polkadot-JS Apps](https://polkadot.js.org/apps/next/).

We include how [Dr Gavin Wood created a short Substrate address at the 2018 Dotcon-0 during the Web3 Summit](https://youtu.be/26ucTSSaqog?t=5298)

This tutorial will be written for a Mac OS X machine, and may require some tweaks to get it working on other operating systems.

## Prerequisites

### Setup Code Directories
We'll be using code from the following Parity Github repositories:
* [https://github.com/paritytech](https://github.com/paritytech)
* [https://github.com/polkadot-js](https://github.com/polkadot-js)

So we'll start by creating subdirectories to organise the code that we'll be downloading from them. We'll namespace them to match the Github usernames:
```bash
mkdir -p ~/code/paritytech ~/code/polkadot-js
```

### Setup Substrate Node and Substrate UI

Run the following command to install Substrate.
```bash
cd ~/code/paritytech
curl https://getsubstrate.io -sSf | sh
```

You will also need to set up a few more repositories into your working folder which were used in the demo:

 * [Substrate Node Template](https://github.com/paritytech/substrate/blob/master/node-template/)
 * [Substrate UI](https://github.com/paritytech/substrate-ui)
 * [Polkadot-JS Apps](https://github.com/polkadot-js/apps)

You can do that with some [script aliases](https://github.com/paritytech/substrate-up) that were loaded on your machine:
```bash
cd ~/code/paritytech
substrate-node-new my-substrate-node-template-1 my-name
substrate-ui-new substrate my-substrate-node-template-1
```

This will create folders called `my-substrate-node-template-1` and `substrate-ui` within directory ~/code/paritytech, with the corresponding repositories cloned in them. You can of course rename your projects in these commands, but for the sake of the clarity, we will continue with these folder names.

### Setup Polkadot-JS Apps

We'll also run a couple of other script aliases to install necessary dependencies (Xcode Command Line Tools, Homebrew, Homebrew Cask, RBEnv, Ruby, NVM and Node.js latest LTS, Yarn,) and create a folder called `apps` within directory ~/code/polkadot-js, containing a clone of the Polkadot-JS Apps repository with a branch that supports PoC-3:

```bash
cd ~/code/polkadot-js
polkadot-js-apps-new
```

## Step 1: Integrate Substrate SRML 'Referenda' and 'Staking' Modules into the Substrate Node's Runtime

We're keen to use some 'governance' and 'staking' mechanisms, but we're stumped because we can't find anything related in the [Substrate Node Template](https://github.com/paritytech/substrate/blob/master/node-template/) code that we used to create a minimal Substrate Node chain.
![todo](https://files.readme.io/7dcac0b-Screen_Shot_2018-11-18_at_15.31.36.png)

Fortunately we were tipped by an insider who confirmed that the 'democracy' and 'staking' modules that we need aren't yet contained in the Substrate Node's Runtime that we setup in the directory `~/code/paritytech/my-substrate-node-template-1`.

We're reminded of the advantages of the Substrate (<<glossary:SRML>>). We'd like to plugin the 'Referenda' Module and the 'Staking' Module and associated configuration from this library into our Substrate Node's Runtime, and then tweak it to our liking.

![todo](https://files.readme.io/ebdb5e9-53b8dc8-Screen_Shot_2018-11-18_at_15.31.20.png)

* **FIXME**: Show how to integrate 'referenda' and 'staking' module and configuration into the Runtime of 'my-substrate-node-template-1'

## Step 2: Launch a Substrate Blockchain Node

If you have set up everything correctly, you can now start a Substrate chain! In directory 'my-substrate-node-template-1' run the following and it will be published on [Telemetry](https://telemetry.polkadot.io):

```bash
cd ~/code/paritytech/my-substrate-node-template-1
./target/release/my-substrate-node-template-1 \
  --telemetry \
  --chain dev \
  --name "My Substrate Node 1" \
  --telemetry-url ws://telemetry.polkadot.io:1024
```

To find out more information about each option run `./target/release/my-substrate-node-template-1 --help`
> If you run into an error like `Error: UnknownBlock: Unknown block Hash(...)`, you will need to purge the chain files on your computer, with either of the following commands: `cargo run -- --dev purge-chain --dev` or `rm -rf ~/Library/Application\\ Support/Substrate/chains/development/`

```bash
cargo run -- --dev purge-chain --dev
```

If everything is working it should start producing blocks, as shown below:

* **FIXME** - Update screenshot to show it building blocks
![](https://files.readme.io/8bec369-Screen_Shot_2018-11-18_at_09.59.45.png)

> **Kill Substrate Node**
>
> If you want to stop running your Substrate node, you can press CTRL+C, however it will not kill the process immediately. You can kill it immediately with the following command:

```bash
ps aux | grep ./target/release | awk 'NR==1{print $2}' | sudo xargs kill -9
```

## Step 3: Launch UI of Polkadot-JS Apps

To interact with the Substrate Node, we'll start the UI of Polkadot JS Apps.

```bash
cd ~/code/polkadot-js/apps
yarn run start
```

Open your browser to http://localhost:3000.

Go to the 'Settings' menu item. Select option 'Local Node (127.0.0.1:9944)', then click 'Save & Reload'.
![](https://files.readme.io/af1e821-d75fe2b-Screen_Shot_2018-11-14_at_13.59.34.png)

It will connect to the local Substrate Node that you're running and update the UI with additional menu items, as shown below:
![](https://files.readme.io/1e0fdc1-e2836dc-Screen_Shot_2018-11-16_at_11.02.31.png)

## Step 4: Create an Account

### Short Address

* **FIXME** Show how to create short or long address with Substrate UI. Add explanation about the short address. Show how to use subkey to generate the 'Raw Seed'

### Long Address

* **FIXME** Show how to create long address with Polkadot-JS Apps

When creating your account, select 'Raw Seed' from the selection box under label 'create from the following seed (hex or string)'.

## Step 5: View Validators and Validator Intentions

**Option 1:**
  * Go to Staking tab at: http://localhost:3000/#/staking
  * Click "Staking Overview" that shows Validators and Validator Intentions

**Option 2:**
  * Go to Chain State tab at: http://localhost:3000/#/chainstate
  * Choose: session > validators()
  * Choose: staking > intentions()
  * Reference: https://polkadot.js.org/api/METHODS_STORAGE.html#session

**Option 3:**
  * [Telemetry](https://telemetry.polkadot.io) - https://telemetry.polkadot.io

**Option 4:**
  * View Chain Specification Configuration in Substrate source code

**Option 5:**
  * [Polkadash](http://gav.polkadot.io/) - http://gav.polkadot.io/

* **FIXME** Add screenshots

## Step 6: Obtain Initial DOTs

Request testnet DOTs. Join the Riot Channel named [Polkadot Watercooler](https://riot.im/app/#/room/#polkadot-watercooler:matrix.org)

## Step 7: Restart Substrate Node with Validator Configuration

With your Substrate Account address obtained (including Seed Key in Hex) and now that you've staked DOTs to be a Validator Intention, we're going to restart our Substrate Node so that it's recognised as a Validator Substrate Node:

```bash
cd ~/code/paritytech/my-substrate-node-template-1
./target/release/my-substrate-node-template-1 \
  --validator \
  --telemetry \
  --chain dev \
  --key <INSERT_ACCOUNT_SEED_KEY> \
  --name "My Substrate Node 1" \
  --node-key "<INSERT_NODE_SECRET_KEY>" \
  --telemetry-url ws://telemetry.polkadot.io:1024
```

## Step 8: Earn DOTs

### Nominator Rewards

Next step after creating a Substrate Account and obtaining some initial DOTs is earning more DOTs to elevate your stake and influence.
> Nominating `nominate(target)` an existing Validator by locking away some of your DOTs as stake may result in the reward of DOTs if your chosen Validator maintains compliance, otherwise you will lose DOTs.

> **Un-Nominating a Validator**
>
> "body": "Un-Nominating `unnominator(target_index)` may be performed at any time to unlock your funds, and is effective at the next Era.

#### Nominate a Validator or Validator Intention

**Option 1**
  * Go to Staking tab at: http://localhost:3000/#/staking
  * Click "Account Actions" where it displays all your accounts
  * Choose an account to: Nominate a Validator or Validator Intention account address

* **FIXME** Add screenshot

**Option 2**
  * Go to Extrinsics tab at: http://localhost:3000/#/extrinsics
  * Select for "Account": BOB (associated test DOT balance is shown on the right)
  * Select for "Extrinsic Section": staking
  * Select for "Submit the Following Extrinsic": nominate(target)
  * Select for "target: Address": ALICE (Validator identified in previous step
  * Click "Submit Transaction" to add the extrinsic into the 'pending' extrinsics queue.
  * Check that the toaster that appears says "author.submitExtrinsic sent"

#### View Nominator Information

  * Go to Chain State tab at: http://localhost:3000/#/chainstate
  * Choose: staking > `nominating(AccountId): AccountId`
  * Choose: staking > `nominatorsFor(AccountId): AccountId`

### Validator Rewards
Validator Intentions are Authorities that have staked their DOTs to potentially become future Validators.

#### Validator Intention Registration

**Option 1**
  * Go to Staking tab at: http://localhost:3000/#/staking
  * Click "Account Actions" where it displays all your accounts
  * Choose an account to:
    * Stake your DOT balance

* **FIXME** Add screenshot

**Option 2**
  * Go to Extrinsics tab at: http://localhost:3000/#/extrinsics
  * Select for "Account": BOB (associated test DOT balance is shown on the right)
  * Select for "Extrinsic Section": staking
  * Select for "Submit the Following Extrinsic": `stake()`
  * Click "Submit Transaction"

#### View Validator Intentions Information

* Go to Chain State tab at: http://localhost:3000/#/chainstate
* Choose: staking > intentions(): `Vec<AccountId>`


#### Validators
> **Validators**
>
> Validators are Authorities that are staked and allowed to participate in the consensus mechanism to for block finality and production for a Substrate Node.
>
> Validator are required to run their Substrate Node online 24/7 synchronising to the best block with integrity to maintain compliance.
>
> Rewards are provided to compliant validators.
>
> Non-compliances however, are punished by removal (slashing) of their staked DOTs to discourage bad actors.
>
> Validator Intentions should ensure they are synchronised to the best block of the Substrate Node because otherwise if they are selected for a Validator slot they may lose it quickly.
>
> Obtaining a copy of the chain database already synchronised to the best block may be much faster than waiting a few days for it to synchronise for a new user.


#### View Validator Information

* Go to Chain State tab at: http://localhost:3000/#/chainstate
* Choose: session > `validators(): Vec<AccountId>`
* Choose: staking > `validatorCount(): u32`
* Choose: staking > `bondage(AccountId): BlockNumber`
* Choose: staking > `currentOfflineSlash(): Balance`
* Choose: staking > `currentSessionReward(): Balance`

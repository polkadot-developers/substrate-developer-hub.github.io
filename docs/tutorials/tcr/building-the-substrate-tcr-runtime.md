---
title: "Building the Substrate TCR runtime"
---
This is Part 1 of the guide [Building a Token Curated Registry DAppChain on Substrate](index.md). This part covers the implementation of the Substrate runtime modules needed for the Token Curated Registry runtime.

The code for the sample TCR runtime is available in [this GitHub repository](https://github.com/substrate-developer-hub/substrate-tcr/).

## Step 1: Setup and prerequisites

In this guide, we will directly jump into the TCR runtime development using Substrate node bootstrapped using the `substrate-node-new` script. This guide is intended to walk you through the overall process of creating a DAppChain using Substrate. It does not cover the "getting started" and other basic concepts about Substrate. To get an overview of these concepts, it is highly recommended that you go through the [Substrate Collectibles tutorial](https://shawntabrizi.github.io/substrate-collectables-workshop/) before proceeding further.

Let's start with a new Substrate runtime node. We recommend going through the [Substrate setup scripts tutorial](getting-started/using-the-substrate-scripts.md) to spin up a hack-ready node runtime using the `substrate-node-new` script.

## Step 2: Module trait and types

The first step towards building a Substrate runtime module is to define what other SRML modules we could use in our module. There are plenty of SRML modules that ship with the Substrate codebase and we recommend using them, when needed. To use any of the existing modules, we need to import and specify them in the module trait of our custom module.

For example, in this runtime we need the capability to calculate and compare timestamps for the TCR parameters - apply stage length and commit stage length. We will use the [`timestamp` SRML module](https://github.com/paritytech/substrate/tree/master/srml/timestamp) to achieve this functionality.

Here's how the module configuration trait declaration for the TCR module looks like.

```rust
pub trait Trait: timestamp::Trait + token::Trait {
  type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}
```

In the above snippet, we have the TCR module configuration trait inheriting from the `timestamp` module trait. In addition, it also inherits from the `token` module trait. It is important to import these modules in your module before you use them in the module trait. In the following snippet we are importing the `timestamp` module from the SRML and the `token` module from the local crate.

```rust
use {system::ensure_signed, timestamp};
use crate::token;
```

The token module is another custom module that we need in order to support the token functionality for TCR curation functions. We would not be going into the implementation details of the `token` module in this guide as its code is pretty much self explanatory. Basically, the `token` module implements the ERC20 interface with some additional functions (lock and unlock). It is available as part of the TCR sample code base [here](https://github.com/substrate-developer-hub/substrate-tcr/blob/master/runtime/src/token.rs).

Remember to add references of your `token.rs` and `tcr.rs` modules to the `lib.rs`, and add them to the `construct_runtime!` macro.


## Step 3: Declaring the runtime storage

The first thing we would want to do is define the storage for our TCR runtime.

When building a DApp or a DAppChain it is very important to decide what gets stored on-chain and what doesn't. It is recommended that you store on-chain only the data which is critical for conflict resolution; anything else can and should be stored off-chain. Properly defined storage is important for your chain's economic security in order to match resources paid by the user with resources provided by the network. If the storage items become large or unwieldy to deal with, then the transactions will become complex, risking an economic denial of service attack on your chain.

For the TCR runtime, let's see what could be the least amount of information stored on chain. To perform the basic curation operations for the TCR, we would store collections of listings (the registry), challenges, polls and votes. We would also need the TCR parameters to be stored as storage values.

### Data structures for on-chain TCR data

First, to store the details for listings, challenges, polls and votes we would be defining the respective data structures using `Struct`.

```rust
#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Listing<U, V, W> {
  id: u32,
  data: Vec<u8>,
  deposit: U,
  owner: V,
  application_expiry: W,
  whitelisted: bool,
  challenge_id: u32,
}

#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Challenge<T, U, V, W> {
  listing_hash: T,
  deposit: U,
  owner: V,
  voting_ends: W,
  resolved: bool,
  reward_pool: U,
  total_tokens: U
}

#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Vote<U> {
  value: bool,
  deposit: U,
  claimed: bool,
}

#[derive(Encode, Decode, Default, Clone, PartialEq)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Poll<T, U> {
  listing_hash: T,
  votes_for: U,
  votes_against: U,
  passed: bool,
}
```

These structs have generic type parameters so that we can use any implementation of the respective types. The following sub-section describes how we are instantiating collections of these structs where we define the exact type in place of generic parameters. The `Moment` type comes from the `timestamp` module and the `TokenBalance` type comes from the `token` module.

### Storage declaration using the `decl_storage` macro

Here's how the `decl_storage` macro looks for the TCR runtime. The comments describe each of the storage items.

```rust
decl_storage! {
 trait   Store for Module<T: Trait> as Tcr {

    // stores the owner in the genesis config
    Owner get(owner) config(): T::AccountId;

    // TCR parameter - minimum deposit
    MinDeposit get(min_deposit) config(): Option<T::TokenBalance>;

    // TCR parameter - apply stage length - deadline for challenging before a listing gets accepted
    ApplyStageLen get(apply_stage_len) config(): Option<T::Moment>;

    // TCR parameter - commit stage length - deadline for voting before a challenge gets resolved
    CommitStageLen get(commit_stage_len) config(): Option<T::Moment>;

    // the TCR - list of proposals
    Listings get(listings): map T::Hash => Listing<T::TokenBalance, T::AccountId, T::Moment>;

    // to make querying of listings easier, maintaining a list of indexes and corresponding listing hashes
    ListingCount get(listing_count): u32;
    ListingIndexHash get(index_hash): map u32 => T::Hash;

    // global nonce for poll count
    PollNonce get(poll_nonce) config(): u32;

    // challenges
    Challenges get(challenges): map u32 => Challenge<T::Hash, T::TokenBalance, T::AccountId, T::Moment>;

    // polls
    Polls get(polls): map u32 => Poll<T::Hash, T::TokenBalance>;

    // votes
    // mapping is between a tuple of (poll id, Account Id) and a vec of votes
    // poll and vote have a 1:n relationship
    Votes get(votes): map (u32, T::AccountId) => Vote<T::TokenBalance>;

    }
}
```

As you can see, in addition to the storage items mentioned before, we have a few more storage items (`ListingCount`, `ListingIndexHash`) to make the data querying easier. These are completely optional and are not required by the TCR runtime for its core functionality.

### Using the genesis config

The genesis config is the state of the chain before the first block. This is useful in scenarios when we want to use some parameters needed for subsequent transactions. For example, the TCR parameters are needed before any of the listings can be applied.

In Substrate, a storage value can be marked as part of the genesis config by adding the `config()` call to its declaration. In the TCR runtime, we have the following as part of the genesis config. Note that each of the declarations has `config()` in it.

```rust
// stores the owner in the genesis config
Owner get(owner) config(): T::AccountId;

// TCR parameter - minimum deposit
MinDeposit get(min_deposit) config(): Option<T::TokenBalance>;

// TCR parameter - apply stage length - deadline for challenging before a listing gets accepted
ApplyStageLen get(apply_stage_len) config(): Option<T::Moment>;

// TCR parameter - commit stage length - deadline for voting before a challenge gets resolved
CommitStageLen get(commit_stage_len) config(): Option<T::Moment>;
```

Marking a storage value as `config()` is just enabling it to be used as genesis config. To use it as the state before the first block, we also need to set a value for it.

To set the values for genesis config, we need to make some edits in the `chain_spec.rs` file.

First, we need to add a type name for the genesis config in the template runtime import. In the code snippet below, we have added `TcrConfig` in the runtime import for representing the genesis config of TCR runtime module

```rust
use node_template_runtime::{
    AccountId, GenesisConfig, ConsensusConfig, TimestampConfig, BalancesConfig,
    SudoConfig, IndicesConfig, TcrConfig
};
```

Second, we need to add a section in the `testnet_genesis` function in the same `chain_spec.rs` file. For the TCR runtime and its genesis config parameters, here's how it looks.

```rust
tcr: Some(TcrConfig {
    // owner account id
    owner: ed25519::Pair::from_seed(b"Alice ").public().0.into(),

    // min deposit for proposals
    min_deposit: 100,

    // challenge time limit - for testing its set to 2 mins (120 sec)
    apply_stage_len: 120,

    // voting time limit - for testing its set to 4 mins (240 sec)
    commit_stage_len: 240,

    // initial poll/challenge set to 1
    // to avoid 0 values
    poll_nonce: 1,
})
```

Here, we have assigned values to each of the storage items that were marked with `config()` in the runtime storage declaration inside the `decl_storage` macro. For example, the value for minimum deposit is 100 and this will be used right from the beginning of the chain so that the deposit on any new listing being applied can be validated against this value.

You can see the `chain_spec.rs` file with all the required edits [here](https://github.com/substrate-developer-hub/substrate-tcr/blob/master/src/chain_spec.rs).

This also concludes the work needed on the storage declaration and setup.

## Step 4: Declaring Events

The next step for our runtime module development is declaring its events. In general, we need events so that the external world can listen to updates on the blockchain. If we do not have proper events in our runtime, the users would end up querying a lot of on-chain data.

Also, it is important to note that the runtime functions in Substrate do not return values on success. Their return value is either empty or an error message. Because of this, it becomes even more important to have events with the right parameters so that the state changes can be communicated to the clients and hence, users.

We can also use the events to build an off-chain cache of the on-chain data. This cache can then be used to query and analyze data in a more performant way. We will cover more on this in Part 3 of this guide.

For our TCR runtime module, we would have events to communicate updates on listings - proposal, challenge, vote, resolution, accepted/rejected and rewards claim. All these are logical steps in the life-cycle of a listing and corresponding challenges and should be communicated to the outside world.

In general, when developing a runtime module, you should ask yourself this question - "What kind of updates will the client or the external user be interested in when using this runtime?" Ideally, all these updates should be communicated as events.

For our TCR runtime, we have the following events declared using the `decl_event` macro.

```rust
decl_event!(
    pub enum Event<T> where
        AccountId = <T as system::Trait>::AccountId,
        Balance = <T as token::Trait>::TokenBalance,
        Hash = <T as system::Trait>::Hash,
    {
      // when a listing is proposed
      Proposed(AccountId, Hash, Balance),
      // when a listing is challenged
      Challenged(AccountId, Hash, u32, Balance),
      // when a challenge is voted on
      Voted(AccountId, u32, Balance),
      // when a challenge is resolved
      Resolved(Hash, u32),
      // when a listing is accepted in the registry
      Accepted(Hash),
      // when a listing is rejected from the registry
      Rejected(Hash),
      // when a vote reward is claimed for a challenge
      Claimed(AccountId, u32),
    }
);
```

At this point, we have our storage, genesis config, and events sorted. We are now good to proceed with the implementation of the runtime business logic.

## Step 5: Module business logic

There is a reason why we are doing the business logic at the end. At this point, it becomes very clear what we intend to store and what we plan to communicate (events) in our module. This clarity can help a lot in optimizing the business logic. Let's begin.

### Propose a listing

The first function that our TCR runtime module needs to expose is to allow the proposal of a listing to the registry. In this function, we take as input the listing name and deposit. We then validate this input as per the TCR config parameters stored as genesis config. Then we deduct (lock) the deposit amount from the sender's balance using the `token` module. Finally, we store the listing as an instance of the `Listing` struct inside the `Listings` storage map.

Here's how the `Propose` function is implemented,

```rust
// propose a listing on the registry
// takes the listing name (data) as a byte vector
// takes deposit as stake backing the listing
// checks if the stake is less than minimum deposit needed
fn propose(origin, data: Vec<u8>, #[compact] deposit: T::TokenBalance) -> Result {
  let sender = ensure_signed(origin)?;

  // to avoid byte arrays with unlimited length
  ensure!(data.len() <= 256, "listing data cannot be more than 256 bytes");

  let min_deposit = Self::min_deposit().ok_or("Min deposit not set")?;
  ensure!(deposit >= min_deposit, "deposit should be more than min_deposit");

  // set application expiry for the listing
  // using the `Timestamp` SRML module for getting the block timestamp
  // generating a future timestamp by adding the apply stage length
  let now = <timestamp::Module<T>>::get();
  let apply_stage_len = Self::apply_stage_len().ok_or("Apply stage length not set.")?;
  let app_exp = now.checked_add(&apply_stage_len).ok_or("Overflow when setting application expiry.")?;

  let hashed = <T as system::Trait>::Hashing::hash(&data);

  let listing_id = Self::listing_count();

  // create a new listing instance
  let listing = Listing {
    id: listing_id,
    data,
    deposit,
    owner: sender.clone(),
    whitelisted: false,
    challenge_id: 0,
    application_expiry: app_exp,
  };

  ensure!(!<Listings<T>>::exists(hashed), "Listing already exists");

  // deduct the deposit for application
  <token::Module<T>>::lock(sender.clone(), deposit, hashed.clone())?;

  <ListingCount<T>>::put(listing_id + 1);
  <Listings<T>>::insert(hashed, listing);
  <ListingIndexHash<T>>::insert(listing_id, hashed);

  // let the world know
  // raise the event
  Self::deposit_event(RawEvent::Proposed(sender, hashed.clone(), deposit));
  runtime_io::print("Listing created!");

  Ok(())}
}
```

It is worth noting that we are doing all the checks and validations before touching the storage. This is **very important** as the state of the blockchain cannot be reversed if the logic fails or errors out. We need to be extremely careful before updating the storage. This is well described in the [Substrate-Collectibles tutorial](https://github.com/shawntabrizi/substrate-collectables-workshop/blob/master/2/tracking-all-kitties.md#verify-first-write-last) also.

If you are using external modules in your module, make sure to check whether the functions from these external modules are doing any validations. If yes, make these function calls before updating any storage in your module. In this case, we are calling the `lock` function of the `token` module from the `propose` function of the `TCR` module. The `lock` function is verifying if the token balance of the proposer (origin) is more than the deposit. That's why we are calling it before inserting the listing. The `lock` function also updates storage (locking the user's funds), so it is important not to have any more operations that can fail after the user's funds are locked.

Finally, we raise the `Proposed` event to communicate to the external world that a new listing has been proposed in the registry.

### Challenge and Vote

Similar to how we have implemented the `propose` function above, we implement the `challenge` and `vote` functions also. We follow the same pattern of doing all the checks and validations and then recording the updated state in the storage.

In the **challenge** function, we check if the listing exists and if it is still in the apply stage period. We also check if the deposit for challenge is at least equal to that of the listing. We then lock the deposit for challenge and store a new instance of the `Challenge` struct in the `Challenges` storage map. We also update the listing with the `challenge_id`. Finally we raise the `Challenged` event.

```rust
// challenge a listing
// for simplicity, only three checks are being done
//    a. if the listing exists
//    c. if the challenger is not the owner of the listing
//    b. if enough deposit is sent for challenge
fn challenge(origin, listing_id: u32, #[compact] deposit: T::TokenBalance) -> Result {
  let sender = ensure_signed(origin)?;

  ensure!(<ListingIndexHash<T>>::exists(listing_id), "Listing not found.");

  let listing_hash = Self::index_hash(listing_id);
  let listing = Self::listings(listing_hash);

  ensure!(listing.challenge_id == 0, "Listing is already challenged.");
  ensure!(listing.owner != sender, "You cannot challenge your own listing.");
  ensure!(deposit >= listing.deposit, "Not enough deposit to challenge.");

  // get current time
  let now = <timestamp::Module<T>>::get();

  // get commit stage length
  let commit_stage_len = Self::commit_stage_len().ok_or("Commit stage length not set.")?;
  let voting_exp = now.checked_add(&commit_stage_len).ok_or("Overflow when setting voting expiry.")?;

  // check apply stage length not passed
  // ensure that now <= listing.application_expiry
  ensure!(listing.application_expiry > now, "Apply stage length has passed.");

  let challenge = Challenge {
    listing_hash,
    deposit,
    owner: sender.clone(),
    voting_ends: voting_exp,
    resolved: false,
    reward_pool: <T::TokenBalance as As<u64>>::sa(0),
    total_tokens: <T::TokenBalance as As<u64>>::sa(0),
  };

  let poll = Poll {
    listing_hash,
    votes_for: listing.deposit,
    votes_against: deposit,
    passed: false,
  };

  // deduct the deposit for challenge
  <token::Module<T>>::lock(sender.clone(), deposit, listing_hash)?;

  // global poll nonce
  // helps keep the count of challenges and in mapping votes
  let poll_nonce = <PollNonce<T>>::get();
  // add a new challenge and the corresponding poll in the respective collections
  <Challenges<T>>::insert(poll_nonce, challenge);
  <Polls<T>>::insert(poll_nonce, poll);

  // update listing with challenge id
  <Listings<T>>::mutate(listing_hash, |listing| {
    listing.challenge_id = poll_nonce;
  });

  // update the poll nonce
  <PollNonce<T>>::put(poll_nonce + 1);

  // raise the event
  Self::deposit_event(RawEvent::Challenged(sender, listing_hash, poll_nonce, deposit));
  runtime_io::print("Challenge created!");

  Ok(())
}
```

Similarly, in the **vote** function we check for existence of the listing and challenge. We also check if the commit stage period has passed or not. Based on the vote value (true or false) we add the vote deposit to either `votes_for` or `votes_against` fields in the corresponding poll instance. We then store a new instance of the `Vote` struct inside the `Votes` map and also raise the `Voted` event.

```rust
// registers a vote for a particular challenge
// checks if the listing is challenged and
// if the commit stage length has not passed
// to keep it simple, we just store the choice as a bool - true: aye; false: nay
fn vote(origin, challenge_id: u32, value: bool, #[compact] deposit: T::TokenBalance) -> Result {
  let sender = ensure_signed(origin)?;

  // check if listing is challenged
  ensure!(<Challenges<T>>::exists(challenge_id), "Challenge does not exist.");
  let challenge = Self::challenges(challenge_id);
  ensure!(challenge.resolved == false, "Challenge is already resolved.");

  // check commit stage length not passed
  let now = <timestamp::Module<T>>::get();
  ensure!(challenge.voting_ends > now, "Commit stage length has passed.");

  // deduct the deposit for vote
  <token::Module<T>>::lock(sender.clone(), deposit, challenge.listing_hash)?;

  let mut poll_instance = Self::polls(challenge_id);
  // based on vote value, increase the count of votes (for or against)
  match value {
    true => poll_instance.votes_for += deposit,
    false => poll_instance.votes_against += deposit,
  }

  // create a new vote instance with the input params
  let vote_instance = Vote {
    value,
    deposit,
    claimed: false,
  };

  // mutate polls collection to update the poll instance
  <Polls<T>>::mutate(challenge_id, |poll| *poll = poll_instance);

  // insert new vote into votes collection
  <Votes<T>>::insert((challenge_id, sender.clone()), vote_instance);

  // raise the event
  Self::deposit_event(RawEvent::Voted(sender, challenge_id, deposit));
  runtime_io::print("Vote created!");
  Ok(())
}
```

### Resolve

Once an unchallenged listing is out of the apply stage period or a challenged listing is out of the commit period, the `resolve` function can be called on it. Anyone can call the resolve function as it does not involve any staking.     

In the resolve function, we check for several conditions including,
* If the listing exists and whether it is in apply stage period
* If a challenge exists for the listing and whether it is in commit stage period
* If the votes are in favor of white-listing

Based on the outcome of these checks we update the listing status to accepted or rejected by setting the `listing.whitelisted` value to true or false. We also raise the `Resolved` and `Accepted/Rejected` events.

In addition, we also update the token and reward values in the corresponding `Challenge` instance.

```rust
// resolves the status of a listing
fn resolve(_origin, listing_id: u32) -> Result {
  ensure!(<ListingIndexHash<T>>::exists(listing_id), "Listing not found.");

  let listing_hash = Self::index_hash(listing_id);
  let listing = Self::listings(listing_hash);

  let now = <timestamp::Module<T>>::get();
  let challenge;
  let poll;

  // check if listing is challenged
  if listing.challenge_id > 0 {
    // challenge
    challenge = Self::challenges(listing.challenge_id);
    poll = Self::polls(listing.challenge_id);

    // check commit stage length has passed
    ensure!(challenge.voting_ends < now, "Commit stage length has not passed.");
  } else {
    // no challenge
    // check if apply stage length has passed
    ensure!(listing.application_expiry < now, "Apply stage length has not passed.");

    // update listing status
    <Listings<T>>::mutate(listing_hash, |listing|
    {
      listing.whitelisted = true;
    });

    Self::deposit_event(RawEvent::Accepted(listing_hash));
    return Ok(());
  }

  let mut whitelisted = false;

  // mutate polls collection to update the poll instance
  <Polls<T>>::mutate(listing.challenge_id, |poll| {
    if poll.votes_for >= poll.votes_against {
        poll.passed = true;
        whitelisted = true;
    } else {
        poll.passed = false;
    }
  });

  // update listing status
  <Listings<T>>::mutate(listing_hash, |listing| {
    listing.whitelisted = whitelisted;
    listing.challenge_id = 0;
  });

  // update challenge
  <Challenges<T>>::mutate(listing.challenge_id, |challenge| {
    challenge.resolved = true;
    if whitelisted == true {
      challenge.total_tokens = poll.votes_for;
      challenge.reward_pool = challenge.deposit + poll.votes_against;
    } else {
      challenge.total_tokens = poll.votes_against;
      challenge.reward_pool = listing.deposit + poll.votes_for;
    }
  });

  // raise appropriate event as per whitelisting status
  if whitelisted == true {
    Self::deposit_event(RawEvent::Accepted(listing_hash));
  } else {
    // if rejected, give challenge deposit back to the challenger
    <token::Module<T>>::unlock(challenge.owner, challenge.deposit, listing_hash)?;
    Self::deposit_event(RawEvent::Rejected(listing_hash));
  }

  Self::deposit_event(RawEvent::Resolved(listing_hash, listing.challenge_id));
  Ok(())
}
```

### Claim reward

Once a listing is resolved, voting rewards can be claimed using the `claim_reward` function. In this function, we check if the caller (origin) has voted on a particular challenge or not. We then check if the challenge has been resolved or not. Based on these checks, we calculate the reward for the origin and call the `unlock` function using the `token` module. We also update the `Vote` instance with the claimed status to true so that the same reward cannot be claimed again. Finally, we raise the `Claimed` event.

It is important to note that the `claim_reward` function takes a `challenge_id` as an input parameter rather than a listing (unlike previous functions). Finding the right `challenge_id` for a listing should be done beforehand.

```rust
// claim reward for a vote
fn claim_reward(origin, challenge_id: u32) -> Result {
  let sender = ensure_signed(origin)?;

  // ensure challenge exists and has been resolved
  ensure!(<Challenges<T>>::exists(challenge_id), "Challenge not found.");
  let challenge = Self::challenges(challenge_id);
  ensure!(challenge.resolved == true, "Challenge is not resolved.");

  // get the poll and vote instances
  // reward depends on poll passed status and vote value
  let poll = Self::polls(challenge_id);
  let vote = Self::votes((challenge_id, sender.clone()));

  // ensure vote reward is not already claimed
  ensure!(vote.claimed == false, "Vote reward has already been claimed.");

  // if winning party, calculate reward and transfer
  if poll.passed == vote.value {
        let reward_ratio = challenge.reward_pool.checked_div(&challenge.total_tokens).ok_or("overflow in calculating reward")?;
        let reward = reward_ratio.checked_mul(&vote.deposit).ok_or("overflow in calculating reward")?;
        let total = reward.checked_add(&vote.deposit).ok_or("overflow in calculating reward")?;
        <token::Module<T>>::unlock(sender.clone(), total, challenge.listing_hash)?;

        Self::deposit_event(RawEvent::Claimed(sender.clone(), challenge_id));
    }

    // update vote reward claimed status
    <Votes<T>>::mutate((challenge_id, sender), |vote| vote.claimed = true);

  Ok(())
}
```

The core TCR flow is now complete with the `propose`, `challenge`, `vote`, `resolve`, and `claim_reward` functions. It can be further extended, as needed. Please note that what we have covered here is just a sample implementation of a subset of TCR functions. It is only for educational purposes and is not intended for real use-cases.

The code for the TCR runtime modules - `tcr` and `token` covered in this part of the guide, is available [here](https://github.com/substrate-developer-hub/substrate-tcr/tree/master/runtime/src).

In the [next part](unit-testing-the-tcr-runtime-module.md) of this guide, we will learn how to unit test the functions in a Substrate runtime.

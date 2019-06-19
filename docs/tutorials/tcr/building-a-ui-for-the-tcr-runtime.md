---
title: "Building a UI for the TCR runtime"
---
This is Part 3 of the guide [Building a Token Curated Registry DAppChain on Substrate](index.md). In [part 1](building-the-substrate-tcr-runtime.md), we implemented a substrate runtime module for a TCR. In [part 2](unit-testing-the-tcr-runtime-module.md), we wrote unit tests for our runtime.

As part of the samples, we've created a `reactjs` based web app as a simple frontend for the TCR runtime. The [complete code](https://github.com/substrate-developer-hub/substrate-tcr-ui) is available, although slightly outdated.

In this part of the guide, we will be covering the framework agnostic parts of the UI sample which are mainly used for interaction with the Substrate node and the TCR runtime extrinsic functions. We will not be going into the react specific parts - components, etc. The sample is created using the `create-react-app` scaffolding command. We have added a simple react component to display a list of items (TCR listings) and the corresponding TCR actions. We also have a couple of modals to take input for the `propose`, `challenge` and `vote` actions on a listing.

What's more important for this guide is the javascript code which interacts with the TCR runtime. We have used the [PolkadotJS API](https://polkadot.js.org/api/) to achieve this.

In the sample, we have the [tcrService.js file](https://github.com/substrate-developer-hub/substrate-tcr-ui/blob/master/src/services/tcrService.js) which contains all the relevant functions for interaction with the runtime. The following are packages and imports that we need from the PolkadotJS API to support this javascript code.

```javascript
const { ApiPromise } = require('@polkadot/api');

const { WsProvider } = require('@polkadot/rpc-provider');

const { Keyring } = require('@polkadot/keyring');

const { stringToU8a } = require('@polkadot/util');
```

The [PolkadotJS API](https://polkadot.js.org/api/) is very well documented, with examples, so we will not be going into the details of the internals of those functions in this guide.

## Signing Keys

To begin with, let's first look at how we represent the `origin` for the TCR runtime functions. All runtime functions are signed extrinsics. To sign the function calls from the UI before sending it to the Substrate node, we need signing keys of the user interacting with the UI. To do it, we take the seed from the user and create a keypair from it. In the following code snippet, we have a function that takes a seed string as a parameter and converts it into a keypair using the `keyring` object from the `@polkadot/keyring` package.

```javascript
function _getKeysFromSeed(_seed) {
 if (!_seed) {
     throw new Error("Seed not valid.");
 }

 const keyring = new Keyring();
 const paddedSeed = _seed.padEnd(32);
 return keyring.addFromSeed(stringToU8a(paddedSeed));
}
```

## API Connection and registering custom types

To call the Substrate runtime functions from our javascript code, we will need an [API promise](https://polkadot.js.org/api/examples/promise/) object. We will also need to register our custom types so that the javascript code can infer the right values returned from the runtime events. Remember all those structs that we created to represent the TCR primitives in part 1 of this guide? Those are all the custom types that we need to register with the API promise object.

The following function creates and returns an API promise object with a [websocket provider](https://polkadot.js.org/api/rpc-provider/classes/_ws_index_.wsprovider.html) and custom [types](https://polkadot.js.org/api/types/),

```javascript
async function _createApiWithTypes() {
 return await ApiPromise.create({
     provider: new WsProvider(process.env.REACT_APP_SUBSTRATE_ADDR),
     types: {
      Listing: {
         "id": "u32",
         "data": "Vec<u8>",
         "deposit": "Balance",
         "owner": "AccountId",
         "application_expiry": "Moment",
         "whitelisted": "bool",
         "challenge_id": "u32" },
      Challenge: {
          "listing_hash": "Hash",
          "deposit": "Balance",
          "owner": "AccountId",
          "voting_ends": "Moment",
          "resolved": "bool",
          "reward_pool": "Balance",
          "total_tokens": "Balance" },
      Poll: {
          "listing_hash": "Hash",
          "votes_for": "Balance",
          "votes_against": "Balance",
          "passed": "bool" },
      Vote: {
          "value": "bool",
          "deposit": "Balance",
          "claimed": "bool" },
      TokenBalance: "u128"
    }
 });
}

```

## Calling the TCR runtime functions

Now that we have our signing keys and a connection to the Substrate node, we are good to proceed with the TCR runtime function calls.

### Propose

In the following code snippet, we have a function that first gets a new API promise object created using the `_createApiWithTypes` function described above. It then gets the keypair from the seed by calling the `_getKeysFromSeed` function, also described before. In the sample, we are storing the seed in the browser local storage so that the user does not have to enter it again. However, in a real production app, we should find a more secure way of handling the seed at the client side.

The `propose` function takes a listing name and deposit amount as parameters. After creating the keypair and API promise objects, we call the `propose` function of the TCR runtime module. Note the dynamic binding on the runtime module name and function name in the `api.tx.tcr.propose` call. The PolkadotJS API automatically binds the runtime module name and the function name. This is also described as part of the [API documentation](https://polkadot.js.org/api/api/classes/_base_.apibase.md#tx). Then we call the `signAndSend` function with the keypair.

```javascript
export async function applyListing(name, deposit) {
  return new Promise(async (resolve, reject) => {
    const api = await ApiPromise.create();
    const keys = _getKeysFromSeed();

    // create, sign and send transaction
    api.tx.tcr.propose(name, deposit)
      .signAndSend(keys, ({ events = [], status, type }) => {
        if (type === 'Finalised') {
          console.log('Completed at block hash', status.asFinalised.toHex());
          events.forEach(async ({ phase, event: { data, method, section } }) => {
            console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());

            // check if the tcr proposed event was emitted by Substrate runtime
            if (section.toString() ===  "tcr" && method.toString() === "Proposed") {
              // insert metadata in off-chain store
              const datajson = JSON.parse(data.toString());
              const listingInstance = {
                name: name,
                owner: datajson[0],
                hash: datajson[1],
                deposit: datajson[2],
                isWhitelisted: false,
                challengeId: 0,
                rejected: false
              }
              await dataService.insertListing(listingInstance);
              // resolve the promise with listing data
              resolve(listingInstance);
            }
          });
        }
      })
      .catch(err => reject(err));
  });
}
```
The `signAndSend` function also takes a callback as the second parameter. Inside this callback, we are expecting the events from the extrinsic call, among other things. These events are the same that we declared in part 1 of the guide. Remember from part 1 that the `propose` function of the runtime emitted the `Proposed` event with the hash, owner and deposit of the listing. We are expecting and handling this event when we call the `propose` function from the javascript code. If the event section is `tcr` and its method is `Proposed`, it means that the `propose` function in the runtime executed successfully and the listing got created in the TCR in the proposed state.

Ideally, in a real production app, we should subscribe to the events in a separate listener and should update the client side state in that. We should exit the `signAndSend` function with something like a _submitted_ state. Then, when the extrinsic gets finalized and when we handle the event, we should update the status as _proposed_.

Notice that when we handle the `Proposed` event, we create a listing object and call the `insertListing` function in `dataService`. This is what we call priming off-chain storage based on events. We will cover more on this in the part 4 of the guide.

### Calling other runtime functions

Just like we called the `propose` function of the TCR runtime, we can call the `challenge`, `vote`, `resolve` and `claim_reward` functions also. In the exact same way, we call the functions using the `api.tx.<module name>.<function name>` convention and handle the corresponding events to update the UI and the off-chain state.

The [tcrService.js file](https://github.com/substrate-developer-hub/substrate-tcr-ui/blob/master/src/services/tcrService.js) has all the function calls implemented in the same way.

In the [next part](building-an-event-based-off-chain-storage.md) of this guide, we will learn how we can build an event-based off-chain storage and use it to optimize our DAppChain solution.

---
title: "Building an event based off-chain storage"
---
This is Part 4 of the guide [Building a Token Curated Registry DAppChain on Substrate](index.md). In [part 1](building-the-substrate-tcr-runtime.md), we implemented a substrate runtime module for a TCR. In [part 2](unit-testing-the-tcr-runtime-module.md), we wrote unit tests for our runtime. In [part 3](building-a-ui-for-the-tcr-runtime.md), we built a simple UI to interact with the Substrate TCR runtime. In this part, we will look at how we can further optimize our TCR DAppChain solution by building an off-chain storage.

## Purpose

In scenarios where we have to analyze the on-chain data and query it from client applications, we need a more optimized way of accessing it. In the TCR use case, what if there is a stake-holder looking for answers to the following questions?

1. How many listings are proposed in a sample time duration?
2. What's the average time for listings to reach resolved state?
3. What was the total staked deposit at a point in time?

The answers to these questions will require several queries on the TCR data. Directly querying the on-chain data can hamper the performance of the node. Also, the node and the APIs are generally not optimized for analytics queries.

In scenarios like these, it is preferred to have an off-chain storage syncing with the on-chain data so that the data can be more accessible for analytics and other needs.

## Event based syncing

Now that we have a reason to setup an off-chain storage for our DAppChain, we need a way to make sure that the on-chain and off-chain stores are always in sync. This can be easily achieved using the runtime events. Remember from part 1 that we declared several events to communicate the state changes on the TCR data. Also, remember from part 2 that we handled these events in the client side when they were emitted through the runtime extrinsic calls. We can use these events to build an off-chain store without querying any data from the chain.

Using the events, we can insert into and update the off-chain storage either by using the client-side code or by using a background listener. The approach using the client side won't work if the client is not always connected, because then it will miss the events and the off-chain store would become stale. The background listener approach would be more suitable in production scenarios.

The following diagram shows how the event listener approach works.

![substrate-listener](https://raw.githubusercontent.com/parity-samples/substrate-events-listener/master/img/substrate-listener.png)

## Sample code

We created a sample [Substrate events listener](https://github.com/parity-samples/substrate-events-listener) to showcase this approach. The listener sample is a simple node.js based web-socket client which subscribes to Parity Substrate runtime events and stores them in a data store.

In the following code snippet, a function listens to all the Substrate events using a web-socket connection, filters the event data based on custom rules and inserts them into a configured data store. The functions use the same PolkadotJS API which we also used in part 2 of the guide to connect to the Substrate node and runtime. The full code is available as part of the [server.js](https://github.com/parity-samples/substrate-events-listener/blob/master/server.js) file of the listener sample.

```javascript
// code from https://polkadot.js.org/api/examples/rx/08_system_events/
async function main() {
  // get event filters from config
  const eventsFilter = utils.getEventSections();
  // initialize the data service
  // internally connects to all storage sinks
  await dataService.init();

  // Create API with connection to the local Substrate node
  // If your Substrate node is running elsewhere, add the config (server + port) in .env
  // Use the config in the create function below
  ApiRx.create()
    .pipe(
      switchMap((api) =>
        api.query.system.events()
      ))
    // subscribe to system events via storage
    .subscribe(async (events) => {
      events.forEach(async (record) => {
        // extract the event object
        const { event, phase } = record;
        // check section filter
        if (eventsFilter.includes(event.section.toString()) || eventsFilter.includes("all")) {
          // create event object for data sink
          const eventObj = {
            section: event.section,
            method: event.method,
            meta: event.meta.documentation.toString(),
            data: event.data.toString()
          }

          // remove this log if not needed
          console.log('Event Received: ' + Date.now() + ": " + JSON.stringify(eventObj));

          // insert in data sink
          // can have some error handling here
          // should not fail or catch exceptions gracefully
          await dataService.insert(eventObj);
        }
      });
    });
};
```

In the [Substrate events listener](https://github.com/parity-samples/substrate-events-listener) sample, we have a [pre-configured MongoDB client](https://github.com/parity-samples/substrate-events-listener/blob/master/lib/dataService.js) to insert data into a MongoDB instance. More clients can be configured in addition to or in place of the existing MongoDB client.

After the off-chain storage sync is setup using the event listener, we can use this store for querying, analytics and other requirements.

## Potential Issues

When using this approach of maintaining an off-chain store, there could be sync issues because of network partitions or temporary forks on the chain.

To get a better idea of sync status between the on-chain and off-chain stores, the off chain store could also maintain the latest block number. When querying from the off-chain store, the block numbers in both places (on-chain and off-chain) could be compared to ensure that the data in the off-chain store is not stale.

The off-chain storage approach presented here should not be used _as-is_ in a production application. Solutions for corrective measures (for bringing the stores in sync) should be defined in the context of the use-case, before implementing this approach.

In the [next and final part](tcr-best-practices.md) of this guide, we will learn some of the best practices for building Substrate runtimes.
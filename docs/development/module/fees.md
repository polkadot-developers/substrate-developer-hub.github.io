---
title: Transaction Fees
---

When transactions are submitted to a blockchain, they are executed by the nodes in the network. To be economically sustainable, the cost nodes incur to execute a transaction must be covered by the submitter of the transaction. The cost to execute transactions varies over orders of magnitude, and thus Substrate provides a flexible mechanism for characterizing the total cost of a transaction.

## Formula
The fee to execute a transaction consists of three parts
```
total_fee = base_fee + length_fee * length + weight_fee * weight
```

* `base_fee` a fixed fee that is applied to every single transaction.
* `length_fee` a per-byte fee that is multiplied by the length, in bytes, of the serialized transaction
* `weight_fee` a per-weight-unit fee that is multiplied by the weight of the transaction. Transaction weighing is highly customizable.

> Transactors may also include optional tips in transactions to incentivize validators to include the transactions faster. Tips are a separate concept and are not covered here.


## Weight Basics
Transaction weights allow developers to express the cost of executing a transaction as a function of it's arguments. In many cases the computational complexity of a function can be captured in terms of the arguments. Some theoretical and practical advice for doing so is given below.

How theoretical do we want to be vs how practical? 

## Examples
O(n) in an integer parameter
link to recipes

## Limitations
some operations get more expensive as storage grows and shrinks.
Is the weighting function open to change through governance short of a runtime upgrade?

## What is the default weight if left undefined?
I think it's `FreeNormal`

## How should I measure the "weight" of a function?
@kianenigma Can you explain the fundamentals of what you did for https://docs.google.com/spreadsheets/d/1h0RqncdqiWI4KgxO0z9JIpZEJESXjX_ZCK6LFX6veDo/edit?ts=5d8b02b7#gid=765851977

Material to link
https://en.wikipedia.org/wiki/Analysis_of_algorithms
https://en.wikipedia.org/wiki/Computational_complexity

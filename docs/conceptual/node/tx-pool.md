---
title: Transaction Pool
---


The transaction pool contains all transactions broadcasted to the network. The pool is responsible for:

1) Validating that transactions are correct. For example, ensuring the account that issued the transaction has enough funds to pay the associated fees.

2) Sorting the transactions into 2 transaction queues:
  - **Ready Queue** -  Contains transactions that can be included in a new pending block and must follow the *exact* order in the ready queue.

  - **Futue Queue** - Contains transactions that *seem* valid, but the block producer node has yet to see the remaining transactions it depends on. For example, *Transaction B* is in the future queue and can only be included in the block after *Transaction A* has been included. However, the node is yet to see *Transaction A* in its transaction pool.

Both the transaction pool and transaction queues are local to full nodes in the network. Full nodes don't share any information about their internal ordering with other nodes, and they can implement different strategies for importing transactions.


* What is priority?

* What is dependency?

* Graph VS Queue

* What is the lifecycle of a transaction?

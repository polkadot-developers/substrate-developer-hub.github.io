---
title: "Part 4 - Use external accounts"
---


# 4.2 Good to know

If you play around with this DApp, and send for example 1 "unit" from Alice to your newly created extension account, you will realize a couple things. First of all, Alice account gets decreased, by more than 1 unit. You probably got it, you need to pay fees for the transfer.

Now more currious, the transaction is successfull, yet Bob's balance remains unchanged. This is not a bug, it's a feature, explication:
The Substrate node we are querying has a `Balance` module. This module is responsible for keeping track of aaaaall the accounts on the blockchain. Our blockchain is a dev one, that's being reset every hour, but imagine a production blockchain that anyone can access. Now imagine that this blockchain becomes popular and maaaany accounts are created, some of them containing a fraction of a cent in value. The blockchain ends up using a lot of storage for useless accounts. To combat this, the `Balances` module that our node contains has a so called *Existential Deposit* a.k.a ED. If an account has less funds than this ED, the account will be removed entirely from the state. on the `--dev` node, the ED is `100'000'000`. So make sure to send around great amount of units if you want to see things change.

Also if you transfer funds to a newly created account, there will be a so called creation fee applied. To have an overview of all the fees that may apply, there's a derive query for that [`api.derive.balances.fees`](https://github.com/polkadot-js/api/blob/master/packages/api-derive/src/balances/fees.ts)!

# 4.3 Getting further - Extract the send button into its own component
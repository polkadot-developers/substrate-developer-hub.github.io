---
title: Account Abstractions
---

Substrate uses multiple sets of public/private key pairs to represent participants of the network.

## Overview

Blockchain systems have participants in varying roles, for example from validators to normal users.

As an example, the Substrate node uses a Nominated Proof-of-Stake (NPoS) algorithm to select
validators. Validators and nominators may hold significant amounts of funds, so Substrate's Staking
pallet introduces account abstractions that help keep funds as secure as possible.

These abstractions are:


- **Stash Key**: a Stash account is meant to hold large amounts of funds. Its private key should be
    as secure as possible in a cold wallet.
- **Controller Key**: a Controller account signals choices on behalf of the Stash account, like
    payout preferences, but should only hold a minimal amount of funds to pay transaction fees. Its
    private key should be secure as it can affect validator settings, but will be used somewhat
    regularly for validator maintenance.
- **Session Keys**: these are "hot" keys kept in the validator client and used for signing
  certain validator operations. They should never hold funds.

> **Note:** Learn more about validators and nominators in the context of the Substrate's NPoS
> [Staking pallet](https://substrate.dev/rustdocs/latest/pallet_staking/index.html).

## Account Keys

A key pair can represent an account and control funds, like normal accounts that you would expect
from other blockchains. In the context of Substrate's
[Balances pallet](https://substrate.dev/rustdocs/latest/pallet_balances/index.html), these accounts
must have a minimum amount (an "existential deposit") to exist in storage.

Account keys are defined generically and made concrete in the runtime.

To continue with our example of Stash and Controller accounts, the keys to these accounts are
distinguished by their intended use, not by any underlying cryptographic difference. When creating
Stash or Controller keys, all cryptography supported for normal account keys are also supported.

### Stash Keys

The Stash keys are the public/private key pair that defines a Stash account. This account is like a
"savings account" in that you should not make frequent transactions from it. Therefore, its private
key should be treated with the utmost security, for example protected in a safe or layers of
hardware security.

Since the Stash key is kept offline, it designates a Controller account to make non-spending
decisions with the weight of the Stash account's funds. It can also designate a Proxy account to
vote in governance on its behalf.

### Controller Keys

The Controller keys are the public/private key pair that defines a Controller account. In the
context of Substrate's NPoS model, the Controller key will signal one's intent to validate or
nominate.

The Controller key is used to set preferences like the rewards destination and, in the case of
validators, to set their Session keys. The Controller account only needs to pay transaction fees, so
it only needs a minimal amount of funds.

The Controller key can never be used to spend funds from its Stash account. However, actions taken
by the Controller can result in slashing, so it should still be well secured.

## Next Steps

### Learn More

- Learn more about Session Keys in the [next section](./session-keys).
- Learn about the [cryptography used within Substrate](../advanced/cryptography).

### Examples

- Follow our
  [tutorial to create a local network and generate keys](../../tutorials/start-a-private-network/).

### References

- Visit the reference docs for the
  [session keys runtime API](https://substrate.dev/rustdocs/latest/sp_session/trait.SessionKeys.html).

- Take a look at the default
  [session keys in the Substrate node runtime](https://substrate.dev/rustdocs/latest/node_runtime/struct.SessionKeys.html).


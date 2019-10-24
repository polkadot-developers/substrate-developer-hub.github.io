---
title: Substrate Keys
---

Substrate uses multiple sets of public/private key pairs to represent
participants of the network.

## Overview

Blockchain systems involve a number of participants playing different roles in
the system. The Substrate node uses a nominated proof of stake (NPoS) system by
default. In this system, there are two core roles:

1. Validators: Users that produce blocks.
2. Nominators: Users that support a validator.

Validators need to collect funds which back their intention to produce blocks.
Validators can provide their own funds, and also collect funds from nominators
who trust the validator to produce new blocks correctly. As a reward for doing
things correctly, both validators and their respective nominators get paid.
These funds can be used for slashing if the validator misbehaves.

> **Note:** Learn more about validators and nominators in the context of the
> Substrate's NPoS [Staking module](/rustdocs/master/srml_staking/index.html).

Both validators and nominators may be working with a significant value of funds,
so Substrate has introduced abstractions which allow safer behaviors for end
users participating in the network.

These abstractions are:

* [Account Keys](#account-keys): Accounts that should hold funds.
    * [Stash Keys](#stash-keys): Cold wallets controlled by controller keys.
    * [Controller Keys](#controller-keys): Semi-online keys that will be in the
      direct control of a user and used to submit extrinsics.
* [Session Keys](#session-keys): Hot keys that be must kept online by a
  validator to perform network operations and should not hold funds.

## Account Keys

Account keys represent the normal kind of accounts you might expect from other
blockchain systems. These accounts hold funds, and in the context of Substrate's
Balances module, must have at least an existential deposit amount of those
funds. Accounts keys are defined generically and its type is ultimately made
concrete in the runtime. They interact with the blockchain through transactions.

In the context of Substrate's Staking module, there are two abstractions on top
of account keys:

1. Stash Keys
2. Controller Keys

These keys are distinguished by their intended use, not by any underlying
cryptographic difference. When creating new controller or stash keys, all
cryptography supported by account keys are an available option.

### Stash Keys

Stash keys are intended to behave like a cold wallet, existing on a piece of
paper in a safe or protected by layers of hardware security. It should rarely,
if ever, be exposed to the internet or used to submit extrinsics. They are meant
to hold a large amount of funds, and should be thought of as a saving's account
at a bank, which ideally is only ever touched in urgent conditions.

Since the stash key is kept offline, it must be set to have its funds bonded to
a controller account. For non-spending actions, the controller has the funds of
the stash behind it. For example, in nominating, staking, or voting, the
controller can indicate its preference with the weight of the stash.

### Controller Keys

The controller key is a semi-online key that will be in the direct control of a
user and used to submit extrinsics. In the context of Substrate's NPoS system,
the controller key is used to start or stop validating or nominating. Controller
accounts should have funds to keep the account alive and to pay for fees.

A controller key will never be able to move or claim the funds controlled the
stash key. However, actions taken by the controller account can cause the stash
funds to be slashed. So you still need to protect it and change it regularly.

## Session Keys

Session keys are "hot keys" that are used by validators to sign
consensus-related messages. They are not meant to be used as account keys that
control funds and should only be used for their intended purpose. They can be
changed regularly; your controller only needs to create a certificate by signing
a session public key and broadcast this certificate via an extrinsic. Session
keys are also defined generically and made concrete in the runtime.

To create a Session key, validator operators must attest that a key acts on
behalf of their Stash account (stake) and nominators. To do so, they create a
certificate by signing the key with their Controller key. Then, they inform the
chain that this key represents their Controller key by publishing the Session
certificate in a transaction on the chain.

Substrate provides the [Session
module](/rustdocs/master/srml_session/index.html), which allows validators to
manage their session keys.

### Strongly Typed Wrappers

You can declare any number of session keys. For example, the default Substrate
node uses three for BABE, GRANDPA, and "I'm Online". Other chains could have
more or fewer depending on what operations the chain expects its validators to
perform.

These different Session keys could use the same cryptography, but serve very
different purposes throughout your runtime logic. To prevent the wrong key being
used for the wrong operation, strong Rust types wrap these keys, keeping them
incompatible with one another and ensuring they are only used for their intended
purpose.

### Generation

If a Session key is compromised, attackers could commit slashable behavior.
Session keys should be changed regularly (e.g. every session) via [the
`rotate_keys`
RPC](/rustdocs/master/substrate_rpc/author/trait.AuthorApi.html#tymethod.rotate_keys)
for increased security.

## Next Steps

### Learn More

* Learn about the [cryptography used within
  Substrate](conceptual/cryptography/index.md).

### Examples

* Take a look at this [recipe to introduce new session keys to your custom
  Substrate runtime](TODO).

* Follow our [tutorial to create a local network and generate keys](TODO).

### References

* Visit the reference docs for the [session keys runtime
  API](/rustdocs/master/substrate_session/trait.SessionKeys.html).

* Take a look at the default [session keys in the Substrate node
  runtime](/rustdocs/master/node_runtime/struct.SessionKeys.html).

* Take a look at
  [`substrate_application_crypto`](/rustdocs/master/substrate_application_crypto/index.html),
  used for constructing application specific strongly typed crypto wrappers.

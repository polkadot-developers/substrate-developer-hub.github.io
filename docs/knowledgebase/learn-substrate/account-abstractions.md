---
title: Account Abstractions
---

Substrate uses multiple sets of public/private key pairs to represent participants of the network.

## Overview

Blockchain systems have participants in varying roles, for example from validators to normal users.

As an example, the Substrate node uses a Nominated Proof-of-Stake (NPoS) algorithm to select
validators. Validators and nominators may hold significant amounts of funds, so Substrate's Staking
module introduces account abstractions that help keep funds as secure as possible.

These abstractions are:

- Accounts
  - Stash Key: The Stash account is meant to hold large amounts of funds. Its private key should be
    as secure as possible in a cold wallet.
  - Controller Key: The Controller account signals choices on behalf of the Stash account, like
    payout preferences, but should only hold a minimal amount of funds to pay transaction fees. Its
    private key should be secure as it can affect validator settings, but will be used somewhat
    regularly for validator maintenance.
- Session Keys: Session keys are "hot" keys kept in the validator client and used for signing
  certain validator operations. They should never hold funds.

> **Note:** Learn more about validators and nominators in the context of the Substrate's NPoS
> [Staking module](https://substrate.dev/rustdocs/v2.0.0-rc4/pallet_staking/index.html).

## Account Keys

A key pair can represent an account and control funds, like normal accounts that you would expect
from other blockchains. In the context of Substrate's
[Balances module](https://substrate.dev/rustdocs/v2.0.0-rc4/pallet_balances/index.html), these accounts
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

## Session Keys

Session keys are "hot keys" that are used by validators to sign consensus-related messages. They are
not meant to be used as account keys that control funds and should only be used for their intended
purpose. They can be changed regularly; your Controller only needs to create a certificate by
signing a session public key and broadcast this certificate via an extrinsic. Session keys are also
defined generically and made concrete in the runtime.

To create a Session key, validator operators must attest that a key acts on behalf of their Stash
account (stake) and nominators. To do so, they create a certificate by signing the key with their
Controller key. Then, they inform the chain that this key represents their Controller key by
publishing the Session certificate in a transaction on the chain.

Substrate provides the
[Session module](https://substrate.dev/rustdocs/v2.0.0-rc4/pallet_session/index.html), which allows
validators to manage their session keys.

### Strongly Typed Wrappers

You can declare any number of Session keys. For example, the default Substrate node uses three for
BABE, GRANDPA, and "I'm Online". Other chains could have more or fewer depending on what operations
the chain expects its validators to perform.

These different Session keys could use the same cryptography, but serve very different purposes
throughout your runtime logic. To prevent the wrong key being used for the wrong operation, strong
Rust types wrap these keys, keeping them incompatible with one another and ensuring they are only
used for their intended purpose.

### Generation

If a Session key is compromised, attackers could commit slashable behavior. Session keys should be
changed regularly (e.g. every session) via
[the `rotate_keys` RPC](https://substrate.dev/rustdocs/v2.0.0-rc4/sc_rpc/author/trait.AuthorApi.html#tymethod.rotate_keys)
for increased security.

## Next Steps

### Learn More

- Learn about the [cryptography used within Substrate](../advanced/cryptography).

### Examples

- Follow our
  [tutorial to create a local network and generate keys](../../tutorials/start-a-private-network/).

### References

- Visit the reference docs for the
  [session keys runtime API](https://substrate.dev/rustdocs/v2.0.0-rc4/sp_session/trait.SessionKeys.html).

- Take a look at the default
  [session keys in the Substrate node runtime](https://substrate.dev/rustdocs/v2.0.0-rc4/node_runtime/struct.SessionKeys.html).

- Take a look at
  [`substrate_application_crypto`](https://substrate.dev/rustdocs/v2.0.0-rc4/sp_application_crypto/index.html),
  used for constructing application specific strongly typed crypto wrappers.

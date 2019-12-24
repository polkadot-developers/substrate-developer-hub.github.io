---
title: Session Keys
---

Session keys are used by validators to sign consensus-related messages. `SessionKeys` is a generic, indexable type that is made concrete in the runtime.

To create a Session key, validator operators must attest that a key acts on behalf of their Stash account (stake) and nominators. To do so, they create a certificate by signing the key with their Controller key. Then, they inform the chain that this key represents their Controller key by publishing the Session certificate in a transaction on the chain.

You can declare any number Session keys. For example, the default Substrate node uses three. Other chains could have more or fewer depending on what operations the chain expects its validators to perform.

```rust
pub struct SessionKeys {
  #[id(key_types::GRANDPA)]
  pub grandpa: GrandpaId,
  #[id(key_types::BABE)]
  pub babe: BabeId,
  #[id(key_types::IM_ONLINE)]
  pub im_online: ImOnlineId,
}
```

> **Note:** This code is just an example of the Substrate node at the time of writing. Refer to the runtime for the most up-to-date implementation.

The default Substrate node implements Session keys in the [Session module](https://substrate.dev/rustdocs/master/pallet_session/).

## Generation and Use

Session keys are hot keys that must be kept online. They are not meant to be used as account keys. If one of the Session keys is compromised, the attacker could commit slashable behavior. Session keys may be changed regularly (e.g. every session) via [RPC](https://substrate.dev/rustdocs/master/sc_rpc/author/trait.AuthorApi.html#tymethod.rotate_keys) for increased security.

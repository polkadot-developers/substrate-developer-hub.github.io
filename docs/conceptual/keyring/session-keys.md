---
title: Session Keys
---

Session keys are used by validators to sign consensus-related messages.
`SessionKeys` is a generic, indexable type that is made concrete in the runtime.

To create a Session key, validator operators must attest that a key acts on
behalf of their Stash account (stake) and nominators. To do so, they create a
certificate by signing the key with their Controller key. Then, they inform the
chain that this key represents their Controller key by publishing the Session
certificate in a transaction on the chain.

You can declare any number Session keys. For example, the default Substrate node
uses three. Other chains could have more or fewer depending on what operations
the chain expects its validators to perform.

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

> **NOTE:** This code is just an example of the Substrate node at the time of
> writing. Refer to the source code and
> [documentation](/rustdocs/master/node_runtime/struct.SessionKeys.html) for the
> most up-to-date implementation.

The default Substrate node implements Session keys in the [Session
module](/rustdocs/master/srml_session/index.html).

## Generation and Use

Session keys are hot keys that must be kept online. They are not meant to be
used as account keys. If one of the Session keys is compromised, the attacker
could commit slashable behavior. Session keys may be changed regularly (e.g.
every session) via
[RPC](/rustdocs/master/substrate_rpc/author/trait.AuthorApi.html#tymethod.rotate_keys)
for increased security.

## Next Steps

### Learn More

* Learn about the [cryptography used within
  Substrate](conceptual/keyring/session-keys.md).

### Examples

* Take a look at this [recipe to introduce new session keys to your custom
  Substrate runtime](TODO).

* Follow our [tutorial to create and rotate your session keys on a local
  network](TODO).

### References

* Visit the reference docs for the [session keys runtime
  API](/rustdocs/master/substrate_session/trait.SessionKeys.html).

* Take a look at the default [session keys in the Substrate node
  runtime](/rustdocs/master/node_runtime/struct.SessionKeys.html).

* Take a look at
  [`substrate_application_crypto`](/rustdocs/master/substrate_application_crypto/index.html),
  used for constructing application specific strongly typed crypto wrappers.

---
title: Session Keys
---

Session keys are used by validators to sign consensus-related messages. `SessionKeys` is a generic,
indexable type that is made concrete in the runtime.

You can declare any number Session keys. For example, the default Substrate node uses four. Other
chains could have more or fewer depending on what operations the chain expects its validators to
perform.

In practice, validators amalgamate all of the session public keys into a single object, sign the set
of public keys with a "Controller" account, and submit a transaction to register the keys on chain.
This on-chain registration links a validator _node_ with an _account_ that holds funds. As such,
that account can be credited with rewards or slashed based on the node's behavior.

The runtime declares what session keys will be included (`runtime/src/lib.rs`):

```rust
impl_opaque_keys! {
    pub struct SessionKeys {
        pub grandpa: Grandpa,
        pub babe: Babe,
        pub im_online: ImOnline,
        pub authority_discovery: AuthorityDiscovery,
    }
}
```

The actual cryptographic curve that each key uses gets defined in `primitives`. For example, BABE's
key uses sr25519:

```rust
mod app {
	  use sp_application_crypto::{app_crypto, key_types::BABE, sr25519};
	  app_crypto!(sr25519, BABE);
}
```

> This code is just an example of the Substrate node at the
> [time of writing](https://github.com/substrate-developer-hub/substrate-node-template).
> Refer to the runtime for the most up-to-date implementation.

The default Substrate node implements Session keys in the
[Session pallet](https://substrate.dev/rustdocs/v2.0.0/pallet_session/).

## Generation and Use

Session keys are hot keys that must be kept online. The individual keys should **not** be used to
control funds. All the logic for handling session keys is in the Substrate client, primitives, and
Session pallet. If one of the Session keys is compromised, the attacker could commit slashable
behavior.

Node operators can generate keys via the RPC call
[`author_rotateKeys`](https://substrate.dev/rustdocs/v2.0.0/sc_rpc/author/trait.AuthorApi.html#tymethod.rotate_keys).
You will then need to register the new keys on chain with a `session.setKeys` transaction.

Keys can be changed regularly; by creating a certificate via signing a session public key
and broadcasting this certificate via an extrinsic.


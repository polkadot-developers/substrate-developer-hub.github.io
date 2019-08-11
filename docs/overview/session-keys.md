---
title: "Session Certificate"
---

The Session certificate is a set of keys that validators use to sign messages. `SessionKeys` is a generic, indexable type that is made concrete in the runtime. You can declare any number of keys in the Session certificate.

For example, the default Substrate node uses three keys in its Session certificate. Other chains could have more or fewer depending on what operations the chain expects its validators to perform.

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

> **NOTE:** This code is just an example of the Substrate node at the time of writing. Refer to the runtime for the most up-to-date implementation.

The default Substrate node implements Session keys in the [Session module](/rustdocs/v1.0/srml_session/index.html).

## Generation and Use

Session keys are hot keys that must be kept online. They are not meant to be used as account keys. If one of the Session keys is compromised, the attacker could commit slashable behavior. Session keys may be changed regularly (e.g. every session) via RPC for increased security.

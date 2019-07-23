---
title: "Session Certificate"
---

The Session certificate is a set of keys that validators use to sign messages. `SessionKeys` is a generic, indexable type that is made concrete in the runtime. You can declare any number of keys in the Session certificate. Polkadot, for example, uses [three keys](https://wiki.polkadot.network/en/latest/polkadot/learn/keys/#session-key) in its Session certificate. Other chains could have more or fewer depending on what operations the chain expects its validators to perform.

The default Substrate node implements Session keys in the [Session module](/rustdocs/v1.0/srml_session/index.html).

## Generation and Use

Session keys are hot keys that must be kept online. They are not meant to be used as account keys. If one of the Session keys is compromised, the attacker could commit slashable behavior. Session keys may be changed regularly (e.g. every session) for increased security.

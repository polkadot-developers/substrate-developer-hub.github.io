---
title: "Session Keys"
---

A Session key (technically a Session Certificate) is comprised of three key-pairs that are used by validators for network operations and signing.

The default substrate node uses session keys thanks in part to the [Session module](/rustdocs/v1.0/srml_session/index.html).


## BLS (Boneh-Lynn-Shacham) key
This first key is used for consensus signatures when voting since it is desirable to be used with the GRANDPA finality gadget. BLS is preferred for voting in consensus algorithms and threshold signatures as it allows more efficient signature aggregation than when using Schnorr signatures.


## Schnorrkel/Ristretto x25519 ("Sr25519") key
This second key is used for producing blocks with BABE (using Schnorr signatures). It was created specifically to handle Substrate and Polkadot use cases. "Sr25519" is based on the same underlying Curve25519 as its EdDSA counterpart, Ed25519, but it uses Schnorr signatures instead of the EdDSA scheme, since they are more efficient, retain the same feature set and security assumptions, and allow for native multisignature through signature aggregation. It is superior to Ed25519 for implementing complex protocols.

## Ed25519 key (using Schnorr signatures)
This third key is used for identifying itself to other nodes over libp2p. It is used for simpler implementations like account keys that only need to provide signature capabilities. It has a broader support ecosystem (i.e. HSMs are already available for it).


## Generation and Use
The "Seed" of an account generated with `subkey` may be used as the Session key of only a single Substrate validator at any one time (i.e. using `substrate --key <SEED>`).

Session keys are hot keys that must be kept online, so it is not recommended to store funds on accounts used for a Session key, as they may be cycled through (possibly automatically), and if the Session key is leaked or the validator node that uses the Session key is compromised then theft of funds may occur.

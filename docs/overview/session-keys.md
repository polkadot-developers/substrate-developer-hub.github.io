---
title: "Session Certificate"
---

The Session certificate is a set of three key-pairs that are used by nodes and validators for network operations and signing.

The default Substrate node implements Session keys in the [Session module](/rustdocs/v1.0/srml_session/index.html).

## GRANDPA Key

GRANDPA currently uses an ed25519 key for voting. In the future, it will use a BLS12-381 (Barreto-Lynn-Scott) key, as it allows efficient signature aggregation with [BLS (Boneh-Lynn-Shachman) signatures](https://github.com/w3f/bls).

## VRF Key

A [Schnorr/Ristretto x25519 ("sr25519")](https://github.com/w3f/schnorrkel) key is used for evaluating the verifiable random function (VRF) in BABE, a block production algorithm. It was created specifically to handle Substrate and Polkadot use cases. Sr25519 implements Schnorr signatures on a [Ristretto-compressed](https://ristretto.group) ed25519 curve.

## Network Key

A Substrate node uses an ed25519 key to identify itself to other nodes over [libp2p](https://github.com/libp2p/rust-libp2p).

## Generation and Use

Session keys are hot keys that must be kept online. They are not meant to be used as account keys. If one of the Session keys is compromised, the attacker could commit slashable behavior. Session keys may be changed regularly (e.g. every session) for increased security.

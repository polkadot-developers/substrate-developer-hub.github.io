---
title: "Keys, Seeds, and the `subkey` Tool"
---
Subkey is a key-generation utility that is developed alongside substrate. Its main features are generating Ed25519 and Sr25519 key pairs, encoding SS58 addresses, and restoring keys from seeds. This guide serves as an introduction and tour of the tool. Once you are basically familiar with `subkey`, it will be more time-efficient to refresh your memory by looking at `subkey help` than by re-reading this intro.

# Building the Subkey Binary

## One-line Install
The Subkey binary, `subkey`, is also installed along with the [Substrate installation](quickstart/installing-substrate.md). If you want to play with just subkey (and not substrate), you can compile and install it with this one-line command.
```bash
cargo install --force --git https://github.com/paritytech/substrate subkey
```

## Compiling with Cargo
If you already have the [Substrate repository](https://github.com/paritytech/substrate) cloned, you can build it with
```bash
cargo build -p subkey
```

# Generating and Inspecting Keys with Subkey

## Generating Your First Key
Generate a Sr25519 key by running:
```bash
satoshi@jambox$ subkey generate

Phrase `mosquito sketch face supreme side tourist monkey damp idea warm luggage better` is account:
  Seed: 0xe35fdbf9b9ddf8e54e0c1d49fe50561a5a7fd31728450f7a9f8663820c09401e
  Public key (hex): 0xec57cf6230ce7e675123d056eda9ab331aa6fb3ba422c5fd194721ddc6b69a14
  Address (SS58): 5HQbF3hCugq71XdCk43FcxVqduhu7JojGiBfzD8iEFW22kiy
```

Subkey has just consumed some entropy and generated a cryptographic SR25519 key-pair. The output tells us a few properties of our key.

Phrase (aka **Mnemonic Phrase**) - A series of English words that encodes the seed in a more human-friendly way.
Seed (aka **Private Key / Raw Seed**) - The minimum necessary information to restore the key pair. All other information is calculated from the seed.
**Public Key** - The public half of the cryptographic key-pair in hexadecimal (hex).
Address (**Public Address**) - An SS58 hash based on the public key.

Note: See https://github.com/paritytech/substrate/pull/2669#issuecomment-495702589 for reasons why `subkey` outputs have not yet been updated.

## Inspecting keys
The inspect command recalculates a key-pair's public key and public address given it's seed. This shows that it is sufficient to backup the seed alone.
```bash
satoshi@jambox$ subkey inspect 0xe35fdbf9b9ddf8e54e0c1d49fe50561a5a7fd31728450f7a9f8663820c09401e

Secret Key URI `0xe35fdbf9b9ddf8e54e0c1d49fe50561a5a7fd31728450f7a9f8663820c09401e` is account:
  Public key (hex): 0xec57cf6230ce7e675123d056eda9ab331aa6fb3ba422c5fd194721ddc6b69a14
  Address (SS58): 5HQbF3hCugq71XdCk43FcxVqduhu7JojGiBfzD8iEFW22kiy
```

You can also inspect the key by it's mnemonic phrase. Mind the quotes.
```bash
satoshi@jambox$ subkey inspect "mosquito sketch face supreme side tourist monkey damp idea warm luggage better"

Secret Key URI `mosquito sketch face supreme side tourist monkey damp idea warm luggage better` is account:
  Public key (hex): 0xec57cf6230ce7e675123d056eda9ab331aa6fb3ba422c5fd194721ddc6b69a14
  Address (SS58): 5HQbF3hCugq71XdCk43FcxVqduhu7JojGiBfzD8iEFW22kiy
```

Mnemonic phrases are cool. They were first introduced in Bitcoin (see [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)) and make it much easier to manually write down your key. They also allow cool things like "memorizing" your life savings.

## External Address Format (SS58)
 
SS58 is an address format for Substrate-based chains. See https://github.com/substrate-developer-hub/docs/issues/90.

## Session keys

A Session key is actually a Session Certificate since each one comprises of three keys that are used by validators for network operations, and for key-pairs and signing. The three keys include:

- BLS (Boneh-Lynn-Shacham) key, which is used for consensus signatures when voting since it is desirable to be used with the GRANDPA finality gadget. BLS is preferred for voting in consensus algorithms and threshold signatures. It allows more efficient signature aggregation than when using Schnorr signatures. It will be used by validators in Substrate and Polkadot since they are more efficient than Schnorr signatures in some ways.
- Schnorrkel/Ristretto x25519 ("Sr25519") key, which is used for producing blocks with BABE (using Schnorr signatures). It was created specifically to handle Substrate and Polkadot use cases. "Sr25519" is based on the same underlying Curve25519 as its EdDSA counterpart, Ed25519, but it uses Schnorr signatures instead of the EdDSA scheme, since they are more efficient, retain the same feature set and security assumptions, and allow for native multisignature through signature aggregation. It is superior to Ed25519 for implementing complex protocols.
- Ed25519 key (using Schnorr signatures) is used for identifying itself to other nodes over libp2p. It is used for simpler implementations like account keys that only need to provide signature capabilities. It has a broader support ecosystem (i.e. HSMs are already available for it).

The "Seed" of an account generated with `subkey` may be used as the Session key of only a single Substrate validator at any one time (i.e. using `substrate --key <SEED>`).

Session keys are hot keys that must be kept online, so it is not recommended to store funds on accounts used for a Session key, as they may be cycled through (possibly automatically), and if the Session key is leaked or the validator node that uses the Session key is compromised then theft of funds may occur.

## Ed25519 keys
So far we've been using Sr25519 keys. Substrate uses those keys in most places, which is why they are the default for `subkey`. Ed25519 keys may be generated by providing the `-e` or `--ed25519` flag (see `subkey help`):

```bash
satoshi@jambox:~$ subkey -e generate
Phrase `kick raw cram palm fiction term two salt allow document hidden mix` is account:
  Seed: 0x8167e5997afeed9886bc88ebb94d8905b330540bfa4624dcc6d0e983171e67ed
  Public key (hex): 0x61319aa2d62a87bb1adbe18ab436bc60ab949dea07a1b7859deb13bdfbb85f53
  Address (SS58): 5EG9Ej4JPcb1YHn8R2ai5p7EApwTyXMVYiCzueY7yRLwGEAf
```

## Password Protected keys
You can put a password on a key by using the `--password` option (in the example below the password is "pass" followed by the `generate` subcommand, see `subkey help`). The output looks exactly the same as before.
```bash
satoshi@jambox:~$ subkey --password pass generate

Phrase `certain notable bacon broken reflect fragile accuse march bamboo isolate call gate` is account:
  Seed: 0xf4e6c7f224705dc0c803f29a7f721238a23489f4bedd70e9faa839e0a1d1a392
  Public key (hex): 0x229b59387b74aa45eeda235b461b655b84f9694a3e280775d5438d64d477673a
  Address (SS58): 5Cr5dgyZD16Uc6rDNHs494wNCEwD4wfjQvUGG6wdma9EMib8
```

Indeed we can still restore the key with nothing but its seed. This shows that even if the key is generated with a password, the seed alone _still_ holds all the information about the key.
```bash
satoshi@jambox:~$ subkey inspect 0xf4e6c7f224705dc0c803f29a7f721238a23489f4bedd70e9faa839e0a1d1a392

Secret Key URI `0xf4e6c7f224705dc0c803f29a7f721238a23489f4bedd70e9faa839e0a1d1a392` is account:
  Public key (hex): 0x229b59387b74aa45eeda235b461b655b84f9694a3e280775d5438d64d477673a
  Address (SS58): 5Cr5dgyZD16Uc6rDNHs494wNCEwD4wfjQvUGG6wdma9EMib8
```

But notice what happens when we try to restore the key from the mnemonic phrase. Although the output looks _similar_ it is _not_ identical. We are restoring a completely different key-pair. Notice the public key and address don't match.
```bash
satoshi@jambox$ subkey inspect "certain notable bacon broken reflect fragile accuse march bamboo isolate call gate"

Secret Key URI `certain notable bacon broken reflect fragile accuse march bamboo isolate call gate` is account:
  Public key (hex): 0x08898f67df39ba5a5a9f6fd1ed1273cabce440851b537a07fad152f85649ce66
  Address (SS58): 5CFu6zbvJ9Z49w4RXM3FqrkmseSi5aFAUVbvW6jRnZzsZjYG
```

This is because the password we supplied when generating the key-pair is necessary to restore the key from the mnemonic phrase.
```bash
satoshi@jambox$ subkey -p pass inspect "certain notable bacon broken reflect fragile accuse march bamboo isolate call gate"

Secret Key URI `certain notable bacon broken reflect fragile accuse march bamboo isolate call gate` is account:
  Public key (hex): 0x229b59387b74aa45eeda235b461b655b84f9694a3e280775d5438d64d477673a
  Address (SS58): 5Cr5dgyZD16Uc6rDNHs494wNCEwD4wfjQvUGG6wdma9EMib8
```

## Well-known keys
If you've worked with Substrate previously, you likely encountered the ubiquitous accounts for Alice, Bob, and their friends. These keys are not at all private, but are useful for playing with Substrate without always generating new key-pairs. You can inspect these "well-known" keys with `subkey`.

```bash
satoshi@jambox$ subkey inspect //Alice

Secret Key URI `//Alice` is account:
  Public key (hex): 0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
  Address (SS58): 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
```

There is nothing special about the name Alice. You can do the same trick with your own name. But remember that keys like this are _not_ secure, and are only useful for experimenting.
```bash
satoshi@jambox$ subkey inspect //Joshy

Secret Key URI `//Joshy` is account:
  Public key (hex): 0x006f5081d495811a16724b317fcd70b8e42c9317da2ba1f5c36756a41fadec67
  Address (SS58): 5C5GvaAWfruRLnCJYgJrut1JovGeMMXV2VzXeiua7f691J9R
```

## More to Explore
`subkey` is getting more robust all the time. Recently it has added features to sign messages, verify signatures over messages, and create signed token transfer transactions. Learn more by running `subkey help`.

Key-pairs can also be generated in the [PolkadotJS Apps UI](https://github.com/polkadot-js/apps). Try creating keys with the UI and restoring them with `subkey` or vice versa.
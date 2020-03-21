---
title: The Subkey Tool
id: version-v2.0.0-alpha.3-subkey
original_id: subkey
---

Subkey is a key-generation utility that is developed alongside Substrate. Its main features are generating [sr25519](https://github.com/w3f/schnorrkel) and ed25519 key pairs, encoding SS58 addresses, and restoring keys from mnemonics and raw seeds. It can also create and verify signatures, including for encoded transactions.

## Installation

### Build from Source

The Subkey binary, `subkey`, is also installed along with the [Substrate installation](overview/getting-started.md#prerequisites). If you want to play with just Subkey (and not Substrate), you will need to have the Substrate dependencies. Use the following two commands to install the dependencies and Subkey, respectively:

```bash
$ curl https://getsubstrate.io -sSf | bash -s -- --fast
$ cargo install --force --git https://github.com/paritytech/substrate subkey
```

### Compiling with Cargo

If you already have the [Substrate repository](https://github.com/paritytech/substrate), you can build Subkey with:

```bash
$ cargo build -p subkey
```

This will install `subkey` in `./target/debug/subkey`.

### Binary

Parity provides a signed binary for Linux operating systems.

- [Signed release](https://github.com/paritytech/substrate/releases/tag/subkey2.0.0rc)
- GPG Fingerprint: `0xFF0812D491B96798`
- [Full GPG Key](https://keys.mailvelope.com/pks/lookup?op=get&search=security%40parity.io)

<!-- RELEASE-TODO: Update tag link when we release 2.0 -->

## Generating Keys

Generate an sr25519 key by running:

```bash
$ subkey generate

Secret phrase `favorite liar zebra assume hurt cage any damp inherit rescue delay panic` is account:
  Secret seed: 0x235c69907d33b85f27bd78e73ff5d0c67bd4894515cc30c77f4391859bc1a3f2
  Public key (hex): 0x6ce96ae5c300096b09dbd4567b0574f6a1281ae0e5cfe4f6b0233d1821f6206b
  Address (SS58): 5EXWNJuoProc7apm1JS8m9RTqV3vVwR9dCg6sQVpKnoHtJ68
```

For even more security, use `--words 24` (supports 12, 15, 18, 21, and 24):

```bash
$ subkey generate --words 24
Secret phrase `engine ghost pave tip coil undo when next finish between ignore mystery spread model mercy body sphere sense verify crumble ethics garment soon gold` is account:
  Secret seed: 0xddd41c017dd60770a48f7aa50aee940b591726117769bc0740b19c5acfbf24d8
  Public key (hex): 0x8ae95a30cb9daa11db449eeb3243ec2e8937df3620c607d66a7f330a9d48cf01
  Address (SS58): 5FCqnWDeL8KFEhy9ccdeRw64kJbfPLfKgA45kMeo6THj1tkz
```

Subkey encodes the address depending on the network. You can use the `-n` or `--network` flag to change this. See `subkey help` for supported networks.

To generate an ed25519 key, pass the `-e` or `--ed25519` flag:

```bash
$ subkey -e generate
Secret phrase `expire stage crawl shell boss any story swamp skull yellow bamboo copy` is account:
  Secret seed: 0xb034ad2704defa9dc0bea4ac8019fb0f805018f1be587cf04a03f9a033e3656b
  Public key (hex): 0x3ff0766f9ebbbceee6c2f40d9323164d07e70c70994c9d00a9512be6680c2394
  Address (SS58): 5DWYJiPBSFBUFah2W49oPPSsrCRvrY4N4VmLcSH9XfjKfZvh
```

The output gives us the following information about our key:

- **Secret phrase** (aka "Mnemonic Phrase") - A series of English words that encodes the seed in a more human-friendly way. Mnemonic phrases were first introduced in Bitcoin (see [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)) and make it much easier to write down your key by hand.
- **Secret Seed** (aka "Private Key" or "Raw Seed") - The minimum necessary information to restore the key pair. All other information is calculated from the seed.
- **Public Key (hex)** - The public half of the cryptographic key pair in hexadecimal.
- **Address (SS58)** (aka "Public Address") - An SS58-encoded address based on the public key.

You can also create a vanity address, although you will not receive a mnemonic seed:

```bash
$ subkey vanity joe
Generating key containing pattern 'joe'
best: 189 == top: 189
Secret Key URI `0xc645213712dc218e851ac0a47e987ee3f8e1cbbbad85522dbbf86e51963de434` is account:
  Public key (hex): 0xfaff3b483564c4d2dab7229e4369841d3650a4ca9c36094e9faece3839ac6e06
  Address (SS58): 5HjoeXxUokiJwQPRucDXCgGzKwwf74q9srJcmsaFssUW2UHn
```

## Password Protected Keys

To generate a key that is password protected, use the `-p <password>` or `--password <password>` flag:

```bash
$ subkey --password "correct horse battery staple" generate
Secret phrase `razor blouse enroll maximum lobster bacon raccoon ocean law question worry length` is account:
  Secret seed: 0x806e324821f6b09fa0329b7da35b8056b452fdcaadeac463ff2b8db1fc020c3e
  Public key (hex): 0xe2b410bdc959fcc7f756e6eefdb051000c80be339acd3a8dc6d941211160b266
  Address (SS58): 5HBxAo81NWBbg6DQNbTdFg7GWQDS1QmkMwNLQso1e11DfQ2Y
```

Note that the "Secret seed" is _not_ password protected and can still recover the account. The "Secret phrase," however, is not sufficient to recover the account without the password.

## Inspecting Keys

The inspect command recalculates a key pair's public key and public address given its seed. This shows that it is sufficient to back up the seed alone.

```bash
$ subkey inspect 0x235c69907d33b85f27bd78e73ff5d0c67bd4894515cc30c77f4391859bc1a3f2
Secret Key URI `0x235c69907d33b85f27bd78e73ff5d0c67bd4894515cc30c77f4391859bc1a3f2` is account:
  Public key (hex): 0x6ce96ae5c300096b09dbd4567b0574f6a1281ae0e5cfe4f6b0233d1821f6206b
  Address (SS58): 5EXWNJuoProc7apm1JS8m9RTqV3vVwR9dCg6sQVpKnoHtJ68
```

You can also inspect the key by its mnemonic phrase.

```bash
$ subkey inspect "favorite liar zebra assume hurt cage any damp inherit rescue delay panic"
Secret phrase `favorite liar zebra assume hurt cage any damp inherit rescue delay panic` is account:
  Secret seed: 0x235c69907d33b85f27bd78e73ff5d0c67bd4894515cc30c77f4391859bc1a3f2
  Public key (hex): 0x6ce96ae5c300096b09dbd4567b0574f6a1281ae0e5cfe4f6b0233d1821f6206b
  Address (SS58): 5EXWNJuoProc7apm1JS8m9RTqV3vVwR9dCg6sQVpKnoHtJ68
```

You can inspect password protected keys either by passing the `--password` flag or using `///` at the end of the mnemonic:

```bash
$ subkey inspect "razor blouse enroll maximum lobster bacon raccoon ocean law question worry length///correct horse battery staple"
Secret Key URI `razor blouse enroll maximum lobster bacon raccoon ocean law question worry length///correct horse battery staple` is account:
  Public key (hex): 0xe2b410bdc959fcc7f756e6eefdb051000c80be339acd3a8dc6d941211160b266
  Address (SS58): 5HBxAo81NWBbg6DQNbTdFg7GWQDS1QmkMwNLQso1e11DfQ2Y
```

Let's say you want to use the same private key on Polkadot. Use `-n` to get your address formatted for Polkadot. Notice that the public key is the same, but the address has a different format.

```bash
$ subkey --network polkadot inspect "favorite liar zebra assume hurt cage any damp inherit rescue delay panic"
Secret phrase `favorite liar zebra assume hurt cage any damp inherit rescue delay panic` is account:
  Secret seed: 0x235c69907d33b85f27bd78e73ff5d0c67bd4894515cc30c77f4391859bc1a3f2
  Public key (hex): 0x6ce96ae5c300096b09dbd4567b0574f6a1281ae0e5cfe4f6b0233d1821f6206b
  Address (SS58): 13ToWeAsFe55Z7qGxwV8uJFch73aCEyHhhQb2hVAsspp4Xuo
```

## HD Derivation

Subkey supports hard and soft hierarchical deterministic (HD) key derivation compliant with [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki). HD keys allow you to have a master seed and define a tree with a key pair at each leaf. The tree has a similar structure to a filesystem and can have any depth you please.

Hard and soft key derivation both support:

- `parent private key + path --> child private key`
- `parent private key + path --> child public key`

Further, soft key derivation supports:

- `parent public key + path --> child public key`

### Hard Key Derivation

You can derive a hard key child using `//` after the mnemonic phrase:

```bash
$ subkey inspect "favorite liar zebra assume hurt cage any damp inherit rescue delay panic//joe//polkadot//0"
Secret Key URI `favorite liar zebra assume hurt cage any damp inherit rescue delay panic//joe//polkadot//0` is account:
  Public key (hex): 0xb660386488b17fb0989204820ab43c2eae3053f2882dede1688ce9ee48bd0e0a
  Address (SS58): 5GBq9ybWHynecioAmQtuBXjw7vKwzhm72mURRmK2sDpsBRdk
```

### Soft Key Derivation

Likewise, you can derive a soft key child using a single `/` after the mnemonic phrase:

```bash
$ subkey inspect "favorite liar zebra assume hurt cage any damp inherit rescue delay panic/joe/polkadot/0"
Secret Key URI `favorite liar zebra assume hurt cage any damp inherit rescue delay panic/joe/polkadot/0` is account:
  Public key (hex): 0x34ba6dcb945ff69d1457d1488d6b506738f8ce0a5a3e838ed91a5fa813624272
  Address (SS58): 5DFqjBd9BEsLaRdSqfWiDnPvomu5VaDmW4u5YWb1d176hTfC
```

Recall the address from the same seed phrase, `5EXWNJuoProc7apm1JS8m9RTqV3vVwR9dCg6sQVpKnoHtJ68`. We can use that to derive the same child address.

```bash
$ subkey inspect 5EXWNJuoProc7apm1JS8m9RTqV3vVwR9dCg6sQVpKnoHtJ68/joe/polkadot/0
Public Key URI `5EXWNJuoProc7apm1JS8m9RTqV3vVwR9dCg6sQVpKnoHtJ68/joe/polkadot/0` is account:
  Network ID/version: substrate
  Public key (hex): 0x34ba6dcb945ff69d1457d1488d6b506738f8ce0a5a3e838ed91a5fa813624272
  Address (SS58): 5DFqjBd9BEsLaRdSqfWiDnPvomu5VaDmW4u5YWb1d176hTfC
```

Note that the two addresses here match. This is not the case in hard key derivation.

## Putting it All Together

You can mix and match hard and soft key paths (although it doesn't make much sense to have hard paths as children of soft paths). For example:

```bash
$ subkey inspect "favorite liar zebra assume hurt cage any damp inherit rescue delay panic//joe//polkadot/0"
Secret Key URI `favorite liar zebra assume hurt cage any damp inherit rescue delay panic//joe//polkadot/0` is account:
  Public key (hex): 0xd09ab65c743e91b30d024469e8a8b823a3aa7e8f5b4791187adf531ac2af140f
  Address (SS58): 5GnDmyt7qnEN4esrLNRtjM7xHyRe4jQsbbAHpaNSsPNws7EB
```

The first two levels (`//joe//polkadot`) are hard-derived, while the leaf (`/0`) is soft-derived.

To use key derivation with a password protected key, add your password to the end:

```bash
$ subkey inspect "razor blouse enroll maximum lobster bacon raccoon ocean law question worry length/joe/polkadot/0///correct horse battery staple"
Secret Key URI `razor blouse enroll maximum lobster bacon raccoon ocean law question worry length/joe/polkadot/0///correct horse battery staple` is account:
  Public key (hex): 0x0816fe0689322e26cd2aa9c0dccb6c44851345e96f969ae85c8f1aec9fb4703d
  Address (SS58): 5CFK52zU59zUhC3s6mRobEJ3zm7JeXQZaS6ybvcuCDDhWwGG

$ subkey inspect 5HBxAo81NWBbg6DQNbTdFg7GWQDS1QmkMwNLQso1e11DfQ2Y/joe/polkadot/0
Public Key URI `5HBxAo81NWBbg6DQNbTdFg7GWQDS1QmkMwNLQso1e11DfQ2Y/joe/polkadot/0` is account:
  Network ID/version: substrate
  Public key (hex): 0x0816fe0689322e26cd2aa9c0dccb6c44851345e96f969ae85c8f1aec9fb4703d
  Address (SS58): 5CFK52zU59zUhC3s6mRobEJ3zm7JeXQZaS6ybvcuCDDhWwGG
```

Notice that the "address plus derivation path" produces the same address as the "mnemonic phrase plus derivation path plus password." As such, you can reveal your parent address and derivation paths without revealing your mnemonic phrase or password, while retaining control of all derived addresses.

## Well-Known Keys

If you've worked with Substrate previously, you have likely encountered the ubiquitous accounts for Alice, Bob, and their friends. These keys are not at all private, but are useful for playing with Substrate without always generating new key pairs. You can inspect these "well-known" keys with `subkey`.

```bash
$ subkey inspect //Alice
Secret Key URI `//Alice` is account:
  Public key (hex): 0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
  Address (SS58): 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
```

There is nothing special about the name Alice. You can do the same trick with your own name. But remember that keys like this are _not_ secure, and are only useful for experimenting.

```bash
$ subkey inspect //Joshy
Secret Key URI `//Joshy` is account:
  Public key (hex): 0x006f5081d495811a16724b317fcd70b8e42c9317da2ba1f5c36756a41fadec67
  Address (SS58): 5C5GvaAWfruRLnCJYgJrut1JovGeMMXV2VzXeiua7f691J9R
```

## Signing and Verifying Messages

### Signing

You can sign a message by passing the message to Subkey on STDIN. You can sign with either your seed or mnemonic phrase.

```bash
$ echo "message" | subkey sign 0x235c69907d33b85f27bd78e73ff5d0c67bd4894515cc30c77f4391859bc1a3f2
50192c7f1a49dd169fa69f7fc703b3fe2e8c0b71871117e59b59b59e16462031d970b8a927d0e265e441a99f70203e0a2e0428add445970e257f4c536689e60c
```

```bash
$ echo "message" | subkey sign "favorite liar zebra assume hurt cage any damp inherit rescue delay panic"
50d830ac6ce90207584fcd46ada1db06d20db46370e440ae326e71c602d03641747031d66a9514b95a28462166336244bd401f25eb5e2e27b3f9dd5457b80d02
```

### Verifying

Although the signatures above are different, they both verify with the address:

```bash
$ echo "message" | subkey verify 501...60c 5EXWNJuoProc7apm1JS8m9RTqV3vVwR9dCg6sQVpKnoHtJ68
Signature verifies correctly.
```

```bash
$ echo "message" | subkey verify 50d...d02 5EXWNJuoProc7apm1JS8m9RTqV3vVwR9dCg6sQVpKnoHtJ68
Signature verifies correctly.
```

## More Subkey to Explore

Learn more by running `subkey help` or see the [README](https://github.com/paritytech/substrate/tree/master/bin/utils/subkey).

Key pairs can also be generated in the [PolkadotJS Apps UI](https://github.com/polkadot-js/apps). Try creating keys with the UI and restoring them with `subkey` or vice versa.

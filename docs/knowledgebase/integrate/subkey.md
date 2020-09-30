---
title: The Subkey Tool
---

Subkey is a key-generation utility that is developed
[alongside Substrate](https://github.com/paritytech/substrate/tree/master/bin/utils/subkey). Its
main features are generating key pairs (currently supporting
[sr25519](https://wiki.polkadot.network/docs/en/learn-cryptography),
[ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519), and
[secp256k1](https://en.bitcoin.it/wiki/Secp256k1)), encoding SS58 addresses, and restoring keys from
mnemonics and raw seeds. It can also create and verify signatures on a message, including encoded
transactions.

## Installation

### Build from Source

The Subkey binary, `subkey`, is installed along with
[Substrate](../getting-started/#fast-installation). If you want to play with just Subkey (and not
Substrate), you will need to have the Substrate dependencies. Use the following two commands to
install the dependencies and Subkey, respectively:

```bash
$ curl https://getsubstrate.io -sSf | bash -s -- --fast
$ cargo install --force subkey --git https://github.com/paritytech/substrate --version 2.0.0
```

### Compiling with Cargo

If you already have the [Substrate repository](https://github.com/paritytech/substrate), you can
build Subkey with:

```bash
$ cargo build -p subkey --release
```

This will generate the Subkey binary in `./target/release/subkey`. Please be aware that the
interface to Subkey may change between versions; the commands described below have all been tested
with the version of Subkey specified by the `cargo install` command in the
[Build from Source](#build-from-source) section. If you follow the steps in this section to compile
Subkey with Cargo, the version of Subkey will depend on the branch or commit of Substrate that you
have checked out.

## Generating Keys

Generate an sr25519 key by running:

```bash
$ subkey generate

Secret phrase `spend report solution aspect tilt omit market cancel what type cave author` is account:
  Secret seed:      0x554b6fc625fbea8f56eb56262d92ccb083fd6eaaf5ee9a966eaab4db2062f4d0
  Public key (hex): 0x143fa4ecea108937a2324d36ee4cbce3c6f3a08b0499b276cd7adb7a7631a559
  Account ID:       0x143fa4ecea108937a2324d36ee4cbce3c6f3a08b0499b276cd7adb7a7631a559
  SS58 Address:     5CXFinBHRrArHzmC6iYVHSSgY1wMQEdL2AiL6RmSEsFvWezd
```

For more security, use `--words 24` (supports 12, 15, 18, 21, and 24):

```bash
$ subkey generate --words 24
Secret phrase `enroll toss harvest pilot size end skin clog city knock bar cousin mirror journey coil used eye describe puzzle govern soup sort second cattle` is account:
  Secret seed:      0x7590d644baa64600735ab927b6c353b9594a2cf42fe4d57c2d0e639615b37a6a
  Public key (hex): 0xc61c17f9a3d48ff3f0700081ac7a9c92ef05758d5cc069c41247e4392eb71e00
  Account ID:       0xc61c17f9a3d48ff3f0700081ac7a9c92ef05758d5cc069c41247e4392eb71e00
  SS58 Address:     5GYTgcrom3pxWyHCcPPZX6iBB8xWJPARgLAng7MK4ZFaBAza
```

Subkey encodes the address depending on the network. You can use the `--network` flag to change
this. See `subkey help` for supported networks.

Use the `--scheme` option to generate an ed25519 key:

```bash
$ subkey generate --scheme ed25519
Secret phrase `security snow crunch treat tone skill develop nominee hat slim omit stool` is account:
  Secret seed:      0xad282c9eda80640f588f812081d98b9a2333435f76ba4ad6258e9c6f4a488363
  Public key (hex): 0xf6a7ac42a6e1b5329bdb4e63c8bbafa5301add8102843bfe950907bd3969d944
  Account ID:       0xf6a7ac42a6e1b5329bdb4e63c8bbafa5301add8102843bfe950907bd3969d944
  SS58 Address:     5He7SpmVsdhoEKC5uwvPDngoCXECCeh8VrxoxnQTh1mgPiZa
```

The output gives us the following information about our key:

- **Secret phrase** (aka "mnemonic phrase") - A series of English words that encodes the seed in a
  more human-friendly way. Mnemonic phrases were first introduced in Bitcoin (see
  [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)) and make it much easier
  to write down your key by hand.
- **Secret Seed** (aka "Private Key" or "Raw Seed") - The minimum necessary information to restore
  the key pair. All other information is calculated from the seed.
- **Public Key** (aka "Account ID") - The public half of the cryptographic key pair in hexadecimal.
- **SS58 Address** (aka "Public Address") - An SS58-encoded address based on the public key.

Currently Subkey supports the following cryptographic key pairs and signing algorithms:

- `sr25519`: Schorr signatures on the Ristretto group
- `ed25519`: ed25519
- `secp256k1`: ECDSA signatures on secp256k1

Note that the address for a secp256k1 key is the SS58 encoding of the hash of the public key in
order to reduce the public key from 33 bytes to 32 bytes.

You can also create a vanity address, meaning an address that contains a specified sub-string. But
you will not receive a mnemonic phrase for this address.

```bash
$ subkey vanity --pattern joe
Generating key containing pattern 'joe'
100000 keys searched; best is 185/189 complete
200000 keys searched; best is 187/189 complete
300000 keys searched; best is 187/189 complete
best: 189 == top: 189
Secret Key URI `0x380ba96e07933b89c2b3b6d3fa98b695aab99070b8982817b74044c6fa6a375b` is account:
  Secret seed:      0x380ba96e07933b89c2b3b6d3fa98b695aab99070b8982817b74044c6fa6a375b
  Public key (hex): 0x4a0e48c38ae880f7eee86c8a75c6391ecb2de35adf49ee30cd1631e82de1b001
  Account ID:       0x4a0e48c38ae880f7eee86c8a75c6391ecb2de35adf49ee30cd1631e82de1b001
  SS58 Address:     5DjoeJSa7m4EsuSKwDN1GkrMtTiWwSMGxESQ6KSNPETPaPna
```

Notice the SS58 Address 5D**joe**JSa7m4EsuSKwDN1GkrMtTiWwSMGxESQ6KSNPETPaPna contains the string
`joe`.

## Password Protected Keys

To generate a key that is password protected, use the `--password <password>` flag:

```bash
$ subkey generate --password "pencil laptop kitchen cutter"
Secret phrase `image stomach entry drink rice hen abstract moment nature broken gadget flash` is account:
  Secret seed:      0x11353649ecfb97ed44aa4b3516c646fa49ecd3f71cc0445647a25379f848b336
  Public key (hex): 0x1641450068c6ed825726c2a854d830352b75fb1a05e6fbcc9bc47a398a581a29
  Account ID:       0x1641450068c6ed825726c2a854d830352b75fb1a05e6fbcc9bc47a398a581a29
  SS58 Address:     5CZtJLXtVzrBJq1fMWfywDa6XuRwXekGdShPR4b8i9GWSbzB
```

Note that the "Secret seed" is _not_ password protected and can still recover the account. The
"Secret phrase" however, is not sufficient to recover the account without the password.

## Inspecting Keys

The `inspect` command recalculates a key pair's public key and public address given its secret seed.
This shows that it is sufficient to back up the seed alone.

```bash
$ subkey inspect 0x554b6fc625fbea8f56eb56262d92ccb083fd6eaaf5ee9a966eaab4db2062f4d0
Secret Key URI `0x554b6fc625fbea8f56eb56262d92ccb083fd6eaaf5ee9a966eaab4db2062f4d0` is account:
  Secret seed:      0x554b6fc625fbea8f56eb56262d92ccb083fd6eaaf5ee9a966eaab4db2062f4d0
  Public key (hex): 0x143fa4ecea108937a2324d36ee4cbce3c6f3a08b0499b276cd7adb7a7631a559
  Account ID:       0x143fa4ecea108937a2324d36ee4cbce3c6f3a08b0499b276cd7adb7a7631a559
  SS58 Address:     5CXFinBHRrArHzmC6iYVHSSgY1wMQEdL2AiL6RmSEsFvWezd
```

You can also inspect the key by its mnemonic phrase.

```bash
$ subkey inspect "spend report solution aspect tilt omit market cancel what type cave author"
Secret phrase `spend report solution aspect tilt omit market cancel what type cave author` is account:
  Secret seed:      0x554b6fc625fbea8f56eb56262d92ccb083fd6eaaf5ee9a966eaab4db2062f4d0
  Public key (hex): 0x143fa4ecea108937a2324d36ee4cbce3c6f3a08b0499b276cd7adb7a7631a559
  Account ID:       0x143fa4ecea108937a2324d36ee4cbce3c6f3a08b0499b276cd7adb7a7631a559
  SS58 Address:     5CXFinBHRrArHzmC6iYVHSSgY1wMQEdL2AiL6RmSEsFvWezd
```

You can inspect password-protected keys either by passing the `--password` flag or using `///` at
the end of the mnemonic:

```bash
$ subkey inspect "image stomach entry drink rice hen abstract moment nature broken gadget flash" --password "pencil laptop kitchen cutter"
Secret phrase `image stomach entry drink rice hen abstract moment nature broken gadget flash` is account:
  Secret seed:      0x11353649ecfb97ed44aa4b3516c646fa49ecd3f71cc0445647a25379f848b336
  Public key (hex): 0x1641450068c6ed825726c2a854d830352b75fb1a05e6fbcc9bc47a398a581a29
  Account ID:       0x1641450068c6ed825726c2a854d830352b75fb1a05e6fbcc9bc47a398a581a29
  SS58 Address:     5CZtJLXtVzrBJq1fMWfywDa6XuRwXekGdShPR4b8i9GWSbzB

$ subkey inspect "image stomach entry drink rice hen abstract moment nature broken gadget flash///pencil laptop kitchen cutter"
Secret Key URI `image stomach entry drink rice hen abstract moment nature broken gadget flash///pencil laptop kitchen cutter` is account:
  Secret seed:      0x11353649ecfb97ed44aa4b3516c646fa49ecd3f71cc0445647a25379f848b336
  Public key (hex): 0x1641450068c6ed825726c2a854d830352b75fb1a05e6fbcc9bc47a398a581a29
  Account ID:       0x1641450068c6ed825726c2a854d830352b75fb1a05e6fbcc9bc47a398a581a29
  SS58 Address:     5CZtJLXtVzrBJq1fMWfywDa6XuRwXekGdShPR4b8i9GWSbzB
```

Let's say you want to use the same private key on Kusama network. Use `--network` to get your
address formatted for Kusama. Notice that the public key is the same, but the address has a
different format.

```bash
$ subkey inspect --network kusama "spend report solution aspect tilt omit market cancel what type cave author"
Secret phrase `spend report solution aspect tilt omit market cancel what type cave author` is account:
  Secret seed:      0x554b6fc625fbea8f56eb56262d92ccb083fd6eaaf5ee9a966eaab4db2062f4d0
  Public key (hex): 0x143fa4ecea108937a2324d36ee4cbce3c6f3a08b0499b276cd7adb7a7631a559
  Account ID:       0x143fa4ecea108937a2324d36ee4cbce3c6f3a08b0499b276cd7adb7a7631a559
  SS58 Address:     D2sP6XA4DBn3eadsRMYBPoggcDbCuSWUYZ5V63PifURFkcm
```

## Inserting Keys to a Node's Keystore

You can insert fixed keys into a Substrate-based node's keystore with the `insert` command.

```bash
# Usage
$ subkey insert [FLAGS] [OPTIONS] --key-type <key-type>

# Example: Inserting an Aura key (SR25519 Crypto)
$ subkey insert --suri 0x554b6fc625fbea8f56eb56262d92ccb083fd6eaaf5ee9a966eaab4db2062f4d0 --base-path /tmp/node01 --key-type aura

# Example: Inserting a Grandpa key (ED25519 Crypto)
$ subkey insert --suri 0x554b6fc625fbea8f56eb56262d92ccb083fd6eaaf5ee9a966eaab4db2062f4d0 --scheme ed25519 --base-path /tmp/node01 --key-type gran
```

## HD Derivation

Subkey supports hard and soft hierarchical deterministic (HD) key derivation compliant with
[BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki). HD keys allow you to have a
master seed and define a tree with a key pair at each leaf. The tree has a similar structure to a
filesystem and can have any depth you want.

Hard and soft key derivation both support:

- parent private key + path ➔ child private key
- parent private key + path ➔ child public key

Further, soft key derivation supports:

- parent public key + path ➔ child public key

### Hard Key Derivation

You can derive a hard key child using `//` after the mnemonic phrase:

```bash
$ subkey inspect "spend report solution aspect tilt omit market cancel what type cave author//joe//polkadot//0"
Secret Key URI `spend report solution aspect tilt omit market cancel what type cave author//joe//polkadot//0` is account:
  Secret seed:      0xc25dda466c7749ac966b95e2ef8f5e758a063d26ac4d1895f479964aaf5679cc
  Public key (hex): 0xb49bdb8f2aa714b6e8b62426d03a1506878fc1f2937bdd396bc2102c95613f4b
  Account ID:       0xb49bdb8f2aa714b6e8b62426d03a1506878fc1f2937bdd396bc2102c95613f4b
  SS58 Address:     5G9Wmx3mgRk7yKWPs421ZVuz1W34KxjKi3NDo7rVtdPMc6ju
```

### Soft Key Derivation

Likewise, you can derive a soft key child using a single `/` after the mnemonic phrase:

```bash
$ subkey inspect "spend report solution aspect tilt omit market cancel what type cave author/joe/polkadot/0"
Secret Key URI `spend report solution aspect tilt omit market cancel what type cave author/joe/polkadot/0` is account:
  Secret seed:      n/a
  Public key (hex): 0x06382e496cb8b1664501bbfcc8205c7b1ddc2402e32ef0479b18abdf326ca342
  Account ID:       0x06382e496cb8b1664501bbfcc8205c7b1ddc2402e32ef0479b18abdf326ca342
  SS58 Address:     5CCrqJffST8uh8RLn2sFJwg1JWs4HkKL88xmdZRdnHt8GDyA
```

Recall the SS58 address from the same seed phrase,
`5CXFinBHRrArHzmC6iYVHSSgY1wMQEdL2AiL6RmSEsFvWezd`. We can use that to derive the same child
address.

```bash
$ subkey inspect "5CXFinBHRrArHzmC6iYVHSSgY1wMQEdL2AiL6RmSEsFvWezd/joe/polkadot/0"
Public Key URI `5CXFinBHRrArHzmC6iYVHSSgY1wMQEdL2AiL6RmSEsFvWezd/joe/polkadot/0` is account:
  Network ID/version: substrate
  Public key (hex):   0x06382e496cb8b1664501bbfcc8205c7b1ddc2402e32ef0479b18abdf326ca342
  Account ID:         0x06382e496cb8b1664501bbfcc8205c7b1ddc2402e32ef0479b18abdf326ca342
  SS58 Address:       5CCrqJffST8uh8RLn2sFJwg1JWs4HkKL88xmdZRdnHt8GDyA
```

Note that the two addresses here match. This is not the case in hard key derivation.

### Putting it All Together

You can mix and match hard and soft key paths (although it doesn't make much sense to have hard
paths as children of soft paths). For example:

```bash
$ subkey inspect "spend report solution aspect tilt omit market cancel what type cave author//joe//polkadot/0"
Secret Key URI `spend report solution aspect tilt omit market cancel what type cave author//joe//polkadot/0` is account:
  Secret seed:      n/a
  Public key (hex): 0x2c6d81f231fb2ee802e11a81e5d88c1dfaae2b945b66177bd041d4ef474bb70c
  Account ID:       0x2c6d81f231fb2ee802e11a81e5d88c1dfaae2b945b66177bd041d4ef474bb70c
  SS58 Address:     5D4xVeDs9osZBjZ72in3hGvqRvDaWh63sw2xBdAS589m3BHG
```

The first two levels (`//joe//polkadot`) are hard-derived, while the leaf (`/0`) is soft-derived.

To use key derivation with a password-protected key, add your password to the end:

```bash
# mnemonic phrase plus derivation path plus password
$ subkey inspect "image stomach entry drink rice hen abstract moment nature broken gadget flash/joe/polkadot/0///pencil laptop kitchen cutter"
Secret Key URI `image stomach entry drink rice hen abstract moment nature broken gadget flash/joe/polkadot/0///pencil laptop kitchen cutter` is account:
  Secret seed:      n/a
  Public key (hex): 0xc69291081743ba7e8f587f1e848d1ffc7b634ce21793a231b7ac75d430b59068
  Account ID:       0xc69291081743ba7e8f587f1e848d1ffc7b634ce21793a231b7ac75d430b59068
  SS58 Address:     5GZ4srnepXvdsuNVoxCGyVZd8ScDm4gkGLTKuaGARy9akjTa
```

```bash
# SS58-address plus derivation path
$ subkey inspect "5CZtJLXtVzrBJq1fMWfywDa6XuRwXekGdShPR4b8i9GWSbzB/joe/polkadot/0"
Public Key URI `5CZtJLXtVzrBJq1fMWfywDa6XuRwXekGdShPR4b8i9GWSbzB/joe/polkadot/0` is account:
  Network ID/version: substrate
  Public key (hex):   0xc69291081743ba7e8f587f1e848d1ffc7b634ce21793a231b7ac75d430b59068
  Account ID:         0xc69291081743ba7e8f587f1e848d1ffc7b634ce21793a231b7ac75d430b59068
  SS58 Address:       5GZ4srnepXvdsuNVoxCGyVZd8ScDm4gkGLTKuaGARy9akjTa
```

Notice that the "SS58-address plus derivation path" produces the same address as the "mnemonic
phrase plus derivation path plus password." As such, you can reveal your parent address and
derivation paths without revealing your mnemonic phrase or password, retaining control of all
derived addresses.

## Well-Known Keys

If you've worked with Substrate previously, you have likely encountered the ubiquitous accounts for
Alice, Bob, and their friends. These keys are not at all private, but are useful for playing with
Substrate without always generating new key pairs. You can inspect these "well-known" keys as well.

```bash
$ subkey inspect //Alice
Secret Key URI `//Alice` is account:
  Secret seed:      0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a
  Public key (hex): 0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
  Account ID:       0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
  SS58 Address:     5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
```

A mnemonic phrase is a secret group of words that can be used to uniquely generate a private key. In
Subkey, there is a specific dev phrase used whenever a mnemonic phrase is omitted.`//Alice` for
example is actually:

`bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice`

It is important remember that keys such as this are _not_ secure, and should be deployed only for
testing. In addition, anyone not using PolkadotJS or Subkey should note this information to properly
generate the account.

## Signing and Verifying Messages

### Signing

You can sign a message by passing the message to Subkey on STDIN. You can sign with either your seed
or mnemonic phrase.

```bash
# Usage
$ echo "msg" | subkey sign --suri <secret-seed>

# Example
$ echo "test message" | subkey sign --suri 0x554b6fc625fbea8f56eb56262d92ccb083fd6eaaf5ee9a966eaab4db2062f4d0
# Output
1e298698ed97654189ed082b3a19634c9cc2743e6e2e4089cc1759c959a8226d7709916041e195dd861a556ca1fde3d4305c00be3f08f72d369b83b9e3fa9b87
```

### Verifying

Although the signatures above are different, they both verify with the address:

```bash
# Usage
$ echo "msg" | subkey verify <signature> <SS58-address>

# Example
$ echo "test message" | subkey verify 1e298698ed97654189ed082b3a19634c9cc2743e6e2e4089cc1759c959a8226d7709916041e195dd861a556ca1fde3d4305c00be3f08f72d369b83b9e3fa9b87 5CXFinBHRrArHzmC6iYVHSSgY1wMQEdL2AiL6RmSEsFvWezd
# Output
Signature verifies correctly.
```

> Note: `echo` appends a newline character to the end of strings. Therefore, if you verify a message
> that was signed elsewhere, e.g. Polkadot JS, then you will need to use `echo -n` to remove the
> newline character and verify the correct message.

## Generating Node Keys

You can generate a node's libp2p key by the following:

```bash
# Usage
$ subkey generate-node-key --file <output-file>

# Example
$ subkey generate-node-key --file node-key
# Output
Qmb8aDXsAMoCnozJmUSaYzDTTxathFrsSU12A4owZ5K6V3
```

The peer ID is displayed on screen and the actual key is saved in the `<output-file>`.

## More Subkey to Explore

- Learn more by running `subkey help` or see the
  [README](https://github.com/paritytech/substrate/tree/master/bin/utils/subkey).
- Key pairs can also be generated in the [PolkadotJS Apps UI](https://polkadot.js.org/apps/). Try
  creating keys with the UI and restoring them with Subkey or vice versa.
- Learn more about
  [different cryptographies and choosing between them](https://wiki.polkadot.network/docs/en/learn-cryptography).

---
title: Subkey
---

Subkey is a [public key cryptographic](https://en.wikipedia.org/wiki/Public-key_cryptography)
utility that is developed
[within Substrate itself](https://github.com/paritytech/substrate/tree/master/bin/utils/subkey). 
Its main feature is generating and inspecting key pairs, currently supporting these scheme:

- [sr25519](https://wiki.polkadot.network/docs/learn-cryptography): Schorr signatures on
  the Ristretto group
- [ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519): SHA-512 (SHA-2) on Curve25519
- [secp256k1](https://en.bitcoin.it/wiki/Secp256k1): ECDSA signatures on secp256k1

All keys in Substrate based networks
([like polkadot](https://wiki.polkadot.network/docs/learn-accounts#address-format))
use the 
[SS58 address encoding format](https://github.com/paritytech/substrate/wiki/External-Address-Format-(SS58))
that is the primary user-facing way to interact with keys.

Subkey also allows restoring keys from mnemonics and raw seeds; signing and verifying signatures
on a message; and signing and verifying signatures for encoded transactions.

## Installation

### Install with Cargo

You will need to have the Substrate build dependencies to install Subkey.
Use the following two commands to install the dependencies and Subkey, respectively:

_Command:_
```bash
# Use the `--fast` flag to get the dependencies without needing to install the Substrate and Subkey binary
curl https://getsubstrate.io -sSf | bash -s -- --fast 
# Install only `subkey`, at a specific version
cargo install --force subkey --git https://github.com/paritytech/substrate --version 2.0.1 --locked
```

### Compiling with Cargo

If you already have the [Substrate repository](https://github.com/paritytech/substrate), you can
build Subkey with:

_Command:_
```bash
# Run this in the Substrate working directory
cargo build -p subkey --release
```

This will generate the Subkey binary in `./target/release/subkey`. Please be aware that the
interface to Subkey may change between versions; the commands described below have all been tested
with the version of Subkey specified by the `cargo install` command in the
[Build from Source](#build-from-source) section.

> If you follow the steps in this section to compile Subkey with Cargo, the version of Subkey will
> depend on the branch or commit of Substrate that you have checked out.

Once installed, use the `subkey -h` command to see all the sub-commands and flags available.
Use `subkey <sub-command> -h` to see help items for ech sub-command.

## Inspecting Keys

The `inspect` command recalculates a key pair's public key and public address given its secret seed.
You most commonly inspect the key by the mnemonic phrase that is used to derive it:

_Command:_
```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very"
```
_Output:_
```text
Secret phrase `caution juice atom organ advance problem want pledge someone senior holiday very` is account:
  Secret seed:       0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
  Public key (hex):  0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  Public key (SS58): 5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
  Account ID:        0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  SS58 Address:      5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
```

You can also use the secret seed directly, here the same result is seen for the secret shown above:

_Command:_
```bash
subkey inspect 0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
```
_Output:_
```text
Secret Key URI `0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849` is account:
  Secret seed:       0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
  Public key (hex):  0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  Public key (SS58): 5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
  Account ID:        0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  SS58 Address:      5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
```

Next in how to generate keys, we will also show you how to inspect more than a base seed. 

## Generating Keys

Generate an sr25519 key by running:

_Command:_
```bash
subkey generate
```
_Output:_
```text
Secret phrase `caution juice atom organ advance problem want pledge someone senior holiday very` is account:
  Secret seed:       0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
  Public key (hex):  0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  Public key (SS58): 5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
  Account ID:        0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  SS58 Address:      5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
```

We will use this seed as the [example](#example-seed) for the rest of this document.

---

For more security, use `--words 24` (supports 12, 15, 18, 21, and 24):

_Command:_
```bash
subkey generate --words 24
```
_Output:_
```text
Secret phrase `voice become refuse remove ordinary recall humble purity shock fetch open scale knee above axis blossom differ bamboo ski drip forest fade ill door` is account:
  Secret seed:       0xed26c8119b4872da9e5c2d4b679c82a7fbbabed22cb9f61d5fd4d7806ee5b014
  Public key (hex):  0x182a8385912e206910a11dfcfbadcc018d73ff3febe36f9eb85774e77591a314
  Public key (SS58): 5CcPdpUAhRvGjyxcpnL7emi7SruQ98eP7mC8cDNkjCKfXNZ7
  Account ID:        0x182a8385912e206910a11dfcfbadcc018d73ff3febe36f9eb85774e77591a314
  SS58 Address:      5CcPdpUAhRvGjyxcpnL7emi7SruQ98eP7mC8cDNkjCKfXNZ7
```

Use the `--scheme` option to generate an ed25519 key:

_Command:_
```bash
subkey generate --scheme ed25519
```
_Output:_
```text
Secret phrase `voice become refuse remove ordinary recall humble purity shock fetch open scale knee above axis blossom differ bamboo ski drip forest fade ill door` is account:
  Secret seed:       0xed26c8119b4872da9e5c2d4b679c82a7fbbabed22cb9f61d5fd4d7806ee5b014
  Public key (hex):  0x182a8385912e206910a11dfcfbadcc018d73ff3febe36f9eb85774e77591a314
  Public key (SS58): 5CcPdpUAhRvGjyxcpnL7emi7SruQ98eP7mC8cDNkjCKfXNZ7
  Account ID:        0x182a8385912e206910a11dfcfbadcc018d73ff3febe36f9eb85774e77591a314
  SS58 Address:      5CcPdpUAhRvGjyxcpnL7emi7SruQ98eP7mC8cDNkjCKfXNZ7
```

The output gives us the following information about our key:

- **Secret phrase** (aka "mnemonic phrase") - A series of English words that encodes the seed in a
  more human-friendly way. Mnemonic phrases were first introduced in Bitcoin (see
  [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)) and make it much easier
  to write down your key by hand.
- **Secret Seed** (aka "Private Key" or "Raw Seed") - The minimum necessary information to restore
  the key pair. All other information is calculated from the seed.
- **Public Key (hex)** - The public half of the cryptographic key pair in hexadecimal.
- **Public Key (SS58)** - The public half of the cryptographic key pair in SS58 encoding.
- **Account ID** - Alias for the Public Key in hexadecimal. 
- **SS58 Address** (aka "Public Address") - An SS58-encoded address based on the public key.

You can also create a vanity address, meaning an address that contains a specified sub-string. But
you will not receive a mnemonic phrase for this address.

_Command:_
```bash
subkey vanity --pattern dan
```
_Output:_
```text
Generating key containing pattern 'dan'
best: 189 == top: 189
Secret Key URI `0xf58706b2057633b6d634d9cc54e8e9e8f11246290c0bbef934129978ede6439b` is account:
  Secret seed:       0xf58706b2057633b6d634d9cc54e8e9e8f11246290c0bbef934129978ede6439b
  Public key (hex):  0xca043bd23428eb023d59f4b7eb37416b343fc719a3c89c5256071b4f39d73130
  Public key (SS58): 5GdandXEVW1ER8cxW6uQgpjpyuEbZ3s2ED3ZU15LfrGdQhhz
  Account ID:        0xca043bd23428eb023d59f4b7eb37416b343fc719a3c89c5256071b4f39d73130
  SS58 Address:      5GdandXEVW1ER8cxW6uQgpjpyuEbZ3s2ED3ZU15LfrGdQhhz
```

Notice the SS58 Address`5GdandXEVW1ER8cxW6uQgpjpyuEbZ3s2ED3ZU15LfrGdQhhz` contains the string
`dan`.

### Example Seed

> We will use the seed generated above to illustrate different
> [HD key derivation paths](#hd-key-derivation) and
> [passwords](#password-protected-keys):
> ```text
> caution juice atom organ advance problem want pledge someone senior holiday very
> ```

_Command:_
```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very"
```
_Output:_
```text
Secret phrase `caution juice atom organ advance problem want pledge someone senior holiday very` is account:
  Secret seed:       0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
  Public key (hex):  0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  Public key (SS58): 5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
  Account ID:        0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  SS58 Address:      5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
```

## Specify Network Address Format

Subkey encodes the address depending on the network. You can use the `--network` flag to change
this. See `subkey <inspect/generate> -n` for supported networks.

Let's say you want to use the **same private key** on the Kusama network. Use `--network` to get
your **address** formatted for Kusama. Notice that the public key is the same, but the address has
a different format. Here we use the [example seed](#example-seed):

_Command:_
```bash
subkey inspect --network kusama "caution juice atom organ advance problem want pledge someone senior holiday very"
```
_Output:_
```text
Secret phrase `caution juice atom organ advance problem want pledge someone senior holiday very` is account:
  Secret seed:       0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
  Public key (hex):  0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  Public key (SS58): HRkCrbmke2XeabJ5fxJdgXWpBRPkXWfWHY8eTeCKwDdf4k6
  Account ID:        0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
  SS58 Address:      HRkCrbmke2XeabJ5fxJdgXWpBRPkXWfWHY8eTeCKwDdf4k6
```

## HD Key Derivation

> **Remember that passwords and derivation paths are just as important to backup as the seed itself!**
> See the [password note](#important-password-and-derivation-note) for more information.

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

_Command:_
```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very//polkadot//0"
```
_Output:_
```text
Secret Key URI `caution juice atom organ advance problem want pledge someone senior holiday very//polkadot//0` is account:
  Secret seed:       0x056a6a4e203766ffbea3146967ef25e9daf677b14dc6f6ed8919b1983c9bebbc
  Public key (hex):  0x841226ea070c9577979ca2e854130fbe3253853c13c05943e09908312950275d
  Public key (SS58): 5F3sa2TJAWMqDhXG6jhV4N8ko9SxwGy8TpaNS1repo5EYjQX
  Account ID:        0x841226ea070c9577979ca2e854130fbe3253853c13c05943e09908312950275d
  SS58 Address:      5F3sa2TJAWMqDhXG6jhV4N8ko9SxwGy8TpaNS1repo5EYjQX
```

### Soft Key Derivation

Likewise, you can derive a soft key child using a single `/` after the mnemonic phrase:

_Command:_
```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very/polkadot/0"
```
_Output:_
```text
Secret Key URI `caution juice atom organ advance problem want pledge someone senior holiday very/polkadot/0` is account:
  Secret seed:       n/a
  Public key (hex):  0x94bec5342b23d74b8736c74ab1bf311182c62510d220313a424e63ea57172855
  Public key (SS58): 5FRjccB7s9fbMu4pwQhYng2quQnKYkCHXRUCMBRwL7Pzj8FX
  Account ID:        0x94bec5342b23d74b8736c74ab1bf311182c62510d220313a424e63ea57172855
  SS58 Address:      5FRjccB7s9fbMu4pwQhYng2quQnKYkCHXRUCMBRwL7Pzj8FX
```

Recall the _root_ SS58 address from the [example seed](#example-seed) is,
`5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR`. We can use that _public address_ to derive the 
same child address as above using the _seed_.

_Command:_
```bash
subkey inspect "5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR/polkadot/0"
```
_Output:_
```text
Public Key URI `5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR/polkadot/0` is account:
  Network ID/version: substrate
  Public key (hex):   0x94bec5342b23d74b8736c74ab1bf311182c62510d220313a424e63ea57172855
  Public key (SS58):  5FRjccB7s9fbMu4pwQhYng2quQnKYkCHXRUCMBRwL7Pzj8FX
  Account ID:         0x94bec5342b23d74b8736c74ab1bf311182c62510d220313a424e63ea57172855
  SS58 Address:       5FRjccB7s9fbMu4pwQhYng2quQnKYkCHXRUCMBRwL7Pzj8FX
```

Note that the two addresses here match. This is not the case in hard key derivation!

## Password Protected Keys

> **Remember that passwords and derivation paths are just as important to backup as the seed itself!**
> See the [password note](#important-password-and-derivation-note) for more information.

To generate a key that is password protected, use the `--password <password>` flag:

_Command:_
```bash
subkey generate --password "pencil laptop kitchen cutter"
```
_Output:_
```text
Secret phrase `apology truck manage valve merge front idea imitate coconut poverty trap gas` is account:
  Secret seed:       0x2da5ddf709c8cd6c9727d347cd1e867234802d15ce51581d86bcb949bba7bcb5
  Public key (hex):  0xc8e06268df6173a32a859da4b9601d5e11b503206f9817ae1c101d2984826d19
  Public key (SS58): 5Gc66BfkkebMv3EvP8ThfpiGLng1EPtUiAQ71gzwpJosJqvo
  Account ID:        0xc8e06268df6173a32a859da4b9601d5e11b503206f9817ae1c101d2984826d19
  SS58 Address:      5Gc66BfkkebMv3EvP8ThfpiGLng1EPtUiAQ71gzwpJosJqvo
```
You can inspect password-protected keys either by passing the `--password` flag or using `///` at
the end of the mnemonic:

_Command (--password flag):_
```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very" --password "pencil laptop kitchen cutter"
```
_Output (--password flag):_
```text
Secret phrase `caution juice atom organ advance problem want pledge someone senior holiday very` is account:
  Secret seed:       0xdfc5d5d5235a37fdc907ee1cb720299f96aeb02f9c7c2fcad7ee8c7bfbd2a4db
  Public key (hex):  0xdef8f78b123475265815b65a7c55e105e1ab185f4969954f68d92b7bb67a1045
  Public key (SS58): 5H74SqH1iQCWh5Gumyghh1WJMcmM6TdBHYSK7mKVJbv9NuSK
  Account ID:        0xdef8f78b123475265815b65a7c55e105e1ab185f4969954f68d92b7bb67a1045
  SS58 Address:      5H74SqH1iQCWh5Gumyghh1WJMcmM6TdBHYSK7mKVJbv9NuSK
```

_Command (password with `///`):_
```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very///pencil laptop kitchen cutter"
```
_Output (password with `///`):_
```text
Secret Key URI `caution juice atom organ advance problem want pledge someone senior holiday very///pencil laptop kitchen cutter` is account:
  Secret seed:       0xdfc5d5d5235a37fdc907ee1cb720299f96aeb02f9c7c2fcad7ee8c7bfbd2a4db
  Public key (hex):  0xdef8f78b123475265815b65a7c55e105e1ab185f4969954f68d92b7bb67a1045
  Public key (SS58): 5H74SqH1iQCWh5Gumyghh1WJMcmM6TdBHYSK7mKVJbv9NuSK
  Account ID:        0xdef8f78b123475265815b65a7c55e105e1ab185f4969954f68d92b7bb67a1045
  SS58 Address:      5H74SqH1iQCWh5Gumyghh1WJMcmM6TdBHYSK7mKVJbv9NuSK
```
Take note that the `--password` flag _does not_ report the password used, but the `///` _does_. 
The output is identical otherwise.

## Combine Derivation Paths & Passwords

### IMPORTANT PASSWORD AND DERIVATION NOTE

> Note that the "secret seed" _is not_ password protected. Although it can still recover _an_
> account, the key pair that's derived _is not the same_ account as recovered with _any_ password!
> The same seed with different derivation paths passwords will derive **different keys**!
>
> **The "Secret phrase" is not sufficient to recover a key pair!**
> Keep your paths and passwords secure, as without it your key pair cannot be recovered!

You can mix and match hard and soft key paths (although it doesn't make much sense to have hard
paths as children of soft paths). For example:

_Command:_
```bash
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very//polkadot/0"
```
_Output:_
```text
Secret Key URI `caution juice atom organ advance problem want pledge someone senior holiday very//polkadot/0` is account:
  Secret seed:       n/a
  Public key (hex):  0xd6f066a07b3ebb1572c00506c9dc86a64db63779e7791e7d37247f59e4bffc14
  Public key (SS58): 5GvXX2NpiR8qoeTUbdzTCmMtZgGrZxRoCJFEvfL1iaDjTFKb
  Account ID:        0xd6f066a07b3ebb1572c00506c9dc86a64db63779e7791e7d37247f59e4bffc14
  SS58 Address:      5GvXX2NpiR8qoeTUbdzTCmMtZgGrZxRoCJFEvfL1iaDjTFKb
```

The first level (`//polkadot`) is **hard-derived**, while the leaf (`/0`) is **soft-derived**.

To use key derivation with a password-protected key, add your password to the end:

_Command:_
```bash
# Mnemonic phrase + derivation path + password
subkey inspect "caution juice atom organ advance problem want pledge someone senior holiday very//polkadot/0///pencil laptop kitchen cutter"
```
_Output:_
```text
Secret Key URI `caution juice atom organ advance problem want pledge someone senior holiday very//polkadot/0///pencil laptop kitchen cutter` is account:
  Secret seed:       n/a
  Public key (hex):  0xcaf1f5ec14b507b5c365c6528cc06de74a5615274694a0c895ed4109c0ff0d32
  Public key (SS58): 5GeoQa3nkeNmzZSfgBFuK3BkAggnTHcX3S1j94sffJYYphrP
  Account ID:        0xcaf1f5ec14b507b5c365c6528cc06de74a5615274694a0c895ed4109c0ff0d32
  SS58 Address:      5GeoQa3nkeNmzZSfgBFuK3BkAggnTHcX3S1j94sffJYYphrP
```

Notice that for **soft-derived** keys, you can use the hard-derived (with optional password)
**parent's public address** to derive new public addresses:

_Command:_
```bash
# A soft-derived SS58-address for a *public address* with a hidden seed, hard derivation path, and password
subkey inspect "5GsbzysSK8TKahXBC7FpS2myx3nWehMyYU7q8CLrzZCjpKbM/0"
```
_Output:_
```text
Public Key URI `5GsbzysSK8TKahXBC7FpS2myx3nWehMyYU7q8CLrzZCjpKbM/0` is account:
  Network ID/version: substrate
  Public key (hex):   0xcaf1f5ec14b507b5c365c6528cc06de74a5615274694a0c895ed4109c0ff0d32
  Public key (SS58):  5GeoQa3nkeNmzZSfgBFuK3BkAggnTHcX3S1j94sffJYYphrP
  Account ID:         0xcaf1f5ec14b507b5c365c6528cc06de74a5615274694a0c895ed4109c0ff0d32
  SS58 Address:       5GeoQa3nkeNmzZSfgBFuK3BkAggnTHcX3S1j94sffJYYphrP
```

Notice that the "SS58-address + derivation path" produces the same address as the "mnemonic
phrase + derivation path + password." As such, you can reveal your parent public address
and soft derivation paths without revealing your mnemonic phrase or password, retaining control
of all derived addresses.

## Signing and Verifying Messages

### Signing

You can sign a message by passing the message to Subkey on STDIN. You can sign with either your seed
or mnemonic phrase. We use the [example raw seed and address](#example-seed) here:

_Command:_
```bash
# Usage
# echo "msg" | subkey sign --suri <secret-seed>

# Example
echo "test message" | subkey sign --suri 0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
```
_Output:_
```text
22f91b41ba12f8663ddce26bfc90dbfe6a51683fd3782ad679ab2a5fdbe7d44c2a119f22c74eea22555e5483eb7f42b828f189a38379d59c3b607d2461f0858e
```

### Verifying

Although the signatures above are different, they both verify with the address:

_Command:_
```bash
# Usage
# echo "msg" | subkey verify <signature> <SS58-address>

# Example
echo "test message" | subkey verify 22f91b41ba12f8663ddce26bfc90dbfe6a51683fd3782ad679ab2a5fdbe7d44c2a119f22c74eea22555e5483eb7f42b828f189a38379d59c3b607d2461f0858e 5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
```
_Output:_
```text
Signature verifies correctly.
```

> Note: `echo` appends a newline character to the end of strings. Therefore, if you verify a message
> that was signed elsewhere, e.g. Polkadot JS, then you will need to use `echo -n` to remove the
> newline character and verify the correct message.

## Generating Node Keys

You can generate a node's libp2p key by the following:

_Command:_
```bash
# Usage
# subkey generate-node-key --file <output-file>

# Example
subkey generate-node-key --file node-key
```
_Output:_
```text
12D3KooWAhzqC4xstZKkAVYge2Q9tAMcnFhNEabLejRNVoQWLHHC
```

The peer ID is displayed on screen and the actual key is saved in the `<output-file>`.

## Well-Known Keys

> The common seed used for all development accounts is:
> ```text
> bottom drive obey lake curtain smoke basket hold race lonely fit walk
> ```
> Various development accounts are _derived_ from this seed.

If you've worked with Substrate previously, you have likely encountered the ubiquitous accounts for
Alice, Bob, and their friends. These keys are not at all private, but are useful for playing with
Substrate without always generating new key pairs. You can inspect these "well-known" keys as well.

_Command:_
```bash
subkey inspect //Alice
```
_Output:_
```text
Secret Key URI `//Alice` is account:
  Secret seed:      0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a
  Public key (hex): 0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
  Account ID:       0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d
  SS58 Address:     5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
```

A mnemonic phrase is a secret group of words that can be used to uniquely generate a private key. In
Subkey, there is a specific dev phrase used whenever a mnemonic phrase is omitted.`//Alice` for
example is actually:

```text
bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice
```

It is important remember that keys such as this are _not_ secure, and should be deployed only for
testing. In addition, anyone not using PolkadotJS or Subkey should note this information to properly
generate the account.

## Further Resources

> REMEMBER: **Passwords and derivation paths are just as important to backup as your seed itself!**
> See the [password note](#important-password-and-derivation-note) for more information.

- Learn more by running `subkey help` or see the
  [README](https://github.com/paritytech/substrate/tree/master/bin/utils/subkey).
- Key pairs can also be generated in the [PolkadotJS Apps UI](https://polkadot.js.org/apps/). Try
  creating keys with the UI and restoring them with Subkey or vice versa.
- Learn more about
  [different cryptographic algorithms and choosing between them](https://wiki.polkadot.network/docs/learn-cryptography).

---
title: Generate Your Own Keys
---

Now that we know the fundamentals and the command line options, it's time to generate our own keys
rather than using the well-known Alice and Bob keys. Each person who wants to participate in the
blockchain should generate their own keys. This page explains several options for generating keys,
and each participant only needs to choose one such option. Regardless of which option you choose, be
sure to record all of the output from this section as you will need it later.

## Option 1: Subkey

Subkey is a tool that generates keys specifically designed to be used with Substrate.

Begin by compiling and installing the utility (<a target="_blank" href="../../knowledgebase/integrate/subkey">instructions and more info here</a>). This may take up to 15 minutes or so.

We will need to generate at least **2** keys from each type. Every node will need to have its own
keys.

Generate a mnemonic and see the `sr25519` key and address associated with it. This key will be used
by Aura for block production.

```bash
# subkey command
subkey generate --scheme sr25519
```
```bash
# subkey output
Secret phrase `infant salmon buzz patrol maple subject turtle cute legend song vital leisure` is account:
  Secret seed:      0xa2b0200f9666b743402289ca4f7e79c9a4a52ce129365578521b0b75396bd242
  Public key (hex): 0x0a11c9bcc81f8bd314e80bc51cbfacf30eaeb57e863196a79cccdc8bf4750d21
  Account ID:       0x0a11c9bcc81f8bd314e80bc51cbfacf30eaeb57e863196a79cccdc8bf4750d21
  SS58 Address:     5CHucvTwrPg8L2tjneVoemApqXcUaEdUDsCEPyE7aDwrtR8D
```

Now see the `ed25519` key and address associated with the same mnemonic. This key will be used by
GRANDPA for block finalization.

```bash
# subkey command
subkey inspect --scheme ed25519 "infant salmon buzz patrol maple subject turtle cute legend song vital leisure"
```
```bash
# subkey output
Secret phrase `infant salmon buzz patrol maple subject turtle cute legend song vital leisure` is account:
  Secret seed:      0xa2b0200f9666b743402289ca4f7e79c9a4a52ce129365578521b0b75396bd242
  Public key (hex): 0x1a0e2bf1e0195a1f5396c5fd209a620a48fe90f6f336d89c89405a0183a857a3
  Account ID:       0x1a0e2bf1e0195a1f5396c5fd209a620a48fe90f6f336d89c89405a0183a857a3
  SS58 Address:     5CesK3uTmn4NGfD3oyGBd1jrp4EfRyYdtqL3ERe9SXv8jUHb
```
## Option 2: Polkadot-JS Apps

The same UI that we used to see blocks being produced can also be used to generate keys. This option
is convenient if you do not want to install Subkey. It can be used for production keys, but the
system should not be connected to the internet when generating such keys.

> A system that generates production keys should not be connected to the internet regardless of what
> method you choose. It is mentioned here specifically because having an internet connection is
> generally desired when using a webapp like Polkadot JS Apps.

On the "Accounts" tab, click "Add account". You do not need to provide a name, although you may if
you would like to save this account for submitting transaction in addition to validating.

Generate an `sr25519` key which will be used by Aura for block production. Take careful note of the
mnemonic phrase, and the SS58 address which can be copied by clicking on the identicon in the top
left.

Then generate an `ed25519` key which will be used by GRANDPA for block finalization. Again, note
the mnemonic phrase and ss58 address.

## Option 3: Use Pre-Generated Keys

If you just want to get on with the tutorial, you may use one of the pre-generated keypairs below.
But realize that these keys should absolutely not be used in production, and are provided only for
learning purposes.

### Pair 1

| Key           | Value                                                                  |
| ------------- | ---------------------------------------------------------------------- |
| Secret phrase | `clip organ olive upper oak void inject side suit toilet stick narrow` |
| Secret seed   | `0x4bd2b2c1dad3dbe3fa37dc6ad5a4e32ddd8ad84b938179ac905b0622880e86e7`   |
| **SR25519**   |                                                                        |
| Public key    | `0x9effc1668ca381c242885516ec9fa2b19c67b6684c02a8a3237b6862e5c8cd7e`   |
| SS58 Address  | `5FfBQ3kwXrbdyoqLPvcXRp7ikWydXawpNs2Ceu3WwFdhZ8W4`                     |
| **ED25519**   |                                                                        |
| Public key    | `0xb48004c6e1625282313b07d1c9950935e86894a2e4f21fb1ffee9854d180c781`   |
| SS58 Address  | `5G9NWJ5P9uk7am24yCKeLZJqXWW6hjuMyRJDmw4ofqxG8Js2`                     |

### Pair 2

| Key           | Value                                                                        |
| ------------- | ---------------------------------------------------------------------------- |
| Secret phrase | `paper next author index wedding frost voice mention fetch waste march tilt` |
| Secret seed   | `0x4846fedafeed0cf307da3e2b5dfa61415009b239119242006fc8c0972dde64b0`         |
| **SR25519**   |                                                                              |
| Public key    | `0x74cca68a32156615a5923c67024db70da5e7ed36e70c8cd5bcf3556df152bb6d`         |
| SS58 Address  | `5EhrCtDaQRYjVbLi7BafbGpFqcMhjZJdu8eW8gy6VRXh6HDp`                           |
| **ED25519**   |                                                                              |
| Public key    | `0x0fe9065f6450c5501df3efa6b13958949cb4b81a2147d68c14ad25366be1ccb4`         |
| SS58 Address  | `5CRZoFgJs4zLzCCAGoCUUs2MRmuD5BKAh17pWtb62LMoCi9h`                           |

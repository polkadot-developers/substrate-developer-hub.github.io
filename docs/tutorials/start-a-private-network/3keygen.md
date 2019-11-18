---
title: Generate Your Own Keys
---

Now that we know the fundamentals and the command line options, it's time to generate our own keys rather than using the well-known Alice and Bob keys. Each person who wants to participate in the blockchain should generate their own keys. This page explains several options for generating keys, and each participant only needs to choose one. Regardless of which option you choose, be sure to record all of the output from this section as you will need it later.

## Option 1: Subkey
Subkey is a tool the generates keys specifically designed to be used with Substrate. This is the most secure way to generate keys, and is how you should generate keys if you plan to use them in production.

Begin by compiling and installing the utility. This may take up to 15 minutes or so.
```bash
cargo install --force subkey --git https://github.com/paritytech/substrate
```

Generate a mnemonic and see the `sr25519` key and address associated with it. This key will be used by Aura for block production.
```
$ subkey generate
Secret phrase `keep matrix knee meat awake frown rubber position federal easily strategy inhale` is account:
  Secret seed: 0xb5d5cda89e139aecb67181e11d6d2d90a0cc80106afa035ab19264af7b5e5c0b
  Public key (hex): 0x8ed5f822065e5824d3e37d9ea36a81eacb98ff1a6fa04bb87d2fa4915e9ed147
  Address (SS58): 5FHzDem7A5aAq79tuEN9xJuNPXiYfmRQamhumTuqu6i57BuU
```

Now see the `ed25519` key and address associated with the same mnemonic. This key will be used by GRANDPA for block finalization.
```
$ subkey --ed25519 inspect "keep matrix knee meat awake frown rubber position federal easily strategy inhale"
Secret phrase `keep matrix knee meat awake frown rubber position federal easily strategy inhale` is account:
  Secret seed: 0xb5d5cda89e139aecb67181e11d6d2d90a0cc80106afa035ab19264af7b5e5c0b
  Public key (hex): 0xfe68fdff17960cb8d45d861396a64d4086997353849403ee3352996ec68ff4af
  Address (SS58): 5HpHD5YseSWbHfni43Zm2SjtpyqSVmuaNhKkVmivp8L93Trs
```

## Option 2: Polkadot JS Apps
The same UI that we used to see blocks being produces can also be used to generate keys. This option is convenient if you do not want to install subkey. It can be used for production keys, but the system should not be connected to the internet when generating such keys.

> A system that generates production keys should not be connected to the internet regardless of what method you choose. It is mentioned here specifically because having an internet connection is generally desired when using a webapp like Polkadot JS Apps.

On the "Accounts" tab, click "Add account". You do not need to provide a name or password, although you may if you would like to save this account for submitting transaction in addition to validating.

Generate an `sr25519` key which will be used by Aura for block production. Take careful note of the menmonic phrase, and the SS58 address which can be copied by clicking on the identicon in the top left.

Then generate an `ed25519` key which will be used by GRANDPA for for block finalization. Again, note the menmonic phrase and ss58 address.

## Option 3: Use Pre-Generated Keys
If you just want to get on with the tutorial, you may use one of the pre-generated keypairs below. But realize that these keys should absolutely not be used in production, and are provided only for learning purposes.

### Pair 1

#### SR25519
Secret phrase `clip organ olive upper oak void inject side suit toilet stick narrow` is account:
  Secret seed:      0x4bd2b2c1dad3dbe3fa37dc6ad5a4e32ddd8ad84b938179ac905b0622880e86e7
  Public key (hex): 0x9effc1668ca381c242885516ec9fa2b19c67b6684c02a8a3237b6862e5c8cd7e
  Account ID:       0x9effc1668ca381c242885516ec9fa2b19c67b6684c02a8a3237b6862e5c8cd7e
  SS58 Address:     5FfBQ3kwXrbdyoqLPvcXRp7ikWydXawpNs2Ceu3WwFdhZ8W4

#### ED25519
Secret phrase `clip organ olive upper oak void inject side suit toilet stick narrow` is account:
  Secret seed:      0x4bd2b2c1dad3dbe3fa37dc6ad5a4e32ddd8ad84b938179ac905b0622880e86e7
  Public key (hex): 0xb48004c6e1625282313b07d1c9950935e86894a2e4f21fb1ffee9854d180c781
  Account ID:       0xb48004c6e1625282313b07d1c9950935e86894a2e4f21fb1ffee9854d180c781
  SS58 Address:     5G9NWJ5P9uk7am24yCKeLZJqXWW6hjuMyRJDmw4ofqxG8Js2

### Pair 2

#### SR25519
Secret phrase `paper next author index wedding frost voice mention fetch waste march tilt` is account:
  Secret seed:      0x4846fedafeed0cf307da3e2b5dfa61415009b239119242006fc8c0972dde64b0
  Public key (hex): 0x74cca68a32156615a5923c67024db70da5e7ed36e70c8cd5bcf3556df152bb6d
  Account ID:       0x74cca68a32156615a5923c67024db70da5e7ed36e70c8cd5bcf3556df152bb6d
  SS58 Address:     5EhrCtDaQRYjVbLi7BafbGpFqcMhjZJdu8eW8gy6VRXh6HDp

#### ED25519
Secret phrase `paper next author index wedding frost voice mention fetch waste march tilt` is account:
  Secret seed:      0x4846fedafeed0cf307da3e2b5dfa61415009b239119242006fc8c0972dde64b0
  Public key (hex): 0x0fe9065f6450c5501df3efa6b13958949cb4b81a2147d68c14ad25366be1ccb4
  Account ID:       0x0fe9065f6450c5501df3efa6b13958949cb4b81a2147d68c14ad25366be1ccb4
  SS58 Address:     5CRZoFgJs4zLzCCAGoCUUs2MRmuD5BKAh17pWtb62LMoCi9h

### Pair 3

#### SR25519
Secret phrase `ridge easy shift marine leave vendor clever mammal clown input race hollow` is account:
  Secret seed:      0xfe97888532db5ecfbf87206184a232c7fc336d7aadb776419b24e3c0ff70c31a
  Public key (hex): 0x103aebd7ab1e971be446b1a13eb40541ec8ec162deb71b6ae594b3ce02ee5137
  Account ID:       0x103aebd7ab1e971be446b1a13eb40541ec8ec162deb71b6ae594b3ce02ee5137
  SS58 Address:     5CRz8J64ksqQ1DHuCUhyc5x1C2tC7exbQpkFVqEmfaG9RKdc

#### ED25519
Secret phrase `ridge easy shift marine leave vendor clever mammal clown input race hollow` is account:
  Secret seed:      0xfe97888532db5ecfbf87206184a232c7fc336d7aadb776419b24e3c0ff70c31a
  Public key (hex): 0x4822d2a0b3c5665050cd3470717439ca23a3c3387b65efcf6a9fbcc93571ea4a
  Account ID:       0x4822d2a0b3c5665050cd3470717439ca23a3c3387b65efcf6a9fbcc93571ea4a
  SS58 Address:     5DhHecmfy3hB9TpWJvCRXi1EwU3A4AwYvmCYJemsUUAcxf4V

### Pair 4

#### SR25519
Secret phrase `wide poet angle chronic pave ill family example confirm speed obtain tomorrow` is account:
  Secret seed:      0x4b36f2b06222beb99e0f3a0dcdec033e167bd4a7c3e7b4f8a4ce3e835f1ed3b6
  Public key (hex): 0xd4ea2baa9af2ffca9d11954fbc2b7b19e1bdd7aa7f524869f444e0cd47da3514
  Account ID:       0xd4ea2baa9af2ffca9d11954fbc2b7b19e1bdd7aa7f524869f444e0cd47da3514
  SS58 Address:     5Gssa89jmRhpxZg1cHJRgS4gwZhqAKtachhLJkgBuCfErydA

#### ED25519
Secret phrase `wide poet angle chronic pave ill family example confirm speed obtain tomorrow` is account:
  Secret seed:      0x4b36f2b06222beb99e0f3a0dcdec033e167bd4a7c3e7b4f8a4ce3e835f1ed3b6
  Public key (hex): 0x6d7a260c37259fcf3895e8c41c7a1f3e2d5595d0d3c20fc9bd4f940a49b1b6c8
  Account ID:       0x6d7a260c37259fcf3895e8c41c7a1f3e2d5595d0d3c20fc9bd4f940a49b1b6c8
  SS58 Address:     5EYFMy5RG9fLctQ64rCJR53Zp9MHMawNcFDzJnD2f1baWeZN

### Pair 5

#### SR25519
Secret phrase `hour doctor salmon enlist differ letter project design shove assault cost borrow` is account:
  Secret seed:      0x92ea498a16084a1e88abf1b3c31b03a545ee608bc2686e64eeb670a237ad427c
  Public key (hex): 0xf0aa3897e67b5f915530dba67d09126847f1b33bf48de7f33be61168699d590f
  Account ID:       0xf0aa3897e67b5f915530dba67d09126847f1b33bf48de7f33be61168699d590f
  SS58 Address:     5HWFv4hRpqmTjMFZ27Z5wr5pq1mTtPEzd3oQZCBGG6whHyLE

#### ED25519
Secret phrase `hour doctor salmon enlist differ letter project design shove assault cost borrow` is account:
  Secret seed:      0x92ea498a16084a1e88abf1b3c31b03a545ee608bc2686e64eeb670a237ad427c
  Public key (hex): 0x71cf6e16c213b4eb81afbb3be1dd1773f27347b21dfc83074f7304f93c832341
  Account ID:       0x71cf6e16c213b4eb81afbb3be1dd1773f27347b21dfc83074f7304f93c832341
  SS58 Address:     5EdvtSZ84bRvPkZKGTrmz38ChjT47VfCCH9NhTCGEksoCuca

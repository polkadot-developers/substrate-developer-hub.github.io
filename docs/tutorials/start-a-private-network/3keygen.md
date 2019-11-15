---
title: Generate Your Own Keys
---

Now that we know the fundamentals and the command line options, it's time to generate our own keys rather than using the well-known Alice and Bob keys. Each person who wants to participate in the blockchain can generate their own key using the [subkey tool](ecosystem/subkey). Be sure to record all of the output from this section as you will need it later.

> If you aren't interested in learning to generate your own keys, you may use the example keys below for learning purposes. But you must generate your own before starting any production network.

First generate a mnemonic and see the `sr25519` key and address associated with it. This key will be used by BABE for block production.
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

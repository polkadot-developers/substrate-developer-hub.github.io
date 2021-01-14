---
title: SS58 Address Format
---

SS58 is a simple address format designed for Substrate based chains. There's no problem with using
other address formats for a chain, but this serves as a robust default. It is heavily based on
Bitcoin's Base-58-check format with a few alterations.

The basic idea is a base-58 encoded value that can identify a specific account on the Substrate
chain. Different chains have different means of identifying accounts. SS58 is designed to be
extensible for this reason.

The living specification for the SS58 address format can be found on the Substrate GitHub wiki:

https://github.com/paritytech/substrate/wiki/External-Address-Format-(SS58)

## Validating Addresses

There are several ways to verify that a value is a valid SS58 address.

### Subkey

You can use the [Subkey](https://substrate.dev/docs/en/knowledgebase/integrate/subkey) `inspect`
subcommand, which accepts the seed phrase, a hex-encoded private key, or an SS58 address as the input
URI. If the input is a valid address, it will return a list containing the corresponding public
key (hex), account ID, and SS58 values.

Subkey currently works for keys generated using: sr25519, ed25519, and secp256k1.

> **NOTE:** If you input a valid SS58 value, Subkey will also return a network ID/version value
> that indicates which network the address has been encoded for.

```bash
$ subkey inspect "12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU"
Public Key URI `12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU` is account:
  Network ID/version: polkadot
  Public key (hex):   0x46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a
  Account ID:         0x46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a
  SS58 Address:       12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU
```

If you input an invlaid address you will get:

```bash
$ subkey inspect "12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZUInvalidAddress"
Invalid phrase/URI given
```

### Polkadot.js

For verifying an address in your JavaScript projects, you can utilize the functions built
into the [Polkadot.js API](https://github.com/polkadot-js/api/), which supports ed25519 and
sr25519 key types.

```javascript
const { decodeAddress, encodeAddress } = require("@polkadot/keyring");
const { hexToU8a, isHex } = require("@polkadot/util");

const address = "<addressToTest>";

const isValidAddressPolkadotAddress = () => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

    return true;
  } catch (error) {
    return false;
  }
};

const isValid = isValidAddressPolkadotAddress();

console.log(isValid);
```

### Subscan

You can also verify an address is valid by using the web tool on
[Subscan](https://polkadot.subscan.io/tools/ss58_transform). They have also made the
[essentials](https://github.com/itering/subscan-essentials/tree/78de8d163a3543a217f0cb3d48c6b9816bb5a231)
behind their web interface open source so you can take advantage of their
[Go implemented utilities](https://github.com/itering/subscan-essentials/tree/78de8d163a3543a217f0cb3d48c6b9816bb5a231/util)
to suit your needs.

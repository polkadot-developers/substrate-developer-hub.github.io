---
title: SS58 Address Format
---

SS58 is a simple address format designed for Substrate based chains. There's no problem with using
other address formats for a chain, but this serves as a robust default. It is heavily based on
Bitcoin's Base-58-check format with a few alterations.

The basic idea is a base-58 encoded value that can identify a specific account on the Substrate
chain. Different chains have different means of identifying accounts. SS58 is designed to be
extensible for this reason.

The living specification for the SS-58 address format can be found on the Substrate GitHub wiki:

https://github.com/paritytech/substrate/wiki/External-Address-Format-(SS58)

## Validating addresses

There are several ways to verify that a value is a valid SS58 address.

### Subkey

You can use the [Subkey](https://substrate.dev/docs/en/knowledgebase/integrate/subkey) inspect
subcommand which will accept the seed phrase, an address as hex or an SS58 address as the input
URI. If the input is a valid address, it will return a list containing the corresponding Public
key (hex), Account ID, and SS58 values.

Subkey currently works for keys generated using: sr25519, ed25519, and secp256k1.

> **NOTE:** If you input a valid SS58 value Subkey will also return a Network ID/version value which indicates which network the address has been encoded for.

```bash
$ subkey inspect "12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU"
Public Key URI `12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU` is account:
  Network ID/version: polkadot
  Public key (hex):   0x46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a
  Account ID:         0x46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a
  SS58 Address:       12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU
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

You can also manually convert and verify an address is valid by using the web tool on
[Subscan](https://polkadot.subscan.io/tools/ss58_transform). They have also made the
[essentials](https://github.com/itering/subscan-essentials/tree/78de8d163a3543a217f0cb3d48c6b9816bb5a231)
behind their web interface open source so you can take advantage of their
[Go implemented Utilities](https://github.com/itering/subscan-essentials/tree/78de8d163a3543a217f0cb3d48c6b9816bb5a231/util)
to suit your needs

### Custom Solution

If you wish to make your own custom solution for validating addresses you will need to consider
how an address is created. You may find some helpful documentation in the
[Substrate Github Wiki](<https://github.com/paritytech/substrate/wiki/External-Address-Format-(SS58)>)
pages, as well as in this [article](https://hackmd.io/@gavwood/r1jTRX2Zr#3-Working-with-SS58-and-account-addresses)
by Gavin Wood.

##### Python

For some inspiration on developing a solution in Python, you may find the
[Python Substrate Interface](https://github.com/polkascan/py-substrate-interface),developed by
Polkascan helpful. Here is where you can find their
[documentation](https://polkascan.github.io/py-substrate-interface/#substrateinterface.Keypair).

##### Go

Centrifuge has a client [implemented in Go](https://github.com/centrifuge/go-substrate-rpc-client/tree/3e974433f8417e386b033fb64a6ac4971f02c737) that has Subkey as a dependency that you could use as a
[starting point](https://github.com/centrifuge/go-substrate-rpc-client/tree/3e974433f8417e386b033fb64a6ac4971f02c737).

##### C++

To help you along the way with a C++ solution you might want to look at
[Usetech's API implementation](https://github.com/usetech-llc/polkadot_api_cpp). Here is where they
[encode and decode addresses](https://github.com/usetech-llc/polkadot_api_cpp/blob/master/src/utils/address.cpp).

##### C#/.Net

Usetech also has a [.Net implementation](https://github.com/usetech-llc/polkadot_api_dotnet)
which may serve as a reference for dealing with addresses in C#. Here is where you can find
their [address utilities](https://github.com/usetech-llc/polkadot_api_dotnet/blob/master/Polkadot/src/Utils/Address.cs).

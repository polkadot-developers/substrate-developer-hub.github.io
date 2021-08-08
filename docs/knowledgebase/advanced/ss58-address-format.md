---
title: SS58 Address Format
---

SS58 is a simple address format designed for Substrate based chains. There's no problem with using
other address formats for a chain, but this serves as a robust default. It is heavily based on
Bitcoin's Base-58-check format with a few alterations.

The basic idea is a base-58 encoded value that can identify a specific account on the Substrate
chain. Different chains have different means of identifying accounts. SS58 is designed to be
extensible for this reason.

The living specification for the SS58 address format can be found on the
[Substrate GitHub wiki](<https://github.com/paritytech/substrate/wiki/External-Address-Format-(SS58)>).

## Validating Addresses

There are several ways to verify that a value is a valid SS58 address.

### Subkey

You can use the [Subkey](https://substrate.dev/docs/en/knowledgebase/integrate/subkey) `inspect`
subcommand, which accepts the seed phrase, a hex-encoded private key, or an SS58 address as the input
URI. If the input is a valid address, it will return a list containing the corresponding public
key (hex), account ID, and SS58 values.

Subkey assumes that an address is based on a public/private keypair. In the case of inspecting an
address, it will return the 32 byte account ID. Not all addresses in Substrate-based networks are
based on keys.

> **Note:** If you input a valid SS58 value, Subkey will also return a network ID/version value
> that indicates for which network the address has been encoded.

```bash
# A valid address.
$ subkey inspect "12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU"
Public Key URI `12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU` is account:
  Network ID/version: polkadot
  Public key (hex):   0x46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a
  Account ID:         0x46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a
  SS58 Address:       12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZU

# An invalid address.
$ subkey inspect "12bzRJfh7arnnfPPUZHeJUaE62QLEwhK48QnH9LXeK2m1iZUInvalidAddress"
Invalid phrase/URI given
```

### Polkadot.js

For verifying an address in your JavaScript projects, you can utilize the functions built
into the [Polkadot.js API](https://polkadot.js.org/docs/api/).

```javascript
// Import Polkadot.js API dependencies.
const { decodeAddress, encodeAddress } = require("@polkadot/keyring");
const { hexToU8a, isHex } = require("@polkadot/util");

// Specify an address to test.
const address = "<addressToTest>";

// Check address.
const isValidSubstrateAddress = () => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

    return true;
  } catch (error) {
    return false;
  }
};

// Query result.
const isValid = isValidSubstrateAddress();
console.log(isValid);
```

### Community Built

Below you will find a list of other Substrate API tools built in various languages by our community.
They each validate addresses in their own way, and can act as a starting point.

- [Python Substrate Interface](https://polkascan.github.io/py-substrate-interface/#substrateinterface.Keypair) - developed by Polkascan.

- [Go Substrate RPC client](https://github.com/centrifuge/go-substrate-rpc-client) - developed by Centrifuge.

- [C++ Polkadot Substrate API](https://github.com/usetech-llc/polkadot_api_cpp) - developed by Usetech.

- [.Net API](https://github.com/usetech-llc/polkadot_api_dotnet) - developed by Usetech.

- [Go implemented utilities](https://github.com/itering/subscan-essentials) - developed by Subscan.

- [SS58 Transform](https://polkadot.subscan.io/tools/ss58_transform) - to manually verify an address (sanity check).

### Learn More

- [Polkadot-js API on GitHub](https://github.com/polkadot-js/api)

- [Subkey guide](../integrate/subkey)

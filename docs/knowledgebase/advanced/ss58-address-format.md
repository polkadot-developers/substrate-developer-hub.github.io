---
title: SS58 Address Format
---

SS58 is a simple address format designed for Substrate based chains, primarily 
inspired by the [Bitcoin Base58Check](https://en.bitcoin.it/wiki/Base58Check_encoding) format with a few alterations.
Substrate developers are free to use the address format of their choice, but this serves as a robust default. 
The purpose of this article is to outline existing solutions to validating a SS58 address.

## Solutions

The basic idea of SS58 is that it is a base-58 encoded value that can identify a specific account on a Substrate
chain. Different chains have different means of identifying accounts. SS58 is designed to be
extensible for this reason. For the living specification of the SS58 address, refer to the 
[Substrate GitHub wiki](https://github.com/paritytech/substrate/wiki/External-Address-Format-(SS58)).
### Subkey

One approach is to use the [Subkey `inspect`](https://github.com/paritytech/substrate/tree/master/bin/utils/subkey#inspecting-a-key) subcommand, 
which accepts the seed phrase, a hex-encoded private key, or an SS58 address as the input
URI. If the input is a valid address, it will return a list containing the corresponding public
key (hex), account ID, and SS58 values.

Subkey assumes that an address is based on a public/private keypair. In the case of inspecting an
address, it will return the 32 byte account ID. Not all addresses in Substrate-based networks are
based on keys.

> **Note:** If you input a valid SS58 value, Subkey will also return a network ID/version value
> that indicates for which network the address has been encoded.

Here's an example using `subkey inspect`:

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

For JavaScript projects, the best solution is to use the functions for verifying an address 
provided by the [Polkadot.js API](https://polkadot.js.org/docs/api/). 
Here's what that would look like:

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

As for other solutions, here is a list of community maintained projects for developers 
looking for address verification tools in different languages: 

- [Python Substrate Interface](https://polkascan.github.io/py-substrate-interface/#substrateinterface.Keypair) - developed by Polkascan.

- [Go Substrate RPC client](https://github.com/centrifuge/go-substrate-rpc-client) - developed by Centrifuge.

- [C++ Polkadot Substrate API](https://github.com/usetech-llc/polkadot_api_cpp) - developed by Usetech.

- [.Net API](https://github.com/usetech-llc/polkadot_api_dotnet) - developed by Usetech.

- [Go implemented utilities](https://github.com/itering/subscan-essentials/tree/master/util) - developed by Subscan.


## Learn more

- [SS58 Transform tool](https://polkadot.subscan.io/tools/ss58_transform)
- [Polkadot-js API on GitHub](https://github.com/polkadot-js/api)
- [Subkey guide](docs/en/knowledgebase/integrate/subkey)

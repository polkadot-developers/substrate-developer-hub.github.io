---
title: "Part 2 - Display balances"
---

Now that we have the connection to our node let's play with some accounts. Because we are connecting to a `--dev` node, we can get access to accounts that are pre-funded, and which private key is known to us. Acount are organised in so called keyring. From a keyring you can get the address of an account, its associated name, the Keypair if this account is managed locally.. The [`@polkadot/ui-keyring`](https://polkadot.js.org/ui/ui-keyring/) package contains many utilities to manage accounts, we will make use of them in the following sections.

We needed to add `@polkadot/keyring`, `@polkadot/ui-identicon`, `@polkadot/ui-keyring`

## 2.1 Get testing accounts

First things first, let's import the `keyring` object;

```js
import keyring from '@polkadot/ui-keyring';
```

Initializing this keyring is super simple, all we need to do it call `loadAll`, to get access to the testing accout we can simply passe the object `{isDevelopment: true}` as parameter. We will add a new `useEffect` function to initialize our keyring. Let's `console.log` it to inspect what it gives us.

This is the code we added:
```js
  useEffect(() => { 
    keyring.loadAll({
      isDevelopment: true
    });
    
    console.log(keyring);
  },[]); 
```

And this is what you should get in the console:
```
{…}
​_accounts: Object { add: add(), remove: remove(), subject: {…} }
​_addresses: Object { add: add(), remove: remove(), subject: {…} }
​_contracts: Object { add: add(), remove: remove(), subject: {…} }
​_genesisHash: undefined
​_keyring: Object { _pairs: {…}, _type: "ed25519", decodeAddress: decode(), … }
​_prefix: undefined
​_store: Object {  }
​decodeAddress: function decodeAddress()​
encodeAddress: function encodeAddress()​
stores: Object { address: address(), contract: contract(), account: account() }
```

If you developp the `_keyring` and `_pairs` objects, you'll see that we have some key pairs here. Those are the testing accounts that were initialized that to the `isDevelopment` flag. Let's pass this keyring object to a Balances component so that we can display those accounts. Let's also pass the `api` as we will use it right after.

```js
// at the top of the file
import Balances from './Balances';

// in the return, after NodeInfo
<Balances
  api={api}
  keyring={keyring}
/>
```

This Balances component will very soon show all our accounts with the amount of funds. Let's start by listing the account names and their address.
Nothing fancy here other than what we talked about before, `getPairs()` will give us the array of the accounts in our keyring. Mapping through this array lets us display the name and address of each of our accounts.

```js
import React from 'react';
import { Table } from 'semantic-ui-react';

export default function Balances (props) {
  const { keyring } = props;
  const accounts = keyring.getPairs();

  return (
    <>
      <h1>Balances</h1>
      <Table celled striped>
        <Table.Body>
          {accounts.map((account, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell textAlign='right'>{account.meta.name}</Table.Cell>
                <Table.Cell>{account.address}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
}
```

You can get the working version of this code by checking out the `part-2-1` branch:

```bash
git checkout part-2-1;
yarn;
yarn start;
```

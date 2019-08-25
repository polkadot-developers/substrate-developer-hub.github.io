---
title: Part 2 - Display balances
id: version-1.0-part-2-query-balances
original_id: part-2-query-balances
---

Now that we have the connection to our node, let's play with some accounts. Because we are connected to a node launched with the `--dev` flag, we can get access to accounts that are pre-funded and whose private keys are known to us. Accounts are organized in a so-called keyring. From this keyring, you can get the address of an account, its associated name, and its cryptographic keypair if this account is managed locally. The [`@polkadot/ui-keyring`](https://polkadot.js.org/ui/ui-keyring/) package contains many utilities to manage accounts. We will make use of them in the following sections.

In this part we will use the [`api.query`](https://polkadot.js.org/api/METHODS_STORAGE.html) method to access the storage of the `balances` blockchain component. 

## 2.1 Get testing accounts

First things first, let's import the `keyring` object; We needed to add `@polkadot/keyring`, `@polkadot/ui-identicon`, `@polkadot/ui-keyring` as dependencies to our project to get access to the keyring utilities.

```js
import keyring from '@polkadot/ui-keyring';
```

Initializing this keyring is simple, all we need to do is call `loadAll()`. To get access to the testing accounts, we can simply pass the object `{isDevelopment: true}` as a parameter. We will add a new `useEffect` function to initialize our keyring. Let's `console.log` it to inspect what it gives us.

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

If you expand the `_keyring` and `_pairs` objects, you'll see that we have some key pairs here. Those are the testing accounts that were initialized thanks to the `isDevelopment` flag. We will now build a Balances component so that we can display those accounts. This Balances component will very soon show all our accounts with the amount of funds in each one.

Let's start by listing the account names and their addresses. Nothing fancy here other than what we talked about before, `getPairs()` will give us the array of the accounts in our keyring. Mapping through this array lets us display the name and address of each of our accounts.

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

Of course we need to amend the entry point of our DApp, `Apps.js`, to import this new component and render it. Note that we also passed the `api` as a prop, this is not needed at this exact moment in the tutorial, but we will make use of it right after.

```js
// at the top of the file
import Balances from './Balances';

// in the return, after NodeInfo
<Balances
  api={api}
  keyring={keyring}
/>
```

You can get the working version of this code by visiting `part-2-1` directory:

```bash
cd part-2-1;
yarn;
yarn start;
```

If you run this example, you will get a table with "Alice", "Alice_stash", "Bob", and their addresses.  

![Testing accounts name and address](/docs/assets/tutorials/substrate-front-end/part-2-1.jpg)

## 2.2 Query and display Alice's balance

Now that we have our accounts, we can query the balance for each one of them. The Substrate node that you are connected to has a `Balances` module that keeps track of the balance of every account on the blockchain. We will watch the `freeBalance` of an account. The [Polkadot-js API](https://polkadot.js.org/api/api/) allows you to query the storage of a module with `api.query` and to subscribe to updates of these values. This is how we can get access to this `freeBalance` information.

Let's start small and query the balance for one account, Alice.

```js
export default function Balances (props) {
  const { api, keyring } = props;
  const accounts = keyring.getPairs();
  // this state will keep track of Alice's freeBalance
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    let unsubscribe;

    api.query.balances.freeBalance(accounts[0].address, (currentBalance) => {
        setBalance(currentBalance.toString());
      })
      .then(unsub => { unsubscribe = unsub; })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [accounts, api.query.balances, api.query.balances.freeBalance]);
```

We start by creating a state variable called `balance`, which we will initialize at `0`. Then, as we did in the previous part, we will make the query in a React hook with `useEffect`. We want to display the balance and subscribe to all changes populated by the Substrate node.

**Subscribe**

The API method `api.query.balances.freeBalance()` takes  an account address as its first argument and you can pass an optional callback as the second argument to subscribe to any update. The callback function then listens to changes of the `freeBalance` value of the given account.

We're updating the component's state with the values we're getting from the API and that's what allows us to see the balance change without reloading the page! 

**Unsubscribe**

But because it's a subscription, we must unsubscribe whenever our `Balances` React component unmounts. The `unsubscribe` function is what is actually returned by the `query`. This one must be called in the `return` statement of the `useEffect` that will be called whenever the component unmounts. In our case, it's when we close the tab or refresh our applications manually.

Let's strip down the table we return to show only the balance for Alice.

 ```js
  // the end of the Balance.js file

  return (
    <>
      <h1>Balances</h1>
      <Table celled striped>
        <Table.Body>
          <Table.Row key={0}>
            <Table.Cell textAlign='right'>{accounts[0].meta.name}</Table.Cell>
            <Table.Cell>{accounts[0].address}</Table.Cell>
            <Table.Cell>{balance}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
}
 ```

You can get the working version of this code by visiting the `part-2-2` directory:

```bash
cd part-2-2;
yarn;
yarn start;
```

If you run this example, you will get a table with Alice's account and balance.  

![Alice balance](/docs/assets/tutorials/substrate-front-end/part-2-2.jpg)

## 2.3 Query and display all balances

Now that we know how querying the state of a module works, we can map through all of our accounts and query the state for each one. The `api` has a handy function to batch multiple queries at the same time; it's called `multi`. You can pass an array of arguments and it will return the results as an array.

Instead of having just the balance of Alice in the state, we will change it to an object mapping `address` with `freeBalance` so that we can use it to display each account's balance. Because the `multi` remains one subscription, the logic for unsubscribing remains the same.

```js
const { api, keyring } = props;
const accounts = keyring.getPairs();
const addresses = accounts.map(account => account.address);
const accountNames = accounts.map((account) => account.meta.name);
const [balances, setBalances] = useState({});

useEffect(() => {
  let unsubscribeAll

  api.query.balances.freeBalance
    .multi(addresses, (currentBalances) => {
      const balancesMap = addresses.reduce((acc, address, index) => ({
        ...acc,
        [address]: currentBalances[index].toString()
      }), {});
      setBalances(balancesMap);
    })
    .then(unsub => { unsubscribeAll = unsub; })
    .catch(console.error);

  return () => unsubscribeAll && unsubscribeAll();
}, [addresses, api.query.balances.freeBalance, setBalances]);
```

We call `api.query.balances.freeBalance.multi` and pass our array of addresses, the callback then receives an array of results. From there we create an object with `reduce` that contains the address and balance of each account. This object is what we will persist in the state.

Displaying the accounts with their balances is now easy. We will map through our list of addresses and display the names and balances. 

```js
  return (
    <>
      <h1>Balances</h1>
      <Table celled striped>
        <Table.Body>
          {addresses.map((address, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell textAlign='right'>{accountNames[index]}</Table.Cell>
                <Table.Cell>{address}</Table.Cell>
                <Table.Cell>{balances && balances[address]}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
```
You can get the working version of this code by visiting the `part-2-3` directory:

```bash
cd part-2-3;
yarn;
yarn start;
```

If you run this example, you will get a table with all our testing accounts, their addresses, and their balances.  

![All balances](/docs/assets/tutorials/substrate-front-end/part-2-3.jpg)

## 2.4 Good to know

It is worth mentioning that the funds in `freeBalancee` of an account might **not** be available to transfer. An account could very well have funds, but if for example those are staked (a.k.a bonded) for validating, you might not be able to transfer them even though `freeBalance` is not null. If you want to show the balance available to transfer, this is computed in a so-called `api-derive`. Have a look at the `available` field returned by [`derive.balances.all`](https://github.com/polkadot-js/api/blob/master/packages/api-derive/src/balances/all.ts).

The `derive api`, as its name suggests, is not a direct query to the node. It is rather a concatenation and derivation of multiple queries to serve information that is not directly accessible by the node. A popular one is [`derive.chain.bestNumber`](https://github.com/polkadot-js/api/blob/master/packages/api-derive/src/chain/bestNumber.ts) to get the latest block number. Have a look at [the repo](https://github.com/polkadot-js/api/blob/master/packages/api-derive/src/). Unfortunately, those `api` endpoints are only documented in the code for now.

Substrate is a framework to build blockchains. The `--dev` node that we are querying in this part contains a Balances module from the [**S**ubstrate **R**untime **M**odule **L**ibrary a.k.a SRML](https://substrate.dev/rustdocs/v1.0/srml_balances/index.html), which keeps track of the balance of each account on the blockchain. Not every Substrate chain will have this Balances module. However, any module that is integrated into a Substrate node can be queried using `api.query.section.method`.


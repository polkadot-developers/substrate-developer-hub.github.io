---
title: "Part 3 - Transfer funds"
---

Now that we have all of our account balances displayed, let's get them moving. In this part, we will create a `Transfer` React component that will allow sending funds from the accounts for which we own the private key to any other account. We will have a "from" field, a "to" field, and a button to transfer.

In this part we will use the [`api.tx`](https://polkadot.js.org/api/METHODS_EXTRINSICS.html) method to submit a transaction for the `balances` blockchain pallet.

## 3.1 Transfer funds

Because you can only send funds from your own accounts, the "from" field will be a dropdown. The receiver of our funds can be any valid address though.

In this component, we don't need to fetch any data from the `api`, so there is no hook, however, we will use the `api` to do the transfer. Just like for `Balances` we will pass the `api` and `keyring` to the props. We will have only one state variable, an object containing the form information to be submitted as we click the *Send* button.

To generate the options from the dropdown of our account's `keyringOptions`, we will simply iterate from the `keyring.getPairs()`.

```js
export default function Transfer (props) {
  const { api, keyring } = props;
  const [status, setStatus] = useState('');
  const initialState = {
    addressFrom: '',
    addressTo: '',
    amount: 0
  };
  const [formState, setFormState] = useState(initialState);

  // get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map((account) => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase()
  }));

  const onChange = (_, data) => {
    setFormState(formState => {
      return {
        ...formState,
        [data.state]: data.value
      };
    });
  };
```

We will then create our function to actually submit the form. To do so we need to create the transaction, then sign it with our private key, and finally send it. The `api` provides all we need here again, with `api.tx.balances` and the `transfer` and `signAndSend` methods. The latter takes the key pair as the first parameter and a callback as the second parameter.

The `status` of the transaction is passed to the callback function. We will use it to see if our transaction is executed successfully. In the example below, we will show our users if the transaction was successfully finalized using the `isFinalized` status value. If it was successfullu executed, we're showing at which block it was finalized.

```js
const makeTransfer = () => {
    const { addressTo, addressFrom, amount } = formState;
    const fromPair = keyring.getPair(addressFrom);

    setStatus('Sending...');

    api.tx.balances
    .transfer(addressTo, amount)
    .signAndSend(fromPair, ({ status }) => {
        if (status.isFinalized) {
        setStatus(`Completed at block hash #${status.asFinalized.toString()}`);
        } else {
        setStatus(`Current transfer status: ${status.type}`);
        }
    }).catch((e) => {
        setStatus(':( transaction failed');
        console.error('ERROR:', e);
    });
};
```

This is it, nothing particularly crazy right?
Similar to the `Balances` component, we need to import it in `Apps.js` and say where it should be rendered.

```js
// at the top of the file
import Transfer from './Transfer';

// right after our Balances component
<Transfer
    api={api}
    keyring={keyring}
/>
```

You can get the working version of this code by visiting the `part-3-1` directory:

```bash
cd part-3-1;
yarn;
yarn start;
```

If you run this example, you will find our `Transfer` component below the Balance table.  

![All balances](/docs/assets/tutorials/substrate-front-end/part-3-1.jpg)



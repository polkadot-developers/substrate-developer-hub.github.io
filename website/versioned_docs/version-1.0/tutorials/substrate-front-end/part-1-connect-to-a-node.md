---
title: Part 1 - Connect to a node
id: version-1.0-part-1-connect-to-a-node
original_id: part-1-connect-to-a-node
---

## 1.1 Frameworks and tools

In this tutorial, we will build a React application. To focus as much as possible on the actual use of the Polkadot-js API ([see its documentation](https://polkadot.js.org/api/api/#api-selection)), we do not want to spend too much time making the app pretty. We will, therefore, use the `semantic-ui-react` package to render UI components nicely for us.

Building an application on top of Substrate means that we need to connect to a Substrate node. To get started as quickly as possible on the actual app development, this guide will provide you with a development endpoint to connect your application to. To be more flexible and run your own node, please read [installing Substrate](https://substrate.dev/docs/en/getting-started/installing-substrate).

The node provided in this tutorial is accessible at `wss://dev-node.substrate.dev:9944`, is run with the `--dev` option, and its database is reset every hour on the hour, so don't be surprised if things like account balances "reset" regularly. The advantage of running your own node is that you can read runtime errors in the console and have full control over your chain's configuration. 

This application is created using the `create-react-app` scaffolding command. We will use the `yarn` package manager throughout this guide. Go ahead and clone the [`substrate-front-end` repo](https://github.com/substrate-developer-hub/substrate-front-end):

```bash
git clone https://github.com/substrate-developer-hub/substrate-front-end.git
cd substrate-front-end
```

After removing the boilerplate code, we add our first dependencies to the repo: `@polkadot/api@beta`, `semantic-ui-react`, `semantic-ui-css`

Substrate code is evolving quickly with regular breaking changes. The Polkadot-js API follows this path as well, so sometimes things break. We will use the `beta` versions of all Polkadot-js modules here because the DApp we are building is basic and adapting it to breaking changes shouldn't require too much work. It is, however, advised to use the stable releases for any production app.

To get started, we will connect our application to our development node using the built-in methods from [`@polkadot/api`](https://polkadot.js.org/api/api/#api-selection). We will then request node information using [`rpc.system`](https://polkadot.js.org/api/METHODS_RPC.html#system) methods available from the `api`.

## 1.2 Connect to a node

Head to the `src/App.js` file to get started. We start by importing the following packages:

```js
import { ApiPromise, WsProvider } from '@polkadot/api';
import React, { useState, useEffect } from 'react';
import { Container, Dimmer, Loader} from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css'
```

This application will make use of React hooks. They let us use state and other React features without writing a class. `WsProvider` and `ApiPromise` from the Polkadot-js API allow us to connect to a node and expose the functions from the node in our application. Let's get started and connect to a node on the default WebSocket port 9944.

```js
  const [api, setApi] = useState();
  const [apiReady, setApiReady] = useState();
  const WS_PROVIDER = 'wss://dev-node.substrate.dev:9944';

  useEffect(() => {
    const provider = new WsProvider(WS_PROVIDER);

    ApiPromise.create(provider)
      .then((api) => {
        setApi(api);
        api.isReady.then(() => setApiReady(true));
      })
      .catch((e) => console.error(e));
  }, []);
```

The first hook we will use is `useEffect`. This function will be triggered when our `App` component loads, just like `componentDidMount` would do.

The first thing you need to do is to define your provider, in our case the dev node `wss://dev-node.substrate.dev:9944`. If you want to connect to a local node you can set it to `ws://127.0.0.1:9944`.

Then we create an `api` variable that is returned by `ApiPromise.create`. We will add it to the component's state to make it easily accessible because it will be heavily used to interact with our blockchain node.

To know if our application is successfully connected to the node, `api` provides a promise `isReady` that will resolve when the connection with the node is established. As soon as it resolves we will set another state variable `apiReady`. Since our application will not be able to access any node or blockchain information before the connection is established, we will show a loader to our users to let them know that we are currently connecting to a node.

If you are new to React hooks, it is interesting to note that the first argument of `useEffect` is the function that should be triggered (creating a connection to the node in our case). The second argument we are passing is an array to tell our hook when it should be triggered again. You will see right away what it is. In this case, our `api.create` should only be executed once. As it is not needed to update the state in the future, we pass an empty array. 

Here is how we will render things.

```js
  const loader = function (text){
    return (
      <Dimmer active>
        <Loader size='small'>{text}</Loader>
      </Dimmer>
    );
  };
  
  if(!apiReady){
    return loader('Connecting to the blockchain')
  }

  return (
    <Container>
      Connected
    </Container>
  );
```

As described before, this code will verify that the `api` from the state is initialized and ready before showing "Connected" to our users.
The `loader` function returns a nice looking loader with any text we want. This loader logic has been extracted into its own function because we will reuse it later in the tutorial.

You can get the working version of this code by visiting the `part-1-2` directory and launching it with:

```bash
cd part-1-2;
yarn;
yarn start;
```

You should see the loader for a couple of seconds, and then "Connected" 🚀.

## 1.3 Retrieve node information

Now that we are successfully connected to our node, let's present some information about it.
We will create a new component called `NodeInfo`, which will be responsible for displaying this information. We will pass the `api` object that we added to the `App`'s component state to the props of this component.
This way, we're getting access to all methods and functions exposed by the Substrate node we're connected to. 

All we need to import are the usual `React` component and the hook functions.

```js
import React, {useEffect, useState} from 'react';
```

The [Polkadot-js api](https://polkadot.js.org/api/api/) allows you to send RPC calls to the node.
To get the node's information we want, we will use the `rpc.system` methods provided by the `api`.
We will add the information returned by the api to the component's state to be able to access and display it later on.

```js
export default function NodeInfo(props) {
  const {api} = props;
  const [nodeInfo, setNodeInfo] = useState({})

  useEffect(() => {
    Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
    ])
    .then(([chain, nodeName, nodeVersion]) => {
      setNodeInfo ({
        chain,
        nodeName,
        nodeVersion
      })
    })
    .catch((e) => console.error(e));
  },[api.rpc.system]);
```

Remember what we said in the previous part? The second argument of `useEffect` is an array that presents the variables to watch. In this case, `useEffect` will be triggered when the component loads and whenever `api.rpc.system` changes.

The api endpoints do not change unless there's a runtime upgrade of the node. Even though this will not happen in our development environment and the component will work without specifying this argument, we are still passing the `api.rpc.system` to `useEffect` to make our examples as realistic as possible.

Finally, we'll display our node information at the top of the page:

```js
  return (
    <>
      {nodeInfo.chain} - {nodeInfo.nodeName} (v{nodeInfo.nodeVersion})
      <hr/>
    </>
  )
}
```

You can get the working version of this code by visiting `part-1-3` directory and launch it with:

```bash
cd part-1-3;
yarn;
yarn start;
```

You should see something like: "Development - substrate-node (v2.0.0)"
---
title: Testing Your New Blockchain
---

This tutorial is not really about writing front-ends, but we do want to show you
how easy it can be with Substrate. If you have made it this far, that means you
_should_ have a brand new working blockchain with custom functionality.

We will give you a custom react component that you can add to your
`substrate-front-end-template` meant for interacting with your node.

So let's test it!

## Add Your Custom React Component

In the `substrate-front-end-template` project, create a file called
`ProofOfExistence.jsx` in the `/src/` folder:

```
substrate-front-end-template
|
+-- src
|   |
|   +-- index.jsx
|   |
|   +-- App.jsx 
|   |
|   +-- TemplateModule.jsx  <-- Edit this file
|   |
|   +-- ...
+-- ...
```

In that file, replace the existing content the following component.

```js
import React, { useState, useEffect } from "react";
import { Form, Input, Grid, Message } from "semantic-ui-react";
import { blake2AsHex } from "@polkadot/util-crypto";

import { useSubstrate } from "../substrate-lib";
import { TxButton } from "../substrate-lib/components";
// Based on the Substrate Proof of Existence module
// https://github.com/substrate-developer-hub/substrate-proof-of-existence

export default function ProofOfExistence(props) {
  const { api } = useSubstrate();
  const { accountPair } = props;
  const [status, setStatus] = useState("");
  const [digest, setDigest] = useState("");
  const [owner, setOwner] = useState("");
  const [block, setBlock] = useState(0);

  let fileReader;

  const bufferToDigest = () => {
    const content = Array.from(new Uint8Array(fileReader.result))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    const hash = blake2AsHex(content, 256);
    setDigest(hash);
  };

  const handleFileChosen = file => {
    fileReader = new FileReader();
    fileReader.onloadend = bufferToDigest;
    fileReader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    let unsubscribe;

    api.query.templateModule
      .proofs(digest, result => {
        setOwner(result[0].toString());
        setBlock(result[1].toNumber());
      })
      .then(unsub => {
        unsubscribe = unsub;
      });

    return () => unsubscribe && unsubscribe();
  }, [digest, api.query.templateModule]);

  function isClaimed() {
    return block !== 0;
  }

  return (
    <Grid.Column>
      <h1>Proof Of Existence</h1>
      <Form success={!!digest && !isClaimed()} warning={isClaimed()}>
        <Form.Field>
          <Input
            type="file"
            id="file"
            label="Your File"
            onChange={e => handleFileChosen(e.target.files[0])}
          />
          <Message success header="File Digest Unclaimed" content={digest} />
          <Message
            warning
            header="File Digest Claimed"
            list={[digest, `Owner: ${owner}`, `Block: ${block}`]}
          />
        </Form.Field>

        <Form.Field>
          <TxButton
            accountPair={accountPair}
            label={"Create Claim"}
            setStatus={setStatus}
            type="TRANSACTION"
            attrs={{ params: [digest], tx: api.tx.templateModule.createClaim }}
            disabled={isClaimed() || !digest}
          />
          <TxButton
            accountPair={accountPair}
            label="Revoke Claim"
            setStatus={setStatus}
            type="TRANSACTION"
            attrs={{ params: [digest], tx: api.tx.templateModule.revokeClaim }}
            disabled={!isClaimed() || owner !== accountPair.address}
          />
        </Form.Field>
        <div style={{ overflowWrap: "break-word" }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
```

We won't walk you step by step through the creation of this component, but do
look over the code comments to learn what each part is doing.

## Submit a Proof

Your front-end should have automatically restarted with this new component
included:

![Proof Of Existence Component](assets/poe-component.png)

Select any file on your computer, and you will see that you can create a claim
with it's file digest.

If you press "Create Claim", a transaction will be dispatched to your custom
Proof of Existence module, where this digest and the selected user account will
be stored on chain.

![Claimed File](assets/poe-claimed.png)

If all went well, you should see a new `ClaimCreated` event appear in the Events
component. The front-end can automatically recognize that your file is now
claimed, and even gives you the option to revoke the claim if you want.

Remember, only the owner can revoke the claim! If you select another user
account at the top, and you will see that the revoke option is disabled!

## Next Steps

This is the end of our journey into creating a Proof of Existence blockchain.

You have seen first hand how simple it can be to develop a brand new runtime
module and launch a custom blockchain using Substrate. Furthermore, we have
shown you that the Substrate ecosystem provides you with the tools to quickly
and easily create responsive front-end experiences so users can interact with
your blockchain.

This tutorial chose to omit some of the specific details around development in
order to keep this experience short and satisfying. However, we want you to keep
learning!

If you are interested in learning how to program your own runtime module on
Substrate, please try our [Substrate Collectables
Workshop](https://substrate.dev/substrate-collectables-workshop/). This
comprehensive tutorial will teach you step by step how to program your own
custom runtime modules. Furthermore, it will start to introduce you to advance
runtime development concepts and best practices when building on Substrate.

It would also be a good time to call out that your success on the Substrate
framework will ultimately be limited on your ability to program in Rust. The
[Rust Book](https://doc.rust-lang.org/book/) is the best starting point for
developers of any experience.

If you experienced any issues with this tutorial or want to provide feedback,
feel free to [open a GitHub
issue](https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/issues/new)
with your thoughts.

We can't wait to see what you build next!

---
title: Testing Your New Blockchain
---

This tutorial is not really about writing front-ends, but we do want to show you how easy it can be with Substrate. If you have made it this far, that means you _should_ have a brand new working blockchain with custom functionality.

So let's test it!

## Custom React Component

We will give you a custom react component that you can add to your `substrate-front-end-template` meant for interacting with your node.

```js
import React, { useState, useEffect } from "react";
import { Form, Input, Grid, Message } from "semantic-ui-react";
import { blake2AsHex } from "@polkadot/util-crypto";

import TxButton from "../TxButton";

export default function ProofOfExistence(props) {
  const { api, accountPair } = props;
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

    api.query.template
      .proofs(digest, result => {
        setOwner(result[0].toString());
        setBlock(result[1].toNumber());
      })
      .then(unsub => {
        unsubscribe = unsub;
      });

    return () => unsubscribe && unsubscribe();
  }, [digest, api.query.template]);

  function isClaimed() {
    return block !== 0;
  }

  return (
    <Grid.Column>
      <h1>Proof Of Existence</h1>
      <Form success={digest && !isClaimed()} warning={isClaimed()}>
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
            api={api}
            accountPair={accountPair}
            label={"Create Claim"}
            setStatus={setStatus}
            params={[digest]}
            tx={api.tx.template.createClaim}
            disabled={isClaimed() || !digest}
          />
          <TxButton
            api={api}
            accountPair={accountPair}
            label={"Revoke Claim"}
            setStatus={setStatus}
            params={[digest]}
            tx={api.tx.template.revokeClaim}
            disabled={!isClaimed() || owner !== accountPair.address}
          />
          {status}
        </Form.Field>
      </Form>
    </Grid.Column>
  );
}

```

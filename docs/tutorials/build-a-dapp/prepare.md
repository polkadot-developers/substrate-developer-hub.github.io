---
title: Prepare to build a dApp
---

## About Proof of Existence

The dApp we will build is a Proof of Existence (PoE) service. From
[Wikipedia](https://en.wikipedia.org/wiki/Proof_of_Existence):

> Proof of Existence is an online service that verifies the existence of computer files as of a
> specific time via timestamped transactions in the bitcoin blockchain.

Rather than uploading the entire file to the blockchain to "prove its existence", users submit a
[hash of the file](https://en.wikipedia.org/wiki/File_verification), known as a file digest or
checksum. These hashes are powerful because huge files can be uniquely represented by a small hash
value, which is efficient for storing on the blockchain. Any user with the original file can prove
that this file matches the one on the blockchain by simply recomputing the hash of the file and
comparing it with the hash stored on chain.

![File Hash](assets/tutorials/build-a-dapp/file-hash.png)

To add to this, blockchains also provide a robust identity system through accounts that map to 
[public keys](https://en.wikipedia.org/wiki/Public-key_cryptography), and associations built on
top of those keys [see the identity pallet](https://github.com/paritytech/substrate/tree/v3.0.0/frame/identity).
So when a file digest is stored on the blockchain, we can also record which account uploaded that digest.
This allows that controller of that account to later prove that they were the original person to claim the file.

## Install the Node Template

You should already have version `latest` of the
[Substrate Node Template](https://github.com/substrate-developer-hub/substrate-node-template/tree/latest)
compiled on your computer from when you completed the
[Create Your First Substrate Chain Tutorial](../create-your-first-substrate-chain). If you do not,
please complete that tutorial. (`v3.0.0` tag works as well, but comes with FRAME v1 templates,
`latest` includes FRAME v2 templates that you can use for reference for mock and testing files.)

```bash
git clone -b latest --depth 1 https://github.com/substrate-developer-hub/substrate-node-template
```

> Experienced developers may prefer to skip that tutorial and install the Node Template
> according to
> [the instructions in its readme](https://github.com/substrate-developer-hub/substrate-node-template#getting-started).

## Install the Front-End Template

The [Create Your First Substrate Chain](https://substrate.dev/docs/en/tutorials/create-your-first-substrate-chain/) Tutorial used the front-end template, so there is no
additional set-up required if you have already completed that tutorial.

> Refer directly to the
> [front-end setup instructions](../create-your-first-substrate-chain/setup#install-the-front-end-template)
> for the Create Your First Chain Tutorial if necessary.

## Interface and Design

Our PoE API will expose two callable functions:

- `create_claim()` - allows a user to claim the existence of a file by uploading a file digest.
- `revoke_claim()` - allows the current owner of a claim to revoke their ownership.

In order to implement this, we will only need to store information about the proofs that have been
claimed, and who made those claims.

Sounds simple enough, right? Let's get coding!

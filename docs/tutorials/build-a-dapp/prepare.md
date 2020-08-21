---
title: Prepare to build a dApp
---

## Install the Node Template

You should already have version `v2.0.0-rc6` of the
[Substrate Developer Hub Node Template](https://github.com/substrate-developer-hub/substrate-node-template)
compiled on your computer from when you completed the
[Create Your First Substrate Chain Tutorial](../create-your-first-substrate-chain). If you do not,
please complete that tutorial.

> Experienced developers who truly prefer to skip that tutorial may install the Node Template
> according to
> [the instructions in its readme](https://github.com/substrate-developer-hub/substrate-node-template#local-development).

## Install the Front-End Template

The Create Your First Substrate Chain Tutorial used the front-end template, so there is no
additional set-up required if you have already completed that tutorial.

> Refer directly to the
> [front-end setup instructions](../create-your-first-substrate-chain/setup#install-the-front-end-template)
> for the Create Your First Chain Tutorial if necessary.

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

To add to this, blockchains also provide a robust identity system. So when a file digest is stored
on the blockchain, we can also record which user uploaded that digest. This allows that user to
later prove that they were the original person to claim the file.

## Interface and Design

Our PoE API will expose two callable functions:

- `create_claim` - allows a user to claim the existence of a file by uploading a file digest.
- `revoke_claim` - allows the current owner of a claim to revoke their ownership.

In order to implement this, we will only need to store information about the proofs that have been
claimed, and who made those claims.

Sounds simple enough? Great, let's get coding.

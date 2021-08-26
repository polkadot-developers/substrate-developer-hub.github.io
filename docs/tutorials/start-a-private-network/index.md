---
title: "Start a Private Network"
---

In this tutorial we will learn and practice how to start a blockchain network with a
validator/authority set of your choosing using Substrate.

## Install the Node Template

You should already have version `latest` of the
[Substrate Node Template](https://github.com/substrate-developer-hub/substrate-node-template/tree/latest)
compiled on your computer from when you completed the
[Create Your First Substrate Chain Tutorial](../../tutorials/create-your-first-substrate-chain/).
If you do not, please complete that tutorial.

> Experienced developers who truly prefer to skip that tutorial, you may install the node template
> according to the instructions in its readme.

## What you will be doing

Before we even get started, let's lay out what we are going to do over the course of this tutorial.
We will:

1. Launch a Substrate blockchain **network** based on a template project.
2. Generate ed25519 and sr25519 key-pairs for use as a network authority.
3. Create and edit a chainspec json file.

Sound reasonable? Good, then let's begin!

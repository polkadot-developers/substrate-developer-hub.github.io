---
title: Start a Private Network
id: version-v2.0.0-alpha.3-index
original_id: index
---

In this tutorial we will learn and practice how to start a blockchain network with a validator/authority set of your choosing using Substrate.

## Install the Node Template

You should already have version `v2.0.0-alpha.3` of the [Substrate Node
Template](https://github.com/substrate-developer-hub/substrate-node-template) compiled on your
computer from when you completed the [Creating Your First Substrate Chain
Tutorial](tutorials/creating-your-first-substrate-chain/index.md). If you do not, please complete that
tutorial.

> Experienced developers who truly prefer to skip that tutorial, you may install the node template according to the instructions in its readme.

## What you will be doing

Before we even get started, let's lay out what we are going to do over the course of this tutorial.
We will:

1. Launch a Substrate blockchain **network** based on a template project.
3. Generate ed25519 and sr25519 key-pairs for use as a network authority.
4. Create and edit a chainspec json file.

Sound reasonable? Good, then let's begin!

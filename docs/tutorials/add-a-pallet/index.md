---
title: Introduction
---

The
[Substrate Node Template](https://github.com/substrate-developer-hub/substrate-node-template)
provides a minimal working runtime which you can use to quickly get started building your own custom
blockchain. The Node Template includes [a number of components](../../index#architecture), including
a [runtime](../../knowledgebase/getting-started/glossary#runtime) that is constructed using
[FRAME](../../knowledgebase/runtime/frame) runtime development framework. However, in order to
remain minimal, it does not include most of the modules (called "pallets") from Substrate's set of
core FRAME pallets.

This guide will show you how you can add the
[Nicks pallet](https://substrate.dev/rustdocs/latest/pallet_nicks/index.html). You can follow
similar patterns to add additional FRAME pallets to your runtime, however you should note that each
pallet is a little different in terms of the specific configuration settings needed to use it
correctly. This tutorial will help you understand what you'll need to consider when adding a new
pallet to your FRAME runtime.

If you run into an issue on this tutorial, **we are here to help!** You can
[ask a question on Stack Overflow](https://stackoverflow.com/questions/tagged/substrate) and use the
`substrate` tag or contact us on [Element](https://matrix.to/#/#substrate-technical:matrix.org).

## Install the Node Template

You should already have [latest version of the Node Template](https://github.com/substrate-developer-hub/substrate-node-template/tree/latest) compiled on your computer from when you completed the
[Create Your First Substrate Chain](../../tutorials/create-your-first-substrate-chain/) tutorial. If
you do not, please complete it first.

> Experienced developers who truly prefer to skip those tutorials may install the Node Template
> according to [the instructions in its readme](https://github.com/substrate-developer-hub/substrate-node-template#getting-started).

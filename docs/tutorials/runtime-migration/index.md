---
title: Introduction
---

One of the defining features of the Substrate blockchain development framework is its support for
**forkless runtime upgrades**. Forkless upgrades are a means of enhancing a blockchain runtime in a
way that is supported and protected by the capabilities of the blockchain itself. A blockchain's
[runtime](../../knowledgebase/runtime) defines the [state](../../knowledgebase/runtime/storage) the
blockchain can hold and also defines the logic for effecting changes to that state. Substrate makes
it possible to deploy enhanced runtime capabilities (including _breaking_ changes) without a
[hard fork](../../knowledgebase/getting-started/glossary#fork). These new capabilities expect the
blockchain's state and storage schema to be configured in the correct way for operation, though.
If the expected schema and state are not present a [storage migration](../../knowledgebase/runtime/upgrades.md#storage-migrations) is necessary.

This tutorial will use the Substrate Developer Hub
[Node Template](https://github.com/substrate-developer-hub/substrate-node-template) to explore how to write and perform storage migrations of [FRAME](../../knowledgebase/runtime/frame)-based runtimes.
> TODO: outline of steps

If you have problems with this tutorial, the Substrate community is full of helpful resources. We
maintain an active
[#SubstrateTechnical chat room](https://app.element.io/#/room/!HzySYSaIhtyWrwiwEV:matrix.org) and
monitor the
[`substrate` tag on Stack Overflow](https://stackoverflow.com/questions/tagged/substrate). You can
also use the [`subport` GitHub repository](https://github.com/paritytech/subport/issues/new) to
create an Issue.

## The Node Template

If you haven't already, you should complete the first three tutorials. The
[Create Your First Substrate Chain](../../tutorials/create-your-first-substrate-chain/) tutorial
will guide you through the process of setting up your development environment. The
[Add a Pallet to Your Runtime](../../tutorials/add-a-pallet) tutorial will introduce the FRAME
system for runtime development and guide you through the process of extending the capabilities of a
FRAME runtime by adding a pallet. The [Perform a Forkless Upgrade](../../tutorials/upgrade-a-chain/) tutorial will introduce runtime upgrades.

If you're an experienced developer and wish to skip those
tutorials, you can clone the
[Node Template repository](https://github.com/substrate-developer-hub/substrate-node-template) and
refer to the
[documentation for local development](https://github.com/substrate-developer-hub/substrate-node-template#local-development).

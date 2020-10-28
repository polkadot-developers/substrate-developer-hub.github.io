---
title: Runtime Overview
---

The runtime of a blockchain is the business logic that defines its behavior. In Substrate-based
chains, the runtime is referred to as the
"[state transition function](../../knowledgebase/getting-started/glossary#state-transition-function-stf)";
it is where Substrate developers define the storage items that are used to represent the
blockchain's [state](../../knowledgebase/getting-started/glossary#state) as well as the
[functions](../../knowledgebase/learn-substrate/extrinsics) that allow blockchain users to make
changes to this state.

In order to provide its defining forkless runtime upgrade capabilities, Substrate uses runtimes that
are built as [WebAssembly (Wasm)](../../knowledgebase/getting-started/glossary#webassembly-wasm)
bytecode. Substrate also defines the
[core primitives](../../knowledgebase/runtime/primitives#core-primitives) that the runtime must
implement.

The core Substrate codebase ships with [FRAME](../../knowledgebase/runtime/frame), Parity's system
for Substrate runtime development that is used for chains like
[Kusama](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/lib.rs) and
[Polkadot](https://github.com/paritytech/polkadot/blob/master/runtime/polkadot/src/lib.rs). FRAME
defines additional [runtime primitives](../../knowledgebase/runtime/primitives#frame-primitives) and
provides a framework that makes it easy to construct a runtime by composing modules, called
"pallets". Each pallet encapsulates domain-specific logic that is expressed as a set of a
[storage items](../../knowledgebase/runtime/storage), [events](../../knowledgebase/runtime/events),
[errors](../../knowledgebase/runtime/errors) and
[dispatchable functions](../../knowledgebase/getting-started/glossary#dispatch). FRAME developers
can [create their own pallets](../../knowledgebase/runtime/pallets) and reuse existing pallets,
including [over 50 that ship with Substrate](../../knowledgebase/runtime/frame#prebuilt-pallets).

![Runtime Composition](assets/frame-runtime.png)

For the most part, this section is focused on Substrate runtime development with FRAME. Keep in mind
that FRAME is not the only system for Substrate runtime development.

### Learn More

- Follow a
  [tutorial to develop your first Substrate chain](../../tutorials/create-your-first-substrate-chain/).
- Follow a [tutorial to add a pallet to your Substrate runtime](../../tutorials/add-a-pallet/).

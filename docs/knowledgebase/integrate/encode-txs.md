---
title: Encoding Transactions
---

The purpose of this document is to describe the specification for encoding
[transactions](../../knowledgebase/learn-substrate/extrinsics) to submit to Substrate-based chains.

## Dispatchable Calls

Transactions on Substrate-based chains are used to invoke
"[dispatchable calls](../../knowledgebase/getting-started/glossary#dispatch)", which are encoded as
follows:

- 1 byte: 0-based module index from
  [`construct_runtime!`](../../knowledgebase/runtime/macros#construct_runtime) (modules without
  calls are ignored)
- 1 byte: 0-based call index that corresponds to the target variant on the module's `Call` enum
- variable: [SCALE](../../knowledgebase/advanced/codec)-encoded function parameters

## Signed Extensions

Substrate uses
"[signed extensions](../../knowledgebase/learn-substrate/extrinsics#signed-extension)" to allow
developers to extend its transaction-verification capabilities. Despite the name, signed extensions
can also be applied to unsigned transactions. They are intended to be used in any situation where it
is desireable to access or verify some information about a transaction prior to executing it. Signed
extensions are defined at the runtime layer and the signed extensions that a runtime uses are
exposed by way of its [metadata](../../knowledgebase/runtime/metadata). In order to construct
transactions that satisfy a runtime's signed extensions, it may be necessary to implement custom
logic at the signing layer although not all signed extensions require additional signing logic. In
order to satisfy the requirements of signed extensions, transaction signers may need information
_about_ the chain (such as the hash of its
[genesis block](https://substrate.dev/rustdocs/v2.0.0-rc6/frame_system/struct.CheckGenesis.html)) or
even on-chain data (such as the
[nonce](https://substrate.dev/rustdocs/v2.0.0-rc6/frame_system/struct.CheckNonce.html) of an
account). Signed extensions can contribute two types of information to a transaction:

- Signed (additional) information: data that should be well-known to both the signer and verifier,
  such as the hash of the chain's genesis block; does not contribute to payload size because it is
  signed (hashed)
- Unsigned (extra) information: data that only the signer knows and that must be sent in the clear,
  such as the nonce used for a transaction; will contribute to the size of a payload

## Signing

- 1 byte: magic number that indicates signing scheme; `00` for Ed25519, `01` for sr25519
- 64 bytes: sig(call + unsigned/extra + signed/additional)

## Transaction Construction

Given the above, transactions are encoded as follows:

- variable: SCALE compact integer-encoded length of the entire transaction
- 1 byte: `0x8` for signed transactions; append extrinsic version from runtime metadata
- variable: signer's account ID
- 65 bytes: signed data
- variable: signed extension unsigned (extra) information
- variable: dispatchable call

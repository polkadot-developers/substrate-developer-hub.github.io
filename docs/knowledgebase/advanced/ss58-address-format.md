---
title: SS58 Address Format
---

SS58 is a simple address format designed for Substrate based chains. There's no problem with using
other address formats for a chain, but this serves as a robust default. It is heavily based on
Bitcoin's Base-58-check format with a few alterations.

The basic idea is a base-58 encoded value that can identify a specific account on the Substrate
chain. Different chains have different means of identifying accounts. SS58 is designed to be
extensible for this reason.

The living specification for the SS-58 address format can be found on the Substrate GitHub wiki:

https://github.com/paritytech/substrate/wiki/External-Address-Format-(SS58)

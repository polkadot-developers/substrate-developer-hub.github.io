---
title: Runtime Errors
---

Runtime errors allow you to handle and report failures in your runtime to
external entities.

## Error Handling

The Rust programming language distinguishes between recoverable and
unrecoverable errors. Recoverable errors have logic which dictate what should
happen if an error condition is reached. These kinds of errors are represented
in Rust by a `Result` type, which can return `Ok` or `Err`. Unrecoverable
errors, also known as a _panic_, are always the symptom of bugs.

It is important that you review [error
handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html) from the
Rust Book which goes more into details about errors in Rust.

Substrate uses a specific implementation of the `Result` type, where success
returns the unit type (`Ok(())`) and errors return a string (`Err('Some
Reason')`).

### Must Not Panic

Substrate runtime functions must not panic. If a runtime module was allowed to
panic during block execution, it would allow a malicious user to attack your
chain by triggering computation on the network without appropriately being
charged for those operations.

Instead, you must actively define what your runtime should do in case of
reaching an error. Often, this can just be to stop execution of a runtime
function and return an error from the module.

### No Side-Effects On Error

Substrate runtime functions must either:

- Complete totally and return `Ok(())`.

or

- Have no side-effects on storage and return `Err('Some reason')`.

Unlike smart contract platforms where a failed transaction will revert the state
of the blockchain, when you write to Substrate storage and handle your runtime
errors, those storage items will be written.

This means you must **"verify first, write last"**. Before you

What are runtime errors?

Panic vs Error Handling

Reminder: never panic

Reminder: verify first, write last

Custom Error Messages

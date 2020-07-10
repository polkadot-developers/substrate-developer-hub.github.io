---
title: Runtime Macros
---

The Substrate runtime macros are a set of utilities which make the development of runtime modules
simpler for you.

## What are Rust macros?

In short, Rust macros are a way to write code that writes more code. Macros work by matching against
the specific patterns defined in the macro rule, capturing part of the match as variables, and then
expand to produce even more code.

You can learn more about
[macros in the Rust book](https://doc.rust-lang.org/book/ch19-06-macros.html).

## Runtime Macros

Substrate provides a set of runtime macros that generate boilerplate code that would otherwise be
cumbersome for you to write.

The main macros you will interact with are:

- `decl_module!` - Used for defining the callable functions your runtime module exposes and
  orchestrates actions our module takes through block execution.
- `decl_storage!` - Used to define the storage items managed by your runtime module.
- `decl_event!` - Used to define the events that can be emitted by your runtime module.

In addition, you will interact with the `construct_runtime!` macro when finally choosing the modules
which will be included into your runtime.

Each of these macros have their own page which describes how to use them.

## Expanding the Macros

The runtime macros do a lot of work for you, and as a result, may sometimes feel like magic. In
general, we suggest that you treat them like magic.

However, if you are interested in learning more details about what exactly the macros do, you can
expand them with [`cargo expand`](https://github.com/dtolnay/cargo-expand), resulting in pure Rust
code.

## Next Steps

### Learn More

- Learn how to use the [`decl_storage` macro](storage).
- Learn how to use the [`decl_event` macro](events).

### Examples

View our most [simple Substrate runtime](index) to see all these macros interact with one another.

### References

- [`decl_module!` macro](https://substrate.dev/rustdocs/v2.0.0-rc4/frame_support/macro.decl_module.html)
- [`decl_event!` macro](https://substrate.dev/rustdocs/v2.0.0-rc4/frame_support/macro.decl_event.html)
- [`decl_storage!` macro](https://substrate.dev/rustdocs/v2.0.0-rc4/frame_support/macro.decl_storage.html)
- [`construct_runtime!` macro](https://substrate.dev/rustdocs/v2.0.0-rc4/frame_support/macro.construct_runtime.html)

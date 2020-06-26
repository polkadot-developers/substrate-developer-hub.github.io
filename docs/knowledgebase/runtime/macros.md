---
title: Runtime Macros
---

## Introduction

Rust macro is a way of writing code that writes code, also called metaprogramming. It is useful for reducing the amount of code one have to write and maintain. Macro also helps create domain specific language (DSL) by abstracting out some implementation details and defining its own rules and logics. 

In Substrate runtime development context, this helps runtime engineers to focus on the runtime logics and forget about details such as how the on-chain variables need to be encoded and decoded. That's why we frequently leverage these macros to simplify runtime development effort once the intent is made known, via the succinct statements in macros. But the downside is that sometimes developers may encounter error messages of new structs or types that they do not define as a result of how the macro content interacts inside the macro definition.

The purpose of this article is to give a basic overview of macros, and detail macros that runtime engineers deploy.

## Macro Basics

There are four kinds of macro in Rust:

- declarative macros defined with [`macro_rules!` macro](https://doc.rust-lang.org/book/ch19-06-macros.html#declarative-macros-with-macro_rules-for-general-metaprogramming)
- procedural macros, [custom derive](https://doc.rust-lang.org/book/ch19-06-macros.html#how-to-write-a-custom-derive-macro)
- procedural macros, [attribute-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#attribute-like-macros)
- procedural macros, [function-like macros](https://doc.rust-lang.org/book/ch19-06-macros.html#function-like-macros)

Most Substrate runtime macros are defined using either declarative macros or function-like macros. 

There are three ways to learn about these runtime macros:

  - read documentation of a particular macro
  - run `cargo expand` to review the macros-expanded code
  - read the macro definition. Readers are required to have a good grasp on [macro rules of expression pattern matching](https://danielkeep.github.io/tlborm/book/pim-README.html).

## Macro Usage in Substrate

When developing substrate runtime, there are a few macros that will be used frequently. The following is a brief introduction to these macros. They will be explained in what context they are used, how they are defined, how the code looks like when expanded within the project [Substrate Node Template](https://github.com/substrate-developer-hub/substrate-node-template).

### decl_storage

**Context**

To define storage items to be used in a runtime pallet. You can define its data type (a regular value `StorageValue`, a map `StorageMap`, a double-map `StorageDoubleMap`), its getter function, the type of the key and how they are hashed if it is a map or double-map data type, the name of the storage, and its default value.

**Objective**

This macro takes a succinct statements of 

```
#vis #name get(fn #getter) config(#field_name) build(#closure): #type = #default;
```

and replace it with a new type/struct defined by your `#name` and have it implement your datatype storage trait. 

The macro also sets up codes so the core struct `Module` implements a `Store` trait to have a basic setup for the pallet to have storage space.

[**API Documentation**](https://substrate.dev/rustdocs/v2.0.0-rc3/frame_support/macro.decl_storage.html)

[**Macro Definition**](https://github.com/paritytech/substrate/blob/v2.0.0-rc3/frame/support/procedural/src/lib.rs#L236-L238)

**Code Expansion Example**
  - <a href="https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-rs-L30-L40" target="_blank">Original Code</a>
  - <a href="https://gist.github.com/jimmychu0807/c4a88ec8e0342ee9f4e14bd26287324e#file-pallet-template-expanded-rs-L19-L164" target="_blank">Expanded Code</a>

**Somethings worth noting about on the macro expansion**

  - a trait called `Store`, and each storage name becomes an associated type inside the trait.
  - the core struct `Module` implements `Store`
  - the core struct `Module` implementation contains the getter function (pallet-template-expanded.rs#L33-35) and the storage metadata (pallet-template-expanded.rs#L67-70)
  - Each of the storage names becomes a struct. In the above expanded code, `Something` is defined (pallet-template-expanded.rs#L144-L164) and it implements `StorageValue<u32>`, the data type specified in the macro.
  - Helper structs `__GetByteStructSomething` and `__InherentHiddenInstance` are defined. The former is for setting default value of the storage, while the later implements traits for data encoding/decoding.

### decl_event
### decl_error
### decl_module
### construct_runtime
### parameter_types
### impl_runtime_apis
### app_crypto
### impl_outer_origin!
### impl_outer_event!

## Conclusion

Through this article, you should have a good grasp on why Substrate runtime leverage on Rust macros. You also have a basic understanding on some of the frequently used macros in runtime development, and hopefully better equip you when you are debugging on macro content and codes that interact with these macros. 

## References

- [The Rust Programming Language ch 19.5 Macros](https://doc.rust-lang.org/book/ch19-06-macros.html)
- [The Little Book of Rust Macros](https://danielkeep.github.io/tlborm/book/index.html)

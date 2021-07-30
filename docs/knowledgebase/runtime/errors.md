---
title: Errors
---

Runtime code should explicitly and gracefully handle all error cases, which is to say that runtime
code **must** be "non-throwing", or must never
"[panic](https://doc.rust-lang.org/book/ch09-03-to-panic-or-not-to-panic.html)" to use Rust
terminology. A common idiom for writing non-throwing Rust code is to write functions that return
[`Result` types](https://substrate.dev/rustdocs/latest/frame_support/dispatch/result/enum.Result.html).
The `Result` enum type possesses an `Err` variant that allows a function to indicate that it failed
to execute successfully without needing to panic. Dispatchable calls in the FRAME system for runtime
development _must_ return a
[`DispatchResult` type](https://substrate.dev/rustdocs/latest/frame_support/dispatch/type.DispatchResult.html)
that _should_ be a
[`DispatchError`](https://substrate.dev/rustdocs/latest/frame_support/dispatch/enum.DispatchError.html)
if the dispatchable function encountered an error.

Each FRAME pallet may define custom a `DispatchError` by:
- using
the [`decl_error!` macro](macros#decl_error) (FRAME v1) or;
- the [`#[pallet::error]` macro](/docs/en/knowledgebase/runtime/macros#palleterror)  (FRAME v2).

```rust
// FRAME v1.
// Errors inform users that something went wrong.
decl_error! {
  pub enum Error for Module<T: Config> {
    /// Error names should be descriptive.
    InvalidParameter,
    /// Errors should have helpful documentation associated with them.
    OutOfSpace,
  }
}

// FRAME v2.
#[pallet::error]
pub enum Error<T> {
    /// Error names should be descriptive.
    InvalidParameter,
    /// Errors should have helpful documentation associated with them.
    OutOfSpace,
  }

```

> **Note:** In FRAME v1, in order to emit custom errors from a pallet, the pallet must
> configure the `Error` type in `decl_module!`. See the [Rust docs](https://substrate.dev/rustdocs/latest/frame_support/macro.decl_error.html#usage) for more details.


The
[Pallet Template](https://github.com/substrate-developer-hub/substrate-pallet-template/blob/master/src/lib.rs)
demonstrates some ways to correctly handle errors in dispatchable functions. The FRAME Support
module also includes a helpful
[`ensure!` macro](https://substrate.dev/rustdocs/latest/frame_support/macro.ensure.html) that can be
used to check pre-conditions and emit an errors if they are not met.

```rust
frame_support::ensure!(param < T::MaxVal::get(), Error::<T>::InvalidParameter);
```

## Next Steps

### Learn More

- Learn more about the [macros](macros) used in Substrate runtime development.

### References

- [`decl_error!` macro](https://substrate.dev/rustdocs/latest/frame_support/macro.decl_error.html)
- [`decl_module!` macro](https://substrate.dev/rustdocs/latest/frame_support/macro.decl_module.html)
- [`[pallet::error]` macro](https://crates.parity.io/frame_support/attr.pallet.html#error-palleterror-optional)

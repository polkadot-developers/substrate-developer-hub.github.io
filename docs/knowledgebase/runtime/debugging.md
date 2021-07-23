---
title: Debugging
---

Debugging is a necessity in all walks of software development, and blockchain is no exception. Most
of the same tools used for general purpose Rust debugging also apply to Substrate. However, there
are some restrictions when operating inside of a `no_std` environment like the Substrate runtime.

## FRAME Debugging & Logging Utilities

The FRAME Support
[`debug` module](https://substrate.dev/rustdocs/latest/frame_support/debug/index.html) contains
macros and functions that make it possible to print logs out of runtime code.

### Log from Native Runtimes

For performance-preserving, native-only debugging, use the macros in the
[`frame_support::debug::native` module](https://substrate.dev/rustdocs/latest/frame_support/debug/native/index.html).

```rust
pub fn do_something(origin) -> DispatchResult {
  print("Execute do_something");

  let who = ensure_signed(origin)?;
  let my_val: u32 = 777;

  Something::put(my_val);

  frame_support::debug::native::debug!("called by {:?}", who);

  Self::deposit_event(RawEvent::SomethingStored(my_val, who));
  Ok(())
}
```

The
[`frame_support::debug::native::debug!`](https://substrate.dev/rustdocs/latest/frame_support/debug/native/macro.debug.html)
macro avoids extra overhead in Wasm runtimes, but is only effective when the runtime is executing in
native mode. In order to view these log messages, it's necessary to configure the node to use the
right logging target. By default, the name of the target is the name of the crate that contains the
log messages.

```sh
./target/release/node-template --dev -lpallet_template=debug
```

The `debug!` macro takes an optional parameter, `target`, that can be used to specify the target
name.

```rust
frame_support::debug::native::debug!(target: "customTarget", "called by {:?}", who);
```

### Log from Wasm Runtimes

It is possible to pay a performance price in order to log from Wasm runtimes.

```rust
pub fn do_something(origin) -> DispatchResult {
  print("Execute do_something");

  let who = ensure_signed(origin)?;
  let my_val: u32 = 777;

  Something::put(my_val);

  frame_support::debug::RuntimeLogger::init();
  frame_support::debug::debug!("called by {:?}", who);

  Self::deposit_event(RawEvent::SomethingStored(my_val, who));
  Ok(())
}
```

## Printable Trait

The Printable trait is meant to be a way to print from the runtime in `no_std` and in `std`. The
`print` function works with any type that implements the
[`Printable` trait](https://substrate.dev/rustdocs/latest/sp_runtime/traits/trait.Printable.html).
Substrate implements this trait for some types (`u8`, `u32`, `u64`, `usize`, `&[u8]`, `&str`) by
default. You can also implement it for your own custom types. Here is an example of implementing it
for a pallet's `Error` type using the node-template as the example codebase.

```rust
use sp_runtime::traits::Printable;
use sp_runtime::print;
```

```rust
// The pallet's errors
decl_error! {
  pub enum Error for Module<T: Config> {
    /// Value was None
    NoneValue,
    /// Value reached maximum and cannot be incremented further
    StorageOverflow,
  }
}

impl<T: Config> Printable for Error<T> {
  fn print(&self) {
    match self {
      Error::NoneValue => "Invalid Value".print(),
      Error::StorageOverflow => "Value Exceeded and Overflowed".print(),
      _ => "Invalid Error Case".print(),
    }
  }
}
```

```rust
/// takes no parameters, attempts to increment storage value, and possibly throws an error
pub fn cause_error(origin) -> dispatch::DispatchResult {
  // Check it was signed and get the signer. See also: ensure_root and ensure_none
  let _who = ensure_signed(origin)?;

  print("My Test Message");

  match Something::get() {
    None => {
      print(Error::<T>::NoneValue);
      Err(Error::<T>::NoneValue)?
    }
    Some(old) => {
      let new = old.checked_add(1).ok_or(
        {
          print(Error::<T>::StorageOverflow);
          Error::<T>::StorageOverflow
        })?;
      Something::put(new);
      Ok(())
    },
  }
}
```

Run the node binary with the RUST_LOG environment variable to print the values.

```sh
RUST_LOG=runtime=debug ./target/release/node-template --dev
```

The values are printed in the terminal or the standard output every time that the runtime function
gets called.

```rust
2020-01-01 tokio-blocking-driver DEBUG runtime  My Test Message  <-- str implements Printable by default
2020-01-01 tokio-blocking-driver DEBUG runtime  Invalid Value    <-- the custom string from NoneValue
2020-01-01 tokio-blocking-driver DEBUG runtime  DispatchError
2020-01-01 tokio-blocking-driver DEBUG runtime  8
2020-01-01 tokio-blocking-driver DEBUG runtime  0                <-- index value from the Error enum definition
2020-01-01 tokio-blocking-driver DEBUG runtime  NoneValue        <-- str which holds the name of the ident of the error
```

> IMPORTANT: Adding many print functions to the runtime will produce a bigger binary and wasm blob
> with debug code not needed in production.

## Substrate's Own `print` Function

For legacy use cases, Substrate provides extra tools for `Print` debugging (or tracing). You can use
the [`print` function](https://substrate.dev/rustdocs/latest/sp_runtime/fn.print.html) to log the
status of the runtime execution.

```rust
use sp_runtime::print;

// --snip--
pub fn do_something(origin) -> DispatchResult {
  print("Execute do_something");

  let who = ensure_signed(origin)?;
  let my_val: u32 = 777;

  Something::put(my_val);

  print("After storing my_val");

  Self::deposit_event(RawEvent::SomethingStored(my_val, who));
  Ok(())
}
// --snip--
```

Start the chain using the `RUST_LOG` environment variable to see the print logs.

```sh
RUST_LOG=runtime=debug ./target/release/node-template --dev
```

The values are printed in the terminal or the standard output if the Error gets triggered.

```sh
2020-01-01 00:00:00 tokio-blocking-driver DEBUG runtime  Execute do_something
2020-01-01 00:00:00 tokio-blocking-driver DEBUG runtime  After storing my_val
```

## If Std

The legacy `print` function allows you to print and have an implementation of the `Printable` trait.
However, in some legacy cases you may want to do more than print, or not bother with
Substrate-specific traits just for debugging purposes. The
[`if_std!` macro](https://substrate.dev/rustdocs/latest/sp_std/macro.if_std.html) is useful for this
situation.

One caveat of using this macro is that the code inside will only execute when you are actually
running the native version of the runtime.

```rust
use sp_std::if_std; // Import into scope the if_std! macro.
```

The `println!` statement should be inside of the `if_std` macro.

```rust
decl_module! {

    // --snip--
    pub fn do_something(origin) -> DispatchResult {

      let who = ensure_signed(origin)?;
      let my_val: u32 = 777;

      Something::put(my_val);

      if_std! {
        // This code is only being compiled and executed when the `std` feature is enabled.
        println!("Hello native world!");
        println!("My value is: {:#?}", my_val);
        println!("The caller account is: {:#?}", who);
      }

      Self::deposit_event(RawEvent::SomethingStored(my_val, who));
      Ok(())
    }
    // --snip--
}
```

The values are printed in the terminal or the standard output every time that the runtime function
gets called.

```sh
$   2020-01-01 00:00:00 Substrate Node
    2020-01-01 00:00:00   version x.y.z-x86_64-linux-gnu
    2020-01-01 00:00:00   by Anonymous, 2017, 2020
    2020-01-01 00:00:00 Chain specification: Development
    2020-01-01 00:00:00 Node name: my-node-007
    2020-01-01 00:00:00 Roles: AUTHORITY
    2020-01-01 00:00:00 Imported 999 (0x3d7a…ab6e)
    # --snip--
->    Hello native world!
->    My value is: 777
->    The caller account is: d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d (5GrwvaEF...)
    # --snip--
    2020-01-01 00:00:00 Imported 1000 (0x3d7a…ab6e)

```

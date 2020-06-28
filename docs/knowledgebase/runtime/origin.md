---
title: Runtime Origin
---

The runtime origin is used by dispatchable functions to check where the call came from.

## Raw Origins

Substrate defines three raw origins which can be used in your runtime module:

```rust
pub enum RawOrigin<AccountId> {
	Root,
	Signed(AccountId),
	None,
}
```

- Root: A system level origin. This is the highest privilege level.

- Signed: A transaction origin. This is signed by some public key and includes the account
  identifier of the signer.

- None: A lack of origin. This needs to be agreed upon by the validators or validated by a module to
  be included.

## Custom Origins

You are also able to define custom origins that can be used for authorization checks in your runtime
functions.

More details TODO

## Custom Origin Call

You can construct calls within your runtime with any origin. For example:

```rust
// Root
proposal.dispatch(system::RawOrigin::Root.into())

// Signed
proposal.dispatch(system::RawOrigin::Signed(who).into())

// None
proposal.dispatch(system::RawOrigin::None.into())
```

You can look at the source code of the
[Sudo module](https://substrate.dev/rustdocs/v2.0.0-rc4/pallet_sudo/index.html) for a practical
implementation of this.

## Next Steps

### Learn More

- Learn origin is used in the `decl_module` macro.

- Learn

### Examples

- View the Sudo module to see how it allows a user to call with `Root` and `Signed` origin.

- View the Timestamp module to see how it validates an a call with `None` origin.

- View the Collective module to see how it constructs a custom `Member` origin.

- View our recipe for creating and using a custom origin.

### References

- Visit the reference docs for the
  [`RawOrigin` enum](https://substrate.dev/rustdocs/v2.0.0-rc4/frame_system/enum.RawOrigin.html).

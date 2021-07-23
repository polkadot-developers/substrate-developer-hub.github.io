---
title: Origin
---

The runtime origin is used by dispatchable functions to check where a call has come from.

## Raw Origins

Substrate defines three raw origins which can be used in your runtime module:

```rust
pub enum RawOrigin<AccountId> {
  Root,
  Signed(AccountId),
  None,
}
```

- Root: A system level origin. This is the highest privilege level and can be thought of as the superuser of the runtime origin.

- Signed: A transaction origin. This is signed by some on-chain account's private key and includes the account identifier of the signer. This allows the runtime to authenticate the source of a dispatch and subsequently charge transaction fees to the associated account. 

- None: A lack of origin. This needs to be agreed upon by the validators or validated by a module to
  be included. This origin type is more complex by nature, in that it is designed to bypasses certain runtime mechanisms. One example use case of this origin type would be to allow validators to insert data directly into a block.
  
## Origin Call

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
[Sudo module](https://substrate.dev/rustdocs/latest/pallet_sudo/index.html) for a practical
implementation of this.

## Custom Origins

In addition to the 3 core origin types, runtime developers are also able to define custom origins. These can be used as authorization checks inside functions from specific modules in your runtime, or to define custom access-control logic around the sources of runtime requests.

Customizing origins allows runtime developers to specify valid origins depending on their runtime logic. For example, it may be desirable to restrict access of certain functions to special custom origins and authorize dispatch calls only from members of a [collective](https://github.com/paritytech/substrate/tree/master/frame/collective). The advantage of using custom origins is that it provides runtime developers a way to configure privileged access over dispatch calls to the runtime. 

## Next Steps

### Learn More

- Learn about how origin is used in the `decl_module` macro.

### Examples

- View the [Sudo module](https://github.com/paritytech/substrate/tree/master/frame/sudo) to see how it allows a user to call with `Root` and `Signed` origin.

- View the [Timestamp module](https://github.com/paritytech/substrate/tree/master/frame/timestamp) to see how it validates an a call with `None` origin.

- View the [Collective module](https://github.com/paritytech/substrate/tree/master/frame/collective) to see how it constructs a custom `Member` origin.

- View our recipe for creating and using a custom origin.

### References

- Visit the reference docs for the
  [`RawOrigin` enum](https://substrate.dev/rustdocs/latest/frame_system/enum.RawOrigin.html).

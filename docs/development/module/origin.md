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

* Root: A system level origin, assumed to be of highest possible power.

* Signed: A transaction origin, includes the account identifier of the signer.

* None: A lack of origin, also known as an inherent.

## Custom Origins

You are also able to define custom origins that can be used for authorization checks in your runtime functions.

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

You can look at the source code of the [Sudo module](https://substrate.dev/rustdocs/master/srml_sudo/index.html) for a practical implementation of this.

---
title: Configure the Nicks Pallet
---

Every pallet has a component called `Config` that is used for configuration. This component is a
[Rust "trait"](https://doc.rust-lang.org/book/ch10-02-traits.html); traits in Rust are similar to
interfaces in languages such as C++, Java and Go. FRAME developers must implement this trait for
each pallet they would like to include in a runtime in order to configure that pallet with the
parameters and types that it needs from the outer runtime. For instance, in the template pallet that
is included in the
[Node Template](https://github.com/substrate-developer-hub/substrate-node-template), you will see
the following `Config` configuration trait:

**`pallets/template/src/lib.rs`**

```rust
/// Configure the pallet by specifying the parameters and types on which it depends.
pub trait Config: frame_system::Config {
    /// Because this pallet emits events, it depends on the runtime's definition of an event.
    type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
}
```

As the comment states, we are using the `Event` type of the `Config` configuration trait in order to
allow the template pallet to emit a type of event that is compatible with the outer runtime.
The `Config` configuration trait may also be used to tune parameters that control the resources
required to interact with a pallet or even to limit the resources of the runtime that the pallet may
consume. You will see examples of both such cases below when you implement the `Config` configuration
trait for the Nicks pallet.

To figure out what you need to implement for the Nicks pallet specifically, you can take a look at
the
[`pallet_nicks::Config` documentation](https://substrate.dev/rustdocs/latest/pallet_nicks/trait.Config.html)
or the definition of the trait itself in
[the source code](https://github.com/paritytech/substrate/blob/master/frame/nicks/src/lib.rs) of the
Nicks pallet. We have annotated the source code for `nicks` pallet _from the substrate source_ below with
enhanced comments that expand on those already included in the documentation, so be sure to read this:

**[`substrate/frame/nicks/src/lib.rs`](https://github.com/paritytech/substrate/blob/master/frame/nicks/src/lib.rs)**

```rust
/// Already in the Nicks pallet included substrate (with enhanced comments):
pub trait Config: frame_system::Config {
    /// The overarching event type.
    type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;

    /// The currency trait.
    type Currency: ReservableCurrency<Self::AccountId>;

    /// Reservation fee.
    #[pallet::constant]
    type ReservationFee: Get<BalanceOf<Self>>;

    /// What to do with slashed funds.
    type Slashed: OnUnbalanced<NegativeImbalanceOf<Self>>;

    /// The origin which may forcibly set or remove a name. Root can always do this.
    type ForceOrigin: EnsureOrigin<Self::Origin>;

    /// The minimum length a name may be.
    #[pallet::constant]
    type MinLength: Get<u32>;

    /// The maximum length a name may be.
    #[pallet::constant]
    type MaxLength: Get<u32>;
}
```

Just like we used the Balances pallet as a template for importing the Nicks pallet, let's use the
Balances pallet as an example to help us understand how we can implement the `Config` interface for the
Nicks pallet. You will notice that this implementation consists of two parts: a `parameter_types!`
block where constant values are defined and an `impl` block where the types and values defined by
the `Config` interface are configured. This code block has also been annotated with additional
comments that you should be sure to read:

**`runtime/src/lib.rs`**

```rust
/// Already in your template for Balances:
parameter_types! {
    // The u128 constant value 500 is aliased to a type named ExistentialDeposit.
    pub const ExistentialDeposit: u128 = 500;
    // A heuristic that is used for weight estimation.
    pub const MaxLocks: u32 = 50;
}

impl pallet_balances::Config for Runtime {
    // The previously defined parameter_type is used as a configuration parameter.
    type MaxLocks = MaxLocks;

    // The "Balance" that appears after the equal sign is an alias for the u128 type.
    type Balance = Balance;

    // The empty value, (), is used to specify a no-op callback function.
    type DustRemoval = ();

    // The previously defined parameter_type is used as a configuration parameter.
    type ExistentialDeposit = ExistentialDeposit;

    // The FRAME runtime system is used to track the accounts that hold balances.
    type AccountStore = System;

    // Weight information is supplied to the Balances pallet by the Node Template's runtime.
    // type WeightInfo = (); // old way
    type WeightInfo = pallet_balances::weights::SubstrateWeight<Runtime>;

    // The ubiquitous event type.
    type Event = Event;
}
```

The `impl pallet_balances::Config` block allows runtime developers that are including the Balances pallet in
their runtime to configure the types and parameters that are specified by the Balances pallet
`Config` configuration trait. For example, the `impl` block above configures the Balances pallet to
use the `u128` type to track balances. If you were developing a chain where it was important to
optimize storage, you could use any unsigned integer type that was at least 32-bits in size; this is
because
[the `Balance` type](https://substrate.dev/rustdocs/latest/pallet_balances/pallet/trait.Config.html#associatedtype.Balance)
for the Balances pallet `Config` configuration trait is bound by
[the `AtLeast32BitUnsigned` trait](https://substrate.dev/rustdocs/latest/sp_arithmetic/traits/trait.AtLeast32BitUnsigned.html).

Now that you have an idea of the purpose behind the `Config` configuration trait and how you can
implement a FRAME pallet's `Config` interface for your runtime, let's implement the `Config`
configuration trait for the Nicks pallet. Add the following code to your runtime:

**`runtime/src/lib.rs`**

```rust
/// Add this code block to your template for Nicks:
parameter_types! {
    // Choose a fee that incentivizes desireable behavior.
    pub const NickReservationFee: u128 = 100;
    pub const MinNickLength: usize = 8;
    // Maximum bounds on storage are important to secure your chain.
    pub const MaxNickLength: usize = 32;
}

impl pallet_nicks::Config for Runtime {
    // The Balances pallet implements the ReservableCurrency trait.
    // `Balances` is defined in `construct_runtimes!` macro. See below.
    // https://substrate.dev/rustdocs/latest/pallet_balances/index.html#implementations-2
    type Currency = Balances;

    // Use the NickReservationFee from the parameter_types block.
    type ReservationFee = NickReservationFee;

    // No action is taken when deposits are forfeited.
    type Slashed = ();

    // Configure the FRAME System Root origin as the Nick pallet admin.
    // https://substrate.dev/rustdocs/latest/frame_system/enum.RawOrigin.html#variant.Root
    type ForceOrigin = frame_system::EnsureRoot<AccountId>;

    // Use the MinNickLength from the parameter_types block.
    type MinLength = MinNickLength;

    // Use the MaxNickLength from the parameter_types block.
    type MaxLength = MaxNickLength;

    // The ubiquitous event type.
    type Event = Event;
}
```

### Adding Nicks to the `construct_runtime!` Macro

Next, we need to add the Nicks pallet to the `construct_runtime!` macro. For this, we need to
determine the types that the pallet exposes so that we can tell the runtime that they exist. The
complete list of possible types can be found in the
[`construct_runtime!` macro documentation](https://substrate.dev/rustdocs/latest/frame_support/macro.construct_runtime.html).

If we look at the [Nicks pallet](https://github.com/paritytech/substrate/blob/master/frame/nicks/src/lib.rs) in detail, we know it has:

- Module **Storage**: Because it uses the `decl_storage!` macro.
- Module **Event**s: Because it uses the `decl_event!` macro. You will notice that in the case of
  the Nicks pallet, the `Event` keyword is parameterized with respect to a type, `T`; this is
  because at least one of the events defined by the Nicks pallet depends on a type that is
  configured with the `Config` configuration trait.
- **Call**able Functions: Because it has dispatchable functions in the `decl_module!` macro.
- The **Pallet** type from the `decl_module!` macro.

Thus, when we add the pallet, it will look like this:

**`runtime/src/lib.rs`**

```rust
construct_runtime!(
    pub enum Runtime where
        Block = Block,
        NodeBlock = opaque::Block,
        UncheckedExtrinsic = UncheckedExtrinsic
    {
        /* --snip-- */
        Balances: pallet_balances::{Pallet, Call, Storage, Config<T>, Event<T>},

        /*** Add This Line ***/
        Nicks: pallet_nicks::{Pallet, Call, Storage, Event<T>},
    }
);
```

Note that not all pallets will expose all of these runtime types, and some may expose more! You
should always look at the documentation or source code of a pallet to determine which of these types
you need to expose.

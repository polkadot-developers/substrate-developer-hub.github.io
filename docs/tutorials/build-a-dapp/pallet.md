---
title: Building a Custom Pallet
---

The Substrate runtime is composed of FRAME pallets. You can think of these pallets as individual
pieces of logic that define what your blockchain can do! Substrate provides you with a number of
pre-built pallets for use in FRAME-based runtimes.

![Runtime Composition](assets/tutorials/build-a-dapp/runtime.png)

For example, FRAME includes a [Balances](https://substrate.dev/rustdocs/v2.0.0-rc4/pallet_balances/)
pallet that controls the underlying currency of your blockchain by managing the _balance_ of all the
accounts in your system.

If you want to add smart contract functionality to your blockchain, you simply need to include the
[Contracts](https://substrate.dev/rustdocs/v2.0.0-rc4/pallet_contracts/) pallet.

Even things like on-chain governance can be added to your blockchain by including pallets like
[Democracy](https://substrate.dev/rustdocs/v2.0.0-rc4/pallet_democracy/),
[Elections](https://substrate.dev/rustdocs/v2.0.0-rc4/pallet_elections/), and
[Collective](https://substrate.dev/rustdocs/v2.0.0-rc4/pallet_collective/).

The goal of this tutorial is to teach you how to create your own Substrate pallet to include in your
custom blockchain! The `substrate-node-template` comes with a template pallet that we will build
your custom logic on top of.

## File Structure

We will now modify the `substrate-node-template` to introduce the basic functionality of a Proof Of
Existence pallet.

Open the `substrate-node-template` in your favorite code editor. Then open the file
`pallets/template/src/lib.rs`

```
substrate-node-template
|
+-- runtime
|
+-- pallets
|   |
|   +-- template
|       |
|       +-- Cargo.toml    <-- One change in this file
|       |
|       +-- src
|           |
|           +-- lib.rs     <-- Most changes in this file
|           |
|           +-- mock.rs
|           |
|           +-- tests.rs
|
+-- scripts
|
+-- node
|
+-- ...
```

You will see some pre-written code which acts as a template for a new pallet. You can read over this
file if you like, and then delete the contents since we will start from scratch for full
transparency. When writing your own pallets in the future, you will likely find the scaffolding in
this template pallet useful.

## Build Your New Pallet

At a high level, a Substrate pallet can be broken down into six sections:

```rust
// 1. Imports
use frame_support::{decl_module, decl_storage, decl_event, decl_error, dispatch};
use frame_system::{self as system, ensure_signed};

// 2. Pallet Configuration
pub trait Trait: system::Trait { /* --snip-- */ }

// 3. Pallet Storage Items
decl_storage! { /* --snip-- */ }

// 4. Pallet Events
decl_event! { /* --snip-- */ }

// 5. Pallet Errors
decl_error! { /* --snip-- */ }

// 6. Callable Pallet Functions
decl_module! { /* --snip-- */ }
```

Things like events, storage, and callable functions may look familiar to you if you have done other
blockchain development. We will show you what each of these components look like for a basic Proof
Of Existence pallet.

### Imports and Dependencies

Since imports are pretty boring, you can start by copying this at the top of your empty `lib.rs`
file:

```rust
#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
	decl_module, decl_storage, decl_event, decl_error, ensure, StorageMap
};
use frame_system::{self as system, ensure_signed};
use sp_std::vec::Vec;
```

Most of these imports are already available because they were used in the template pallet whose code
we just deleted. However, `sp_std` is not available and we need to list it as a dependency.

**Add** this block to your `pallets/template/Cargo.toml` file.

```toml
[dependencies.sp-std]
git = 'https://github.com/paritytech/substrate.git'
default-features = false
tag = 'v2.0.0-rc4'
version = '2.0.0-rc4'
```

Then, **Update** the existing `[features]` block to look like this. The last line is new.

```toml
[features]
default = ['std']
std = [
    'codec/std',
    'frame-support/std',
    'frame-system/std',
    'sp-std/std',          <-- This line is new
]
```

### Pallet Configuration

Every pallet has a configuration trait. For now, the only thing we will configure about our pallet
is that it will emit some Events.

```rust
/// The pallet's configuration trait.
pub trait Trait: system::Trait {
    /// The overarching event type.
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}
```

### Pallet Events

After we've configured our pallet to emit events, let's go ahead define which events:

```rust
// This pallet's events.
decl_event! {
    pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
        /// Event emitted when a proof has been claimed.
        ClaimCreated(AccountId, Vec<u8>),
        /// Event emitted when a claim is revoked by the owner.
        ClaimRevoked(AccountId, Vec<u8>),
    }
}
```

Our pallet will only have two events:

1. When a new proof is added to the blockchain.
2. When a proof is removed.

The events can contain some additional data, in this case, each event will also display who
triggered the event (`AccountId`), and the proof data (as `Vec<u8>`) that is being stored or
removed.

## Pallet Errors

The events we defined previously indicate when calls to the pallet have completed successfully.
Similarly, errors indicate when a call has failed, and why it has failed.

```rust
// This pallet's errors.
decl_error! {
	pub enum Error for Module<T: Trait> {
		/// This proof has already been claimed
		ProofAlreadyClaimed,
		/// The proof does not exist, so it cannot be revoked
		NoSuchProof,
		/// The proof is claimed by another account, so caller can't revoke it
		NotProofOwner,
	}
}
```

The first of these errors can occur when attempting to claim a new proof. Of course a user cannot
claim a proof that has already been claimed. The latter two can occur when attempting to revoke a
proof.

### Pallet Storage Items

To add a new proof to the blockchain, we will simply store that proof in our pallet's storage. To
store that value, we will create a [hash map](https://en.wikipedia.org/wiki/Hash_table) from the
proof to the owner of that proof and the block number the proof was made.

```rust
// This pallet's storage items.
decl_storage! {
    trait Store for Module<T: Trait> as TemplateModule {
        /// The storage item for our proofs.
        /// It maps a proof to the user who made the claim and when they made it.
        Proofs: map hasher(blake2_128_concat) Vec<u8> => (T::AccountId, T::BlockNumber);
    }
}
```

If a proof has an owner and a block number, then we know that it has been claimed! Otherwise, the
proof is available to be claimed.

### Callable Pallet Functions

As implied by our pallet events and errors, we will have two "dispatchable functions" the user can
call in this Substrate pallet:

1. `create_claim()`: Allow a user to claim the existence of a file with a proof.
2. `revoke_claim()`: Allow the owner of a claim to revoke their claim.

Here is what the pallet declaration looks like with these these two functions:

```rust
// The pallet's dispatchable functions.
decl_module! {
    /// The module declaration.
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        // Initializing errors
        // this includes information about your errors in the node's metadata.
        // it is needed only if you are using errors in your pallet
        type Error = Error<T>;

        // A default function for depositing events
        fn deposit_event() = default;

        /// Allow a user to claim ownership of an unclaimed proof
        #[weight = 10_000]
        fn create_claim(origin, proof: Vec<u8>) {
            // Verify that the incoming transaction is signed and store who the
            // caller of this function is.
            let sender = ensure_signed(origin)?;

            // Verify that the specified proof has not been claimed yet or error with the message
            ensure!(!Proofs::<T>::contains_key(&proof), Error::<T>::ProofAlreadyClaimed);

            // Call the `system` pallet to get the current block number
            let current_block = <system::Module<T>>::block_number();

            // Store the proof with the sender and the current block number
            Proofs::<T>::insert(&proof, (&sender, current_block));

            // Emit an event that the claim was created
            Self::deposit_event(RawEvent::ClaimCreated(sender, proof));
        }

        /// Allow the owner to revoke their claim
        #[weight = 10_000]
        fn revoke_claim(origin, proof: Vec<u8>) {
            // Determine who is calling the function
            let sender = ensure_signed(origin)?;

            // Verify that the specified proof has been claimed
            ensure!(Proofs::<T>::contains_key(&proof), Error::<T>::NoSuchProof);

            // Get owner of the claim
            let (owner, _) = Proofs::<T>::get(&proof);

            // Verify that sender of the current call is the claim owner
            ensure!(sender == owner, Error::<T>::NotProofOwner);

            // Remove claim from storage
            Proofs::<T>::remove(&proof);

            // Emit an event that the claim was erased
            Self::deposit_event(RawEvent::ClaimRevoked(sender, proof));
        }
    }
}
```

> The functions you see here do not have return types explicitly stated. In reality they all return
> [`DispatchResult`](https://substrate.dev/rustdocs/v2.0.0-rc4/frame_support/dispatch/type.DispatchResult.html)s.
> This return type is added on your behalf by the `decl_module!` macro.

## Compile Your New Pallet

After you've copied all of the parts of this pallet correctly into your `pallets/template/lib.rs`
file, you should be able to recompile your node without warning or error. Run this command in the
root directory of the `substrate-node-template` repository.

```bash
cargo build --release
```

Now you can start your node:

```bash
# Purge chain to clean up your old chain state
# You will be prompted to type `y`
./target/release/node-template purge-chain --dev

# Re-run your node in "development" mode
./target/release/node-template --dev
```

Now it is time to interact with our new Proof of Existence pallet!

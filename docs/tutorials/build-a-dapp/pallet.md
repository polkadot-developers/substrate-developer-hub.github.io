---
title: Building a Custom Pallet
---

The Substrate Developer Hub Node Template, which is used as the starting point for this tutorial,
has a FRAME-based [runtime](https://substrate.dev/docs/en/knowledgebase/runtime/).
[FRAME](https://substrate.dev/docs/en/knowledgebase/runtime/frame) is a library of code that allows
you to build a Substrate runtime by composing modules called "pallets". You can think of these
pallets as individual pieces of logic that define what your blockchain can do! Substrate provides
you with a number of pre-built pallets for use in FRAME-based runtimes.

![Runtime Composition](assets/tutorials/build-a-dapp/frame-runtime.png)

For example, FRAME includes a [Balances](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_balances/)
pallet that controls the underlying currency of your blockchain by managing the _balance_ of all the
accounts in your system.

If you want to add smart contract functionality to your blockchain, you simply need to include the
[Contracts](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_contracts/) pallet.

Even things like on-chain governance can be added to your blockchain by including pallets like
[Democracy](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_democracy/),
[Elections](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_elections/), and
[Collective](https://substrate.dev/rustdocs/v2.0.0-rc6/pallet_collective/).

The goal of this tutorial is to teach you how to create your own FRAME pallet to include in your
custom blockchain! The Substrate Developer Hub Node Template comes with a template pallet that you
will use as a starting point to build custom runtime logic on top of.

## File Structure

Open the Node Template in your favorite code editor, then open the file
`pallets/template/src/lib.rs`

```
substrate-node-template
|
+-- node
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
+-- runtime
|
+-- scripts
|
+-- ...
```

You will see some pre-written code that acts as a template for a new pallet. You can read over this
file if you'd like, and then delete the contents since we will start from scratch for full
transparency. When writing your own pallets in the future, you will likely find the scaffolding in
this template pallet useful.

## Build Your New Pallet

At a high level, a FRAME pallet can be broken down into six sections:

```rust
// 1. Imports
use frame_support::{decl_module, decl_storage, decl_event, decl_error, dispatch};
use frame_system::ensure_signed;

// 2. Configuration
pub trait Trait: frame_system::Trait { /* --snip-- */ }

// 3. Storage
decl_storage! { /* --snip-- */ }

// 4. Events
decl_event! { /* --snip-- */ }

// 5. Errors
decl_error! { /* --snip-- */ }

// 6. Callable Functions
decl_module! { /* --snip-- */ }
```

Things like events, storage, and callable functions may look familiar to you if you have done other
blockchain development. We will show you what each of these components looks like for a basic Proof
Of Existence pallet.

### Imports and Dependencies

Since imports are pretty boring, you can start by pasting this at the top of your empty `lib.rs`
file:

```rust
#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
	decl_module, decl_storage, decl_event, decl_error, ensure, StorageMap
};
use frame_system::ensure_signed;
use sp_std::vec::Vec;
```

Most of these imports are already available because they were used in the template pallet whose code
we just deleted. However, `sp_std` is not available and we need to list it as a dependency.

**Add** this block to your `pallets/template/Cargo.toml` file.

```toml
[dependencies.sp-std]
git = 'https://github.com/paritytech/substrate.git'
default-features = false
tag = 'v2.0.0-rc6'
version = '2.0.0-rc6'
```

Then, **Update** the existing `[features]` block to look like this. The last line is new. You will
learn more about why this is necessary in the next tutorial, the [Add a Pallet](../add-a-pallet)
tutorial.

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

### Configuration

Every pallet has a `Trait` configuration interface. For now, the only thing we will configure about
our pallet is that it will emit some Events. The `Trait` interface is another topic that will be
covered in greater depth in the next tutorial, the [Add a Pallet](../add-a-pallet) tutorial.

```rust
/// Configure the pallet by specifying the parameters and types on which it depends.
pub trait Trait: frame_system::Trait {
    /// Because this pallet emits events, it depends on the runtime's definition of an event.
    type Event: From<Event<Self>> + Into<<Self as frame_system::Trait>::Event>;
}
```

### Events

After we've configured our pallet to emit events, let's go ahead and define which events:

```rust
// Pallets use events to inform users when important changes are made.
// Event documentation should end with an array that provides descriptive names for parameters.
// https://substrate.dev/docs/en/knowledgebase/runtime/events
decl_event! {
    pub enum Event<T> where AccountId = <T as frame_system::Trait>::AccountId {
        /// Event emitted when a proof has been claimed. [who, claim]
        ClaimCreated(AccountId, Vec<u8>),
        /// Event emitted when a claim is revoked by the owner. [who, claim]
        ClaimRevoked(AccountId, Vec<u8>),
    }
}
```

Our pallet will only emit an event in two circumstances:

1. When a new proof is added to the blockchain.
2. When a proof is removed.

The events can contain some additional data, in this case, each event will also display who
triggered the event (`AccountId`), and the proof data (as `Vec<u8>`) that is being stored or
removed. Note that convention is to include an array with descriptive names for these parameters at
the end of event documentation.

## Errors

The events we defined previously indicate when calls to the pallet have completed successfully.
Similarly, errors indicate when a call has failed, and why it has failed.

```rust
// Errors inform users that something went wrong.
decl_error! {
	pub enum Error for Module<T: Trait> {
		/// The proof has already been claimed.
		ProofAlreadyClaimed,
		/// The proof does not exist, so it cannot be revoked.
		NoSuchProof,
		/// The proof is claimed by another account, so caller can't revoke it.
		NotProofOwner,
	}
}
```

The first of these errors can occur when attempting to claim a new proof. Of course a user cannot
claim a proof that has already been claimed. The latter two can occur when attempting to revoke a
proof.

### Storage

To add a new proof to the blockchain, we will simply store that proof in our pallet's storage. To
store that value, we will create a [hash map](https://en.wikipedia.org/wiki/Hash_table) from the
proof to the owner of that proof and the block number the proof was made.

```rust
// The pallet's runtime storage items.
// https://substrate.dev/docs/en/knowledgebase/runtime/storage
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

### Callable Functions

As implied by our pallet's events and errors, we will have two "dispatchable functions" the user can
call in this FRAME pallet:

1. `create_claim()`: Allow a user to claim the existence of a file with a proof.
2. `revoke_claim()`: Allow the owner of a claim to revoke their claim.

```rust
// Dispatchable functions allows users to interact with the pallet and invoke state changes.
// These functions materialize as "extrinsics", which are often compared to transactions.
// Dispatchable functions must be annotated with a weight and must return a DispatchResult.
decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        // Errors must be initialized if they are used by the pallet.
        type Error = Error<T>;

        // Events must be initialized if they are used by the pallet.
        fn deposit_event() = default;

        /// Allow a user to claim ownership of an unclaimed proof.
        #[weight = 10_000]
        fn create_claim(origin, proof: Vec<u8>) {
            // Check that the extrinsic was signed and get the signer.
            // This function will return an error if the extrinsic is not signed.
            // https://substrate.dev/docs/en/knowledgebase/runtime/origin
            let sender = ensure_signed(origin)?;

            // Verify that the specified proof has not already been claimed.
            ensure!(!Proofs::<T>::contains_key(&proof), Error::<T>::ProofAlreadyClaimed);

            // Get the block number from the FRAME System module.
            let current_block = <frame_system::Module<T>>::block_number();

            // Store the proof with the sender and block number.
            Proofs::<T>::insert(&proof, (&sender, current_block));

            // Emit an event that the claim was created.
            Self::deposit_event(RawEvent::ClaimCreated(sender, proof));
        }

        /// Allow the owner to revoke their claim.
        #[weight = 10_000]
        fn revoke_claim(origin, proof: Vec<u8>) {
            // Check that the extrinsic was signed and get the signer.
            // This function will return an error if the extrinsic is not signed.
            // https://substrate.dev/docs/en/knowledgebase/runtime/origin
            let sender = ensure_signed(origin)?;

            // Verify that the specified proof has been claimed.
            ensure!(Proofs::<T>::contains_key(&proof), Error::<T>::NoSuchProof);

            // Get owner of the claim.
            let (owner, _) = Proofs::<T>::get(&proof);

            // Verify that sender of the current call is the claim owner.
            ensure!(sender == owner, Error::<T>::NotProofOwner);

            // Remove claim from storage.
            Proofs::<T>::remove(&proof);

            // Emit an event that the claim was erased.
            Self::deposit_event(RawEvent::ClaimRevoked(sender, proof));
        }
    }
}
```

> The functions you see here do not have return types explicitly stated. In reality they all return
> [`DispatchResult`](https://substrate.dev/rustdocs/v2.0.0-rc6/frame_support/dispatch/type.DispatchResult.html)s.
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
# Clean up any old data from running a development node in the past
# You will be prompted to type `y`
./target/release/node-template purge-chain --dev

# Run the node in development mode
./target/release/node-template --dev
```

Now it is time to interact with our new Proof of Existence pallet!

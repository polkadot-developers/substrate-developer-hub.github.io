---
title: Building a Custom Runtime Module
---

We will now modify the Substrate Node Template to introduce the basic functionality of a Proof Of Existence blockchain.

Open the `substrate-node-template` folder of the Substrate Package in your favorite code editor. Then open the file at `runtime/src/template.rs`

You will see some pre-written code which acts as a template for an embedded Substrate Runtime Module. You can delete the contents of this file since we will start from scratch for full transparency.

At a high level, the a Substrate Runtime Module can be broken down into 5 sections:

```rust
// 1. Imports
use support::{decl_module, decl_storage, decl_event,...};

// 2. Module Configuration
pub trait Trait: system::Trait {...}

// 3. Module Events
decl_event! {...}

// 4. Module Storage Items
decl_storage! {...}

// 5. Callable Module Functions
decl_module! {...}
```

Things like events, storage, and callable functions should look familiar to you if you have done other blockchain development. We will show you what each of these components look like for a basic Proof Of Existence blockchain.

## Imports

Since imports are pretty boring, you can start by copying this at the top of your empty `template.rs` file:

```rust 
use support::{decl_module, decl_storage, decl_event, ensure, StorageMap};
use rstd::vec::Vec;
use system::ensure_signed;
```

## Module Configuration

For now, the only thing we will configure about our module is that it will emit some Events.

```rust 
/// The module's configuration trait.
pub trait Trait: system::Trait {
    /// The overarching event type.
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}
```

Will come back to this configuration trait later in the tutorial when we continue to iterate on the Proof Of Existence design.

## Module Events

Since we configured our module to emit events, let's go ahead and define that!

```rust
// This module's events.
decl_event!(
    pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
        // Event emitted when a proof has been stored into chain storage
        ProofStored(AccountId, Vec<u8>),
        // Event emitted when a proof has been erased from chain storage
        ProofErased(AccountId, Vec<u8>),
    }
);
```

Our module will only have two events:
1. When a new proof is added to the blockchain.
2. When a proof is removed.

The events can contain some metadata, in this case, each event will also display who triggered the event (`AccountId`), and the proof data (`Vec<u8>`) that is being stored or removed.

## Module Storage Items

To add a new proof to the blockchain, we will simply store that proof in our module's storage. To store that value, we will create a [hash map](https://en.wikipedia.org/wiki/Hash_table) from the proof to the owner of that proof.

```rust
// This module's storage items.
decl_storage! {
	trait Store for Module<T: Trait> as PoeStorage {
        // Define a 'Proofs' storage item for a map with
        // the proof digest as the key, and associated AccountId as value.
        // The 'get(proofs)' is the default getter.
		Proofs get(proofs): map Vec<u8> => T::AccountId;
	}
}
```

If a proof has an owner, then we know that it has been claimed! Otherwise, the proof is still available to be claimed.

## Callable Module Functions

As implied by our Module Events, we will have two functions the user can call in this Substrate Runtime Module:

1. `store_proof()`: Allow a user to claim an unclaimed proof.
2. `erase_proof()`: Allow the owner of a proof to erase their claim.

Here is what that implementation looks like:

```rust
// The module's dispatchable functions.
decl_module! {
    /// The module declaration.
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        // A default function for depositing events
        fn deposit_event() = default;

        // Allow a user to store an unclaimed proof
        fn store_proof(origin, digest: Vec<u8>) {
            // Verify that the incoming transaction is signed
            let sender = ensure_signed(origin)?;

            // Verify that the specified proof has not been claimed yet
            ensure!(!Proofs::<T>::exists(&digest), "This proof has already been claimed");

            // Store the proof and the claim owner
            Proofs::<T>::insert(&digest, sender.clone());

            // Emit an event that the claim was stored
            Self::deposit_event(RawEvent::ProofStored(sender, digest));
        }

        // Allow the owner of a proof to erase their claim
        fn erase_proof(origin, digest: Vec<u8>) {
            // Determine who is calling the function
            let sender = ensure_signed(origin)?;

            // Verify that the specified proof has been claimed
            ensure!(Proofs::<T>::exists(&digest), "This proof has not been stored yet");

            // Get owner of the claim
            let owner = Self::proofs(&digest);

            // Verify that sender of the current call is the claim owner
            ensure!(sender == owner, "You must own this proof to erase it");

            // Remove claim from storage
            Proofs::<T>::remove(&digest);

            // Emit an event that the claim was erased
            Self::deposit_event(RawEvent::ProofErased(sender, digest));
        }
    }
}
```

There is some funny Rust syntax in here like `<T>`, `&`, `?`, etc... For the purposes of this tutorial, we will not go into these details, but the individual parts of the function should make sense, especially with the code comments.

## Compile Your New Module

If you were able to copy all of the parts of this module correctly into your `template.rs` file, you should be able to recompile your node successfully!

```bash
cargo build --release
```

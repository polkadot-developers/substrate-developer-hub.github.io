---
title: Building a Custom Pallet
id: version-pre-2.0-build
original_id: build
---

We will now modify the `substrate-node-template` to introduce the basic functionality of a Proof Of
Existence pallet.

Open the `substrate-node-template` in your favorite code editor. Then open the file
`runtime/src/template.rs`

```
substrate-node-template
|
+-- runtime
|   |
|   +-- Cargo.toml
|   |
|   +-- build.rs
|   |
|   +-- src
|       |
|       +-- lib.rs
|       |
|       +-- template.rs  <-- Edit this file
|
+-- scripts
|
+-- src
|
+-- ...
```

You will see some pre-written code which acts as a template for a new pallet. You can delete the
contents of this file since we will start from scratch for full transparency.

## Build Your New Pallet

At a high level, a Substrate pallet can be broken down into five sections:

```rust
// 1. Imports
use frame_support::{decl_module, decl_storage, decl_event, dispatch};
use system::ensure_signed;

// 2. Pallet Configuration
pub trait Trait: system::Trait { /* --snip-- */ }

// 3. Pallet Events
decl_event! { /* --snip-- */ }

// 4. Pallet Storage Items
decl_storage! { /* --snip-- */ }

// 5. Callable Pallet Functions
decl_module! { /* --snip-- */ }
```

Things like events, storage, and callable functions should look familiar to you if you have done
other blockchain development. We will show you what each of these components look like for a basic
Proof Of Existence pallet.

### Imports

Since imports are pretty boring, you can start by copying this at the top of your empty
`template.rs` file:

```rust 
use frame_support::{decl_module, decl_storage, decl_event, dispatch, ensure, StorageMap};
use system::ensure_signed;
use sp_std::vec::Vec;
```

### Pallet Configuration

For now, the only thing we will configure about our pallet is that it will emit some Events.

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

The events can contain some metadata, in this case, each event will also display who triggered the
event (`AccountId`), and the proof data (as `Vec<u8>`) that is being stored or removed.

### Pallet Storage Items

To add a new proof to the blockchain, we will simply store that proof in our pallet's storage. To
store that value, we will create a [hash map](https://en.wikipedia.org/wiki/Hash_table) from the
proof to the owner of that proof and the block number the proof was made.

```rust
// This pallet's storage items.
decl_storage! {
    trait Store for Module<T: Trait> as PoeStorage {
        /// The storage item for our proofs.
        /// It maps a proof to the user who made the claim and when they made it.
        Proofs: map Vec<u8> => (T::AccountId, T::BlockNumber);
    }
}
```

If a proof has an owner and a block number, then we know that it has been claimed! Otherwise, the
proof is still available to be claimed.

### Callable Pallet Functions

As implied by our pallet events, we will have two functions the user can call in this Substrate
pallet:

1. `create_claim()`: Allow a user to claim the existence of a file with a proof.
2. `revoke_claim()`: Allow the owner of a claim to revoke their claim.

Here are what the pallet declaration looks like with these these two functions:

```rust
// The pallet's dispatchable functions.
decl_module! {
    /// The module declaration.
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        // A default function for depositing events
        fn deposit_event() = default;

        /// Allow a user to claim ownership of an unclaimed proof
        fn create_claim(origin, proof: Vec<u8>) -> dispatch::Result {
            // Verify that the incoming transaction is signed and store who the
            // caller of this function is.
            let sender = ensure_signed(origin)?;

            // Verify that the specified proof has not been claimed yet or error with the message
            ensure!(!Proofs::<T>::exists(&proof), "This proof has already been claimed.");

            // Call the `system` pallet to get the current block number
            let current_block = <system::Module<T>>::block_number();

            // Store the proof with the sender and the current block number
            Proofs::<T>::insert(&proof, (sender.clone(), current_block));

            // Emit an event that the claim was created
            Self::deposit_event(RawEvent::ClaimCreated(sender, proof));
            Ok(())
        }

        /// Allow the owner to revoke their claim
        fn revoke_claim(origin, proof: Vec<u8>) -> dispatch::Result {
            // Determine who is calling the function
            let sender = ensure_signed(origin)?;

            // Verify that the specified proof has been claimed
            ensure!(Proofs::<T>::exists(&proof), "This proof has not been stored yet.");

            // Get owner of the claim
            let (owner, _) = Proofs::<T>::get(&proof);

            // Verify that sender of the current call is the claim owner
            ensure!(sender == owner, "You must own this claim to revoke it.");

            // Remove claim from storage
            Proofs::<T>::remove(&proof);

            // Emit an event that the claim was erased
            Self::deposit_event(RawEvent::ClaimRevoked(sender, proof));
            Ok(())
        }
    }
}
```

## Compile Your New Pallet

After you've copied all of the parts of this pallet correctly into your `template.rs` file, you
should be able to recompile your node without warning or error:

```bash
cargo build --release
```

Now you can restart your node:

```bash
# Purge chain to clean up your old chain state
# You will be prompted to type `y`
./target/release/node-template purge-chain --dev
# Re-run your node in "developer" mode
./target/release/node-template --dev
```

Now it is it time to interact with our new Proof of Existence pallet!

---
title: Building a Custom Runtime Module
---

We will now modify the `substrate-node-template` to introduce the basic
functionality of a Proof Of Existence module.

Open the `substrate-node-template` in your favorite code editor. Then open the
file `runtime/src/template.rs`

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

You will see some pre-written code which acts as a template for a new runtime
module. You can delete the contents of this file since we will start from
scratch for full transparency.

## Build Your New Module

At a high level, a Substrate Runtime Module can be broken down into five
sections:

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

Things like events, storage, and callable functions should look familiar to you
if you have done other blockchain development. We will show you what each of
these components look like for a basic Proof Of Existence module.

### Imports

Since imports are pretty boring, you can start by copying this at the top of
your empty `template.rs` file:

```rust 
use support::{decl_module, decl_storage, decl_event, ensure, StorageMap};
use rstd::vec::Vec;
use system::ensure_signed;
```

### Module Configuration

For now, the only thing we will configure about our module is that it will emit
some Events.

```rust 
/// The module's configuration trait.
pub trait Trait: system::Trait {
    /// The overarching event type.
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}
```

### Module Events

After we've configured our module to emit events, let's go ahead define which events:

```rust
// This module's events.
decl_event! {
    pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
        /// Event emitted when a proof has been claimed.
        ClaimCreated(AccountId, Vec<u8>),
        /// Event emitted when a claim is revoked by the owner.
        ClaimRevoked(AccountId, Vec<u8>),
    }
}
```

Our module will only have two events:
1. When a new proof is added to the blockchain.
2. When a proof is removed.

The events can contain some metadata, in this case, each event will also display
who triggered the event (`AccountId`), and the proof data (as `Vec<u8>`) that is
being stored or removed.

### Module Storage Items

To add a new proof to the blockchain, we will simply store that proof in our
module's storage. To store that value, we will create a [hash
map](https://en.wikipedia.org/wiki/Hash_table) from the proof to the owner of
that proof and the block number the proof was made.

```rust
// This module's storage items.
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

### Callable Module Functions

As implied by our module events, we will have two functions the user can call in
this Substrate Runtime Module:

1. `create_claim()`: Allow a user to claim the existence of a file with a proof.
2. `revoke_claim()`: Allow the owner of a claim to revoke their claim.

Here are what the module declaration looks like with these these two functions:

```rust
// The module's dispatchable functions.
decl_module! {
    /// The module declaration.
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        // A default function for depositing events
        fn deposit_event() = default;

        /// Allow a user to claim ownership of an unclaimed proof
        fn create_claim(origin, proof: Vec<u8>) {
            // Verify that the incoming transaction is signed and store who the
            // caller of this function is.
            let sender = ensure_signed(origin)?;

            // Verify that the specified proof has not been claimed yet
            ensure!(!Proofs::<T>::exists(&proof), "This proof has already been claimed.");

            // Call another Substrate runtime module to get the current block number
            let current_block = <system::Module<T>>::block_number();

            // Store the proof with the sender and the current block number
            Proofs::<T>::insert(&proof, (sender.clone(), current_block));

            // Emit an event that the claim was created
            Self::deposit_event(RawEvent::ClaimCreated(sender, proof));
        }

        // Allow the owner of a claim to revoke their claim
        fn revoke_claim(origin, proof: Vec<u8>) {
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
        }
    }
}
```

## Compile Your New Module

If you were able to copy all of the parts of this module correctly into your
`template.rs` file, you should be able to recompile your node without warning or
error:

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

Now it is it time to interact with our new Proof of Existence module!

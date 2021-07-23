---
title: Building a Custom Pallet
---

The Substrate Developer Hub Node Template, which is used as the starting point for this tutorial,
has a FRAME-based [runtime](https://substrate.dev/docs/en/knowledgebase/runtime/).
[FRAME](https://substrate.dev/docs/en/knowledgebase/runtime/frame) is a library of code that allows
you to build a Substrate runtime by composing modules called "pallets". You can think of these
pallets as individual pieces of logic that define what your blockchain can do! Substrate provides
you with a number of pre-built pallets for use in FRAME-based runtimes.

![Runtime Composition](assets/frame-runtime.png)

To give some examples, FRAME includes:
- a [Balances](https://substrate.dev/rustdocs/latest/pallet_balances/)
pallet that controls the underlying currency of your blockchain by managing the _balances_ of all the
accounts in your system.
- a [Contracts](https://substrate.dev/rustdocs/latest/pallet_contracts/) pallet, designed to add smart contract functionality to your blockchain.
- pallets for on-chain governance capabilities such as [Democracy](https://substrate.dev/rustdocs/latest/pallet_democracy/),
[Elections](https://substrate.dev/rustdocs/latest/pallet_elections/), and
[Collective](https://substrate.dev/rustdocs/latest/pallet_collective/).

The goal of this tutorial is to teach you how to create your own FRAME pallet to include in your
custom blockchain. The Substrate Developer Hub Node Template comes with a template pallet that we
will use as a starting point to build our own custom runtime logic.

## Substrate Blockchain File Structure

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
|       +-- Cargo.toml     <-- *Modify* this file
|       |
|       +-- src
|           |
|           +-- lib.rs     <-- *Remove* contents
|           |
|           +-- mock.rs    <-- *Remove* (optionally modify)
|           |
|           +-- tests.rs   <-- *Remove* (optionally modify)
|
+-- runtime
|
+-- scripts
|
+-- ...
```

You will see some pre-written code that acts as a template for a new pallet.
When writing your own pallets in the future, you will likely find the scaffolding
in this template pallet useful. But for the purposes of really learning how a pallet
is constructed, **delete all contents of this file**.

> The following sections will start _from scratch_ and assumes that you have cleared the
> existing `pallet/template/src/lib.rs` file.

## Write a Pallet from Scratch

### 1. Pallet Scaffolding

Have a look at [the skeleton of a FRAME pallet](/docs/en/knowledgebase/runtime/pallets#frame-v2) from the knowledgebase to learn more about the basic structure of a FRAME pallet.
This tutorial is using the latest version of FRAME so be sure to refer to that. We can start by scaffolding our pallet using the following code:

**`pallet/template/src/lib.rs`**

```rust
#![cfg_attr(not(feature = "std"), no_std)]

// Re-export pallet items so that they can be accessed from the crate namespace.
pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
	use frame_support::{dispatch::DispatchResultWithPostInfo, pallet_prelude::*};
	use frame_system::pallet_prelude::*;
	use sp_std::vec::Vec; // Step 3.1 will include this in `Cargo.toml`

    #[pallet::config]  // <-- Step 2. code block will replace this.

    #[pallet::event]   // <-- Step 3. code block will replace this.
	
    #[pallet::error]   // <-- Step 4. code block will replace this.
    
    #[pallet::pallet]
    #[pallet::generate_store(pub(super) trait Store)]
    pub struct Pallet<T>(_);
    
    #[pallet::storage] // <-- Step 5. code block will replace this.
    
    #[pallet::hooks]
    impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {}
    
    #[pallet::call]   // <-- Step 6. code block will replace this.
}
```
By doing this, we've declared the dependencies and [macros](/docs/en/knowledgebase/runtime/macros) our pallet will require to function.

Things like _events_, _storage_, and _callable functions_ may look familiar to you if you have done other
blockchain development. We will show you what each of these components looks like for a basic Proof
Of Existence pallet by providing you with the code blocks that go under each section.

> **Critical**: the `no_std` feature is **required** for all pallets! This is because we are building a
> _runtime_ module that _must_ compile to WASM, and therefore cannot depend on rust's `std`
> dependencies.
> If you take a look at the `pallets/template/Cargo.toml` file, you will see that the template already has `std` default feature disabled which is necessary in order to compile the runtime to WASM. Learn more about why this is
> necessary in the [Add a Pallet](../add-a-pallet) tutorial.
>
> You _can_ use `std` features in non-runtime components like `mock.rs` and `tests.rs` using
> `[dev-dependencies]` _ONLY_. Specifics and examples of this are outside the scope of this
> tutorial. Learn more about [testing in Substrate here](../../knowledgebase/runtime/tests).

### 2. Pallet Configuration Trait

Every pallet has a component called `Config` that is used for configuration. This component is a
[Rust "trait"](https://doc.rust-lang.org/book/ch10-02-traits.html): traits in Rust are similar to
interfaces in languages such as C++, Java and Go. For now, the only thing we will configure about
our pallet is that it will emit some Events. The `Config` interface is another topic that will be
covered in greater depth in the [Add a Pallet](../add-a-pallet) tutorial. To define the pallet's
`Config` trait, replace the `#[pallet::config]` line with this block:

**`pallet/template/src/lib.rs`**

```rust
	/// Configure the pallet by specifying the parameters and types on which it depends.
    #[pallet::config]
	pub trait Config: frame_system::Config {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
	}
```

### 3. Pallet Events

Now that we've configured our pallet to emit events, let's go ahead and define those events.
Our pallet will only emit an event in two circumstances:

1. When a new proof is added to the blockchain.
2. When a proof is removed.

The events can contain some additional data, in this case, each event will also display who
triggered the event (`AccountId`), and the proof data (as `Vec<u8>`) that is being stored or
removed. Note that convention is to include an array with descriptive names for these parameters at
the end of event documentation.

To implement this, replace `#[pallet::event]` with:

**`pallet/template/src/lib.rs`**

```rust
	// Pallets use events to inform users when important changes are made.
	// Event documentation should end with an array that provides descriptive names for parameters.
	// https://substrate.dev/docs/en/knowledgebase/runtime/events
	#[pallet::event]
	#[pallet::metadata(T::AccountId = "AccountId")]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// Event emitted when a proof has been claimed. [who, claim]
		ClaimCreated(T::AccountId, Vec<u8>),
    /// Event emitted when a claim is revoked by the owner. [who, claim]
		ClaimRevoked(T::AccountId, Vec<u8>),
	}
```

#### 3.1 Include `sp-std` Library

Notice here that we are using the `Vec<u8>` type, which is _normally_ included in the `std` Rust library. We _cannot_ use `std`!
So instead, we have included `use sp_std::vec::Vec;` in our `mod pallet`.
The [sp-std crate](https://substrate.dev/rustdocs/latest/sp_std/index.html) includes many common
things that we desire from `std`, but are `no_std` compatible. To use this though, we _must_
update our pallet's dependencies:

**`pallet/template/Cargo.toml`**

```toml
# add `sp-std` in the dependencies section of the toml file

[dependencies]
# -- snip -- 
sp-std = { default-features = false, version = '3.0.0' }
# -- snip --
```  

### 4. Pallet Errors

The events we defined previously indicate when calls to the pallet have completed successfully.
Similarly, errors indicate when a call has failed, and why it has failed.

The first of these errors can occur when attempting to claim a new proof. Of course a user cannot
claim a proof that has already been claimed. The latter two can occur when attempting to revoke a
proof.

To implement this, replace the `#[pallet::error]` line with:

**`pallet/template/src/lib.rs`**

```rust
    #[pallet::error]
    pub enum Error<T> {
            /// The proof has already been claimed.
            ProofAlreadyClaimed,
            /// The proof does not exist, so it cannot be revoked.
            NoSuchProof,
            /// The proof is claimed by another account, so caller can't revoke it.
            NotProofOwner,
        }
```



### 5. Pallet Storage

To add a new proof to the blockchain, we will simply store that proof in our pallet's storage. To
store that value, we will create a [hash map](https://en.wikipedia.org/wiki/Hash_table) from the
proof to the owner of that proof and the block number the proof was made. We'll be using FRAME's [`StorageMap`](https://substrate.dev/rustdocs/latest/frame_support/storage/types/struct.StorageMap.html) to keep track of this information.

To implement this, replace the `#[pallet::storage]` line with:

**`pallet/template/src/lib.rs`**

```rust
    #[pallet::storage] 
    pub(super) type Proofs<T: Config> = StorageMap<_, Blake2_128Concat, Vec<u8>, (T::AccountId, T::BlockNumber), ValueQuery>;   
```

### 6. Pallet Callable Functions

As implied by our pallet's events and errors, we will have two "dispatchable functions" the user can
call in this FRAME pallet:

1. `create_claim()`: Allow a user to claim the existence of a file with a proof.
2. `revoke_claim()`: Allow the owner of a claim to revoke their claim.

These functions will be based on using the `StorageMap` based on the following logic: if a proof has an owner and a block number, then we know that it has been claimed. Otherwise, the
proof is available to be claimed (and written to storage).

To implement this, replace the `#[pallet::call]` line with:

**`pallet/template/src/lib.rs`**

```rust
    // Dispatchable functions allows users to interact with the pallet and invoke state changes.
    // These functions materialize as "extrinsics", which are often compared to transactions.
    // Dispatchable functions must be annotated with a weight and must return a DispatchResult.
        #[pallet::call]
        impl<T: Config> Pallet<T> {
            #[pallet::weight(1_000)]
            pub(super) fn create_claim(
                origin: OriginFor<T>,
                proof: Vec<u8>,
            ) -> DispatchResultWithPostInfo {

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
                Self::deposit_event(Event::ClaimCreated(sender, proof));

                Ok(().into())
            }

            #[pallet::weight(10_000)]
            fn revoke_claim(
                origin: OriginFor<T>,
                proof: Vec<u8>,
            ) -> DispatchResultWithPostInfo {
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
                Self::deposit_event(Event::ClaimRevoked(sender, proof));

                Ok(().into())
            }
        }
```

## Build Your New Pallet

After you've copied all of the parts of this pallet correctly into your `pallets/template/lib.rs`
file, you should be able to recompile your node without warning or error. Run this command in the
root directory of the `substrate-node-template` repository to build and run the node:

```bash
# Compile your node
cargo build --release
# Launch your chain in dev mode
./target/release/node-template --dev --tmp
```

If everything worked out properly, your node should be producing blocks.
And now it is time to interact with our new Proof of Existence pallet!

> Stuck? There is a full node template
> [solution](https://github.com/substrate-developer-hub/substrate-node-template/tree/tutorials/solutions/build-a-dapp-v3+1)
> to use as a reference. Check the commit diff from the base `v3.0.0+1` template for the exact changes.

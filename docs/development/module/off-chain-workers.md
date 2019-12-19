---
title: Off-Chain Workers
---

You can learn about the high level concepts of off-chain workers in our [Conceptual Guide](conceptual/core/off-chain-workers.md).

## Enable Off-Chain Workers

Your runtime module should include these following modules

**runtime/src/my_runtime.rs**

```rust
use support::debug; //For easier debug printout
use system::offchain;
use sp_runtime::transaction_validity::{
  TransactionValidity, TransactionLongevity, ValidTransaction, InvalidTransaction
};
```

Your runtime trait should have the following type for signed and unsigned transactions

**runtime/src/my_runtime.rs**

```rust
pub trait Trait: timestamp::Trait + system::Trait {
  type SubmitSignedTransaction: offchain::SubmitSignedTransaction<Self, <Self as Trait>::Call>;
  type SubmitUnsignedTransaction: offchain::SubmitUnsignedTransaction<Self, <Self as Trait>::Call>;
}
```

Now, inside your `decl_module!` dispatch functions section, you can define the following function and this serves as the entry point of off-chain worker after every block import.

**runtime/src/my_runtime.rs**

```rust
fn offchain_worker(block: T::BlockNumber) {
  debug::info!("Hello World.");
}
```

To support this package, you need to implement in your library module,

**runtime/src/lib.rs**

```
/// We need to define the Transaction signer for that using the Key definition
type SubmitPFTransaction = system::offchain::TransactionSubmitter<
  runtime::crypto::Public, Runtime, UncheckedExtrinsic>;

impl runtime::Trait for Runtime {
  type Event = Event;
  type Call = Call;

  // To use signed transaction
  type SubmitSignedTransaction = SubmitPFTransaction;

  // To use unsigned transaction
  type SubmitUnsignedTransaction = SubmitPFTransaction;
}
```

Then you need to implement the `CreateTransaction` trait for the runtime

**runtime/src/lib.rs**

```
use sp_runtime::transaction_validity;

// ...
// ...

impl system::offchain::CreateTransaction<Runtime, UncheckedExtrinsic> for Runtime {
  type Public = <Signature as Verify>::Signer;
  type Signature = Signature;

  fn create_transaction<TSigner: system::offchain::Signer<Self::Public, Self::Signature>> (
    call: Call,
    public: Self::Public,
    account: AccountId,
    index: Index,
  ) -> Option<(Call, <UncheckedExtrinsic as sp_runtime::traits::Extrinsic>::SignaturePayload)> {
    let period = 1 << 8;
    let current_block = System::block_number().saturated_into::<u64>();
    let tip = 0;
    let extra: SignedExtra = (
      system::CheckVersion::<Runtime>::new(),
      system::CheckGenesis::<Runtime>::new(),
      system::CheckEra::<Runtime>::from(generic::Era::mortal(period, current_block)),
      system::CheckNonce::<Runtime>::from(index),
      system::CheckWeight::<Runtime>::new(),
      transaction_payment::ChargeTransactionPayment::<Runtime>::from(tip),
    );
    let raw_payload = SignedPayload::new(call, extra).ok()?;
    let signature = TSigner::sign(public, &raw_payload)?;
    let address = Indices::unlookup(account);
    let (call, extra, _) = raw_payload.deconstruct();
    Some((call, (address, signature, extra)))
  }
}
```

Inside the `contruct_runtime!` macro where you put all various packages as your runtime enum, add an additional parameter if you are using unsigned transactions in off-chain workers.

**runtime/src/lib.rs**

```
construct_runtime!(
  pub enum Runtime where
    Block = Block,
    NodeBlock = opaque::Block,
    UncheckedExtrinsic = UncheckedExtrinsic
  {
    // ...
    // For using unsigned transactions
    MyModule: my_runtime::{ Module, Call, Storage, Event<T>, transaction_validity::ValidateUnsigned }

    // For just using signed transactions, it can just well be:
    // MyModule: my_runtime::{ Module, Call, Storage, Event<T> }
  }
);
```

- inserting developer keys in service.rs

- signed transactions

- unsigned transactions

  - parameters must be unique or else ignored in next block generation

- using local storage

- writing test for off-chain workers

- signing with session key


Next Step

- example
  - tomasz workshop
  - offchain price-fetch

reference

- imonline module

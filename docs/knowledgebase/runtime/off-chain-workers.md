---
title: Off-Chain Workers
---

This article covers the technical aspects of using off-chain workers in a Substrate runtime. For a
conceptual overview of off-chain workers see the
[Conceptual Guide](../learn-substrate/off-chain-workers).

## Using Off-Chain Workers in the Runtime

You can create logic for an off-chain worker by putting it in its own pallet. We will call this
pallet `my_offchain_worker` for this example. It belongs in your runtime, so
`runtime/src/my_offchain_worker.rs`.

First, include the following modules:

```rust
// For better debugging (printout) support
use support::{ debug, dispatch };
use system::offchain;
use sp_runtime::transaction_validity::{
  TransactionValidity, TransactionLongevity, ValidTransaction, InvalidTransaction
};
```

Include the following associated types in your pallet's configuration trait for sending signed and
unsigned transactions from an off-chain worker.

```rust
pub trait Trait: timestamp::Trait + system::Trait {
  /// The overarching event type.
  type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
  type Call: From<Call<Self>>;

  type SubmitSignedTransaction: offchain::SubmitSignedTransaction<Self, <Self as Trait>::Call>;
  type SubmitUnsignedTransaction: offchain::SubmitUnsignedTransaction<Self, <Self as Trait>::Call>;
}
```

Inside the `decl_module!` block, define the `offchain_worker` function. This function serves as the
entry point of the off-chain worker and runs after every block import.

```rust
decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {

    // --snip--

    fn offchain_worker(block: T::BlockNumber) {
      debug::info!("Hello World.");
    }
  }
}
```

By default, the off-chain worker doesn't have direct access to user keys (even in the development
environment), but can only access app-specific subkeys for security reasons. You need to define the
`KeyTypeId` at the top of your runtime that is used to group your app-specific subkeys as follows:

```rust
// The key type ID can be any 4-character string
pub const KEY_TYPE: KeyTypeId = KeyTypeId(*b"abcd");

// --snip--

pub mod crypto {
  pub use super::KEY_TYPE;
  use sp_runtime::app_crypto::{app_crypto, sr25519};
  app_crypto!(sr25519, KEY_TYPE);
}
```

As with any other pallet, your runtime must implement the pallet's configuration trait. Go to your
runtime's `lib.rs` at `runtime/src/lib.rs`.

```rust
// Define the transaction signer using the key definition
type SubmitTransaction = system::offchain::TransactionSubmitter<
  offchain_pallet::crypto::Public, Runtime, UncheckedExtrinsic>;

impl offchain_pallet::Trait for Runtime {
  type Event = Event;
  type Call = Call;

  // To use signed transactions in your runtime
  type SubmitSignedTransaction = SubmitTransaction;

  // To use unsigned transactions in your runtime
  type SubmitUnsignedTransaction = SubmitTransaction;
}
```

Then implement the `system::offchain::CreateTransaction` trait for the runtime. Still in your
`lib.rs`:

```rust
use sp_runtime::transaction_validity;

// --snip--

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

Inside the `contruct_runtime!` macro where you put all the various pallets as part of your runtime,
add the additional parameter `ValidateUnsigned` if you are using unsigned transactions in off-chain
workers. You will need to write custom [validation logic](../learn-substrate/extrinsics) for this.

```rust
construct_runtime!(
  pub enum Runtime where
    Block = Block,
    NodeBlock = opaque::Block,
    UncheckedExtrinsic = UncheckedExtrinsic
  {
    // --snip--

    // To use unsigned transactions
    OffchainPallet: offchain_pallet::{ Module, Call, Storage, Event<T>, transaction_validity::ValidateUnsigned }

    // If you are only using signed transactions, it can just be:
    // OffchainPallet: offchain_pallet::{ Module, Call, Storage, Event<T> }
  }
);
```

## Insert Keys in `service.rs`

We have specified a local keystore with `KeyTypeId` to store app-specific keys that are accessible
by the off-chain worker for signing transactions. You will need to add keys in one of the following
two ways.

### Option 1 (Development): Add the First User Key as App Subkey

In a development environment, you can add the first user's key as the app sub-key. Update the
`node/src/service.rs` as follows.

```rust
pub fn new_full<C: Send + Default + 'static>(config: Configuration<C, GenesisConfig>)
  -> Result<impl AbstractService, ServiceError>
{
  // --snip--

  // This clones the key for Alice.
  let dev_seed = config.dev_key_seed.clone();

  // --snip--

  let service = builder.with_network_protocol(|_| Ok(NodeProtocol::new()))?
    .with_finality_proof_provider(|client, backend|
      Ok(Arc::new(GrandpaFinalityProofProvider::new(backend, client)) as _)
    )?
    .build()?;

  // Add the following section to add the key to the keystore.
  if let Some(seed) = dev_seed {
    service
      .keystore()
      .write()
      .insert_ephemeral_from_seed_by_type::<runtime::offchain_pallet::crypto::Pair>(
        &seed,
        runtime::offchain_pallet::KEY_TYPE,
      )
      .expect("Dev Seed should always succeed.");
  }
}
```

Then you will be able to sign transactions. This is good for **development only**.

### Option 2: Add an App Subkey via CLI

In a more realistic setting, after setting up your Substrate node, you can add a new app subkey via
the command line interface as follows.

```bash
# Generate a new account
$ subkey -s generate

# Submit a new key via RPC
$ curl http://localhost:9933 -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"author_insertKey",
    "params": [
      "<YourKeyTypeId>",
      "<YourSeedPhrase>",
      "<YourPublicKey>"
    ]
  }'
```

If you enter the command and parameters correctly, the node will return a JSON response as follows.

```json
{ "jsonrpc": "2.0", "result": null, "id": 1 }
```

A new key is now added in the local keystore.

## Signed Transactions

Now you are ready to to make a signed transaction from the off-chain worker. Go back to your pallet
in `my_offchain_worker.rs`.

```rust
decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    // --snip--

    pub fn onchain_callback(origin, _block: T::BlockNumber, input: Vec<u8>) -> dispatch::Result {
      let who = ensure_signed(origin)?;
      debug::info!("{:?}", core::str::from_utf8(&input).unwrap());
      Ok(())
    }

    fn offchain_worker(block: T::BlockNumber) {
      // Here we specify the function to be called back on-chain in next block import.
      let call = Call::onchain_callback(block, b"hello world!".to_vec());
      T::SubmitSignedTransaction::submit_signed(call);
    }
  }
}
```

After having defined the on-chain callback function, in the off-chain worker you can specify that
function to be called back in the next block import phase. You then submit a signed transaction to
the node.

If you look at the implementation of `fn system::offchain::submit_signed` in the
[Substrate codebase](https://github.com/paritytech/substrate/blob/a98625501be68cc3084e666497c16b111741dded/frame/system/src/offchain.rs#L106-L115),
you will see it is calling the on-chain callback for each key in the local keystore. But since you
only have one key in the local keystore now, you are calling the function only once.

[Learn more about Signed Transactions](../learn-substrate/extrinsics#signed-transactions).

## Unsigned Transactions

With the following code, you are able to send an unsigned transaction back to the chain.

```rust
decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    // --snip--

    pub fn onchain_callback(_origin, _block: T::BlockNumber, input: Vec<u8>) -> dispatch::Result {
      debug::info!("{:?}", core::str::from_utf8(&input).unwrap());
      Ok(())
    }

    fn offchain_worker(block: T::BlockNumber) {
      // Here we specify the function to be called back on-chain in next block import.
      let call = Call::onchain_callback(block, b"hello world!".to_vec());
      T::SubmitUnsignedTransaction::submit_unsigned(call);
    }
  }
}
```

By default, all unsigned transactions are treated as invalid transactions. You need to add the
following code piece in `my_offchain_worker.rs` to explicitly allow submitting unsigned
transactions.

```rust
decl_module! {
  // --snip--
}

impl<T: Trait> Module<T> {
  // --snip--
}

#[allow(deprecated)]
impl<T: Trait> support::unsigned::ValidateUnsigned for Module<T> {
  type Call = Call<T>;

  fn validate_unsigned(call: &Self::Call) -> TransactionValidity {

    match call {
      Call::onchain_callback(block, input) => Ok(ValidTransaction {
        priority: 0,
        requires: vec![],
        provides: vec![(block, input).encode()],
        longevity: TransactionLongevity::max_value(),
        propagate: true,
      }),
      _ => InvalidTransaction::Call.into()
    }
  }
}
```

We add a `deprecated` attribute to prevent warning messages from being displayed. It is because this
part of the API is still in transition and will be updated in coming Substrate release. Please use
this with caution for now.

[Learn more about Unsigned Transactions](../learn-substrate/extrinsics#unsigned-transactions).

## Parameters in On-Chain Callbacks

When making an on-chain callback, our implementation hashes the function name together with all of
its parameter values. The callback will be stored and called during the next block import. If we
find that the hash value exists, meaning a function with the same set of parameters has been called
before, then for signed transactions the function will be replaced if called with a higher priority;
for unsigned transactions this callback is simply ignored.

If your pallet is making on-chain callbacks regularly and you expect it to have a duplicate set of
parameters occassionally, you can always pass in an additional parameter of the current block number
that is passed in from the `offchain_worker` function. This number will only increment and is
guaranteed to be unique.

## Fetching External Data

To fetch external data from third-party APIs, use the `offchain::http` library in
`my_offchain_worker.rs` as follows.

```rust
use sp_runtime::{
  offchain::http,
  transaction_validity::{
    TransactionValidity, TransactionLongevity, ValidTransaction, InvalidTransaction
  }
};

// --snip--

decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    // --snip--
    fn offchain_worker(block: T::BlockNumber) {
      match Self::fetch_data() {
        Ok(res) => debug::info!("Result: {}", core::str::from_utf8(&res).unwrap()),
        Err(e) => debug::error!("Error fetch_data: {}", e),
      };
    }
  }
}

impl<T: Trait> Module<T> {
  fn fetch_data() -> Result<Vec<u8>, &'static str> {

    // Specifying the request
    let pending = http::Request::get("https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD")
      .send()
      .map_err(|_| "Error in sending http GET request")?;

    // Waiting for the response
    let response = pending.wait()
      .map_err(|_| "Error in waiting http response back")?;

    // Check if the HTTP response is okay
    if response.code != 200 {
      debug::warn!("Unexpected status code: {}", response.code);
      return Err("Non-200 status code returned from http request");
    }

    // Collect the result in the form of bytes
    Ok(response.body().collect::<Vec<u8>>())
  }
}
```

You likely need to parse the result in JSON format afterwards. We have
[an example here](https://github.com/jimmychu0807/substrate-offchain-pricefetch/blob/047ad8094dc21e2bced2d055707756265be32e95/node/runtime/src/price_fetch.rs#L250-L260)
using an external library to parse the JSON result in a `no_std` environment.

<!--
[comment]: # (TODO: Signing Transactions with Session Keys)
[comment]: # (TODO: Local Key-Value Database)
[comment]: # (TODO: Writing Tests)
-->

## Next Steps

### Learn More

- [Signed Transactions](../learn-substrate/extrinsics#signed-transactions)
- [Unsigned Transactions](../learn-substrate/extrinsics#unsigned-transactions)

### Examples

- [Off-chain workers Sub0 workshop materials](https://github.com/tomusdrw/sub0-offchain-workshop)
- [Off-chain worker price fetch](https://github.com/jimmychu0807/substrate-offchain-pricefetch)
- (Deprecated)
  [Off-chain worker callback using Substrate v1 API](https://github.com/gnunicorn/substrate-offchain-cb)

### References

- Substrate
  [`im-online` module](https://github.com/paritytech/substrate/blob/master/frame/im-online/src/lib.rs),
  a pallet inside Substrate using off-chain workers to notify other nodes that a validator in the
  network is online.

---
title: Off-Chain Workers
---

You can learn about the high level concepts of off-chain workers in our [Conceptual Guide](conceptual/core/off-chain-workers.md).

## Enable Off-Chain Workers

Your runtime module should include these following modules

**runtime/src/my_runtime.rs**

```rust
//For better debugging (printout) support
use support::{ debug, dispatch };
use system::offchain;
use sp_runtime::transaction_validity::{
  TransactionValidity, TransactionLongevity, ValidTransaction, InvalidTransaction
};
```

Your runtime trait should have the following type for signed and unsigned transactions

**runtime/src/my_runtime.rs**

```rust
pub trait Trait: timestamp::Trait + system::Trait {
  /// The overarching event type.
  type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
  type Call: From<Call<Self>>;

  type SubmitSignedTransaction: offchain::SubmitSignedTransaction<Self, <Self as Trait>::Call>;
  type SubmitUnsignedTransaction: offchain::SubmitUnsignedTransaction<Self, <Self as Trait>::Call>;
}
```

Now, inside your `decl_module!` dispatch functions section, you can define the following function and this serves as the entry point of off-chain worker after every block import.

**runtime/src/my_runtime.rs**

```rust
decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    // ...
    // ...
    fn offchain_worker(block: T::BlockNumber) {
      debug::info!("Hello World.");
    }
  }
}
```

By default, the offchain worker doesn't have direct access to the keys but only to app-specific subkeys for security reason. So you need to define the app-specific subkeys which are grouped by their `KeyTypeId` at the top of your runtime as followed:

**runtime/src/my_runtime.rs**

```rust
// The key type ID can be any 4-character long string
pub const KEY_TYPE: KeyTypeId = KeyTypeId(*b"abcd");
// ...
// ...
pub mod crypto {
  pub use super::KEY_TYPE;
  use sp_runtime::app_crypto::{app_crypto, sr25519};
  app_crypto!(sr25519, KEY_TYPE);
}
```

To support this package, you need to implement in your library module,

**runtime/src/lib.rs**

```rust
/// We need to define the Transaction signer for that using the Key definition
type SubmitTransaction = system::offchain::TransactionSubmitter<
  my_runtime::crypto::Public, Runtime, UncheckedExtrinsic>;

impl runtime::Trait for Runtime {
  type Event = Event;
  type Call = Call;

  // To use signed transaction
  type SubmitSignedTransaction = SubmitTransaction;

  // To use unsigned transaction
  type SubmitUnsignedTransaction = SubmitTransaction;
}
```

Then you need to implement the `CreateTransaction` trait for the runtime

**runtime/src/lib.rs**

```rust
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

```rust
construct_runtime!(
  pub enum Runtime where
    Block = Block,
    NodeBlock = opaque::Block,
    UncheckedExtrinsic = UncheckedExtrinsic
  {
    // ...
    // ...
    // For using unsigned transactions
    MyRuntime: my_runtime::{ Module, Call, Storage, Event<T>, transaction_validity::ValidateUnsigned }

    // For just using signed transactions, it can just well be:
    // MyRuntime: my_runtime::{ Module, Call, Storage, Event<T> }
  }
);
```

## Insert Keys in `service.rs`

We have allowed our runtime to access our app-specific sub-keys which are stored in its local keystore. But currently there is no sub-keys inside. We can add it in one of the following two ways.

### Development: Add the First User Key as App Subkey

**node/src/service.rs**

```rust
pub fn new_full<C: Send + Default + 'static>(config: Configuration<C, GenesisConfig>)
  -> Result<impl AbstractService, ServiceError>
{
  // ...
  // ...
  // Add this line
  let dev_seed = config.dev_key_seed.clone();

  // ...
  // ...
  let service = builder.with_network_protocol(|_| Ok(NodeProtocol::new()))?
    .with_finality_proof_provider(|client, backend|
      Ok(Arc::new(GrandpaFinalityProofProvider::new(backend, client)) as _)
    )?
    .build()?;

  // Add the following section
  if let Some(seed) = dev_seed {
    service
      .keystore()
      .write()
      .insert_ephemeral_from_seed_by_type::<runtime::my_runtime::crypto::Pair>(
        &seed,
        runtime::my_runtime::KEY_TYPE,
      )
      .expect("Dev Seed should always succeed.");
  }
}
```

Then you would be able to sign transactions off-chain, and this is good for **DEVELOPMENT only**.

### Add an App Subkey via CLI

```bash
# Generate a new account
$ subkey -s generate

# Submit a new key via RPC
$ http localhost:9933 jsonrpc=2.0 id=1 method=author_insertKey params:='["<YourKeyTypeId>", "<YourSeedPhrase>", "YourPublicKey"]'
```

Afterwards, a new key is added in the local keystore.

## Signed Transactions

Now you are ready to to make a signed transaction within the off-chain worker entry section.

**runtime/src/my_runtime.rs**

```rust
decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    // ...
    // ...
    // This is your regular on-chain extrinsics
    pub fn onchain_callback(origin, _block: T::BlockNumber, input: Vec<u8>) -> dispatch::Result {
      let who = ensure_signed(origin)?;
      debug::info!("{:?}", core::str::from_utf8(&input).unwrap());
      Ok(())
    }

    fn offchain_worker(block: T::BlockNumber) {
      // Here we specify the function to be callback on-chain in next block import
      let call = Call::onchain_callback(block, b"hello world!".to_vec());
      T::SubmitSignedTransaction::submit_signed(call);
    }
  }
}
```

After you have defined the on-chain callback function, you can then in the off-chain worker entry
specify that function to be call back in the next block import. You then submit a signed transaction
to the node.

If you look at the implementation of `fn system::offchain::submit_signed ()` within Substrate, you
would realized it is calling the on-chain callback for each of the key in local keystore. But since
you only have one key in the local keystore, you are only calling the function once back on-chain.

## Unsigned Transactions

With the following code, you are able to send an unsigned transaction back on-chain.

**runtime/src/my_runtime.rs**

```rust
decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    // ...
    // ...
    // This is your regular on-chain extrinsics
    pub fn onchain_callback(_origin, _block: T::BlockNumber, input: Vec<u8>) -> dispatch::Result {
      debug::info!("{:?}", core::str::from_utf8(&input).unwrap());
      Ok(())
    }

    fn offchain_worker(block: T::BlockNumber) {
      // Here we specify the function to be callback on-chain in next block import
      let call = Call::onchain_callback(block, b"hello world!".to_vec());
      T::SubmitUnsignedTransaction::submit_unsigned(call);
    }
  }
}
```

By default, all unsigned transactions are treated as invalid transactions. You need to add the following
code piece in `my_runtime.rs` to whitelist some on-chain functions that can be callback as unsigned
transactions.

**runtime/src/my_runtime.rs**

```rust
decl_module! {
  // ...
  // ...
}

impl<T: Trait> Module<T> {
  // ...
  // ...
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

You see that we add a `deprecated` attribute to prevent warning message from display. This is because
this part of the API is still in transition and will be updated in coming Substrate release.

## Parameters in On-Chain Callbacks

When making a on-chain callback, currently our implementation hashes the function name together with all the parameter
values and store it to be called in next import. If we find that the hash value is the same, we will treat it as duplicated function call (same function name and parameter values). For signed transaction, this causes a function replacement if this call is set with a higher priority then the previous callback. For unsigned transaction, this callback is simply ignored.

If your runtime modules are making on-chain callbacks regularly and you expect it will have the same parameter set every once in a while, you can always pass in an additional parameter of the current block number that is being passed into the `fn offchain_worker()`. This number is going to be only incrementing and is guaranteed to be unique.

## Fetching External Data

To fetch external data from 3rd-party APIs, you can use the `offchain::http` library.

**runtime/src/my_runtime.rs**

```rust
use sp_runtime::{
  offchain::http,
  transaction_validity::{
    TransactionValidity, TransactionLongevity, ValidTransaction, InvalidTransaction
  }
};

// ...
// ...

decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    // ...
    // ...
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
    let pending = http::Request::get("https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD").send()
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

You likely need to parse the result in JSON format. Since our runtime is running in `no_std` environment, we recommand using
this [`lite-json` crate](https://github.com/xlc/lite-json) to parse your JSON result. An example of parsing JSON result can be seen in the [off-chain price fetch](https://github.com/jimmychu0807/substrate-offchain-pricefetch/blob/master/node/runtime/src/price_fetch.rs) example.


[comment]: # (TODO: Signing Transactions with Session Keys)
[comment]: # (TODO: Local Key-Value Database)
[comment]: # (TODO: Writing Tests)

## Next Steps

### Examples
  - [Off-chain workers Sub0 workshop materials](https://github.com/tomusdrw/sub0-offchain-workshop)
  - [Off-chain worker price fetch](https://github.com/jimmychu0807/substrate-offchain-pricefetch)
  - (Deprecated) [Off-chain worker callback using Substrate v1 API](https://github.com/gnunicorn/substrate-offchain-cb)

### References

- Substrate [`im-online` module](https://github.com/paritytech/substrate/blob/master/frame/im-online/src/lib.rs), a pallet inside Substrate using off-chain workers to notify other nodes that I, being a validator in the network, am online.

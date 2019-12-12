---
title: Declaring a Module!
id: version-1.0-decl_module
original_id: decl_module
---

The `decl_module!` macro defines the public functions exposed by your module, which act as entry points to accessing your runtime. These functions should work together to build a *generally* independent set of features and functionality which will be included with your blockchain's final runtime. The main logic of the macro is defined [here](https://substrate.dev/rustdocs/v1.0/srml_support/macro.decl_module.html).

Each of the different components in the [Substrate Runtime Module Library](https://github.com/paritytech/substrate/tree/master/frame) (SRML) is an example of a Runtime Module.

We will start by looking at the `decl_module` macro in it's most simple form:

```rust
decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    fn set_value(origin, value: u32) -> Result {
      let _sender = ensure_signed(origin)?;
      <Value<T>>::put(value);
      Ok(())
    }
  }
}
```

Note that for the purposes of this example, we are taking advantage of a single storage item created by the `decl_storage` macro. We will omit the storage declaration for the purposes of this article, but you can learn more about `decl_storage` in our documentation [here](https://substrate.dev/rustdocs/v1.0/srml_support_procedural/macro.decl_storage.html).

## Declaration of the Module Type

The first line in the `decl_module` macro defines the `Module` type which is used by the `construct_runtime` macro:

```rust
pub struct Module<T: Trait> for enum Call where origin: T::Origin
```

This line is using custom syntax expected by the `decl_module` macro and is not standard Rust. For most module development, you will not need to modify this line.

`Module` is defined to use the generic `T` which represents the `Trait` type defined for the module. Functions inside the Module can then use this generic to access custom types.

An `enum` is also defined with the name `Call`, which is expected by the `construct_runtime` macro. The functions defined in `decl_module` are dispatched into this `enum`, with the function names and parameters clearly defined. This structure is publicly exposed by your runtime to allow for downstream APIs and front-ends to easily interact.

Finally, `origin: T::Origin` is a optimization made to simplify the parameter definition of functions in `decl_module`. We are just saying that the `origin` variable used in the function has type `Trait::Origin` which is usually defined by the `system` module.

## Functional Requirements

To ensure that your module functions as intended, you need to follow these rules when developing module functions.

### Must Not Panic

Under no circumstances should a module function `panic`. A `panic` in your runtime module can lead to a potential denial of service (DoS) attack. If your runtime has the ability to panic, a malicious user could send a transaction which does a lot of computational work, cause the runtime to panic, and then because of the panic, avoid paying any fees related to that computational work. None of the computation done before the panic gets charged for since a panic will always revert any prior changes to the storage, including payment taken.

Such an attack will only affect the node receiving an extrinsic directly. The node will compute an extrinsic up until the point of panic. After the panic, it will discard the extrinsic, but still be able to produce a block. The one exception here is a `panic` in `on_initialise` or `on_finalise`, which will actually brick your node since it will be unable to produce a block, as these functions are always called for each block being produced.

You should check in advance for possible error conditions and handle them gracefully. If your state is "irreparably damaged" (i.e. inconsistent), you should still avoid panicking. The best thing to do when you detect such inconsistencies is to simply leave state alone and detect it as early as possible to minimize computation done, and therefore any economic DoS vector.

State inconsistencies can generally be fixed be governance poking state values back into shape. Introducing some sort of "reset", where possible, for governance to call might also make sense to solve these scenarios.

### No Side-Effects On Error

This function must either complete totally (and return `Ok(())` or it must have no side-effects on storage and return `Err('Some reason')`. 

As a developer building on Substrate, it is critical that you make a distinction about how you should design your runtime logic versus developing a smart contract on a platform like Ethereum.

On Ethereum, if at any point your transaction fails (error, out of gas, etc...), the state of your smart contract will be unaffected. However, on Substrate this is not the case. As soon as a transaction starts to modify the storage of the blockchain, those changes are permanent, even if the transaction would fail at a later time during runtime execution.

This is necessary for blockchain systems since you may want to track things like the nonce of a user or subtract gas fees for any computation that occurred. Both of these things actually happen in the Ethereum state transition function for failed transactions, but you have never had to worry about managing those things as a contract developer.

You will have to be conscious of any changes you make to the state of your blockchain, and ensure that it follows the "verify first, write last" pattern.

### Function Return

Dispatchable functions in your module cannot return a value. Instead it can only return a `Result` which accepts either `Ok(())` when everything has completed successfully or `Err(&'static str)` if something goes wrong.

If you do not specify `Result` explicitly as return value, it will be added automatically for you by the `decl_module!` macro and `Ok(())` will be returned at the end.

Thus, this function definition is equivalent to the above example:

```rust
decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    fn set_value(origin, value: u32) {
      let _sender = ensure_signed(origin)?;
      <Value<T>>::put(value);
    }
  }
}
```

You can still return an `Err()` at other points in your code like normal.

### Proportional Costs to Computation

Ensure that calls into each of these execute in a time, memory and using storage space proportional to any costs paid for by the caller or otherwise the difficulty of forcing the call to happen.

If you can't be certain that your module function will succeed without substantial computation then you have a classic blockchain attack scenario. The normal way of managing this is to attach a bond to the operation. As the first major alteration of storage, reserve some value from the sender's account (`Balances` module has a `reserve` function for exactly this scenario). This amount should be enough to cover any costs of the substantial execution in case it turns out that you can't proceed with the operation.

If it eventually transpires that the operation is fine and, therefore, that the expense of the checks should be borne by the network, then you can refund the reserved deposit. If, however, the operation turns out to be invalid and the computation is wasted, then you can burn it or repatriate elsewhere.

### Check Origin

All functions use `origin` to determine the origin of the call. Modules support checking against one of three `origin` types:

 * Signed Extrinsic - `ensure_signed(origin)?`
 * Inherent Extrinsic - `ensure_inherent(origin)?`
 * Root - `ensure_root(origin)?`

You should always match against one of them as the first thing you do in your function, otherwise your chain might be attackable.

You can learn more about `Origin` [here](TODO: Create Doc)

## Reserved Functions

While you are generally able to name your function anything you want in your module, there are a few functions names which are reserved, and carry with it special functionality that you can access in your module.

### deposit_event()

If your module wants to emit events, it will need to define a `deposit_event()` function which handles the events you define in the `decl_events` macro. Events can contain generics, in which case you should define a `deposit_event<T>()` function.

The `decl_module` macro provides a default implementation for the `deposit_event()` function which you can access by simply defining the function like so:

```rust
fn deposit_event() = default;

// or for events with generics
// fn deposit_event<T>() = default;
```

If we wanted to emit an event from our `decl_module` it would look like this:

```rust
decl_module! {
  pub struct Module<T: Trait> for enum Call where origin: T::Origin {
    fn deposit_event<T>() = default;
  
    fn set_value(origin, value: u32) -> Result {
      let sender = ensure_signed(origin)?;
      <Value<T>>::put(value);
      
      Self::deposit_event(Event::Set(sender, value));
      
      Ok(())
    }
  }
}
```

We have omitted the `decl_event` macro definition required for this module to work. You can learn more about events and the `decl_event!` macro [here] (Coming Soon)

### on_initialise() and on_finalise()

`on_initialise()` and `on_finalise()` are a special functions that gets executed once per block.

These functions can either be called with no parameters, or accept one parameter which has the block number.

```rust
// The signature could also be: `fn on_initialise(n: T::BlockNumber)`
fn on_initialise() {
    // Anything that needs to be done at the beginning of the block.
    Self::my_function();
}

// The signature could also be: `fn on_finalise()`
fn on_finalise(n: T::BlockNumber) {
    // Anything that needs to be done at the end of the block.
    Self::my_function_with_blocknumber(n);
}
```

You might use `on_initalise()` to help you with tasks that need to run before any logic in your runtime executes. For example, doing a one-off migration of storage elements for an updated storage schema. You might use `on_finalise()` to help you clean up any unneeded storage items or to reset values for the next block.

> Note: If you print to console using these functions, you will the output appear twice since it will be called once when the block is prepared and once more when it is imported. However, from within the blockchain, these functions only get called one time.

## Privileged Functions

A privileged function is one that can only be called when the origin of the call is `Root`. An example of a privileged function can be found in the [`Consensus` module](https://github.com/paritytech/substrate/blob/master/frame/consensus/src/lib.rs) for a runtime upgrade:

```rust
/// Set the new code.
pub fn set_code(new: Vec<u8>) {
    storage::unhashed::put_raw(well_known_keys::CODE, &new);
}
```

Note that this function omits the `origin` parameter at the beginning of the function inputs. The `decl_module!` macro automatically converts functions without `origin` to check that `origin` is `Root`. Thus, the function above is equivalent to writing:

```rust
/// Set the new code.
pub fn set_code(origin, new: Vec<u8>) -> Result {
    ensure_root(origin)?;
    storage::unhashed::put_raw(well_known_keys::CODE, &new);
    Ok(())
}
```

Where `Result` and `Ok(())` were automatically added as mentioned in [Function Return](#function-return)

Different runtimes have different reasons for allow privileged calls to be executed. Because it's privileged, we can assume it's a one-off operation and substantial processing/storage/memory can be used without worrying about gameability or attack scenarios.

Normally, functions like this would be called via the `sudo()` function in the [`Sudo` module](https://github.com/paritytech/substrate/blob/master/frame/sudo/src/lib.rs) which can construct a `Root` call based on a proposal coming from a user.
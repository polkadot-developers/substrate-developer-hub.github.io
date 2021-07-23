---
title: Interact with the Nicks Pallet
---

Now you are ready to compile and run your node that has been enhanced with nickname capabilities
from the Nicks pallet. Compile the node in release mode with:

```bash
cargo build --release
```

If the build fails, go back to the previous section and make sure you followed all the steps
correctly. You can also view a [full solution including the `Nick` pallet](https://github.com/substrate-developer-hub/substrate-node-template/tree/tutorials/solutions%2Fadd-a-pallet-v3.0.0+monthly-2021-05).

After the build succeeds, you can start the node:

```bash
# Run a temporary node in development mode
./target/release/node-template --dev --tmp
```

## Start the Front-End

As in the previous tutorials, this tutorial will use the Substrate Developer Hub Front-End Template
to allow you to interact with the Node Template. As long as you have completed the
[Create Your First Chain](../create-your-first-substrate-chain) and [Build a dApp](../build-a-dapp)
tutorials, you should already be prepared to continue with the rest of this tutorial.

> Refer directly to the
> [front-end setup instructions](../create-your-first-substrate-chain/setup#install-the-front-end-template)
> for the Create Your First Chain Tutorial if necessary.

To start the Front-End Template, navigate to its directory and run:

```bash
yarn start
```

## Use the Nicks Pallet

You should already be familiar with using the Front-End Template to
[interact with a pallet](../create-your-first-substrate-chain/interact#pallet-interactor-&-events).
In this section we will use the Nicks pallet to further illustrate how the Front-End Template can be
used to interact with FRAME pallets. We will also learn more about how to use the Front-End Template
to invoke privileged functions with the Sudo pallet, which is included by default as part of the
Node Template. Finally, you will learn how to interpret the different types of events and errors
that FRAME pallets may emit.

To get started, use the account selector from the Front-End Template to
select `Alice`'s account and then use the Pallet Interactor component to call
[the `setName` dispatchable](https://substrate.dev/rustdocs/latest/pallet_nicks/enum.Call.html#variant.set_name)
function from the `nicks` pallet. You can select any name you'd like as long as it is no shorter
than the `MinNickLength` and no longer than the `MaxNickLength` you configured in the previous step.
Use the `Signed` button to execute the function.

![Set a Name](assets/tutorials/add-a-pallet/set-name.png)

As you can see in the image above, the Front-End Template will report the status of the
dispatchable, as well as allow you to observe the
[events](https://substrate.dev/rustdocs/latest/pallet_nicks/enum.RawEvent.html) emitted by the Nicks
pallet and the other pallets that compose your chain's runtime. Now use the Pallet Interactor's
Query capabilities to read the value of Alice's nickname from the
[runtime storage](../../knowledgebase/runtime/storage) of the Nicks pallet.

![Read a Name](assets/tutorials/add-a-pallet/name-of-alice.png)

The return type is a tuple that contains two values: Alice's hex-encoded nickname and the amount
that was reserved from Alice's account in order to secure the nickname. If you query the Nicks
pallet for Bob's nickname, you'll see that the `None` value is returned. This is because Bob has not
invoked the `setName` dispatchable and deposited the funds needed to reserve a nickname.

![Read an Empty Name](assets/tutorials/add-a-pallet/name-of-bob.png)

Use the `Signed` button to invoke
[the `killName` dispatchable](https://substrate.dev/rustdocs/latest/pallet_nicks/enum.Call.html#variant.kill_name)
function and use Bob's account ID as the function's argument. The `killName` function must be called
by the `ForceOrigin` that was configured with the Nicks pallet's `Config` interface in the previous
section. You may recall that we configured this to be the FRAME system's `Root` origin. The Node
Template's
[chain specification](https://github.com/substrate-developer-hub/substrate-node-template/blob/v3.0.0/node/src/chain_spec.rs)
file is used to configure the
[Sudo pallet](https://substrate.dev/rustdocs/latest/pallet_sudo/index.html) to give Alice access to
this origin.

The front-end template makes it easy to use the Sudo pallet to dispatch a call from the
`Root` origin - just use the `SUDO` button to invoke the dispatchable. Since we just used the
`Signed` button as opposed to the `SUDO` button, the function was _dispatched_ by
[the `Signed` origin](https://substrate.dev/rustdocs/latest/frame_system/enum.RawOrigin.html#variant.Signed)
associated with Alice's account as opposed to the `Root` origin.

![`BadOrigin` Error](assets/tutorials/add-a-pallet/kill-name-bad-origin.png)

You will notice that even though the function call was successfully dispatched, a `BadOrigin` error
was emitted and is visible in the Events pane. This means that Alice's account was still charged
[fees](../../knowledgebase/runtime/fees) for the dispatch, but there weren't any state changes
executed because the Nicks pallet follows the important
[verify-first-write-last](../../knowledgebase/runtime/storage#verify-first-write-last) pattern. Now
use the `SUDO` button to dispatch the same call with the same parameter.

![Nicks Pallet Error](assets/tutorials/add-a-pallet/clear-name-error.png)

The Sudo pallet emits a
[`Sudid` event](https://substrate.dev/rustdocs/latest/pallet_sudo/enum.RawEvent.html#variant.Sudid)
to inform network participants that the `Root` origin dispatched a call, however, you will notice
that the inner dispatch failed with a
[`DispatchError`](https://substrate.dev/rustdocs/latest/sp_runtime/enum.DispatchError.html) (the
Sudo pallet's
[`sudo` function](https://substrate.dev/rustdocs/latest/pallet_sudo/enum.Call.html#variant.sudo) is
the "outer" dispatch). In particular, this was an instance of
[the `DispatchError::Module` variant](https://substrate.dev/rustdocs/latest/frame_support/dispatch/enum.DispatchError.html#variant.Module),
which reports two pieces of metadata: an `index` number and an `error` number. The `index` number
relates to the pallet from which the error originated; it corresponds with the _index_ (position) of
the pallet within the `construct_runtime!` macro. The `error` number corresponds with the index of
the relevant variant from that pallet's `Error` enum. When using these numbers to find pallet
errors, remember that the _first_ position corresponds with index _zero_. In the screenshot above,
the `index` is `9` (the _tenth_ pallet) and the `error` is `2` (the _third_ error). Depending on the
position of the Nicks pallet in your `construct_runtime!` macro, you may see a different number for
`index`. Regardless of the value of `index`, you should see that the `error` value is `2`, which
corresponds to the _third_ variant of the Nick's pallet's `Error` enum,
[the `Unnamed` variant](https://substrate.dev/rustdocs/latest/pallet_nicks/enum.Error.html#variant.Unnamed).
This shouldn't be a surprise since Bob has not yet reserved a nickname, thus it cannot be cleared!

You should confirm that Alice can use the `SUDO` button to invoke the `killName` dispatchable and
forcibly clear the nickname associated with any account (including her own) that actually has a
nickname associated with it. Here are some other things you may want to try:

- Add a nickname that is shorter than the `MinNickLength` or longer than the `MaxNickLength` that
  you configured with the Nick's pallet's `Config` configuration trait.
- Add a nickname for Bob then use Alice's account and the `SUDO` button to forcibly kill Bob's
  nickname. Switch back to Bob's account and dispatch the `clearName` function.

## Adding Other FRAME Pallets

In this guide, we walked through specifically how to import the Nicks pallet, but as mentioned in
the beginning of this guide, each pallet will be a little different. Have no fear, you can always
refer to the [Substrate runtime](https://github.com/paritytech/substrate/tree/master/bin/node/runtime)
which includes nearly every pallets in the library of core FRAME pallets.

In the Substrate node runtime `bin/node/runtime/Cargo.toml` file, you will see how to import
different pallets, and in the `bin/node/runtime/lib.rs` file you will see how to add each pallet to your
runtime. You can generally copy what was done there as a starting point to include a pallet in your
own runtime.

### Learn More

- Learn how to add a more complex pallet to the Node Template by completing the
  [Add the Contracts Pallet](../add-contracts-pallet) tutorial.
- Complete the [Forkless Upgrade a Chain](../forkless-upgrade) tutorial to learn how Substrate enables
  forkless runtime upgrades and follow steps to perform two upgrades, each of which is performed by
  way of a distinct upgrade mechanism.

### References

- [Nicks pallet docs](https://substrate.dev/rustdocs/latest/pallet_nicks/index.html)

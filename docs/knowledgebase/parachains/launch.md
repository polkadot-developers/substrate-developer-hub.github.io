---
title: Parachains Launch Guide
---

> This guide is meant to inform teams who are looking to launch a parachain on Polkadot/Kusama about
> the process, provide answers to the FAQ and share recommendations/best practices.
>
> NOTE: This page is a _work in progress_! It is _not_ a comprehensive listing of all considerations.
> Please only use this as a starting point and reference for your parachain launch process.

## Substrate for Parachains

Ensure you are familiar with the [Substrate Launch Check-list](https://docs.google.com/document/d/1z4bNFWr-I52EkBeQKsXbyY4gtVePT9lDc57fA9D_cB0/) and follow all recommendations listed there.

### Collators

#### 1. Collator selection

- To prevent censorship, a parachain only needs to ensure that there exist some neutral collators - but not necessarily a majority.

- Too many collators may slow down the network.

- You are free to choose your method of collator selection. Common methods include stake voting/staking (see Cumulus [implementation](https://github.com/paritytech/cumulus/blob/master/pallets/collator-selection/src/lib.rs)) or directly assigning collators via committee or other origins such as democracy.

#### 2. Setup

- Refer to [this instruction](https://substrate.dev/cumulus-workshop/#/en/3-parachains/1-launch?id=start-the-collator-node) to start and set up a collator node and [here](https://substrate.dev/cumulus-workshop/#/en/3-parachains/4-more-nodes?id=start-the-second-collator) to add more collator nodes.

#### 3. Incentives

- The [collator-selection pallet](https://github.com/paritytech/cumulus/blob/master/pallets/collator-selection/src/lib.rs) linked above already implements incentives via transaction fees. [This pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/parachain-staking/src/lib.rs) implemented by Pure Stake team offers a more sophisticated scheme of parachain staking that supports inflationary monetary policy.

#### 4. DevOps considerations

- Ensure you follow [parachain DevOps best practices](https://gist.github.com/lovelaced/cddc1c7234b883ee37e71cf4a1d63cac).
- We recommend you to watch the [recording](https://drive.google.com/file/d/1-nQ_SI2XK6vxPQvORWuv68Yj0UDz5FrO/view) of a dedicated DevOps for parachains office hour.

### Runtime & Client Checklist

#### 1. Unique Protocol ID

There have been instances of networks having the same [Protocol ID](https://github.com/paritytech/substrate/blob/49a4103f4bfef55be20a5c6d26e18ff3003c3353/client/network/src/config.rs#L235) and different specs. **Ensure you customize your protocolID to make it universally unique**. Use a unique name & nonce/salt to ensure that this is not going to connect with another network.

#### 2. Proper Weights & Benchmarking

- Benchmark your runtime and use the generated weight functions (see our [benchmarking guide](../runtime/benchmarking)). Follow the benchmarking best practices. Don’t use default Substrate weights in production unless you know what you are doing.

- We recommend having a block weight limit (block production time) of 0.5 seconds in the beginning due to uncertainties in block execution time. As the execution time of the network stabilizes the weights limit can be increased to 2 seconds.

#### 3. Recommended Deployment of a Runtime

> **NOTE**: Make sure to deploy the _compressed_ (not compact) version of your runtime to avoid PoV-size complications.

- We advise you to launch your parachain being as slim as possible and do runtime upgrades to include functionality. The reason behind this is that when performing a runtime upgrade both the previous runtime and the new runtime are included in the PoV and therefore if the changes are too big it might not go through. **Always use the compressed version of the runtime to lower the amount of data being transferred.**

  Still, in order to avoid storage upgrades, you could do the following:

  1. Generate the genesis state of your chain with full runtime functionality (including all the pallets).

  2. Remove all pallets that you will not need upon parachain launch from your runtime.

  3. Re-build the WASM blob (validation logic) and the runtime of the chain.

  4. Register your parachain with the updated genesis and the WASM blob generated in (3).

  5. After your parachain is live you can upgrade your runtime on-chain to include the missing pallets (ensure that pallet indices and names match those used to generate the genesis state in step (1) without having to do storage migrations. For more information on on-chain runtime upgrades refer to the next section.

- You could also launch your parachain with a feature-complete runtime but limit the functionality with filters. This however might cause issues if your runtime is too large. Here is [an example](https://github.com/paritytech/cumulus/pull/476) of how this was done for Statemine.

### Parachain Runtime Upgrades

[Runtime upgrades](../runtime/upgrades) on a parachain are a bit different than on a solo-chain. But the following are still required:

- A newly compressed Wasm generated for the runtime and set on-chain (and don't forget to [increment your `spec_version`](../runtime/upgrades#runtime-versioning)).
- State migrations from the old runtime to the new runtime implemented and executed in this Wasm (for more information refer to [Substrate Runtime Migration Guide](https://hackmd.io/BQt-gvEdT66Kbw0j5ySlWw) and [readme here](https://github.com/apopiak/substrate-migrations)).

#### Standard Protocol

> For a demo of solo-chain upgrades, see [this tutorial](../../tutorials/forkless-upgrade/).

The Relay chain needs to be informed before the runtime upgrade of a parachain. Cumulus provides functionality to notify the Relay Chain about the upcoming upgrade.

- You will need to first provide the hash of your upgrade to [authorize your upgrade](https://github.com/paritytech/cumulus/blob/d935b81e7010fcf5c5639e238c78d865c1d6ed67/pallets/parachain-system/src/lib.rs#L359);

- Then you provide the actual code for the upgrade and therewith to [enact your upgrade](https://github.com/paritytech/cumulus/blob/d935b81e7010fcf5c5639e238c78d865c1d6ed67/pallets/parachain-system/src/lib.rs#L369). If both steps are correct the Relay Chain [will be notified](https://github.com/paritytech/cumulus/blob/master/pallets/parachain-system/src/lib.rs#L829) that the new upgrade has been scheduled.

The update will not be enacted directly; instead it takes X relay blocks (a value that is configured by the relay chain) before the relay chain allows the update to be applied. The first parachain block that will be included after X relay chain blocks needs to apply the upgrade.

If the update is applied before the waiting period is finished, the relay chain will reject the parachain block for inclusion. The Cumulus runtime pallet will provide the functionality to register the runtime upgrade and will also [make sure](https://github.com/paritytech/cumulus/blob/master/pallets/parachain-system/src/lib.rs#L892) that the update is applied at the correct block.

After updating the parachain runtime, a parachain [needs to wait](https://github.com/paritytech/cumulus/blob/master/pallets/parachain-system/src/lib.rs#L862) a certain amount of time (configured by the relay chain) before another update can be applied.

The WASM blob update not only contains the parachain runtime, but also the `validate_block` function provided by Cumulus. So, updating a parachain runtime on the relay chain involves a complete update of the validation WASM blob.

#### Multi-block Upgrades

If your existing substrate chain has a very large state, which you are migrating between storage formats it might not be possible to run all of the runtime migrations within one block. There are a handful of strategies you can use to remedy this problem:

1. If the amount of storage items to be migrated can feasibly be processed within two or three blocks you can plausibly run the migrations via the [scheduler pallet](https://github.com/paritytech/substrate/tree/master/frame/scheduler) to ensure they get executed regardless of block producer.

2. Instead of migrating all of the items automatically, use versioned storage and only execute migrations when storage values that are upgraded are accessed. This can cause variance in transaction fees between users and could potentially result in more complex runtime code but if properly metered (weights are properly benchmarked) will ensure minimal downtime for migration.

3. If you must split your migrations among multiple blocks you can do it either on-chain or off-chain:

    - An on-chain multi-block migration will require custom pallet logic to be written which can either queue changes over time or use the scheduler pallet to migrate chunks of storage at a time.

    - Instead of adding migration code to your runtime you can generate the migration manually off-chain and use multiple system.setStorage calls to add and remove storage items as necessary via an origin with root permission (for example democracy). If you are limited in the number of transactions you can make, you can batch multiple transactions to occur over time via the scheduler.

**Find more information in [Substrate Runtime Migration Guide](https://hackmd.io/BQt-gvEdT66Kbw0j5ySlWw) and [this demo](https://github.com/apopiak/substrate-migrations).**

### Stalled Para-block Production Recovery

In a scenario where a malicious collator decides to produce a block but not share it with other collators, therefore causing a stall in a block production there is a mechanism by which other collators can recover by asking the Relay Chain for the latest known block. This is already [implemented in Cumulus](https://github.com/paritytech/cumulus/blob/master/client/pov-recovery/src/active_candidate_recovery.rs) and happens automatically on a timer if a collator cannot retrieve the latest declared block from other collators.

## Parachain Registration

### 1. Reserve a Parachain Slot

- You need a ParaID/slot number to perform any operation referencing your parachain. For example, for providing the WASM blob/genesis state, creating channels to other parachains for XCM, starting a crowdloan, etc.
- Every parachain begins its lifecycle as a parathread. If you want to reserve a ParaID, go to the [apps UI](https://polkadot.js.org/apps), click on Network - Parachains.
  - Click on “+ParaID”
  - Reserve a ParaID. The deposit for the slot reservation for Kusama Network is 35, 6871 KSM
- _You can reserve a slot any time - there is no need to do it ASAP._

### 2. Register

- To register your parachain you need to provide your ParaID, genesis state and your WASM validation logic.
- [Generate a parachain Genesis state](https://substrate.dev/cumulus-workshop/#/en/3-parachains/1-launch?id=generate-parachain-genesis-state)
- [Obtain WASM Runtime Validation logic](https://substrate.dev/cumulus-workshop/#/en/3-parachains/1-launch?id=obtain-wasm-runtime-validation-function)
- **The maximum size of your WASM blob is 750 kilobytes (on Kusama)**
- [Register your parachain](https://substrate.dev/cumulus-workshop/#/en/3-parachains/2-register?id=parachain-registration)
- You need to pay the deposit for the transaction. The amount of the deposit depends on the size of the WASM blob and the genesis states and approximately follows the formula (for Kusama): deposit = 35,5 +33,5\*x[megabytes].
  - Exact formulas for [Kusama](https://github.com/paritytech/polkadot/blob/04b2383ba6685bacc63a2eb4a1949aebadbc624b/runtime/kusama/src/constants.rs#L26) and [Polkadot](https://github.com/paritytech/polkadot/blob/04b2383ba6685bacc63a2eb4a1949aebadbc624b/runtime/polkadot/src/constants.rs#L27).
- Only after completing these steps of registering your parachain can you start a crowdloan campaign.

## Parachain Slot Auctions & Crowdloans

> NOTE: The parachain configuration [will be locked](https://github.com/paritytech/polkadot/blob/master/runtime/common/src/crowdloan.rs#L381) after you start the crowdloan
> **You will not be able to change the genesis state and your validation logic!**

### Auctions

Polkadot and Kusama allocate parachains based on a [candle auction mechanism](https://wiki.polkadot.network/docs/en/learn-auction). There is a known open period and the end of the auction is retroactively determined during the ending period. The bids will be accepted during both open and ending period but as the actual end of the auction takes place during the ending period, the only _guaranteed_ time when the bids will be taken into account is the open period. The duration of the open period is decided by the Council and is 45 hours for ongoing auctions on [Kusama](https://kusama.polkassembly.io/motion/310).
Thus the later bids have higher probability of losing since the retroactively determined close moment may be found to have preceded the time that a bid was submitted. We advise you to bid as high as you can at the earliest stages to increase your chances of winning.

After winning the auction teams will be automatically connected to the Relay Chain by the chain’s logic.

If a parachain does not have the funds enough to win an auction independently they can gather funds in a [crowdloan](https://wiki.polkadot.network/docs/en/learn-crowdloans) to collectively bid in this auction.

### Crowdloan Parameters

- You can only create a crowdloan for a ParaID that you own / have registered.
- The crowdfund cap is the MAXIMUM amount your crowdloan can collect. You can still win a bid if you have less than your maximum, as long as your bid is the best in the auction.
- You can set up the capacity through the creation form of the campaign. We advise adding a capacity to provide transparency.
- Ending Block is when you want your crowdloan to end. If you know an auction will start in 3 days, and will last for 5 days, you probably want to set your crowdloan to end in 10 days, or a similar timescale. This way you will be sure that your crowdloan is active during the entire auction process.
- One way of calculating the ending block number would be using the formula `(10*60*24*7)*(x*6) + y`, - where `x` is the number of auction periods you want your crowdloan to continue for, and `y ` is the current block number (`(Blocks/Min * Min/Hour * Hour/Day * Day/Week) * (x * Week/Period)`).
- Don’t set your crowdloan for a longer period of time than needed, or else you will lock up the contributors’ funds for a long time. This can push your contributors away from participation.
- First slot must be the first slot you want to bid for. So if the current auction encompasses slots (3, 4, 5, 6), your first slot can be at least 3. The last slot must be within that range too.
- You can only cancel an ongoing crowdloan if no contributions have been made. Your deposit will be [returned to you](https://github.com/paritytech/polkadot/blob/04b2383ba6685bacc63a2eb4a1949aebadbc624b/runtime/common/src/crowdloan.rs#L583).

### Receiving Crowdloan Contributions

- As some of your contributions will be made via proxy or multisig accounts, you will need to design a system to reward those accounts. One way of doing it would be allowing users to add memo extrinsic when contributing. polkadot_js does not yet support this, but you can include the [add_memo](https://github.com/paritytech/polkadot/blob/master/runtime/common/src/crowdloan.rs#L619) functionality in your crowdloan UI.
- Custodians.
  - Working with custodians comes with many potential benefits but also has inherent risks. Users who participated in a crowdloan campaign through a custodian need to rely on that custodian to perform several actions, namely:
  - Issue the appropriate type of reward as determined by the project team
  - Unlock participants’ original DOT/KSM at the end of the parachain slot lease (or campaign in the case that the parachain doesn't win the auction).
- Remember that a slot lease ranges from six months to two years. Projects should carefully assess custodians they are considering working with and should be particularly careful in selecting custodians they choose to have an exclusive relationship with.
- Teams will be depended upon to direct their community to reliable custodians who are supporting their auction. Neither Web3 Foundation nor Parity will be making specific recommendations around custodial services.
- If you have any questions or would like to learn more about custodial services please contact Dieter Fishbein, [dieter@web3.foundation](mailto:dieter@web3.foundation).

### Scam Protection

**Ensure you follow all the recommendations listed [here](https://wiki.polkadot.network/docs/en/learn-scams).**

If you choose to work with custodians to collect contributions for your crowdloan, ensure the name and addresses of custody providers are visible in official announcements **at all times**. Bear in mind there is always a chance of scammers spreading false addresses in your community’s channels.

### Technical Integrations

We recommend you to:

- Integrate your chain with Substrate API [Sidecar](https://github.com/paritytech/substrate-api-sidecar/blob/master/CHAIN_INTEGRATION.md)
- Create a [Txwrapper](https://github.com/paritytech/txwrapper-core/blob/main/CHAIN_BUILDER.md) for your chain,

to ease future integrations of your chain, as most of the exchanges are already familiar with these tools.

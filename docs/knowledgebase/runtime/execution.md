---
title: Execution
---

The execution of the Substrate runtime is orchestrated by the Executive module.

Unlike the other modules within FRAME, this is not a _runtime_ module. Rather it is a normal Rust module
that calls into the various runtime modules included in your blockchain.

The Executive module exposes the `execute_block` function that:

- [Initializes the block](#initializing-a-block)
- [Executes extrinsics](#executing-extrinsics)
- [Finalizes the block](#finalizing-a-block)

## Validating Transactions

Before block execution begins, signed transactions are checked for validity. This doesn't execute any
side-effects; it merely checks whether the transaction would panic if it were included or not. Thus,
changes made to storage are discarded.

## Executing a Block

Once there is a queue of valid transactions, the Executive module begins to execute the block.

### Initializing a Block

To initialize a block, the System module and all other included runtime modules have their
`on_initialize` function called which executes any business logic defined by those modules to take
place before transactions are executed. The modules are executed in the order which they are defined
in the `construct_runtime!` macro, but with the System module always executing first.

Then, initial checks take place where the parent hash in the block header is verified to be correct
and the extrinsics trie root actually represents the extrinsics.

### Executing Extrinsics

After the block has been initialized, each valid extrinsic is executed in order of transaction
priority. Extrinsics must not cause a panic in the runtime logic or else the system becomes
vulnerable to attacks where users can trigger computational execution without any punishment.

When an extrinsic executes, the state is not cached prior to execution and storage mutations operate
directly on storage. Therefore, runtime developers should perform all necessary checks that an
extrinsic will succeed before mutating storage. If an extrinsic fails mid-execution, previous
storage mutations will not be reverted.

[Events](events) that are emitted from an extrinsic are also written to storage. Therefore, you
should not emit an event before performing the complementary actions. If an extrinsic fails after an
event is emitted, the event will not be reverted.

### Finalizing a Block

After all queued extrinsics have been executed, the Executive module calls into each module's
`on_idle` and `on_finalize` function to perform any final business logic which should take place at the end of the
block. The modules are again executed in the order which they are defined in the
`construct_runtime!` macro, but in this case, the System module finalizes last.

Then, final checks take place where the digest and storage root in the block header match what was
calculated.

`on_idle` will also pass through the remaining weight of the block to allow for execution based on the 
usage of the blockchain. 

## Next Steps

### Learn More

- Learn how you can simulate the orchestration of the Executive module in your
  [runtime tests](tests).

### References

- [FRAME executive](https://substrate.dev/rustdocs/latest/frame_executive/index.html)
- [`decl_event!` macro](https://substrate.dev/rustdocs/latest/frame_support/macro.decl_event.html)
- [`decl_storage!` macro](https://substrate.dev/rustdocs/latest/frame_support/macro.decl_storage.html)
- [`construct_runtime!` macro](https://substrate.dev/rustdocs/latest/frame_support/macro.construct_runtime.html)
- [`OnInitialize` trait](https://substrate.dev/rustdocs/latest/frame_support/traits/trait.OnInitialize.html)

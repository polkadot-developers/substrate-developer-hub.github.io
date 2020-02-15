---
title: Runtime Execution
---

The execution of the Substrate runtime is orchestrated by the Executive module in the Substrate Runtime Module Library (SRML).

Unlike the other modules in the SRML, this is not a _runtime_ module, but just a normal Rust module which calls into the various runtime modules included in your blockchain.

The Executive module exposes the `execute_block` function that:

* [Initializes the block](#initializing-a-block).

* [Executes extrinsics](#executing-extrinsics).

* [Finalizes the block](#finalizing-a-block).

## Validating Transactions

Before block execution begins, signed transaction are checked for validity. This doesn't execute any side-effects; it merely checks whether the transaction would panic if it were included or not. Thus, changes made to storage are discarded.

## Executing a Block

Once there is a queue of valid transactions, the Executive module begins to execute the block.

### Initializing a Block

To initialize a block, the System module and all other included runtime modules have their `on_initialize` function called which executes any business logic defined by those modules to take place before transactions are executed. The modules are executed in the order which they are defined in the `construct_runtime!` macro, but with the System module always executing first.

Then, initial checks take place where the parent hash in the block header is verified to be correct and the extrinsics trie root actually represents the extrinsics.

### Executing Extrinsics

After the block has been initialized, each valid extrinsic is executed in order of transaction priority. Extrinsics must not cause a panic in the runtime logic or else the system becomes vulnerable to attacks where users can trigger computational execution without any punishment.

### Finalizing a Block

After all queued extrinsics have been executed, the Executive module calls into each module's `on_finalize` function to perform any final business logic which should take place at the end of the block. The modules are again executed in the order which they are defined in the `construct_runtime!` macro, but in this case, the System module finalizes last.

Then, final checks take place where the digest and storage root in the block header match what was calculated.

## Next Steps

### Learn More

* Look at the documentation for [Declaring a Module](development/module/declaration.md) to see how you can define `on_initialize` and `on_finalize` logic for your runtime module.

* Learn how how you can simulate the orchestration of the Executive module in your [runtime tests](development/module/tests.md).

### Examples

TODO

### References

* Visit the reference docs for the [Executive module](https://substrate.dev/rustdocs/master/frame_executive/index.html).

* Visit the reference docs for the [`decl_event!` macro](https://substrate.dev/rustdocs/master/frame_support/macro.decl_event.html).

* Visit the reference docs for the [`decl_storage!` macro](https://substrate.dev/rustdocs/master/frame_support/macro.decl_storage.html).

* Visit the reference docs for the [`construct_runtime!` macro](https://substrate.dev/rustdocs/master/frame_support/macro.construct_runtime.html).

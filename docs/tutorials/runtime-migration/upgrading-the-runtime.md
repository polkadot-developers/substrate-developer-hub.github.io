---
title: Upgrading the runtime
---
Remember that this changes will have effect after upgrading,
so once the migration is written you have to compile again with
```bash
WASM_BUILD_TOOLCHAIN=nightly-2020-10-05 cargo build --release
```

And now, as shown in the [upgrade a chain tutorial](https://substrate.dev/docs/en/tutorials/upgrade-a-chain/sudo-upgrade#upgrade-the-runtime),
connect to [https://polkadot.js.org/apps/#/settings?rpc=ws://127.0.0.1:9944](https://polkadot.js.org/apps/#/settings?rpc=ws://127.0.0.1:9944) and use `sudoUnchekedWeight` extrinsic 
with `system:setCode` call to upload the new  wasm compilation with the changes to Nicks pallet,
by default this file can be found here 
`target/release/wbuild/node-template-runtime/node_template_runtime.compact.wasm`.

After launching the upgrade check the new changes in the pallet storage using the UI:
+ Go to Developer > Chain State
+ Select nicks > nameOf and check that the names you set at the start of the tutorial now
follow the new data schema.


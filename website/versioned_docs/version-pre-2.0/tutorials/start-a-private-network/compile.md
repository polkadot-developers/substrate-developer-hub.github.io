---
title: Compiling the Tools
id: version-pre-2.0-compile
original_id: compile
---

Substrate does not (yet) offer binary installation packages, so it must be compiled from source, which can be a time-consuming process. It is wise to start the compilation and then read the next few pages of the tutorial while your node is building. This tutorial will use the Substrate node template.

```bash
# Install rust prerequisites
curl https://getsubstrate.io -sSf | bash -s -- --fast

# Download the Substrate node template
git clone https://github.com/substrate-developer-hub/substrate-node-template.git
```


Now let's compile the actual blockchain node that we'll be running. Because Substrate is a framework, most real-world blockchains that use it will write custom runtime code. There are [other tutorials](/tutorials/) that cover that process in detail. Luckily the node template is a ready-to-run node environment.

```bash
# Ensure your Rust toolchain is up to date
./scripts/init.sh

# Compile the node-template
cargo build --release
```

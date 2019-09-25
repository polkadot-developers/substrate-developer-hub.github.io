---
title: Setup Your Computer
---

To develop on Substrate, your computer needs some prerequisites to establish a working development environment.

Things like [Rust](https://www.rust-lang.org/tools/install), [CMake](https://cmake.org/install/), [libssl](https://wiki.openssl.org/index.php/Libssl_API), [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), etc...

If you are using a Unix based machine (Linux, MacOS), we have created a simple one-liner to get all of those prerequsites installed:


```bash
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

> If you want to see specifically what this script does just visit: https://getsubstrate.io


If you are using Windows, the process is a little bit harder, but well documented [here](https://substrate.dev/docs/en/getting-started/installing-substrate#windows).

In addition to this, you will need all the basic tools for web development like `yarn`.

### Compiling Substrate

We have created a development package for Substrate, aptly named the [**Substrate Package**](https://github.com/substrate-developer-hub/substrate-package). This package will contain all the tools you need to complete this tutorial.

Unfortunately, the longest part of this setup process is actually compiling Substrate for the first time. To make things more efficient, follow these instructions to start the compilation process, then read the next section which will explain more about what is in the Substrate Package while things are compiling.

1. Clone the Substrate Package

    ```bash
    git clone https://github.com/substrate-developer-hub/substrate-package
    ```
2. Initialize the Git submodules

    ```bash
    cd substrate-package/
    # This will load all the repositories used in the Substrate Package
    git submodule update --init
    ```

3. Initialize your Wasm build environment

    ```bash
    cd substrate-node-template/
    # This will update rust nightly, add the Wasm32 build target, and install wasm-gc
    ./scripts/init.sh
    ```

4. Compile your Substrate node

    ```bash
    cargo build --release
    ```

This final compilation will take approximately 15 minutes depending on your computer hardware. In that time, read the next section if you want to learn more about the contents of the Substrate Package.


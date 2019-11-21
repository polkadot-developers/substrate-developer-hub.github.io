---
title: "Installing Substrate"
---

To set up your computer to build Substrate, you will need to install some prerequisite software.

## Unix Based Operating Systems

Here are instructions to install Substrate for Mac OS, Arch, or a Debian-based OS like Ubuntu

### Fast Installation

If you want to start building on Substrate quickly, then run this simple one-liner:

```bash
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

This command will install all the dependencies required to build a Substrate node, such as: Rust, OpenSSL, CMake, LLVM, and other prerequisites. It will also install the [Substrate scripts](getting-started/using-the-substrate-scripts.md), simplifying the process for creating your own nodes and modules.

### Full Installation

In addition to all of the items installed via the fast installation, the full installation will also install two Substrate binaries to your computer:

* [subkey](https://github.com/paritytech/substrate/tree/master/bin/subkey): a command line utility that generates or restores Substrate keys.
* [Substrate node](https://github.com/paritytech/substrate/tree/master/bin/node): a copy of the main node included with Substrate, allowing you to easily connect to the Substrate test-net.

You can do the full installation by omitting the `--fast` flag:

```bash
curl https://getsubstrate.io -sSf | bash
```

Once it is done, check that the Substrate node is properly installed by checking its version:

```bash
$ substrate --version
substrate 2.0.0-6f0d28863-x86_64-macos
```

You can do the same with Subkey:

```bash
$ subkey --version
subkey 2.0.0
```

## Windows

If you are trying to set up a Windows computer to build Substrate, do the following:

1. Download and install "Build Tools for Visual Studio:"

    * You can get it at this link: https://aka.ms/buildtools.
    * Run the installation file: `vs_buildtools.exe`.
    * Ensure the "Windows 10 SDK" component is included when installing the Visual C++ Build Tools.
    * Restart your computer.

2. Install Rust:

    * Detailed instructions are provided by the [Rust Book](https://doc.rust-lang.org/book/ch01-01-installation.html#installing-rustup-on-windows).
        * Download from: https://www.rust-lang.org/tools/install.
        * Run the installation file: `rustup-init.exe`.

            > Note that it should **not** prompt you to install `vs_buildtools` since you did it in step 1.

        * Choose "Default Installation."
        * To get started, you need Cargo's bin directory (`%USERPROFILE%\.cargo\bin`) in your PATH environment variable. Future applications will automatically have the correct environment, but you may need to restart your current shell.

3. Run these commands in Command Prompt (`CMD`) to set up your Wasm Build Environment:

    ```bash
    rustup update nightly
    rustup update stable
    rustup target add wasm32-unknown-unknown --toolchain nightly
    ```

4. Install `wasm-gc`, which is used to slim down Wasm files:

    ```bash
    cargo install --git https://github.com/alexcrichton/wasm-gc --force
    ```

5. Install LLVM: https://releases.llvm.org/download.html

6. Install OpenSSL, which we will do with `vcpkg`:

    ```bash
    mkdir C:\Tools
    cd C:\Tools
    git clone https://github.com/Microsoft/vcpkg.git
    cd vcpkg
    .\bootstrap-vcpkg.bat
    .\vcpkg.exe install openssl:x64-windows-static
    ```

7. Add OpenSSL to your System Variables:

    ```bash
    $env:OPENSSL_DIR = 'C:\Tools\vcpkg\installed\x64-windows-static'
    $env:OPENSSL_STATIC = 'Yes'
    [System.Environment]::SetEnvironmentVariable('OPENSSL_DIR', $env:OPENSSL_DIR, [System.EnvironmentVariableTarget]::User)
    [System.Environment]::SetEnvironmentVariable('OPENSSL_STATIC', $env:OPENSSL_STATIC, [System.EnvironmentVariableTarget]::User)
    ```

8. Finally, install `cmake`: https://cmake.org/download/

## Manual Build

If you want to hack on Substrate itself, or manually build the node, you can clone the Substrate repository with:

```bash
git clone https://github.com/paritytech/substrate.git
```

Before you can compile the project, you will need to install build prerequisites. You can take a look at [getsubstrate.io](https://getsubstrate.io/) to see the exact prerequisites needed for your operating system.

Then you can build the node with

```bash
# Update your rust toolchain
./scripts/init.sh

# Build the native node
cargo build
```

You can also build the `subkey` tool with

```bash
cargo build -p subkey
```

More information is available in the [project readme](https://github.com/paritytech/substrate/#substrate).

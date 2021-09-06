---
title: Getting Started on Windows
---

> NOTE: Native development of substrate is _not_ very well supported! It is _highly_ recommend to
> use [Windows Subsystem Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) (WSL)
> and follow the instructions for [Ubuntu/Debian](index#ubuntudebian). 

> Substrate development is easiest on Unix-based operating systems like macOS or Linux. The examples
in the Substrate [Tutorials](../../../../tutorials) and [Recipes](https://substrate.dev/recipes/)
use Unix-style terminals to demonstrate how to interact with Substrate from the command line.

If you do decide to try and use a Windows computer to _natively_ build Substrate, do the following:

1. Download and install "Build Tools for Visual Studio:"

   - You can get it at this link: https://aka.ms/buildtools.
   - Run the installation file: `vs_buildtools.exe`.
   - Ensure the "Windows 10 SDK" component is included when installing the Visual C++ Build Tools.
   - Restart your computer.

2. Install Rust:

   - Detailed instructions are provided by the
     [Rust Book](https://doc.rust-lang.org/book/ch01-01-installation.html#installing-rustup-on-windows).

     - Download from: https://www.rust-lang.org/tools/install.
     - Run the installation file: `rustup-init.exe`.

       > Note that it should **not** prompt you to install `vs_buildtools` since you did it in
       > step 1.

     - Choose "Default Installation."
     - To get started, you need Cargo's bin directory (`%USERPROFILE%\.cargo\bin`) in your PATH
       environment variable. Future applications will automatically have the correct environment,
       but you may need to restart your current shell.

3. Run these commands in Command Prompt (`CMD`) to set up your Wasm Build Environment:

   ```bash
   rustup update nightly
   rustup update stable
   rustup target add wasm32-unknown-unknown --toolchain nightly
   ```

4. Install LLVM
   
The `llvm-config` binary is required by substrate. but `llvm-config` does not exist in windows prebuilt binaries.
You need to compile from the source code to get it. you can read these documents to build llvm on windows.
   
- [Where is llvm-config in Windows?](https://stackoverflow.com/questions/17096804/where-is-llvm-config-in-windows)
- [How to build LLVM, libclang, and liblld from source](https://github.com/ziglang/zig/wiki/How-to-build-LLVM,-libclang,-and-liblld-from-source#windows)

Or you can directly use the [prebuilt binaries](https://github.com/ziglang/zig/wiki/Building-Zig-on-Windows#option-2-using-cmake-and-microsoft-visual-studio)
provided by `zig`.

5. Install OpenSSL with `vcpkg` using PowerShell:

   ```bash
   mkdir C:\Tools
   cd C:\Tools
   git clone https://github.com/Microsoft/vcpkg.git --depth=1
   cd vcpkg
   .\bootstrap-vcpkg.bat
   .\vcpkg.exe install openssl:x64-windows-static
   ```

6. Add OpenSSL to your System Variables using PowerShell:

   ```powershell
   $env:OPENSSL_DIR = 'C:\Tools\vcpkg\installed\x64-windows-static'
   $env:OPENSSL_STATIC = 'Yes'
   [System.Environment]::SetEnvironmentVariable('OPENSSL_DIR', $env:OPENSSL_DIR, [System.EnvironmentVariableTarget]::User)
   [System.Environment]::SetEnvironmentVariable('OPENSSL_STATIC', $env:OPENSSL_STATIC, [System.EnvironmentVariableTarget]::User)
   ```

7. Install `cmake`: https://cmake.org/download/

8. Install `make`
    - This can be done using Chocolatey. First you need to install the Chocolatey package manager: https://chocolatey.org/install
    - Once Chocolatey installed you can install make:

   ```
   choco install make
   ```

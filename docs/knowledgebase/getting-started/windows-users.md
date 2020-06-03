---
title: Getting Started on Windows
---

If you are trying to set up a Windows computer to build Substrate, do the following:

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

4. Install LLVM: https://releases.llvm.org/download.html

5. Install OpenSSL with `vcpkg`:

   ```bash
   mkdir C:\Tools
   cd C:\Tools
   git clone https://github.com/Microsoft/vcpkg.git
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

7. Finally, install `cmake`: https://cmake.org/download/

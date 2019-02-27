---
title: "Installing Substrate"
excerpt: "This page will help you get started with Substrate. You'll be up and running in a jiffy!"
---
[block:api-header]
{
  "title": "Skip to the End..."
}
[/block]
If you're running Mac OS, Ubuntu or Arch, then **with a good internet connection** just run our simple one-liner:
[block:code]
{
  "codes": [
    {
      "code": "curl https://getsubstrate.io -sSf | bash",
      "language": "shell"
    }
  ]
}
[/block]
This will download and setup everything for you, leaving you with a machine ready to go.
[block:api-header]
{
  "title": "The Full Monty"
}
[/block]
To install Substrate onto your machine, you'll need to grab [Rust](https://www.rust-lang.org/en-US/install.html) and ensure your operating system has up to date OpenSSL 1.0, cmake and a C/C++ compiler. Different operating systems and package managers have different means of doing this; consult your operating system's forums on how to get this done.

Next, install the Substrate command line applications:
[block:code]
{
  "codes": [
    {
      "code": "cargo install --git https://github.com/paritytech/substrate subkey;\ncargo install --git https://github.com/paritytech/substrate substrate\n\n",
      "language": "shell"
    }
  ]
}
[/block]
Finally, install the CLI helper scripts from `substrate-up`:
[block:code]
{
  "codes": [
    {
      "code": "git clone https://github.com/paritytech/substrate-up;\ncp -a substrate-up/substrate-* ~/.cargo/bin;\nrm -rf substrate-up",
      "language": "shell"
    }
  ]
}
[/block]
To check Substrate is properly installed, just run `substrate --version`. You should see something like this:
[block:code]
{
  "codes": [
    {
      "code": "$ substrate --version\nsubstrate 0.1.0-3378b221-x86_64-macos",
      "language": "shell"
    }
  ]
}
[/block]
If you get that, then you're ready to proceed!
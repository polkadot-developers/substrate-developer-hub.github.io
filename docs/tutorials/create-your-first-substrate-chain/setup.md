---
title: Set Up Your Computer
---

Normally, we would teach you more about the Substrate blockchain development framework, however,
setting up your computer for Substrate development can take a while.

To optimize your time, we will have you start the setup process. While things are compiling, you can
continue to the next section to learn more about Substrate and what we are building.

## Prerequisites

You will probably need to do some set-up to prepare your computer for Substrate development.

### Substrate Development

> Before you continue, complete the [official Installation guide](../../knowledgebase/getting-started/index.md).
> After `rustup` has been installed and configured, and you've configured the Rust toolchain to default
> to the latest stable version you can return to these steps.

## Compiling the Node Template

Once the prerequisites are installed, you can use Git to clone the Substrate Developer Hub Node
Template, which serves as a good starting point for building on Substrate.

1. Clone the Node Template (version `v3.0.0+monthly-2021-05`).

    ```bash
    git clone -b v3.0.0+monthly-2021-05 --depth 1 https://github.com/substrate-developer-hub/substrate-node-template
    ```
2. Compile the Node Template

    ```bash
    cd substrate-node-template
    # NOTE: you should always use the `--release` flag
    cargo build --release
    # ^^ this will take a while!
    ```

> **You should start building the node template _before_ moving on!**
>
> The time required for the compilation step depends on the hardware you're using.
>
> **Run into issues? Try the [troubleshooting tips](../../../knowledgebase/getting-started/index#troubleshooting-substrate-builds).**

## Install the Front-End Template

This tutorial uses a [ReactJS](https://reactjs.org/) front-end template to allow you to interact
with the Substrate-based blockchain node that you should have started compiling in the previous
step. You can use this same front-end template to create UIs for your own projects in the future.

To use the front-end template, you need [Yarn](https://yarnpkg.com), which itself requires
[Node.js](https://nodejs.org/). If you don't have these tools, you _must_ install them from these
instructions:

- [Install Node.js](https://nodejs.org/en/download/)
- [Install Yarn](https://yarnpkg.com/lang/en/docs/install/)

Now you can proceed to set up the front-end template with these commands.

```bash
# Clone the frontend template from github
git clone -b v3.0.0+monthly-2021-05 --depth 1 https://github.com/substrate-developer-hub/substrate-front-end-template

# Install the dependencies
cd substrate-front-end-template
yarn install
```

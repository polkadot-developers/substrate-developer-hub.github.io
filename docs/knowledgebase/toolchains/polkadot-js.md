---
title: Polkadot-JS
---

The Polkadot-JS project is a collection of tools, interfaces, and libraries around Polkadot and
Substrate.

> **Note:** While the project is named after "Polkadot", know that these tools, interfaces, and
> libraries are fully compatible with any Substrate based chain.

## Polkadot-JS API

The Polkadot-JS API is a library of interfaces for communicating with Polkadot and Substrate nodes.

The API provides application developers the ability to query a node and interact with the Polkadot
or Substrate chains using Javascript.

<a class="btn btn-secondary primary-color text-white" href="https://polkadot.js.org/api/">Documentation</a>
<a class="btn btn-secondary text-white" href="https://github.com/polkadot-js/api">GitHub</a>

### Getting Started

Developer documentation for the Polkadot-JS API can be found on their site. Follow the
[Getting Started](https://polkadot.js.org/docs/api/) guide to learn how to install and start using
the Polkadot-JS API right away.

## Polkadot-JS Apps

The Polkadot-JS Apps is a flexible UI for interacting with a Polkadot or Substrate based node.

This is pre-built user-facing application, allowing access to all features available on Substrate
chains.

<a class="btn btn-secondary primary-color text-white" href="https://polkadot.js.org/apps/">Open
Apps</a>
<a class="btn btn-secondary text-white" href="https://github.com/polkadot-js/apps">GitHub</a>

TODO: Image

### Connecting to Local Node

To connect the Polkadot-JS Apps to your local node, you must go into `Settings` and change the
"endpoint to connect to" to `Local Node (127.0.0.1:9944)`.

> **Note:** If you are connected to the Polkadot-JS Apps over a secure HTTPS connection, you will
> need to use a browser which also supports bridging to an insecure WebSocket endpoint. For example,
> Google Chrome supports this, but Mozilla Firefox does not.

## Polkadot-JS Extension

The Polkadot-JS Extension is a simple proof-of-concept for managing accounts in a browser extension
and allowing the signing of extrinsics using these accounts. It also provides simple interface for
interacting with extension-compliant dApps.

<a class="btn btn-primary" href="https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd">Install
for Chrome</a>
<a class="btn btn-warning" href="https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/">Install
for Firefox</a>
<a class="btn btn-secondary text-white" href="https://github.com/polkadot-js/apps">GitHub</a>

## Next Steps

<!--
### Learn More
* Learn how to interact with a Substrate node via [JSON RPC](TODO).
-->

### Examples

- Clone the
  [Substrate Front End Template](https://github.com/substrate-developer-hub/substrate-front-end-template)
  to start building a custom ReactJS app for your blockchain using Polkadot-JS API.

### References

- Visit the reference docs for the [Polkadot-JS API](https://polkadot.js.org/api/)

- Visit the reference docs for the [Polkadot-JS Common Utilities](https://polkadot.js.org/common/)

<!--
Copyright 2019 Parity Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

---
title: "Deploying a Substrate Node chain"
---
In this guide, we'll deploy a simple chain based upon Substrate Node.
[block:api-header]
{
  "type": "basic",
  "title": "1. Craft a Chain Specification file"
}
[/block]
The first step in creating and deploying a new Substrate Node chain is to create a human-readable "chainspec" file that states all of the various parameters to the new chain. This includes the parameters to each of the runtime modules that the Substrate Node blockchain includes, an initial set of authorities and, perhaps surprisingly, the runtime code itself.

To start, we'll just dump a basic "staging" chainspec into a file ("staging" is one of a few predefined chains that you can use with Substrate Node - we'll use this as a starting point and edit from there):
[block:code]
{
  "codes": [
    {
      "code": "substrate --chain=staging build-spec > ~/Desktop/staging.json\n",
      "language": "shell"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "Help using the command-line",
  "body": "Enter `substrate --help` to view usage instructions for the Substrate command-line."
}
[/block]
Now we'll edit it. Open `~/Desktop/staging.json` in your favourite editor and start replacing things. First, let's give it a new name. At the top of the file, where you see `"name": "Staging Testnet",`, change `Staging Testnet` to `My Chain` (or whatever - be creative). Similarly, where you see `staging_testnet` below it, change that to reflect a lower, snake_case version of you name above.

Next, we'll need to change the authorities/validators and endowed accounts. For this we'll need to identify one or more accounts that we trust to maintain the system and start authoring blocks. For our purposes, we'll just create a new key and use that.

...
[block:callout]
{
  "type": "info",
  "title": "A note on terminology",
  "body": "We sometimes use \"authorities\" and \"validators\" to refer to what seems like the same thing. In fact we do have a fairly strict difference between the two. Authorities are used throughout Substrate and its low-level BFT/finality mechanisms to be the set of keys that are \"in charge\" of consensus. They have their own special type to identify themselves: `AuthorityId`.\n\nThe term \"validator\", however, is used in higher-level contexts to identify one of the set of accounts within the system from which the authorities are derived, and, dependent on the chain, other key groups for system maintenance. In our case, they are identified by `AccountId` and in some cases (like ours, here) they may be binary compatible - both are Ed25519 public keys. In general, however, as using two types implies, they cannot be assumed to be the same and if a conversion is needed, it should be explicitly done."
}
[/block]
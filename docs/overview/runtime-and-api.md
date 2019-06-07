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
title: "Runtime and API"
---
All Substrate chains have a runtime. The runtime is a WebAssembly binary blob that includes a number of entry-points known to the node. Two core entry-points are required as part of the Substrate specification: `execute_block` and `version`. Entry-points are grouped into API feature sets and (in Rust, at least) expressed as traits known as *API traits*. The two that are required are grouped as the *Core* API trait.

APIs beyond Core may be provided to add or support other functionality of the blockchain client. There are a number of standard APIs that help provide functionality for common (though optional) Substrate client components including for runtime module metadata, block authoring and the transaction queue.
[block:api-header]
{
  "title": "Declaring APIs"
}
[/block]
For runtimes built using Rust, the `impl_apis` macro is available to make the marshalling and dispatch of new entry points easy. Runtimes written in other languages will need to implement such logic manually which includes datatype encoding/decoding, managing the passing of arguments and return types through pre-allocated memory and exposing the entry-point functions as public API. (There is a specific ABI based upon the Substrate Simple Codec (`codec`), which is used to encode and decode the arguments for these functions and specify where and how they should be passed.)
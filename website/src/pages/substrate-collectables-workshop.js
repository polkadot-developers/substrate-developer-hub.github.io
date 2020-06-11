/**
 * Copyright 2019 Parity Technologies
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 *     http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This page forwards users to the location of the Substrate Collectables Workshop

const React = require("react");
const Redirect = require("react-router").Redirect;

const siteConfig = require(process.cwd() + "/siteConfig.js");

class Forward extends React.Component {
    render() {
        return ( <
            Redirect redirect = { "https://www.shawntabrizi.com/substrate-collectables-workshop/" }
            config = { siteConfig }
            />
        );
    }
}

module.exports = Forward;
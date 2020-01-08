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

// This page simply redirects a user from `/docs/` to a location of our choice.

const React = require("react");
const Redirect = require("../../core/Redirect");

class Docs extends React.Component {

  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    return (
      <Redirect
        // redirect={docUrl("getting-started")}
        redirect={docUrl("")}
        config={siteConfig}
      />
    );
  }
}

Docs.title = 'Docs';
Docs.description = 'Substrate High Level Documentation';
module.exports = Docs;

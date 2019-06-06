/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const Container = require("../../../../react-bootstrap/Container.js");
const Button = require("../../../../react-bootstrap/Button.js");

function Help(props) {
  const { config: siteConfig, language = "" } = props;
  const { baseUrl, docsUrl } = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
  const langPart = `${language ? `${language}/` : ""}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const SupportResource = props => (
    <div>
      <hr className="mt-5 mb-5" />
      <h2>{props.title}</h2>
      <p>{props.children}</p>
    </div>
  );

  const StackOverflow = props => (
    <SupportResource title="StackOverflow">
        Stack Overflow is a great place to ask code-level questions or if
        you’re stuck with a specific error. Read through the existing
        questions/answers or ask your own!

        <p>Tags:
            <Button variant="info" size="sm" href="https://stackoverflow.com/questions/tagged/substrate" className="ml-1"><code>substrate</code></Button>
            <Button variant="dark" size="sm" href="https://stackoverflow.com/questions/tagged/ink" className="ml-1"><code>ink</code></Button>
            <Button variant="secondary" size="sm" href="https://stackoverflow.com/questions/tagged/parity-io" className="ml-1 primary-color"><code>parity-io</code></Button>
            <Button variant="warning" size="sm" href="https://stackoverflow.com/questions/tagged/rust" className="ml-1"><code>rust</code></Button>
        </p>
    </SupportResource>
  )

  const RiotChat = props => (
    <SupportResource title="Riot Chat">
        Riot is the main form of communication between employees at Parity and the community of people who use Parity products. Drop in to ask technical question, meet others who share your interests, or to keep an eye on whats going on.

        <p>Channels:
            <Button variant="dark" size="sm" href="#" className="ml-1">Substrate Technical</Button>
            <Button variant="dark" size="sm" href="#" className="ml-1">Parity ink! (Smart Contracts)</Button>
            <Button variant="dark" size="sm" href="#" className="ml-1">Polkadot Watercooler</Button>
            <Button variant="dark" size="sm" href="#" className="ml-1">TODO</Button>
        </p>
    </SupportResource>
  )

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Where to get support</h1>
          </header>
          <p>The Substrate community is both technical and friendly.</p>
          <StackOverflow />
          <RiotChat />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;

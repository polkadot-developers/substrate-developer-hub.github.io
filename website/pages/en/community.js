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

const React = require("react");

const Container = require("../../../../react-bootstrap/Container.js");
const Button = require("../../../../react-bootstrap/Button.js");

function Community(props) {
  const { config: siteConfig, language = "" } = props;
  const { baseUrl, docsUrl } = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
  const langPart = `${language ? `${language}/` : ""}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const CommunityResource = props => (
    <div>
      <hr className="mt-5 mb-5" />
      <h2>{props.title}</h2>
      <p>{props.children}</p>
    </div>
  );

  const StackOverflow = () => (
    <CommunityResource title="StackOverflow">
        Stack Overflow is a great place to ask code-level questions or if
        you’re stuck with a specific error. Read through the existing
        questions/answers or ask your own!

        <p>Tags:
            <Button variant="info" size="sm" href="https://stackoverflow.com/questions/tagged/substrate" className="m-1"><code>substrate</code></Button>
            <Button variant="dark" size="sm" href="https://stackoverflow.com/questions/tagged/ink" className="m-1"><code>ink</code></Button>
            <Button variant="secondary" size="sm" href="https://stackoverflow.com/questions/tagged/parity-io" className="m-1 primary-color"><code>parity-io</code></Button>
            <Button variant="warning" size="sm" href="https://stackoverflow.com/questions/tagged/rust" className="m-1"><code>rust</code></Button>
        </p>
    </CommunityResource>
  )

  const RiotChat = () => (
    <CommunityResource title="Riot Chat">
        Riot is the main form of communication between employees at Parity and the community of people who use Parity products. Drop in to ask technical question, meet others who share your interests, or to keep an eye on whats going on.

        <p>Channels:
            <Button variant="dark" size="sm" href="https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org" className="m-1">Substrate Technical</Button>
            <Button variant="dark" size="sm" href="https://riot.im/app/#/room/!tYUCYdSvSYPMjWNDDD:matrix.parity.io" className="m-1">Parity ink! (Smart Contracts)</Button>
            <Button variant="dark" size="sm" href="https://riot.im/app/#/room/!fOOzymDEHiIIUtmlBE:matrix.org" className="m-1">Polkadot Watercooler</Button>
            <Button variant="dark" size="sm" href="https://riot.im/app/#/room/!IWlcTyHSqIEjpUReHD:matrix.parity.io" className="m-1">Parity Watercooler</Button>
        </p>
    </CommunityResource>
  )

  const TwitchStream = () => (
    <CommunityResource title="Twitch Stream">
      You might catch us streaming cool live coding sessions. Follow our channel to make sure you never miss a stream!
      <iframe src="https://player.twitch.tv/?channel=paritylivecoding" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>
      <p>
      <Button variant="secondary" size="sm" href="https://www.twitch.tv/paritylivecoding" style={{"background-color": "#6441A5"}} className="m-1">Twitch Channel ></Button>
      </p>
    </CommunityResource>
  )

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Community</h1>
          </header>
          <p>The Substrate community is both technical and friendly, and we would be happy for you to join!</p>
          <StackOverflow />
          <RiotChat />
          <TwitchStream />
        </div>
      </Container>
    </div>
  );
}

Community.title = 'Community';
Community.description = 'Learn about community resources for Substrate.';
module.exports = Community;

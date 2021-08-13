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
const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash`);
const Container = require("../../../../react-bootstrap/Container");
const Button = require("../../../../react-bootstrap/Button");
const translate = require('../../server/translate').translate;

function Community(props) {
  const { config: siteConfig, language = "" } = props;
  const { baseUrl } = siteConfig;
  const langPart = `${language ? `${language}/` : ""}`;
  const pageUrl = doc => `${baseUrl}${langPart}${doc}`

  const CommunityResource = props => (
    <div>
      <hr className="mt-5 mb-5" />
      <h2>{props.title}</h2>
      <p>{props.children}</p>
    </div>
  );

  const Newsletter = () => (
    <CommunityResource title="Newsletter">
      <p><translate>
        Subscribe to the Substrate newsletter to hear about updates and events.
      </translate></p>
      <Button
        size="sm"
        href="newsletter"
        className="m-1 primary-color"
      >
        <translate>Subscribe</translate>
      </Button>
    </CommunityResource>
  );

  const ElementChat = () => (
    <CommunityResource title={<translate>Element Chat</translate>}>
      <p><translate>
        Element is the main form of communication between Parity staff and the
        community of people who use Parity products. Drop in to ask technical
        questions, meet others who share your interests, or keep an eye on what's
        going on.
      </translate></p>
      <p>
        <translate>Channels:</translate>
        <Button
          target="_blank"
          size="sm"
          href="https://matrix.to/#/#substrate-technical:matrix.org"
          className="m-1 primary-color"
        >
          <translate>Substrate Technical</translate>
        </Button>
        <Button
          target="_blank"
          size="sm"
          href="https://matrix.to/#/#ink:matrix.parity.io"
          className="m-1 primary-color"
        >
          <translate>Smart Contracts & ink!</translate>
        </Button>
        <Button
          target="_blank"
          size="sm"
          href="https://matrix.to/#/#rococo:matrix.parity.io"
          className="m-1 primary-color"
        >
          <translate>Rococo (Parachain)</translate>
        </Button>
        <Button
          target="_blank"
          size="sm"
          href="https://matrix.to/#/#polkadot-watercooler:web3.foundation"
          className="m-1 primary-color"
        >
          <translate>Polkadot Watercooler</translate>
        </Button>
        <Button
          target="_blank"
          size="sm"
          href="https://matrix.to/#/#watercooler:matrix.parity.io"
          className="m-1 primary-color"
        >
          <translate>Parity Watercooler</translate>
        </Button>
      </p>
    </CommunityResource>
  );

  const Seminar = () => (
    <CommunityResource title={<translate>Substrate Seminar</translate>}>
      <p><translate>
        Substrate Seminar is an open Collaborative Learning call where we learn about Substrate
        together. We meet every other Tuesday at 14:00UTC. Ask for help, show off your project,
        learn Substrate, and make friends!
      </translate></p>
      <p>
        <Button
          size="sm"
          href={pageUrl("seminar")}
          className="m-1 primary-color"
        >
          <translate>Seminar Details</translate>
        </Button>
        <Button
          target="_blank"
          size="sm"
          href="https://www.crowdcast.io/e/substrate-seminar"
          className="m-1 primary-color"
        >
          <translate>Join the Seminar</translate>
        </Button>
      </p>
    </CommunityResource>
  );

  const StackOverflow = () => (
    <CommunityResource title="StackOverflow">
      <p><translate>
        Stack Overflow is a great place to ask code-level questions or if you’re
        stuck with a specific error. Read through the existing questions/answers
        or ask your own!
      </translate></p>
      <p>
        <translate>Tags:</translate>
        <Button
          target="_blank"
          size="sm"
          href="https://stackoverflow.com/questions/tagged/substrate"
          className="m-1 primary-color"
        >
          <code>substrate</code>
        </Button>
        <Button
          target="_blank"
          size="sm"
          href="https://stackoverflow.com/questions/tagged/ink"
          className="m-1 primary-color"
        >
          <code>ink</code>
        </Button>
        <Button
          target="_blank"
          size="sm"
          href="https://stackoverflow.com/questions/tagged/parity-io"
          className="m-1 primary-color"
        >
          <code>parity-io</code>
        </Button>
        <Button
          target="_blank"
          size="sm"
          href="https://stackoverflow.com/questions/tagged/polkadot-js"
          className="m-1 primary-color"
        >
          <code>polkadot-js</code>
        </Button>
        <Button
          target="_blank"
          size="sm"
          href="https://stackoverflow.com/questions/tagged/rust"
          className="m-1 primary-color"
        >
          <code>rust</code>
        </Button>
      </p>
    </CommunityResource>
  );

  const Twitter = () => (
    <CommunityResource title="Twitter">
      <p><translate>
        Follow us on Twitter to stay up-to-date.
      </translate></p>
      <p>
        <Button
          size="sm"
          href="https://twitter.com/substrate_io"
          className="m-1 primary-color"
        >
          Substrate
        </Button>
        <Button
          size="sm"
          href="https://twitter.com/paritytech"
          className="m-1 primary-color"
        >
          <translate>Parity Technologies</translate>
        </Button>
        <Button
          size="sm"
          href="https://twitter.com/Polkadot"
          className="m-1 primary-color"
        >
          <translate>Polkadot Network</translate>
        </Button>
        <Button
          size="sm"
          href="https://twitter.com/kusamanetwork"
          className="m-1 primary-color"
        >
          <translate>Kusama Network</translate>
        </Button>
      </p>
    </CommunityResource>
  );

  const Events = () => (
    <CommunityResource title={<translate>Events & Meetups</translate>}>
      <p><translate>
        Find upcoming events where you can get together and talk with other
        Substrate developers.
      </translate></p>
      <p>
        <Button
          target="_blank"
          size="sm"
          href="https://www.meetup.com/parity/"
          className="m-1 primary-color"
        >
          <translate>Events</translate>
        </Button>
      </p>
    </CommunityResource>
  );

  const AwesomeSubstrate = () => (
    <CommunityResource title={<translate>Awesome Substrate</translate>}>
      <p><translate>
        An `awesome list` of community contributed Substrate tooling, tips & ticks, and much more!
      </translate></p>
      <p>
        <Button
          target="_blank"
          size="sm"
          href="https://substrate.dev/awesome-substrate/"
          className="m-1 primary-color"
        >
          <translate>Awesome Substrate</translate>
        </Button>
      </p>
    </CommunityResource>
  );

  return (
    <div>
      <HomeSplash
        siteConfig={siteConfig}
        language={language}
        title={<translate>Community</translate>}
        tagline={<translate>Join the Conversation!</translate>}
        padding={0}
      />
      <div className="mainContainer">
        <Container>
          <h3><translate>
            The Substrate community is both technical and friendly, and we would
            be happy for you to join!
          </translate></h3>
          <ElementChat />
          <Seminar />
          <AwesomeSubstrate />
          <StackOverflow />
          <Twitter />
          <Events />
          <Newsletter />
        </Container>
      </div>
    </div>
  );
}

Community.title = "Community";
Community.description = "Learn about community resources for Substrate.";
module.exports = Community;

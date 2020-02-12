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
  const { baseUrl, docsUrl } = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
  const langPart = `${language ? `${language}/` : ""}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
  const pageUrl = doc => `${baseUrl}${langPart}${doc}`

  const CommunityResource = props => (
    <div>
      <hr className="mt-5 mb-5" />
      <h2>{props.title}</h2>
      <p>{props.children}</p>
    </div>
  );

  const StackOverflow = () => (
    <CommunityResource title="StackOverflow">
      Stack Overflow is a great place to ask code-level questions or if you’re
      stuck with a specific error. Read through the existing questions/answers
      or ask your own!
      <p>
        <translate>Tags:</translate>
        <Button
          target="_blank"
          variant="info"
          size="sm"
          href="https://stackoverflow.com/questions/tagged/substrate"
          className="m-1"
        >
          <code>substrate</code>
        </Button>
        <Button
          target="_blank"
          variant="dark"
          size="sm"
          href="https://stackoverflow.com/questions/tagged/ink"
          className="m-1"
        >
          <code>ink</code>
        </Button>
        <Button
          target="_blank"
          variant="primary"
          size="sm"
          href="https://stackoverflow.com/questions/tagged/parity-io"
          className="m-1"
        >
          <code>parity-io</code>
        </Button>
        <Button
          target="_blank"
          variant="warning"
          size="sm"
          href="https://stackoverflow.com/questions/tagged/rust"
          className="m-1"
        >
          <code>rust</code>
        </Button>
      </p>
    </CommunityResource>
  );

  const RiotChat = () => (
    <CommunityResource title={<translate>Riot Chat</translate>}>
      <translate>
        Riot is the main form of communication between employees at Parity and the
        community of people who use Parity products. Drop in to ask technical
        questions, meet others who share your interests, or keep an eye on what's
        going on.
      </translate>
      <p>
        <translate>Channels:</translate>
        <Button
          target="_blank"
          variant="dark"
          size="sm"
          href="https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org"
          className="m-1"
        >
          Substrate Technical
        </Button>
        <Button
          target="_blank"
          variant="dark"
          size="sm"
          href="https://riot.im/app/#/room/!tYUCYdSvSYPMjWNDDD:matrix.parity.io"
          className="m-1"
        >
          Parity ink! (Smart Contracts)
        </Button>
        <Button
          target="_blank"
          variant="dark"
          size="sm"
          href="https://riot.im/app/#/room/!fOOzymDEHiIIUtmlBE:matrix.org"
          className="m-1"
        >
          Polkadot Watercooler
        </Button>
        <Button
          target="_blank"
          variant="dark"
          size="sm"
          href="https://riot.im/app/#/room/!IWlcTyHSqIEjpUReHD:matrix.parity.io"
          className="m-1"
        >
          Parity Watercooler
        </Button>
      </p>
    </CommunityResource>
  );

  const TwitchStream = () => (
    <CommunityResource title={<translate>Twitch Stream</translate>}>
      <p>
        <translate>
          You might catch us streaming cool live coding sessions. Follow our channel
          to make sure you never miss a stream!
        </translate>
      </p>
      <iframe
        src="https://player.twitch.tv/?channel=paritylivecoding"
        frameBorder="0"
        allowFullScreen={true}
        scrolling="no"
        height="378"
        width="620"
      />
      <p>
        <Button
          target="_blank"
          variant="secondary"
          size="sm"
          href="https://www.twitch.tv/paritylivecoding"
          style={{ backgroundColor: "#6441A5" }}
          className="m-1"
        >
          Twitch Channel >
        </Button>
      </p>
    </CommunityResource>
  );

  const AwesomeSubstrate = () => (
    <CommunityResource title={<translate>Awesome Substrate</translate>}>
      <p>
        <translate>
          An "awesome list" of up-to-date news, events, and onboarding materials for Substrate.
        </translate>
      </p>
      <p>
        <Button
          target="_blank"
          variant="secondary"
          size="sm"
          href="https://substrate.dev/awesome-substrate/"
          className="m-1 primary-color"
        >
          Awesome Substrate
        </Button>
      </p>
    </CommunityResource>
  );

  const Videos = () => (
    <CommunityResource title={<translate>Videos</translate>}>
      <p>
        <translate>
          A list of great videos to help you learn about Substrate.
        </translate>
      </p>
      <p>
        <Button
          variant="secondary"
          size="sm"
          href={pageUrl("videos")}
          className="m-1 primary-color"
        >
          Videos
        </Button>
      </p>
    </CommunityResource>
  );

  const SubstrateSeminar = () => (
    <CommunityResource title={<translate>Substrate Seminar</translate>}>
      <p>
        <translate>
          Substrate Seminar is an open Collaborative Learning call where we learn about Substrate
          together. We meet every Tuesday at 14:00UTC. Ask for help, show off your project,
          learn Substrate, and make friends!
        </translate>
      </p>
      <p>
        <Button
          variant="secondary"
          size="sm"
          href={pageUrl("seminar")}
          className="m-1 primary-color"
        >
          Seminar Details
        </Button>
        <Button
          target="_blank"
          variant="secondary"
          size="sm"
          href="https://zoom.us/j/440029011"
          className="m-1 primary-color"
        >
          Join the Call
        </Button>
        <Button
          target="_blank"
          variant="secondary"
          size="sm"
          href="https://www.youtube.com/playlist?list=PLsBc7YjizKUwc3AcNb9oNZvtsN0QmAJPP"
          className="m-1 primary-color"

        >
          Google Calendar
        </Button>
        <Button
          target="_blank"
          variant="secondary"
          size="sm"
          href="https://www.youtube.com/playlist?list=PLp0_ueXY_enXRfoaW7sTudeQH10yDvFOS"
          className="m-1 primary-color"
        >
          Previous Recordings
        </Button>
      </p>
    </CommunityResource>
  );

  const Events = () => (
    <CommunityResource title={<translate>Events & Meetups</translate>}>
      <p>
        <translate>
          Find upcoming events where you can get together and talk with other
          Substrate developers.
        </translate>
      </p>
      <p>
        <Button
          target="_blank"
          variant="secondary"
          size="sm"
          href="https://www.meetup.com/parity/"
          className="m-1 primary-color"
        >
          Events
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
          <p>
            <translate>
              The Substrate community is both technical and friendly, and we would
              be happy for you to join!
            </translate>
          </p>
          <StackOverflow />
          <RiotChat />
          <Videos />
          <SubstrateSeminar />
          <Events />
          <AwesomeSubstrate />
          <TwitchStream />
        </Container>
      </div>
    </div>
  );
}

Community.title = "Community";
Community.description = "Learn about community resources for Substrate.";
module.exports = Community;

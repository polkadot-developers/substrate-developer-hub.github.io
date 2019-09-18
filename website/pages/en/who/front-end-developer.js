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

const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash.js`);
const { Timeline, Timespot } = require(`${process.cwd()}` +
  `/core/Timeline.js`);

const Container = require("../../../../../react-bootstrap/Container.js");
const Button = require("../../../../../react-bootstrap/Button.js");
const translate = require("../../../server/translate.js").translate;

class FrontEndDeveloper extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    const FrontEndDeveloperTimeline = () => (
      <Timeline>
        <Timespot>
          <h3 className="mt-3">
            <translate>Background</translate>
          </h3>
          <p>
            <translate>
              Substrate exposes a number of endpoints over JSON-RPC. To be able
              to interact with these endpoints, your data needs to be decoded
              and encoded following a standardized codec.
            </translate>
          </p>
          <p>
            <translate>
              To make your life easier, we provide you with a reactive
              Javascript API that wraps all RPC methods exposed by a Polkadot or
              Substrate client and handles all the decoding and encoding for
              you.
            </translate>
          </p>
          <p>
            <translate>
              Following the steps below, you'll be fit to write your own
              frontend applications for Substrate and Polkadot. Please join our
              community on Riot if you have any questions or ask them tagged
              with <code>[substrate]</code> on StackOverflow.
            </translate>
          </p>
          <Button
            variant="secondary"
            href="https://stackoverflow.com/questions/tagged/substrate"
            className="m-1 primary-color"
          >
            <translate>StackOverflow</translate>
          </Button>
          <Button
            variant="secondary"
            href="https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org"
            className="m-1 primary-color"
          >
            <translate>Riot Chat</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>
              Get familiar with Substrate using the Polkadot-JS Apps
            </translate>
          </h3>
          <p>
            <translate>
              Before writing your own code, you should get familiar with what
              Substrate has to offer. The Polkadot-JS Apps are a set of
              applications that reflect Substrate's standard runtime modules.
              They let you explore all built-in features, provide a lot of
              additional information, and even let you interact with your custom
              runtime modules.
            </translate>
          </p>
          <p>
            <translate>
              You don't even need to install anything, just start with the
              Parity-hosted Polkadot and Substrate nodes!
            </translate>
          </p>
          <Button
            variant="secondary"
            href="https://polkadot.js.org/apps"
            className="m-1 primary-color"
          >
            <translate>Polkdot-JS Apps</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>
              Learn how to interact with the Polkadot-JS API
            </translate>
          </h3>
          <p>
            <translate>
              This guide should provide you with all the information needed to
              install the @polkadot/api package, understand the structure of the
              interfaces and allow you to start using it. For existing users
              this really should be titled "Things I wish I knew before I
              started using the api" - it really aims to close the gap to allow
              anybody to get to grips with using the packages.
            </translate>
          </p>
          <Button
            variant="secondary"
            href="https://polkadot.js.org/api/start/"
            className="m-1 primary-color"
          >
            <translate>polkadot-js/api</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>Build a Custom Substrate Front-End</translate>
          </h3>
          <p>
            <translate>
              This is a beginner-level guide to help you get started with
              building the front-end of a decentralized application on top of a
              Substrate blockchain using the Polkadot-js API. This tutorial does
              not require any previous knowledge about the Substrate framework
              or Rust language. It does, however, require knowledge of
              JavaScript as well as a basic knowledge of the React framework.
            </translate>
          </p>
          <Button
            variant="secondary"
            href="https://substrate.dev/docs/en/tutorials/substrate-front-end/"
            className="m-1 primary-color"
          >
            <translate>Start the Tutorial</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>Substrate Front-End Template</translate>
          </h3>
          <p>
            <translate>
              Continue your front-end development journey by hacking on top of
              the Substrate Front-End Template, a React app set up to make
              prototyping easy, and interacting with your Substrate node a
              breeze.
            </translate>
          </p>
          <Button
            variant="secondary"
            href="https://github.com/substrate-developer-hub/substrate-front-end-template"
            className="m-1 primary-color"
          >
            <translate>Clone on GitHub</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>
              Dive into the rest of the Polkadot-JS ecosystem
            </translate>
          </h3>
          <p>
            <translate>
              In addition to the Polkadot-JS API, we provide you with a rich set
              of modules and components to make your life as a Front-End
              Developer as easy as possible. All libraries are published as
              modules on npmjs.com and documented on the Polkadot-JS developer
              portal.
            </translate>
          </p>
          <p>
            <translate>
              Have a look around and explore your tools as a future Substrate
              application developer.
            </translate>
          </p>
          <Button
            variant="secondary"
            href="https://polkadot.js.org/"
            className="m-1 primary-color"
          >
            <translate>Developer Portal</translate>
          </Button>
          <Button
            variant="secondary"
            href="https://polkadot.js.org/api/"
            className="m-1 primary-color"
          >
            <translate>API & Type Docs</translate>
          </Button>
          <Button
            variant="secondary"
            href="https://polkadot.js.org/ui/"
            className="m-1 primary-color"
          >
            <translate>UI packages & libraries</translate>
          </Button>
          <Button
            variant="secondary"
            href="https://polkadot.js.org/"
            className="m-1 primary-color"
          >
            <translate>Common Utilities</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>
              Continue your journey through the Developer Hub!
            </translate>
          </h3>
          <p>
            <translate>
              Substrate still has much more to offer beyond what you see here!
              Continue to explore our developer hub to expand your knowledge
              about this next generation blockchain development framework.
            </translate>
          </p>
          <Button
            variant="secondary"
            href={baseUrl}
            className="m-1 primary-color"
          >
            <translate>Back to Home</translate>
          </Button>
        </Timespot>
      </Timeline>
    );

    return (
      <div>
        <HomeSplash
          siteConfig={siteConfig}
          language={language}
          title="Front-End Developer"
          tagline="So you wanna build amazing user experiences..."
          padding={0}
        />
        <Container>
          <FrontEndDeveloperTimeline />
        </Container>
      </div>
    );
  }
}

FrontEndDeveloper.title = "Front End Developer";
FrontEndDeveloper.description =
  "Learn how to build your custom Javascript Frontends for Substrate and Polkadot.";
module.exports = FrontEndDeveloper;

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
const translate = require('../../../server/translate.js').translate;

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
          <h3 className="mt-3"><translate>Background</translate></h3>
          <p>
            <translate>
              Substrate exposes an number of endpoints over JSON-RPC. To be able to interact with these endpoints, your data needs to be decoded and encoded following a standardized codec.
            </translate>
          </p>
          <p>
            <translate>
              To make your life easier, we provide you with a reactive Javascript API that wraps all RPC methods exposed
              by a Polkadot or Substrate client and handles all the decoding and encoding for you.
            </translate>
          </p>
          <p>
            <translate>
              Following the steps below, you'll be fit to write your own frontend applications for Substrate and Polkadot. 
              Please join our community on Riot if you have any questions or ask them tagged with <code>[substrate]</code> on StackOverflow.
              </translate>
          </p>
          <Button
            variant="secondary"
            href="https://stackoverflow.com/questions/tagged/ink"
            className="m-1 primary-color"
          >
            <translate>StackOverflow</translate>
          </Button>
          <Button
            variant="secondary"
            href="https://riot.im/app/#/room/!tYUCYdSvSYPMjWNDDD:matrix.parity.io"
            className="m-1 primary-color"
          >
            <translate>Riot Chat</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3"><translate>Get familiar with Substrate using the Polkadot-JS Apps</translate></h3>
          <p>
            <translate>
              Before writing your own code, you should get familiar with what Substrate has to offer. The Polkadot-JS Apps are a set of applications that reflect Substrates standard runtime modules. They let you explore all built-in features, provide lot's of additional information and even let you interact with your custom runtime modules.
            </translate>
          </p>
          <p>
            <translate>You don't even need to install anything, just start with the Parity hosted Polkadot and Substrate nodes!</translate>
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
          <h3 className="mt-3"><translate>Dive into the Polkadot-JS ecosystem</translate></h3>
          <p>
            <translate>
              The Polkadot-JS Apps are built on top of the Polkadot-JS API - a type-safe Javascript API that works with both Polkadot and Substrate chains. In addition to that, we're providing you with a rich set of modules and components to make your life as a Frontend Developer as easy as possible. All are published as modules on npmjs.com and documented on the Polkadot-JS developer portal.
            </translate>
          </p>
          <p>
            <translate>Have a look around and explore your tools as a future Substrate Application Developer.</translate>
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
          <h3 className="mt-3"><translate>Learn how to interact with the Polkadot-JS API</translate></h3>
          <p>
            <translate>
              Now it's time to get your hands dirty and to start coding! Download our quick-start template to write your first API calls and learn how to communicate with your Substrate node.
            </translate>
          </p>
          <p><translate>TODO: Write simple template & tutorial</translate></p>
          <Button
            variant="secondary"
            href="https://github.com/polkadot-js/api/"
            className="m-1 primary-color"
          >
            <translate>polkadot-js/api</translate>
          </Button>
          <Button
            variant="secondary"
            href="#"
            className="m-1 primary-color"
          >
            <translate>TODO Link to starter template</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3"><translate>Build your own Application for the Polkadot-JS Apps</translate></h3>
          <p>
            <translate>
              If you don't want to start from scratch and are familiar with Typescript, give it a shot and build your own
              "App" for the Polkadot-JS Apps. The repository comes with a boilerplate application. Just follow the instructions in the README to get strated!
            </translate>
          </p>
          <Button
            variant="secondary"
            href="https://github.com/polkadot-js/apps/tree/master/packages/app-123code"
            className="m-1 primary-color"
          >
            <translate>Boilerplate  App</translate>
          </Button>
          <Button
            variant="secondary"
            href="https://github.com/polkadot-js/apps/tree/master/packages/app-123code"
            className="m-1 primary-color"
          >
            <translate>TODO Example code for `app-123`</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3"><translate>Explore beyond Polkadot-JS</translate></h3>
          <p>
            <translate>
              If you're interested in having a look at an alternate Javascript API, start exploring the
            `oo7-bonds` repository.
            </translate>
          </p>
          <p>
           <translate>
              "Bonds" is an alternative JSON-RPC wrapper around Substrate and Polkadot. It's written in
              plain Javascript and comes with it's own implementation of the SCALE Codec.
              The "Bonds" API is best used together with the "Substrate UI", which is a React based
              single page application.
            </translate>
          </p>
          <Button
            variant="secondary"
            href="https://github.com/paritytech/oo7/tree/master/packages/oo7-substrate"
            className="m-1 primary-color"
          >
            <translate>oo7-substrate</translate>
          </Button>
          <Button
            variant="secondary"
            href="https://github.com/paritytech/substrate-ui"
            className="m-1 primary-color"
          >
            <translate>Substrate UI</translate>
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

FrontEndDeveloper.title = 'Front End Developer';
FrontEndDeveloper.description = 'Learn how to build your custom Javascript Frontends for Substrate and Polkadot.';
module.exports = FrontEndDeveloper;

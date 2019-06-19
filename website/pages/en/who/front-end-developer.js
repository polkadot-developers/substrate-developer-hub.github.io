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
          <h3 className="mt-3">Background</h3>
          <p>
            Substrate exposes an number of endpoints over JSON-RPC. To be able to interact with these endpoints, your data needs to be decoded and encoded following a standardized codec.
          </p>
          <p>
            To make your life easier, we provide you with a reactive Javascript API that wraps all RPC methods exposed
            by a Polkadot or Substrate client and handles all the decoding and encoding for you.
          </p>
          <p>
            Following the steps below, you'll be fit to write your own frontend applications for Substrate and Polkadot. 
            Please join our community on Riot if you have any questions or ask them tagged with <code>[substrate]</code> on StackOverflow.
          </p>
          <Button
            variant="secondary"
            href="https://stackoverflow.com/questions/tagged/ink"
            className="m-1 primary-color"
          >
            StackOverflow
          </Button>
          <Button
            variant="secondary"
            href="https://riot.im/app/#/room/!tYUCYdSvSYPMjWNDDD:matrix.parity.io"
            className="m-1 primary-color"
          >
            Riot Chat
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Get familiar with Substrate using the Polkadot-JS Apps</h3>
          <p>
            Before writing your own code, you should get familiar with what Substrate has to offer. The Polkadot-JS Apps are a set of applications that reflect Substrates standard runtime modules. They let you explore all built-in features, provide lot's of additional information and even let you interact with your custom runtime modules.
          </p>
          <p>
            You don't even need to install anything, just start with the Parity hosted Polkadot and Substrate nodes!
          </p>
          <Button
            variant="secondary"
            href="https://polkadot.js.org/apps"
            className="m-1 primary-color"
          >
            Polkdot-JS Apps
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Dive into the Polkadot-JS ecosystem</h3>
          <p>
            In addition to the JS-API, we're providing you with a rich set of modules and components to make your life as a Frontend Developer as easy as possible. All are published as modules on npmjs.com and documented on the Polkadot-JS developer portal.
          </p>
          <p>Have a look around and explore your tools as a future Substrate Application Developer.</p>
          <Button
            variant="secondary"
            href="https://polkadot.js.org/"
            className="m-1 primary-color"
          >
            Developer Portal
          </Button>
          <Button
            variant="secondary"
            href="https://polkadot.js.org/api/"
            className="m-1 primary-color"
          >
            API & Type Docs
          </Button>
          <Button
            variant="secondary"
            href="https://polkadot.js.org/ui/"
            className="m-1 primary-color"
          >
            UI packages & libraries
          </Button>
          <Button
            variant="secondary"
            href="https://polkadot.js.org/"
            className="m-1 primary-color"
          >
            Common Utilities
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Learn how to interact with the Polkadot-JS API</h3>
          <p>
            The Polkadot-JS Apps are built on top of the Polkadot-JS API — a type-safe Javascript API that works with both Polkadot and Substrate chains. Download our quick-start template to write your first API calls and learn how to communicate with your Substrate node.
          </p>
          <p>TODO: Write simple template & tutorial</p>
          <Button
            variant="secondary"
            href="https://github.com/polkadot-js/api/"
            className="m-1 primary-color"
          >
            polkadot-js/api
          </Button>
          <Button
            variant="secondary"
            href="#"
            className="m-1 primary-color"
          >
            TODO Link to starter template
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Build your own Applocation for the Polkadot-JS Apps</h3>
          <p>
            If you don't want to start from scratch and are familiar with Typescript, you can build your own
            "App" for the Polkadot Apps. The repository comes with a boilerplate application. Just follow the instructions in the README to get strated!
          </p>
          <Button
            variant="secondary"
            href="https://github.com/polkadot-js/apps/tree/master/packages/app-123code"
            className="m-1 primary-color"
          >
            Boilerplate  App
          </Button>
          <Button
            variant="secondary"
            href="https://github.com/polkadot-js/apps/tree/master/packages/app-123code"
            className="m-1 primary-color"
          >
            TODO Example code for `app-123`
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Explore</h3>
          <p>
            If you're interested in having a look at an alternate Javascript API, start exploring the
            `oo7-bonds` repository.
            "Bonds" is an alternative JSON-RPC wrapper around Substrate and Polkadot. It's written in
            plain Javascript and comes with it's own implementation of the SCALE Codec.
            The "Bonds" API is best used together with the "Substrate UI", which is a React based
            single page application.
          </p>
          <Button
            variant="secondary"
            href="https://github.com/paritytech/oo7/tree/master/packages/oo7-substrate"
            className="m-1 primary-color"
          >
            oo7-substrate
          </Button>
          <Button
            variant="secondary"
            href="https://github.com/paritytech/substrate-ui"
            className="m-1 primary-color"
          >
            Substrate UI
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

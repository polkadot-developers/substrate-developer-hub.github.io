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
    const { baseUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    const FrontEndDeveloperTimeline = () => (
      <Timeline>
        <Timespot>
          <h3 className="mt-3">Background</h3>
          <p>
            We provides two different JavaScript libraries that you can work
            with to build user experiences for Substrate.
          </p>
          <p>
            The "Bonds" API is a ReactJS based library which makes it extremely
            simple to start new projects from existing templates. The
            Polkadot-API is a more traditional promise-based library which is a
            bit more robust and better documented for larger projects looking to
            build from the ground up. We will explore both on this journey.
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
            href="https://github.com/polkadot-js/api/"
            className="m-1 primary-color"
          >
            polkadot-js/api
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Launch and Interact with the Substrate UI</h3>
          <p>
            The Substrate UI is a prebuilt template based on the oo7-substrate
            API. It is small, simple, and probably the fastest way to start
            hacking on Substrate user experiences. Clone the repository and
            follow the instructions to start the UI and connect to the public
            network. Then, start a local Substrate node and connect and interact
            with that. TODO: Tutorial.
          </p>
          <Button
            variant="secondary"
            href="https://github.com/paritytech/substrate-ui"
            className="m-1 primary-color"
          >
            Substrate UI
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Make Your First Substrate UI Component</h3>
          <p>To be created...</p>
          <Button variant="secondary" href="#" className="m-1 primary-color">
            TODO
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Launch and Interact with the Polkadot-JS Apps</h3>
          <p>
            The Polkadot-JS Apps (also called the Polkadot UI) is a feature
            packed product which uses the Polkadot-JS API. More to be added
            TODO.
          </p>
          <Button
            variant="secondary"
            href="https://github.com/paritytech/substrate-ui"
            className="m-1 primary-color"
          >
            Polkadot-JS Apps
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Build your first Polkadot-JS App</h3>
          <p>
            Now it is time to actually get your hands dirty and build your own
            "App" for the Polkadot UI. TODO
          </p>
          <Button
            variant="secondary"
            href="https://github.com/polkadot-js/apps/tree/master/packages/app-123code"
            className="m-1 primary-color"
          >
            App 123 Code TODO
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Buidl</h3>
          <p>
            You are now ready to start building your own user experiences! TODO
            community links
          </p>
          <Button
            variant="secondary"
            href={baseUrl}
            className="m-1 primary-color"
          >
            Back to Home
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

module.exports = FrontEndDeveloper;

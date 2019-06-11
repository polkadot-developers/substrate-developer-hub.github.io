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

const Container = require("../../../../react-bootstrap/Container.js");
const Button = require("../../../../react-bootstrap/Button.js");

class RuntimeDeveloper extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const RuntimeDeveloperTimeline = () => (
      <Timeline>
        <Timespot>
          <h5>It's dangerous to go alone!</h5>
          <p>
            Before you start your journey you should become familiar with
            resources that can help you along the way. We have high level
            documentation which can help clarify unknown terms or give you a
            bigger picture about what Substrate is. We have a{" "}
            <code>[substrate]</code> StackOverflow tag which you can use to ask
            technical questions or find existing answers. Finally we have a
            friendly and technical chat room of developers who are happy to help
            you at any point during your journey.
          </p>
          <Button
            variant="secondary"
            href="https://docs.substrate.dev/docs/"
            className="m-1 primary-color"
          >
            High Level Docs
          </Button>
          <Button
            variant="secondary"
            href="https://stackoverflow.com/questions/tagged/substrate"
            className="m-1 primary-color"
          >
            StackOverflow
          </Button>
          <Button
            variant="secondary"
            href="https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org"
            className="m-1 primary-color"
          >
            Riot Chat
          </Button>
        </Timespot>
        <Timespot>
          <h5>Install Substrate</h5>
          <p>
            The first thing you need to do is set up Substrate on your computer!
            The instructions vary depending on which operating system you use,
            so take a look at the guide here to find the instructions that work
            for you.
          </p>
          <Button
            variant="secondary"
            href="https://docs.substrate.dev/docs/getting-started"
            className="m-1 primary-color"
          >
            Installation Instructions
          </Button>
        </Timespot>
        <Timespot>
          <h5>Substrate Collectables Workshop</h5>
          <p>
            Next follow our Substrate Collectables Workshop to get a deep dive
            into runtime development. We will walk you through the end to end
            process of building a non-fungible token DApp chain, running your
            chain, and even building a user interface!
          </p>
          <Button
            variant="secondary"
            href="https://substrate-developer-hub.github.io/substrate-collectables-workshop/"
            className="m-1 primary-color"
          >
            Start the Workshop
          </Button>
        </Timespot>
        <Timespot>
          <h5>Reference Level Documentation</h5>
          <p>
            Now that you are more familiar with Substrate and runtime
            development, you can jump into the reference level documentation
            which lives next to the core Substrate code. To start, you can try
            investigating our Substrate Runtime Module Library (SRML) by
            searching for "srml". You should now be able to read the code which
            powers these modules and extend your knowledge by looking at common
            patterns found within them.
          </p>
          <Button
            variant="secondary"
            href="https://crates.parity.io/"
            className="m-1 primary-color"
          >
            Reference Docs
          </Button>
        </Timespot>
        <Timespot>
          <h5>Buidl</h5>
          <p>
            You are now ready to start building your own Runtime logic! Do not
            forget about the community and documentation resources that we have
            equipped you with on this journey.
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
          title="Runtime Developer"
          tagline="So you wanna build blockchains..."
          padding={0}
        />
        <Container>
          <RuntimeDeveloperTimeline />
        </Container>
      </div>
    );
  }
}

module.exports = RuntimeDeveloper;

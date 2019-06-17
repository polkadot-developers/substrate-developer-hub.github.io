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

class RuntimeDeveloper extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    const RuntimeDeveloperTimeline = () => (
      <Timeline>
        <Timespot>
          <h3 className="mt-3">
            <translate>It's dangerous to go alone!</translate>
          </h3>
          <p>
            <translate>
              Before you start your journey you should become familiar with
              resources that can help you along the way. We have high level
              documentation which can help clarify unknown terms or give you a
              bigger picture about what Substrate is. We have a
            </translate>
            {" "}
            <code>[substrate]</code>
            {" "}
            <translate>
              StackOverflow tag which you can use to ask
              technical questions or find existing answers. Finally we have a
              friendly and technical chat room of developers who are happy to help
              you at any point during your journey.
            </translate>
          </p>
          <Button
            variant="secondary"
            href={docUrl("quickstart/getting-started")}
            className="m-1 primary-color"
          >
            <translate>High Level Docs</translate>
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
            <translate>Riot Chat</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>Install Substrate</translate>
          </h3>
          <p>
            <translate>
              The first thing you need to do is set up Substrate on your computer!
              The instructions vary depending on which operating system you use,
              so take a look at the guide here to find the instructions that work
              for you.
            </translate>
          </p>
          <Button
            variant="secondary"
            href={docUrl("quickstart/installing-substrate")}
            className="m-1 primary-color"
          >
            <translate>Installation Instructions</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Substrate Collectables Workshop</h3>
          <p>
            <translate>
              Next follow our Substrate Collectables Workshop to get a deep dive
              into runtime development. We will walk you through the end to end
              process of building a non-fungible token DApp chain, running your
              chain, and even building a user interface!
            </translate>
          </p>
          <Button
            variant="secondary"
            href="https://substrate-developer-hub.github.io/substrate-collectables-workshop/"
            className="m-1 primary-color"
          >
            <translate>Start the Workshop</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>Reference Level Documentation</translate>
          </h3>
          <p>
            <translate>
              Now that you are more familiar with Substrate and runtime
              development, you can jump into the reference level documentation
              which lives next to the core Substrate code. To start, you can try
              investigating our Substrate Runtime Module Library (SRML) by
              searching for "srml". You should now be able to read the code which
              powers these modules and extend your knowledge by looking at common
              patterns found within them.
            </translate>
          </p>
          <Button
            variant="secondary"
            href="/rustdocs/v1.0/"
            className="m-1 primary-color"
          >
            <translate>Reference Docs</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>Build</translate>
          </h3>
          <p>
            <translate>
              You are now ready to start building your own Runtime logic! Do not
              forget about the community and documentation resources that we have
              equipped you with on this journey.
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
          title={<translate>Runtime Developer</translate>}
          tagline={<translate>So you wanna build blockchains...</translate>}
          padding={0}
        />
        <Container>
          <RuntimeDeveloperTimeline />
        </Container>
      </div>
    );
  }
}

RuntimeDeveloper.title = 'Runtime Developer';
RuntimeDeveloper.description = 'Learn how you can develop custom runtimes with Substrate.';
module.exports = RuntimeDeveloper;

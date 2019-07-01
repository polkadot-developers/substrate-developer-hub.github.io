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

class Architect extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    const ArchitectTimeline = () => (
      <Timeline>
        <Timespot>
          <h3 className="mt-3">
            <translate>High Level Overview</translate>
            </h3>
          <p>
            <translate>
              To start your journey, first we want to make sure you have a high
              level overview of what Substrate is. Explore our Substrate
              Overview, starting with the Introduction page. Also take a look at
              our Glossary so you can become familiar with
              all the terms you encounter.
            </translate>
          </p>
          <Button
            variant="secondary"
            href={docUrl("overview/index")}
            className="m-1 primary-color"
          >
            <translate>Introduction</translate>
          </Button>
          <Button
            variant="secondary"
            href={docUrl("overview/glossary")}
            className="m-1 primary-color"
          >
            <translate>Glossary</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Architecture of a Runtime</h3>
          <p>
            <translate>
              Next, take a look at the architecture of a Substrate runtime. You
              can explore how the modules included in your Runtime are turned into
              primitive Substrate types, which ultimately get exposed via our JSON
              RPC.
            </translate>
          </p>
          <Button
            variant="secondary"
            href={docUrl("runtime/architecture-of-a-runtime")}
            className="m-1 primary-color"
          >
            <translate>Architecture of a Runtime</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>Transaction Lifecycle</translate>
          </h3>
          <p>
            <translate>
              We will now take a look at the lifecycle of a transaction made on
              Substrate, including block production, transaction validation, and
              handling of inherents.
            </translate>
          </p>
          <Button
            variant="secondary"
            href={docUrl("overview/transaction-lifecycle")}
            className="m-1 primary-color"
          >
            <translate>Transaction Lifecycle</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>Integration Tools</translate>
          </h3>
          <p>
            <translate>
              The Substrate framework provides a number of tools to make it easy
              for you to integrate your project. Become familiar with the
              underlying `parity-scale-codec`, which gets used to serialize and
              deserialize messages. Learn about our home-grown Wasm interpreter
              used for our Runtime and Smart Contract layer. Finally, take a look
              at our generic and extensible JSON-RPC proxy, which supports caching
              and load-balancing.
            </translate>
          </p>
          <Button
            variant="secondary"
            href="https://github.com/paritytech/parity-scale-codec"
            className="m-1 primary-color"
          >
            <translate>Parity Scale Codec</translate>
          </Button>
          <Button
            variant="secondary"
            href="https://github.com/paritytech/wasmi"
            className="m-1 primary-color"
          >
            <translate>Wasmi</translate>
          </Button>
          <Button
            variant="secondary"
            href="https://github.com/tomusdrw/jsonrpc-proxy"
            className="m-1 primary-color"
          >
            <translate>JSON RPC Proxy</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>Building decentralized solutions with Substrate</translate>
          </h3>
          <p>
            <translate>We are working on this step.</translate>
          </p>
          <Button variant="secondary" href="#" className="m-1 primary-color">
            <translate>TODO</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>Get in Touch!</translate>
          </h3>
          <p>
            <translate>
              Now that you have a grasp of all the basics, we want to talk with
              you! We are always looking to form new partnerships or
              collaborations. Tell us about your project
              and let us know what we can do to help you accomplish your goals!
            </translate>
          </p>
          <Button
            variant="secondary"
            href="mailto:solutions.parity.io"
            className="m-1 primary-color"
          >
            <translate>Contact Us</translate>
          </Button>
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
          title={<translate>Architect</translate>}
          tagline={<translate>So you wanna change the future...</translate>}
          padding={0}
        />
        <Container>
          <ArchitectTimeline />
        </Container>
      </div>
    );
  }
}

Architect.title = 'Architect';
Architect.description = 'Learn if Substrate is the right framework for your project.';
module.exports = Architect;

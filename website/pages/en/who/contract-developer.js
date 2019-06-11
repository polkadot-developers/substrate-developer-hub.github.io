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

class ContractDeveloper extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    const ContractDeveloperTimeline = () => (
      <Timeline>
        <Timespot>
          <h3 className="mt-3">It's dangerous to go alone!</h3>
          <p>
            Substrate provides Wasm smart contract functionality through the{" "}
            <a href="https://crates.parity.io/srml_contract/index.html">
              Contract module
            </a>
            . <a href="https://github.com/paritytech/ink">ink!</a> is a Rust
            based eDSL for writing smart contracts on this platform. The
            resources below will help you get up to speed on how to use
            Substrate and ink! in the context of writing smart contracts.
          </p>
          <p>
            Both platforms are still in rapid development and may run into
            braking changes in the near future. So join our community on riot
            and ask questions using the <code>[ink]</code> tag on StackOverflow
            so you can get the help you need.
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
          <h3 className="mt-3">Deploy Your First Contract</h3>
          <p>
            Let's get off the ground running by deploying your first contract to
            a local Substrate chain. No development experience is needed here,
            we will just have you set up Substrate and the ink! build
            environment so that you can compile and deploy a simple "flipper"
            contract. You will even use the Polkadot UI to interact with your
            contract in real time!
          </p>
          <Button
            variant="secondary"
            href="https://github.com/paritytech/ink/wiki/Deploying-Your-First-Contract"
            className="m-1 primary-color"
          >
            Start Deploying!
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Writing Your First Contract</h3>
          <p>
            Next we will walk you through the basics of contract development on
            ink!. For this we will assume you have some background in Solidity,
            the language used for building smart contracts on Ethereum.
          </p>
          <Button
            variant="secondary"
            href="https://github.com/paritytech/ink/wiki/Writing-Your-First-Contract"
            className="m-1 primary-color"
          >
            Start Writing!
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Substrate Contracts Workshop</h3>
          <p>
            Now that you have gotten the basics down, you can jump into our end
            to end workshop where we will teach you in detail how to build more
            complicated contracts like an incrementer and ultimately an ERC20
            token.
          </p>
          <Button
            variant="secondary"
            href="https://substrate-developer-hub.github.io/substrate-contracts-workshop"
            className="m-1 primary-color"
          >
            Start the Workshop
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Buidl</h3>
          <p>
            You are now ready to start building your own smart contracts!
            Remember that ink! is still a rapidly developing platform, so take
            advantage of the community resources linked at the beginning of your
            journey and share your experiences!
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
          title="Contract Developer"
          tagline="So you wanna build Wasm smart contracts..."
          padding={0}
        />
        <Container>
          <ContractDeveloperTimeline />
        </Container>
      </div>
    );
  }
}

module.exports = ContractDeveloper;

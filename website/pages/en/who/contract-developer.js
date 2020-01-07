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
const { Timeline, Timespot } = require(`${process.cwd()}` +
  `/core/Timeline`);

const Container = require("../../../../../react-bootstrap/Container");
const Button = require("../../../../../react-bootstrap/Button");
const translate = require("../../../server/translate").translate;

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
          <h3 className="mt-3">
            <translate>It's dangerous to go alone!</translate>
          </h3>
          <p>
            <translate>
              Substrate provides Wasm smart contract functionality through the
            </translate>{" "}
            <a href="/rustdocs/v1.0/srml_contract/index.html">
              <translate>Contracts module</translate>
            </a>
            . <a href="https://github.com/paritytech/ink">ink!</a>{" "}
            <translate desc="description is for ink">
              is a Rust-based eDSL for writing smart contracts on this platform.
              The resources below will help you get up to speed on how to use
              Substrate and ink! in the context of writing smart contracts.
            </translate>
          </p>
          <p>
            <translate>
              Both platforms are still in rapid development and may run into
              breaking changes in the near future. So join our community on Riot
              and ask questions using the <code>[ink]</code> tag on
              StackOverflow so you can get the help you need.
            </translate>
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
            <translate>Riot Chat</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>Learn about Substrate Smart Contracts</translate>
          </h3>
          <p>
            <translate>
              First let's learn a bit more about Substrate smart contracts. Here
              you will learn about the SRML Contracts module, which provides a
              Wasm execution environment for your smart contracts. Then you can
              learn about ink!, a Rust based eDSL for building Wasm smart
              contracts compatible with our Contracts module.
            </translate>
          </p>
          <Button
            variant="secondary"
            href={docUrl("ecosystem/contracts/ink")}
            className="m-1 primary-color"
          >
            <translate>Learn More</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>Substrate Contracts Workshop</translate>
          </h3>
          <p>
            <translate>
              Let's hit the ground running by creating and deploying your first
              smart contract. You can jump into our end-to-end workshop where we
              will teach you in detail how to build simple smart contracts like
              an incrementer and an ERC20 token.
            </translate>
          </p>
          <Button
            variant="secondary"
            href="https://substrate-developer-hub.github.io/substrate-contracts-workshop"
            className="m-1 primary-color"
          >
            <translate>Start the Workshop</translate>
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">
            <translate>Build</translate>
          </h3>
          <p>
            <translate>
              You are now ready to start building your own smart contracts!
              Remember that ink! is still a rapidly developing platform, so take
              advantage of the community resources linked at the beginning of
              your journey and share your experiences!
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
          title={<translate>Contract Developer</translate>}
          tagline={
            <translate>So you wanna build Wasm smart contracts...</translate>
          }
          padding={0}
        />
        <Container>
          <ContractDeveloperTimeline />
        </Container>
      </div>
    );
  }
}

ContractDeveloper.title = "Contract Developer";
ContractDeveloper.description =
  "Learn how you can develop Wasm smart contracts for Substrate.";
module.exports = ContractDeveloper;

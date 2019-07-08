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

const Container = require("../../../../react-bootstrap/Container.js");
const Button = require("../../../../react-bootstrap/Button.js");
const Card = require("../../../../react-bootstrap/Card.js");
const Col = require("../../../../react-bootstrap/Col.js");
const Row = require("../../../../react-bootstrap/Row.js");
const Badge = require("../../../../react-bootstrap/Badge.js");
const translate = require('../../server/translate.js').translate;

class Tutorials extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    const TutorialCards = props =>
      props.data.map(tutorial => (
        <Col md={3} className="mb-3 d-flex align-items-stretch">
          <Card>
            <Card.Img variant="top" src={tutorial.img ? tutorial.img : `${baseUrl}img/substrate-placeholder.png`} />
            <Card.Body className="d-flex flex-column">
              <Card.Title>{tutorial.title}</Card.Title>
              <Card.Text>{tutorial.text}</Card.Text>
              <div className="mt-auto">
                <Badge
                  variant={
                    tutorial.difficulty == `hard`
                      ? `danger`
                      : tutorial.difficulty == `medium`
                      ? `warning`
                      : `success`
                  }
                  className="m-1"
                >
                  {tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)}
                </Badge>
                <Badge variant={
                    tutorial.length > 4
                      ? `danger`
                      : tutorial.length > 2
                      ? `warning`
                      : `success`
                  }
                  className="m-1">
                  {tutorial.length} Hour{tutorial.length > 1 ? `s` : ``}
                </Badge>
                <Badge variant={
                    tutorial.prerequisite == true
                      ? `warning`
                      : `success`
                  }
                  className="m-1">
                  {
                    tutorial.prerequisite == true
                      ? `Prerequisites`
                      : `No Prerequisites`
                  }
                </Badge>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button variant="secondary" className="primary-color" href={tutorial.href}>Try it now!</Button>
            </Card.Footer>
          </Card>
        </Col>
      ));

    const RuntimeRecipes = () => (
      <div>
        <h2>
          <translate>
            Runtime Recipes
          </translate>
        </h2>
        <hr />
        <p>
          <translate>
            Find code samples for common patterns and best practices when developing runtime modules on Substrate:
          </translate>
        </p>
        <p>
          <Button variant="secondary" className="primary-color" href="https://substrate.dev/recipes">
            <translate>
              Substrate Runtime Recipes >
            </translate>
          </Button>
        </p>
      </div>
    )

    const RuntimeTutorials = () => (
      <div>
        <h2>
          <translate>
            Runtime Development
          </translate>
        </h2>
        <hr />
        <Row>
          <TutorialCards
            data={[
              {
                img: `${baseUrl}img/substrate-collectables-workshop.png`,
                title: <translate>Substrate Collectables Workshop</translate>,
                text: <translate>A comprehensive, end-to-end tutorial for creating a non-fungible token chain. Learn all the basics of Substrate runtime development here!</translate>,
                difficulty: "easy",
                length: "5",
                prerequisite: false,
                href: "https://substrate-developer-hub.github.io/substrate-collectables-workshop/"
              },
              {
                title: <translate>Creating Your First Substrate Chain</translate>,
                text: <translate>A minimal, end-to-end guide to build and interact with your first custom Substrate chain.</translate>,
                difficulty: "easy",
                length: "< 1",
                prerequisite: false,
                href: `${docUrl("tutorials/creating-your-first-substrate-chain")}`
              },
              {
                title: <translate>Substrate Token Curated Registry</translate>,
                text: <translate>Build a TCR module using Substrate.</translate>,
                difficulty: "medium",
                length: "3",
                prerequisite: true,
                href: `${docUrl("tutorials/tcr/")}`
              },
              {
                img: `${baseUrl}img/crates.png`,
                title: <translate>Write a Runtime Module in its Own Crate</translate>,
                text: <translate>Make your runtime modules re-usable by packaging them in their own rust crate.</translate>,
                difficulty: "medium",
                length: "2",
                prerequisite: false,
                href: `${docUrl("tutorials/creating-a-runtime-module")}`
              },
              {
                title: <translate>UTXO Workshop</translate>,
                text: <translate>A tutorial teaching you how to build a UTXO chain like Bitcoin using Substrate.</translate>,
                difficulty: "medium",
                length: "2",
                prerequisite: true,
                href: "https://github.com/substrate-developer-hub/utxo-workshop"
              },
              {
                title: "Adding a Module to Your Runtime",
                text: "Add the Contracts module or other SRML modules to your Substrate node template.",
                difficulty: "medium",
                length: "2",
                prerequisite: false,
                href: `${docUrl("tutorials/adding-a-module-to-your-runtime")}`
              },
            ]}
          />
        </Row>
      </div>
    );

    const ContractTutorials = () => (
      <div className="mt-4">
        <h2>
          <translate>
            Smart Contract Development
          </translate>
        </h2>
        <hr />
        <Row>
          <TutorialCards
            data={[
              {
                img: `${baseUrl}img/substrate-contracts-workshop.png`,
                title: <translate>Substrate Contracts Workshop</translate>,
                text: <translate>A comprehensive, end-to-end tutorial for building an ERC20 token using Parity Substrate and ink!.</translate>,
                difficulty: "easy",
                length: "4",
                prerequisite: false,
                href: "https://substrate-developer-hub.github.io/substrate-contracts-workshop/"
              },
              {
                img: `${baseUrl}img/ink-placeholder.png`,
                title: <translate>Deploying Your First Contract</translate>,
                text: <translate>A simple guide that helps you understand the process of deploying smart contracts on Substrate.</translate>,
                difficulty: "easy",
                length: "1",
                prerequisite: false,
                href: `${docUrl("contracts/deploying-a-contract")}`
              },
              {
                img: `${baseUrl}img/ink-placeholder.png`,
                title: <translate>Writing Your First Contract</translate>,
                text: <translate>A simple guide that helps you write your first 'flipper' contract.</translate>,
                difficulty: "easy",
                length: "1",
                prerequisite: false,
                href: `${docUrl("tutorials/creating-your-first-contract")}`
              },
            ]}
          />
        </Row>
      </div>
    );

    const NetworkTutorials = () => (
      <div className="mt-4">
        <h2>
          <translate>
            Running a Network
          </translate>
        </h2>
        <hr />
        <Row>
          <TutorialCards
            data={[
              {
                title: <translate>Start a Private Network with Substrate</translate>,
                text: <translate>Learn to start a blockchain network with a validator/authority set of your choosing using Substrate.</translate>,
                difficulty: "easy",
                length: "2",
                prerequisite: false,
                href: `${docUrl("tutorials/start-a-private-network-with-substrate")}`
              },
            ]}
          />
        </Row>
      </div>
    );

    return (
      <div>
        <HomeSplash
          siteConfig={siteConfig}
          language={language}
          title={<translate>Tutorial Catalog</translate>}
          tagline={<translate>Let's learn together!</translate>}
          padding={0}
        />
        <div className="mainContainer">
          <Container>
            <RuntimeRecipes />
            <RuntimeTutorials />
            <ContractTutorials />
            <NetworkTutorials />
          </Container>
        </div>
      </div>
    );
  }
}

Tutorials.title = 'Tutorials';
Tutorials.description = 'Find the latest tutorials for Substrate.';
module.exports = Tutorials;

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
const translate = require("../../server/translate.js").translate;

class Tutorials extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    const FeaturedTutorialCards = props =>
      props.data.map(tutorial => (
        <a href={tutorial.href} target="_blank" className="a_wrapper">
        <Col md={3} className="mb-5 d-flex align-items-stretch">
          <Card>
            <Card.Img
              variant="top"
              src={
                tutorial.img
                  ? tutorial.img
                  : `${baseUrl}img/substrate-placeholder.png`
              }
            />
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
                  {tutorial.difficulty.charAt(0).toUpperCase() +
                    tutorial.difficulty.slice(1)}
                </Badge>
                <Badge
                  variant={
                    tutorial.length > 4
                      ? `danger`
                      : tutorial.length > 2
                      ? `warning`
                      : `success`
                  }
                  className="m-1"
                >
                  {tutorial.length} Hour{tutorial.length > 1 ? `s` : ``}
                </Badge>
                <Badge
                  variant={
                    tutorial.prerequisite == true ? `warning` : `success`
                  }
                  className="m-1"
                >
                  {tutorial.prerequisite == true
                    ? `Prerequisites`
                    : `No Prerequisites`}
                </Badge>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button
                variant="secondary"
                className="primary-color"
                href={tutorial.href}
                target="_blank"
              >
                Try it now!
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        </a>
      ));

      const OtherTutorialCards = props =>
      props.data.map(tutorial => (
        <a href={tutorial.href} target="_blank" className="a_wrapper">
        <Col md={3} className="mb-5 d-flex align-items-stretch">
          <Card>
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
                  {tutorial.difficulty.charAt(0).toUpperCase() +
                    tutorial.difficulty.slice(1)}
                </Badge>
                <Badge
                  variant={
                    tutorial.length > 4
                      ? `danger`
                      : tutorial.length > 2
                      ? `warning`
                      : `success`
                  }
                  className="m-1"
                >
                  {tutorial.length} Hour{tutorial.length > 1 ? `s` : ``}
                </Badge>
                <Badge
                  variant={
                    tutorial.prerequisite == true ? `warning` : `success`
                  }
                  className="m-1"
                >
                  {tutorial.prerequisite == true
                    ? `Prerequisites`
                    : `No Prerequisites`}
                </Badge>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button
                variant="secondary"
                className="primary-color"
                href={tutorial.href}
                target="_blank"
              >
                Try it now!
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        </a>
      ));

    const RuntimeRecipes = () => (
      <div>
        <h2>
          <translate>Runtime Recipes</translate>
        </h2>
        <hr />
        <p>
          <translate>
            Find code samples for common patterns and best practices when
            developing runtime modules on Substrate:
          </translate>
        </p>
        <p>
          <Button
            target="_blank"
            variant="secondary"
            className="primary-color"
            href="https://substrate.dev/recipes"
          >
            <translate>Substrate Runtime Recipes ></translate>
          </Button>
        </p>
      </div>
    );

    const RecommendedTutorials = () => (
      <div>
        <h2>
          <translate>Try these first!</translate>
        </h2>
        <hr />
        <Row>
          <FeaturedTutorialCards
            data={[
              {
                img: `${baseUrl}img/first-substrate-chain.png`,
                title: (
                  <translate>Creating Your First Substrate Chain</translate>
                ),
                text: (
                  <translate>
                    A minimal, end-to-end guide to build and interact with your
                    first custom Substrate chain.
                  </translate>
                ),
                difficulty: "easy",
                length: "< 1",
                prerequisite: false,
                href: `${docUrl(
                  "next/tutorials/creating-your-first-substrate-chain"
                )}`
              },
              {
                img: `${baseUrl}img/substrate-network.png`,
                title: (
                  <translate>Start a Private Network with Substrate</translate>
                ),
                text: (
                  <translate>
                    Learn to start a blockchain network using an
                    out-of-the-box Substrate node.
                  </translate>
                ),
                difficulty: "easy",
                length: "2",
                prerequisite: false,
                href: `${docUrl(
                  "next/tutorials/start-a-private-network"
                )}`
              },
              {
                img: `${baseUrl}img/substrate-collectables-workshop.png`,
                title: <translate>Substrate Collectables Workshop</translate>,
                text: (
                  <translate>
                    A comprehensive, end-to-end tutorial for creating a
                    non-fungible token chain.
                  </translate>
                ),
                difficulty: "easy",
                length: "5",
                prerequisite: false,
                href:
                  "https://substrate-developer-hub.github.io/substrate-collectables-workshop/"
              },
              {
                img: `${baseUrl}img/ink-smart-contracts-tutorial.png`,
                title: <translate>ink! Smart Contracts Tutorial</translate>,
                text: (
                  <translate>
                    A comprehensive, end-to-end tutorial for building an ERC20
                    token contract using ink!.
                  </translate>
                ),
                difficulty: "easy",
                length: "4",
                prerequisite: false,
               href:
                  "https://substrate-developer-hub.github.io/substrate-contracts-workshop/"
              }
            ]}
          />
        </Row>
      </div>
    );

    const OtherTutorials = () => (
      <div className="mt-4">
        <h2>
          <translate>Other Tutorials</translate>
        </h2>
        <hr />
        <Row>
          <OtherTutorialCards
            data={[
              {
                img: `${baseUrl}img/polkadot-js-substrate-tutorial.png`,
                title: (
                  <translate>Build a Front End with Polkadot-js API</translate>
                ),
                text: (
                  <translate>
                    Learn to build a front-end application interacting with a
                    Substrate based blockchain.
                  </translate>
                ),
                difficulty: "easy",
                length: "2",
                prerequisite: false,
                href: `${docUrl("tutorials/substrate-front-end")}`
              },

              {
                title: (
                  <translate>
                    Substrate Verifiable Credentials Workshop
                  </translate>
                ),
                text: (
                  <translate>
                    A comprehensive, end-to-end tutorial for creating an
                    infrastructure chain for verifiable credentials. Learn all
                    the basics of Substrate runtime development here!
                  </translate>
                ),
                difficulty: "easy",
                length: "3",
                prerequisite: false,
                href: "https://substrate.dev/substrate-verifiable-credentials/"
              },
              {
                title: <translate>Substrate Token Curated Registry</translate>,
                text: (
                  <translate>Build a TCR module using Substrate.</translate>
                ),
                difficulty: "medium",
                length: "3",
                prerequisite: true,
                href: `${docUrl("tutorials/tcr/")}`
              },
              {
                img: `${baseUrl}img/crates.png`,
                title: (
                  <translate>Write a Runtime Module in its Own Crate</translate>
                ),
                text: (
                  <translate>
                    Make your runtime modules re-usable by packaging them in
                    their own rust crate.
                  </translate>
                ),
                difficulty: "medium",
                length: "2",
                prerequisite: false,
                href: `${docUrl("tutorials/creating-a-runtime-module")}`
              },
              {
                title: <translate>UTXO Workshop</translate>,
                text: (
                  <translate>
                    A tutorial teaching you how to build a UTXO chain like
                    Bitcoin using Substrate.
                  </translate>
                ),
                difficulty: "medium",
                length: "2",
                prerequisite: true,
                href: "https://github.com/substrate-developer-hub/utxo-workshop"
              },
              {
                title: "Adding a Module to Your Runtime",
                text:
                  "Add the Contracts module or other SRML modules to your Substrate node template.",
                difficulty: "medium",
                length: "2",
                prerequisite: false,
                href: `${docUrl("tutorials/adding-a-module-to-your-runtime")}`
              },
              {
                title: "Visualizing Node Metrics",
                text:
                  "Learn how to visualize the metrics that Substrate records using Grafana.",
                difficulty: "easy",
                length: "< 1",
                prerequisite: false,
                href: `${docUrl("next/tutorials/visualizing-node-metrics")}`
              }
            ].sort(sort_by_name)}
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
            <RecommendedTutorials />
            <OtherTutorials />
          </Container>
        </div>
      </div>
    );
  }
}

function sort_by_name(a, b) {
  if (a.title < b.title) {
    return -1;
  }
  if (a.title > b.title) {
    return 1;
  }
  return 0;
}

Tutorials.title = "Tutorials";
Tutorials.description = "Find the latest tutorials for Substrate.";
module.exports = Tutorials;

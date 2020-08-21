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

const Container = require("../../../../react-bootstrap/Container");
const Button = require("../../../../react-bootstrap/Button");
const Card = require("../../../../react-bootstrap/Card");
const Col = require("../../../../react-bootstrap/Col");
const Row = require("../../../../react-bootstrap/Row");
const Badge = require("../../../../react-bootstrap/Badge");
const translate = require("../../server/translate").translate;

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
        <a href={tutorial.href} className="a_wrapper">
          <Col xl={3} lg={4} md={6} sm={12} className="mb-5 d-flex align-items-stretch">
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
                  <Badge
                    variant={
                      tutorial.version <= 1
                        ? `danger`
                        : `warning`
                    }
                    className="m-1"
                  >
                    {`v`}{tutorial.version}
                  </Badge>
                </div>
              </Card.Body>
              <Card.Footer className="text-center">
                <Button
                  variant="secondary"
                  className="primary-color"
                  href={tutorial.href}
                >
                  Try it now!
              </Button>
              </Card.Footer>
            </Card>
          </Col>
        </a>
      ));

    const Recipes = () => (
      <div>
        <h2>
          <translate>Runtime Recipes</translate>
        </h2>
        <hr />
        <p>
          <translate>
            Code examples, common patterns, and best practices when
            developing with Substrate:
          </translate>
        </p>
        <p>
          <Button
            variant="secondary"
            className="primary-color"
            href="https://substrate.dev/recipes"
          >
            <translate>Substrate Recipes ></translate>
          </Button>
        </p>
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
            <Row>
              <TutorialCards
                data={[
                  {
                    img: `${baseUrl}img/crates.png`,
                    title: (
                      <translate>Create Your First Substrate Chain</translate>
                    ),
                    text: (
                      <translate>
                        Launch and interact with your first Substrate chain in this minimal end-to-end guide.
                      </translate>
                    ),
                    difficulty: "easy",
                    length: "< 1",
                    prerequisite: false,
                    version: "2.0.0-rc6",
                    href: `${docUrl(
                      "tutorials/create-your-first-substrate-chain/"
                    )}`
                  },
                  {
                    img: `${baseUrl}img/first-substrate-chain.png`,
                    title: (
                      <translate>Build a PoE Decentralized Application</translate>
                    ),
                    text: (
                      <translate>
                        Build a customized Substrate chain with its own user interface.
                      </translate>
                    ),
                    difficulty: "easy",
                    length: "1",
                    prerequisite: true,
                    version: "2.0.0-rc6",
                    href: `${docUrl(
                      "tutorials/build-a-dapp/"
                    )}`
                  },
                  {
                    title: (
                      <translate>Adding a Pallet to Your Runtime</translate>
                    ),
                    text: (
                      <translate>
                        Add the Nicks pallet to your Substrate node template.
                      </translate>
                    ),
                    difficulty: "medium",
                    length: "2",
                    prerequisite: false,
                    version: "2.0.0-rc6",
                    href: `${docUrl(
                      "tutorials/add-a-pallet/")}`
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
                    version: "2.0.0-rc6",
                    href: `${docUrl(
                      "tutorials/start-a-private-network/"
                    )}`
                  },
                  {
                    img: `${baseUrl}img/crates.png`,
                    title: (
                      <translate>Write a Pallet in its Own Crate</translate>
                    ),
                    text: (
                      <translate>
                        Make your pallets re-usable by packaging them in
                        their own rust crate.
                      </translate>
                    ),
                    difficulty: "medium",
                    length: "2",
                    prerequisite: false,
                    version: "2.0.0-rc6",
                    href: `${docUrl("tutorials/create-a-pallet/")}`
                  },
                  {
                    img: `${baseUrl}img/grafana.png`,
                    title: (
                      <translate>Visualizing Node Metrics</translate>
                    ),
                    text: (
                      <translate>
                        Learn how to visualize the metrics that Substrate records using Prometheus.
                      </translate>
                    ),
                    difficulty: "easy",
                    length: "< 1",
                    prerequisite: false,
                    version: "2.0.0-rc5",
                    href: `${docUrl("tutorials/visualize-node-metrics/")}`
                  },
                  {
                    title: (
                      <translate>Add the Contracts Pallet to a Runtime</translate>
                    ),
                    text: (
                      <translate>
                        Add the Contracts pallet to your Substrate node template.
                      </translate>
                    ),
                    difficulty: "medium",
                    length: "2",
                    prerequisite: false,
                    version: "2.0.0-rc4",
                    href: `${docUrl(
                      "tutorials/add-contracts-pallet/")}`
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
                    version: "2.0.0-rc4",
                    href:
                      "https://substrate-developer-hub.github.io/substrate-contracts-workshop/"
                  },
                ]}
              />
            </Row>
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

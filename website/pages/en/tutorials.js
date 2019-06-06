/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash.js`);

const BSContainer = require("../../../../react-bootstrap/Container.js");
const Button = require("../../../../react-bootstrap/Button.js");
const Card = require("../../../../react-bootstrap/Card.js");
const Col = require("../../../../react-bootstrap/Col.js");
const Row = require("../../../../react-bootstrap/Row.js");
const Badge = require("../../../../react-bootstrap/Badge.js");

class Tutorials extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const TutorialCards = props =>
      props.data.map(tutorial => (
        <Col md={3} className="mb-3 d-flex align-items-stretch">
          <Card>
            <Card.Img variant="top" src={tutorial.img ? tutorial.img : `/docs/img/substrate-placeholder.png`} />
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

    const RuntimeTutorials = () => (
      <div>
        <h2>Runtime Development</h2>
        <hr />
        <Row>
          <TutorialCards
            data={[
              {
                img: "/docs/img/substrate-collectables-workshop.png",
                title: "Substrate Collectables Workshop",
                text: "A comprehensive end to end tutorial for creating a non-fungible tokens chain. Learn all the basics of Substrate runtime development here!",
                difficulty: "easy",
                length: "5",
                prerequisite: false,
                href: "https://substrate-developer-hub.github.io/substrate-collectables-workshop/"
              },
              {
                title: "Creating a Custom Substrate Chain",
                text: "A minimal end to end guide to build and interact with your first custom Substrate chain.",
                difficulty: "easy",
                length: "< 1",
                prerequisite: false,
              },
              {
                title: "Substrate Token Curated Registry",
                text: "Build a TCR module using Substrate.",
                difficulty: "medium",
                length: "3",
                prerequisite: true,
              },
              {
                title: "UTXO Workshop",
                text: "A tutorial teaching you how to build a UTXO chain like Bitcoin using Substrate.",
                difficulty: "medium",
                length: "2",
                prerequisite: true,
              },
            ]}
          />
        </Row>
      </div>
    );

    const ContractTutorials = () => (
      <div className="mt-4">
        <h2>Smart Contract Development</h2>
        <hr />
        <Row>
          <TutorialCards
            data={[
              {
                img: "/docs/img/substrate-contracts-workshop.png",
                title: "Substrate Contracts Workshop",
                text: "A comprehensive end to end tutorial for building an ERC20 token using Parity Substrate and ink!.",
                difficulty: "easy",
                length: "4",
                prerequisite: false,
                href: "https://substrate-developer-hub.github.io/substrate-contracts-workshop/"
              },
              {
                img: "/docs/img/ink-placeholder.png",
                title: "Deploying Your First Contract",
                text: "A simple guide which helps you understand the process of deploying smart contracts on Substrate.",
                difficulty: "easy",
                length: "1",
                prerequisite: false,
              },
              {
                img: "/docs/img/ink-placeholder.png",
                title: "Writing Your First Contract",
                text: "A simple guide which helps you write your first 'flipper' contract.",
                difficulty: "easy",
                length: "1",
                prerequisite: false,
              },
            ]}
          />
        </Row>
      </div>
    );

    const NetworkTutorials = () => (
      <div className="mt-4">
        <h2>Running a Network</h2>
        <hr />
        <Row>
          <TutorialCards
            data={[
              {
                title: "Start a Private Network with Substrate",
                text: "Learn to start a blockchain network with a validator/authority set of your choosing using Substrate.",
                difficulty: "easy",
                length: "2",
                prerequisite: false,
                href: "https://docs.substrate.dev/docs/deploying-a-substrate-node-chain"
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
          title="Tutorial Catalog"
          tagline="Let us guide you."
          padding={0}
        />
        <div className="mainContainer">
          <BSContainer>
            <RuntimeTutorials />
            <ContractTutorials />
            <NetworkTutorials />
          </BSContainer>
        </div>
      </div>
    );
  }
}

module.exports = Tutorials;

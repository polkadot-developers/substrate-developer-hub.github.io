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
        <h2>Runtime Recipes</h2>
        <hr />
        <p>Find code samples for common patterns and best practices when developing runtime modules on Substrate:</p>
        <p>
          <Button variant="secondary" className="primary-color" href="/recipes/">Substrate Runtime Recipes ></Button>
        </p>
      </div>
    )

    const RuntimeTutorials = () => (
      <div>
        <h2>Runtime Development</h2>
        <hr />
        <Row>
          <TutorialCards
            data={[
              {
                img: `${baseUrl}img/substrate-collectables-workshop.png`,
                title: "Substrate Collectables Workshop",
                text: "A comprehensive end to end tutorial for creating a non-fungible tokens chain. Learn all the basics of Substrate runtime development here!",
                difficulty: "easy",
                length: "5",
                prerequisite: false,
                href: "https://substrate-developer-hub.github.io/substrate-collectables-workshop/"
              },
              {
                title: "Creating Your First Substrate Chain",
                text: "A minimal end to end guide to build and interact with your first custom Substrate chain.",
                difficulty: "easy",
                length: "< 1",
                prerequisite: false,
                href: `${docUrl("tutorials/creating-your-first-substrate-chain")}`
              },
              {
                title: "Substrate Token Curated Registry",
                text: "Build a TCR module using Substrate.",
                difficulty: "medium",
                length: "3",
                prerequisite: true,
                href: `${docUrl("tutorials/tcr/introduction")}`
              },
              {
                title: "UTXO Workshop",
                text: "A tutorial teaching you how to build a UTXO chain like Bitcoin using Substrate.",
                difficulty: "medium",
                length: "2",
                prerequisite: true,
                href: "https://github.com/substrate-developer-hub/utxo-workshop"
              },
              {
                title: "Substrate Plasma Chain Workshop",
                text: "A tutrial for creating a scalable Plasma chain using Plasm, Plasma Modules",
                difficulty: "medium",
                length: "1",
                prerequisite: true,
                href: "https://github.com/stakedtechnologies/Plasm"
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
                img: `${baseUrl}img/substrate-contracts-workshop.png`,
                title: "Substrate Contracts Workshop",
                text: "A comprehensive end to end tutorial for building an ERC20 token using Parity Substrate and ink!.",
                difficulty: "easy",
                length: "4",
                prerequisite: false,
                href: "https://substrate-developer-hub.github.io/substrate-contracts-workshop/"
              },
              {
                img: `${baseUrl}img/ink-placeholder.png`,
                title: "Deploying Your First Contract",
                text: "A simple guide which helps you understand the process of deploying smart contracts on Substrate.",
                difficulty: "easy",
                length: "1",
                prerequisite: false,
                href: "https://github.com/paritytech/ink/wiki/Deploying-Your-First-Contract"
              },
              {
                img: `${baseUrl}img/ink-placeholder.png`,
                title: "Writing Your First Contract",
                text: "A simple guide which helps you write your first 'flipper' contract.",
                difficulty: "easy",
                length: "1",
                prerequisite: false,
                href: "https://github.com/paritytech/ink/wiki/Writing-Your-First-Contract"
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
          title="Tutorial Catalog"
          tagline="Let's learn together!"
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

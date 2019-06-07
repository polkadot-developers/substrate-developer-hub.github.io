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
const CardDeck = require("../../../../react-bootstrap/CardDeck.js");
const Row = require("../../../../react-bootstrap/Row.js");
const Col = require("../../../../react-bootstrap/Col.js");
const Image = require("../../../../react-bootstrap/Image.js");

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const Feature = props => (
      <Row
        className={
          (props.background
            ? props.background == `dark`
              ? `bg-dark text-white`
              : `bg-` + props.background
            : ``) + ` p-5`
        }
      >
        <Col
          md={7}
          className={props.imageAlign == `right` ? `order-md-1` : `order-md-2`}
        >
          <h2>{props.title}</h2>
          <p className="lead">{props.children}</p>
        </Col>
        <Col
          md={5}
          className={props.imageAlign == `right` ? `order-md-2` : `order-md-1`}
        >
          <Image src={props.image} />
        </Col>
      </Row>
    );

    const Hotspots = () => (
      <Container>
        <CardDeck>
          <Card>
            <Card.Body>
              <Card.Title>Documentation</Card.Title>
              <Card.Text>
                Substrate provides both high level documentation which you can
                find here and reference level documentation as Rust docs.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button
                variant="secondary"
                href="./docs/"
                className="m-1 primary-color"
              >
                High Level Docs
              </Button>
              <Button
                variant="secondary"
                href="https://crates.parity.io"
                className="m-1"
              >
                Reference Docs
              </Button>
            </Card.Footer>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Join the Community</Card.Title>
              <Card.Text>
                Substrate has a rapidly growing, friendly, and technical
                community. Ask questions and work with others who are building
                in the space.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button
                variant="secondary"
                href="https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org"
                className="m-1 primary-color"
              >
                Join the Chat!
              </Button>
              <Button
                variant="secondary"
                href="https://stackoverflow.com/questions/tagged/substrate"
                className="m-1"
              >
                StackOverflow
              </Button>
            </Card.Footer>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Tutorials</Card.Title>
              <Card.Text>
                Substrate has a range of tutorials to take you from 0-60 in a
                short amount of time. Learn about runtime development, building
                smart contracts, setting up a network, and more!
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button
                variant="secondary"
                href="https://substrate-developer-hub.github.io/sandbox/tutorials/"
                className="m-1 primary-color"
              >
                Tutorial Catalog
              </Button>
            </Card.Footer>
          </Card>
        </CardDeck>
      </Container>
    );

    const WhatIsSubstrate = () => (
      <div
        className="productShowcaseSection mb-5 mt-5"
        style={{ textAlign: "center" }}
      >
        <h1>What is Substrate?</h1>
        <h1 className="primary-color-text">&#11015;</h1>
      </div>
    );

    const Substrate1 = () => (
      <Feature
        image={`${baseUrl}img/undraw_programming.svg`}
        imageAlign="right"
        title="Everything you need to build a blockchain."
        background="light"
      >
          <ul className="lead">
            <li>Fast and efficient database.</li>
            <li>
              Modular P2P networking stack in{" "}
              <a href="https://github.com/libp2p">libp2p</a>.
            </li>
            <li>Hot-swappable consensus layer.</li>
            <li>Customizable transaction queue management system.</li>
            <li>Diverse library of runtime modules.</li>
          </ul>
      </Feature>
    );

    const Substrate2 = () => (
      <Feature
        image={`${baseUrl}img/undraw_mind_map.svg`}
        imageAlign="left"
        title="Smart Contract Ready"
      >
        Substrate has a Wasm smart contract platform which you can use out of
        the box. Because Substrate uses Wasm, you can build your smart contracts
        using any compatible language. We have built ink!, a Rust based eDSL for
        this purpose.
      </Feature>
    );

    const Substrate3 = () => (
      <Feature
        background="dark"
        image={`${baseUrl}img/undraw_connected_world.svg`}
        imageAlign="right"
        title="Production Ready"
      >
        Substrate is backbone which powers the Polkadot, a next generation,
        heterogenous, multi-chain network. Most 'parachains' which connect to
        this network also use Substrate for their node. Take a look at all the
        users who are already using Substrate for their projects.
      </Feature>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who else is building on Substrate?</h2>
          <p>These people are shaping the future of Web3.</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl("users.html")}>
              More Substrate Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash
          siteConfig={siteConfig}
          language={language}
          title={siteConfig.title}
          tagline={siteConfig.tagline}
          buttons={[
            { name: "Get Started", href: "./who/" },
            { name: "Try a Tutorial", href: "./tutorials/" }
          ]}
          padding={5}
        />
        <div className="mainContainer">
          <Hotspots />
          <WhatIsSubstrate />
          <Container>
            <Substrate1 />
            <Substrate2 />
            <Substrate3 />
          </Container>
          <Showcase />
        </div>
      </div>
    );
  }
}

module.exports = Index;

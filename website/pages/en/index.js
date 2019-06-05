/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash.js`);

const BSContainer = require("../../../../react-bootstrap/Container.js");
const Button = require("../../../../react-bootstrap/Button.js");
const Card = require("../../../../react-bootstrap/Card.js");
const CardDeck = require("../../../../react-bootstrap/CardDeck.js");

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container
        padding={["bottom", "top"]}
        id={props.id}
        background={props.background}
      >
        <GridBlock
          align="left"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const Hotspots = () => (
      <BSContainer>
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
                className="mr-1 primary-color"
              >
                High Level Docs
              </Button>
              <Button
                variant="secondary"
                href="https://crates.parity.io"
                className="mr-1"
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
                className="mr-1 primary-color"
              >
                Join the Chat!
              </Button>
              <Button
                variant="secondary"
                href="https://stackoverflow.com/questions/tagged/substrate"
                className="mr-1"
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
                className="mr-1 primary-color"
              >
                Tutorial Catalog
              </Button>
            </Card.Footer>
          </Card>
        </CardDeck>
      </BSContainer>
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
      <Block background="light">
        {[
          {
            content:
              "Substrate provides you with:" +
              "<ul>" +
              "<li>A fast and efficient database.</li>" +
              "<li>A modular P2P networking stack in <a href='https://github.com/libp2p'>libp2p</a>.</li>" +
              "<li>A hot-swappable consensus layer using next generation algorithms.</li>" +
              "<li>A customizable transaction queue management system.</li>" +
              "<li>A diverse library of runtime modules.</li>" +
              "</ul>",
            image: `${baseUrl}img/substrate-architecture.svg`,
            imageAlign: "right",
            title: "Everything you need to build a blockchain."
          }
        ]}
      </Block>
    );

    const Substrate2 = () => (
      <Block id="try">
        {[
          {
            content:
              "Substrate has a Wasm smart contract platform which you can use out of the box. Because Substrate uses Wasm, you can build your smart contracts using any compatible language. We have built ink!, a Rust based eDSL for this purpose.",
            image: `${baseUrl}img/undraw_mind_map.svg`,
            imageAlign: "left",
            title: "Smart Contract Ready"
          }
        ]}
      </Block>
    );

    const Substrate3 = () => (
      <Block background="dark">
        {[
          {
            content:
              "Substrate is backbone which powers the Polkadot, a next generation, heterogenous, multi-chain network. Most 'parachains' which connect to this network also use Substrate for their node. Take a look at all the users who are already using Substrate for their projects.",
            image: `${baseUrl}img/undraw_connected_world.svg`,
            imageAlign: "right",
            title: "Production Ready"
          }
        ]}
      </Block>
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
          <Substrate1 />
          <Substrate2 />
          <Substrate3 />
          <Showcase />
        </div>
      </div>
    );
  }
}

module.exports = Index;

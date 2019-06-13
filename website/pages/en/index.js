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
const Row = require("../../../../react-bootstrap/Row.js");
const Col = require("../../../../react-bootstrap/Col.js");
const Image = require("../../../../react-bootstrap/Image.js");

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    const Feature = props => (
      <Row
        className={
          (props.background
            ? props.background == `dark`
              ? `bg-dark text-white`
              : `bg-` + props.background
            : ``) + ` p-sm-5`
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
          <Image src={props.image} alt={props.title}/>
        </Col>
      </Row>
    );

    const HotspotCard = props => (
      <Col md={4} className="mb-3 d-flex align-items-stretch">
        <Card>
          <Card.Body>
            <Card.Title>{props.title}</Card.Title>
            <Card.Text>{props.text}</Card.Text>
          </Card.Body>
          <Card.Footer>{props.children}</Card.Footer>
        </Card>
      </Col>
    );

    const Hotspots = () => (
      <Row>
        <HotspotCard
          title="Documentation"
          text="Substrate provides both high level documentation which you can find here and reference level documentation as Rust docs."
        >
          <Button
            variant="secondary"
            href={docUrl('quickstart/getting-started')}
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
        </HotspotCard>
        <HotspotCard
          title="Join the Community"
          text="Substrate has a rapidly growing, friendly, and technical community. Ask questions and work with others who are building in the space."
        >
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
        </HotspotCard>
        <HotspotCard
          title="Tutorials"
          text="Substrate has a range of tutorials which will get you building on Substrate in a short amount of time. You can also find a bunch of different code snippets for common patterns for runtime development in our Substrate Recipes page."
        >
          <Button
            variant="secondary"
            href={pageUrl('tutorials')}
            className="m-1 primary-color"
          >
            Tutorial Catalog
          </Button>
          <Button
            variant="secondary"
            href="/recipes/"
            className="m-1"
          >
            Substrate Recipes
          </Button>
        </HotspotCard>
      </Row>
    );

    const WhatIsSubstrate = () => (
      <div
        className="productShowcaseSection mb-5 mt-5"
        style={{ textAlign: "center" }}
      >
        <h2 className="text-dark">What is Substrate?</h2>
        <h2 className="primary-color-text">&#11015;</h2>
      </div>
    );

    const Substrate1 = () => (
      <Feature
        image={`${baseUrl}img/undraw_programming.svg`}
        imageAlign="right"
        title="Everything you Need to Build a Blockchain"
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
        title="(Almost) Production Ready"
      >
        Substrate is the backbone which powers Polkadot, a next generation,
        heterogeneous, multi-chain network. Most 'parachains' which will connect to
        this network are also built on Substrate. Substrate is undergoing a security
        audit in preparation for a 2020 release of the Polkadot network. Take a look
        below for some of the users who are already using Substrate for their projects.
      </Feature>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.homepage} key={user.homepage}>
            <img src={user.image} alt={user.name} title={user.name} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Building on Substrate?</h2>
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
            { name: "Get Started", href: `${docUrl('quickstart/getting-started')}` },
            { name: "Try a Tutorial", href: `${pageUrl('tutorials')}`},
          ]}
          padding={5}
        />
        <div className="mainContainer">
          <Container>
            <Hotspots />
            <WhatIsSubstrate />
            <Substrate1 />
            <Substrate2 />
            <Substrate3 />
            <Showcase />
          </Container>
        </div>
      </div>
    );
  }
}

Index.title = 'Official Substrate Documentation for Blockchain Developers';
Index.description = 'Learn to build blockchains using the next generation blockchain framework.';
module.exports = Index;

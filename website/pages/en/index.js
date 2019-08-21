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
const translate = require('../../server/translate.js').translate;

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
          title={<translate>Documentation</translate>}
          text={<translate>Substrate has both high-level documentation, which you can find here, and reference documentation in the form of Rust docs.</translate>}
        >
          <Button
            variant="secondary"
            href={docUrl('getting-started')}
            className="m-1 primary-color"
          >
            <translate>High Level Docs</translate>
          </Button>
          <Button
            variant="secondary"
            href="/rustdocs/v1.0/"
            className="m-1"
          >
            <translate>Reference Docs</translate>
          </Button>
        </HotspotCard>
        <HotspotCard
          title={<translate>Join the Community</translate>}
          text={<translate>Substrate has a rapidly growing, friendly, and technical community. Ask questions and work with others who are building in the space.</translate>}
        >
          <Button
            variant="secondary"
            href="https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org"
            className="m-1 primary-color"
          >
            <translate>Join the Chat!</translate>
          </Button>
          <Button
            variant="secondary"
            href="https://stackoverflow.com/questions/tagged/substrate"
            className="m-1"
          >
            <translate>StackOverflow</translate>
          </Button>
        </HotspotCard>
        <HotspotCard
          title={<translate>Tutorials</translate>}
          text={<translate>Substrate has a range of tutorials that will get you building in a short amount of time. You can also find code snippets for common runtime development patterns on our Substrate Recipes page.</translate>}
        >
          <Button
            variant="secondary"
            href={pageUrl('tutorials')}
            className="m-1 primary-color"
          >
            <translate>Tutorial Catalog</translate>
          </Button>
          <Button
            variant="secondary"
            href="/recipes/"
            className="m-1"
          >
            <translate>Substrate Recipes</translate>
          </Button>
        </HotspotCard>
      </Row>
    );

    const WhatIsSubstrate = () => (
      <div
        className="productShowcaseSection mb-5 mt-5"
        style={{ textAlign: "center" }}
      >
        <h2 className="text-dark">
          <translate>What is Substrate?</translate>
        </h2>
        <h2 className="primary-color-text">&#11015;</h2>
      </div>
    );

    const Substrate1 = () => (
      <Feature
        image={`${baseUrl}img/undraw_programming.svg`}
        imageAlign="right"
        title={<translate>Everything you Need to Build a Blockchain</translate>}
        background="light"
      >
        <ul className="lead">
          <li>
            <translate>Fast and efficient database.</translate>
          </li>
          <li>
            <translate>Modular P2P networking stack in</translate>{" "}
            <a href="https://github.com/libp2p">libp2p</a><translate>.</translate>
          </li>
          <li>
            <translate>Hot-swappable consensus layer.</translate>
          </li>
          <li>
            <translate>Customizable transaction queue management system.</translate>
          </li>
          <li>
            <translate>Diverse library of runtime modules.</translate>
          </li>
        </ul>
      </Feature>
    );

    const Substrate2 = () => (
      <Feature
        image={`${baseUrl}img/undraw_mind_map.svg`}
        imageAlign="left"
        title={<translate>Smart Contract Ready</translate>}
      >
        <translate>
          Substrate has a Wasm smart contract platform that you can use out of
          the box. Because Substrate uses Wasm, you can build your smart contracts
          using any compatible language. We have built ink!, a Rust-based eDSL for
          this purpose.
        </translate>
      </Feature>
    );

    const Substrate3 = () => (
      <Feature
        background="dark"
        image={`${baseUrl}img/undraw_connected_world.svg`}
        imageAlign="right"
        title={<translate>(Almost) Production Ready</translate>}
      >
        <translate>
          Substrate is the backbone that powers Polkadot, a next generation,
          heterogeneous, multi-chain network. Most 'parachains' that will connect to
          this network are also built on Substrate. Substrate is undergoing a security
          audit in preparation for a 2020 release of the Polkadot network. Take a look
          below for some of the users who are already using Substrate for their projects.
        </translate>
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
          <h2>
            <translate>Who is Building on Substrate?</translate>
          </h2>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl("users.html")}>
              <translate>More Substrate Users</translate>
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
          title={<translate>Substrate Developer Hub</translate>}
          tagline={<translate>The place for blockchain innovators.</translate>}
          buttons={[
            { name: <translate>Get Started</translate>, href: `${pageUrl('who')}` },
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

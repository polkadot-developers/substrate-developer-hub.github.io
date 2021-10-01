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

const TutorialCards = props => {
  let { baseUrl, docUrl } = props;
  const tutorialUrl = tut => tut.hrefFrom == 'baseUrl' ? baseUrl(tut.href) : docUrl(tut.href);

  return props.data.map(tutorial => <a href={tutorialUrl(tutorial)} className="a_wrapper">
    <Col xl={3} lg={4} md={6} sm={12} className="mb-5 d-flex align-items-stretch"><Card>
      <Card.Img
        variant="top"
        src={ tutorial.img ? baseUrl(tutorial.img) : baseUrl('img/substrate-placeholder.png') }
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title>{tutorial.title}</Card.Title>
        <Card.Text>{tutorial.text}</Card.Text>
        <div className="mt-auto">
          <Badge
            variant={tutorial.difficulty == `hard`
              ? `danger`
              : tutorial.difficulty == `medium` ? `warning` : `success`
            }
            className="m-1"
          >{tutorial.difficulty}</Badge>
          <Badge
            variant={tutorial.length > 4
              ? `danger`
              : tutorial.length > 2 ? `warning` : `success`
            }
            className="m-1"
          >{tutorial.length}</Badge>
          <Badge
            variant={tutorial.prerequisite == true ? `warning` : `success`}
            className="m-1"
          >{tutorial.prerequisite
            ? <translate>Prerequisites</translate>
            : <translate>No Prerequisites</translate>
          }</Badge>
          <Badge
            variant={tutorial.version <= 1 ? `danger` : `warning`}
            className="m-1"
          >{`v${tutorial.version}`}</Badge>
        </div>
      </Card.Body>

      <Card.Footer className="text-center">
        <Button
          variant="secondary"
          className="primary-color"
          href={tutorialUrl(tutorial)}
        ><translate>Try it now!</translate></Button>
      </Card.Footer>
    </Card></Col>
  </a>);
};

class Tutorials extends React.Component {
  render() {
    // dev-note: This part need to be added in render() function, and cannot be put at the top
    // of the file, as `<translate>` tag need to be called every time it is rendered based on
    // currently selected translation.
    const tutorialCardData = [
      {
        title: <translate>Create Your First Substrate Chain</translate>,
        text: (
          <translate>
            Launch and interact with your first Substrate chain in this minimal end-to-end guide.
          </translate>
        ),
        difficulty: <translate>Easy</translate>,
        length: <translate>&lt; 1 Hour</translate>,
        prerequisite: false,
        version: "3.0.0",
        href: "tutorials/create-your-first-substrate-chain/",
      },
      {
        img: "img/tutorials/crates.png",
        title: <translate>Add Pallets to Your Runtime and Publish Custom Pallets</translate>,
        text: <translate>Learn to add the Nicks pallet to your runtime and publish custom pallets that others can import into their runtimes</translate>,
        difficulty: <translate>Easy</translate>,
        length: <translate>2 Hours</translate>,
        prerequisite: true,
        version: "3.0.0",
        href: "tutorials/add-a-pallet/",
      },
      {
        img: "img/tutorials/first-substrate-chain.png",
        title: <translate>Build a PoE Decentralized Application</translate>,
        text: (
          <translate>Build a customized Substrate chain with its own user interface.</translate>
        ),
        difficulty: <translate>Easy</translate>,
        length: <translate>1 Hour</translate>,
        prerequisite: true,
        version: "3.0.0",
        href: "tutorials/build-a-dapp/",
      },
      {
        img: "img/tutorials/substrate-network.png",
        title: <translate>Start a Private Network with Substrate</translate>,
        text: (
          <translate>
            Learn to start a blockchain network using an out-of-the-box Substrate node.
          </translate>
        ),
        difficulty: <translate>Easy</translate>,
        length: <translate>2 Hours</translate>,
        prerequisite: false,
        version: "3.0.0",
        href: "tutorials/start-a-private-network/",
      },
      {
        title: <translate>Forkless Upgrade a Chain</translate>,
        text: (
          <translate>Perform a forkless runtime upgrade on a running Substrate network.</translate>
        ),
        difficulty: <translate>Medium</translate>,
        length: <translate>2 Hours</translate>,
        prerequisite: true,
        version: "3.0.0",
        href: "tutorials/forkless-upgrade/",
      },
      {
        img: "img/tutorials/substrate-network.png",
        title: <translate>Build a Permissioned Network</translate>,
        text: (
          <translate>
            A comprehensive, end-to-end tutorial for building a permissioned network using
            node-authorization pallet.
          </translate>
        ),
        difficulty: <translate>Easy</translate>,
        length: <translate>1 Hours</translate>,
        prerequisite: true,
        version: "3.0.0",
        href: "tutorials/build-permission-network/",
      },
      {
        img: "img/tutorials/crates.png",
        title: <translate>Add the Contracts Pallet to a Runtime</translate>,
        text: <translate>Add the Contracts pallet to your Substrate node template.</translate>,
        difficulty: <translate>Medium</translate>,
        length: <translate>2 Hours</translate>,
        prerequisite: true,
        version: "3.0.0",
        href: "tutorials/add-contracts-pallet/",
      },
      {
        img: "img/tutorials/ink-smart-contracts-tutorial.png",
        title: <translate>ink! Smart Contracts Tutorial</translate>,
        text: (
          <translate>
            A comprehensive, end-to-end tutorial for building an ERC20 token contract using ink!.
          </translate>
        ),
        difficulty: <translate>Easy</translate>,
        length: <translate>4 Hours</translate>,
        prerequisite: false,
        version: "3.0.0",
        hrefFrom: "baseUrl",
        href: "tutorials/ink-smart-contracts-tutorial/",
      },
      {
        img: 'img/tutorials/relaychain-parachains.png',
        title: <translate>Substrate Cumulus Workshop</translate>,
        text: <translate>A workshop on launching, registering, and interacting with parachains.</translate>,
        difficulty: <translate>Medium</translate>,
        length: <translate>2 Hours</translate>,
        prerequisite: true,
        version: "3.0.0",
        hrefFrom: 'baseUrl',
        href: 'tutorials/substrate-cumulus-workshop/',
      },
      {
        img: "img/tutorials/substrate-evm.png",
        title: <translate>Substrate Frontier Workshop</translate>,
        text: (
          <translate>
            A workshop to configure Substrate node to run Substrate EVM and Solidity contracts.
          </translate>
        ),
        difficulty: <translate>Medium</translate>,
        length: <translate>1 Hour</translate>,
        prerequisite: false,
        version: "3.0.0",
        href: "tutorials/frontier/",
      },
      {
        img: "img/tutorials/grafana.png",
        title: <translate>Visualizing Node Metrics</translate>,
        text: (
          <translate>
            Learn how to visualize the metrics that Substrate records using Prometheus.
          </translate>
        ),
        difficulty: <translate>Easy</translate>,
        length: <translate>&lt; 1 Hour</translate>,
        prerequisite: false,
        version: "3.0.0",
        href: "tutorials/visualize-node-metrics/",
      },
    ];

    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrlHandler = (url) =>
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `${baseUrl}${docsPart}${langPart}${url}`;

    const baseUrlHandler = (url) =>
      url.startsWith("http://") || url.startsWith("https://") ? url : `${baseUrl}${url}`;

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
                baseUrl={baseUrlHandler}
                docUrl={docUrlHandler}
                data={tutorialCardData}
              />
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

Tutorials.title = <translate>Tutorials & Workshops</translate>;
Tutorials.description =
  <translate>Find the latest tutorials and workshops for Substrate.</translate>;
module.exports = Tutorials;

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash.js`);

const BSContainer = require('../../../../react-bootstrap/Container.js')
const Button = require('../../../../react-bootstrap/Button.js')
const Card = require('../../../../react-bootstrap/Card.js')
const CardDeck = require('../../../../react-bootstrap/CardDeck.js')

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="left"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const ShowCase = () => (
      <BSContainer>
        <CardDeck>
          <Card>
            <Card.Body>
              <Card.Title>Documentation</Card.Title>
              <Card.Text>
                Substrate provides both high level documentation which you can find here and reference level documentation as Rust docs.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button variant="primary" href="./docs/" className="mr-1 primary-color">High Level Docs</Button>
              <Button variant="secondary" href="https://crates.parity.io" className="mr-1">Reference Docs</Button>
            </Card.Footer>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Join the Community</Card.Title>
              <Card.Text>
                Substrate has a rapidly growing, friendly, and technical community. Ask questions and work with others who are building in the space.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button variant="primary" href="https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org" className="mr-1 primary-color">Join the Chat!</Button>
              <Button variant="secondary" href="https://stackoverflow.com/questions/tagged/substrate" className="mr-1">StackOverflow</Button>
            </Card.Footer>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Tutorials</Card.Title>
              <Card.Text>
                Substrate has a range of tutorials to take you from 0-60 in a short amount of time. Learn about runtime development, building smart contracts, setting up a network, and more!
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button variant="primary" href="https://substrate-developer-hub.github.io/sandbox/tutorials/" className="mr-1 primary-color">Tutorial Catalog</Button>
            </Card.Footer>
          </Card>
        </CardDeck>
      </BSContainer>
    );

    const WhatIsSubstrate = () => (
      <div
        className="productShowcaseSection mb-5 mt-5"
        style={{ textAlign: 'center' }}>
        <h1>What is Substrate?</h1>
        <h1 className="primary-color-text">&#11015;</h1>
      </div>
    );

    const Substrate1 = () => (
      <Block background="light">
        {[
          {
            content: 'Substrate provides you with:' +
              '<ul>' +
              '<li>Database</li>' +
              '<li>P2P Networking</li>' +
              '<li>Consensus</li>' +
              '<li>Transaction Queue</li>' +
              '<li>Library of Runtime Modules</li>' +
              '</ul>',
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
            title: 'Everything you need to build a blockchain.',
          },
        ]}
      </Block>
    );

    const Substrate2 = () => (
      <Block id="try">
        {[
          {
            content:
              'To make your landing page more attractive, use illustrations! Check out ' +
              '[**unDraw**](https://undraw.co/) which provides you with customizable illustrations which are free to use. ' +
              'The illustrations you see on this page are from unDraw.',
            image: `${baseUrl}img/undraw_code_review.svg`,
            imageAlign: 'left',
            title: 'Wonderful SVG Illustrations',
          },
        ]}
      </Block>
    );

    const Substrate3 = () => (
      <Block background="dark">
        {[
          {
            content:
              'This is another description of how this project is useful',
            image: `${baseUrl}img/undraw_note_list.svg`,
            imageAlign: 'right',
            title: 'Description',
          },
        ]}
      </Block>
    );

    return (
      <div>

        <HomeSplash
          siteConfig={siteConfig}
          language={language}
          title={siteConfig.title}
          tagline={siteConfig.tagline}
          buttons={[
            { "name": "Get Started", "link": "./who/" },
            { "name": "Try a Tutorial", "link": "./tutorials/" }
          ]}
          padding={5}
        />
        <div className="mainContainer">
          <ShowCase />
          <WhatIsSubstrate />
          <Substrate1 />
          <Substrate2 />
          <Substrate3 />
        </div>
      </div>
    );
  }
}

module.exports = Index;

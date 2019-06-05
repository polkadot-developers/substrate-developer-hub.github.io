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
const CardDeck = require("../../../../react-bootstrap/CardDeck.js");

class WhoIndex extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const UserPersonas = () => (
      <CardDeck>
        <Card>
          <Card.Header>
            <h5>Runtime Developer</h5>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              Are you interested to learn more about the modular Substrate
              runtime, and how you can build custom runtime logic using the
              Substrate framework?
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button
              variant="secondary"
              href="./runtime-developer/"
              className="mr-1 primary-color"
            >
              Follow Our Guide!
            </Button>
          </Card.Footer>
        </Card>
        <Card>
          <Card.Header>
            <h5>Contract Developer</h5>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              Are you interested to learn about the Contracts module provided by
              Substrate and how you can build Wasm smart contracts using ink!?
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button
              variant="secondary"
              href="./contract-developer/"
              className="mr-1 primary-color"
            >
              Follow Our Guide!
            </Button>
          </Card.Footer>
        </Card>{" "}
        <Card>
          <Card.Header>
            <h5>Architect</h5>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              Are you a solutions designer interested to learn more about how
              Substrate is built and whether it is the right tool for your
              project?
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button
              variant="secondary"
              href="./architect/"
              className="mr-1 primary-color"
            >
              Follow Our Guide!
            </Button>
          </Card.Footer>
        </Card>
      </CardDeck>
    );

    return (
      <div>
        <HomeSplash
          siteConfig={siteConfig}
          language={language}
          title="Tell us about you!"
          tagline="Let us help you dive into Substrate."
          buttons={[{ name: "Not Sure?", link: "./not-sure/" }]}
          padding={0}
        />
        <div className="mainContainer">
          <BSContainer>
            <UserPersonas />
          </BSContainer>
        </div>
      </div>
    );
  }
}

module.exports = WhoIndex;

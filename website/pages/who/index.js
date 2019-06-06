/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash.js`);

const Container = require("../../../../react-bootstrap/Container.js");
const Button = require("../../../../react-bootstrap/Button.js");
const Card = require("../../../../react-bootstrap/Card.js");
const Row = require("../../../../react-bootstrap/Row.js");
const Col = require("../../../../react-bootstrap/Col.js");

class WhoIndex extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const Persona = params =>
      params.data.map(user => (
        <Col md={4} className="mb-3 d-flex align-items-stretch">
          <Card>
            <Card.Header>
              <h5>{user.name}</h5>
            </Card.Header>
            <Card.Body>
              <Card.Text>{user.text}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button
                variant="secondary"
                href={user.href}
                className="m-1 primary-color"
              >
                Follow Our Guide!
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      ));

    const UserPersonas = () => (
      <Row>
        <Persona
          data={[
            {
              name: "Runtime Developer",
              text:
                "Are you interested to learn more about the modular Substrate runtime, and how you can build custom runtime logic using the Substrate framework?",
              href: "./runtime-developer/"
            },
            {
              name: "Contract Developer",
              text:
                "Are you interested to learn about the Contracts module provided by Substrate and how you can build Wasm smart contracts using ink!?",
              href: "./contract-developer/"
            },
            {
              name: "Front-End Developer",
              text:
                "Are you interested to learn how to build first class user experiences for Substrate?",
              href: "./front-end-developer/"
            },
            {
              name: "Architect",
              text:
                "Are you a solutions designer interested to learn more about how Substrate is built and whether it is the right tool for your project?",
              href: "./architect/"
            }
          ]}
        />
      </Row>
    );

    return (
      <div>
        <HomeSplash
          siteConfig={siteConfig}
          language={language}
          title="Tell us about you!"
          tagline="Let us help you dive into Substrate."
          buttons={[{ name: "Not Sure?", href: "./not-sure/" }]}
          padding={0}
        />
        <div className="mainContainer">
          <Container>
            <UserPersonas />
          </Container>
        </div>
      </div>
    );
  }
}

module.exports = WhoIndex;

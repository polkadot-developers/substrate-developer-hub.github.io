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
const Badge = require("../../../../react-bootstrap/Badge.js");
const Button = require("../../../../react-bootstrap/Button.js");
const Card = require("../../../../react-bootstrap/Card.js");
const Col = require("../../../../react-bootstrap/Col.js");
const Row = require("../../../../react-bootstrap/Row.js");
const translate = require('../../server/translate.js').translate;

class Events extends React.Component {
  render() {
    const {config: siteConfig, language = ""} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    if ((siteConfig.events || []).length === 0) {
      return null;
    }

    function isFeatured(event) {
      if (event.featured) {
        return <Badge variant="success">Featured</Badge>
      }
    }

    const availableEvents = siteConfig.events
      .filter(event => event.endDate > Date.now());

    let eventsCards;
    if (availableEvents.length === 0) {
      eventsCards = <h2>No more events.</h2>
    } else {
      eventsCards = availableEvents
        .map(event => (
          <Col md={3} className="mb-3 d-flex align-items-stretch">
            <Card>
              <Card.Img variant="top" src={event.img ? event.img : `${baseUrl}img/substrate-placeholder.png`}/>
              <Card.Body className="d-flex flex-column">
                <Card.Title>{event.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{event.startDate.toLocaleDateString()} - {event.endDate.toLocaleDateString()}</Card.Subtitle>
                <Card.Text>{event.description}</Card.Text>
                <div className="mt-auto">
                  {isFeatured(event)}
                </div>
              </Card.Body>
              <Card.Footer>
                <Button variant="secondary" className="primary-color" href={event.href}>Join it now!</Button>
              </Card.Footer>
            </Card>
          </Col>
        ));
    }

    return (
      <div>
        <HomeSplash
          siteConfig={siteConfig}
          language={language}
          title="Events"
          tagline="Meet other developers and researchers!"
          padding={0}
        />
        <div className="mainContainer">
          <Container>
            <Row>
              {eventsCards}
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

Events.title = 'Events';
Events.description = 'Find the latest events for Substrate.';
module.exports = Events;

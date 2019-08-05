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

const translate = require("../../server/translate.js").translate;

const Container = require("../../../../react-bootstrap/Container.js");
const Card = require("../../../../react-bootstrap/Card.js");
const Button = require("../../../../react-bootstrap/Button.js");

const Col = require("../../../../react-bootstrap/Col.js");
const Row = require("../../../../react-bootstrap/Row.js");

class Presentations extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    if ((siteConfig.presentations || []).length === 0) {
      return null;
    }

    function isFeatured(presentation) {
      if (presentation.weight < 0) {
        return <Card.Header>Featured</Card.Header>;
      }
    }

    const presentations = siteConfig.presentations.map(presentation => (
      <Col md="6" className="mb-3 d-flex align-items-stretch">
        <Card className="w-100">
          {isFeatured(presentation)}
          <div class="embed-responsive embed-responsive-16by9">
            <iframe
              src={presentation.youtube}
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <Card.Body className="d-flex flex-column">
            <Card.Title>{presentation.title}</Card.Title>
            <Card.Subtitle>
              {presentation.name} -{" "}
              <a href={presentation.homepage}>{presentation.company}</a>
            </Card.Subtitle>
            <br />
            <Card.Text>{presentation.summary}</Card.Text>
            <Card.Text>
              {presentation.location} -{" "}
              {new Date(presentation.date).toLocaleDateString()}
            </Card.Text>
            <Button variant="info" href={presentation.link} target="_blank">
              View Presentation
            </Button>
          </Card.Body>
        </Card>
      </Col>
    ));

    return (
      <div>
        <HomeSplash
          siteConfig={siteConfig}
          language={language}
          title={<translate>Presentations</translate>}
          tagline={<translate>Find great content about Substrate!</translate>}
          padding={0}
        />
        <div className="mainContainer">
          <Container>
            <Row>{presentations}</Row>
          </Container>
        </div>
      </div>
    );
  }
}

Presentations.title = "Presentations";
Presentations.description = "View great content about Substrate.";
module.exports = Presentations;

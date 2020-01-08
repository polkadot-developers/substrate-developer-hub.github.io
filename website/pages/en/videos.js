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

const translate = require("../../server/translate").translate;

const Container = require("../../../../react-bootstrap/Container");
const Card = require("../../../../react-bootstrap/Card");
const Button = require("../../../../react-bootstrap/Button");

const Col = require("../../../../react-bootstrap/Col");
const Row = require("../../../../react-bootstrap/Row");

class Videos extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    if ((siteConfig.videos || []).length === 0) {
      return null;
    }

    function isFeatured(video) {
      if (video.weight < 0) {
        return <Card.Header>Featured</Card.Header>;
      }
    }

    const videos = siteConfig.videos.map(video => (
      <Col key={video} md="6" className="mb-3 d-flex align-items-stretch">
        <Card className="w-100">
          {isFeatured(video)}
          <div className="embed-responsive embed-responsive-16by9">
            <iframe
              src={video.youtube}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <Card.Body className="d-flex flex-column">
            <Card.Title>{video.title}</Card.Title>
            <Card.Subtitle>
              {video.name} -{" "}
              <a href={video.homepage}>{video.company}</a>
            </Card.Subtitle>
            <br />
            <Card.Text>{video.summary}</Card.Text>
            <Card.Text>
              {video.location} -{" "}
              {new Date(video.date).toLocaleDateString()}
            </Card.Text>
            <Button variant="info" href={video.link} target="_blank">
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
          title={<translate>Videos</translate>}
          tagline={<translate>Find great content about Substrate!</translate>}
          padding={0}
        />
        <div className="mainContainer">
          <Container>
            <Row>{videos}</Row>
          </Container>
        </div>
      </div>
    );
  }
}

Videos.title = "Videos";
Videos.description = "View great content about Substrate.";
module.exports = Videos;

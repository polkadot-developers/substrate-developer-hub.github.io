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
const { Timeline, Timespot } = require(`${process.cwd()}` +
  `/core/Timeline.js`);

const Container = require("../../../../../react-bootstrap/Container.js");
const Button = require("../../../../../react-bootstrap/Button.js");

class Architect extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    const ArchitectTimeline = () => (
      <Timeline>
        <Timespot>
          <h3 className="mt-3">Under Construction</h3>
          <p>Someone will fill out this page...</p>
          <Button
            variant="secondary"
            href={docUrl("quickstart/getting-started")}
            className="m-1 primary-color"
          >
            High Level Docs
          </Button>
          <Button
            variant="secondary"
            href="https://stackoverflow.com/questions/tagged/substrate"
            className="m-1 primary-color"
          >
            StackOverflow
          </Button>
          <Button
            variant="secondary"
            href="https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org"
            className="m-1 primary-color"
          >
            Riot Chat
          </Button>
        </Timespot>
        <Timespot>
          <h3 className="mt-3">Restart your journey through the Substrate Developer Hub</h3>
          <Button
            variant="secondary"
            href="../../"
            className="m-1 primary-color"
          >
            Back to Home
          </Button>
        </Timespot>
      </Timeline>
    );

    return (
      <div>
        <HomeSplash
          siteConfig={siteConfig}
          language={language}
          title="Architect"
          tagline="So you wanna change the future..."
          padding={0}
        />
        <Container>
          <ArchitectTimeline />
        </Container>
      </div>
    );
  }
}

module.exports = Architect;

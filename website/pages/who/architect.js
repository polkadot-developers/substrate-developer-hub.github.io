/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash.js`);
const { Timeline, Timespot } = require(`${process.cwd()}` +
  `/core/Timeline.js`);

const Container = require("../../../../react-bootstrap/Container.js");
const Button = require("../../../../react-bootstrap/Button.js");

class Architect extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const ArchitectTimeline = () => (
      <Timeline>
        <Timespot>
          <h5>Under Construction</h5>
          <p>Someone will fill out this page...</p>
          <Button
            variant="secondary"
            href="https://docs.substrate.dev/docs/"
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
          <h5>Restart your journey through the Substrate Developer Hub</h5>
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

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

class NotSure extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const NotSureTimeline = () => (
      <Timeline>
        <Timespot>
          <h5>The Past, Present, and Future of Substrate</h5>
          <iframe
            src="https://www.youtube-nocookie.com/embed/X40Duo7kWOI"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen="true"
            width="560"
            height="315"
            frameborder="0"
          />
        </Timespot>
        <Timespot>
          <h5>Substrate Runtime Module Library Overview</h5>
          <iframe
            src="https://www.youtube-nocookie.com/embed/kpUO8g_Ig0A?start=0&amp;end=2452"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen="true"
            width="560"
            height="315"
            frameborder="0"
          />
        </Timespot>
        <Timespot>
          <h5>Getting Started with Substrate Smart Contracts</h5>
          <iframe
            src="https://www.youtube-nocookie.com/embed/-EJHu0u6hT8?start=0&amp;end=1059"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen="true"
            width="560"
            height="315"
            frameborder="0"
          />
        </Timespot>
        <Timespot>
          <h5>Restart your journey through the Substrate Developer Hub</h5>
          <Button
            variant="secondary"
            href="../../"
            className="mr-1 primary-color"
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
          title="Learn About Substrate"
          tagline="Watch these videos to get up to speed!"
          padding={0}
        />
        <Container>
          <NotSureTimeline />
        </Container>
      </div>
    );
  }
}

module.exports = NotSure;

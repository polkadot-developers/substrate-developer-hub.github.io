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
const Button = require("../../../../react-bootstrap/Button.js");
const translate = require('../../server/translate.js').translate;

function Seminar(props) {
  const { config: siteConfig, language = "" } = props;
  const { baseUrl, docsUrl } = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
  const langPart = `${language ? `${language}/` : ""}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
  const pageUrl = doc => `${baseUrl}${langPart}${doc}`

  return (
    <div>
      <HomeSplash
        siteConfig={siteConfig}
        language={language}
        title={<translate>Substrate Seminar</translate>}
        tagline={<translate>Substrate Collaborative Learning Group</translate>}
        padding={0}
      />
      <div className="mainContainer">
        <Container>
          <p>
            <translate>
              Substrate Seminar is an open Collaborative Learning call where we learn about Substrate
              together. We meet every other Tuesday at 14:00UTC. Ask for help, show off your project,
              learn Substrate, and make friends!
            </translate>
          </p>
          <Button
            variant="secondary"
            size="sm"
            href="https://zoom.us/j/440029011"
            className="m-1 primary-color"
          >
            Join the Call
          </Button>
          <Button
            variant="secondary"
            size="sm"
            href="https://calendar.google.com/calendar/r/eventedit/aTI4MDRrZ2FpcGpzb2NmMmo4cGJqNXMyc2dfMjAxOTA4MjZUMTYwMDAwWiBwYXJpdHkuaW9fMzkzNzkzNDNoMDczdjA2cWh0MXZwcWNlZmNAZw?cid=cGFyaXR5LmlvXzM5Mzc5MzQzaDA3M3YwNnFodDF2cHFjZWZjQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20"
            className="m-1 primary-color"
          >
            Google Calendar
          </Button>
          <Button
            variant="secondary"
            size="sm"
            href="https://www.youtube.com/playlist?list=PLp0_ueXY_enUCPszf_3Q9ZxovLvKm1eMx"
            className="m-1 primary-color"
          >
            Previous Recordings
          </Button>
        </Container>
      </div>
    </div>
  );
}

module.exports = Seminar;

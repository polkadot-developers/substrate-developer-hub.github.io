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

const FullSplash = require(`${process.cwd()}` + `/core/FullSplash.js`);

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
      <FullSplash
        siteConfig={siteConfig}
        language={language}
        title={<translate>Substrate Seminar</translate>}
        tagline={<translate>Substrate Collaborative Learning Group</translate>}
        text={
          <translate>
            Substrate Seminar is an open Collaborative Learning call where we learn about Substrate
            together. We meet every other Monday at 16:00UTC. Ask for help, show off your project,
            learn Substrate, and make friends!
          </translate>
        }
        padding={0}
        buttons={[
          {
            key: 'key',
            href: 'https://calendar.google.com/calendar/r/eventedit/aTI4MDRrZ2FpcGpzb2NmMmo4cGJqNXMyc2dfMjAxOTA4MjZUMTYwMDAwWiBwYXJpdHkuaW9fMzkzNzkzNDNoMDczdjA2cWh0MXZwcWNlZmNAZw?cid=cGFyaXR5LmlvXzM5Mzc5MzQzaDA3M3YwNnFodDF2cHFjZWZjQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20',
            name: 'Google Calendar'
          },
          {
            key: 'key',
            href: 'https://www.youtube.com/playlist?list=PLp0_ueXY_enUCPszf_3Q9ZxovLvKm1eMx',
            name: 'Previous Recordings'
          },
      ]}
      />

        <Container className="readableLineLenght">
        <h2 class="h1">FAQ</h2>
        <h3 class="h2">How should I prepare?</h3>
        <p>
          In general, we start with the packages from the <a href="https://github.com/substrate-developer-hub">Substrate Developer Hub</a> GitHub Organization. You should have the latest <a href="https://github.com/substrate-developer-hub/substrate-node-template">Node Template</a> and <a href="https://github.com/substrate-developer-hub/substrate-front-end-template/">Front End Template</a> built and ready to use.
        </p>
        <p>
          Occasionally, there may be session-specific setup instructions which will be posted here on this page.
        </p>
        <h3 class="h2">
          I am not a [Substrate] developer, can I join just to ask couple of questions??
        </h3>
        <p>
          Yes! The seminar is open to everyone. The content is generally more developer-oriented, but less technical participants and questions are also welcome. If your questions turn out to be off-topic, we'll point you to a better resource.
        </p>
        <h3 class="h2">
          How do I join the call?
        </h3>
        <p>
          We meet using zoom video conferencing. Specifically we meet in <a href="https://zoom.us/j/440029011">https://zoom.us/j/440029011</a>. This link will only work when the call is live, so you may prefer to add this <a href="https://calendar.google.com/calendar/r/eventedit/aTI4MDRrZ2FpcGpzb2NmMmo4cGJqNXMyc2dfMjAxOTA4MjZUMTYwMDAwWiBwYXJpdHkuaW9fMzkzNzkzNDNoMDczdjA2cWh0MXZwcWNlZmNAZw?cid=cGFyaXR5LmlvXzM5Mzc5MzQzaDA3M3YwNnFodDF2cHFjZWZjQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20">Google calendar invitation</a> to you own calendar.
        </p>
        <h3>
          To learn more visit <a href="https://www.parity.io/substrate/" target="_blank">parity.io/substrate</a>
        </h3>
        </Container>

      <div className="bg-light p-5 mt-5">
        <Container className="d-flex justify-content-between">
        <h2 className="m-0">
          Something appealing to someone who scrolled here
        </h2>
        <Button
          href="https://calendar.google.com/calendar/r/eventedit/aTI4MDRrZ2FpcGpzb2NmMmo4cGJqNXMyc2dfMjAxOTA4MjZUMTYwMDAwWiBwYXJpdHkuaW9fMzkzNzkzNDNoMDczdjA2cWh0MXZwcWNlZmNAZw?cid=cGFyaXR5LmlvXzM5Mzc5MzQzaDA3M3YwNnFodDF2cHFjZWZjQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'"
          className="m-1 primary-color btn btn-secondary align-self-center"
        >
          Google Calendar
        </Button>
        </Container>
      </div>
    </div>
  );
}

module.exports = Seminar;

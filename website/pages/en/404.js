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

const Container = require("../../../../react-bootstrap/Container");
const Button = require("../../../../react-bootstrap/Button");
const translate = require('../../server/translate').translate;

class ErrorPage extends React.Component {
  render() {
    return (
      <Container className="text-center">
        <h2 style={{ "fontSize": "400%" }}>404</h2>
        <p><translate>It seems we couldn't come to consensus...</translate></p>
        <hr />
        <p>
          <translate>If you think this is an error, please</translate>&nbsp;
          <a href="https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/issues">
            <translate>open an issue</translate>
          </a>
          !
        </p>
        <p>
          <translate>Alternatively, if you arrive here via a dead link, return to the</translate>
          &nbsp;
          <a href="https://substrate.dev/docs/">
            <translate>documentation homepage</translate>
          </a>
          .
        </p>
        <p>
          <Button href="/" variant="secondary" className="primary-color">
            <translate>Back to Home</translate>
          </Button>
        </p>
      </Container>
    );
  }
}

ErrorPage.title = "Page not found";
ErrorPage.description = "This is not the page you are looking for...";
module.exports = ErrorPage;

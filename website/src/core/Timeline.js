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
const Col = require("react-bootstrap/Col");

class Timeline extends React.Component {
  render() {
    return <ol className="list-unstyled timeline">{this.props.children}</ol>;
  }
}

class Timespot extends React.Component {
  render() {
    return (
      <li className="timeline">
        <Col lg={8}>{this.props.children}</Col>
      </li>
    );
  }
}

module.exports = {
  Timeline,
  Timespot
};

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

const React = require('react');

const CompLibrary = require('../../core/CompLibrary');

const Container = CompLibrary.Container;
const translate = require('../../server/translate').translate;

class Users extends React.Component {
  render() {
    const {config: siteConfig} = this.props;
    if ((siteConfig.users || []).length === 0) {
      return null;
    }

    const editUrl = `${siteConfig.repoUrl}/edit/source/website/data/users.js`;
    const showcase = siteConfig.users.map(user => (
      <a href={user.homepage} key={user.homepage} target="_blank">
        <img src={user.image} alt={user.name} title={user.name} />
        <p className="text-dark">{user.name}</p>
      </a>
    ));

    return (
      <div className="mainContainer">
        <Container padding={['bottom', 'top']}>
          <div className="showcaseSection">
            <div>
              <h1>
                <translate>Who is building on Substrate?</translate>
              </h1>
              <p>
                <translate>These projects are shaping the future of Web3.</translate>
              </p>
            </div>
            <hr />
            <div className="logos">{showcase}</div>
            <hr />
            <p>
              <translate>Are you using Substrate?</translate>
            </p>
            <a href={editUrl} className="button">
              <translate>Add your project</translate>
            </a>
          </div>
        </Container>
      </div>
    );
  }
}

Users.title = 'Users';
Users.description = 'Learn who is currently using Substrate.';
module.exports = Users;

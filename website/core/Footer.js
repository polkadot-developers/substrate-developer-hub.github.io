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

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : "") + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl("getting-started", this.props.language)}>
              Getting Started
            </a>
            <a href={this.pageUrl("tutorials", this.props.language)}>
              Tutorials
            </a>
            <a href="/rustdocs/v1.0/">
              Reference Docs
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a href={this.pageUrl("videos", this.props.language)}>
              Videos
            </a>
            <a
              href="http://stackoverflow.com/questions/tagged/substrate"
              target="_blank"
              rel="noreferrer noopener"
            >
              Stack Overflow
            </a>
            <a href="https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org">Riot Chat</a>
            <a
              href="https://twitter.com/ParityTech"
              target="_blank"
              rel="noreferrer noopener"
            >
              Twitter
            </a>
            <a
              href="https://www.meetup.com/parity/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Events
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href="https://www.parity.io/blog/">Blog</a>
            <a href="https://github.com/paritytech/substrate">Substrate GitHub</a>
            <a href="https://github.com/substrate-developer-hub/">Developer Hub GitHub</a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
          </div>
        </section>

        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;

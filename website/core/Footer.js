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

const translate = require('docusaurus/lib/server/translate').translate;

// note: The <translate>{string}</translate> in this file need to be manually added in
//   `website/data/custom-translation-strings.json`. `yarn write-translations` doesn't cover
//   them. Ref: https://docusaurus.io/docs/en/translation#custom-translation-strings

class Blast extends React.Component {
  render() {
    // note: Doccusaurus v1 doesn't allow for themes or customisation yet
    //   so we have to inline some styles to move our element to top
    let cfg = this.props.config;
    return (
      <div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
#blast {
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 50px;
  background-image: ${cfg.background};
  color: ${cfg.fontColor ? cfg.fontColor : 'white'};
  z-index: 99999;
  text-align: center;
  background-color: #000028;
  transition: background-color 0.2s;
}
#blast:hover {
  background-color: #E91E63;
}

#blast h2 {
  margin: 0;
  line-height: 50px;
}

#blast a {
  display: block;
  color: ${cfg.fontColor ? cfg.fontColor : 'white'};
  text-decoration: underline;
  mix-blend-mode: lighten;
}

#blast img {
  max-height: 50px;
}

body {
  margin-bottom: 50px;
}
`
          }}
        />
        <section id='blast'>
          {cfg.img ? (
            <a href={cfg.link} target="_blank">
              <img src={cfg.img} className='img-fluid' />
            </a>
          ) : (
            <h2>
              {cfg.intro}
              <a href={cfg.link} target="_blank">{cfg.label}</a>
            </h2>
          )}
        </section>
      </div>
    );
  }
}

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
    let blast = this.props.config.blast;
    return (
      <footer className="nav-footer" id="footer">
        {blast ? <Blast config={blast} /> : ""}
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
            <h5>
              <translate>Developer Hub</translate>
            </h5>
            <a href={this.pageUrl("tutorials", this.props.language)}>
              <translate>Tutorials</translate>
            </a>
            <a href={"/docs/" + this.props.language + "/"}>
              <translate>Knowledge Base</translate>
            </a>
            <a href="https://substrate.dev/recipes/">
              <translate>Recipes</translate>
            </a>
            <a href="https://substrate.dev/substrate-how-to-guides">
              <translate>How-to Guides</translate>
            </a>
            <a href="https://substrate.dev/rustdocs">
              <translate>API Reference</translate>
            </a>
            <a href="https://playground.substrate.dev/">
              <translate>Playground</translate>
            </a>
          </div>
          <div>
            <h5>
              <translate>Community</translate>
            </h5>
            <a href={this.pageUrl("community", this.props.language)}>
              <translate>Community Home</translate>
            </a>
            <a href={this.pageUrl("newsletter", this.props.language)}>
              <translate>Newsletter</translate>
            </a>
            <a href="https://matrix.to/#/#substrate-technical:matrix.org">
              <translate>Substrate Technical Chat</translate>
            </a>
            <a href={this.pageUrl("seminar", this.props.language)}>
              <translate>Substrate Seminar</translate>
            </a>
            <a
              href="http://stackoverflow.com/questions/tagged/substrate"
              target="_blank"
              rel="noreferrer noopener"
            >
              <translate>Stack Overflow</translate>
            </a>
            <a
              href="https://twitter.com/substrate_io"
              target="_blank"
              rel="noreferrer noopener"
            >
              <translate>Twitter</translate>
            </a>
            <a
              href="https://www.meetup.com/parity/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <translate>Events</translate>
            </a>
          </div>
          <div>
            <h5>
              <translate>More</translate>
            </h5>
            <a href="https://www.substrate.io/builders-program/">
              <translate>Substrate Builders Program</translate>
            </a>
            <a href="https://www.parity.io/blog/">Blog</a>
            <a href="https://github.com/paritytech/substrate">
              <translate>Substrate GitHub</translate>
            </a>
            <a href="https://github.com/substrate-developer-hub/">
              <translate>Developer Hub GitHub</translate>
            </a>
            <a href="https://www.parity.io/privacy/">
              <translate>Privacy Policy</translate>
            </a>
            <a href="/terms">
              <translate>Terms of Use</translate>
            </a>
            <a href="#" id="cookie-settings">
              <translate>Cookie Settings</translate>

              {/* Script for cookie settings pop-up. */}
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                var cookieSettings = document.getElementById('cookie-settings');
                cookieSettings.onclick = function() {
                  return klaro.show();
                };
              `,
                }}
              ></script>
            </a>
          </div>
        </section>

        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;

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

const Container = require("react-bootstrap/Container");
const Button = require("react-bootstrap/Button");

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;
    const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    const SplashContainer = props => (
      <div
        className={`homeContainer heroImage heroVH pt-${this.props.padding} pb-${
          this.props.padding
        }`}
      >
          {props.children}
      </div>
    );

    const ProjectTitle = () => (
      <Container className="readableLineLenght">
       <div className="tabTop ">
         <a className="contrastText pt-3 pl-5 pb-3 pr-5" href="https://zoom.us/j/440029011">Join the call here</a>
        </div>
        <h1 className="projectTitle">{this.props.title}</h1>
        <p className="lead text-muted">{this.props.tagline}</p>
        <p className="lead text-white">{this.props.text}</p>
      </Container>

    );

    const PromoSection = props => (
      <div className="section promoSection p-3">
        <Container className="readableLineLenght">
          {props.children}
        </Container>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            {this.props.buttons
              ? this.props.buttons.map((button, index) => {
                  return (
                    <Button
                      key={index}
                      size=""
                      variant=""
                      href={button.href}
                      className={`mr-5 mb-3 pl-5 pr-5` + (index == 0 ? ` contrast-color` : ` contrast-color-border`)}
                    >
                      {button.name}
                    </Button>
                  );
                })
              : ""}
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

module.exports = HomeSplash;

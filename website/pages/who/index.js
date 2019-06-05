/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash.js`);

class WhoIndex extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    const Button = props => (
      <a className={`btn mr-1 ${props.className}`} href={props.href} target={props.target}>
        {props.children}
      </a>
    );

    const Card = props => (
      <div className="col-md-4">
        <div className="card mb-4 box-shadow h-100">
          <div className="card-header">
            <h5>{props.title}</h5>
          </div>
          <div className="card-body">
            <p className="card-text">{props.children}</p>
          </div>
          <div className="card-footer">
            {props.buttons.map((button, index) => {
              return (
                <Button
                  href={button.link}
                  className={
                    `btn-secondary` + (index == 0 ? ` primary-color` : ``)
                  }>{button.name}</Button>
              )
            })}
          </div>
        </div>
      </div>
    );

    const Features = () => (
      <div className="container">
        <div className="row">
          <Card
            title="Runtime Developer"
            buttons={[
              { "name": "Follow our guide!", "link": "./runtime-developer/" }
            ]}>Are you interested to learn more about the modular Substrate runtime, and how you can build custom runtime logic using the Substrate framework? 
          </Card>
          <Card
            title="Contract Developer"
            buttons={[
              { "name": "Follow our guide!", "link": "./contract-developer/" }
            ]}>Are you interested to learn about the Contracts module provided by Substrate and how you can build Wasm smart contracts using ink!? 
          </Card>
          <Card
            title="Architect"
            buttons={[
              { "name": "Follow our guide!", "link": "./architect/" }
            ]}>Are you a solutions designer interested to learn more about how Substrate is built and whether it is the right tool for your project? 
          </Card>
        </div>
      </div>
    );

    return (
      <div>
        <HomeSplash
          siteConfig={siteConfig}
          language={language}
          title="Tell us about you!"
          tagline="Let us help you dive into Substrate."
          buttons={[
            {"name":"Not Sure?", "link":"./not-sure/"}
          ]}
          padding={0}
        />
        <div className="mainContainer">
          <Features />
        </div>
      </div>
    );
  }
}

module.exports = WhoIndex;

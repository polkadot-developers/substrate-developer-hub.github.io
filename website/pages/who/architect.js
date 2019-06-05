/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash.js`);

class Architect extends React.Component {
    render() {
        const { config: siteConfig, language = '' } = this.props;
        const { baseUrl } = siteConfig;

        const Button = props => (
            <a className={`btn mr-1 ${props.className}`} href={props.href} target={props.target}>
                {props.children}
            </a>
        );

        const Timespot = props => (
            <li class="timeline">
                <h5>{props.title}</h5>
                <p>{props.children}</p>
                {props.buttons ? props.buttons.map((button) => {
                    return (
                        <Button href={button.link} className="btn-secondary primary-color">{button.name}</Button>
                    )
                }) : ''}
            </li>
        )

        const Timeline = () => (
            <div className="container">
                <ol class="list-unstyled timeline">
                    <Timespot
                        title="Path to be determined..."
                        buttons={[
                            {"name":"High Level Docs", "link":"https://docs.substrate.dev/docs/"},
                            {"name":"StackOverflow", "link":"https://stackoverflow.com/questions/tagged/substrate"},
                            {"name":"Riot Chat", "link":"https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org"}
                        ]}
                    >Someone will fill out this page...
                    </Timespot>
                </ol>
            </div>
        );

        return (
            <div>
                <HomeSplash
                    siteConfig={siteConfig}
                    language={language}
                    title="Runtime Developer"
                    tagline="So you wanna build blockchains..."
                    padding={0}
                />
                <div className="mainContainer">
                    <Timeline />
                </div>
            </div>
        );
    }
}

module.exports = Architect;

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash.js`);

class NotSure extends React.Component {
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
                    <Timespot title="The Past, Present, and Future of Substrate">
                        <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/X40Duo7kWOI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </Timespot>
                    <Timespot title="Substrate Runtime Module Library Overview">
                        <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/kpUO8g_Ig0A?start=0&end=2452" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </Timespot>
                    <Timespot title="Getting Started with Substrate Smart Contracts">
                        <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/-EJHu0u6hT8?start=0&end=1059" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </Timespot>
                    <Timespot title="Restart your journey through the Substrate Developer Hub"
                        buttons={[
                            {"name":"Back to Home", "link":"/docs/"}
                        ]}
                    >
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

module.exports = NotSure;

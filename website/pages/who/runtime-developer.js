/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash.js`);

class RuntimeDeveloper extends React.Component {
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
                        title="It's dangerous to go alone!"
                        buttons={[
                            {"name":"High Level Docs", "link":"https://docs.substrate.dev/docs/"},
                            {"name":"StackOverflow", "link":"https://stackoverflow.com/questions/tagged/substrate"},
                            {"name":"Riot Chat", "link":"https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org"}
                        ]}
                    >Before you start your journey you should become familiar with resources that can help you
                            along the way. We have high level documentation which can help clarify unknown terms or give
                            you a bigger picture about what Substrate is. We have a <code>[substrate]</code> StackOverflow tag which
                            you can use to ask technical questions or find existing answers. Finally we have a friendly
                            and technical chat room of developers who are happy to help you at any point during your
                            journey.
                    </Timespot>
                    <Timespot
                        title="Install Substrate"
                        buttons={[
                            {"name":"Installation Instructions", "link":"https://docs.substrate.dev/docs/getting-started"}
                        ]}
                    >The first thing you need to do is set up Substrate on your computer! The instructions vary
                            depending on which operating system you use, so take a look at the guide here to find the
                            instructions that work for you.
                    </Timespot>
                    <Timespot
                        title="Substrate Collectables Workshop"
                        buttons={[
                            {"name":"Start the Workshop", "link":"https://substrate-developer-hub.github.io/substrate-collectables-workshop/"}
                        ]}
                    >Next follow our Substrate Collectables Workshop to get a deep dive into runtime development. We will walk you through the end to end process of building a non-fungible token DApp chain, running your chain, and even building a user interface!
                    </Timespot>
                    <Timespot
                        title="Reference Level Documentation"
                        buttons={[
                            {"name":"Reference Docs", "link":"https://crates.parity.io/"}
                        ]}
                    >Now that you are more familiar with Substrate and runtime development, you can jump into the reference level documentation which lives next to the core Substrate code. To start, you can try investigating our Substrate Runtime Module Library (SRML) by searching for "srml". You should now be able to read the code which powers these modules and extend your knowledge by looking at common patterns found within them.
                    </Timespot>
                    <Timespot
                        title="Buidl"
                    >You are now ready to start building your own Runtime logic! Do not forget about the community and documentation resources that we have equipped you with on this journey.
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

module.exports = RuntimeDeveloper;

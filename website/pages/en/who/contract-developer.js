/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash.js`);

class ContractDeveloper extends React.Component {
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
                            { "name": "Riot Chat", "link": "https://riot.im/app/#/room/!tYUCYdSvSYPMjWNDDD:matrix.parity.io" },
                            { "name": "StackOverflow", "link": "https://stackoverflow.com/questions/tagged/ink" },
                        ]}
                    ><p>Substrate provides Wasm smart contract functionality through the <a
                        href="https://crates.parity.io/srml_contract/index.html">Contract
                    module</a>. <a href="https://github.com/paritytech/ink">ink!</a> is a Rust based eDSL
                        for writing smart contracts on this platform. The
                        resources below will help you get up to speed on how to use Substrate and ink! in the
                context of writing smart contracts.</p>

                        <p>Both platforms are still in rapid development and may run into braking changes in the near
                future. So join our community on riot and ask questions using the <code>[ink]</code> tag on
                StackOverflow so you can get the help you need.</p>
                    </Timespot>
                    <Timespot
                        title="Deploy Your First Contract"
                        buttons={[
                            { "name": "Start Deploying!", "link": "https://github.com/paritytech/ink/wiki/Deploying-Your-First-Contract" }
                        ]}
                    >Let's get off the ground running by deploying your first contract to a local Substrate chain.
                    No development experience is needed here, we will just have you set up Substrate and the
                    ink! build environment so that you can compile and deploy a simple "flipper" contract. You
                    will even use the Polkadot UI to interact with your contract in real time!
                    </Timespot>
                    <Timespot
                        title="Writing Your First Contract"
                        buttons={[
                            { "name": "Start Writing!", "link": "https://github.com/paritytech/ink/wiki/Writing-Your-First-Contract" }
                        ]}
                    >Next we will walk you through the basics of contract development on ink!. For this we will
                    assume you have some background in Solidity, the language used for building smart contracts
                    on Ethereum.
                    </Timespot>
                    <Timespot
                        title="Substrate Contracts Workshop"
                        buttons={[
                            { "name": "Start the Workshop", "link": "https://substrate-developer-hub.github.io/substrate-contracts-workshop/" }
                        ]}
                    >Now that you have gotten the basics down, you can jump into our end to end workshop
                    where we will teach you in detail how to build more complicated contracts like an
                    incrementer and ultimately an ERC20 token.
                    </Timespot>
                    <Timespot
                        title="Buidl"
                    >You are now ready to start building your own smart contracts! Remember that ink! is still a rapidly developing platform, so take advantage of the community resources linked at the beginning of your journey and share your experiences!
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

module.exports = ContractDeveloper;

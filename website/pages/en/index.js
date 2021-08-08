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

const React = require('react')

const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash`)

const Container = require('../../../../react-bootstrap/Container')
const Button = require('../../../../react-bootstrap/Button')
const Row = require('../../../../react-bootstrap/Row')
const Col = require('../../../../react-bootstrap/Col')
const Image = require('../../../../react-bootstrap/Image')
const Alert = require('../../../../react-bootstrap/Alert')
const translate = require('../../server/translate').translate

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;
    const langPart = language ? `${language}/` : '';
    const pageUrl = page => `${baseUrl}${langPart}${page}`;
    const docUrl = (doc = '') => `${baseUrl}docs/${langPart}${doc}`;

    return (
      <section>
        <div className="announcement">
          You’ve mastered the tech, now talk about it! Share your Substrate experience at Sub0
          Online 2021.
          {` `}
          <a href="https://www.parity.io/blog/sub0-online-take-the-stage-and-share-your-knowledge?utm_source=substrate.dev&utm_medium=referral&utm_campaign=cfp%20sub0&utm_content=call%20for%20proposals%20sub0&utm_term=parity">
            Submit your proposal now.
          </a>
        </div>
        <HomeSplash
          id='home-hero'
          siteConfig={siteConfig}
          language={language}
          title={<translate>Substrate Developer Hub</translate>}
          tagline={<translate>Blockchain Development for Innovators</translate>}
          description={
            <translate>
              Substrate is a modular framework that enables you to create purpose-built blockchains by
              composing custom or pre-built components.
            </translate>
          }
          buttonText={<translate>Get Started</translate>}
          buttonUrl={ docUrl() }
        />

        <section className='mainContainer' id='home'>
          <Container>
            <section className='intro-statement home-section'>
              <span className='tagline'><translate>
                Why Use Substrate?
              </translate></span>

              <h2 className='large h1'><translate>
                Focus on Your Strengths
              </translate></h2>
              <p className='big'><translate>
                Substrate's modular design means you can reuse battle-tested libraries while building the
                custom components that matter most.
              </translate></p>
            </section>

            <section className='intro-blocks home-section'>
              <section className='intro-block'>
                <section className='icon-wrap'>
                  <div className='icon runtime' />
                </section>
                <h4><translate>Runtime Development</translate></h4>
                <p><translate>
                  Use Substrate's FRAME runtime system to build secure, scalable blockchain logic.
                </translate></p>
                <section className='button-wrap'>
                  <a
                    href={ docUrl('knowledgebase/runtime') }
                    className='with-arrow'>
                    <translate>Learn More</translate>
                  </a>
                </section>
              </section>

              <section className='intro-block'>
                <section className='icon-wrap'>
                  <div className='icon frontend' />
                </section>
                <h4><translate>Client Libraries</translate></h4>
                <p><translate>
                  Create rich user experiences for any Substrate-based chain with Polkadot-JS.
                </translate></p>
                <section className='button-wrap'>
                  <a
                    href={ docUrl('knowledgebase/integrate/polkadot-js') }
                    className='with-arrow'
                  >
                    <translate>Learn More</translate>
                  </a>
                </section>
              </section>

              <section className='intro-block'>
                <section className='icon-wrap'>
                  <div className='icon smart-contract' />
                </section>
                <h4><translate>Smart Contracts</translate></h4>
                <p><translate>
                  Substrate supports multiple smart contract platforms, including the EVM.
                </translate></p>
                <section className='button-wrap'>
                  <a
                    href='/tutorials/ink-smart-contracts-tutorial'
                    className='with-arrow'>
                    <translate>Learn More</translate>
                  </a>
                </section>
              </section>
            </section>
          </Container>

          <section className='bg-white what-is-substrate'>
            <div className='container'>
              <div className='pt-5'>
                <div className='row justify-content-center text-center py-3'>
                  <div className='col-12 col-md-8'>
                    <span className='tagline'><translate>What is Substrate?</translate></span>
                    <h2 className='display-4 h1'><translate>
                      Everything you need to build a blockchain.
                    </translate></h2>
                    <p className='big'><translate>
                      Substrate is powered by best-in-class cryptographic research and comes with peer-to-peer
                      networking, consensus mechanisms, and much more.
                    </translate></p>
                  </div>
                </div>
              </div>
              <div className='row py-5 features'>
                <div className='col-12 col-md-4 mb-4'>
                  <div className='d-flex align-items-center mb-2'>
                    <img className='mr-2' src='/img/glyphs/rectangle-1.svg' width='40' />
                    <h3 className='mb-0'><translate>
                      Fast and Efficient Database
                    </translate></h3>
                  </div>
                </div>
                <div className='col-12 col-md-4 mb-4'>
                  <div className='d-flex align-items-center mb-2'>
                    <img className='mr-2' src='/img/glyphs/rectangle-2.svg' width='40' />
                    <h3 className='mb-0'><translate>
                      Modular P2P Networking Stack
                    </translate></h3>
                  </div>
                </div>
                <div className='col-12 col-md-4'>
                  <div className='d-flex align-items-center mb-2'>
                    <img className='mr-2' src='/img/glyphs/rectangle-3.svg' width='40' />
                    <h3 className='mb-0'><translate>
                      Hot-Swappable Consensus Layer
                    </translate></h3>
                  </div>
                </div>
                <div className='col-12 col-md-4 mb-4'>
                  <div className='d-flex align-items-center mb-2'>
                    <img className='mr-2' src='/img/glyphs/rectangle-4.svg' width='40' />
                    <h3 className='mb-0'><translate>
                      Configurable Transaction Queue
                    </translate></h3>
                  </div>
                </div>
                <div className='col-12 col-md-4 mb-4'>
                  <div className='d-flex align-items-center mb-2'>
                    <img className='mr-2' src='/img/glyphs/rectangle-5.svg' width='40' />
                    <h3 className='mb-0'><translate>
                      Flexible Runtime Library
                    </translate></h3>
                  </div>
                </div>
                <div className='col-12 col-md-4'>
                  <div className='d-flex align-items-center mb-2'>
                    <img className='mr-2' src='/img/glyphs/rectangle-6.svg' width='40' />
                    <h3 className='mb-0'><translate>
                      Light Client Optimized
                    </translate></h3>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className='bg-light call-outs second'>
            <div className='container'>
              <div className='row justify-content-between align-items-center py-5 polkadot-row'>
                <div className='col-12 col-md-6 pl-md-0 mb-4 mb-md-0 text-center polkadot-graphic-wrap'>
                  <img src='/img/pictures/polkadot-network.svg' className='polkadot-image' />
                  <div
                    className='polkadot-graphic'
                    style={{ backgroundImage: `url(/img/pictures/polkadot-network.svg)` }}
                  />
                </div>
                <div className='col-12 col-md-5'>
                  <h2 className='h1'><translate>Production Ready</translate></h2>
                  <p className='large mb-4'><translate>
                    Substrate is the backbone that powers Polkadot, a next generation,
                    heterogeneous, multi-chain network. Most of the blockchains in the Polkadot
                    ecosystem are also built on Substrate. The Polkadot Network was launched in
                    May of 2020.
                  </translate></p>
                  <a className='action-link' href='https://polkadot.network/technology/'>
                    <span><translate>Learn more about Polkadot</translate></span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className='bg-light call-outs first'>
            <div className='container'>
              <div className='row justify-content-between align-items-center py-5'>
                <div className='col-12 col-md-5 order-2 order-md-1'>
                  <h2 className='h1'><translate>Smart Contract Ready</translate></h2>
                  <p className='large mb-4'><translate>
                    Substrate has a Wasm smart contract platform that you can use out of the box.
                    Because Substrate uses Wasm, you can build your smart contracts using any
                    compatible language. We have built ink!, a Rust-based eDSL, for this purpose.
                  </translate></p>
                  <a
                    className='action-link'
                    href= { docUrl('knowledgebase/smart-contracts/') } >
                    <span><translate>Learn more about ink!</translate></span>
                  </a>
                </div>
                <div className='col-12 col-md-6 order-1 order-md-2 pl-md-0 mb-4 mb-md-0 text-center'>
                  <img className='w-25' src='/img/pictures/substrate-wasm.svg' />
                </div>
              </div>
            </div>
          </section>

          <section className='bg-white learn'>
            <div className='container'>
              <div className='row justify-content-center text-center pt-5'>
                <div className='col-12 col-md-10'>
                  <span className='tagline'><translate>Keep Exploring!</translate></span>
                  <h2 className='display-4 h1'><translate>
                    There are lots of ways to learn about Substrate.
                  </translate></h2>
                </div>
              </div>
            </div>
          </section>

          <section className='bg-white learn-blocks'>
            <div className='container'>
              <div className='row text-center flex-md-nowrap py-md-5'>
                <div className='col-12 col-md-6'>
                  <div className='row justify-content-center'>
                    <div className='col-12 col-lg-8'>
                      <div className='py-5 py-md-0'>
                        <h2><translate>Substrate Seminar</translate></h2>
                        <p className='mb-3'><translate>
                          An open, collaborative group for learning about Substrate and connecting with other builders.
                        </translate></p>
                        <a
                          className='btn primary-color'
                          href={ pageUrl("seminar") }>
                          <translate>Join the Seminar</translate>
                        </a>
                      </div>
                      <div className='border-bottom d-md-none' />
                    </div>
                  </div>
                </div>
                <div className='border-right d-none d-md-block' />
                <div className='col-12 col-md-6'>
                  <div className='row justify-content-center'>
                    <div className='col-12 col-lg-8'>
                      <div className='py-5 py-md-0'>
                        <h2><translate>Substrate Recipes</translate></h2>
                        <p className='mb-3'><translate>
                          A collection of working code examples that solve common problems.
                        </translate></p>
                        <a
                          className='btn primary-color'
                          href='https://substrate.dev/recipes'>
                          <translate>Browse the Recipes</translate>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className='bg-light bottom-cta'>
            <div className='container'>
              <div className='py-5'>
                <div className='row justify-content-center text-center py-3'>
                  <div className='col-12 col-md-10'>
                    <h2 className='display-4 h1'><translate>
                      Ready to build with Substrate?
                    </translate></h2>
                  </div>
                  <div className='col-12 col-md-8'>
                    <p className='lead mb-4'><translate>
                      Get started with our helpful documentation or ask questions in our technical chat!
                    </translate></p>
                    <div className='d-flex justify-content-center'>
                      <div className='px-1'>
                        <a
                          className='btn btn-lg primary-color'
                          href={ docUrl() }>
                          <translate>Get Started</translate>
                        </a>
                      </div>
                      <div className='px-1'>
                        <a
                          className='btn btn-lg btn-outline-primary'
                          href='https://app.element.io/#/room/!HzySYSaIhtyWrwiwEV:matrix.org'>
                          <translate>Ask Questions</translate>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
    )
  }
}

Index.title = 'Official Substrate Documentation for Blockchain Developers'
Index.description = 'Learn to build blockchains using the next generation blockchain framework.'
module.exports = Index

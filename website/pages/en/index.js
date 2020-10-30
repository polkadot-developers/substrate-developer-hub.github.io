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
		const { config: siteConfig, language = '' } = this.props

		return (
			<section>
				<div className="announcement">
					The first Polkadot community conference is coming Dec 3rd!<br/> <a href="https://parity.link/UFsVd">Register Here</a> for Polkadot Decoded.
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
					buttonUrl={siteConfig.baseUrl + siteConfig.docsUrl + '/' + language}
				/>

				<section className='mainContainer' id='home'>
					<Container>
						<section className='intro-statement home-section'>
							<span className='tagline'>Why Use Substrate?</span>

							<h2 className='large h1'>Focus on Your Strengths</h2>
							<p className='big'>
								Substrate's modular design means you can reuse battle-tested libraries while building the
								custom components that matter most.
							</p>
						</section>

						<section className='intro-blocks home-section'>
							<section className='intro-block'>
								<section className='icon-wrap'>
									<div className='icon runtime' />
								</section>
								<h4>Runtime Development</h4>
								<p>Use Substrate's FRAME runtime system to build secure, scalable blockchain logic.</p>
								<section className='button-wrap'>
									<a
										href={`docs/` + language + `/knowledgebase/runtime`}
										className='with-arrow'>
										Learn More
									</a>
								</section>
							</section>

							<section className='intro-block'>
								<section className='icon-wrap'>
									<div className='icon frontend' />
								</section>
								<h4>Client Libraries</h4>
								<p>Create rich user experiences for any Substrate-based chain with Polkadot-JS.</p>
								<section className='button-wrap'>
									<a
										href={`docs/` + language + `/knowledgebase/integrate/polkadot-js`}
										className='with-arrow'
									>
										Learn More
									</a>
								</section>
							</section>

							<section className='intro-block'>
								<section className='icon-wrap'>
									<div className='icon smart-contract' />
								</section>
								<h4>Smart Contracts</h4>
								<p>Substrate supports multiple smart contract platforms, including the EVM.</p>
								<section className='button-wrap'>
									<a
										href='https://substrate.dev/substrate-contracts-workshop/#/'
										className='with-arrow'>
										Learn More
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
										<span className='tagline'>What is Substrate?</span>
										<h2 className='display-4 h1'>Everything you need to build a blockchain.</h2>
										<p className='big'>
											Substrate is powered by best-in-class cryptographic research and comes with peer-to-peer
											networking, consensus mechanisms, and much more.
										</p>
									</div>
								</div>
							</div>
							<div className='row py-5 features'>
								<div className='col-12 col-md-4 mb-4'>
									<div className='d-flex align-items-center mb-2'>
										<img className='mr-2' src='/img/glyphs/rectangle-1.svg' width='40' />
										<h3 className='mb-0'>Fast and Efficient Database</h3>
									</div>
								</div>
								<div className='col-12 col-md-4 mb-4'>
									<div className='d-flex align-items-center mb-2'>
										<img className='mr-2' src='/img/glyphs/rectangle-2.svg' width='40' />
										<h3 className='mb-0'>Modular P2P Networking Stack</h3>
									</div>
								</div>
								<div className='col-12 col-md-4'>
									<div className='d-flex align-items-center mb-2'>
										<img className='mr-2' src='/img/glyphs/rectangle-3.svg' width='40' />
										<h3 className='mb-0'>Hot-Swappable Consensus Layer</h3>
									</div>
								</div>
								<div className='col-12 col-md-4 mb-4'>
									<div className='d-flex align-items-center mb-2'>
										<img className='mr-2' src='/img/glyphs/rectangle-4.svg' width='40' />
										<h3 className='mb-0'>Configurable Transaction Queue</h3>
									</div>
								</div>
								<div className='col-12 col-md-4 mb-4'>
									<div className='d-flex align-items-center mb-2'>
										<img className='mr-2' src='/img/glyphs/rectangle-5.svg' width='40' />
										<h3 className='mb-0'>Flexible Runtime Library</h3>
									</div>
								</div>
								<div className='col-12 col-md-4'>
									<div className='d-flex align-items-center mb-2'>
										<img className='mr-2' src='/img/glyphs/rectangle-6.svg' width='40' />
										<h3 className='mb-0'>Light Client Optimized</h3>
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
									<h2 className='h1'>Production Ready</h2>
									<p className='large mb-4'>
										Substrate is the backbone that powers Polkadot, a next generation,
										heterogeneous, multi-chain network. Most of the blockchains in the Polkadot
										ecosystem are also built on Substrate. The Polkadot Network was launched in
										May of 2020.
									</p>
									<a className='action-link' href='https://polkadot.network/technology/'>
										<span>Learn more about Polkadot</span>
									</a>
								</div>
							</div>
						</div>
					</section>

					<section className='bg-light call-outs first'>
						<div className='container'>
							<div className='row justify-content-between align-items-center py-5'>
								<div className='col-12 col-md-5 order-2 order-md-1'>
									<h2 className='h1'>Smart Contract Ready</h2>
									<p className='large mb-4'>
										Substrate has a Wasm smart contract platform that you can use out of the box.
										Because Substrate uses Wasm, you can build your smart contracts using any
										compatible language. We have built ink!, a Rust-based eDSL, for this purpose.
									</p>
									<a
										className='action-link'
										href='https://substrate.dev/docs/en/knowledgebase/smart-contracts/overview'>
										<span>Learn more about ink!</span>
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
									<span className='tagline'>Keep Exploring!</span>
									<h2 className='display-4 h1'>There are lots of ways to learn about Substrate.</h2>
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
												<h2>Substrate Seminar</h2>
												<p className='mb-3'>
													An open, collaborative group for learning about Substrate and connecting with other builders.
												</p>
												<a
													className='btn primary-color'
													href='/en/seminar'>
													Join the Learning Group
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
												<h2>Substrate Recipes</h2>
												<p className='mb-3'>
													A collection of working code examples that solve common problems.
												</p>
												<a
													className='btn primary-color'
													href='https://substrate.dev/recipes'>
													Browse the Recipes
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
										<h2 className='display-4 h1'>Ready to build with Substrate?</h2>
									</div>
									<div className='col-12 col-md-8'>
										<p className='lead mb-4'>
											Get started with our helpful documentation or ask questions in our technical chat!
										</p>
										<div className='d-flex justify-content-center'>
											<div className='px-1'>
												<a
													className='btn btn-lg primary-color'
													href='https://substrate.dev/docs/en/'>
													Get Started
												</a>
											</div>
											<div className='px-1'>
												<a
													className='btn btn-lg btn-outline-primary'
													href='https://app.element.io/#/room/!HzySYSaIhtyWrwiwEV:matrix.org'>
													Ask Questions
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

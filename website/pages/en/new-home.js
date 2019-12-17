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

const HomeSplash = require(`${process.cwd()}` + `/core/HomeSplash.js`)

const Container = require('../../../../react-bootstrap/Container.js')
const Button = require('../../../../react-bootstrap/Button.js')
const Row = require('../../../../react-bootstrap/Row.js')
const Col = require('../../../../react-bootstrap/Col.js')
const Image = require('../../../../react-bootstrap/Image.js')
const translate = require('../../server/translate.js').translate

class Index extends React.Component {
	render() {
		const { config: siteConfig, language = '' } = this.props
		const { baseUrl, docsUrl } = siteConfig
		const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`
		const langPart = `${language ? `${language}/` : ''}`
		const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`
		const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page

		return (
			<div>
				<HomeSplash
					id='home-hero'
					siteConfig={siteConfig}
					language={language}
					title={<translate>Substrate Developer Hub</translate>}
					tagline={<translate>The blockchain framework that helps you focus on your vision.</translate>}
					description={
						<translate>
							Created by some of the industry’s foremost builders, Substrate is a modular blockchain
							framework that lets you pick and choose the right components for your application or
							enterprise.
						</translate>
					}
					buttonText={<translate>Get Started</translate>}
					buttonUrl={`who/runtime-developer`}
				/>

				<div className='mainContainer' id='home'>
					<Container>
						<section className='intro-statement home-section'>
							<span className='tagline'>Why use Substrate</span>
							<h1 className='large'>Focus on your development.</h1>
							<p>
								Substrate helps you develop your blockchain fast so that you can focus on your expertise
								while it handles the rest.
							</p>
						</section>

						<section className='intro-blocks home-section'>
							<section className='intro-block'>
								<section className='icon-wrap'>
									<div className='icon runtime' />
								</section>
								<h4>Runtime Development</h4>
								<p>Learn how to build a custom blockchain using Substrate.</p>
								<section className='button-wrap'>
									<a href={pageUrl('who/runtime-developer')} className='with-arrow'>
										Learn More
									</a>
								</section>
							</section>

							<section className='intro-block'>
								<section className='icon-wrap'>
									<div className='icon frontend' />
								</section>
								<h4>Front-End Development</h4>
								<p>Learn how to build interactive user experiences with Polkadot-JS.</p>
								<section className='button-wrap'>
									<a href={pageUrl('who/front-end-developer')} className='with-arrow'>
										Learn More
									</a>
								</section>
							</section>

							<section className='intro-block'>
								<section className='icon-wrap'>
									<div className='icon smart-contract' />
								</section>
								<h4>Smart Contract Development</h4>
								<p>Learn how to build Wasm smart contracts with ink!.</p>
								<section className='button-wrap'>
									<a href={pageUrl('who/contract-developer')} className='with-arrow'>
										Learn More
									</a>
								</section>
							</section>
						</section>

						<div class='py-4 bg-light'>
							<div class='container'>
								<div class='small text-center text-muted mb-lg-3'>
									They're building with Substrate.{' '}
									<a href='https://substrate.dev/en/users.html' class='weight-500'>
										<span>See more users</span>
									</a>
								</div>
								<div class='row justify-content-center justify-content-lg-between text-center align-items-center'>
									<div class='col mt-3 mb-lg-0'>
										<img src='./assets/logos/ebay.svg' width='99' />
									</div>
									<div class='col mt-3 mb-lg-0'>
										<img src='./assets/logos/cnn.svg' width='80' />
									</div>
									<div class='col mt-3 mb-lg-0'>
										<img src='./assets/logos/google.svg' width='110' />
									</div>
									<div class='col mt-3 mb-lg-0'>
										<img src='./assets/logos/cisco.svg' width='95' />
									</div>
									<div class='col mt-3 mb-lg-0'>
										<img src='./assets/logos/airbnb.svg' width='123' />
									</div>
									<div class='col mt-3 mb-lg-0'>
										<img src='./assets/logos/uber.svg' width='159' />
									</div>
								</div>
							</div>
						</div>
						<div class='bg-white'>
							<div class='container'>
								<div class='pt-5'>
									<div class='row justify-content-center text-center py-3'>
										<div class='col-12 col-md-8'>
											<h4>What is Substrate</h4>
											<h1 class='display-4'>Everything you need to build a blockchain.</h1>
											<p class='lead mb-4'>
												Substrate comes with p2p networking, consensus algorithms, and
												cryptographic libraries out-of-the-box, for free.
											</p>
										</div>
									</div>
								</div>
								<div class='row py-5'>
									<div class='col-12 col-md-4 mb-4'>
										<div class='d-flex align-items-center mb-2'>
											<img class='mr-2' src='./assets/glyphs/rectangle-1.svg' width='40' />
											<h3 class='mb-0'>Fast and efficient database</h3>
										</div>
									</div>
									<div class='col-12 col-md-4 mb-4'>
										<div class='d-flex align-items-center mb-2'>
											<img class='mr-2' src='./assets/glyphs/rectangle-2.svg' width='40' />
											<h3 class='mb-0'>Modular P2P networking stack in libp2p</h3>
										</div>
									</div>
									<div class='col-12 col-md-4'>
										<div class='d-flex align-items-center mb-2'>
											<img class='mr-2' src='./assets/glyphs/rectangle-3.svg' width='40' />
											<h3 class='mb-0'>Hot-swappable consensus layer</h3>
										</div>
									</div>
									<div class='col-12 col-md-4 mb-4'>
										<div class='d-flex align-items-center mb-2'>
											<img class='mr-2' src='./assets/glyphs/rectangle-4.svg' width='40' />
											<h3 class='mb-0'>Customizable transaction queue management system</h3>
										</div>
									</div>
									<div class='col-12 col-md-4 mb-4'>
										<div class='d-flex align-items-center mb-2'>
											<img class='mr-2' src='./assets/glyphs/rectangle-5.svg' width='40' />
											<h3 class='mb-0'>Diverse library of runtime modules</h3>
										</div>
									</div>
									<div class='col-12 col-md-4'>
										<div class='d-flex align-items-center mb-2'>
											<img class='mr-2' src='./assets/glyphs/rectangle-6.svg' width='40' />
											<h3 class='mb-0'>Mobile light client support</h3>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class='bg-light'>
							<div class='container'>
								<div class='row justify-content-between align-items-center py-5'>
									<div class='col-12 col-md-5 order-2 order-md-1'>
										<h1>Smart contract ready</h1>
										<p class='large mb-4'>
											Substrate has a Wasm smart contract platform that you can use out of the
											box. Because Substrate uses Wasm, you can build your smart contracts using
											any compatible language. We have built ink!, a Rust-based eDSL for this
											purpose.
										</p>
										<a
											class='action-link'
											href='https://substrate.dev/docs/en/ecosystem/contracts/ink'>
											<span>Learn more about ink!</span>
										</a>
									</div>
									<div class='col-12 col-md-6 order-1 order-md-2 pl-md-0 mb-4 mb-md-0 text-center'>
										<img class='w-25' src='./assets/pictures/substrate-wasm.svg' />
									</div>
								</div>
							</div>
						</div>
						<div class='bg-light'>
							<div class='container'>
								<div class='row justify-content-between align-items-center py-5'>
									<div class='col-12 col-md-6 pl-md-0 mb-4 mb-md-0 text-center'>
										<img class='w-75' src='./assets/pictures/polkadot-network.svg' />
									</div>
									<div class='col-12 col-md-5'>
										<h1>(Almost) production ready</h1>
										<p class='large mb-4'>
											Substrate is the backbone that powers Polkadot, a next generation,
											heterogeneous, multi-chain network. Most 'parachains' that will connect to
											this network are also built on Substrate. Substrate is undergoing a security
											audit in preparation for a 2020 release of the Polkadot network.
										</p>
										<a class='action-link' href='https://polkadot.network/technology/'>
											<span>Learn more about Polkadot</span>
										</a>
									</div>
								</div>
							</div>
						</div>
						<div class='bg-white'>
							<div class='container'>
								<div class='row justify-content-center text-center pt-5'>
									<div class='col-12 col-md-10'>
										<h4>Learning Substrate</h4>
										<h1>More ways to learn Substrate.</h1>
									</div>
								</div>
							</div>
						</div>
						<div class='bg-white'>
							<div class='container'>
								<div class='row text-center flex-md-nowrap py-md-5'>
									<div class='col-12 col-md-6'>
										<div class='row justify-content-center'>
											<div class='col-12 col-lg-8'>
												<div class='py-5 py-md-0'>
													<h2>Substrate Seminar</h2>
													<p class='mb-3'>
														Substrate Seminar is an open collaborative learning call where
														we learn about Substrate together.
													</p>
													<a
														class='btn btn-lg btn-outline-primary'
														href='https://substrate.dev/en/seminar'>
														Join the learning group
													</a>
												</div>
												<div class='border-bottom d-md-none' />
											</div>
										</div>
									</div>
									<div class='border-right d-none d-md-block' />
									<div class='col-12 col-md-6'>
										<div class='row justify-content-center'>
											<div class='col-12 col-lg-8'>
												<div class='py-5 py-md-0'>
													<h2>Substrate Playground</h2>
													<p class='mb-3'>
														Start hacking your substrate runtime in a web based VSCode like
														IDE, with full terminal support.
													</p>
													<a
														class='btn btn-lg btn-outline-primary'
														href='https://playground.substrate.dev'>
														Start playing in your browser
													</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class='bg-light'>
							<div class='container'>
								<div class='py-5'>
									<div class='row justify-content-center text-center py-3'>
										<div class='col-12 col-md-10'>
											<h1 class='display-4'>Ready to build with Substrate?</h1>
										</div>
										<div class='col-12 col-md-8'>
											<p class='lead mb-4'>
												Get started with the documentation or drop in the Riot chat to ask
												technical questions, meet others who share your interests, or keep an
												eye on what's going on
											</p>
											<div class='d-flex justify-content-center'>
												<div class='px-1'>
													<a
														class='btn btn-lg btn-primary'
														href='https://substrate.dev/docs/en/getting-started/'>
														Get Started
													</a>
												</div>
												<div class='px-1'>
													<a
														class='btn btn-lg btn-outline-primary'
														href='https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org'>
														Ask Questions
													</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Container>
				</div>
			</div>
		)
	}
}

Index.title = 'Official Substrate Documentation for Blockchain Developers'
Index.description = 'Learn to build blockchains using the next generation blockchain framework.'
module.exports = Index

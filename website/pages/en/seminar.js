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

const FullSplash = require(`${process.cwd()}` + `/core/FullSplash`)

const Container = require('../../../../react-bootstrap/Container')
const Button = require('../../../../react-bootstrap/Button')
const translate = require('../../server/translate').translate

function Seminar(props) {
	const { config: siteConfig, language = '' } = props
	const { baseUrl, docsUrl } = siteConfig
	const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`
	const langPart = `${language ? `${language}/` : ''}`
	const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`
	const pageUrl = doc => `${baseUrl}${langPart}${doc}`

	return (
		<section className='main-container' id='seminar'>
			<section className='text-center height-70 imagebg hero' data-overlay='6'>
				<div
					className='background-image-holder'
					style={{
						backgroundImage: `url('/img/rust-code-alt.jpg')`
					}}
				/>
				<div className='container pos-vertical-center mt--1'>
					<div className='row'>
						<div className='col-md-12'>
							<h1>
								<span className='c-accent' style={{ marginBottom: '8px', display: 'inline-block' }}>
									Substrate Seminar
								</span>{' '}
								<br /> A Collaborative Learning Group
							</h1>
							<p className='h3 type--subhead'>
								Substrate Seminar is an open collaborative learning call <br />where we learn about
								Substrate together.
							</p>
							<section className='button-wrap'>
								<Button
									className='btn btn--white primary-color'
									href='https://calendar.google.com/calendar/b/1?cid=cGFyaXR5LmlvXzJmc2tqN245cm1qcHE1Y2xiOWc3ZWUzZGhvQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'>
									<span className='btn__text'>Add to Google Calendar</span>
								</Button>
							</section>
							<section>
								<span className='block type--fine-print'>
									or <a href='https://www.crowdcast.io/e/substrate-seminar'>join live call »</a>
								</span>
							</section>
						</div>
					</div>
				</div>
			</section>

			<section className='switchable switchable--switch intro'>
				<div className='container'>
					<div className='row justify-content-between'>
						<div className='col-md-8 col-lg-7 left'>
							<h2>An open collaborative learning call</h2>
							<p className='lead'>
								Substrate Seminar is an open Collaborative Learning call where we learn about Substrate
								together. We meet every Tuesday at 14:00UTC. Ask for help, show off your project, learn
								Substrate, and make friends!
							</p>
							<a href='https://calendar.google.com/calendar/b/1?cid=cGFyaXR5LmlvXzJmc2tqN245cm1qcHE1Y2xiOWc3ZWUzZGhvQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'>Add next call to Google Calendar »</a>
						</div>
						<div className='col-md-4 col-lg-5 right'>
							<div className='feature feature-2 boxed boxed--border box-shadow'>
								<img className='image-host' src='/img/joshy.jpg' />
								<div className='feature__body'>
									<h4>Seminar Host</h4>
									<p>
										<strong>Joshy Orndorff</strong>
										<br />Developer Advocate at<br />Parity Technologies
									</p>
								</div>
							</div>
						</div>
					</div>
					<hr />
					<div className='row pb-0'>
						<div className='col-md-12'>
							<h2 style={{ fontSize: '32px' }}>FAQ</h2>
						</div>
					</div>
					<div className='row justify-content-between pt-0 faqs'>
						<div className='col-md-6 first'>
							<h4 className='mb-2'>What topics are coming up?</h4>
							<p>
								On <strong>30 June</strong>, Parity's Zeke Mostov will join us to discuss [Substrate Sidecar](https://github.com/paritytech/substrate-api-sidecar), a REST API service that runs alongside a Substrate node. This intermediate session will be useful for anyone who runs a Substrate node. Attendees will learn how to setup and run Sidecar, and what value it adds.
							</p>
							<p>
								On <strong>07 July</strong>, community member Spencer Harris joins us to present an overview of FRAME, Parity's framework for composing Substrate runtimes from individual pallets, and to demonstrate setting up a Substrate and Hackusama developer environment. This is a beginner-friendly session focused on runtime development.
							</p>
							<p>
								On <strong>14 July</strong>, Parity's Dan Forbes will demonstrate and discuss how to write your own Substrate pallet and install it in a runtime. He will also explore the uses and idiosyncracies of Substrate's runtime storage. This is a beginner-friendly session focussed on runtime development.
							</p>
							<h4 className='mb-2'>How do I join the call?</h4>
							<p>
								We are trying the crowdcast platform for seminar. Specifically we meet in{' '}
								<a href='https://www.crowdcast.io/e/substrate-seminar'>https://www.crowdcast.io/e/substrate-seminar</a>.
							</p>
						</div>

						<div className='col-md-6 second'>
						{/*
							<h4 className='mb-2'>How should I prepare for the call?</h4>
							<p>
								There are no specific preparation steps. You may find it useful to read the links for{' '}
								<a href="https://github.com/akropolisio/polkahub-monorepo">PolkaHub</a>{' '}
								and{' '}
								<a href="https://totemaccounting.com/">Totem Live Accounting</a>
								{' '}or complete one of our{' '}
								<a href='https://substrate.dev/en/tutorials'>
									Introductory Tutorials
								</a>{' '}.
							</p>
							*/}

							<h4 className='mt-4 mb-2'>Can I share a project I've been working on?</h4>
							<p>
								Yes! Seminar works best when everyone shares their projects and interests. To ensure a
								slot to share, please contact the group on <a href='https://matrix.to/#/!oClBfIbtucPfGKlNpk:matrix.parity.io'>Riot</a>.
							</p>
							<h4 className='mb-2'>I am not a [Substrate] developer, can I still participate?</h4>
							<p>
								Yes! The seminar is open to everyone. The content is generally more developer-oriented,
								but less technical participants and questions are also welcome. If your questions turn
								out to be off-topic, we'll point you to a better resource.
							</p>

							<h4 className='mb-2'>Is this related to Substrate Collaborative Learning?</h4>
							<p>
								Yes! Substrate Collaborative Learning was the previous harder-to-pronounce iteration of
								Substrate Seminar. When we decided to start meeting every week, and have a more
								discoverable web presence, we rebranded. If you liked Substrate Collaborative Learning,
								you'll love Substrate Seminar. The{' '}
								<a href='https://www.youtube.com/playlist?list=PLp0_ueXY_enUCPszf_3Q9ZxovLvKm1eMx'>
									SCL recordings
								</a>{' '}
								are still available.
							</p>
						</div>
					</div>
				</div>
			</section>
			<section className='bg--secondary'>
				<div className='container'>
					<div
						className='row pb-0'
						style={{
							marginBottom: '20px'
						}}>
						<div className='col-6'>
							<h4 className='p-color'>Previous calls</h4>
						</div>
						<div className='col-6 text-right'>
							<a
								href='https://www.youtube.com/playlist?list=PLp0_ueXY_enXRfoaW7sTudeQH10yDvFOS'
								target='_blank'>
								View more recordings »
							</a>
						</div>
					</div>

					<div className='row featured-video pt-0'>

						<div className='col-md-4'>
							<section className='video-cover video-cover-xs'>
								<div
									className='background-image-holder'
									style={{
										backgroundImage: `url('/img/seminar-t.jpg' )`
									}}
								/>
								<a
									className='video-play'
									href='https://www.youtube.com/watch?v=XoL1Ur_6Lxk&list=PLp0_ueXY_enXRfoaW7sTudeQH10yDvFOS'
									target='_blank'
								/>
							</section>
							<section className='video-details'>
								<h4 className='p-color'>Execute Substrate pallets in a TEE with SubstraTEE</h4>
								<p>
									Brenzi explains how the SubstraTEE framework can be used to protect privacy for your use case by re-using your Substrate pallets and instantiating them inside a trusted execution environment.
								</p>
							</section>
						</div>

						<div className='col-md-4'>
							<section className='video-cover video-cover-xs'>
								<div
									className='background-image-holder'
									style={{
										backgroundImage: `url('/img/seminar-t.jpg' )`
									}}
								/>
								<a
									className='video-play'
									href='https://www.youtube.com/watch?v=0eNGZpNkJk4&list=PLp0_ueXY_enXRfoaW7sTudeQH10yDvFOS'
									target='_blank'
								/>
							</section>
							<section className='video-details'>
								<h4 className='p-color'>Pallet Coupling, Runtime Upgrades, and Storage Migrations</h4>
								<p>
									Joshy Orndorff walks step-by-step through a demonstration that exemplifies pallet coupling, runtime upgrades, and storage migrations.
								</p>
							</section>
						</div>

						<div className='col-md-4'>
							<section className='video-cover video-cover-xs'>
								<div
									className='background-image-holder'
									style={{
										backgroundImage: `url('/img/seminar-t.jpg' )`
									}}
								/>
								<a
									className='video-play'
									href='https://www.youtube.com/watch?v=E1OymWVTZqM&list=PLp0_ueXY_enXRfoaW7sTudeQH10yDvFOS'
									target='_blank'
								/>
							</section>
							<section className='video-details'>
								<h4 className='p-color'>Adding SM2 Crypto to Substrate</h4>
								<p>
									Parity's Maggie Dong demonstrates Substrate accounts that use alternative cryptographic schemes. She'll show her work adding the sm2 scheme and submitting transactions with subxt.
								</p>
							</section>
						</div>

					</div>

				</div>

				<div
					className='container'
					style={{
						textAlign: 'center',
						padding: '80px 0 40px 0'
					}}>
					<div className='row'>
						<div className='col-md-12 col-lg-12'>
							<div className='cta'>
								<h2 style={{ margin: '0 0 10px 0' }}>Don't want to miss the next Substrate seminar?</h2>
								<section className='button-wrap'>
									<Button
										className='btn btn--white primary-color'
										href='https://calendar.google.com/calendar/b/1?cid=cGFyaXR5LmlvXzJmc2tqN245cm1qcHE1Y2xiOWc3ZWUzZGhvQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'>
										<span className='btn__text'>Add to Google Calendar</span>
									</Button>
								</section>
								<section>
									<span className='block type--fine-print'>
										or <a href='https://www.crowdcast.io/e/substrate-seminar'>join live call »</a>
									</span>
								</section>
							</div>
						</div>
					</div>
				</div>
			</section>
		</section>
	)
}

module.exports = Seminar

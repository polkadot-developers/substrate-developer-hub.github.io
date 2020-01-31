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
									href='https://calendar.google.com/event?action=TEMPLATE&tmeid=ODFrdXNkNjczYTZwZzM1ZGg1c2RscHY2cG5fMjAxOTExMTlUMTQwMDAwWiBwYXJpdHkuaW9fMzkzNzkzNDNoMDczdjA2cWh0MXZwcWNlZmNAZw&tmsrc=parity.io_39379343h073v06qht1vpqcefc%40group.calendar.google.com&scp=ALL'>
									<span className='btn__text'>Add to Google Calendar</span>
								</Button>
							</section>
							<section>
								<span className='block type--fine-print'>
									or <a href='https://zoom.us/j/440029011'>join live call »</a>
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
							<a href='#'>Add next call to Google Calendar »</a>
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
								February 4th - Parity's Gautam Dhameja will join us to demonstrate <a href="https://github.com/gautamdhameja/substrate-validator-set">Proof of Authority</a> and other <a href="https://github.com/gautamdhameja/substrate-permissioning">Account Permissioning</a> in Substrate.
							</p>
							<p>
								February 11th - The team behind <a href="https://github.com/playproject-io/datdot-substrate">Account Permissioning</a>, an incentivization system for storing files on the Dat network, join us for a code walkthrough and demonstration.
							</p>
							<p>
								February 18th - Andre Silva and Seun Lanlege join us to talk all things consensus in Substrate.
							</p>
							<p>
								February 25th - Kian Paimani joins us to discuss Phragmen's algorithm and Substrate's offline Phragmen feature.
							</p>
							<h4 className='mt-4 mb-2'>Can I share a project I've been working on?</h4>
							<p>
								Yes! Seminar works best when everyone shares their projects and interests. To ensure a
								slot to share, please contact Joshy Orndorff via{' '}
								<a href='mailto:joshy@parity.io'>email</a> or{' '}
								<a href='https://riot.im/app/#/room/!HzySYSaIhtyWrwiwEV:matrix.org'>Riot</a>.
							</p>
							<h4 className='mb-2'>How do I join the call?</h4>
							<p>
								We meet using zoom video conferencing. Specifically we meet in{' '}
								<a href='https://zoom.us/j/440029011'>https://zoom.us/j/440029011</a>. This link will
								only work when the call is live, so you may prefer to add this{' '}
								<a href='https://calendar.google.com/event?action=TEMPLATE&tmeid=ODFrdXNkNjczYTZwZzM1ZGg1c2RscHY2cG5fMjAxOTExMTlUMTQwMDAwWiBwYXJpdHkuaW9fMzkzNzkzNDNoMDczdjA2cWh0MXZwcWNlZmNAZw&tmsrc=parity.io_39379343h073v06qht1vpqcefc%40group.calendar.google.com&scp=ALL'>
									Google calendar invitation
								</a>{' '}
								to you own calendar.
							</p>
						</div>

						<div className='col-md-6 second'>
							<h4 className='mb-2'>How should I prepare for the call?</h4>
							<p>
								Follow and read the links provided in the week's description. If any repositories are linked, clone them. If you'd like to run the node, compile it in advance.
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
									href='https://www.youtube.com/watch?v=7qkqEfToH8w&list=PLp0_ueXY_enXRfoaW7sTudeQH10yDvFOS'
									target='_blank'
								/>
							</section>
							<section className='video-details'>
								<h4 className='p-color'>Six ways to Launch a Token</h4>
								<p>
									We demonstrate several ways to launch tokens with Substrate, explore transaction fees, and take a closer look at the EVM module.
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
									href='https://www.youtube.com/watch?v=b3HIXufMHnc&list=PLp0_ueXY_enXRfoaW7sTudeQH10yDvFOS'
									target='_blank'
								/>
							</section>
							<section className='video-details'>
								<h4 className='p-color'>Wasm Smart Contracts</h4>
								<p>
									Ricardo Ruis demonstrats wasm-bsaed smart contracts, and some advanced way for them to interact with the runtime. We also look at a community API Explorer project.
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
									href='https://www.youtube.com/watch?v=abdyjAL1yGA&list=PLp0_ueXY_enXRfoaW7sTudeQH10yDvFOS'
									target='_blank'
								/>
							</section>
							<section className='video-details'>
								<h4 className='p-color'>Custom RPCs, Runtime APIs, and Moonbeam DEX</h4>
								<p>
									Learn to add your own RPC endpoints to the node and have them communicate with the runtime. We also look at a community DEX Project.
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
										href='https://calendar.google.com/event?action=TEMPLATE&tmeid=ODFrdXNkNjczYTZwZzM1ZGg1c2RscHY2cG5fMjAxOTExMTlUMTQwMDAwWiBwYXJpdHkuaW9fMzkzNzkzNDNoMDczdjA2cWh0MXZwcWNlZmNAZw&tmsrc=parity.io_39379343h073v06qht1vpqcefc%40group.calendar.google.com&scp=ALL'>
										<span className='btn__text'>Add to Google Calendar</span>
									</Button>
								</section>
								<section>
									<span className='block type--fine-print'>
										or <a href='https://zoom.us/j/440029011'>join live call »</a>
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

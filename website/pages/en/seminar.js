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
									href='https://calendar.google.com/event?action=TEMPLATE&tmeid=MXFuaHJ1OWZyY2g1NTY0aDV1YW9zNXBlNThfMjAyMDAzMTdUMTQwMDAwWiBwYXJpdHkuaW9fMzkzNzkzNDNoMDczdjA2cWh0MXZwcWNlZmNAZw&tmsrc=parity.io_39379343h073v06qht1vpqcefc%40group.calendar.google.com&scp=ALL'>
									<span className='btn__text'>Add to Google Calendar</span>
								</Button>
							</section>
							<section>
								<span className='block type--fine-print'>
									or <a href='https://zoom.us/j/916767726'>join live call »</a>
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
								On <strong>April 14th</strong>, Cecile Tonglet will join us to talk about the new Substrate CLI and how to use and extend it. We may also briefly explore the Substrate Service and Cumulus.
							</p>
							<p>
								On <strong>April 21st</strong>, Joshy Orndorff and Nicole Zhu will discuss a UTXO pallet and creating a bitcoin-like chain on Substrate.
							</p>
							<p>
								On <strong>April 28th, Seminar is Cancelled</strong>. Let's all attend <a href="https://sub0.parity.io">Sub0 Online</a> instead!
							</p>
							<h4 className='mb-2'>How do I join the call?</h4>
							<p>
								We meet using zoom video conferencing. Specifically we meet in{' '}
								<a href='https://zoom.us/j/916767726'>https://zoom.us/j/916767726</a>. This link will
								only work when the call is live, so you may prefer to add this{' '}
								<a href='https://calendar.google.com/event?action=TEMPLATE&tmeid=MXFuaHJ1OWZyY2g1NTY0aDV1YW9zNXBlNThfMjAyMDAzMTdUMTQwMDAwWiBwYXJpdHkuaW9fMzkzNzkzNDNoMDczdjA2cWh0MXZwcWNlZmNAZw&tmsrc=parity.io_39379343h073v06qht1vpqcefc%40group.calendar.google.com&scp=ALL'>
									Google calendar invitation
								</a>{' '}
								to you own calendar.
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
									href='https://www.youtube.com/watch?v=bnC5RQsaAXQ&list=PLp0_ueXY_enXRfoaW7sTudeQH10yDvFOS'
									target='_blank'
								/>
							</section>
							<section className='video-details'>
								<h4 className='p-color'>Stable Coin and Storage Adapters</h4>
								<p>
									Alexander Popiak joins us to discuss his uncollateralized stablecoin implementation and the "Transient Storage Adapters" pattern
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
									href='https://www.youtube.com/watch?v=uhkV0jAcWDY&list=PLp0_ueXY_enXRfoaW7sTudeQH10yDvFOS'
									target='_blank'
								/>
							</section>
							<section className='video-details'>
								<h4 className='p-color'>Manual Seal and Instant Seal</h4>
								<p>
									This week Seun LanLege helps us build a Substrate node that uses manual seal and instant seal consensus engines.
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
									href='https://www.youtube.com/watch?v=lXw6GTNh73Y&list=PLp0_ueXY_enXRfoaW7sTudeQH10yDvFOS'
									target='_blank'
								/>
							</section>
							<section className='video-details'>
								<h4 className='p-color'>Moonbeam and EVM Pallet</h4>
								<p>
									Derek from Purestake tells us about their Moonbeam contract chain, and Parity's Kirill Taran demonstrates using the EVM pallet.
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
										href='https://calendar.google.com/event?action=TEMPLATE&tmeid=MXFuaHJ1OWZyY2g1NTY0aDV1YW9zNXBlNThfMjAyMDAzMTdUMTQwMDAwWiBwYXJpdHkuaW9fMzkzNzkzNDNoMDczdjA2cWh0MXZwcWNlZmNAZw&tmsrc=parity.io_39379343h073v06qht1vpqcefc%40group.calendar.google.com&scp=ALL'>
										<span className='btn__text'>Add to Google Calendar</span>
									</Button>
								</section>
								<section>
									<span className='block type--fine-print'>
										or <a href='https://zoom.us/j/916767726'>join live call »</a>
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

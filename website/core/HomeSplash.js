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

const Container = require('react-bootstrap/Container')
const Button = require('react-bootstrap/Button')

class HomeSplash extends React.Component {
	render() {
		const { siteConfig } = this.props

		const SplashContainer = props => (
			<div
				className={`homeContainer heroImage pt-${this.props.padding} pb-${this.props.padding}`}
				id={props.id ? props.id : ''}>
				<div className='homeSplashFade'>
					<div className='wrapper homeWrapper'>{props.children}</div>
				</div>
			</div>
		)

		const ProjectTitle = props => (
			<Container>
				<h1 className='projectTitle'>{this.props.title}</h1>
				<p className='lead text-muted'>{this.props.tagline}</p>
				{this.props.description && (
					<section>
						<span className='description'>{this.props.description}</span>
					</section>
				)}
				{this.props.buttonUrl && (
					<Button
						variant='secondary'
						href={this.props.buttonUrl}
						className='m-1 primary-color btn-lg'>
						{this.props.buttonText}
					</Button>
				)}
			</Container>
		)

		const PromoSection = props => (
			<div className='section promoSection'>
				<div className='promoRow'>
					<div className='pluginRowBlock'>{props.children}</div>
				</div>
			</div>
		)

		return (
			<SplashContainer {...this.props}>
				<div className='inner'>
					<ProjectTitle siteConfig={siteConfig} />
					<PromoSection>
						{this.props.buttons ? (
							this.props.buttons.map((button, index) => {
								return (
									<Button
										key={index}
										size='lg'
										variant='secondary'
										href={button.href}
										className={`mr-2` + (index == 0 ? ` primary-color` : ``)}>
										{button.name}
									</Button>
								)
							})
						) : (
							''
						)}
					</PromoSection>
				</div>
			</SplashContainer>
		)
	}
}

module.exports = HomeSplash

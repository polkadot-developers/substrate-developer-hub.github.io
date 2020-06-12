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

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of videos on the "videos" page
const videos = require('./data/videos')

const title_prefix = 'Substrate Developer Hub'
const is_staging = process.env['NODE_ENV'] == 'staging'
const git_rev = is_staging ? process.env['GIT_REV'] : null
const title = is_staging ? `${title_prefix} (@${git_rev})` : title_prefix

const siteConfig = {

	title, // Title for your website.
	tagline: 'The place for blockchain innovators.',

	// Used for publishing and more
	organizationName: 'substrate-developer-hub',
	projectName: 'substrate-developer-hub.github.io',
	// For top-level user or org sites, the organization is still the same.
	// e.g., for the https://JoelMarcey.github.io site, it would be set like...
	//   organizationName: 'JoelMarcey'

	// Your website URL
	url: 'https://substrate-developer-hub.github.io/',
	baseUrl: '/', // Base URL for your project */
	// For github.io type URLs, you would set the url and baseUrl like:
	//   url: 'https://facebook.github.io',
	//   baseUrl: '/test-site/',

	/* path to images for header/footer */
	favicon: 'img/favicon.png',

	presets: [
    [
      '@docusaurus/preset-classic',
      {
				theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        docs: {
          // Docs folder path relative to website dir.
          path: '../docs',
          // Sidebars file relative to website dir.
          sidebarPath: require.resolve('./sidebars.json'),
					// Edit this page button
					editUrl: 'https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/edit/source/docs/',
					// Show documentation's last contributor and update time
					// at the bottom of the page:
					showLastUpdateAuthor: true,
					showLastUpdateTime: true,
        },
      },
    ],
	],

	themeConfig: {
		navbar: {
			logo: {
				src: 'img/Substrate-logo.svg',
			},
			links: [
				{ to: 'docs/index', label: 'Docs', position: 'left' },
				{ href: 'https://substrate.dev/recipes/', label: 'Recipes', position: 'left' },
				{ to: 'tutorials', label: 'Tutorials', position: 'right' },
				{ to: 'community', label: 'Community', position: 'right' },
				{ href: 'https://github.com/paritytech/substrate', label: 'GitHub', position: 'right' },
			],
		},
		footer:{
			logo: {
				src: 'img/Substrate-logo.svg'
			},
			// This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
			copyright: `Copyright © ${new Date().getFullYear()} Parity Technologies`,
		},
		// Open Graph and Twitter card images.
		image: 'img/substrate-dev-hub-card.png',
		// Collapsible Categories
		sidebarCollapsible: true,
	},

	// Add custom scripts here that would be placed in <script> tags.
	scripts: [
		'https://buttons.github.io/buttons.js',
		'/js/clipboard.min.js',
		'/js/code-block-buttons.js',
		'/js/load.js',
		{
			src: '/js/ui.js',
			defer: true
		},
		{
			src: '/js/config.js',
			defer: true
		},
		{
			src: '/js/klaro.min.js',
			defer: true
		}
	],

	// Style sheets to import
	stylesheets: [ 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css' ],

	// customised blast banner on top
	// blast: {
	//   img: '/img/substrate-v2-doc-invite.png',
	//   link: '/docs/en/next/getting-started',
	//   background: 'url(/img/bg-sub01.svg); background-size: cover; background-position: right 0px bottom 500px;',
	//   fontColor: '#18FFB2'
	// }
}

module.exports = siteConfig;

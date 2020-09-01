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
const custom_url = 'substrate.dev'
const is_staging = process.env['NODE_ENV'] == 'staging'
const git_rev = is_staging ? process.env['GIT_REV'] : null
const title = is_staging ? `${title_prefix} (@${git_rev})` : title_prefix
const cname = is_staging ? `staging.${custom_url}` : custom_url

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

	// Generate CNAME file when building
	cname,

	// For no header links in the top nav bar -> headerLinks: [],
	headerLinks: [
		{ page: 'tutorials', label: 'Tutorials' },
		{ doc: 'index', label: 'Knowledge Base' },
		{ href: 'https://substrate.dev/recipes/', label: 'Recipes' },
		{ href: 'https://substrate.dev/rustdocs/', label: 'API Reference' },
		{ search: true }
	],

	// Presentations
	videos,

	/* path to images for header/footer */
	headerIcon: 'img/Substrate-logo.svg',
	footerIcon: 'img/Substrate-logo.svg',
	favicon: 'img/favicon.png',

	/* Colors for website */
	colors: {
		primaryColor: '#ff1864',
		secondaryColor: '#222222'
	},

	// This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
	copyright: `Copyright © ${new Date().getFullYear()} Parity Technologies`,

	highlight: {
		// Highlight.js theme to use for syntax highlighting in code blocks.
		theme: 'default',
		defaultLang: 'rust'
	},

	// Add custom scripts here that would be placed in <script> tags.
	scripts: [
		'https://buttons.github.io/buttons.js',
		'/js/clipboard.min.js',
		'/js/code-block-buttons.js',
		'/js/load.js',
		'/js/redirect-next.js',
		{
			src: '/js/config.js',
			defer: true
		},
		{
			src: '/js/klaro.min.js',
			defer: true
		}
	],

	// On page navigation for the current documentation page.
	onPageNav: 'separate',
	// No .html extensions for paths.
	cleanUrl: true,
	// Collapsible Categories
	docsSideNavCollapsible: true,

	// Open Graph and Twitter card images.
	ogImage: 'img/substrate-dev-hub-card.png',
	twitterImage: 'img/substrate-dev-hub-card.png',

	// Show documentation's last contributor and update time
	// at the bottom of the page:
	enableUpdateBy: true,
	enableUpdateTime: true,

	// You may provide arbitrary config keys to be used as needed by your
	// template. For example, if you need your repo's URL...
	repoUrl: 'https://github.com/substrate-developer-hub/substrate-developer-hub.github.io',

	// Directories inside which any CSS files will not be processed and
	// concatenated to Docusaurus' styles. This is to support static HTML pages
	// that may be separate from Docusaurus with completely separate styles.
	separateCss: [],

	// Use prism for syntax highlighting
	usePrism: ['rust', 'toml'],

	// Edit this page button
	editUrl: 'https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/edit/source/docs/',

	// Scroll to top button at the bottom
	scrollToTop: true,

	// Style sheets to import
	stylesheets: [ 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css' ],

	// Translation recruitment link, appears in the language drop down as "Help Translate"
	translationRecruitingLink: 'https://crowdin.com/project/substrate-developer-hub',

	// Algolia Search
	algolia: {
		apiKey: '5cd09916f4ba4c283b2d45ee7386fc34',
		indexName: 'substrate',
		algoliaOptions: {
			// https://www.algolia.com/doc/api-reference/api-parameters/
			facetFilters: [ 'language:LANGUAGE' ]
		}
	},

	// customised blast banner on top
	// blast: {
	//   img: '/img/substrate-v2-doc-invite.png',
	//   link: '/docs/en/next/getting-started',
	//   background: 'url(/img/bg-sub01.svg); background-size: cover; background-position: right 0px bottom 500px;',
	//   fontColor: '#18FFB2'
	// }
}

module.exports = siteConfig

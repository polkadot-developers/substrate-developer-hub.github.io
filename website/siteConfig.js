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

// List of projects listed on the "users" page.

// INSTRUCTIONS:
// If you would like to add your name to this list, please open a Pull Request.
// Include a transparent icon with the same width/height (square), in PNG or SVG format.
// Names are alphabetized, so order does not matter.
//
// "name": Your company/project name.
// "image": A link to your PNG/SVG located in `/img/users/`.
// "homepage": A company/project homepage, hopefully with a reference to Substrate :)
// "github": (optional) If included, we will add an additional link to your GitHub project.
// "pinned": Set to 'false'. If you think it should be 'true', contact us.

const usersList = [
  {
    name: 'Edgeware',
    image: '/img/users/edgeware.png',
    homepage: 'https://edgewa.re/',
    pinned: true,
  },
  {
    name: 'Polkascan',
    image: '/img/users/polkascan.png',
    homepage: 'https://polkascan.io/',
    pinned: true,
  },
  {
    name: 'AdEx',
    image: '/img/users/adex.png',
    homepage: 'https://www.adex.network/',
    pinned: true,
  },
  {
    name: 'ChainX',
    image: '/img/users/chainx.png',
    homepage: 'https://chainx.org/',
    pinned: true,
  },
  {
    name: 'Energy Web Foundation',
    image: '/img/users/ewf.svg',
    homepage: 'http://energyweb.org/',
    pinned: true,
  },
  {
    name: 'Ocean Protocol',
    image: '/img/users/oceanprotocol.svg',
    homepage: 'https://oceanprotocol.com/',
    pinned: true,
  },
  {
    name: 'ChainLink',
    image: '/img/users/chainlink.png',
    homepage: 'https://chain.link/',
    pinned: true,
  },
  {
    name: 'iExec',
    image: '/img/users/iexec.png',
    homepage: 'https://iex.ec/',
    pinned: false,
  },
  {
    name: 'LayerX',
    image: '/img/users/layerx.png',
    homepage: 'https://layerx.co.jp/',
    pinned: false,
  },
  {
    name: 'Robonomics',
    image: '/img/users/robonomics.png',
    homepage: 'https://robonomics.network/en/',
    pinned: true,
  },
  {
    name: 'MXC',
    image: '/img/users/mxc.png',
    homepage: 'https://www.mxc.org/',
    pinned: false,
  },
  {
    name: 'Katallasos',
    image: '/img/users/katallassos.png',
    homepage: 'https://katal.io/',
    pinned: false,
  },
  {
    name: 'Joystream',
    image: '/img/users/joystream.svg',
    homepage: 'https://www.joystream.org/',
    pinned: false,
  },
  {
    name: 'Ladder Network',
    image: '/img/users/laddernetwork.png',
    homepage: 'http://laddernetwork.io/',
    pinned: false,
  },
  {
    name: 'Asure Network',
    image: '/img/users/asurenetwork.svg',
    homepage: 'https://www.asure.network/',
    pinned: false,
  },
  {
    name: 'Kilt Protocol',
    image: '/img/users/kiltprotocol.png',
    homepage: 'https://kilt.io/',
    pinned: false,
  },
  {
    name: 'PACTCare Starlog',
    image: '/img/users/starlog.png',
    homepage: 'https://pact.care/',
    pinned: false,
  },
  {
    name: '0x Protocol',
    image: '/img/users/0xprotocol.png',
    homepage: 'https://0x.org/',
    pinned: false,
  },
  {
    name: 'Blink Network',
    image: '/img/users/blinknetwork.png',
    homepage: 'https://blink.network/',
    pinned: false,
  },
  {
    name: 'Akropolis',
    image: '/img/users/akropolis.png',
    homepage: 'https://akropolis.io/',
    pinned: false,
  },
  {
    name: 'Staked Technologies',
    image: '/img/users/plasm.png',
    homepage: 'https://staked.co.jp/',
    pinned: false,
  },
  {
    name: 'Speckle OS',
    image: '/img/users/speckleos.png',
    homepage: 'https://www.speckleos.io/',
    pinned: false,
  },
  {
    name: 'Agora.Trade',
    image: '/img/users/agoratrade.png',
    homepage: 'https://agora.trade/',
    pinned: false,
  },
  {
    name: 'Clovyr',
    image: '/img/users/clovyr.svg',
    homepage: 'https://clovyr.io/',
    pinned: true,
  },
  {
    name: 'Aragon',
    image: '/img/users/aragon.svg',
    homepage: 'https://aragon.org/',
    pinned: false,
  },
  {
    name: 'Melon Protocol',
    image: '/img/users/melonprotocol.png',
    homepage: 'https://melonport.com/',
    pinned: true,
  },
];

function alphabetize( a, b ) {
  if ( a.name.toUpperCase() < b.name.toUpperCase() ){
    return -1;
  }
  if ( a.name.toUpperCase() > b.name.toUpperCase() ){
    return 1;
  }
  return 0;
}

const users = usersList.sort(alphabetize);

const siteConfig = {
  title: 'Substrate Developer Hub', // Title for your website.
  tagline: 'The place for blockchain innovators.',

  url: 'https://substrate-developer-hub.github.io/', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'substrate-developer-hub.github.io',
  organizationName: 'substrate-developer-hub',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'quickstart/getting-started', label: 'Docs'},
    {href: 'https://crates.parity.io', label: 'Reference Docs'},
    {page: 'tutorials', label: 'Tutorials'},
    {page: 'community', label: 'Community'},
    {href: 'https://github.com/paritytech/substrate', label: 'GitHub'},
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/Substrate-logo.svg',
  footerIcon: 'img/Substrate-logo.svg',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#ff1864',
    secondaryColor: '#222222',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Parity Technologies`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
    defaultLang: 'rust',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,
  // Collapsible Categories
  docsSideNavCollapsible: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/Substrate-logo.svg',
  twitterImage: 'img/Substrate-logo.svg',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/substrate-developer-hub/substrate-developer-hub.github.io',

  // Directories inside which any CSS files will not be processed and
  // concatenated to Docusaurus' styles. This is to support static HTML pages
  // that may be separate from Docusaurus with completely separate styles.
  separateCss: [],

  // Use prism for syntax highlighting
  usePrism: true,

  // Edit this page button
  editUrl: "https://github.com/substrate-developer-hub/substrate-developer-hub.github.io/edit/source/docs/",

  // Add Update by information at the bottom of the page:
  enableUpdateBy: true,
  enableUpdateTime: true,

  // Scroll to top button at the bottom
  scrollToTop: true,

  // Style sheets to import
  stylesheets: ["https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"],

};

module.exports = siteConfig;

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

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'ChainLink',
    image: '/img/users/chainlink.png',
    infoLink: 'https://medium.com/web3foundation/web3-foundation-and-chainlink-announce-collaboration-df55ed462a3a',
    pinned: true,
  },
  {
    caption: 'ChainX',
    image: '/img/users/chainx.png',
    infoLink: 'https://medium.com/web3foundation/web3-foundation-and-chainx-announce-collaboration-6c70564d7272',
    pinned: true,
  },
  {
    caption: 'Polkascan',
    image: '/img/users/polkascan.png',
    infoLink: 'https://polkascan.io/',
    pinned: true,
  },
  {
    caption: 'AdEx',
    image: '/img/users/adex.png',
    infoLink: 'https://medium.com/web3foundation/adex-announces-substrate-implementation-3fdeed8bf494',
    pinned: true,
  },
  {
    caption: 'Ocean Protocol',
    image: '/img/users/oceanprotocol.svg',
    infoLink: 'https://blog.oceanprotocol.com/decentralized-web-summit-2018-highlights-a6376edefb01',
    pinned: true,
  },
  {
    caption: 'Aragon',
    image: '/img/users/aragon.svg',
    infoLink: 'https://twitter.com/rzurrer/status/1090201496753504259',
    pinned: true,
  },
  {
    caption: 'Energy Web Foundation',
    image: '/img/users/ewf.png',
    infoLink: 'https://www.parity.io/private-transactions-webassembly-and-permissioning-new-features-energy-web-foundation-blockchain-for-energy/',
    pinned: true,
  },
  {
    caption: 'iExec',
    image: '/img/users/iexec.png',
    infoLink: 'https://medium.com/iex-ec/dev-letter-24-sidechain-approach-7cab5de2e54a',
    pinned: true,
  },
  {
    caption: 'Edgeware',
    image: '/img/users/edgeware.png',
    infoLink: 'https://edgewa.re/',
    pinned: true,
  },
  {
    caption: 'LayerX',
    image: '/img/users/layerx.png',
    infoLink: 'https://medium.com/layerx/announcing-zerochain-5b08e158355d',
    pinned: true,
  },
  {
    caption: 'Robonomics',
    image: '/img/users/robonomics.png',
    infoLink: 'https://medium.com/layerx/announcing-zerochain-5b08e158355d',
    pinned: true,
  },
  {
    caption: 'MXC',
    image: '/img/users/mxc.png',
    infoLink: 'https://www.mxc.org/',
    pinned: true,
  },
  {
    caption: 'Katallasos',
    image: '/img/users/katallassos.png',
    infoLink: 'https://polkadot.network/katallassos-moves-towards-a-polkadot-parachain/',
    pinned: true,
  },
  {
    caption: 'Joystream',
    image: '/img/users/joystream.svg',
    infoLink: 'https://blog.joystream.org/sparta/',
    pinned: true,
  },
  {
    caption: 'Ladder Network',
    image: '/img/users/laddernetwork.png',
    infoLink: 'http://laddernetwork.io/',
    pinned: true,
  },
  {
    caption: 'Asure Network',
    image: '/img/users/asurenetwork.svg',
    infoLink: 'https://www.asure.network/',
    pinned: true,
  },
  {
    caption: 'Kilt Protocol',
    image: '/img/users/kiltprotocol.png',
    infoLink: 'https://polkadot.network/katallassos-moves-towards-a-polkadot-parachain/',
    pinned: true,
  },
  {
    caption: 'PACTCare Starlog',
    image: '/img/users/starlog.png',
    infoLink: 'https://github.com/PACTCare/Starlog',
    pinned: true,
  },
  {
    caption: '0x Protocol',
    image: '/img/users/0xprotocol.png',
    infoLink: 'https://twitter.com/recmo/status/1081637877027549190?s=09',
    pinned: true,
  },
  {
    caption: 'Blink Network',
    image: '/img/users/blinknetwork.png',
    infoLink: 'https://polkadot.network/katallassos-moves-towards-a-polkadot-parachain/',
    pinned: true,
  },
  {
    caption: 'Akropolis',
    image: '/img/users/akropolis.png',
    infoLink: 'https://medium.com/akropolis/hello-world-ae16b654ba71',
    pinned: true,
  },
  {
    caption: 'Staked Technologies',
    image: '/img/users/plasm.png',
    infoLink: 'https://github.com/stakedtechnologies/Plasm',
    pinned: true,
  },
  {
    caption: 'Speckle OS',
    image: '/img/users/speckleos.png',
    infoLink: 'https://medium.com/polkadot-network/dots-and-speckle-paving-the-way-forward-for-the-new-web-691beed50f1a',
    pinned: true,
  },
  {
    caption: 'Agora.Trade',
    image: '/img/users/agoratrade.png',
    infoLink: 'https://agora.trade/',
    pinned: true,
  },
];

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
    {page: 'docs/quickstart/installing-substrate', label: 'Docs'},
    {page: 'tutorials', label: 'Tutorials'},
    {href: 'https://www.parity.io/blog/', label: 'Blog'},
    {page: 'community/support', label: 'Community'},
    {href: 'https://github.com/substrate-developer-hub/', label: 'GitHub'},
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/Substrate-logo.svg',
  footerIcon: 'img/Substrate-logo.svg',
  favicon: 'img/Substrate-logo.svg',

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
};

module.exports = siteConfig;

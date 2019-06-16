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
    name: "Edgeware",
    image: "/img/users/edgeware.png",
    homepage: "https://edgewa.re/",
    github: "https://github.com/hicommonwealth",
    team: "https://commonwealth.im/",
    telemetry: "https://polkascan.io/pre/edgeware-testnet/dashboard",
    pinned: true
  },
  {
    name: "Polkascan",
    image: "/img/users/polkascan.png",
    homepage: "https://polkascan.io/",
    pinned: true
  },
  {
    name: "AdEx",
    image: "/img/users/adex.png",
    homepage: "https://www.adex.network/",
    github: "https://github.com/AdExNetwork/adex-protocol-substrate",
    pinned: true
  },
  {
    name: "ChainX",
    image: "/img/users/chainx.png",
    homepage: "https://chainx.org/",
    github: "https://github.com/chainx-org",
    telemetry: "https://telemetry.polkadot.io/#/ChainX",
    pinned: true
  },
  {
    name: "Ocean Protocol",
    image: "/img/users/oceanprotocol.svg",
    homepage: "https://oceanprotocol.com/",
    pinned: true
  },
  {
    name: "ChainLink",
    image: "/img/users/chainlink.png",
    homepage: "https://chain.link/",
    pinned: true
  },
  {
    name: "iExec",
    image: "/img/users/iexec.png",
    homepage: "https://iex.ec/",
    github: "https://github.com/iExecBlockchainComputing/iexec-substrate-poc",
    pinned: false
  },
  {
    name: "LayerX",
    image: "/img/users/layerx.png",
    homepage: "https://layerx.co.jp/",
    code: "https://github.com/LayerXcom/zero-chain",
    pinned: false
  },
  {
    name: "Robonomics",
    image: "/img/users/robonomics.png",
    homepage: "https://robonomics.network/en/",
    github: "https://github.com/airalab",
    team: "https://aira.life/en/",
    telemetry: "https://telemetry.polkadot.io/#/Robonomics",
    pinned: true
  },
  {
    name: "MXC",
    image: "/img/users/mxc.png",
    homepage: "https://www.mxc.org/",
    pinned: false
  },
  {
    name: "Katallasos",
    image: "/img/users/katallassos.png",
    homepage: "https://katal.io/",
    github: "https://github.com/Trinkler/",
    team: "https://ipfs.io/ipns/trinkler.software/",
    pinned: false
  },
  {
    name: "Joystream",
    image: "/img/users/joystream.svg",
    homepage: "https://www.joystream.org/",
    github: "https://github.com/Joystream",
    team: "https://www.jsgenesis.com/",
    pinned: false
  },
  {
    name: "Ladder Network",
    image: "/img/users/laddernetwork.png",
    homepage: "http://laddernetwork.io/",
    github: "https://github.com/laddernetwork/",
    telemetry: "https://telemetry.polkadot.io/#list/Ladder%20Testnet%20v0.5.0",
    pinned: false
  },
  {
    name: "Asure Network",
    image: "/img/users/asurenetwork.svg",
    homepage: "https://www.asure.network/",
    pinned: false
  },
  {
    name: "Kilt Protocol",
    image: "/img/users/kiltprotocol.png",
    homepage: "https://kilt.io/",
    github: "https://github.com/KILTprotocol/",
    team: "https://botlabs.org/",
    pinned: false
  },
  {
    name: "PACTCare Starlog",
    image: "/img/users/starlog.png",
    homepage: "https://pact.care/",
    github: "https://github.com/PACTCare/Starlog",
    pinned: false
  },
  {
    name: "Akropolis",
    image: "/img/users/akropolis.png",
    homepage: "https://akropolis.io/",
    pinned: false
  },
  {
    name: "Staked Technologies",
    image: "/img/users/plasm.png",
    homepage: "https://staked.co.jp/",
    github: "https://github.com/stakedtechnologies",
    pinned: false
  },
  {
    name: "Speckle OS",
    image: "/img/users/speckleos.png",
    homepage: "https://www.speckleos.io/",
    pinned: false
  },
  {
    name: "Agora.Trade",
    image: "/img/users/agoratrade.png",
    homepage: "https://agora.trade/",
    pinned: false
  },
  {
    name: "Clovyr",
    image: "/img/users/clovyr.svg",
    homepage: "https://clovyr.io/",
    pinned: true
  },
  {
    name: "Aragon",
    image: "/img/users/aragon.svg",
    homepage: "https://aragon.org/",
    pinned: true
  },
  {
    name: "Centrifuge",
    image: "/img/users/centrifuge.svg",
    homepage: "https://centrifuge.io/",
    github: "https://github.com/centrifuge",
    pinned: false
  },
  {
    name: "Parity Ethereum 2.0",
    image: "/img/users/paritytech2.svg",
    homepage: "https://www.parity.io/",
    github: "https://github.com/paritytech/shasper",
    team: "https://www.parity.io/",
    pinned: true
  },
  {
    name: "Horizon Games",
    image: "/img/users/horizongames.svg",
    homepage: "https://horizongames.net/",
    github: "https://github.com/horizon-games",
    pinned: false
  },
  {
    name: "Polkadot Network",
    image: "/img/users/polkadot.svg",
    homepage: "https://polkadot.network/",
    github: "https://github.com/paritytech/polkadot",
    team: "https://www.parity.io/",
    telemetry: "https://telemetry.polkadot.io/",
    pinned: true
  },
  {
    name: "Totem Accounting",
    image: "/img/users/totem.png",
    homepage: "https://totemaccounting.com/",
    github: "https://gitlab.com/totem-tech",
    pinned: false
  },
];

function alphabetize(a, b) {
  if (a.name.toUpperCase() < b.name.toUpperCase()) {
    return -1;
  }
  if (a.name.toUpperCase() > b.name.toUpperCase()) {
    return 1;
  }
  return 0;
}

module.exports = usersList.sort(alphabetize);

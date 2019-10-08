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

const usersList = [{
    name: "Edgeware",
    image: "/img/users/edgeware.png",
    homepage: "https://edgewa.re/",
    github: "https://github.com/hicommonwealth",
    team: "https://commonwealth.im/",
    telemetry: "https://polkascan.io/pre/edgeware-testnet/dashboard",
    pinned: true,
    type: "chain",
  },
  {
    name: "Polkascan",
    image: "/img/users/polkascan.png",
    homepage: "https://polkascan.io/",
    pinned: true,
    type: "infra",
  },
  {
    name: "AdEx",
    image: "/img/users/adex.png",
    homepage: "https://www.adex.network/",
    github: "https://github.com/AdExNetwork/adex-protocol-substrate",
    pinned: true,
    type: "chain",
  },
  {
    name: "ChainX",
    image: "/img/users/chainx.png",
    homepage: "https://chainx.org/",
    github: "https://github.com/chainx-org",
    telemetry: "https://telemetry.polkadot.io/#/ChainX",
    pinned: true,
    type: "chain",
  },
  {
    name: "Ocean Protocol",
    image: "/img/users/oceanprotocol.svg",
    homepage: "https://oceanprotocol.com/",
    pinned: true,
    type: "chain",
  },
  {
    name: "ChainLink",
    image: "/img/users/chainlink.png",
    homepage: "https://chain.link/",
    pinned: true,
    type: "chain",
  },
  {
    name: "iExec",
    image: "/img/users/iexec.png",
    homepage: "https://iex.ec/",
    github: "https://github.com/iExecBlockchainComputing/iexec-substrate-poc",
    pinned: false,
    type: "chain",
  },
  {
    name: "LayerX",
    image: "/img/users/layerx.png",
    homepage: "https://layerx.co.jp/",
    github: "https://github.com/LayerXcom/zero-chain",
    pinned: false,
    type: "chain",
  },
  {
    name: "Robonomics",
    image: "/img/users/robonomics.png",
    homepage: "https://robonomics.network/en/",
    github: "https://github.com/airalab",
    team: "https://aira.life/en/",
    telemetry: "https://telemetry.polkadot.io/#/Robonomics",
    pinned: true,
    type: "chain",
  },
  {
    name: "MXC",
    image: "/img/users/mxc.png",
    homepage: "https://www.mxc.org/",
    pinned: false,
    type: "chain",
  },
  {
    name: "Katal",
    image: "/img/users/katal.png",
    homepage: "https://katal.dev/",
    github: "https://github.com/Trinkler/katal-chain",
    team: "https://ipfs.io/ipns/trinkler.software/",
    pinned: false,
    type: "chain",
  },
  {
    name: "Joystream",
    image: "/img/users/joystream.svg",
    homepage: "https://www.joystream.org/",
    github: "https://github.com/Joystream",
    team: "https://www.jsgenesis.com/",
    pinned: false,
    type: "chain",
  },
  {
    name: "Ladder Network",
    image: "/img/users/laddernetwork.png",
    homepage: "http://laddernetwork.io/",
    github: "https://github.com/laddernetwork/",
    telemetry: "https://telemetry.polkadot.io/#list/Ladder%20Testnet%20v0.5.0",
    pinned: false,
    type: "chain",
  },
  {
    name: "Asure Network",
    image: "/img/users/asurenetwork.svg",
    homepage: "https://www.asure.network/",
    pinned: false,
    type: "chain",
  },
  {
    name: "KILT Protocol",
    image: "/img/users/kiltprotocol_full.png",
    homepage: "https://kilt.io/",
    github: "https://github.com/KILTprotocol/",
    team: "https://botlabs.org/",
    pinned: false,
    type: "chain",
  },
  {
    name: "PACTCare Starlog",
    image: "/img/users/starlog.png",
    homepage: "https://pact.care/",
    github: "https://github.com/PACTCare/Starlog",
    pinned: false,
    type: "chain",
  },
  {
    name: "Akropolis",
    image: "/img/users/akropolis.png",
    homepage: "https://akropolis.io/",
    pinned: false,
    type: "chain",
  },
  {
    name: "Staked Technologies",
    image: "/img/users/plasm.png",
    homepage: "https://staked.co.jp/",
    github: "https://github.com/stakedtechnologies",
    pinned: false,
    type: "chain",
  },
  {
    name: "PCHAIN",
    image: "/img/users/pchain.png",
    homepage: "https://pchain.org/",
    pinned: true,
    type: "chain",
  },
  {
    name: "Speckle OS",
    image: "/img/users/speckleos.png",
    homepage: "https://www.speckleos.io/",
    pinned: false,
    type: "infra",
  },
  {
    name: "Clovyr",
    image: "/img/users/clovyr.svg",
    homepage: "https://clovyr.io/",
    pinned: true,
    type: "chain",
  },
  {
    name: "Aragon",
    image: "/img/users/aragon.svg",
    homepage: "https://aragon.org/",
    pinned: true,
    type: "chain",
  },
  {
    name: "Centrifuge",
    image: "/img/users/centrifuge.svg",
    homepage: "https://centrifuge.io/",
    github: "https://github.com/centrifuge",
    pinned: false,
    type: "chain",
  },
  {
    name: "Parity Ethereum 2.0",
    image: "/img/users/parity-ethereum.svg",
    homepage: "https://www.parity.io/ethereum/",
    github: "https://github.com/paritytech/shasper",
    team: "https://www.parity.io/",
    pinned: true,
    type: "chain",
  },
  {
    name: "Horizon Games",
    image: "/img/users/horizongames.svg",
    homepage: "https://horizongames.net/",
    github: "https://github.com/horizon-games",
    pinned: false,
    type: "chain",
  },
  {
    name: "Polkadot Network",
    image: "/img/users/polkadot.svg",
    homepage: "https://polkadot.network/",
    github: "https://github.com/paritytech/polkadot",
    team: "https://www.parity.io/",
    telemetry: "https://telemetry.polkadot.io/",
    pinned: true,
    type: "chain",
  },
  {
    name: "Totem Accounting",
    image: "/img/users/totem.png",
    homepage: "https://totemaccounting.com/",
    github: "https://gitlab.com/totem-tech",
    pinned: false,
    type: "chain",
  },
  {
    name: "Enzyme",
    image: "/img/users/enzyme.png",
    homepage: "https://getenzyme.dev/",
    github: "https://github.com/blockxlabs/enzyme",
    team: "https://blockxlabs.com/",
    pinned: false,
    type: "infra",
  },
  {
    name: "Protos",
    image: "/img/users/protos.gif",
    homepage: "http://protosmanagement.com/",
    github: "https://github.com/protos-research/polkadot-node-explorer",
    pinned: false,
    type: "infra",
  },
  {
    name: "substraTEE",
    image: "/img/users/SCS.svg",
    homepage: "https://www.scs.ch/",
    github: "https://github.com/scs/substraTEE",
    pinned: false,
    type: "infra",
  },
  {
    name: "Kusama",
    image: "/img/users/kusama_01.png",
    homepage: "https://kusama.network/",
    github: "https://github.com/paritytech/polkadot",
    pinned: false,
    type: "infra",
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

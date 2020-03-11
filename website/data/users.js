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
    name: "Speckle OS",
    image: "/img/users/speckleos.png",
    homepage: "https://www.speckleos.io/",
    pinned: false,
    type: "infra",
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
  {
    name: "Bifrost",
    image: "/img/users/Bifrost.png",
    homepage: "https://bifrost.codes/",
    github: "https://github.com/lurpis/bifrost",
    pinned: false,
    type: "chain",
  },
  {
    name: "Blockdaemon",
    image: "/img/users/Blockdaemon.png",
    homepage: "https://blockdaemon.com",
    github: "https://github.com/Blockdaemon",
    pinned: false,
    type: "infra",
  },
  {
    name: "Caelum Labs",
    image: "/img/users/Caelumlabs.png",
    homepage: "https://caelumlabs.com",
    github: "https://github.com/Caelumlabs",
    pinned: false,
    type: "infra",
  },
  {
    name: "Daohub",
    image: "/img/users/Daohub.png",
    homepage: "https://daohub.io",
    github: "https://github.com/daohub-io",
    pinned: false,
    type: "infra",
  },
  {
    name: "Darwinia",
    image: "/img/users/Darwinia.png",
    homepage: "https://darwinia.network/",
    github: "https://github.com/darwinia-network",
    pinned: false,
    type: "chain",
  },
  {
    name: "Dock.io",
    image: "/img/users/dockio.png",
    homepage: "https://dock.io/",
    github: "https://github.com/docknetwork",
    pinned: false,
    type: "infra",
  },
  {
    name: "Dothereum",
    image: "/img/users/Dothereum.png",
    homepage: "http://dothereum.net/",
    github: "https://github.com/dothereum/dothereum",
    pinned: false,
    type: "chain",
  },
  {
    name: "Everstake",
    image: "/img/users/Everstake.png",
    homepage: "https://everstake.one/",
    github: "https://github.com/everstake",
    pinned: false,
    type: "infra",
  },
  {
    name: "Gunclear",
    image: "/img/users/Gunclear.png",
    homepage: "https://gunclear.io/",
    github: "https://github.com/GunClear",
    pinned: false,
    type: "infra",
  },
  {
    name: "HiveNet",
    image: "/img/users/HiveNet.png",
    homepage: "https://www.hivenet.cloud/",
    github: "https://github.com/HiveNetCloud",
    pinned: false,
    type: "chain",
  },
  {
    name: "Laminar",
    image: "/img/users/Laminar.png",
    homepage: "https://laminar.one/",
    github: "https://github.com/laminar-protocol",
    pinned: false,
    type: "chain",
  },
  {
    name: "Litentry",
    image: "/img/users/Litentry.png",
    homepage: "https://litentry.com/",
    github: "https://github.com/litentry",
    pinned: false,
    type: "chain",
  },
  {
    name: "MixBytes",
    image: "/img/users/MixBytes.png",
    homepage: "https://mixbytes.io/",
    github: "https://github.com/mixbytes",
    pinned: false,
    type: "infra",
  },
  {
    name: "Ngrave",
    image: "/img/users/Ngrave.png",
    homepage: "https://www.ngrave.io/",
    github: "https://github.com/ngraveio",
    pinned: false,
    type: "infra",
  },
  {
    name: "Phala Network",
    image: "/img/users/Phala.png",
    homepage: "https://phala.network/",
    github: "https://github.com/Phala-Network",
    pinned: false,
    type: "infra",
  },
  {
    name: "Runtime Verification",
    image: "/img/users/Runtime Verification.png",
    homepage: "https://runtimeverification.com/",
    github: "https://github.com/runtimeverification",
    pinned: false,
    type: "infra",
  },
  {
    name: "Swarm City",
    image: "/img/users/SwarmCity.png",
    homepage: "https://swarm.city/",
    github: "https://github.com/swarmcity",
    pinned: false,
    type: "infra",
  },
  {
    name: "Symbolic Software",
    image: "/img/users/SymbolicSoftware.png",
    homepage: "https://symbolic.software/",
    github: "https://github.com/symbolicsoft",
    pinned: false,
    type: "infra",
  },
  {
    name: "Use Tech",
    image: "/img/users/UseTech.png",
    homepage: "https://www.usetech.com/",
    github: "https://github.com/usetech-llc",
    pinned: false,
    type: "infra",
  },
  {
    name: "Validators",
    image: "/img/users/Validators.png",
    homepage: "https://validators.com/",
    github: "https://github.com/validators",
    pinned: false,
    type: "infra",
  },
  {
    name: "ValidityLabs",
    image: "/img/users/ValidityLabs.png",
    homepage: "https://validitylabs.org",
    github: "https://github.com/validitylabs",
    pinned: false,
    type: "infra",
  },
  {
    name: "WiV",
    image: "/img/users/WiV.png",
    homepage: "https://wiv.io/",
    pinned: false,
    type: "chain",
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

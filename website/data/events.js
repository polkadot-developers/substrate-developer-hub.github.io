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

const eventsList = [
  {
    img: '/img/events/dotcon_2019.png',
    title: "DOTCON",
    description: "The Second Annual DOTCon will be an afternoon of in-depth presentations, demos, talks and workshops on all things Polkadot.",
    startDate: new Date("Aug 18, 2019"),
    endDate: new Date("Aug 18, 2019"),
    featured: true,
    href: "https://polkadot.network/dotcon/"
  },
  {
    img: `/img/substrate-placeholder.png`,
    title: "14Web3 Summit 2019",
    description: "Web3 Summit is organized around a single rallying call: to facilitate a fully functional and user-friendly decentralized web.",
    startDate: new Date("Aug 12, 2019"),
    endDate: new Date("Aug 14, 2019"),
    featured: true,
    href: "https://web3summit.com/"
  },
  {
    img: "/img/events/web3summit_2019.png",
    title: "Web3 Summit 2019",
    description: "Web3 Summit is organized around a single rallying call: to facilitate a fully functional and user-friendly decentralized web.",
    startDate: new Date("Aug 19, 2019"),
    endDate: new Date("Aug 21, 2019"),
    featured: true,
    href: "https://web3summit.com/"
  }
];

function withDate(a, b) {
  if (a.startDate < b.startDate) {
    return -1;
  }
  if (a.startDate > b.startDate) {
    return 1;
  }
  return 0;
}

module.exports = eventsList.sort(withDate);

# Continent Acquisition Example

**Live demo:** https://continent-acquisition-example.vercel.app/

_For a more fetaure rich demonstration please ensure you have [MetaMask](https://metamask.io/) installed and a small amount of Ethereum availbale on the [Rinky](https://www.rinkeby.io/)/[Kovan](https://kovan-testnet.github.io/website/) testnet (Ethereum can be sourced from a relevant test net [faucet](https://rinkebyfaucet.com/))._

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## Overview

Full stack example project for enhancing my knowledge of Typescript and Solidity. This project was predominantly built using [NextJS](https://nextjs.org/), [Tailwind](https://tailwindcss.com/), [Hardhat](https://hardhat.org/), [Solidity](https://soliditylang.org/) and [Wagmi](https://wagmi.sh/). Housed within a _monorepo_, setup/controlled by [LernaJS](https://lerna.js.org/) and [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/).

## Features

- Interact with a Solidity smart contract on the Kovan or Rinkeby testnets.
- Mint an NFT representing a continent, which will increase the cost of future purchases
  _(this will be stored on the blockchain, and assigned to your address)_.
- Transfer tokens to another address on chain, making them the new owner.
- Burn tokens, relinquishing your continent NFT to be purchased by another user
  _(this will not reduce the price of future purchases.)_.

## Getting Started

To test the project locally using HardHat:

- Install project dependencies — `yarn install`
- Launch a HardHat node — `yarn hhn`
- Deploy the smart contract — `yarn hhd`
- Launch the application — `yarn start`, which will become available at [http://localhost:3000](http://localhost:3000/)

## Scripts

- `yarn start` — Launches application in development mode on [`http://localhost:3000`](http://localhost:3000/)
- `yarn build` — Compiles and bundles the app for deployment
- `yarn hhn` — Starts the HardHat local blockchain node
- `yarn hhd` — Deploys the contract to HardHat's local node
- `yarn deploy:rinkeby` — Deploys the contract to the Rinkeby testnet
- `yarn deploy:kovan` — Deploys the contract to the Kovan testnet

## Screenshots

![Unauthenticated route](https://github.com/richardhosler/continent-acquisition-example/blob/master/screenshots/unauthenticated-route.png)
![Wallet connect](https://github.com/richardhosler/continent-acquisition-example/blob/master/screenshots/wallet-connect.png)
![Authenticated route](https://github.com/richardhosler/continent-acquisition-example/blob/master/screenshots/authenticated-route.png)
![Network switching](https://github.com/richardhosler/continent-acquisition-example/blob/master/screenshots/network-switching.png)
![Continent](https://github.com/richardhosler/continent-acquisition-example/blob/master/screenshots/continent.png)
![Continent purchase](https://github.com/richardhosler/continent-acquisition-example/blob/master/screenshots/continent-purchase.png)
![Continent purchased](https://github.com/richardhosler/continent-acquisition-example/blob/master/screenshots/continent-purchased.png)
![Continent transfer](https://github.com/richardhosler/continent-acquisition-example/blob/master/screenshots/continent-transfer.png)

## License

This source code is licensed under the MIT license found in the [LICENSE](https://github.com/richardhosler/continent-acquisition-example/blob/master/LICENSE) file.

---

Build by [Richard Hosler](https://github.com/richardhosler)

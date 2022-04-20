import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";

import "hardhat-gas-reporter";
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      blockGasLimit: 3000000000000,
      chainId: 31337,
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.METAMASK_PRIVATE_KEY !== undefined
          ? [process.env.METAMASK_PRIVATE_KEY]
          : [],
    },
    kovan: {
      url: process.env.KOVAN_URL || "",
      accounts:
        process.env.METAMASK_PRIVATE_KEY !== undefined
          ? [process.env.METAMASK_PRIVATE_KEY]
          : [],
    },
  },
};

export default config;

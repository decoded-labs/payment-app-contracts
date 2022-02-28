require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      forking: {
        url: process.env.BINANCE_URL,
      },

    binance: {
      url: process.env.BINANCE_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  }
}};

const Web3 = require("web3");
const { OpenSeaPort, Network } = require("opensea-js");

// This example provider won't let you make transactions, only read-only calls:
const provider = new Web3.providers.HttpProvider(process.env.INFURA_PROVIDER);

const seaport = new OpenSeaPort(provider, {
  networkName: Network.Rinkeby,
  apiKey: YOUR_API_KEY,
});

module.exports = seaport;

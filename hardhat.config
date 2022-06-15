require("dotenv").config();

require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require('hardhat-deploy');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.4.18",
      },
    ],
  },

  namedAccounts: {
    deployer: 'privatekey://0x87ef69a835f8cd0c44ab99b7609a20b2ca7f1c8470af4f0e5b44db927d542084'
  },
  networks: {
    testnet: {
      url: "https://testnet.telos.net/evm",
      accounts: ['0x87ef69a835f8cd0c44ab99b7609a20b2ca7f1c8470af4f0e5b44db927d542084'],
    },
  },
};

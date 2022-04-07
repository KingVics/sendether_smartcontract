//https://eth-ropsten.alchemyapi.io/v2/ZTQGe3QhFKOQ-26x-IBpA6vqIftjvR_X
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/ZTQGe3QhFKOQ-26x-IBpA6vqIftjvR_X',
      accounts: ['d8a669e402ab0d832a9b29afeb1fff0e705be73e34cfd41778dc6f0a8c1a045d'],
    },
  },
};
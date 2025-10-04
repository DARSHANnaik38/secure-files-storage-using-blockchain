module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions.
   */
  networks: {
    // This is the configuration for your local Ganache network
    development: {
      host: "127.0.0.1", // Localhost
      port: 7545, // Your Ganache UI port
      network_id: "*", // Match any network id
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.19", // <-- This version is more stable with your version of Truffle.
    },
  },
};

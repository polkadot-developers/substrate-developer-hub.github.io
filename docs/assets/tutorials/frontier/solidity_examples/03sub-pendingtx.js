const Web3 = require('web3');
const web3 = new Web3('wss://wss.testnet.moonbeam.network');

web3.eth.subscribe('pendingTransactions', (error) => {
    if (error)
        console.error(error);
})
    .on("connected", function (subscriptionId) {
        console.log(subscriptionId);
    })
    .on("data", function (log) {
        console.log(log);
    });

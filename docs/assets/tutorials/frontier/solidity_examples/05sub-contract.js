const Web3 = require('web3');
const web3 = new Web3('wss://wss.testnet.moonbeam.network');

web3.eth.subscribe('logs', {
    address: '0xED8b0D9FA61a8004Ce63be6aA6D4F2dcfFae6FcA',
    topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
}, (error) => {
    if (error)
        console.error(error);
})
    .on("connected", function (subscriptionId) {
        console.log(subscriptionId);
    })
    .on("data", function (log) {
        console.log(log);
    });

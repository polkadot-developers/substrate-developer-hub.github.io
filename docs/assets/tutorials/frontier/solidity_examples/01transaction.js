const Web3 = require('web3');

// Variables definition
const web3 = new Web3('https://rpc.testnet.moonbeam.network');
const privKey = '9f1ed88d928eea70367598a0e9f5cd4dc3cc3bd29e726ecdbf71e8fa4135243b';
const addressFrom = '0x0848B04952763FF8ae726D4a910CB55243bf2427';
const addressTo = '0x3F5aC694ce5d0eb9DD811d0E7D58dE3943D427F9';

// Create transaction
const deploy = async () => {
    console.log(
        `Attempting to make transaction from ${addressFrom} to ${addressTo}`
    );

    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            from: addressFrom,
            to: addressTo,
            value: web3.utils.toWei('1', 'ether'),
            gas: 21000
        },
        privKey
    );

    // Deploy transaction
    const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
    );
    console.log(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
    );
};

deploy();

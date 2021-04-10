const Web3 = require('web3');
const { bytecode, abi } = require('./contract-stuff')

// Initialization
const web3 = new Web3('https://rpc.testnet.moonbeam.network');
const privKey = '9f1ed88d928eea70367598a0e9f5cd4dc3cc3bd29e726ecdbf71e8fa4135243b';
const address = '0x0848B04952763FF8ae726D4a910CB55243bf2427';

// Deploy contract
const deploy = async () => {
    console.log('Attempting to deploy from account:', address);

    const incrementer = new web3.eth.Contract(abi);

    const incrementerTx = incrementer.deploy({
        data: bytecode,
        arguments: [5],
    });

    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            from: address,
            data: incrementerTx.encodeABI(),
            gas: '4294967295',
        },
        privKey
    );

    const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
    );
    console.log('Contract deployed at address', createReceipt.contractAddress);
};

deploy();

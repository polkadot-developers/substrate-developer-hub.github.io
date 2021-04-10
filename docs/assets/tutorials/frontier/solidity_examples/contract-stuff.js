module.exports = {
    bytecode: '608060405234801561001057600080fd5b5060405161013d38038061013d8339818101604052602081101561003357600080fd5b8101908080519060200190929190505050806000819055505060e38061005a6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80637cf5dab01460415780638381f58a14606c578063d826f88f146088575b600080fd5b606a60048036036020811015605557600080fd5b81019080803590602001909291905050506090565b005b6072609e565b6040518082815260200191505060405180910390f35b608e60a4565b005b806000540160008190555050565b60005481565b6000808190555056fea26469706673582212204a30fb6c30e37a1949be50065f934dbfac0da6226049eff97a8bda3ab02b5f4b64736f6c63430006060033',
    abi: [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_initialNumber",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "increment",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "number",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "reset",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
};

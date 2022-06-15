import  { TelosEvmApi } from "@telosnetwork/telosevm-js";
import fetch from "node-fetch";
import  Transaction from '@ethereumjs/tx'
import  {BigNumber, ethers}  from  'ethers';

const contractAbi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_lockDuration",
                "type": "uint256"
            }
        ],
        "name": "setLockDuration",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_maxDeposits",
                "type": "uint256"
            }
        ],
        "name": "setMaxDeposits",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const provider = ethers.getDefaultProvider();
const account = "prods.evm";
const contractAddress = "0x20027f1e6f597c9e2049ddd5ffb0040aa47f6135";
const contract = new ethers.Contract(contractAddress, contractAbi, provider);

const evmApi = new TelosEvmApi({
        endpoint: "https://testnet.telos.net",
        chainId: '41',
        ethPrivateKeys: [],
        fetch: fetch,
        telosContract: 'eosio.evm',
        telosPrivateKeys: []
    })

const myArgs = process.argv.slice(2);

;(async () => {
    const evmAccount = await evmApi.telos.getEthAccountByTelosAccount(account);
    let linkedAddress = evmAccount.address;
    const nonce = parseInt(await evmApi.telos.getNonce(linkedAddress), 16);
    const feeData = await provider.getFeeData()
    const gasPrice = BigNumber.from(`0x${await evmApi.telos.getGasPrice()}`)
    if(myArgs.length < 2){
        console.log("This script requires 2 arguments: node serializeEVMTransaction.js METHOD PARAMS")
        return;
    }
    // POPULATE TRANSACTION FROM ARGS
    let unsignedTrx = null;
    switch(myArgs[0].toString()){
        case "setLockDuration":
            unsignedTrx = await contract.populateTransaction.setLockDuration(myArgs[1]);
            break;
        case "setMaxDeposits":
            unsignedTrx = await contract.populateTransaction.setMaxDeposits(myArgs[1]);
            break;
        case "transferOwnership":
            unsignedTrx = await contract.populateTransaction.transferOwnership(myArgs[1].replace(/^0x/, ''));
    }
    if(unsignedTrx == null){
        console.log("Method not found");
        return;
    }
    unsignedTrx.nonce = nonce;
    unsignedTrx.gasLimit = BigNumber.from(`0xA0F4`);
    unsignedTrx.gasPrice = gasPrice;
    let raw = await ethers.utils.serializeTransaction(unsignedTrx);
    raw = raw.replace(/^0x/, '')
    console.log("Transaction: ", raw);
    console.log("Cleos Command: ",  'cleos --url https://testnet.telos.caleos.io/ push action eosio.evm raw \'{"ram_payer": prods.evm, "tx": '+ raw +' , "estimate_gas": false, "sender": "7c56101c01eaaece3d1bb330910c8e9183b39dbd"}\' -p prods.evm');
})()

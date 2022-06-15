import  { TelosEvmApi } from "@telosnetwork/telosevm-js";
import fetch from "node-fetch";
import  Transaction from '@ethereumjs/tx'
import  {BigNumber, ethers}  from  'ethers';
import {JsonRpc, Api} from 'eosjs';
import {JsSignatureProvider} from 'eosjs/dist/eosjs-jssig.js';
const rpc = new JsonRpc("https://testnet.telos.net", {fetch});
const signatureProvider = new JsSignatureProvider(["5JacbMgupaZFYQURgJcKjoSLnuDHr16WtVF9xXFj3cGBSLhYmBr"])
const nativeApi = new Api({rpc, signatureProvider});

const nativeAccount = "prods.evm";
const EVMContractAddress = "0x20027f1e6f597c9e2049ddd5ffb0040aa47f6135";

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
    const evmAccount = await evmApi.telos.getEthAccountByTelosAccount(nativeAccount);
    let linkedAddress = evmAccount.address;
    const nonce = parseInt(await evmApi.telos.getNonce(linkedAddress), 16);
    const feeData = await provider.getFeeData()
    const gasPrice = BigNumber.from(`0x${await evmApi.telos.getGasPrice()}`)
    // POPULATE TRANSACTION FROM ARGS
    let unsignedTrx = null;
    if(myArgs.length < 2){
        return;
    }
    switch(myArgs[0].toString()){
        case "setLockDuration":
            unsignedTrx = await contract.populateTransaction.setLockDuration(myArgs[1]);
            break;
        case "setMaxDeposits":
            unsignedTrx = await contract.populateTransaction.setMaxDeposits(myArgs[1]);
            break;
        case "transferOwnership":
            unsignedTrx = await contract.populateTransaction.transferOwnership(myArgs[1]);
    }
    if(unsignedTrx == null){
        console.log(unsignedTrx);
        return ;
    }
    unsignedTrx.nonce = nonce;
    unsignedTrx.gasLimit = BigNumber.from(`0xA0F4`);
    unsignedTrx.gasPrice = gasPrice;
    let raw = await ethers.utils.serializeTransaction(unsignedTrx);
    raw = raw.replace(/^0x/, '')
    console.log(raw);
})()

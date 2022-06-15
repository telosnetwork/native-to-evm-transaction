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
    }
]

const provider = ethers.getDefaultProvider();
const nativeAccount = "prods.evm";
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


;(async () => {
    const evmAccount = await evmApi.telos.getEthAccountByTelosAccount(nativeAccount);
let linkedAddress = evmAccount.address;
const nonce = parseInt(await evmApi.telos.getNonce(linkedAddress), 16);
const feeData = await provider.getFeeData()
const gasPrice = BigNumber.from(`0x${await evmApi.telos.getGasPrice()}`)
// POPULATE TRANSACTION FROM ARGS
let unsignedTrx =  await contract.populateTransaction.setLockDuration("3600");
unsignedTrx.nonce = nonce;
unsignedTrx.gasLimit = BigNumber.from(`0xA0F4`);
unsignedTrx.gasPrice = gasPrice;
let raw = await ethers.utils.serializeTransaction(unsignedTrx);
raw = raw.replace(/^0x/, '')
console.log("Transaction: ", raw);
console.log("Sender: ", linkedAddress.replace(/^0x/, ''));
console.log("Cleos Command: ",  'cleos --url https://testnet.telos.caleos.io/ push action eosio.evm raw \'{"ram_payer": '+nativeAccount+', "tx": "'+ raw +'" , "estimate_gas": false, "sender": "'+ linkedAddress.replace(/^0x/, '') +'"}\' -p ' + nativeAccount);
})()


import  { TelosEvmApi } from "@telosnetwork/telosevm-js";
import fetch from "node-fetch";
import  Transaction from '@ethereumjs/tx'
import  {BigNumber, ethers}  from  'ethers';
import 'dotenv/config';
import contractABI from './abi/MintableToken.js'
// PARTIAL ABI W/ THE HELLO WORLD METHOD WE WANT TO CALL


const nativeAccount = process.env.NATIVE_ACCOUNT_ADDRESS;
const contractAddress = process.env.EVM_CONTRACT_ADDRESS;
const amount = (100 * (10 ** 18)).toString();

const provider = ethers.getDefaultProvider();
const contract = new ethers.Contract(contractAddress, contractABI, provider);
const evmApi = new TelosEvmApi({
    endpoint: "https://testnet.telos.net",
    chainId: '41',
    ethPrivateKeys: [],
    fetch: fetch,
    telosContract: 'eosio.evm',
    telosPrivateKeys: []
});
(async () => {
    var evmAccount, linkedAddress, nonce;
    try {
        evmAccount = await evmApi.telos.getEthAccountByTelosAccount(nativeAccount);
        linkedAddress = evmAccount.address;
        nonce = parseInt(await evmApi.telos.getNonce(linkedAddress), 16);
    } catch(e) {
        console.log(e.message);
        return;
    }

    const feeData = await provider.getFeeData()
    const gasPrice = BigNumber.from(`0x${await evmApi.telos.getGasPrice()}`)
    const gasLimit = BigNumber.from(`0x1E8480`);

// POPULATE TRANSACTION
    try {
        var unsignedTrx =  await contract.populateTransaction.mint(process.env.EVM_MINT_TO_ADDRESS, amount);
    } catch(e) {
        console.log(e.message);
        return;
    }
    unsignedTrx.nonce = nonce;
    unsignedTrx.gasLimit = gasLimit;
    unsignedTrx.gasPrice = gasPrice;

    // SERIALIZE IT
    try {
        var raw = await ethers.utils.serializeTransaction(unsignedTrx);
    } catch(e) {
        console.log(e.message);
        return;
    }
    raw = raw.replace(/^0x/, '');

    // PRINT IT OUT
    console.log("SERIALIZED_TX: ", raw);
    console.log("LINKED_ADDRESS: ", linkedAddress.replace(/^0x/, ''));
    console.log("CLEOS COMMAND: ",  'cleos --url https://testnet.telos.caleos.io/ push action eosio.evm raw \'{"ram_payer": '+nativeAccount+', "tx": "'+ raw +'" , "estimate_gas": false, "sender": "'+ linkedAddress.replace(/^0x/, '') +'"}\' -p ' + nativeAccount);

})()

# How-to: Native to EVM transaction

This repository documents how to call an EVM Solidity Contract from Native EOSIO

Use [this repository]() for an example implementation with the TelosEscrow Contract.

## Do it yourself

### 1. Prepare the EVM Transaction

Populating the EVM Transaction requires several variables:

- Sender
- Nonce
- Gas Limit
- Gas Price

We can get those variables using [telosevm-js](https://github.com/telosnetwork/telosevm-js):

```
import  { TelosEvmApi } from "@telosnetwork/telosevm-js";
import fetch from "node-fetch";
import  {BigNumber, ethers}  from  'ethers';

const evmApi = new TelosEvmApi({`
    endpoint: "https://testnet.telos.net",
    chainId: '41',
    ethPrivateKeys: [],
    fetch: fetch,
    telosContract: 'eosio.evm',
    telosPrivateKeys: []
});
```

**Sender**
```
const evmAccount = await evmApi.telos.getEthAccountByTelosAccount("mynativeaccount")
const linkedAddress = evmAccount.address;
```

**Nonce**
```
const nonce = parseInt(await evmApi.telos.getNonce(linkedAddress), 16);
```

**Gas Price**
```
const gasPrice = BigNumber.from(`0x${await evmApi.telos.getGasPrice()}`)
```

Then we need to use a library like etherJS to populate our new EVM Transaction with the appropriate `myMethod` method we want to call, its parameters and the variables we just set

```
const contractAddress = "0x20027f1e6f597c9e2049ddd5ffb0040aa47f6135";
const provider = ethers.getDefaultProvider();
const contract = new ethers.Contract(contractAddress, contractAbi, provider);
var unsignedTrx =  await contract.populateTransaction.myMethod("HELLO WORLD"); 
unsignedTrx.nonce = nonce;
unsignedTrx.gasLimit = BigNumber.from(`0xA0F4`);
unsignedTrx.gasPrice = gasPrice;
```

Finally, using the same library we serialize it

```
var serializedTransaction = await ethers.utils.serializeTransaction(unsignedTrx);
```


### 2. Send the EVM Transaction from Native

Once we have that serialized EVM transaction data, we can send it from Native to EVM using the eosio.evm contract's `raw()` method

For example, using cleos:

```
cleos --url https://testnet.telos.caleos.io/ push action eosio.evm raw '{
    "ram_payer": yournativeaccount,
    "tx": serializedTransaction, // Our serializedTransaction variable
    "estimate_gas": false,
    "sender": linkedAddress // Our linkedAddress variable
}' -p yournativeaccount
```


## Use our example

### Requirements

This repository requires NodeJS 14+ as well as EOSIO's `cleos` & `keosk` and a running `nodeos` instance

### An ERC20 Mintable token

Deploy your own mintable token in minutes using [our repository](https://github.com/telosnetwork/erc20-infinite-mint-example) and save the address

**OR**

Use our already deployed contract @ ...

### Edit environment values
Open the .env file and change the following values:


### Get the EVM Transaction data

`node serializeEVMTransaction.js`

Which will give you back the raw transaction data, something like:

`f8450685746050fb5682a0f49420027f1e6f597c9e2049ddd5ffb0040aa47f613580a44eb665af0000000000000000000000000000000000000000000000000000000000000e10`

### Use the eosio.evm contract's `raw` action to send it

### Add the token to your wallet and verify its balance
Using its address add the token to your favorite Telos EVM Wallet and check its balance to see if it matches !

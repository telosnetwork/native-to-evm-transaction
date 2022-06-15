# How-to: Native to EVM transaction

This repository documents how to call an EVM Solidity Contract from Native EOSIO

Use [this repository]() for an example implementation with the TelosEscrow Contract.


## Requirements

The example script in this repository requires NodeJS 14+

EOSIO's `cleos` & `keosk` are required to call eosio.evm `raw` method

## Rundown

### Prepare the EVM Transaction

Preparing the EVM Transaction requires several variables:

- Sender
- Nonce
- Gas Limit
- Gas Price
- Data

We can get those variables using [telosevm-js](https://github.com/telosnetwork/telosevm-js):

`import  { TelosEvmApi } from "@telosnetwork/telosevm-js";`

`const evmApi = new TelosEvmApi({`

    endpoint: "https://testnet.telos.net",

    chainId: '41',
    
    ethPrivateKeys: [],
    
    fetch: fetch,
    
    telosContract: 'eosio.evm',
    
    telosPrivateKeys: []

`});`

**Sender**
``const evmAccount = await evmApi.telos.getEthAccountByTelosAccount("mynativeaccount")
const linkedAddress = evmAccount.address;``

### Send the EVM Transaction from Native

## Example

### Install

Clone it

`git clone https://github.com/telosnetwork/native-to-evm-transaction-example`

Enter the directory

`cd native-to-evm-transaction-example`

Install dependencies

`npm install`

### Deploy

Save the address of your newly deployed HelloWorld contract

### Get the EVM Transaction data

Enter the script directory

`node serializeEVMTransaction.js`

Which will give you back the raw transaction data, something like:

`f8450685746050fb5682a0f49420027f1e6f597c9e2049ddd5ffb0040aa47f613580a44eb665af0000000000000000000000000000000000000000000000000000000000000e10`

### Use the eosio.evm contract's `raw` action to send it


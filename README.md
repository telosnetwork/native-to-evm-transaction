# How-to: Native to EVM transaction (with example)

This repository documents how to call an EVM Solidity Contract from Native EOSIO 


## Requirements

The example script in this repository requires NodeJS 14+

EOSIO's `cleos` & `keosk` are required to call eosio.evm `raw` method

## Rundown

###

###

## Example

### Install

`git clone https://github.com/telosnetwork/native-to-evm-transaction-example`

### Deploy

Save the address of the contract

### Get the EVM Transaction data

Enter the script directory

`node serializeEVMTransaction.js`

Which will give you back the raw transaction data, something like:

`f8450685746050fb5682a0f49420027f1e6f597c9e2049ddd5ffb0040aa47f613580a44eb665af0000000000000000000000000000000000000000000000000000000000000e10`

### Use the eosio.evm contract's `raw` action to send it


# Native to EVM transaction example

This repository documents how to send an EVM transaction from Native EOSIO 


## Requirements

This repository requires NodeJS 14+

## Rundown

### Get the EVM Transaction data

The `serializeEVMTransaction.js` script is an example on how to populate & serialize EVM transaction data, it is setup to print out serialized calls to TelosEscrow's `setLockDuration(uint seconds)`, `setMaxDeposits(uint max)` or `transferOwnership(address new_owner)` methods.

You can use it like so:

`node serializeEVMTransaction.js setLockDuration 3600`

Which will give you back:

`f8450685746050fb5682a0f49420027f1e6f597c9e2049ddd5ffb0040aa47f613580a44eb665af0000000000000000000000000000000000000000000000000000000000000e10`

### Use the eosio.evm contract to send it

Add that serialized EVM transaction as `tx` parameter to the following cleos command calling eosio.evm `raw` action:

`cleos --url https://testnet.telos.caleos.io/ push action eosio.evm raw '{"ram_payer": prods.evm, "tx": "f8450485746050fb5682a0f49420027f1e6f597c9e2049ddd5ffb0040aa47f613580a44eb665af0000000000000000000000000000000000000000000000000000000000000e10" , "estimate_gas": false, "sender": "7c56101c01eaaece3d1bb330910c8e9183b39dbd"}' -p prods.evm`

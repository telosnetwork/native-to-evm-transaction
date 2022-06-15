# Native to EVM transaction example

This repository documents how to send an EVM transaction from Native EOSIO 


## Requirements

This repository requires NodeJS 14+

## Rundown

The `serializeEVMTransaction.js` script is an example on how to get the populate & serialize EVM transaction data, it is setup to print out calls to TelosEscrow's setLockDuration, setMaxDeposits or transferOwnership methods.

You can use it like so:

`node serializeEVMTransaction.js setLockDuration 3600`

Which will give you back:

`f8450685746050fb5682a0f49420027f1e6f597c9e2049ddd5ffb0040aa47f613580a44eb665af0000000000000000000000000000000000000000000000000000000000000e10`

That you can add as `tx` parameter to the following cleos command calling eosio.evm `raw` action:

`cleos --url https://testnet.telos.caleos.io/ push action eosio.evm raw '{"ram_payer": prods.evm, "tx": "f8450485746050fb5682a0f49420027f1e6f597c9e2049ddd5ffb0040aa47f613580a44eb665af0000000000000000000000000000000000000000000000000000000000000e10" , "estimate_gas": false, "sender": "7c56101c01eaaece3d1bb330910c8e9183b39dbd"}' -p prods.evm`

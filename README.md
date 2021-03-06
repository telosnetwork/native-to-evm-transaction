# How-to: Native to EVM transaction

Using a [MintableToken](https://github.com/telosnetwork/erc20-mintable-example) example EVM contract, this repository documents how to call a Telos EVM Solidity Contract from Native Telos using the eosio.evm contract's `raw(ram_payer, tx, estimate_gas, sender)` action

Use [this repository](https://github.com/telosnetwork/native-multisig-to-evm-example) for an example implementation with Native multisig and the TelosEscrow EVM Contract.

## Requirements

This repository requires NodeJS 14+ as well as EOSIO's `cleos` & `keosk`

**⚠️ The EVM address linked to your native account MUST have enough TLOS in balance to pay for gas fees !**

## A - Using our MintableToken example

_This example mints some tokens by calling, from Telos Native, the mint() method of a mock Telos EVM [MintableToken](https://github.com/telosnetwork/erc20-mintable-example) contract_

### 1. Get a MintableToken address

- Get the EVM address linked to the native account you want to send this transaction from.
- Deploy your own mintable token on testnet in minutes using [our repository](https://github.com/telosnetwork/erc20-mintable-example) and that EVM address as `ACCOUNT` variable

**OR**

Use our already deployed freely mintable testnet contract @ `0xB849361F943136C948DaA33ECf7E39b7b9C6269D` (limited to 100 tokens minted per address)

### 2. Edit environment values
Open the .env file and change the following values:

```NATIVE_ACCOUNT_ADDRESS=USER_NATIVE_ACCOUNT```

_This is your Telos native account name. If you deployed a MintableToken use the native account you got the EVM address from_

```EVM_CONTRACT_ADDRESS=TOKEN_CONTRACT_ADDRESS```

_Paste in the ERC20 MintableToken address from step 1_

```EVM_MINT_TO_ADDRESS=USER_ACCOUNT_ADDRESS```

_This is the address you will receive the tokens on._

### 3. Get the serialiazed EVM Transaction

`node generateEVMTransaction.js`

Which will give you back the raw EVM transaction data and the EVM Address linked to your native account as well as an example cleos command, something like:

```SERIALIZED_TX: f8450685746050fb5682a0f49420027f1e6f597c9e2049ddd5ffb0040aa47f613580a44eb665af0000000000....```

```LINKED_ADDRESS: 0xe7209d65c5BB05cdf799b20fF0EC09E691FC3f12```

```CLEOS_COMMAND: cleos --url https://testnet.telos.caleos.io/ push action eosio.evm raw '{ .... ```

### 4. Use `cleos` to call the eosio.evm contract's `raw` action

Copy the `CLEOS_COMMAND` in the script output or make it yourself by replacing the variables where appropriate:

```
cleos --url https://testnet.telos.caleos.io/ push action eosio.evm raw '{
    "ram_payer": YOUR_NATIVE_ACCOUNT, // ie: thisisnottim
    "tx": SERIALIZED_TX, // the Serialized Transaction output
    "estimate_gas": false,
    "sender": LINKED_ADDRESS // Our Linked Address output
}' -p yournativeaccount
```

### 5. Add the token to your wallet and verify its balance
Using its address add the token to your favorite Telos EVM Wallet and check its balance to see if it matches 10 ! If it does, congrats ! You've just minted an EVM token from Telos Native ! 🤯🤯

## B - Doing it yourself

### 1. Prepare the EVM Transaction

Populating the EVM Transaction first requires several variables:

- Nonce
- Gas Price
- Gas Limit

We can retreive & compute those variables using [telosevm-js](https://github.com/telosnetwork/telosevm-js):

```
import  { TelosEvmApi } from "@telosnetwork/telosevm-js";
import fetch from "node-fetch";
import contractABI from './abi/MyContract.js' // Import the EVM contract's ABI here
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

**Nonce**
```
const evmAccount = await evmApi.telos.getEthAccountByTelosAccount("mynativeaccount")
const linkedAddress = evmAccount.address;
const nonce = parseInt(await evmApi.telos.getNonce(linkedAddress), 16);
```

**Gas Price**
```
const gasPrice = BigNumber.from(`0x${await evmApi.telos.getGasPrice()}`)
```

**Gas Limit**

_Remember that Telos EVM gas is fixed, we can hardcode the limit to what the real cost is, like so:_

```const gasLimit = BigNumber.from(`0x1E8480`); ```

**OR**

_You can use etherJS to estimate the gas and set that as limit (watch out that gas estimation can be too low)_

```const gasLimit = await contract.estimateGas.mint(ADDRESS, 10)```


Then we need to use a library like etherJS to populate our new EVM Transaction with the appropriate `myMethod` method we want to call, its parameters (a single `"HELLO WORLD"` string here) and the variables we just set

```
const contractAddress = "0x20027f1e6f597c9e2049ddd5ffb0040aa47f6135"; // Our EVM Contract address
const provider = ethers.getDefaultProvider();
const contract = new ethers.Contract(contractAddress, contractABI, provider);

var unsignedTrx =  await contract.populateTransaction.myMethod("HELLO WORLD"); // Populates a TX with a call to contract method
unsignedTrx.nonce = nonce;
unsignedTrx.gasLimit = gasLimit;
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
    "ram_payer": mynativeaccount,
    "tx": serializedTransaction, // Our serializedTransaction variable
    "estimate_gas": false,
    "sender": linkedAddress // Our linkedAddress variable
}' -p yournativeaccount
```

Another example would be implementing the [EOSJS library](https://developers.eos.io/manuals/eosjs/latest/index) in order to send the transaction programatically.



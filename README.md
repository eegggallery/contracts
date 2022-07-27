# eegg.gallery Contracts

## EEGG token

The EEGG token is an [EIP20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md) token with additional `AccessControl` and `Mint/Burn` functionality.

The total supply of the token is 1_000_000, and each token is divisible up to 18 decimal places.

To prevent accidental burns, the token does not allow transfers to the contract itself and to `0x00`.

### Details

- Deployments:
  - Ethereum Mainnet [EeggToken 1.0](./contracts/EeggToken.sol): [0x??](https://etherscan.io/address/0x??)
- Decimals: 18
- Name: Eegg Token
- Symbol: EEGG

## Development

```sh
git clone git@github.com:eegggallery/contracts.git
cd contracts
npm install
```

The repository uses [**HardHat**](https://hardhat.org/) development environment for Ethereum software.
All necessary commands with their config are prepared and can run directy from `npm`, like:

### Test

```sh
npm run test
```

### Report Gas

```sh
npm run gas
```

### Compile

```sh
npm run build
```

### Deploy to localhost

To test (using Metamask) you can deploy the contract to the `localhost` network following these steps:

1. Start a local node:

    ```sh
    npm run node
    ```

2. In another terminal deploy the contract to the `localhost` network:

    ```sh
    npm run deploy-local
    ```

3. To interact with the contract, use included [**operator UI**](./ui). Follow the operator UI [README](./ui/README.md).

import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-gas-reporter'

const config: HardhatUserConfig = {
    solidity: "0.8.9",
    gasReporter: {
        enabled: (process.env.REPORT_GAS) ? true : false,
    },
    networks: {
    },
}

export default config

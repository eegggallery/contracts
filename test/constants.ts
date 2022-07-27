import { ethers } from 'hardhat'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

export const MAX_UINT256 = ethers.BigNumber.from(2).pow(ethers.BigNumber.from(256)).sub(ethers.BigNumber.from(1))

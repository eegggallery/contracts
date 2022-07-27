import { ethers } from "hardhat"

async function main() {
    const [deployer] = await ethers.getSigners()

    console.log('Deploying contracts with account:', deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())

    const tokenFactory = await ethers.getContractFactory('EeggToken')
    const token = await tokenFactory.deploy()

    console.log('Token address:', token.address)
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })


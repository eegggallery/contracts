import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ethers } from 'ethers'
import artifactEeggToken from '../../../artifacts/contracts/EeggToken.sol/EeggToken.json'

const useConnect = defineStore('connect', () => {
    const address = ref(null)

    const hasProvider = ref(false)

    var provider = null

    const connect = () => {
        if (!hasProvider.value) {
            return
        }

        provider = new ethers.providers.Web3Provider(window.ethereum)
        resolveAddress()
    }

    const resolveEeggTokenContract = (addr) => {
        return new ethers.Contract(addr, artifactEeggToken.abi, provider?.getSigner())
    }

    const resolveAddress = () => {
        const signer = provider.getSigner()
        signer.getAddress()
            .then((addr) => {
                address.value = addr
            })
            .catch((err) => {
                console.error(err)
            })
    }

    if (typeof window.ethereum !== 'undefined') {
        ethereum.on('message', (msg) => {
            console.log('message', msg)
        })

        ethereum.on('accountsChanged', () => {
            resolveAddress()
        })

        ethereum.on('chainChanged', () => {
            connect()
        })

        hasProvider.value = true
    }

    return {
        address, hasProvider,
        connect,
        resolveEeggTokenContract,
    }
})

export default useConnect

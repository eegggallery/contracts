<template>
    <div>
        <form @submit.prevent="onLoad">
            <div class="flex flex-row w-full">
                <AppInput v-model="addr" label="Addr" class="flex-grow bg-slate-100" />
                <AppButton type="submit">
                    Load
                </AppButton>
            </div>
        </form>
        <div>
            <p>
                Symbol: {{ meta.symbol ?? '---' }}
            </p>
            <p>
                TotalSupply: {{ meta.totalSupply ?? '---' }}
            </p>
            <p>
                RealSupply: <span class="font-mono font-bold">{{ metaTotalSupplyHuman }}</span>
            </p>
            <p>
                Decimals: {{ meta.decimals ?? '---' }}
            </p>
        </div>
        <div v-if="contract != null" class="flex flex-col w-full space-y-8">
            <div>
                <ContractFunction
                    :contract="contract"
                    method="balanceOf"
                    :inputs="[{ name: 'address' }]"
                    @result="onBalanceOfResult"
                ></ContractFunction>
            </div>
            <div>
                <ContractFunction
                    :contract="contract"
                    method="transfer"
                    :inputs="[
                        { name: 'address' },
                        { name: 'amount' },
                    ]"
                    @result="onTransferResult"
                ></ContractFunction>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref, shallowRef } from 'vue'
import { ethers } from 'ethers'
import useConnect from '@/composable/useConnect.js'
import ContractFunction from './ContractFunction.vue'

const addr = ref('0x5fbdb2315678afecb367f032d93f642f64180aa3')

const connect = useConnect()

var contract = shallowRef(null)

const meta = reactive({
    decimals: null,
    symbol: null,
    totalSupply: null,
})

const onBalanceOfResult = (result) => {
    console.log(ethers.utils.formatUnits(result, meta.decimals))
}

const onTransferResult = (result) => {
    console.log(result)
}

const metaTotalSupplyHuman = computed(() => {
    if (meta.decimals == null || meta.totalSupply == null) {
        return '---'
    }
    return ethers.BigNumber.from(meta.totalSupply).div(
        ethers.BigNumber.from(10).pow(ethers.BigNumber.from(meta.decimals))
    )
})

const onLoad = () => {
    contract.value = connect.resolveEeggTokenContract(addr.value)
    console.log(contract.value)

    resolveFromContract(contract.value, 'symbol', 'symbol')
    resolveFromContract(contract.value, 'totalSupply', 'totalSupply')
    resolveFromContract(contract.value, 'decimals', 'decimals')
}

const resolveFromContract = (contract, method, property) => {
    contract[method]()
        .then((result) => {
            meta[property] = result
        })
        .catch((err) => {
            meta[property] = null
            console.error(err)
        })
}
</script>

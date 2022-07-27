<template>
    <div>
        <div v-if="!connect.hasProvider" class="flex w-full h-screen justify-center">
            <div class="m-auto">
                <p class="text-center">
                    <a href="https://metamask.io/" class="inline-flex space-x-2 hover:underline text-xl">
                        <span>
                            Please, install MetaMask
                        </span>
                        <ExternalLinkIcon class="text-gray-300 w-4 h-4" />
                    </a>
                </p>
            </div>
        </div>
        <div v-else>
            <AppButton @click.prevent="onConnect">
                Connect
            </AppButton>
            <p>
                Addr: <span class="font-mono">{{ connect.address }}</span>
            </p>
            <div>
                <EeggToken />
            </div>
        </div>
    </div>
</template>

<script setup>
import useConnect from '@/composable/useConnect.js'
import { ExternalLinkIcon } from '@heroicons/vue/outline'
import EeggToken from './components/EeggToken.vue'

const connect = useConnect()

const onConnect = () => {
    connect.connect()
}
</script>

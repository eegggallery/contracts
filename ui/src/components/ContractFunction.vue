<template>
    <div class="flex flex-col">
        <h4>
            {{ method }}
        </h4>
        <div class="flex flex-col space-y-2">
            <form @submit.prevent="onSubmit">
                <div v-for="(input, idx) in inputs" :key="idx">
                    <h5>{{ input.name }}</h5>
                    <AppInput v-model="models[input.name]" class="w-full" />
                </div>
                <AppButton type="submit">
                    <PlayIcon class="w-6 h-6" />
                </AppButton>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, toRef, watch } from 'vue'
import { PlayIcon } from '@heroicons/vue/outline'

const props = defineProps({
    contract: {
        type: Object,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    inputs: {
        type: Array,
        default: () => { return [] },
    },
})

const emit = defineEmits(['result'])

const inputs = toRef(props, 'inputs')

const models = reactive({})

watch(inputs, () => {
    inputs.value.forEach((input) => {
        if (!models.hasOwnProperty(input.name) && input.hasOwnProperty('default')) {
            models[input.name] = input.default
        }
    })
})


const onSubmit = () => {
    console.log('models', models)
    props.contract[props.method](...Object.values(models))
        .then((result) => {
            emit('result', result)
        })
        .catch((err) => {
            console.error(err)
        })
}
</script>

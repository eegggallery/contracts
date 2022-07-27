<template>
    <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="focus:border-stone-500 outline-none w-full sm:text-sm border-gray-300" />
</template>

<script setup>
const props = defineProps(['modelValue'])

const emit = defineEmits(['update:modelValue'])
</script>

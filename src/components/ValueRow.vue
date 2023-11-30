<script setup>
defineProps({
    label: String,
    value: Number,
    class: String,
    suffix: {
        type: String,
        default: 'kr',
    },
})
</script>

<template>
    <div class="flex justify-between">
        <div class="">{{ label }}</div>
        <div :class="class">{{ $filters.formatNumber(value) }} {{ suffix }}</div>
    </div>
</template>
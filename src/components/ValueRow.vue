<script setup>
defineProps({
    label: String,
    value: Number,
    suffix: {
        type: String,
        default: 'kr',
    },
})
</script>

<template>
    <div class="flex justify-between">
        <div class="">{{ label }}</div>
        <div class="">{{ $filters.formatNumber(value) }} {{ suffix }}</div>
    </div>
</template>
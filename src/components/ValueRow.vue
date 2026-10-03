<script setup>
defineProps({
  label: String,
  value: Number,
  suffix: { type: String, default: 'kr' }
})

const format = new Intl.NumberFormat('da-DK', { maximumFractionDigits: 2 }).format
</script>

<template>
  <div class="row">
    <div>{{ label }}</div>
    <div>{{ format(value ?? 0) }} {{ suffix }}</div>
  </div>
</template>

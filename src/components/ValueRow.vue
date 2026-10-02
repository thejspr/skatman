<script setup>
defineProps({
  label: String,
  value: Number,
  suffix: { type: String, default: 'kr' }
})
</script>

<template>
  <div class="flex justify-between items-center">
    <div>{{ label }}</div>
    <div>{{ $filters.formatNumber(value) }} {{ suffix }}</div>
  </div>
</template>

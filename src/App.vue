<script setup>
import TaxCalculator from './components/TaxCalculator.vue'
</script>

<template>
  <main class="">
    <div class="container mx-auto max-w-2xl mt-[5%]">
      <h1 class="text-white text-4xl font-bold text-center">Skatman</h1>
      <TaxCalculator />
      <div class="text-center text-white text-md">
        &middot;
        Lavet af <a href="https://webyard.dk" target="_blank" class="text-blue-500">webyard</a>
        &middot;
        {{ new Date().getFullYear() }}
        &middot;
        <a href="mailto:j@webyard.io" target="_blank" class="text-blue-500">kontakt</a>
        &middot;
      </div>
    </div>
  </main>
</template>

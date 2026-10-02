<script setup>
import { computed, ref } from 'vue'
import ValueRow from './ValueRow.vue'

const satser = {
  fradragMax: 49700,
  amb: 0.08,
  beskæftigelsesfradrag: 0.1065,
  beskæftigelsesfradragMax: 45100,
  jobfradrag: 0.045,
  jobfradragMax: 2800,
  kommuneskat: 0.2452,
  kirkeskat: 0.0074,
  bundskat: 0.1206,
  topskat: 0.15,
  topskatSats: 588900
}

const parse = (value) => Number(String(value ?? '').replace(/\D/g, ''))

// Månedsløn, hentet fra url ved indlæsning
const lønMd = ref(parse(new URLSearchParams(window.location.search).get('loen')))

function onInput(e) {
  const value = parse(e.target.value)
  if (value < 1) return

  lønMd.value = value
  window.history.replaceState({}, '', `?loen=${value}`)
}

// Alle beløb er per måned
const r = computed(() => {
  const årsløn = lønMd.value * 12
  const amb = årsløn * satser.amb
  const lønMinusAmb = årsløn - amb
  const fradrag = Math.min(satser.fradragMax, lønMd.value)
  const beskæftigelsesfradrag = Math.min(
    lønMinusAmb * satser.beskæftigelsesfradrag,
    satser.beskæftigelsesfradragMax
  )
  const jobfradrag = Math.min(lønMinusAmb * satser.jobfradrag, satser.jobfradragMax)

  const kommuneskat =
    (lønMinusAmb - beskæftigelsesfradrag - jobfradrag - fradrag) * satser.kommuneskat
  const bundskat = (lønMinusAmb - fradrag) * satser.bundskat
  const topskat = Math.max(årsløn - satser.topskatSats, 0) * satser.topskat
  const samletSkat = kommuneskat + bundskat + topskat + amb

  return {
    kommuneskat: kommuneskat / 12,
    bundskat: bundskat / 12,
    topskat: topskat / 12,
    amb: amb / 12,
    samletSkat: samletSkat / 12,
    skatteprocent: årsløn ? Math.round((samletSkat / årsløn) * 100) : 0,
    efterSkat: (årsløn - samletSkat) / 12,
    fradrag: fradrag / 12,
    beskæftigelsesfradrag: beskæftigelsesfradrag / 12,
    jobfradrag: jobfradrag / 12,
    samletFradrag: (fradrag + beskæftigelsesfradrag + jobfradrag) / 12
  }
})
</script>

<template>
  <div class="p-4">
    <div class="card text-center mb-4">
      <span class="mr-2">Indtast månedsløn</span>
      <input
        class="border border-gray-200 rounded-md p-2 text-right text-xl"
        type="text"
        inputmode="numeric"
        :value="$filters.formatNumber(lønMd)"
        @input="onInput"
      />
      <span class="ml-1">kr</span>
    </div>

    <div class="card mb-4 text-2xl">
      <ValueRow label="Udbetalt per måned" :value="r.efterSkat" />
    </div>

    <div class="flex gap-4 mb-4 flex-col md:flex-row">
      <div class="card basis-1/2">
        <h2 class="text-xl mb-2">Skatter</h2>
        <ValueRow label="Kommuneskat" :value="r.kommuneskat" />
        <ValueRow label="Bundskat" :value="r.bundskat" />
        <ValueRow label="Topskat" :value="r.topskat" />
        <ValueRow label="Arbejdsmarkedsbidrag" :value="r.amb" />
        <ValueRow class="mt-3 underline" label="Samlet" :value="r.samletSkat" />
        <ValueRow label="Skatteprocent" :value="r.skatteprocent" suffix="%" />
      </div>
      <div class="card basis-1/2">
        <h2 class="text-xl mb-2">Fradrag</h2>
        <ValueRow label="Skattefradrag" :value="r.fradrag" />
        <ValueRow label="Beskæftigelsesfradrag" :value="r.beskæftigelsesfradrag" />
        <ValueRow label="Jobfradrag" :value="r.jobfradrag" />
        <ValueRow class="mt-3 underline" label="Samlet" :value="r.samletFradrag" />
      </div>
    </div>

    <div class="card">
      <h2 class="text-xl mb-2">Satser</h2>
      <ValueRow label="Kommuneskat (Aarhus)" :value="satser.kommuneskat * 100" suffix="%" />
      <ValueRow label="Bundskat" :value="satser.bundskat * 100" suffix="%" />
      <ValueRow label="Topskat" :value="satser.topskat * 100" suffix="%" />
      <ValueRow label="Arbejdsmarkedsbidrag" :value="satser.amb * 100" suffix="%" />
    </div>
  </div>
</template>

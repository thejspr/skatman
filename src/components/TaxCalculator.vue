<script setup>
  import { ref } from 'vue'
  import ValueRow from './ValueRow.vue';

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
    topskatSats: 588900,
  };

  const input = ref(0) // input
  const årslønVal = ref(0)
  const ambVal = ref(0)
  const fradrag = ref(0)

  const beskæftigelsesfradragVal = ref(0)
  const jobfradragVal = ref(0)

  const kommuneskatVal = ref(0)
  const bundskatVal = ref(0)
  const topskatVal = ref(0)

  const samletSkatVal = ref(0)
  const samletSkatProcentVal = ref(0)
  const efterSkatVal = ref(0)

  // Beregner
  function beregn(e, i= e.target.value) {
    let lønMd = i.replaceAll(/\D/g, "")
    if (lønMd < 1) { return }

    input.value = lønMd

    årslønVal.value = lønMd * 12
    ambVal.value = årslønVal.value * satser.amb

    const lønMinusAmb = årslønVal.value - ambVal.value
    fradrag.value = Math.min(satser.fradragMax, lønMd)

    beskæftigelsesfradragVal.value = Math.min(lønMinusAmb * satser.beskæftigelsesfradrag,
    satser.beskæftigelsesfradragMax)

    jobfradragVal.value = Math.min(lønMinusAmb * satser.jobfradrag, satser.jobfradragMax)

    const efterFradrag = lønMinusAmb -
      beskæftigelsesfradragVal.value -
      jobfradragVal.value -
      fradrag.value
    const efterAmbOgFradrag = lønMinusAmb - fradrag.value

    kommuneskatVal.value = efterFradrag * satser.kommuneskat
    bundskatVal.value = efterAmbOgFradrag * satser.bundskat

    let topskatGundlag = årslønVal.value - satser.topskatSats
    if (topskatGundlag < 0) {
      topskatGundlag = 0
    }
    topskatVal.value = topskatGundlag * satser.topskat

    samletSkatVal.value = kommuneskatVal.value + bundskatVal.value + topskatVal.value + ambVal.value
    samletSkatProcentVal.value = Math.round(samletSkatVal.value / årslønVal.value * 100)

    efterSkatVal.value = årslønVal.value - samletSkatVal.value

    // store state in url
    window.history.replaceState({}, '', `?loen=${lønMd}`)
  }

  // Load state from url
  const urlParams = new URLSearchParams(window.location.search)
  const lønMd = urlParams.get('loen')
  if (lønMd) {
    beregn({ target: { value: lønMd } }, lønMd)
  }
</script>

<template>
  <div class="p-4">
    <div class="card text-center mb-4">
      <span class="mr-2">Indtast månedsløn</span>
      <input class="border rounded-md p-2 text-right text-xl" input="text"
        :value="$filters.formatNumber(input, false)" @input='beregn' />
      <span class="ml-1">kr</span>
    </div>

    <div class="card mb-4 text-2xl">
      <ValueRow label="Udbetalt per måned" :value="efterSkatVal / 12" />
    </div>

    <div class="flex gap-4 mb-4 flex-col md:flex-row">
      <div class="card basis-1/2">
        <h2 class="text-xl mb-2">Skatter</h2>
        <ValueRow label="Kommuneskat" :value="kommuneskatVal / 12" />
        <ValueRow label="Bundskat" :value="bundskatVal / 12" />
        <ValueRow label="Topskat" :value="topskatVal / 12" />
        <ValueRow label="Arbejdsmarkedsbidrag" :value="ambVal / 12" />
        <ValueRow class='mt-3 underline' label="Samlet" :value="samletSkatVal / 12" />
        <ValueRow label="Skatteprocent" :value="samletSkatProcentVal" suffix="%" />
      </div>
      <div class="card  basis-1/2">
        <h2 class="text-xl mb-2">Fradrag</h2>
        <ValueRow label="Skattefradrag" :value="fradrag / 12" />
        <ValueRow label="Beskæftigelsesfradrag" :value="beskæftigelsesfradragVal / 12" />
        <ValueRow label="Jobfradrag" :value="jobfradragVal / 12" />
        <ValueRow class='mt-3 underline' label="Samlet" :value="(fradrag + beskæftigelsesfradragVal + jobfradragVal) / 12" />
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

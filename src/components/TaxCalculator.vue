<script setup>
  const satser = {
    fradragMax: 48000,
    amb: 0.08,
    beskæftigelsesfradrag: 0.1065,
    beskæftigelsesfradragMax: 45600,
    jobfradrag: 0.045,
    jobfradragMax: 2700,
    kommuneskat: 0.25,
    bundskat: 0.1206,
    topskat: 0.15,
    topskatSats: 568900,
  };

  import { ref } from 'vue'

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
  const efterSkatVal = ref(0)
  const efterSkatMdVal = ref(0)

  // Beregner
  function beregn(e, lønMd = e.target.value) {
    if (lønMd < 1) {
      return
    }

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

    samletSkatVal.value = kommuneskatVal.value + bundskatVal.value + topskatVal.value
    const samletSkatAmb = samletSkatVal.value + ambVal.value

    efterSkatVal.value = årslønVal.value -
      samletSkatAmb -
      beskæftigelsesfradragVal.value -
      jobfradragVal.value +
      fradrag.value

    efterSkatMdVal.value = efterSkatVal.value / 12
  }
</script>

<template>
  <div class="calculator">
    <h1>Beregn udbetalt løn</h1>
    <div class="wrapper">
      <div class="form">
        <div class="form-group">
          <label>Månedsløn (før skat)</label><br />
          <input type="string" :value="input" @input='beregn' />
        </div>

        <h2>Udbetalt løn</h2>
        <ul>
          <li>Årsløn: {{ $filters.formatNumber(årslønVal) }}</li>
          <li>Skattefradrag: {{ $filters.formatNumber(fradrag) }}</li>
          <li>Arbejdsmarkedsbidrag: {{ $filters.formatNumber(ambVal) }}</li>
          <li>Beskæftigelsesfradrag: {{ $filters.formatNumber(beskæftigelsesfradragVal) }}</li>
          <li>Jobfradrag: {{ $filters.formatNumber(jobfradragVal) }}</li>
          <li>Kommuneskat: {{ $filters.formatNumber(kommuneskatVal) }}</li>
          <li>Bundskat: {{ $filters.formatNumber(bundskatVal) }}</li>
          <li>Topskat: {{ $filters.formatNumber(topskatVal) }}</li>
          <li>Samlet skat: {{ $filters.formatNumber(samletSkatVal) }}</li>
          <li>Til udbetaling: <b>{{ $filters.formatNumber(efterSkatVal) }}</b></li>
          <li>Til udbetaling pr måned: <b>{{ $filters.formatNumber(efterSkatMdVal) }}</b></li>
        </ul>

        <h2>Skattesatser</h2>
        <ul>
          <li>Kommuneskat: {{ satser.kommuneskat * 100 }}%</li>
          <li>Bundskat: {{ satser.bundskat * 100 }}%</li>
          <li>Topskat: {{ satser.topskat * 100 }}% (over {{ $filters.formatNumber(satser.topskatSats) }})</li>
          <li>Arbejdsmarkedsbidrag: {{ satser.amb * 100 }}%</li>
        </ul>
      </div>
    </div>
  </div>
</template>

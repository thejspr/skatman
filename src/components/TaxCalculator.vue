<script setup>
  import { ref } from 'vue'

  const løn = ref(1000000 / 12)

  const årslønVal = ref(løn.value * 12)
  const ambVal = ref(årslønVal.value * amb)

  const lønMinusAmb = årslønVal.value - ambVal.value

  const beskæftigelsesfradragVal = ref(
    Math.min(lønMinusAmb * beskæftigelsesfradrag, beskæftigelsesfradragMax)
  )
  const jobfradragVal = ref(
    Math.min(lønMinusAmb * jobfradrag, jobfradragMax)
  )

  const efterFradrag = lønMinusAmb - beskæftigelsesfradragVal.value - jobfradragVal.value - fradrag
  console.log(efterFradrag)
  const efterAmbOgFradrag = lønMinusAmb - fradrag

  const kommuneskatVal = ref(efterFradrag * kommuneskat)
  const bundskatVal = ref(efterAmbOgFradrag * bundskat)

  let topskatGundlag = årslønVal.value - topskatSats
  if (topskatGundlag < 0) {
    topskatGundlag = 0
  }
  const topskatVal = ref(topskatGundlag * topskat)

  const samletSkatVal = ref(
    kommuneskatVal.value + bundskatVal.value + topskatVal.value
  )
  const samletSkatAmb = samletSkatVal.value + ambVal.value
  //const kirkeskatVal = ref(0)

  const efterSkatVal = ref(
    Math.round(
      årslønVal.value -
      samletSkatAmb -
      beskæftigelsesfradragVal.value -
      jobfradragVal.value +
      fradrag
    )
  )

  // Skattesatser
  const fradrag = 48000
  const amb = 0.08
  const beskæftigelsesfradrag = 0.1065
  const beskæftigelsesfradragMax = 45600
  const jobfradrag = 0.045
  const jobfradragMax = 2700
  const kommuneskat = 0.25
  const bundskat = 0.1206
  const topskat = 0.15
  const topskatSats = 568900
  //const kirkeskat = 0.074

  // Beregner
  function beregn(e, løn = e.target.value) {
    årslønVal.value = løn * 12
    console.log('beregn')
  }
</script>

<template>
  <div class="calculator">
    <h1>Beregn udbetalt løn</h1>
    <div class="wrapper">
      <div class="form">
        <div class="form-group">
          <label>Månedsløn (før skat)</label><br />
          <input type="number" :value="løn" @change='beregn' />
        </div>

        <h2>Udbetalt løn</h2>
        <ul>
          <li>Årsløn: {{ årslønVal }}</li>
          <li>Skattefradrag: {{ fradrag }}</li>
          <li>Arbejdsmarkedsbidrag: {{ ambVal }}</li>
          <li>Beskæftigelsesfradrag: {{ beskæftigelsesfradragVal }}</li>
          <li>Jobfradrag: {{ jobfradragVal }}</li>
          <li>Kommuneskat: {{ kommuneskatVal }}</li>
          <li>Bundskat: {{ bundskatVal }}</li>
          <li>Topskat: {{ topskatVal }}</li>
          <li>Samlet skat: {{ samletSkatVal }}</li>
          <li>Til udbetaling: <b>{{ efterSkatVal }}</b></li>
        </ul>

        <h2>Skattesatser</h2>
        <ul>
          <li>Arbejdsmarkedsbidrag: {{ amb * 100 }}%</li>
          <li>Bundskat: {{ bundskat * 100 }}%</li>
          <li>Topskat: {{ topskat * 100 }}%</li>
          <li>Kommuneskat: {{ kommuneskat * 100 }}%</li>
          <li>Kirkeskat: {{ kirkeskat * 100 }}%</li>
        </ul>
      </div>
    </div>
  </div>
</template>

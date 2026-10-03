<script setup>
import { computed, ref, watch } from 'vue'
import ValueRow from './components/ValueRow.vue'

// Satser for 2026. Grænser gælder personlig indkomst efter AM-bidrag.
const satser = {
  amb: 0.08,
  personfradrag: 54100,
  beskæftigelsesfradrag: 0.1275,
  beskæftigelsesfradragMax: 63300,
  jobfradrag: 0.045,
  jobfradragGrænse: 235200,
  jobfradragMax: 3100,
  kommuneskat: 0.2452,
  kirkeskat: 0.0074,
  bundskat: 0.1201,
  mellemskat: 0.075,
  mellemskatGrænse: 641200,
  topskat: 0.075,
  topskatGrænse: 777900,
  toptopskat: 0.05,
  toptopskatGrænse: 2592700
}

const formatInput = (n) => (n ? new Intl.NumberFormat('da-DK').format(n) : '')
// Kun hele kroner: alt efter decimalkomma ignoreres, øvrige tegn (fx tusindtalspunktum) fjernes
const parse = (text) => Number((text ?? '').split(',')[0].replace(/\D/g, ''))

const params = new URLSearchParams(window.location.search)
const tekst = ref(formatInput(parse(params.get('loen'))))
const kirke = ref(params.get('kirke') === '1')
const lønMd = computed(() => parse(tekst.value))

watch([lønMd, kirke], () => {
  const query = new URLSearchParams()
  if (lønMd.value) query.set('loen', lønMd.value)
  if (kirke.value) query.set('kirke', '1')
  window.history.replaceState({}, '', query.size ? `?${query}` : window.location.pathname)
})

const over = (beløb, grænse) => Math.max(beløb - grænse, 0)

// Alle beløb er per måned
const r = computed(() => {
  const årsløn = lønMd.value * 12
  const amb = årsløn * satser.amb
  const personligIndkomst = årsløn - amb

  const personfradrag = Math.min(satser.personfradrag, personligIndkomst)
  const beskæftigelsesfradrag = Math.min(
    personligIndkomst * satser.beskæftigelsesfradrag,
    satser.beskæftigelsesfradragMax
  )
  const jobfradrag = Math.min(
    over(personligIndkomst, satser.jobfradragGrænse) * satser.jobfradrag,
    satser.jobfradragMax
  )

  const kommunalGrundlag = over(
    personligIndkomst - beskæftigelsesfradrag - jobfradrag,
    personfradrag
  )
  const kommuneskat = kommunalGrundlag * satser.kommuneskat
  const kirkeskat = kirke.value ? kommunalGrundlag * satser.kirkeskat : 0
  const bundskat = over(personligIndkomst, personfradrag) * satser.bundskat
  const mellemskat = over(personligIndkomst, satser.mellemskatGrænse) * satser.mellemskat
  const topskat = over(personligIndkomst, satser.topskatGrænse) * satser.topskat
  const toptopskat = over(personligIndkomst, satser.toptopskatGrænse) * satser.toptopskat

  const samletSkat = kommuneskat + kirkeskat + bundskat + mellemskat + topskat + toptopskat + amb

  return {
    kommuneskat: kommuneskat / 12,
    kirkeskat: kirkeskat / 12,
    bundskat: bundskat / 12,
    mellemskat: mellemskat / 12,
    topskat: topskat / 12,
    toptopskat: toptopskat / 12,
    amb: amb / 12,
    samletSkat: samletSkat / 12,
    skatteprocent: årsløn ? Math.round((samletSkat / årsløn) * 100) : 0,
    efterSkat: (årsløn - samletSkat) / 12,
    personfradrag: personfradrag / 12,
    beskæftigelsesfradrag: beskæftigelsesfradrag / 12,
    jobfradrag: jobfradrag / 12,
    samletFradrag: (personfradrag + beskæftigelsesfradrag + jobfradrag) / 12
  }
})
</script>

<template>
  <main>
    <h1>Skatman</h1>

    <div class="card center">
      <span>Indtast månedsløn</span>
      <input
        v-model="tekst"
        class="salary"
        type="text"
        inputmode="numeric"
        @blur="tekst = formatInput(lønMd)"
      />
      <span>kr</span>
      <label><input v-model="kirke" type="checkbox" /> Medlem af folkekirken</label>
    </div>

    <div class="card large">
      <ValueRow label="Udbetalt per måned" :value="r.efterSkat" />
    </div>

    <div class="columns">
      <div class="card">
        <h2>Skatter</h2>
        <ValueRow label="Kommuneskat" :value="r.kommuneskat" />
        <ValueRow v-if="kirke" label="Kirkeskat" :value="r.kirkeskat" />
        <ValueRow label="Bundskat" :value="r.bundskat" />
        <ValueRow label="Mellemskat" :value="r.mellemskat" />
        <ValueRow label="Topskat" :value="r.topskat" />
        <ValueRow v-if="r.toptopskat" label="Toptopskat" :value="r.toptopskat" />
        <ValueRow label="Arbejdsmarkedsbidrag" :value="r.amb" />
        <ValueRow class="total" label="Samlet" :value="r.samletSkat" />
        <ValueRow label="Skatteprocent" :value="r.skatteprocent" suffix="%" />
      </div>
      <div class="card">
        <h2>Fradrag</h2>
        <ValueRow label="Personfradrag" :value="r.personfradrag" />
        <ValueRow label="Beskæftigelsesfradrag" :value="r.beskæftigelsesfradrag" />
        <ValueRow label="Jobfradrag" :value="r.jobfradrag" />
        <ValueRow class="total" label="Samlet" :value="r.samletFradrag" />
      </div>
    </div>

    <div class="card">
      <h2>Satser 2026</h2>
      <ValueRow label="Kommuneskat (Aarhus)" :value="satser.kommuneskat * 100" suffix="%" />
      <ValueRow label="Kirkeskat (Aarhus)" :value="satser.kirkeskat * 100" suffix="%" />
      <ValueRow label="Bundskat" :value="satser.bundskat * 100" suffix="%" />
      <ValueRow label="Mellemskat" :value="satser.mellemskat * 100" suffix="%" />
      <ValueRow label="Topskat" :value="satser.topskat * 100" suffix="%" />
      <ValueRow label="Toptopskat" :value="satser.toptopskat * 100" suffix="%" />
      <ValueRow label="Arbejdsmarkedsbidrag" :value="satser.amb * 100" suffix="%" />
    </div>

    <footer>
      &middot; Lavet af <a href="https://webyard.dk" target="_blank">webyard</a> &middot;
      {{ new Date().getFullYear() }} &middot; <a href="mailto:j@webyard.dk">kontakt</a> &middot;
    </footer>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  background: url('/img/bg2.jpg') center / cover fixed;
}
main {
  max-width: 42rem;
  margin: 1rem auto 0;
  padding: 0 1rem 1rem;
}
h1 {
  margin: 0 0 1rem;
  color: white;
  font-size: 2.25rem;
  text-align: center;
}
h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: normal;
}
.card {
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
.center {
  text-align: center;
}
.large {
  font-size: 1.5rem;
}
.salary {
  margin: 0 0.25rem 0 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font: inherit;
  font-size: 1.25rem;
  text-align: right;
}
label {
  display: block;
  margin-top: 0.5rem;
}
.columns {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}
.columns .card {
  flex: 1;
  margin: 0;
}
@media (min-width: 768px) {
  .columns {
    flex-direction: row;
  }
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.total {
  margin-top: 0.75rem;
  text-decoration: underline;
}
footer {
  color: white;
  text-align: center;
}
footer a {
  color: #3b82f6;
  text-decoration: none;
}
</style>

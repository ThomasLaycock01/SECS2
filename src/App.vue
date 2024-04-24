<script setup>
import ResourceTable from "./components/ResourceTable.vue";
import LairTab from "./components/LairTab.vue";
import CultistsPanel from "./components/CultistsPanel.vue";
import TextLog from "./components/TextLog.vue";

import { useJobsStore } from "./stores/jobs";

const jobs = useJobsStore()

</script>

<template>
  

  <ResourceTable class="column is-one-fifth"/>
  <section class="column is-half">
    <b-tabs v-model="activeTab">
      <b-tab-item label="Lair" class="pl-0">
        <LairTab/>
      </b-tab-item>
      <b-tab-item label="Cult">
        <CultistsPanel/>
      </b-tab-item>
    </b-tabs>
  </section>
  <div class="column is-one-quarter">
    <TextLog/>
    <div>Assign menu</div>
  </div>
</template>

<script>

import { tick } from "./functions";

export default {
  mounted() {
    setInterval(tick, 1000)
  }
}

</script>
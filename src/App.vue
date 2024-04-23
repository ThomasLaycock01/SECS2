<script setup>
import ResourceTable from "./components/ResourceTable.vue";
import ActionSegment from "./components/ActionSegment.vue";
import CultistsPanel from "./components/CultistsPanel.vue";
import TextLog from "./components/TextLog.vue";

import { useJobsStore } from "./stores/jobs";

const jobs = useJobsStore()

</script>

<template>
  <ResourceTable class="column is-one-fifth"/>
  <ActionSegment class="column is-half"/>
  <div class="column is-one-quarter">
    <TextLog/>
    <div>Assign menu</div>
    <CultistsPanel/>
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
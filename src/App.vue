<script setup>
import ResourceTable from "./components/ResourceTable.vue";
import Buttons from "./components/Buttons.vue";
import CultistsPanel from "./components/CultistsPanel.vue";

import { useJobsStore } from "./stores/jobs";

const jobs = useJobsStore()

</script>

<template>
  <ResourceTable/>
  <Buttons/>
  <div>Assign menu</div>
  <CultistsPanel/>
</template>

<script>

import { tick } from "./functions";

export default {
  mounted() {
    setInterval(tick, 1000)
  }
}

</script>
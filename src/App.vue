<script setup>
import ResourceTable from "./components/ResourceTable.vue";
import LairTab from "./components/lairTab/LairTab.vue";
import CultistsTab from "./components/cultistTab/CultistsTab.vue";
import TextLog from "./components/TextLog.vue";
import JobAssigner from "./components/JobAssigner.vue";

//testing
import { useExpansionsStore } from "./stores/expansions";
import { useMiscStore } from "./stores/misc";
import { useBuildingsStore } from "./stores/buildings";

const expansions = useExpansionsStore();
const misc = useMiscStore();
const buildings = useBuildingsStore();

</script>

<template>
  

  <ResourceTable class="column is-one-fifth"/>
  <table>
    <thead>
      <tr>
        <td>Cultists</td>
        <td><span>{{ misc.getCultistOwned }}</span> / <span>{{ misc.getCultistLimit }}</span></td>
      </tr>
    </thead>
  </table>
  <section class="column is-half">
    <b-tabs v-model="activeTab">
      <b-tab-item label="Lair">
        <LairTab/>
      </b-tab-item>
      <b-tab-item label="Cult">
        <CultistsTab/>
      </b-tab-item>
    </b-tabs>
  </section>
  <div class="column is-one-quarter">
    <TextLog/>
    <JobAssigner/>
  </div>
</template>

<script>

import { tick } from "./functions";

export default {
  data() {
    return {activeTab: 0}
  },
  mounted() {
    setInterval(tick, 1000)
  }
}

</script>
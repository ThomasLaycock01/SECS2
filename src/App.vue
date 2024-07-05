<script setup>
import Tables from "./components/tables/Tables.vue";
import LairTab from "./components/lairTab/LairTab.vue";
import CultistsTab from "./components/cultistTab/CultistsTab.vue";
import TextLog from "./components/textLog/TextLog.vue";
import JobAssigner from "./components/jobAssigner/JobAssigner.vue";

import { useCultistsStore } from "./stores/cultists";


const cultists = useCultistsStore();
</script>

<template>
  

  <Tables class="column is-one-quarter"/>
  <section class="column is-half">
    <b-tabs v-model="activeTab">
      <b-tab-item label="Lair">
        <LairTab/>
      </b-tab-item>
      <b-tab-item :label="cultists.checkFreeSkillPoints ? 'Cult(!)' : 'Cult'">
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
    if (!localStorage.getItem("SECSData")) {
      localStorage.setItem("SECSData", JSON.stringify({}))
    }
    setInterval(tick, 1000);
  }
}

</script>
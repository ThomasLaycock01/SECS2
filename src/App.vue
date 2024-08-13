<script setup>
import Tables from "./components/tables/Tables.vue";
import LairTab from "./components/lairTab/LairTab.vue";
import CultistsTab from "./components/cultistTab/CultistsTab.vue";
import MineTab from "./components/mineTab/MineTab.vue";
import TextLog from "./components/textLog/TextLog.vue";
import JobAssigner from "./components/jobAssigner/JobAssigner.vue";
import InventoryTab from "./components/inventory/InventoryTab.vue";

import { useCultistsStore } from "./stores/cultists";
import { useMiscStore } from "./stores/misc";

const cultists = useCultistsStore();
const misc = useMiscStore();
</script>

<template>
  

  <Tables class="column is-one-quarter"/>
  <section class="column is-half">
    <b-tabs v-model="activeTab">
      <b-tab-item label="Lair">
        <LairTab/>
      </b-tab-item>
      <b-tab-item :label="cultists.checkFreeSkillPoints ? 'Cult(!)' : 'Cult'"  v-if="misc.checkHasSeenConvo(2)">
          <CultistsTab/>
      </b-tab-item>
      <b-tab-item label="Mines">
        <MineTab/>
      </b-tab-item>
      <b-tab-item label="Inventory">
        <InventoryTab/>
      </b-tab-item>
    </b-tabs>
  </section>
  <div class="column is-one-quarter">
    <TextLog/>
    <JobAssigner  v-if="misc.checkHasSeenConvo(3)"/>
  </div>
</template>

<script>

import { tick, loadData, saveData, instantiateItems } from "./functions";

import { useMiscStore } from "./stores/misc";
import { useTextLogStore } from "./stores/textLog";
import { useInventoryStore } from "./stores/inventory";

export default {
  data() {
    return {activeTab: 0}
  },
  mounted() {
    const misc = useMiscStore();
    const textLog = useTextLogStore();
    const inventory = useInventoryStore();

    textLog.loadConvos();
    inventory.loadItemIndex();
    instantiateItems();

    if (!misc.checkFirstLoad()) {
      localStorage.setItem("SECSData", JSON.stringify({}));
      saveData();
      setTimeout(function() {
        textLog.playConvo(0);
      }, 1000)
    }
    else {
      loadData();
    }
    setInterval(tick, 1000);
    setInterval(saveData, 10000)
  }
}

</script>
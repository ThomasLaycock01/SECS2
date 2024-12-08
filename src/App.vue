<script setup>
import Tables from "./components/tables/Tables.vue";
import LairTab from "./components/lairTab/LairTab.vue";
import HRTab from "./components/HRTab/HRTab.vue";
import InventoryTab from "./components/inventory/InventoryTab.vue";

import MainMinesTab from "./components/mineTab/MainMinesTab.vue";
import MainBarracksTab from "./components/barracksTab/MainBarracksTab.vue";

import { useExpansionsStore } from "./stores/globalPinias/expansions";

const expansions = useExpansionsStore();
</script>

<template>
  

  <Tables class="column is-one-quarter"/>
  <section class="column is-half">
    <b-tabs v-model="activeTab">
      <b-tab-item label="Lair">
        <LairTab/>
      </b-tab-item>
      <b-tab-item label="HR" >
          <HRTab/>
      </b-tab-item>
      <b-tab-item label="Inventory">
        <InventoryTab/>
      </b-tab-item>
      <b-tab-item label="Mines" v-if="expansions.hasExpansion('mines')">
        <MainMinesTab/>
      </b-tab-item>
      <b-tab-item label="Barracks" v-if="expansions.hasExpansion('barracks')">
        <MainBarracksTab/>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import { tick, instantiateResources, instantiateItems, instantiateBuildings } from "./functions";

import { useCultistsStore } from "./stores/globalPinias/cultists";

export default {
  data() {
    return {activeTab: 0}
  },
  beforeCreate() {
    const cultists = useCultistsStore();
    instantiateResources();
    cultists.instantiateRaces();
    instantiateItems();
    instantiateBuildings();
  },
  mounted() {
    setInterval(tick, 1000);
  }
}

</script>
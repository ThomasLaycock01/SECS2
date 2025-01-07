<script setup>
import Tables from "./components/tables/Tables.vue";

import AssignmentModal from "./components/modal/AssignmentModal.vue";

import LairTab from "./components/lairTab/LairTab.vue";
import HRTab from "./components/HRTab/HRTab.vue";
import InventoryTab from "./components/inventory/InventoryTab.vue";

import MainMinesTab from "./components/mineTab/MainMinesTab.vue";
import MainBarracksTab from "./components/barracksTab/MainBarracksTab.vue";

import { useExpansionsStore } from "./stores/globalPinias/expansions";
import { useModalsStore } from "./stores/misc/modal";

const expansions = useExpansionsStore();
const modals = useModalsStore();
</script>

<template>
  
  <div class="columns mt-1">
    <Tables class="column is-one-quarter"/>
    <section class="column is-half" @openModal="openModal()" @closeModal="closeModal()">
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
  </div>

  <AssignmentModal v-if="modals.checkModal('assignment')"/>
</template>

<script>
import { tick, instantiateResources, instantiateItems, instantiateBuildings } from "./functions";

import { useCultistsStore } from "./stores/globalPinias/cultists";
import { useExpeditionsStore } from "./stores/barracks/expeditions";

export default {
  data() {
    return {activeTab: 0}
  },
  beforeCreate() {
    const cultists = useCultistsStore();
    const expeditions = useExpeditionsStore();


    instantiateResources();
    cultists.instantiateRaces();
    instantiateItems();
    instantiateBuildings();
    expeditions.instantiateExpeditions();
  },
  mounted() {
    setInterval(tick, 1000);
  }
}

</script>
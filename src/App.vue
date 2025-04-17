<script setup>
import Tables from "./components/tables/Tables.vue";

import CultistModal from "./components/modal/CultistModal.vue";
import AssignmentModal from "./components/modal/AssignmentModal.vue";
import PartyModal from "./components/modal/PartyModal.vue";
import PartySelectModal from "./components/modal/PartySelectModal.vue";
import EquipmentModal from "./components/modal/EquipmentModal.vue";

import LairTab from "./components/lairTab/LairTab.vue";
import HRTab from "./components/HRTab/HRTab.vue";
import InventoryTab from "./components/inventory/InventoryTab.vue";

import MainExploreTab from "./components/exploreTab/MainExploreTab.vue";

import TextLog from "./components/textLog/TextLog.vue";

import { useCultistsStore } from "./stores/globalPinias/cultists";
import { useModalsStore } from "./stores/misc/modal";
import { useProgressionStore } from "./stores/misc/progression";

const cultists = useCultistsStore();
const modals = useModalsStore();
const progression = useProgressionStore();
</script>

<template>
  
  <div class="columns mt-1">
    <Tables class="column is-one-quarter"/>

    <section class="column is-half" @openModal="openModal()" @closeModal="closeModal()">
      <b-tabs v-model="activeTab">
        <b-tab-item label="Lair">
          <LairTab/>
        </b-tab-item>
        <b-tab-item :label="cultists.checkLevelUpAvailable ? 'HR(!)' : 'HR'" v-if="progression.checkUnlocked('10Evilness')">
            <HRTab/>
        </b-tab-item>
        <b-tab-item label="Explore" v-if="progression.checkUnlocked('firstCultist')">
          <MainExploreTab/>
        </b-tab-item>
        <b-tab-item label="Inventory" v-if="progression.checkUnlocked('firstItem')">
          <InventoryTab/>
        </b-tab-item>
      </b-tabs>
    </section>

    <TextLog class="column is-one-quarter"/>
  </div>

  <AssignmentModal v-if="modals.checkModal('assignment')"/>
  <PartyModal v-if="modals.checkModal('party')"/>
  <PartySelectModal v-if="modals.checkModal('partySelect')"/>
  <CultistModal v-if="modals.checkModal('cultist')"/>
  <EquipmentModal v-if="modals.checkModal('equipment')"/>
</template>

<script>
import { tick, instantiateGame } from "./functions";

export default {
  data() {
    return {activeTab: 0}
  },
  beforeCreate() {
    instantiateGame();
  },
  mounted() {
    setInterval(tick, 1000);
  }
}

</script>
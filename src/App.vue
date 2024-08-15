<script setup>
import Tables from "./components/tables/Tables.vue";
import LairTab from "./components/lairTab/LairTab.vue";
import HRTab from "./components/HRTab/HRTab.vue";
import MineTab from "./components/mineTab/MineTab.vue";
//import TextLog from "./components/textLog/TextLog.vue";
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
      <b-tab-item label="HR" >
          <HRTab/>
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
    <!--<TextLog/>-->
  </div>
</template>

<script>

import { tick, loadData, saveData, instantiateItems } from "./functions";

import { useMiscStore } from "./stores/misc";
import { useTextLogStore } from "./stores/textLog";

export default {
  data() {
    return {activeTab: 0}
  },
  mounted() {
    /*const misc = useMiscStore();
    const textLog = useTextLogStore();

    textLog.loadConvos();
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
    }*/
    setInterval(tick, 1000);
    //setInterval(saveData, 10000)
  }
}

</script>
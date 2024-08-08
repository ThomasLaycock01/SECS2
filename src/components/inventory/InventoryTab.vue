<script setup>
import { onMounted } from 'vue';

import InventoryPopup from './InventoryPopup.vue';

import { useInventoryStore } from '@/stores/inventory';

const inventory = useInventoryStore();

function inventoryButtonClick(e) {
  console.log(e.target);
  inventory.setSelectedItem(e.target.value);
}
</script>



<template>

<div class="title is-3 mb-1 segment-title">Inventory</div>

<div class="title is-4 mb-1 segment-title">Inventory</div>
        <div class="container">
            <span v-for="i in inventory.getInventory">
              <div>
                <button class="button is-dark" ref="inventoryButton" @click="inventoryButtonClick" :value="i.stackId">{{ i.shortName ? i.shortName : i.name }} {{i.amount }}</button>
                <div v-if="inventory.getSelectedItem == i.stackId">
                  <InventoryPopup class="inventoryPopup" :object="i" />
                </div>
              </div>
            </span>
            <span v-for="i in inventory.getUnusedSpaces">
                <button class="button is-outlined">Empty</button>
            </span>

        </div>
<!--
<b-tabs v-model="activeTab">
    <b-tab-item label="Inventory">
      </b-tab-item>
      <b-tab-item label="Workers">
        <div class="title is-4 mb-1 segment-title">Workers</div>
      </b-tab-item>
      <b-tab-item label="Market">
        <div class="title is-4 mb-1 segment-title">Market</div>
      </b-tab-item>
</b-tabs>
-->
</template>
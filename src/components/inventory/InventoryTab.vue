<script setup>

import InventoryPopup from './InventoryPopup.vue';

import { useInventoryStore } from '@/stores/inventory';

const inventory = useInventoryStore();

function inventoryButtonClick(e) {
  console.log(e.target.value);
  inventory.setSelectedItem(e.target.value);
}

function onClickAway(e) {
  console.log(e.target);
  //inventory.removeSelectedItem();
}
</script>



<template>

<div class="title is-3 mb-1 segment-title">Inventory</div>

<div class="title is-4 mb-1 segment-title">Inventory</div>
        <div class="container">
            <span v-for="i in inventory.getInventory">
              <div>
                <button class="button is-dark" @click="inventoryButtonClick" :value="i.getId()">{{ i.shortName ? i.shortName : i.name }}</button>
                <div v-if="inventory.getSelectedItem == i.getId()">
                  <InventoryPopup class="inventoryPopup" :object="i" />
                </div>
              </div>
            </span>
            <span v-for="i in inventory.getUnusedSpaces">
                <button class="button is-outlined">Empty</button>
            </span>

        </div>
</template>
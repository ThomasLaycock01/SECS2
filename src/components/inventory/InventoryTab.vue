<script setup>
import { useInventoryStore } from '@/stores/inventory';

const inventory = useInventoryStore();

var activeTab = 0;
</script>



<template>

<div class="title is-3 mb-1 segment-title">Inventory</div>

<b-tabs v-model="activeTab">
    <b-tab-item label="Inventory">
        <div class="title is-4 mb-1 segment-title">Inventory</div>
        <div class="container">
            <span v-for="i in inventory.getInventory">
                <button class="button is-dark">{{ i.shortName ? i.shortName : i.name }}</button>
            </span>
            <span v-for="i in inventory.getUnusedSpaces">
                <button class="button is-outlined">Empty</button>
            </span>

        </div>
      </b-tab-item>
      <b-tab-item label="Workers">
        <div class="title is-4 mb-1 segment-title">Workers</div>
      </b-tab-item>
</b-tabs>

</template>
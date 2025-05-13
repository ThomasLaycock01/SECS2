<script setup>
import Tooltip from '../tooltips/Tooltip.vue';

import { useInventoryStore } from '@/stores/globalPinias/inventory';
import { useTooltipsStore } from '@/stores/misc/tooltips';

const inventory = useInventoryStore();
const tooltips = useTooltipsStore();
</script>



<template>

  <div class="title is-3 mb-1 segment-title">Inventory</div>
  <button class="button is-dark" @click="inventory.sellAllUnequipped()">Sell All Unequpped</button>
  <br>
  <br>
  <div class="inventoryGridContainer">
      <span v-for="i in inventory.getInventory">
        <div>
          <button class="button" :class="i.getEquippedCultist() ? 'is-info' : 'is-dark'" @mouseover="tooltips.setActiveTooltip(`item${i.getId()}`)" @mouseleave="tooltips.removeActiveTooltip()">{{ i.getShortName() ? i.getShortName() : i.getName() }}</button>
          <div v-if="tooltips.getActiveTooltip == `item${i.getId()}`">
            <Tooltip class="tooltip" :tooltipObj="tooltips.getItemTooltip(i)" />
          </div>
        </div>
      </span>

  </div>
</template>
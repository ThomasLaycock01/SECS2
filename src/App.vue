<script setup>
import ResourceTable from "./components/ResourceTable.vue";
import Buttons from "./components/Buttons.vue";

import { useCultistsStore } from "./stores/cultists";

const cultists = useCultistsStore();

console.log(cultists.numOfCultists)
</script>

<template>
  <ResourceTable/>
  <Buttons/>
  <div>Assign menu</div>
</template>

<script>

export default {
  methods: {
    tick() {

    }
  }
}

</script>
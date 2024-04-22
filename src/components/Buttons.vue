<script setup>
import { useResourcesStore } from "@/stores/resources";

const resources = useResourcesStore();

import {actions} from "@/actions.js";

for (var i in actions.centralChamber) {
    console.log(i);
}
</script>

<template>
    <span v-for="action in actions.centralChamber">
        <button v-if="action.condition()" @click="action.effect">{{ action.name }}</button>
    </span>

</template>
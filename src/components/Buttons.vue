<script setup>
import { useResourcesStore } from "@/stores/resources";

const resources = useResourcesStore();

import {actions} from "@/actions.js";
</script>

<template>
    
    <button v-for="action in actions.centralChamber" @click="action.effect">{{ action.name }}</button>

</template>
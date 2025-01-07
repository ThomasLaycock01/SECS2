<script setup>
import { reactive } from 'vue';

import { useExpeditionsStore } from '@/stores/barracks/expeditions';

const expeditions = useExpeditionsStore();

var expeditionsTab = reactive({chosenExpedition: null});

function selectExpedition(obj) {
    expeditionsTab.chosenExpedition = obj;
}

function deselectExpedition() {
    expeditionsTab.chosenExpedition = null;
}
</script>


<template>

    <div class="title is-5 mb-1 segment-title">Expeditions</div>
    <div v-if="expeditionsTab.chosenExpedition">
        <p>{{ expeditionsTab.chosenExpedition.name }}</p>
        <p>Length {{ expeditions.getExpeditionLength(expeditionsTab.chosenExpedition.id) }}</p>
        <p>{{ expeditionsTab.chosenExpedition.desc }}</p>
        <button class="button is-dark">Embark!</button>
        <button class="button is-danger" @click="deselectExpedition()">Cancel</button>
    </div>
    <div v-else>
        <div v-for="i in expeditions.getAvailableExpeditions">
            <p>{{ i.name }}</p>
            <p>Length {{ expeditions.getExpeditionLength(i.id) }}</p>
            <button class="button is-dark" @click="selectExpedition(i)">Embark</button>
        </div>
    </div>

</template>
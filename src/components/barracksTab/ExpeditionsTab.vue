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
    <!--Display for chosing an expedition-->
    <!--A slightly more detailed screen, if no active expedition, but one has been selected-->
    <div v-if="expeditionsTab.chosenExpedition">
        <p>{{ expeditionsTab.chosenExpedition.name }}</p>
        <p>Length {{ expeditions.getExpeditionLength(expeditionsTab.chosenExpedition.id) }}</p>
        <p>{{ expeditionsTab.chosenExpedition.desc }}</p>
        <button class="button is-dark">Embark!</button>
        <button class="button is-danger" @click="deselectExpedition()">Cancel</button>
    </div>
    <!--If nothing else, a list of all expeditions-->
    <div v-else>
        <div v-for="i in expeditions.getAvailableExpeditions">
            <div v-if="i.getUnlocked()">
                <p>{{ i.getName() }}</p>
                <p>Length {{ i.getLength() }}</p>
                <button class="button is-dark" @click="selectExpedition(i)">Embark</button>
            </div>
        </div>
    </div>

</template>
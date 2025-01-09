<script setup>
import { reactive } from 'vue';

import { useExploreStore } from '@/stores/barracks/explore';

const explore = useExploreStore();

var exploreTab = reactive({selectedArea: null});

function setSelectedArea(obj) {
    exploreTab.selectedArea = obj;
}

function deselectArea() {
    exploreTab.selectedArea = null;
}
</script>


<template>

    <div class="title is-5 mb-1 segment-title">Explore</div>
    <!--Area view-->
    <div v-if="exploreTab.selectedArea">
        <p>{{ exploreTab.selectedArea.getName() }}</p>
        <p>{{ exploreTab.selectedArea.getDesc() }}</p>
        <button class="button is-dark">Embark!</button>
        <button class="button is-danger" @click="deselectArea()">Cancel</button>
    </div>
    <!--List pops up if no area selected-->
    <div v-else>
        <div v-for="i in explore.getAreas">
            <p>{{ i.getName() }}</p>
            <button class="button is-dark" @click="setSelectedArea(i)">Embark</button>
        </div>
    </div>

</template>
<script setup>
import BarracksTab from './BarracksTab.vue';
import ExpeditionsTab from './ExpeditionsTab.vue';
import ExploreTab from './ExploreTab.vue';

import { useExpansionsStore } from '@/stores/globalPinias/expansions';
const expansions = useExpansionsStore();
</script>


<template>
    <b-tabs v-model=activeBarracksTab>
        <b-tab-item label="Party">
            <BarracksTab/>
        </b-tab-item>
        <b-tab-item label="Explore">
            <ExploreTab/>
        </b-tab-item>
        <b-tab-item label="Expeditions">
            <ExpeditionsTab/>
        </b-tab-item>
    </b-tabs>
</template>

<script>
export default {
    data() {
        return {activeBarracksTab: 0}
    }
}
</script>
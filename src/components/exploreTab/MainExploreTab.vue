<script setup>
import PartyTab from './PartyTab.vue';
import ExpeditionsTab from './ExpeditionsTab.vue';
import ExploreTab from './ExploreTab.vue';

import { useProgressionStore } from '@/stores/misc/progression';

const progression = useProgressionStore();
</script>


<template>
    <b-tabs v-model=activeExploreTab>
        <b-tab-item label="Parties">
            <PartyTab/>
        </b-tab-item>
        <b-tab-item label="Explore" v-if="progression.checkUnlocked('firstParty')">
            <ExploreTab/>
        </b-tab-item>
        <b-tab-item label="Expeditions" v-if="progression.checkUnlocked('abandondedFarmhouseUnlocked')">
            <ExpeditionsTab/>
        </b-tab-item>
    </b-tabs>
</template>

<script>
export default {
    data() {
        return {activeExploreTab: 0}
    }
}
</script>
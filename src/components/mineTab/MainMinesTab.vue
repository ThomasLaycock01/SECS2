<script setup>
import MineTab from './MineTab.vue';
import ForgeTab from './ForgeTab.vue';
import MetalmancerTab from './MetalmancerTab.vue';

import { useExpansionsStore } from '@/stores/expansions';
const expansions = useExpansionsStore();
</script>


<template>
    <b-tabs v-model=activeMineTab>
        <b-tab-item label="Mines">
            <MineTab/>
        </b-tab-item>
        <b-tab-item label="Forge" v-if="expansions.hasExpansion('forge')">
            <ForgeTab/>
        </b-tab-item>
        <b-tab-item label="Metalmancer" v-if="expansions.hasExpansion('metalmancer')">
            <MetalmancerTab/>
        </b-tab-item>
    </b-tabs>
</template>

<script>
export default {
    data() {
        return {activeMineTab: 0}
    }
}
</script>
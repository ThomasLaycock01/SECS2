<script setup>
import MineTab from './MineTab.vue';
import ForgeTab from './ForgeTab.vue';
import SmelterTab from './SmelterTab.vue';
import WarformerTab from './WarformerTab.vue';
import MetalmancerTab from './MetalmancerTab.vue';
import GolemDissassemblerTab from './GolemDissassemblerTab.vue';
import TotemsTab from './TotemsTab.vue';

import { useExpansionsStore } from '@/stores/globalPinias/expansions';
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
        <b-tab-item label="Smelter" v-if="expansions.hasExpansion('smelter')">
            <SmelterTab/>
        </b-tab-item>
        <b-tab-item label="Warformer" v-if="expansions.hasExpansion('warformer')">
            <WarformerTab/>
        </b-tab-item>
        <b-tab-item label="Metalmancer" v-if="expansions.hasExpansion('metalmancer')">
            <MetalmancerTab/>
        </b-tab-item>
        <b-tab-item label="Golem Dissassembler" v-if="expansions.hasExpansion('golemDissassembler')">
            <GolemDissassemblerTab/>
        </b-tab-item>
        <b-tab-item label="Totems" v-if="expansions.hasExpansion('totems')">
            <TotemsTab/>
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
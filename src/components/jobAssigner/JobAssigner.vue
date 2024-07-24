<script setup>
import JobAssignerTab from './JobAssignerTab.vue';

import { useExpansionsStore } from '@/stores/expansions';
const expansions = useExpansionsStore();

var activeTab = 0;
var tier1 = expansions.getBuiltTier1Id
</script>

<template>
    <b-tabs v-model="activeTab">
      <b-tab-item label="Mines" :visible="tier1 == 'mines'">
        <JobAssignerTab :expansion="'mines'"/>
      </b-tab-item>
      <b-tab-item label="Laboratory" :visible="tier1 == 'laboratory'">
        <JobAssignerTab :expansion="'laboratory'"/>
      </b-tab-item>
      <b-tab-item label="Barracks" :visible="tier1 == 'laboratory'">
        <JobAssignerTab :expansion="'barracks'"/>
      </b-tab-item>
      <b-tab-item label="Tower" :visible="tier1 == 'laboratory'">
        <JobAssignerTab :expansion="'tower'"/>
      </b-tab-item>
      <b-tab-item label="Academy" :visible="tier1 == 'laboratory'">
        <JobAssignerTab :expansion="'academy'"/>
      </b-tab-item>
      <b-tab-item label="Dungeons" :visible="tier1 == 'laboratory'">
        <JobAssignerTab :expansion="'dungeons'"/>
      </b-tab-item>
    </b-tabs>
</template>
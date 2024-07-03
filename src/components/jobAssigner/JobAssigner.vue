<script setup>
import JobAssignerTab from './JobAssignerTab.vue';

var activeTab = 0;
</script>

<template>
    <b-tabs v-model="activeTab">
      <b-tab-item label="Gold">
        <JobAssignerTab :resource="'Gold'"/>
      </b-tab-item>
      <b-tab-item label="Crystals">
        <JobAssignerTab :resource="'Crystals'"/>
      </b-tab-item>
    </b-tabs>
</template>
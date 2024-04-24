<script setup>
import JobAssignerTab from './JobAssignerTab.vue';
</script>

<template>
    <b-tabs v-model="activeTab">
      <b-tab-item label="Gold">
        <JobAssignerTab :resource="'Gold'"/>
      </b-tab-item>
      <b-tab-item label="Crystals"></b-tab-item>
    </b-tabs>
</template>

<script>
export default {
  data() {
    return {activeTab: 0}
  }
}
</script>
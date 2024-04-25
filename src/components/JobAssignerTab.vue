<script setup>
import CultistList from './CultistList.vue';
import JobAssignerDropdown from './JobAssignerDropdown.vue';

import { useJobsStore } from '@/stores/jobs';

import { addCultistToJob } from '@/functions';

const jobs = useJobsStore();

const props = defineProps({
    resource: String
})

function selectChange(e) {
    console.log(props.resource)
    console.log(e.target)
    addCultistToJob(e.target.value, );
    e.target.value = "";
}
</script>

<template>
    <div v-for="i in jobs.getByProdType(props.resource)">
        <div class="title is-6 mb-1 segment-title">{{i.name}}</div>
        <CultistList :job="i" :resource="props.resource"/>
        <JobAssignerDropdown :job="i" :resource="props.resource"/>
    </div>
</template>
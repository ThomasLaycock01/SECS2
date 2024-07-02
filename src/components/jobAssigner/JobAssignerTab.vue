<script setup>
import CultistList from './CultistList.vue';
import JobAssignerDropdown from './JobAssignerDropdown.vue';

import { useJobsStore } from '@/stores/jobs';

const jobs = useJobsStore();

const props = defineProps({
    resource: String
})

console.log(jobs.getByProdType(props.resource));
</script>

<template>
    <div v-for="i in jobs.getByProdType(props.resource)">
        <div v-if="jobs.checkIfHasReqExapansion(i.reqExpansion, i.tier)">
            <div class="title is-6 mb-1 segment-title">{{i.name}}</div>
            <CultistList :job="i" :resource="props.resource"/>
            <JobAssignerDropdown :job="i" :resource="props.resource"/>
        </div>
    </div>
</template>
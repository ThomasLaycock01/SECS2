<script setup>
import CultistList from './CultistList.vue';
import JobAssignerDropdown from './JobAssignerDropdown.vue';

import { useJobsStore } from '@/stores/jobs';

const jobs = useJobsStore();

const props = defineProps({
    resource: String
})
</script>

<template>
    <div v-for="i in jobs.getByOutput(props.resource)">
        <div v-if="true/*jobs.checkIfHasReqExapansion(i.reqExpansion, i.tier)*/">
            <div class="title is-6 mb-1 segment-title">{{i.name}}</div>
            <CultistList :job="i"/>
            <JobAssignerDropdown :job="i"/>
        </div>
    </div>
</template>
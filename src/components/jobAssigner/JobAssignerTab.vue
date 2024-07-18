<script setup>
import JobAssignerDropdown from './JobAssignerDropdown.vue';

import { removeCultistFromJob } from '@/functions';

import { useJobsStore } from '@/stores/jobs';

const jobs = useJobsStore();

const props = defineProps({
    resource: String
})

function fireButtonClick(e) {
    removeCultistFromJob(e.target.value);
}
</script>

<template>
    <div v-for="i in jobs.getByOutput(props.resource)">
        <div v-if="i.requirement()">
            <div class="title is-6 mb-1 segment-title">{{i.name}}</div>
            <!--List of cultists working in a job-->
            <div v-for="j in jobs.getBaseArray(i.id)">
                <div>{{ j.getName() }} - Producing {{ j.getStat(i.stat) }} /s <button class="button is-small is-danger" :value="j.getId()" @click="fireButtonClick">X</button></div>
            </div>
            <JobAssignerDropdown :job="i"/>
        </div>
    </div>
</template>
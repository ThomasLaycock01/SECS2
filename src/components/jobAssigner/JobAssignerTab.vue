<script setup>
import JobAssignerDropdown from './JobAssignerDropdown.vue';

import { removeCultistFromJob } from '@/functions';

import { useJobsStore } from '@/stores/jobs';
import { useCultistsStore } from '@/stores/cultists';

const jobs = useJobsStore();
const cultists = useCultistsStore();

const props = defineProps({
    expansion: String
})

function fireButtonClick(e) {
    removeCultistFromJob(e.target.value);
}
</script>

<template>
    <div v-for="i in jobs.getByExpansion(props.expansion)">
        <div v-if="i.requirement()">
            <div class="title is-6 mb-1 segment-title">{{i.name}} - produces {{ i.output }} - use {{ i.stat.toUpperCase() }}</div>
            <!--List of cultists working in a job-->
            <div v-for="j in jobs.getBaseArray(i.id)">
                <div>{{ cultists.getCultistById(j).getName() }} - Producing {{ cultists.getCultistById(j).getStat(i.stat) }} /s <button class="button is-small is-danger" :value="cultists.getCultistById(j).getId()" @click="fireButtonClick">X</button></div>
            </div>
            <JobAssignerDropdown :job="i"/>
        </div>
    </div>
</template>
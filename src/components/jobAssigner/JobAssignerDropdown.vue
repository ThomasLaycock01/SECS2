<script setup>
import { useCultistsStore } from '@/stores/cultists';
import { useJobsStore } from '@/stores/jobs';

import { addCultistToJob } from '@/functions';

const cultists = useCultistsStore();
const jobs = useJobsStore();

const props = defineProps({
    resource: String,
    job: Object
})


//REMEMBER TO FIX THIS - not unassigning cultist properly when one is selected;

function selectChange(e) {
    addCultistToJob(e.target.value, props.resource, props.job.id);
    e.target.value = "";
}
</script>

<template>
    <b-field label="Add Cultist">
            <b-select placeholder="Add Cultist" value="" @input="selectChange" :disabled="!cultists.checkUnemployed() || jobs.checkIfAtLimit(props.resource, props.job.id)">
                <option v-for="j in cultists.getUnemployed" :value="j.getId()">{{ j.getName() }}</option>
            </b-select>
    </b-field>
</template>
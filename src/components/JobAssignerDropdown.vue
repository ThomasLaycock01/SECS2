<script setup>
import { useCultistsStore } from '@/stores/cultists';

import { addCultistToJob } from '@/functions';

const cultists = useCultistsStore();

const props = defineProps({
    resource: String,
    job: Object
})

function selectChange(e) {
    addCultistToJob(e.target.value, props.resource, props.job.id);
    e.target.value = "";
}
</script>

<template>
    <b-field label="Add Cultist">
            <b-select placeholder="Add Cultist" value="" @input="selectChange" :disabled="!cultists.checkUnemployed()">
                <option v-for="j in cultists.getUnemployed" :value="j.getId()">{{ j.getName() }}</option>
            </b-select>
        </b-field>
</template>
<script setup>
import CultistList from './CultistList.vue';

import { useJobsStore } from '@/stores/jobs';
import { useCultistsStore } from '@/stores/cultists';

const jobs = useJobsStore();
const cultists = useCultistsStore();

const props = defineProps({
    resource: String
})

const resource = props.resource;

const jobObject = jobs.getByProdType(props.resource);

for (var i in jobObject) {
    console.log(i);
    console.log(resource);
    console.log(jobs.getArray(resource, i));
}

const jobCultistArray = jobs.getArray(resource, i)
const cultistArray = cultists.regularCultists;
</script>

<template>
    <div v-for="i in jobObject">
        <div class="title is-6 mb-1 segment-title">{{i.name}}</div>
        <CultistList v-for="j in jobCultistArray" :job="i" :cultist="j"/>
        <b-field label="Add Cultist">
            <b-select placeholder="Add Cultist" value="" @input="selectChange" :disabled="!cultists.checkUnemployed()">
                <option v-for="j in cultistArray" :value="j.getId()">{{ j.getName() }}</option>
            </b-select>
        </b-field>
    </div>
</template>

<script>
import { addCultistToJob } from '@/functions';

export default {
    methods: {
        selectChange(e) {
            console.log(e.target);
            addCultistToJob(e.target.value);
            e.target.value = "";
        }
    }
}
</script>
<script setup>
import { removeCultistFromJob } from '@/functions';
import { useJobsStore } from '@/stores/jobs';

const jobs = useJobsStore();

const props = defineProps({
    job: Object
})

function buttonClick(e) {
    removeCultistFromJob(e.target.value);
}
</script>

<template>
    <div v-for="i in jobs.getBaseArray(props.job.id)">
        <div>{{ i.getName() }} - Producing {{ i.getSpecies() == "Dwarf" && job.stat == "str" ?  i.getStat(props.job.stat) * props.job.output * 2 : i.getStat(props.job.stat) }} /s <button class="button is-small is-danger" :value="i.getId()" @click="buttonClick">X</button></div>
    </div>
</template>
<script setup>
import { removeCultistFromJob } from '@/functions';
import { useJobsStore } from '@/stores/jobs';

const jobs = useJobsStore();

const props = defineProps({
    job: Object,
    resource: String
})
</script>

<template>
    <div v-for="i in jobs.getArray(props.resource, props.job.id)">
        <div>{{ i.getName() }} - Producing {{ i.getSpecies() == "Dwarf" && job.stat == "str" ?  i.getStat(props.job.stat) * props.job.output * 2 : i.getStat(props.job.stat) * props.job.output }} /s <button class="button is-small is-danger" :value="i.getId()" @click="buttonClick">X</button></div>
    </div>
</template>

<script>
import { removeCultistFromJob } from '@/functions';

export default {
    methods: {
        buttonClick(e) {
            removeCultistFromJob(e.target.value);
        }
    }
}
</script>
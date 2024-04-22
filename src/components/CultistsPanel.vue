<script setup>
import Cultist from './Cultist.vue';

import { addCultist } from "@/functions.js";

import { useCultistsStore } from "@/stores/cultists";
import { useJobsStore } from '@/stores/jobs';

const cultists = useCultistsStore();
const jobs = useJobsStore();

</script>

<template>
    <button @click="addCultist">Hire Cultist</button>
    <select @change="onChange($event)">
        <option value="default">Select Cultist</option>
        <option v-for="cultist in cultists.regularCultists" :value="cultist.id">{{ cultist.name }}</option>
    </select>
    <Cultist v-for="cultist in cultists.regularCultists" :cultistId="cultist.id"/>
</template>

<script>
import { addCultistToJob } from '@/functions.js';

export default {
    computed: {

    },
    methods: {
        onChange(event) {
            const id = event.target.value;
            if (id != "default") {
                addCultistToJob(id);
            }
            event.target.value = "default";
        }
    }
}
</script>
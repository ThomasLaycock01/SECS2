<script setup>
import Cultist from './Cultist.vue';

import { useCultistsStore } from "@/stores/cultists";
import { useJobsStore } from '@/stores/jobs';

const cultists = useCultistsStore();
const jobs = useJobsStore();

</script>

<template>
    <div class="title is-4 mb-1 segment-title">Cultists</div>
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
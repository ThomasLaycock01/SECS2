<script setup>
import Cultist from './Cultist.vue';

import { useCultistsStore } from "@/stores/cultists";
import { useMiscStore } from '@/stores/misc';

const cultists = useCultistsStore();
const misc = useMiscStore();

</script>

<template>
    <div class="title is-4 mb-1 segment-title">Cultists</div>
    <!--<Cultist v-for="cultist in cultists.regularCultists" :cultistId="cultist.id"/>-->
    <div class="container">
        <span v-for="i in cultists.regularCultists">
            <div class="button is-outlined">Cultist</div>
        </span>
        <span v-for="i in misc.getCultistLimit - cultists.numOfCultists">
            <div class="button is-outlined">No cultist</div>
        </span>
    </div>
</template>
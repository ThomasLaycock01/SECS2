<script setup>
import ActionList from '../ActionList.vue';

import { useHRStore } from '@/stores/HR';
import { useCultistsStore } from "@/stores/globalPinias/cultists";
import { useModalsStore } from '@/stores/misc/modal';


const cultists = useCultistsStore();
const HR = useHRStore();
const modals = useModalsStore();

//for the cultist half of the screen
function cultistClick(cultist) {
    modals.openCultist(cultist);
}
</script>



<template>

    <div>
        <ActionList :piniaObject="HR"/>
    </div> 

    <div class="title is-4 mb-1 segment-title">Cultists</div>

    <div>
        <div class="title is-5 mb-1 segment-title">Cultists</div>
        <div class="cultistGridContainer">
            <span v-for="i in cultists.getCultists" class="gridItem">
                <button  class="button" :class="i.getPerkPoints() > 0 ? 'is-info' : 'is-dark'" @click="cultistClick(i)">{{i.getName()}}</button>
            </span>
            <span v-for="i in cultists.getCultistLimit - cultists.getNumOfCultists" class="gridItem">
                <div class="button is-outlined" disabled>Empty</div>
            </span>
        </div>
    </div>

</template>
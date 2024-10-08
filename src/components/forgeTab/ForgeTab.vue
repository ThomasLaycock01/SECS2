<script setup>
import ActionList from '../ActionList.vue';

import { addCultistToOverseerJob, addCultistToWorkerJob, removeCultistFromOverseerJob, removeCultistFromWorkerJob } from '@/functions';

import { useForgeStore } from '@/stores/forge';
import { useCultistsStore } from '@/stores/globalPinias/cultists';

const forge = useForgeStore();
const cultists = useCultistsStore();




function setOverseer(e) {
    addCultistToOverseerJob(e.target.value, forge)
}

function removeOverseerClick() {
    removeCultistFromOverseerJob(forge)
}

</script>




<template>
    <!--Actions-->
    <div>
        <ActionList :piniaObject="forge"/>
    </div>
    <!--Overseer-->
    <div>
        <div class="title is-5 mb-1 segment-title">Overseer</div>
        <div v-if="forge.getOverseer">
            <div>{{ forge.getOverseer.getName() }} - Currently boosting production by {{ Math.floor((forge.getOverseerModifier() - 1) * 100) }}%!</div>
            <button type="button" class="button is-danger" @click="removeOverseerClick">Remove Overseer</button>
        </div>
        <div v-else>
            Without an Overseer, production is only 50%!
            <b-field label="Assign Overseer">
                <b-select placeholder="Assign Overseer" value="" @input="setOverseer" :disabled="!cultists.checkUnemployed()">
                    <option v-for="j in cultists.getUnemployed" :value="j.getId()">{{ j.getName() }}</option>
                </b-select>
            </b-field>
        </div>
    </div>

</template>
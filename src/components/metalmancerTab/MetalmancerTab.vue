<script setup>
import ActionList from '../ActionList.vue';

import { useMetalmancerStore } from '@/stores/metalmancer';
import { useCultistsStore } from '@/stores/globalPinias/cultists';

import { addCultistToOtherJob, removeCultistFromOtherJob } from '@/functions';

const metalmancer = useMetalmancerStore();
const cultists = useCultistsStore();

function addMetalmancer(e) {
    addCultistToOtherJob(e.target.value, metalmancer, "metalmancer");
    e.target.value = "";
}

function removeMetalmancer(e) {
    removeCultistFromOtherJob(metalmancer, "metalmancer", e.target.value, false)
}
</script>

<template>

    <div>
        <ActionList :pinia-object="metalmancer"/>
    </div>
    <!--Metalmancers-->
    <div class="title is-5 mb-1 segment-title">Metalmancers</div>
    <b-field label="Assign Metalmancer">
        <b-select placeholder="Cultist" value="" @input="addMetalmancer" :disabled="!cultists.checkUnemployed()">
            <option v-for="i in cultists.getUnemployed" :value="i.getId()">{{ i.getName() }}</option>
        </b-select>
    </b-field>
    <div>
        <div v-for="i in metalmancer.getMetalmancers">
            <div class="inline-blockContainer">
                <div>
                    {{ i.getName() }} - Lvl {{ i.getLevel() }}
                </div>
                <button class="button is-small is-danger" :value="i.getId()" @click="removeMetalmancer">Remove</button>
            </div>
        </div>
    </div>

</template>
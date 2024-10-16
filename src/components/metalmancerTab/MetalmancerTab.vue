<script setup>
import { reactive } from 'vue';

import ActionList from '../ActionList.vue';

import { useMetalmancerStore } from '@/stores/metalmancer';
import { useCultistsStore } from '@/stores/globalPinias/cultists';
import { useResourcesStore } from '@/stores/globalPinias/resources';

import { addCultistToOtherJob, removeCultistFromOtherJob } from '@/functions';

const metalmancer = useMetalmancerStore();
const cultists = useCultistsStore();
const resources = useResourcesStore();


var golemCreation = reactive({metal: null});


function addMetalmancer(e) {
    addCultistToOtherJob(e.target.value, metalmancer, "metalmancer");
    e.target.value = "";
}

function removeMetalmancer(e) {
    removeCultistFromOtherJob(metalmancer, "metalmancer", e.target.value, false)
}

function createGolemClick() {
    metalmancer.summonGolem(golemCreation.metal);
    golemCreation.metal = null;
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
    <div v-if="metalmancer.getMetalmancers.length < 1">
        You will not be able to summon Golems without at least one Metalmancer!<br>
        All Golems will have a severe production penalty to production without at least one Metalmancer!
    </div>
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
    <!--Summoning-->
    <div class="title is-5 mb-1 segment-title">Golem Creation</div>
    <b-field label="Create Golem">
        <b-select placeholder="Metal" v-model="golemCreation.metal">
            <option v-for="i in resources.getResourcesByPinia('mines', true, {isGolem: true})" :value="i.id">{{ i.name }}</option>
        </b-select>
    </b-field>
    <div v-if="golemCreation.metal">
        <div>Creating that type of Golem will cost:</div>
        <ul>
            <li v-for="value, key in metalmancer.getGolemCosts(golemCreation.metal)">{{ key }} : {{ value }}</li>
        </ul>
        <button class="button is-dark" @click="createGolemClick">Create!</button>
    </div>

</template>
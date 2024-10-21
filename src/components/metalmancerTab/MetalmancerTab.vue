<script setup>
import { reactive } from 'vue';

import ActionList from '../ActionList.vue';

import { useMetalmancerStore } from '@/stores/metalmancer';
import { useCultistsStore } from '@/stores/globalPinias/cultists';
import { useResourcesStore } from '@/stores/globalPinias/resources';

import { addCultistToJob, removeCultistFromJob } from '@/functions';

const metalmancer = useMetalmancerStore();
const cultists = useCultistsStore();
const resources = useResourcesStore();

var metalmancerTab = reactive({metalmancerToAdd: null, golemType: null});


function assignMetalmancer() {
    addCultistToJob(metalmancer, "metalmancer", metalmancerTab.metalmancerToAdd);
    
    metalmancerTab.metalmancerToAdd = null;
}

function removeMetalmancer(e) {
    removeCultistFromJob(metalmancer, "metalmancer", e.target.value)
}

function createGolemClick() {
    resources.removeResources(metalmancer.getGolemCosts(metalmancerTab.golemType));

    metalmancer.summonGolem(metalmancerTab.golemType);
    metalmancerTab.golemType = null;
}
</script>

<template>

    <div>
        <ActionList :pinia-object="metalmancer"/>
    </div>
    <!--Metalmancers-->
    <div class="title is-5 mb-1 segment-title">Metalmancers - {{ metalmancer.getMetalmancerArray.length }} / {{ metalmancer.getJobLimit("metalmancer") }}</div>
    <b-field label="Assign Metalmancer">
        <b-select placeholder="Cultist" :disabled="!cultists.checkUnemployed() || !metalmancer.checkIfJobHasSpace('metalmancer')" v-model="metalmancerTab.metalmancerToAdd">
            <option v-for="i in cultists.getUnemployed" :value="i.getId()">{{ i.getName() }}</option>
        </b-select>
    </b-field>
    <button v-if="metalmancerTab.metalmancerToAdd != null" class="button is-dark" @click="assignMetalmancer">Assign</button>
    <div v-if="metalmancer.getMetalmancerArray.length < 1">
        You will not be able to summon Golems without at least one Metalmancer!<br>
        All Golems will have a severe production penalty to production without at least one Metalmancer!
    </div>
    <div>
        <div v-for="i in metalmancer.getMetalmancerArray">
            <div class="inline-blockContainer">
                <div>
                    {{ cultists.getCultistById(i).getName() }} - Lvl {{ cultists.getCultistById(i).getLevel() }}
                </div>
                <button class="button is-small is-danger" :value="cultists.getCultistById(i).getId()" @click="removeMetalmancer">Remove</button>
            </div>
        </div>
    </div>
    <!--Summoning-->
    <div class="title is-5 mb-1 segment-title">Golem Creation</div>
    <b-field label="Create Golem">
        <b-select placeholder="Metal" v-model="metalmancerTab.golemType">
            <option v-for="i in cultists.getRacesByRacialGroup('golem')" :value="i.id">{{ i.name }}</option>
        </b-select>
    </b-field>
    <div v-if="metalmancerTab.golemType">
        <div>Creating that type of Golem will cost:</div>
        <ul>
            <li v-for="value, key in cultists.getRaceCosts(metalmancerTab.golemType)">{{ key }} : {{ value }}</li>
        </ul>
        <button class="button is-dark" @click="createGolemClick" :disabled="!cultists.checkCultistSpace() || !resources.checkIfCanAfford(cultists.getRaceCosts(metalmancerTab.golemType))">Create!</button>
    </div>
    <div v-if="metalmancer.getSummoningQueue.length > 0">
        <div>Currently Summoning: {{ metalmancer.getCurrentSummoning.golemType }}</div>
        <div>Current Progress: {{ metalmancer.getCurrentSummoningPercentage }}%</div>
        <div>
            Queue:
        </div>
        <div v-for="i in metalmancer.getSummoningQueue">
            {{i.golemType}}
        </div>
    </div>

</template>
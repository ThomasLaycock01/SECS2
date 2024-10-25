<script setup>
import { reactive } from 'vue';

import ActionList from '../ActionList.vue';

import { addCultistToJob, removeCultistFromJob } from '@/functions';

import { useWarformerStore } from '@/stores/warformer';
import { useCultistsStore } from '@/stores/globalPinias/cultists';
import { useResourcesStore } from '@/stores/globalPinias/resources';

const warformer = useWarformerStore();
const cultists = useCultistsStore();
const resources = useResourcesStore();

var warformerTab = reactive({warformerToAssign: null, warformToSummon: null});




function assignWarformer() {
    addCultistToJob(warformer, "warformer", warformerTab.warformerToAssign);

    warformerTab.warformerToAssign = null;
}

function removeWarformer(e) {
    removeCultistFromJob(warformer, "warformer", e.target.value);
}

function createWarformClick() {
    console.log("createWarformClick");
}
</script>




<template>
    <!--Actions-->
    <div>
        <ActionList :piniaObject="warformer"/>
    </div>
    <div>
        <div class="title is-5 mb-1 segment-title">Warformer - {{ warformer.getWarformerArray.length }} / {{ warformer.getJobLimit("warformer") }}</div>
        <div v-if="warformer.getWarformerArray">
            <div v-for="i in warformer.getWarformerArray">
                <div class=inline-blockContainer>
                    <div>{{ cultists.getCultistById(i).getName() }}</div>
                    <button class="button is-small is-danger" :value="i" @click="removeWarformer">Remove</button>
                </div>
            </div>
        </div>
        <div>
            <b-field label="Assign Warformer">
                <b-select placeholder="Cultist" :disabled="!cultists.checkUnemployed() || !warformer.checkIfJobHasSpace('warformer')" v-model="warformerTab.warformerToAssign">
                    <option v-for="i in cultists.getUnemployed" :value="i.getId()">{{ i.getName() }}</option>
                </b-select>
            </b-field>
            <button v-if="warformerTab.warformerToAssign != null" class="button is-dark" @click="assignWarformer">Assign</button>
        </div>
        <!--Summoning-->
        <div class="title is-5 mb-1 segment-title">Warform Creation</div>
        <b-field label="Create Warform">
            <b-select placeholder="Warform" v-model="warformerTab.warformToSummon" :disabled="!cultists.checkSummonedCultistSpace()">
                <option v-for="i in cultists.getRacesByRacialGroup('warform')" :value="i.id">{{ i.name }}</option>
            </b-select>
        </b-field>
        <div v-if="warformerTab.warformToSummon">
            <div>Creating that type of Warform will cost:</div>
            <!--
            <ul>
                <li v-for="value, key in cultists.getRaceCosts(metalmancerTab.golemType)">{{ key }} : {{ value }}</li>
            </ul>
            -->
            <button class="button is-dark" @click="createWarformClick" :disabled="!resources.checkIfCanAfford(cultists.getRaceCosts(warformerTab.warformToSummon))">Create!</button>
        </div>
        <div v-if="warformer.getQueue.length">
            <div>Currently Summoning: {{ warformer.getCurrentSummoning }}</div>
            <div>Current Progress: {{ warformer.getCurrentSummoningPercentage }}%</div>
            <div>
                Queue:
            </div>
            <div v-for="i in warformer.getQueue">
                {{i}}
            </div>
        </div>
    </div>
</template>
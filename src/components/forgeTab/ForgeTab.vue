<script setup>
import { reactive } from 'vue';

import ActionList from '../ActionList.vue';

import { addCultistToOverseerJob, addCultistToWorkerJob, removeCultistFromOverseerJob, removeCultistFromWorkerJob } from '@/functions';

import { useForgeStore } from '@/stores/forge';
import { useCultistsStore } from '@/stores/globalPinias/cultists';

const forge = useForgeStore();
const cultists = useCultistsStore();


var workerToAssign = reactive({worker: null});
var resourceToAssign = reactive({resource: null});



function setWorker(e) {
    workerToAssign.worker = e.target.value;
}

function setResource(e) {
    resourceToAssign.resource = e.target.value;
}

function assignWorker() {
    const obj = {
        id: workerToAssign.worker,
        resource: resourceToAssign.resource
    }
    
    addCultistToWorkerJob(obj, forge);

    workerToAssign.worker = null;
    resourceToAssign.resource = null;
}

function setOverseer(e) {
    addCultistToOverseerJob(e.target.value, forge)
}

function removeOverseerClick() {
    removeCultistFromOverseerJob(forge)
}

function removeWorkerClick(e) {
    removeCultistFromWorkerJob(e.target.value, forge)
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
    <!--Workers-->
    <div>
        <div class="title is-5 mb-1 segment-title">Workers</div>
        <!--The display for adding a worker-->
        <div class="inline-blockContainer">
            <div>
                <b-field label="Worker">
                    <b-select placeholder="Worker" @input="setWorker" v-model="workerToAssign.worker" :disabled="!cultists.checkUnemployed()">
                        <option v-for="i in cultists.getUnemployed" :value="i.getId()">{{ i.getName() }}</option>
                    </b-select>
                </b-field>
            </div>
            <div v-if="workerToAssign.worker != null">
                <b-field label="Resource">
                    <b-select placeholder="Resource" @input="setResource" v-model="resourceToAssign.resource">
                        <option v-for="i in forge.getUnlockResources" :value="i.id">{{ i.name }}</option>
                    </b-select>
                </b-field>
            </div>
            <div v-if="resourceToAssign.resource">
                <button class="button is-dark mb-1 mr-2" @click="assignWorker">Assign!</button>
            </div>
        </div>
        <br>
        <!--Displaying workers already working-->
        <div>
            <div v-for="i in forge.getWorkerArray">
                <div>{{ cultists.getCultistById(i.id).getName() }} - Lvl {{ cultists.getCultistById(i.id).getLevel() }} - {{ `Smithing ${i.resource}` }}</div>
                <button class="button is-small is-info">Switch resource</button>
                <button class="button is-small is-danger" :value="i.id" @click="removeWorkerClick">Remove</button></div>
        </div>
    </div>

</template>
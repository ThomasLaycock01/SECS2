<script setup>
import { reactive } from 'vue';

import { addCultistToOverseerJob, addCultistToWorkerJob, removeCultistFromOverseerJob, removeCultistFromWorkerJob } from '@/functions';

import { useMinesStore } from '@/stores/mines';
import { useCultistsStore } from '@/stores/cultists';

const mines = useMinesStore();
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
    
    addCultistToWorkerJob(obj, mines);

    workerToAssign.worker = null;
    resourceToAssign.resource = null;
}

function setOverseer(e) {
    addCultistToOverseerJob(e.target.value, mines)
    workerToAssign.worker = null;
}

function removeOverseerClick() {
    removeCultistFromOverseerJob(mines)
}

function removeWorkerClick(e) {
    console.log(e.target.value);
    removeCultistFromWorkerJob(e.target.value, mines)
}
</script>




<template>

<!--<ActionList :actions="mineActions"/>-->

<div>
    <!--Actions-->
    <div>
        <span v-for="action in mines.getActions">
            <button v-if="action.showCondition()" :disabled="!action.condition()" @click="action.effect()"  class="button is-dark mb-1 mr-2">{{ action.name }}</button>
        </span>
    </div>
    <!--Overseer-->
    <div>
        <div class="title is-5 mb-1 segment-title">Overseer</div>
        <div v-if="mines.getOverseer">
            <div>{{ mines.getOverseer.getName() }} - Production is currently at {{ Math.floor(mines.getOverseerModifier() * 100) }}%!</div>
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
                        <option v-for="i in mines.getUnlockResources" :value="i.id">{{ i.name }}</option>
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
            <div v-for="i in mines.getWorkerArray">
                <div>{{ cultists.getCultistById(i.id).getName() }} - Lvl {{ cultists.getCultistById(i.id).getLevel() }} - {{ i.resource == "scavenge" ? "Scavenging" : `Mining ${i. resource}` }}</div>
                <button class="button is-small is-info">Switch resource</button>
                <button class="button is-small is-danger" :value="i.id" @click="removeWorkerClick">Remove</button></div>
        </div>
    </div>

</div>
</template>
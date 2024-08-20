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
    mines.addWorker(obj);

    workerToAssign.worker = null;
    resourceToAssign.resource = null;
}

function setOverseer(e) {
    addCultistToOverseerJob(e.target.value, mines)
    workerToAssign.worker = null;
}

function addWorker(e) {
    addCultistToWorkerJob(e.target.value, mines)
}

function removeOverseerClick() {
    removeCultistFromOverseerJob(mines)
}

function removeWorkerClick(e) {
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
    <!--Resources-->
    <!--Overseer-->
    <div>
        <div class="title is-5 mb-1 segment-title">Overseer</div>
        <div v-if="mines.getOverseer">
            <div>{{ mines.getOverseer.getName() }} - Multiplying all production by {{ mines.getOverseerModifier() }}</div>
            <button type="button" class="button is-danger" @click="removeOverseerClick">Remove Overseer</button>
        </div>
        <div v-else>
            Without an Overseer, production is halved!
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
        <div>
            <div v-for="i in mines.getCultistArray()">
                <div>{{ i.cultist.getName() }} - Lvl {{ i.cultist.getLevel() }} - Mining {{i.resource.name}}</div>
                <button class="button is-small is-info">Switch resource</button>
                <button class="button is-small is-danger" :value="i.cultist.getId()" @click="removeWorkerClick">Remove</button></div>
        </div>
    </div>

</div>
</template>
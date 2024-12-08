<script setup>
import { reactive } from 'vue';

import ActionList from '../ActionList.vue';

import { addCultistToJob, removeCultistFromJob } from '@/functions';

import { useMinesStore } from '@/stores/mines';
import { useCultistsStore } from '@/stores/globalPinias/cultists';

const mines = useMinesStore();
const cultists = useCultistsStore();

var workerAssigning = reactive({worker: null, resource: null, overseer: null});
var switchingResource = reactive({worker: null, resource: null});

function assignWorker() {
    const obj = {
        cultistId: workerAssigning.worker,
        resource: workerAssigning.resource
    }
    addCultistToJob(mines, "mineWorker", null, obj);

    workerAssigning.worker = null;
    workerAssigning.resource = null;
}

function assignOverseer() {
    addCultistToJob(mines, "mineOverseer", workerAssigning.overseer);
    workerAssigning.overseer = null;
}

function removeOverseer(e) {
    removeCultistFromJob(mines, "mineOverseer", e.target.value);
}

function removeWorkerClick(e) {
    removeCultistFromJob(mines, "mineWorker", e.target.value);
}

function switchResourceClick(worker, resource) {
    switchingResource.worker = worker;
    switchingResource.resource = resource;
}

function switchResourceConfirm() {
    mines.switchResource(switchingResource.worker, switchingResource.resource);

    switchingResource.worker = null;
    switchingResource.resource = null;
}
</script>




<template>

<div>
    <!--Actions-->
    <div>
        <ActionList :piniaObject="mines"/>
    </div>
    <!--Overseer-->
    <div>
        <div class="title is-5 mb-1 segment-title">Overseers - {{ mines.getJobArray("mineOverseer").length }} / {{ mines.getJobLimit("mineOverseer") }}</div>
        <b-field label="Assign Overseer">
            <b-select placeholder="Assign Overseer" v-model="workerAssigning.overseer" :disabled="!cultists.checkUnemployed">
                <option v-for="j in cultists.getUnemployed" :value="j.getId()">{{ j.getName() }}</option>
            </b-select>
        </b-field>
        <button v-if="workerAssigning.overseer != null" class="button is-dark" @click="assignOverseer">Assign</button>
        <div v-if="mines.getJobArray('mineOverseer').length < 1">
            Without an Overseer, production is only 50%!
        </div>
        <div>
            <div v-for="i in mines.getJobArray('mineOverseer')">
                <div class="inline-blockContainer">
                    <div>
                        {{ cultists.getCultistById(i).getName() }} - Lvl {{ cultists.getCultistById(i).getLevel() }}
                    </div>
                    <button class="button is-small is-danger" :value="cultists.getCultistById(i).getId()" @click="removeOverseer">Remove</button>
                </div>
            </div>
        </div>
    </div>
    <!--Workers-->
    <div>
        <div class="title is-5 mb-1 segment-title">Workers - {{ mines.getNumOfWorkers }} / {{ mines.getJobLimit("mineWorker") }}</div>
        <!--The display for adding a worker-->
        <div class="inline-blockContainer">
            <div>
                <b-field label="Worker">
                    <b-select placeholder="Worker" v-model="workerAssigning.worker" :disabled="!cultists.checkUnemployed || !mines.checkIfJobHasSpace('mineWorker')">
                        <option v-for="i in cultists.getUnemployed" :value="i.getId()">{{ i.getName() }}</option>
                    </b-select>
                </b-field>
            </div>
            <div v-if="workerAssigning.worker != null">
                <b-field label="Resource">
                    <b-select placeholder="Resource" v-model="workerAssigning.resource">
                        <option v-for="i in mines.getUnlockedResources" :value="i.id">{{ i.name }}</option>
                    </b-select>
                </b-field>
            </div>
            <div v-if="workerAssigning.resource">
                <button class="button is-dark mb-1 mr-2" @click="assignWorker">Assign!</button>
            </div>
        </div>
        <br>
        <!--Displaying workers already working-->
        <div>
            <div v-for="i in mines.getJobArray('mineWorker')">
                <div>{{ cultists.getCultistById(i.cultistId).getName() }} - Lvl {{ cultists.getCultistById(i.cultistId).getLevel() }} - {{ i.resource == "scavenge" ? "Scavenging" : `Mining ${mines.getResourceName(i.resource)}` }}</div>
                <div v-if="switchingResource.worker == i.cultistId">
                    <div class=inline-blockContainer>
                        <b-field>
                            <b-select class="select is-small" placeholder="Resource" v-model="switchingResource.resource">
                                <option v-for="i in mines.getUnlockedResources" :value="i.id">{{ i.name }}</option>
                            </b-select>
                        </b-field>
                        <button class="button is-dark is-small" @click="switchResourceConfirm">Assign!</button>
                    </div>
                </div>
                <div v-else>
                    <button class="button is-small is-info" @click="switchResourceClick(i.cultistId, i.resource)">Switch resource</button>
                    <button class="button is-small is-danger" :value="i.cultistId" @click="removeWorkerClick">Remove</button></div>
                </div>
        </div>
    </div>

</div>
</template>
<script setup>
import { reactive } from 'vue';

import ActionList from '../ActionList.vue';

import { addCultistToJob, removeCultistFromJob } from '@/functions';

import { useMinesStore } from '@/stores/mines';
import { useCultistsStore } from '@/stores/globalPinias/cultists';

const mines = useMinesStore();
const cultists = useCultistsStore();

var workerAssigning = reactive({worker: null, resource: null});
var switchingResource = reactive({worker: null, resource: null});

function assignWorker() {
    const obj = {
        cultistId: workerAssigning.worker,
        resource: workerAssigning.resource
    }
    console.log(obj);
    addCultistToJob(mines, "mineWorker", null, obj);

    workerAssigning.worker = null;
    workerAssigning.resource = null;
}

function setOverseer(e) {
    addCultistToJob(mines, "mineOverseer", e.target.value);
}

function removeOverseerClick() {
    removeCultistFromJob(mines, "mineOverseer");
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
        <div class="title is-5 mb-1 segment-title">Overseer</div>
        <div v-if="mines.getOverseer">
            <div>{{ mines.getOverseer.getName() }} - Currently boosting production by {{ Math.floor((mines.getOverseerModifier() - 1) * 100) }}%!</div>
            <button type="button" class="button is-danger" @click="removeOverseerClick">Remove Overseer</button>
        </div>
        <div v-else>
            Without an Overseer, production is only 50%!
            <b-field label="Assign Overseer">
                <b-select placeholder="Assign Overseer" value="" @input="setOverseer" :disabled="!cultists.checkUnemployed">
                    <option v-for="j in cultists.getUnemployed" :value="j.getId()">{{ j.getName() }}</option>
                </b-select>
            </b-field>
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
            <div v-for="i in mines.getWorkerArray">
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
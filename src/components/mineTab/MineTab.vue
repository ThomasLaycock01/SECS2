<script setup>
import { addCultistToOverseerJob, addCultistToWorkerJob, removeCultistFromOverseerJob, removeCultistFromWorkerJob } from '@/functions';

import { useMinesStore } from '@/stores/mines';
import { useCultistsStore } from '@/stores/cultists';

const mines = useMinesStore();
const cultists = useCultistsStore();

var workerToAssign = null;
var resourceToAssign = null;

function setWorker(e) {
    workerToAssign = e.target.value;
}

function setResource(e) {
    resourceToAssign = e.target.value;
}

function assignWorker() {
    const obj = {
        id: workerToAssign,
        resource: resourceToAssign
    }
    console.log(obj);
    mines.addWorker(obj);
}

function setOverseer(e) {
    addCultistToOverseerJob(e.target.value, mines)
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
    <!--Resources
    <div v-for="object in mines.getResources">
        {{ object.id }} - {{ mines.getResourceProduction(object.id) }} per Cultist per second
    </div>
    <!--Overseer-->
    <div>
        <div class="title is-5 mb-1 segment-title">Overseer</div>
        <div v-if="mines.getOverseer">
            <div>{{ cultists.getCultistById(mines.getOverseer).getName() }} - Multiplying all production by {{ cultists.getCultistById(mines.getOverseer).getLevel() * 0.5 > 1 ? 1 : cultists.getCultistById(mines.getOverseer).getLevel() * 0.5 }}</div>
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
                    <b-select placeholder="Worker" value="" @input="setWorker" :disabled="!cultists.checkUnemployed()">
                        <option v-for="i in cultists.getUnemployed" :value="i.getId()">{{ i.getName() }}</option>
                    </b-select>
                </b-field>
            </div>
            <div>
                <b-field label="Resource">
                    <b-select placeholder="Resource" value="" @input="setResource">
                        <option v-for="i in mines.getUnlockResources" :value="i.id">{{ i.name }}</option>
                    </b-select>
                </b-field>
            </div>
            <div>
                <button class="button is-dark mb-1 mr-2" @click="assignWorker">Assign!</button>
            </div>
        </div>
        <br>
        <div>
            <div v-for="i in mines.getCultistArray()">
                <div>{{ i.cultist.getName() }} - Lvl {{ i.cultist.getLevel() }} - Mining {{i.resource.name}}</div>
                <button class="button is-small is-info">Switch metal</button>
                 <button class="button is-small is-danger" :value="i.cultist.getId()" @click="removeWorkerClick">Remove</button></div>
        </div>
    </div>

</div>
</template>
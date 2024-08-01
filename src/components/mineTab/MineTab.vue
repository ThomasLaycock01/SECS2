<script setup>
import ActionList from '../ActionList.vue';

import { mineActions } from '@/actions';
import { addCultistToOverseerJob, addCultistToWorkerJob, removeCultistFromOverseerJob, removeCultistFromWorkerJob } from '@/functions';

import { useMinesStore } from '@/stores/mines';
import { useCultistsStore } from '@/stores/cultists';

const mines = useMinesStore();
const cultists = useCultistsStore();

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
<!--
<ActionList :actions="mineActions"/>

<br>
-->
<div>
    <div class="title is-4 mb-1 segment-title">Mineshaft</div>
    <div>
        Depth: {{ mines.getDepth / 100 }}m / {{mines.getMaxDepth / 100}}m
    </div>
    <!--Resources-->
    <div v-for="object in mines.getResources">
        {{ object.id }} - {{ mines.getResourceProduction(object.id) }} per Cultist per second
    </div>
    <!--Overseer-->
    <div>
        <div class="title is-5 mb-1 segment-title">Overseer</div>
        <div v-if="mines.getOverseer">
            <div>{{ cultists.getCultistById(mines.getOverseer).getName() }} - Increasing Max depth by {{ cultists.getCultistById(mines.getOverseer).getLevel() * 5 }}, and multiplying all production by {{ cultists.getCultistById(mines.getOverseer).getLevel() * 0.5 > 1 ? 1 : cultists.getCultistById(mines.getOverseer).getLevel() * 0.5 }}</div>
            <button type="button" class="button is-danger" @click="removeOverseerClick">Remove Overseer</button>
        </div>
        <div v-else>
            The Workers cannot produce anything without an overseer!
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
        <div>
            <div v-for="i in mines.getCultistArray()">{{ i.getName() }} - Lvl {{ i.getLevel() }} <button class="button is-small is-danger" :value="i.getId()" @click="removeWorkerClick">X</button></div>
        </div>
        <div>
            <b-field label="Assign Worker">
                <b-select placeholder="Assign Worker" value="" @input="addWorker" :disabled="!cultists.checkUnemployed()">
                    <option v-for="j in cultists.getUnemployed" :value="j.getId()">{{ j.getName() }}</option>
                </b-select>
            </b-field>
        </div>
    </div>

</div>
</template>
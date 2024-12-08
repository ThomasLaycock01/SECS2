<script setup>
import { reactive } from 'vue';

import { useSmelterStore } from '@/stores/mines/smelter';
import { useCultistsStore } from '@/stores/globalPinias/cultists';
import { useResourcesStore } from '@/stores/globalPinias/resources';

import { addCultistToJob, removeCultistFromJob } from '@/functions';

const smelter = useSmelterStore();
const cultists = useCultistsStore();

var smeltingTab = reactive({smelterToAssign: null, bar: null, amount: null});

function addToSmeltingQueue() {
    smelter.addToSmeltingQueue(smeltingTab.bar, smeltingTab.amount);

    smeltingTab.bar = null;
    smeltingTab.amount = null;
}

function assignSmelter() {
    addCultistToJob(smelter, "smelter", smeltingTab.smelterToAssign);

    smeltingTab.smelterToAssign = null;
}

function removeSmelter(e) {
    removeCultistFromJob(smelter, "smelter", e.target.value);
}
</script>


<template>
    <div>
        <div class="title is-5 mb-1 segment-title">Smelting - {{ smelter.getSmelterArray.length }} / {{ smelter.getJobLimit("smelter") }}</div>
        <div v-if="smelter.getSmelterArray">
            <div v-for="i in smelter.getSmelterArray">
                <div class="inline-blockContainer">
                    <div>{{ cultists.getCultistById(i).getName() }}</div>
                    <button class="button is-small is-danger" :value="i" @click="removeSmelter">Remove</button>
                </div>
            </div>
        </div>
        <div>
            You need a cultist assigned to smelting to refine metal into bars!
            <b-field label="Assign Smelter">
                <b-select placeholder="Cultist" :disabled="!cultists.checkUnemployed || !smelter.checkIfJobHasSpace('smelter')" v-model="smeltingTab.smelterToAssign">
                    <option v-for="i in cultists.getUnemployed" :value="i.getId()">{{ i.getName() }}</option>
                </b-select>
            </b-field>
            <button v-if="smeltingTab.smelterToAssign != null" class="button is-dark" @click="assignSmelter">Assign</button>
        </div>
        <!--The display for adding a to smelting queue-->
        <div class="inline-blockContainer">
            <div>
                <b-field label="Add To Queue">
                    <b-select placeholder="Metal" v-model="smeltingTab.bar">
                        <option v-for="i in smelter.getUnlockedResources" :value="i.id">{{ i.name }}</option>
                    </b-select>
                </b-field>
            </div>
            <div v-if="smeltingTab.bar != null">
                <b-field>
                    <b-input placeholder="Amount" type="number" min="0" v-model="smeltingTab.amount"/>
                </b-field>
            </div>
        </div>
        <div v-if="smeltingTab.amount != 0 && smeltingTab.amount">
            Ordering {{ smeltingTab.Amount }} {{ smelter.getResourceName(smeltingTab.bar) }}(s) would cost:
            <div v-for="value, key in smelter.getResourceCosts(smeltingTab.bar)">
                {{ value * smeltingTab.amount }} {{ key }}
            </div>
            <br>
            <div>
                <button class="button is-dark mb-1 mr-2" @click="addToSmeltingQueue" :disabled="!smelter.CheckIfCanAffordOrder(smeltingTab.bar, smeltingTab.amount)">Assign!</button>
            </div>
        </div>
        <div v-if="smelter.getQueue.length > 0">
            <div>Currently Smelting: {{ smelter.getNameOfCurrentBar }}</div>
            <div>Current Progress: {{ smelter.getCurrentSmeltingPercentage }}%</div>
            Queue:
            <div v-for="i in smelter.getQueue">
                {{ smelter.getResourceName(i.barType) }}: {{ i.amount }}
            </div>
        </div>
    </div>

</template>
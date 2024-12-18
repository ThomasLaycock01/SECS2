<script setup>
import { reactive } from 'vue';

import ActionList from '../ActionList.vue';

import { addCultistToJob, removeCultistFromJob } from '@/functions';

import { useWarformerStore } from '@/stores/warformer';
import { useCultistsStore } from '@/stores/globalPinias/cultists';
import { useResourcesStore } from '@/stores/globalPinias/resources';
import { useInventoryStore } from '@/stores/globalPinias/inventory';

const warformer = useWarformerStore();
const cultists = useCultistsStore();
const resources = useResourcesStore();
const inventory = useInventoryStore();

var warformerTab = reactive({warformerToAssign: null, warformToSummon: null, items: []});




function assignWarformer() {
    addCultistToJob(warformer, "warformer", warformerTab.warformerToAssign);

    warformerTab.warformerToAssign = null;
}

function removeWarformer(e) {
    removeCultistFromJob(warformer, "warformer", e.target.value);
}

function itemButtonClick(e) {
    if (warformerTab.items.includes(e.target.value)) {
        warformerTab.items = warformerTab.items.filter(val => val != e.target.value);
    }
    else {
        warformerTab.items.push(e.target.value);
    }
    inventory.getItemById(e.target.value).toggleSellAvailable();
}

function getItemTierValue() {
    var totalTiers = 0;

    for (var i in warformerTab.items) {
        const item = inventory.getItemById(warformerTab.items[i]);
        totalTiers += item.getTier();
    }

    return totalTiers;
}

function warformCostCheck() {
    const costs = cultists.getRaceCosts(warformerTab.warformToSummon);

    if (getItemTierValue() >= costs.itemTiers) {
        return true;
    }
    return false;
}

function createWarformClick() {
    for (var i in warformerTab.items) {
        inventory.removeItem(warformerTab.items[i]);
    }

    warformer.summonWarform(warformerTab.warformToSummon);
    warformerTab.warformToSummon = null;
    warformerTab.items = [];
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
            <div>Creating that type of Warform will cost {{ cultists.getRaceCosts(warformerTab.warformToSummon).itemTiers }} item tiers</div>
            <!--
            <ul>
                <li v-for="value, key in cultists.getRaceCosts(warformerTab.warformToSummon)">{{ key }} : {{ value }}</li>
            </ul>-->

            <br>
            <!--Inventory interface for selecting items-->
            <div>Select items:</div>
            <div class="container" v-if="inventory.getUnequippedItems.length > 0">
                <span v-for="i in inventory.getUnequippedItems">
                <div>
                    <button :class="warformerTab.items.includes(i.getId().toString()) ? 'button is-info' : 'button is-dark'" @click="itemButtonClick" :value="i.getId()">{{ i.getShortName() ? i.getShortName() : i.getName() }}</button>
                </div>
                </span>
            </div>
            <div v-else>No available items - create more or unequip existing ones!</div>
            <br>
            <div v-if="getItemTierValue() > cultists.getRaceCosts(warformerTab.warformToSummon).itemTiers" class="has-text-danger">
                <div>
                    You are spending more tiers than necessary!
                </div>
                <br>
            </div>
            <button class="button is-dark" @click="createWarformClick" :disabled="!warformCostCheck()">Create!</button>
        </div>
        <div v-if="warformer.getQueue.length">
            <div>Currently Summoning: {{ warformer.getCurrentSummoning.warformType }}</div>
            <div>Current Progress: {{ warformer.getCurrentSummoningPercentage }}%</div>
            <div>
                Queue:
            </div>
            <div v-for="i in warformer.getQueue">
                {{i.warformType}}
            </div>
        </div>
    </div>
</template>
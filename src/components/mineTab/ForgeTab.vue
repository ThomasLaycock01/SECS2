<script setup>
import { reactive } from 'vue';

import ActionList from '../ActionList.vue';

import { addCultistToJob, removeCultistFromJob } from '@/functions';

import { useForgeStore } from '@/stores/forge';
import { useCultistsStore } from '@/stores/globalPinias/cultists';
import { useResourcesStore } from '@/stores/globalPinias/resources';

const forge = useForgeStore();
const cultists = useCultistsStore();
const resources = useResourcesStore();


var smeltingTab = reactive({smelterToAssign: null, bar: null, amount: null});
var smithingTab = reactive({smithToAssign: null, metal: null, selecteditem: null});



function addToSmeltingQueue() {
    forge.addToSmeltingQueue(smeltingTab.bar, smeltingTab.amount);

    smeltingTab.bar = null;
    smeltingTab.amount = null;
}

function assignSmelter() {
    addCultistToJob(forge, "smelter", smeltingTab.smelterToAssign);

    smeltingTab.smelterToAssign = null;
}

function removeSmelter(e) {
    removeCultistFromJob(forge, "smelter", e.target.value);
}

function assignSmith() {
    addCultistToJob(forge, "smith", smithingTab.smithToAssign);

    smithingTab.smithToAssign = null;
}

function removeSmith(e) {
    removeCultistFromJob(forge, "smith", e.target.value);
}

function setSelectedItem(item) {
    smithingTab.selectedItem = item;
}

function craftItem() {
    forge.addToSmithingQueue(smithingTab.selectedItem);
}
</script>




<template>
    <!--Actions-->
    <div>
        <ActionList :piniaObject="forge"/>
    </div>
    <div>
                <div class="title is-5 mb-1 segment-title">Smithing - {{ forge.getSmithArray.length }} / {{ forge.getJobLimit("smith") }}</div>
                <div v-if="forge.getSmithArray">
                    <div v-for="i in forge.getSmithArray">
                        <div class=inline-blockContainer>
                            <div>{{ cultists.getCultistById(i).getName() }}</div>
                            <button class="button is-small is-danger" :value="i" @click="removeSmith">Remove</button>
                        </div>
                    </div>
                </div>
                <div>
                    <b-field label="Assign Smith">
                        <b-select placeholder="Cultist" :disabled="!cultists.checkUnemployed() || !forge.checkIfJobHasSpace('smith')" v-model="smithingTab.smithToAssign">
                            <option v-for="i in cultists.getUnemployed" :value="i.getId()">{{ i.getName() }}</option>
                        </b-select>
                    </b-field>
                    <button v-if="smithingTab.smithToAssign != null" class="button is-dark" @click="assignSmith">Assign</button>
                </div>
                <div v-if="forge.getQueue('smith').length > 0">
                    <div>Currently Smithing: {{ forge.getCurrentSmithingItem.name }}</div>
                    <div>Current Progress: {{forge.getCurrentSmithingPercentage}}%</div>
                    <div>Queue:</div>
                    <div v-for="i in forge.getQueue('smith')">{{ i.name }}</div>
                </div>
                <div class="title is-5 mb-1 segment-title">Crafting</div>
                <b-field label="Select Metal">
                    <b-select placeholder="Metal" value=""  v-model="smithingTab.metal">
                        <option v-for="i in resources.getUnlockedResourcesByProeprty('canSmith')" :value="i.id">{{ i.name }}</option>
                    </b-select>
                </b-field>
                <div class="columns">
                    <div class="column is-half">
                        <div v-if="smithingTab.metal" class="cultistContainer">
                            <span v-for="i in forge.getItemsByMetal(smithingTab.metal)">
                                <button  class="button is-dark is-info" @click="setSelectedItem(i)">{{i.shortName}}</button>
                            </span>
                        </div>
                        <div v-else>
                            Select a metal!
                        </div>
                    </div>
                    <div class="column is-half">
                        <div v-if=smithingTab.selectedItem>
                            <div>{{smithingTab.selectedItem.name}}</div>
                            <div>{{smithingTab.selectedItem.type}}</div>
                            <div>Tier {{ smithingTab.selectedItem.tier }}</div>
                            <div>{{ smithingTab.selectedItem.effectDesc }}</div>
                            <div>
                                <ul>
                                    <li v-for="value, key in smithingTab.selectedItem.craftCosts">{{ resources.getName(key) }}: {{ value }}</li>
                                </ul>
                            </div>
                            <button class="button is-dark mb-1 mr-2" :disabled="!forge.checkIfCanAffordItem(smithingTab.selectedItem) || forge.getQueue('smith').length >= 10" @click="craftItem()">Craft!</button>
                        </div>
                        <div v-else>
                            Select an Item!
                        </div>
                    </div>
                </div>
            </div>
        <!--
        <b-tab-item label="Smelting">
            <!--Smelting
            <div>
                <div class="title is-5 mb-1 segment-title">Smelting - {{ forge.getSmelterArray.length }} / {{ forge.getJobLimit("smelter") }}</div>
                <div v-if="forge.getSmelterArray">
                    <div v-for="i in forge.getSmelterArray">
                        <div class="inline-blockContainer">
                            <div>{{ cultists.getCultistById(i).getName() }}</div>
                            <button class="button is-small is-danger" :value="i" @click="removeSmelter">Remove</button>
                        </div>
                    </div>
                </div>
                <div>
                    You need a cultist assigned to smelting to refine metal into bars!
                    <b-field label="Assign Smelter">
                        <b-select placeholder="Cultist" :disabled="!cultists.checkUnemployed() || !forge.checkIfJobHasSpace('smelter')" v-model="smeltingTab.smelterToAssign">
                            <option v-for="i in cultists.getUnemployed" :value="i.getId()">{{ i.getName() }}</option>
                        </b-select>
                    </b-field>
                    <button v-if="smeltingTab.smelterToAssign != null" class="button is-dark" @click="assignSmelter">Assign</button>
                </div>
                <!--The display for adding a to smelting queue
                <div class="inline-blockContainer">
                    <div>
                        <b-field label="Add To Queue">
                            <b-select placeholder="Metal" v-model="smeltingTab.bar">
                                <option v-for="i in forge.getUnlockedResources" :value="i.id">{{ i.name }}</option>
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
                    Ordering {{ smeltingTab.Amount }} {{ forge.getResourceName(smeltingTab.bar) }}(s) would cost:
                    <div v-for="value, key in forge.getResourceCosts(smeltingTab.bar)">
                        {{ value * smeltingTab.amount }} {{ key }}
                    </div>
                    <br>
                    <div>
                        <button class="button is-dark mb-1 mr-2" @click="addToSmeltingQueue" :disabled="!forge.CheckIfCanAffordOrder(smeltingTab.bar, smeltingTab.amount)">Assign!</button>
                    </div>
                </div>
                <div v-if="forge.getQueue('smelter').length > 0">
                    <div>Currently Smelting: {{ forge.getNameOfCurrentBar }}</div>
                    <div>Current Progress: {{ forge.getCurrentSmeltingPercentage }}%</div>
                    Queue:
                    <div v-for="i in forge.getQueue('smelter')">
                        {{ forge.getResourceName(i.barType) }}: {{ i.amount }}
                    </div>
                </div>
            </div>
        </b-tab-item>
    -->

</template>
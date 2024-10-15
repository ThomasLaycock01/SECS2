<script setup>
import { reactive } from 'vue';

import ActionList from '../ActionList.vue';

import { addCultistToOtherJob, removeCultistFromOtherJob } from '@/functions';

import { useForgeStore } from '@/stores/forge';
import { useCultistsStore } from '@/stores/globalPinias/cultists';

const forge = useForgeStore();
const cultists = useCultistsStore();


var barToAdd = reactive({bar: null, amount: null});
var smithingTab = reactive({metal: null, selecteditem: null});



function setBar(e) {
    barToAdd.bar = e.target.value;
}

function setAmount(e) {
   barToAdd.Amount = e.target.value;
}

function addToSmeltingQueue() {
    forge.addToSmeltingQueue(barToAdd.bar, barToAdd.amount);

    barToAdd.bar = null;
    barToAdd.amount = null;
}

function setSmelter(e) {
    addCultistToOtherJob(e.target.value, forge, "smelter");
}

function removeSmelter() {
    removeCultistFromOtherJob(forge, "smelter", forge.getSmelter.getId())
}

function setSmith(e) {
    addCultistToOtherJob(e.target.value, forge, "smith");
}

function removeSmith() {
    removeCultistFromOtherJob(forge, "smith", forge.getSmith.getId())
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
    <b-tabs v-model="activeForgeTab">
        <b-tab-item label="Smelting">
            <!--Smelting-->
            <div>
                <div class="title is-5 mb-1 segment-title">Smelting</div>
                <div v-if="forge.getSmelter">
                    <div>{{ forge.getSmelter.getName() }} - Currently boosting smelting speed by {{ "placeholder" }}%!</div>
                    <button type="button" class="button is-danger" @click="removeSmelter">Remove Smelter</button>
                </div>
                <div v-else>
                    You need a cultist assigned to smelting to refine metal into bars!
                    <b-field label="Assign Smelter">
                        <b-select placeholder="Cultist" value="" @input="setSmelter" :disabled="!cultists.checkUnemployed()">
                            <option v-for="i in cultists.getUnemployed" :value="i.getId()">{{ i.getName() }}</option>
                        </b-select>
                    </b-field>
                </div>
                <!--The display for adding a to smelting queue-->
                <div class="inline-blockContainer">
                    <div>
                        <b-field label="Add To Queue">
                            <b-select placeholder="Metal" @input="setBar" v-model="barToAdd.bar">
                                <option v-for="i in forge.getUnlockResources" :value="i.id">{{ i.name }}</option>
                            </b-select>
                        </b-field>
                    </div>
                    <div v-if="barToAdd.bar != null">
                        <b-field>
                            <b-input placeholder="Amount" type="number" min="0" @input="setAmount" v-model="barToAdd.amount"/>
                        </b-field>
                    </div>
                </div>
                <div v-if="barToAdd.amount != 0 && barToAdd.amount">
                    Ordering {{ barToAdd.Amount }} {{ forge.getResourceName(barToAdd.bar) }}(s) would cost:
                    <div v-for="value, key in forge.getResourceCosts(barToAdd.bar)">
                        {{ value * barToAdd.amount }} {{ key }}
                    </div>
                    <br>
                    <div>
                        <button class="button is-dark mb-1 mr-2" @click="addToSmeltingQueue" :disabled="!forge.CheckIfCanAffordOrder(barToAdd.bar, barToAdd.amount)">Assign!</button>
                    </div>
                </div>
                <div v-if="forge.getQueue('smelter').length > 0">
                    Current Smelting Queue:
                    <div v-for="i in forge.getQueue('smelter')">
                        {{ forge.getResourceName(i.barType) }}: {{ i.amount }}
                    </div>
                </div>
            </div>
        </b-tab-item>
        <b-tab-item label="Smithing">
            <!--Smithing-->
            <div>
                <div class="title is-5 mb-1 segment-title">Smithing</div>
                <div v-if="forge.getSmith">
                    <div>{{ forge.getSmith.getName() }} - Currently boosting smithing speed by {{ "placeholder" }}%!</div>
                    <button type="button" class="button is-danger" @click="removeSmith">Remove Smelter</button>
                </div>
                <div v-else>
                    You need a cultist assigned to smithing to refine bars into items!
                    <b-field label="Assign Smith">
                        <b-select placeholder="Cultist" value="" @input="setSmith" :disabled="!cultists.checkUnemployed()">
                            <option v-for="i in cultists.getUnemployed" :value="i.getId()">{{ i.getName() }}</option>
                        </b-select>
                    </b-field>
                </div>
                <div>
                    <div>Queue:</div>
                    <div v-for="i in forge.getQueue('smith')">{{ i.name }}</div>
                </div>
                <div class="title is-5 mb-1 segment-title">Crafting</div>
                <b-field label="Select Metal">
                    <b-select placeholder="Metal" value=""  v-model="smithingTab.metal">
                        <option v-for="i in forge.getUnlockResources" :value="i.id">{{ i.name }}</option>
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
                            <div>{{ smithingTab.selectedItem.tier }}</div>
                            <div>
                                <ul>
                                    <li v-for="i in smithingTab.selectedItem.modifiers">{{ i.modifier }} {{ i.job }} {{ i.type }}</li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li v-for="value, key in smithingTab.selectedItem.craftCosts">{{ forge.getResourceName(key) }}: {{ value }}</li>
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
        </b-tab-item>
    </b-tabs>

</template>

<script>

export default {
    data() {
        return {activeForgeTab: 0}
    }
}

</script>
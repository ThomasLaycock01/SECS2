<script setup>
import { reactive } from 'vue';

import ActionList from '../ActionList.vue';

import { addCultistToOtherJob, removeCultistFromOtherJob } from '@/functions';

import { useForgeStore } from '@/stores/forge';
import { useCultistsStore } from '@/stores/globalPinias/cultists';

const forge = useForgeStore();
const cultists = useCultistsStore();


var barToAdd = reactive({bar: null, amount: null});



function setBar(e) {
    barToAdd.bar = e.target.value;
}

function setAmount(e) {
   barToAdd.Amount = e.target.value;
}

function addToSmeltingQueue() {
    const obj = {
        barType: barToAdd.bar,
        amount: barToAdd.amount
    }
    forge.addToSmeltingQueue(obj);

    barToAdd.bar = null;
    barToAdd.amount = null;
}

function setSmelter(e) {
    addCultistToOtherJob(e.target.value, forge, "smelter");
}

function removeSmelter() {
    removeCultistFromOtherJob(forge, "smelter", forge.getSmelter.getId())
}
</script>




<template>
    <!--Actions-->
    <div>
        <ActionList :piniaObject="forge"/>
    </div>
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
                <b-select placeholder="Assign Smelter" value="" @input="setSmelter" :disabled="!cultists.checkUnemployed()">
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

</template>
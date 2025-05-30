<script setup>
import { reactive } from 'vue';

import CombatScreen from './CombatScreen.vue';

import { tooltip } from '@/functions';

import { useExpeditionsStore } from '@/stores/barracks/expeditions';
import { useTooltipsStore } from '@/stores/misc/tooltips';
import { useModalsStore } from '@/stores/misc/modal';

const expeditions = useExpeditionsStore();
const tooltips = useTooltipsStore();
const modals = useModalsStore();

var expeditionsTab = reactive({selectedExpedition: null});

function setSelectedExpedition(obj) {
    expeditionsTab.selectedExpedition = obj;
}

function deselectExpedition() {
    expeditionsTab.selectedExpedition = null;
}

function embarkCheck() {
    //if theres no party
    if (!expeditionsTab.selectedExpedition.getActiveParty()) {
        return false;
    }
    //if there is a party, but its busy
    if (expeditionsTab.selectedExpedition.getActiveParty().getCurrentActivity()) {
        return false;
    }
   return true;
}

function embarkClick() {
    expeditionsTab.selectedExpedition.beginExpedition();
}

function retreatClick() {
    expeditionsTab.selectedExpedition.endExpedition();
}

function mouseoverEmbark(e, expeditionObj) {
    const warnings = tooltips.checkEmbarkWarning(expeditionObj);

    const obj = {
        type: "warn",
        array: warnings
    }

    if (warnings) {
        tooltip(e, obj);
    }
}
</script>


<template>

    <div class="title is-5 mb-1 segment-title">Expeditions</div>
    <!--Area view-->
    <div v-if="expeditionsTab.selectedExpedition">
        <div class="inline-flexSpaceBetween">
            <p class="title is-4 mb-1 segment-title">{{ expeditionsTab.selectedExpedition.getName() }}</p>
            <button class="button is-small is-danger" @click="deselectExpedition()">X</button>
        </div>

        <!--If the area is active-->
        <div v-if="expeditionsTab.selectedExpedition.getActive()">
            <button class="is-dark button" @click="retreatClick()">Retreat!</button>  
            <br>
            <CombatScreen :areaObject="expeditionsTab.selectedExpedition" type="expedition"/>     
        </div>

        <!--If it isnt-->
        <div v-else>
            <p>{{ expeditionsTab.selectedExpedition.getDesc() }}</p>
            <div>
                <button class="button is-dark" @click="embarkClick()" :disabled="!embarkCheck()" @mouseenter="mouseoverEmbark($event, expeditionsTab.selectedExpedition)" @mouseleave="tooltips.hideTooltip()">Embark!</button>
                <br>
                <br>
                <button class="button is-dark"  @click="modals.openPartySelect(expeditionsTab.selectedExpedition)">Set Party</button>
                <span v-if="expeditionsTab.selectedExpedition.getActiveParty()">
                    <button class="button is-dark"  @click="modals.openParty(expeditionsTab.selectedExpedition.getActiveParty())">Edit Party</button>
                </span>
                <CombatScreen :areaObject="expeditionsTab.selectedExpedition" type="expedition"/>
            </div>
        </div>
    </div>
    <!--List pops up if no area selected-->
    <div v-else>
        <div v-for="i in expeditions.getAvailableExpeditions">
            <p>{{ i.getName() }}</p>
            <button class="button is-dark" @click="setSelectedExpedition(i)">Embark</button>
        </div>
    </div>

</template>
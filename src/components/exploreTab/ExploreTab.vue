<script setup>
import { reactive } from 'vue';

import { tooltip, mouseoverAutoHealTooltip, mouseoverHealTooltip } from '@/functions';

import { useExploreStore } from '@/stores/barracks/explore';
import { useModalsStore } from '@/stores/misc/modal';
import { useTooltipsStore } from '@/stores/misc/tooltips';
import { useProgressionStore } from '@/stores/misc/progression';
import { useResourcesStore } from '@/stores/globalPinias/resources';

import CombatScreen from './CombatScreen.vue';

const explore = useExploreStore();
const modals = useModalsStore();
const tooltips = useTooltipsStore();
const progression = useProgressionStore();
const resources = useResourcesStore();

var exploreTab = reactive({selectedArea: null});

function setSelectedArea(obj) {
    exploreTab.selectedArea = obj;
}

function deselectArea() {
    exploreTab.selectedArea = null;
}

function embarkCheck() {
    //if theres no party
    if (!exploreTab.selectedArea.getActiveParty()) {
        return false;
    }
    //if there is a party, but its busy
    if (exploreTab.selectedArea.getActiveParty().getCurrentActivity()) {
        return false;
    }
   return true;
}

function instaHealClick(partyObj) {
    resources.removeResources({grain:partyObj.getGrainHealCost()});

    partyObj.instaHealCultists();
}

function instaHealCheck(partyObj) {
    if (partyObj.getGrainHealCost() == 0) {
        return false;
    }
    if (!resources.checkIfCanAfford({grain: partyObj.getGrainHealCost()})) {
        return false;
    }

    return true;
}

function mouseoverEmbark(e) {
    if(!tooltips.checkEmbarkWarning(exploreTab.selectedArea)) {
        return;
    }

    const obj = {
        type: "warn",
        array: tooltips.checkEmbarkWarning(exploreTab.selectedArea)
    }

    tooltip(e, obj);
}

function mouseoverAutoEmbark(e) {
    const obj = {
        type: "reg",
        desc: "If enabled, this area will automatically embark when every cultist is at full health",
        effectDesc: exploreTab.selectedArea.getAutoEmbark() ? "Currently Enabled" : "Currently Disabled"
    }

    tooltip(e, obj)
}
</script>


<template>

    <div class="title is-5 mb-1 segment-title">Explore</div>
    <!--Area view-->
    <div v-if="exploreTab.selectedArea">
        <div class="inline-flexSpaceBetween">
            <p class="title is-4 mb-1 segment-title">{{ exploreTab.selectedArea.getName() }}</p>
            <button class="button is-small is-danger" @click="deselectArea()">X</button>
        </div>

        <!--If the area is active-->
        <div v-if="exploreTab.selectedArea.getActive()">
            <button class="is-dark button" @click="exploreTab.selectedArea.toggleActive(true)">Retreat!</button>
            <span v-if="progression.checkUnlocked('completedAbandonedFarmhouse')">
                <button class="button is-dark" @click="instaHealClick(exploreTab.selectedArea.getActiveParty())" @mouseover="mouseoverHealTooltip($event, exploreTab.selectedArea.getActiveParty())" @mouseleave="tooltips.hideTooltip()" :disabled="!instaHealCheck(exploreTab.selectedArea.getActiveParty())">Insta-heal</button>
            </span>
            <span v-if="progression.checkUnlocked('completedBanditHideout')">
                <button class="button" :class="exploreTab.selectedArea.getActiveParty().getAutoHeal() ? 'is-success' : 'is-danger'" @click="exploreTab.selectedArea.getActiveParty().toggleAutoHeal()" @mouseover="mouseoverAutoHealTooltip($event, exploreTab.selectedArea.getActiveParty())" @mouseleave="tooltips.hideTooltip()">Auto Insta-heal</button>
            </span>
            <CombatScreen :areaObject="exploreTab.selectedArea" type="explore"/>     
        </div>

        <!--If it isnt-->
        <div v-else>
            <p>{{ exploreTab.selectedArea.getDesc() }}</p>
            <div>
                <button class="button is-dark" @click="exploreTab.selectedArea.toggleActive(true)" :disabled="!embarkCheck()" @mouseenter="mouseoverEmbark" @mouseleave="tooltips.hideTooltip()">Embark!</button>
                <button class="button" :class="exploreTab.selectedArea.getAutoEmbark() ? 'is-success' : 'is-danger'"   @click="exploreTab.selectedArea.toggleAutoEmbark()" @mouseenter="mouseoverAutoEmbark" @mouseleave="tooltips.hideTooltip()">Auto-Embark</button>
                <br>
                <br>
                <button class="button is-dark"  @click="modals.openPartySelect(exploreTab.selectedArea)">Set Party</button>
                <span v-if="exploreTab.selectedArea.getActiveParty()">
                    <button class="button is-dark"  @click="modals.openParty(exploreTab.selectedArea.getActiveParty())">Edit Party</button>
                    <span v-if="progression.checkUnlocked('completedAbandonedFarmhouse')">
                        <button class="button is-dark" @click="instaHealClick(exploreTab.selectedArea.getActiveParty())" @mouseover="mouseoverHealTooltip($event, exploreTab.selectedArea.getActiveParty())" @mouseleave="tooltips.hideTooltip()" :disabled="!instaHealCheck(exploreTab.selectedArea.getActiveParty())">Insta-heal</button>
                    </span>
                    <span v-if="progression.checkUnlocked('completedBanditHideout')">
                        <button class="button" :class="exploreTab.selectedArea.getActiveParty().getAutoHeal() ? 'is-success' : 'is-danger'" @click="exploreTab.selectedArea.getActiveParty().toggleAutoHeal()" @mouseover="mouseoverAutoHealTooltip($event, exploreTab.selectedArea.getActiveParty())" @mouseleave="tooltips.hideTooltip()">Auto Insta-heal</button>
                    </span>
                </span>
                <CombatScreen :areaObject="exploreTab.selectedArea" type="explore"/>
            </div>
        </div>
    </div>
    <!--List pops up if no area selected-->
    <div v-else>
        <div v-for="i in explore.getAreas">
            <p>{{ i.getName() }}</p>
            <button class="button is-dark" @click="setSelectedArea(i)">Embark</button>
        </div>
    </div>

</template>
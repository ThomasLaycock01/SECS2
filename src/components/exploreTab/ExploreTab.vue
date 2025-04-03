<script setup>
import { reactive } from 'vue';

import { useExploreStore } from '@/stores/barracks/explore';
import { useModalsStore } from '@/stores/misc/modal';
import { useTooltipsStore } from '@/stores/misc/tooltips';
import { useProgressionStore } from '@/stores/misc/progression';
import { useResourcesStore } from '@/stores/globalPinias/resources';

import CombatScreen from './CombatScreen.vue';
import Tooltip from '../Tooltip.vue';

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
                <button class="button is-dark" @click="instaHealClick(exploreTab.selectedArea.getActiveParty())" @mouseover="tooltips.setActiveTooltip(`partyInstaHeal${exploreTab.selectedArea.getActiveParty().getId()}`)" @mouseleave="tooltips.removeActiveTooltip()" :disabled="!instaHealCheck(exploreTab.selectedArea.getActiveParty())">Insta-heal</button>
                <span v-if="tooltips.getActiveTooltip == `partyInstaHeal${exploreTab.selectedArea.getActiveParty().getId()}`">
                    <Tooltip class="tooltip" :tooltipObj="tooltips.getInstaHealTooltip(exploreTab.selectedArea.getActiveParty())"/>
                </span>
            </span>
            <span v-if="progression.checkUnlocked('completedBanditHideout')">
                <button class="button" :class="exploreTab.selectedArea.getActiveParty().getAutoHeal() ? 'is-success' : 'is-danger'" @click="exploreTab.selectedArea.getActiveParty().toggleAutoHeal()" @mouseover="tooltips.setActiveTooltip(`autoHeal${exploreTab.selectedArea.getActiveParty().getId()}`)" @mouseleave="tooltips.removeActiveTooltip()">Auto Insta-heal</button>
                <span v-if="tooltips.getActiveTooltip == `autoHeal${exploreTab.selectedArea.getActiveParty().getId()}`">
                    <Tooltip class="tooltip" :tooltipObj="tooltips.getAutoHealTooltip(exploreTab.selectedArea.getActiveParty())"/>
                </span>
            </span>
            <CombatScreen :areaObject="exploreTab.selectedArea" type="explore"/>     
        </div>

        <!--If it isnt-->
        <div v-else>
            <p>{{ exploreTab.selectedArea.getDesc() }}</p>
            <div>
                <button class="button is-dark" @click="exploreTab.selectedArea.toggleActive(true)" :disabled="!embarkCheck()" @mouseenter="tooltips.setActiveTooltip('exploreEmbarkWarning')" @mouseleave="tooltips.removeActiveTooltip()">Embark!</button>
                <span v-if="tooltips.getActiveTooltip == 'exploreEmbarkWarning' && tooltips.checkEmbarkWarning(exploreTab.selectedArea)">
                    <Tooltip class="tooltip" :tooltipType="'warning'" :warningObj="tooltips.checkEmbarkWarning(exploreTab.selectedArea)"/>
                </span>
                <button class="button" :class="exploreTab.selectedArea.getAutoEmbark() ? 'is-success' : 'is-danger'"   @click="exploreTab.selectedArea.toggleAutoEmbark()" @mouseenter="tooltips.setActiveTooltip('autoEmbark')" @mouseleave="tooltips.removeActiveTooltip()">Auto-Embark</button>
                <span v-if="tooltips.getActiveTooltip == 'autoEmbark'">
                    <Tooltip class="tooltip" :tooltipObj="tooltips.getAutoEmbarkTooltip(exploreTab.selectedArea.getAutoEmbark())"/>
                </span>
                <br>
                <br>
                <button class="button is-dark"  @click="modals.openPartySelect(exploreTab.selectedArea)">Set Party</button>
                <span v-if="exploreTab.selectedArea.getActiveParty()">
                    <button class="button is-dark"  @click="modals.openParty(exploreTab.selectedArea.getActiveParty())">Edit Party</button>
                    <span v-if="progression.checkUnlocked('completedAbandonedFarmhouse')">
                        <button class="button is-dark" @click="instaHealClick(exploreTab.selectedArea.getActiveParty())" @mouseover="tooltips.setActiveTooltip(`partyInstaHeal${exploreTab.selectedArea.getActiveParty().getId()}`)" @mouseleave="tooltips.removeActiveTooltip()" :disabled="!instaHealCheck(exploreTab.selectedArea.getActiveParty())">Insta-heal</button>
                        <span v-if="tooltips.getActiveTooltip == `partyInstaHeal${exploreTab.selectedArea.getActiveParty().getId()}`">
                            <Tooltip class="tooltip" :tooltipObj="tooltips.getInstaHealTooltip(exploreTab.selectedArea.getActiveParty())"/>
                        </span>
                    </span>
                    <span v-if="progression.checkUnlocked('completedBanditHideout')">
                        <button class="button" :class="exploreTab.selectedArea.getActiveParty().getAutoHeal() ? 'is-success' : 'is-danger'" @click="exploreTab.selectedArea.getActiveParty().toggleAutoHeal()" @mouseover="tooltips.setActiveTooltip(`autoHeal${exploreTab.selectedArea.getActiveParty().getId()}`)" @mouseleave="tooltips.removeActiveTooltip()">Auto Insta-heal</button>
                        <span v-if="tooltips.getActiveTooltip == `autoHeal${exploreTab.selectedArea.getActiveParty().getId()}`">
                            <Tooltip class="tooltip" :tooltipObj="tooltips.getAutoHealTooltip(exploreTab.selectedArea.getActiveParty())"/>
                        </span>
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
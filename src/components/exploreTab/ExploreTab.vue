<script setup>
import { reactive } from 'vue';

import { useExploreStore } from '@/stores/barracks/explore';
import { useModalsStore } from '@/stores/misc/modal';
import { useTooltipsStore } from '@/stores/misc/tooltips';

import CombatScreen from './CombatScreen.vue';
import Tooltip from '../Tooltip.vue';

const explore = useExploreStore();
const modals = useModalsStore();
const tooltips = useTooltipsStore();

var exploreTab = reactive({selectedArea: null});

function setSelectedArea(obj) {
    exploreTab.selectedArea = obj;
}

function deselectArea() {
    exploreTab.selectedArea = null;
}

function toggleActive() {
    exploreTab.selectedArea.toggleActive();
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
            <button class="is-dark button" @click="toggleActive()">Retreat!</button>  
            <br>
            <CombatScreen :areaObject="exploreTab.selectedArea" type="explore"/>     
        </div>

        <!--If it isnt-->
        <div v-else>
            <p>{{ exploreTab.selectedArea.getDesc() }}</p>
            <div>
                <button class="button is-dark" @click="toggleActive()" :disabled="!embarkCheck()" @mouseenter="tooltips.setActiveTooltip('embarkWarning')" @mouseleave="tooltips.removeActiveTooltip()">Embark!</button>
                <span v-if="tooltips.getActiveTooltip == 'embarkWarning' && tooltips.checkEmbarkWarning(exploreTab.selectedArea)">
                    <Tooltip class="tooltip" :tooltipType="'warning'" :warningObj="tooltips.checkEmbarkWarning(exploreTab.selectedArea)"/>
                </span>
                <br>
                <br>
                <button class="button is-dark"  @click="modals.openPartySelect(exploreTab.selectedArea)">Set Party</button>
                <span v-if="exploreTab.selectedArea.getActiveParty()">
                    <button class="button is-dark"  @click="modals.openParty(exploreTab.selectedArea.getActiveParty())">Edit Party</button>
                    <button class="button" :class="exploreTab.selectedArea.getActiveParty().getIsHealing() ? 'is-danger' : 'is-info'" :disabled="exploreTab.selectedArea.getActiveParty().getCurrentActivity() && exploreTab.selectedArea.getActiveParty().getCurrentActivity() != 'Healing'" @click=exploreTab.selectedArea.getActiveParty().toggleIsHealing()>{{exploreTab.selectedArea.getActiveParty().getIsHealing() ? 'Stop' : 'Heal'}}</button>
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
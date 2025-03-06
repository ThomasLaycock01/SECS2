<script setup>
import { reactive } from 'vue';

import { useExploreStore } from '@/stores/barracks/explore';
import { usePartiesStore } from '@/stores/barracks/parties';
import { useTooltipsStore } from '@/stores/misc/tooltips';

import CombatScreen from './CombatScreen.vue';
import Tooltip from '../Tooltip.vue';

const explore = useExploreStore();
const parties = usePartiesStore();
const tooltips = useTooltipsStore();

var exploreTab = reactive({selectedArea: null, settingParty: false});

function setSelectedArea(obj) {
    exploreTab.selectedArea = obj;
}

function deselectArea() {
    exploreTab.selectedArea = null;
}

function startSettingParty() {
    exploreTab.settingParty = true;
}

function stopSettingParty() {
    exploreTab.settingParty = false;
}

function setSelectedParty(party) {
    //if the party is already assigned, remove it
    if (exploreTab.selectedArea.getActiveParty() && exploreTab.selectedArea.getActiveParty().getId() == party.getId()) {
        exploreTab.selectedArea.removeActiveParty();
    }
    else {
        exploreTab.selectedArea.setActiveParty(party);
    }
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
        <p>{{ exploreTab.selectedArea.getName() }}</p>

        <!--If the area is active-->
        <div v-if="exploreTab.selectedArea.getActive()">
            <CombatScreen :areaObject="exploreTab.selectedArea" type="explore"/>
            <br>
            <button class="is-dark button" @click="toggleActive()">Retreat!</button>       
        </div>

        <!--If it isnt-->
        <div v-else>
            <p>{{ exploreTab.selectedArea.getDesc() }}</p>
            <br>
            <div>Party: </div>
            <div v-if="exploreTab.settingParty">
                <div v-if="Object.keys(parties.getParties).length > 0">
                    <div v-for="i in parties.getParties">
                        <button class="button is-dark" :class="exploreTab.selectedArea.getActiveParty() && exploreTab.selectedArea.getActiveParty().getId() == i.getId() ? 'is-info' : ''" @click="setSelectedParty(i)">{{ i.getName() }}</button>
                    </div>
                </div>
                <div v-else>
                    No parties available!
                </div>
                <button class="button is-dark" @click="stopSettingParty()">Back</button>
            </div>
            <div v-else>
                <div>{{ exploreTab.selectedArea.getActiveParty() ? exploreTab.selectedArea.getActiveParty().getName() : "No party assigned!" }}</div>
                <button class="button is-dark"  @click="startSettingParty()">Set Party</button>
                <div v-if="exploreTab.selectedArea.getActiveParty()">
                    Party:
                    <br>
                    <span v-for="i in exploreTab.selectedArea.getActiveParty().getSlots()">
                        <div v-if="i.cultist">
                            {{ i.cultist.getName() }} - {{ i.cultist.getRole() ? i.cultist.getRole().getName() : "" }} - <span v-if="!i.cultist.getKnockedOut()">{{ i.cultist.getCurrentHP() }}/{{ i.cultist.getStat("HP") }}</span><span v-else>Knocked Out! {{ Math.floor(i.cultist.getKnockOutTime() / 60) }} Mins {{ i.cultist.getKnockOutTime() % 60 }} secs left</span>
                        </div>
                    </span>
                </div>
                <br>
                <br>
                <button class="button is-dark" @click="toggleActive()" :disabled="!embarkCheck()" @mouseenter="tooltips.setActiveTooltip('embarkWarning')" @mouseleave="tooltips.removeActiveTooltip()">Embark!</button>
                <span v-if="tooltips.getActiveTooltip == 'embarkWarning' && tooltips.checkEmbarkWarning(exploreTab.selectedArea)">
                    <Tooltip class="tooltip" :tooltipType="'warning'" :warningObj="tooltips.checkEmbarkWarning(exploreTab.selectedArea)"/>
                </span>
            </div>
        </div>
        
        <br>

        <button class="button is-dark" @click="deselectArea()">Back</button>
    </div>
    <!--List pops up if no area selected-->
    <div v-else>
        <div v-for="i in explore.getAreas">
            <p>{{ i.getName() }}</p>
            <button class="button is-dark" @click="setSelectedArea(i)">Embark</button>
        </div>
    </div>

</template>
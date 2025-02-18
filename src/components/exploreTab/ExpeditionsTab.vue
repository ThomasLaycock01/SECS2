<script setup>
import { reactive } from 'vue';

import CombatScreen from './CombatScreen.vue';
import Tooltip from '../Tooltip.vue';

import { useExpeditionsStore } from '@/stores/barracks/expeditions';
import { usePartiesStore } from '@/stores/barracks/parties';
import { useTooltipsStore } from '@/stores/misc/tooltips';

const expeditions = useExpeditionsStore();
const parties = usePartiesStore();
const tooltips = useTooltipsStore();

var expeditionsTab = reactive({selectedExpedition: null, settingParty: false});

function selectExpedition(obj) {
    expeditionsTab.selectedExpedition = obj;
}

function deselectExpedition() {
    expeditionsTab.selectedExpedition = null;
    expeditionsTab.settingParty = false;
}

function startSettingParty() {
    expeditionsTab.settingParty = true;
}

function stopSettingParty() {
    expeditionsTab.settingParty = false;
}

function setSelectedParty(party) {
    if (expeditionsTab.selectedExpedition.getActiveParty() && expeditionsTab.selectedExpedition.getActiveParty().getId() == party.getId()) {
        expeditionsTab.selectedExpedition.removeActiveParty();
    }
    else {
        expeditionsTab.selectedExpedition.setActiveParty(party);
    }
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
</script>


<template>

    <div class="title is-5 mb-1 segment-title">Expeditions</div>
    <!--Display for chosing an expedition-->
    
    <div v-if="expeditionsTab.selectedExpedition">
        <!--If an active expedition has been selected-->
        <div>
            <!--v-if for setting the party-->
            <div v-if="expeditionsTab.settingParty">
                <div v-if="Object.keys(parties.getParties).length > 0">
                    <div v-for="i in parties.getParties">
                        <button class="button is-dark" :class="expeditionsTab.selectedExpedition.getActiveParty() && expeditionsTab.selectedExpedition.getActiveParty().getId() == i.getId() ? 'is-info' : ''" @click="setSelectedParty(i)">{{ i.getName() }}</button>
                    </div>
                </div>
                <div v-else>
                    No parties available!
                </div>
                <button class="button is-dark" @click="stopSettingParty()">Back</button>
            </div>
            <div v-else>
                <p>{{ expeditionsTab.selectedExpedition.getName() }}</p>
                <p>Length {{ expeditionsTab.selectedExpedition.getLength() }}</p>
                <p>{{ expeditionsTab.selectedExpedition.getDesc() }}</p>
                <br>
                <div v-if="expeditions.getActiveExpedition && expeditions.getActiveExpedition.getId() == expeditionsTab.selectedExpedition.getId()">
                    <!--When  active-->
                    <CombatScreen :areaObject="expeditions.getActiveExpedition" type="expedition"/>
                    <button class="button is-dark" @click="retreatClick()">Retreat!</button>
                </div>
                <!--When inactive-->
                <div v-else>
                    <div>Party: </div>
                    <div>{{ expeditionsTab.selectedExpedition.getActiveParty() ? expeditionsTab.selectedExpedition.getActiveParty().getName() : "No party assigned!" }}</div>
                    <button class="button is-dark"  @click="startSettingParty()">Set Party</button>
                    <br>
                    <button class="button is-dark" :disabled="!embarkCheck()" @click="embarkClick()" @mouseenter="tooltips.setActiveTooltip('embarkWarning')" @mouseleave="tooltips.removeActiveTooltip()">Embark!</button>
                    <span v-if="tooltips.getActiveTooltip == 'embarkWarning' && tooltips.checkEmbarkWarning(expeditionsTab.selectedExpedition)">
                        <Tooltip class="tooltip" :tooltipType="'warning'" :warningObj="tooltips.checkEmbarkWarning(expeditionsTab.selectedExpedition)"/>
                    </span>
                </div>
            </div>
        </div>
        <br>
        <button class="button is-danger" @click="deselectExpedition()">Back</button>
    </div>
    <!--If nothing else, a list of all expeditions-->
    <div v-else>
        <div v-for="i in expeditions.getAvailableExpeditions">
            <div v-if="i.getUnlocked()">
                <p>{{ i.getName() }}</p>
                <p>Length {{ i.getLength() }}</p>
                <button class="button is-dark" @click="selectExpedition(i)">Embark</button>
            </div>
        </div>
    </div>

</template>
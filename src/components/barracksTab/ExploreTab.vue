<script setup>
import { reactive } from 'vue';

import { useExploreStore } from '@/stores/barracks/explore';
import { usePartiesStore } from '@/stores/barracks/parties';

const explore = useExploreStore();
const parties = usePartiesStore();

var exploreTab = reactive({selectedArea: null, settingParty: false, selectedParty: null});

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
    exploreTab.selectedArea.setActiveParty(party);
}

function toggleActive() {
    exploreTab.selectedArea.toggleActive();
}
</script>


<template>

    <div class="title is-5 mb-1 segment-title">Explore</div>
    <!--Area view-->
    <div v-if="exploreTab.selectedArea">
        <p>{{ exploreTab.selectedArea.getName() }}</p>
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
            <br>
            <br>
            <!--Displaying party-->
            <div v-if="exploreTab.selectedArea.getActiveParty()">
                Party:
                <br>
                <span v-for="i in exploreTab.selectedArea.getActiveParty().getSlots()">
                    <div v-if="i.cultist">
                        {{ i.cultist.getName() }} - {{ i.role.getName() }} - <span v-if="!i.cultist.getKnockedOut()">{{ i.cultist.getCurrentHP() }}/{{ i.cultist.getStat("HP") }}</span><span v-else>Knocked Out! {{ Math.floor(i.cultist.getKnockOutTime() / 60) }} Mins {{ i.cultist.getKnockOutTime() % 60 }} secs left</span>
                    </div>
                </span>
            </div>
            <br>
            <!--Displaying enemies-->
            <div v-if="exploreTab.selectedArea.getCurrentEncounter().length > 0">
                Enemies:
                <br>
                <span v-for="i in exploreTab.selectedArea.getCurrentEncounter()">
                    {{ i.getName() }} - {{ i.getCurrentHP() }}/{{ i.getStat("HP") }}
                </span>
            </div>
            <br>
            <button class="button" :class="exploreTab.selectedArea.getActive() ? 'is-info' : 'is-danger'" @click="toggleActive()">Toggle Active</button>
            <br>
            <button class="button is-dark" @click="deselectArea()">Back</button>
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
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
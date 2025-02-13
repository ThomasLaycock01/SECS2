<script setup>
import { reactive } from 'vue';

import { useExpeditionsStore } from '@/stores/barracks/expeditions';
import { usePartiesStore } from '@/stores/barracks/parties';

const expeditions = useExpeditionsStore();
const parties = usePartiesStore();

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

function embarkClick() {
    expeditions.setActiveExpedition(expeditionsTab.selectedExpedition.getId())
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
                    <!--Display party-->
                    <p>Party:</p>
                    <br>
                    <span v-for="i in expeditionsTab.selectedExpedition.getActiveParty().getSlots()">
                        <div v-if="i.cultist">
                            {{ i.cultist.getName() }} - {{ i.role.getName() }} - <span v-if="!i.cultist.getKnockedOut()">{{ i.cultist.getCurrentHP() }}/{{ i.cultist.getStat("HP") }}</span><span v-else>Knocked Out! {{ Math.floor(i.cultist.getKnockOutTime() / 60) }} Mins {{ i.cultist.getKnockOutTime() % 60 }} secs left</span>
                        </div>
                    </span>
                    <!--Display enemies-->
                    <div v-if="expeditionsTab.selectedExpedition.getCurrentEncounter().length > 0">
                        Enemies:
                        <br>
                        <div v-for="i in expeditionsTab.selectedExpedition.getCurrentEncounter()">
                            {{ i.getName() }} - {{ i.getCurrentHP() }}/{{ i.getStat("HP") }}
                        </div>
                    </div>
                    <br>
                    <button class="button is-dark" @click="retreatClick()">Retreat!</button>
                </div>
                <!--When inactive-->
                <div v-else>
                    <div>Party: </div>
                    <div>{{ expeditionsTab.selectedExpedition.getActiveParty() ? expeditionsTab.selectedExpedition.getActiveParty().getName() : "No party assigned!" }}</div>
                    <button class="button is-dark"  @click="startSettingParty()">Set Party</button>
                    <br>
                    <button class="button is-dark" :disabled="expeditionsTab.selectedExpedition.getActiveParty() == null" @click="embarkClick()">Embark!</button>
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
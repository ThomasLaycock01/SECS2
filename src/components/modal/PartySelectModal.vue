<script setup>
import { reactive } from 'vue';

import { usePartiesStore } from '@/stores/barracks/parties';
import { useModalsStore } from '@/stores/misc/modal';

import UnitBox from '../misc/UnitBox.vue';

const parties = usePartiesStore();
const modals = useModalsStore();

function setSelectedParty(party) {
    //if the party is already assigned, remove it
    if (modals.getPartySelectAreaObj.getActiveParty() && modals.getPartySelectAreaObj.getActiveParty().getId() == party.getId()) {
        modals.getPartySelectAreaObj.removeActiveParty();
    }
    else {
        modals.getPartySelectAreaObj.setActiveParty(party);
    }
}
</script>


<template>

<div class="modalBackdrop" @click="modals.closePartySelect()"></div>

<div class="generalModal">
    <div class="modalHeader">
       <p>Setting party - {{ modals.getPartySelectAreaObj.getName() }}</p>
    </div>

    <div class="modalBody">
        <div class="columns">
            <div class="column is-one-quarter">
                <div v-if="Object.keys(parties.getParties).length > 0">
                    <div v-for="i in parties.getParties">
                        <button class="button is-dark" :class="modals.getPartySelectAreaObj.getActiveParty() && i.getId() == modals.getPartySelectAreaObj.getActiveParty().getId() ? 'is-info' : ''"  @click="setSelectedParty(i)" :disabled="i.getCurrentActivity()">{{ i.getName() }}</button>
                    </div>
                </div>
                <div v-else>
                    No parties available!
                </div>
            </div>
            <div class="column is-three-quarters">
                <div v-if="modals.getPartySelectAreaObj.getActiveParty()">
                    <div class="title is-5 mb-1 segment-title">{{modals.getPartySelectAreaObj.getActiveParty().getName()}}</div>
                    <div class="inline-blockContainer">
                        <span v-for="i in modals.getPartySelectAreaObj.getActiveParty().getSlots()" class="mr-1">
                            <UnitBox :unit="i" type="cultist" :key="i.getId()"/>
                        </span>
                        <span v-for="i in modals.getPartySelectAreaObj.getActiveParty().getFreeSlots()" class="mr-1">
                            <UnitBox :unit="null" type="empty" :key="'empty'"/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modalFooter">
        <button class="button is-danger wideBtn" @click="modals.closePartySelect()">Close</button>
    </div>

</div>

</template>
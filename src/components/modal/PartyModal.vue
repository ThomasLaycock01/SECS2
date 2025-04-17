<script setup>
import { reactive } from 'vue';

import { useModalsStore } from '@/stores/misc/modal';
import { useCultistsStore } from '@/stores/globalPinias/cultists';

const modals = useModalsStore();
const cultists = useCultistsStore();

const party = modals.getPartyObj;

const partyModal = reactive({selectedSlot: null});

function setSelectedSlot(slot) {
    partyModal.selectedSlot = slot;
}

function cultistButtonClick(cultist) {

    party.setCultist(partyModal.selectedSlot, cultist);

    /*if (partyModal.selectedSlot.cultist && cultist.getId() == partyModal.selectedSlot.cultist.getId()) {
        partyModal.selectedSlot.cultist = null;
        cultist.removeParty();
        cultist.removeRole();
    } 
    else {
        if (partyModal.selectedSlot.cultist) {
            partyModal.selectedSlot.cultist.removeParty();
        }
        partyModal.selectedSlot.cultist = cultist;

        cultist.setParty(party);
    }*/

}
</script>


<template>

    <div class="modalBackdrop" @click="modals.closeParty(party)"></div>

    <div class="generalModal">
        <div class="modalHeader">
            <p>{{party.getName()}} - {{ party.getPartySize() }}/{{ party.getLimit() }}</p>
        </div>

        <div class="modalBody">
            <div class="columns partyColumns">
                <div class="column is-half">
                    <div v-for="i in party.getLimit()" class="mb-2" :class="partyModal.selectedSlot == i ? 'selectedPartySlot' : 'partySlot'" @click="setSelectedSlot(i)">
                        <div>Slot {{ i }}</div>
                        <div>Cultist: {{ party.getSlots()[i] ? party.getSlots()[i].getName() : "None" }}</div>
                        <div>Role: {{ party.getSlots()[i] && party.getSlots()[i].getRole() ? party.getSlots()[i].getRole().getName() : "None" }}</div>
                    </div>
                </div>
                <div class="column is-half">
                    <div v-if="partyModal.selectedSlot != null">
                        <div class="partySelectorTop">
                            <div class="title is-5 mb-1 segment-title">Cultists</div>
                            <div class="cultistGridContainer">
                                <span v-for="i in cultists.getCultists">
                                    <button  class="button cultistGridItem" :class="party.checkIfContainsCultist(i.getId()) ? 'is-info' : 'is-dark'" :disabled="(i.getParty() && !(partyModal.selectedSlot.cultist && partyModal.selectedSlot.cultist.getId() == i.getId())) || !i.getRole()" @click="cultistButtonClick(i)">{{i.getName()}}</button>
                                </span>
                            </div>
                        </div>
                        <div class="partySelectorBottom">
                            <div v-if="partyModal.selectedSlot.cultist">
                                <div class="title is-5 mb-1 segment-title">{{partyModal.selectedSlot.cultist.getName()}}</div>
                                <div>Stats:</div>
                                <ul>
                                    <li v-for="key, value in partyModal.selectedSlot.cultist.getStatObj()">{{ key }} {{ value }}</li>
                                </ul>
                            </div>
                        </div>
                        </div>

                </div>
            </div>

        </div>

        <div class="modalFooter">
            <button class="button is-dark" @click="modals.closeParty(party)">Confirm</button>
            <button class="button is-danger" @click="modals.closeParty(party, false)">Cancel</button>
        </div>

    </div>


</template>

<script>

export default {
    data() {
        return {activeTab: 0}
    }
}

</script>
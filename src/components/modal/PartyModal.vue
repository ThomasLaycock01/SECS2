<script setup>
import { reactive } from 'vue';

import UnitBox from '../misc/UnitBox.vue';

import { tooltip } from '@/functions';

import { useModalsStore } from '@/stores/misc/modal';
import { useCultistsStore } from '@/stores/globalPinias/cultists';
import { useTooltipsStore } from '@/stores/misc/tooltips';

const modals = useModalsStore();
const cultists = useCultistsStore();
const tooltips = useTooltipsStore();

const party = modals.getPartyObj;

const selected = reactive({slot: null});

function setSelectedSlot(slot) {
    selected.slot = slot;
}

function mouseoverCultist(e, cultist) {
    const warnings = tooltips.checkAssignWarning(cultist);

    const obj = {
        type: "warn",
        array: warnings
    }

    if (warnings) {
        tooltip(e, obj)
    }
}

function cultistButtonClick(cultist) {

    if (party.getCultistBySlot(selected.slot) && cultist.getId() == party.getCultistBySlot(selected.slot).getId()) {
        //theres a cultist there, and it was the one that was clicked
        cultist.removeParty();
        party.removeCultist(selected.slot);
    }
    else {
        if (party.getCultistBySlot(selected.slot)) {
            //theres a cultist there, and it wasnt the one that was clicked
            party.getCultistBySlot(selected.slot).removeParty();
        }

        //runs if replacing a cultist, or if there wasnt one there
        party.setCultist(selected.slot, cultist);
        cultist.setParty(party);
    }

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
                    <div v-for="i in party.getLimit()" class="mb-2" :class="selected.slot == i ? 'selectedPartySlot' : 'partySlot'" @click="setSelectedSlot(i)">
                        <div>Slot {{ i }}</div>
                        <div>Cultist: {{ party.getSlots()[i] ? party.getSlots()[i].getName() : "None" }}</div>
                        <div>Role: {{ party.getSlots()[i] && party.getSlots()[i].getRole() ? party.getSlots()[i].getRole().getName() : "None" }}</div>
                    </div>
                </div>
                <div class="column is-half">
                    <div v-if="selected.slot != null">
                        <div class="partySelectorTop">
                            <div class="title is-5 mb-1 segment-title">Cultists</div>
                            <div class="cultistGridContainer">
                                <span v-for="i in cultists.getCultists">
                                    <button  class="button cultistGridItem" :class="party.checkIfContainsCultist(i.getId()) ? 'is-info' : 'is-dark'" :disabled="(i.getParty() && !(selected.slot && party.getCultistBySlot(selected.slot) && party.getCultistBySlot(selected.slot).getId() == i.getId())) || !i.getRole()" @click="cultistButtonClick(i)" @mouseenter="mouseoverCultist($event, i)" @mouseleave="tooltips.hideTooltip()">{{i.getName()}}</button>
                                </span>
                            </div>
                        </div>
                        <br>
                        <div class="partySelectorBottom">
                            <div v-if="party.getCultistBySlot(selected.slot)">
                                <UnitBox :unit="party.getCultistBySlot(selected.slot)" type="cultist"/>
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
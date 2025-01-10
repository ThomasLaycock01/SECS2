<script setup>
import { reactive } from 'vue';

import { useModalsStore } from '@/stores/misc/modal';
import { usePartiesStore } from '@/stores/barracks/parties';
import { useCultistsStore } from '@/stores/globalPinias/cultists';

const modals = useModalsStore();
const parties = usePartiesStore();
const cultists = useCultistsStore();

const party = modals.getPartyObj;

const partyModal = reactive({selectedSlot: null, selectedRole: null, selectedCultist: null});

function setSelectedSlot(id) {
    partyModal.selectedSlot = id;
}

function setRole(role) {
    partyModal.selectedRole = role;

    party.setRole(partyModal.selectedSlot, role);
}

function setCultist(cultist) {
    partyModal.selectedCultist = cultist;

    cultist.setParty(party);

    party.setCultist(partyModal.selectedSlot, cultist);
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
                    <div v-for="i in party.getSlots()" :class="partyModal.selectedSlot == i.id ? 'selectedPartySlot mb-2' : 'partySlot mb-2'" @click="setSelectedSlot(i.id)">
                        <div>Slot {{ i.id + 1 }}</div>
                        <div>Cultist: {{ i.cultist ? i.cultist.getName() : "None" }}</div>
                        <div>Role: {{ i.role ? i.role.getName() : "None" }}</div>
                    </div>
                </div>
                <div class="column is-half">
                    <div v-if="partyModal.selectedSlot != null">
                            <b-tabs v-model="activeTab">
                                <b-tab-item label="Roles">
                                    <div class="partySelectorTop">
                                        <!--If a slot is selected, show roles-->
                                        <div class="title is-5 mb-1 segment-title">Roles</div>
                                        <div class="cultistContainer">
                                            <span v-for="i in parties.getRoles">
                                                <button  class="button is-dark cultistGridItem" :class="party.getRoleBySlot(partyModal.selectedSlot) == i.getId() ? 'is-info' : ''" @click="setRole(i)">{{i.getName()}}</button>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="partySelectorBottom">
                                        <div v-if="partyModal.selectedRole">
                                            <div class="title is-5 mb-1 segment-title">{{partyModal.selectedRole.getName()}}</div>
                                            <div>{{ partyModal.selectedRole.getDesc() }}</div>
                                            <br>
                                            <div class="partySelectorTableLine">
                                                <div>
                                                    <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <th>DMG</th>
                                                            <th>Physical</th>
                                                            <th>Magical</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Dealt</td>
                                                            <td>{{ partyModal.selectedRole.getDmgGiven("phys") * 100 }}%</td>
                                                            <td>{{ partyModal.selectedRole.getDmgGiven("mag") * 100 }}%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Taken</td>
                                                            <td>{{ partyModal.selectedRole.getDmgTaken("phys") * 100 }}%</td>
                                                            <td>{{ partyModal.selectedRole.getDmgTaken("mag") * 100 }}%</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                </div>
                                                <div>
                                                    <div>Special</div>
                                                    <div>{{ partyModal.selectedRole.getModDesc() }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </b-tab-item>
                                <b-tab-item label="Cultists">
                                    <div class="partySelectorTop">
                                        <div class="title is-5 mb-1 segment-title">Cultists</div>
                                        <div class="cultistContainer">
                                            <span v-for="i in cultists.getRegularCultists">
                                                <button  class="button is-dark cultistGridItem" :class="party.checkIfContainsCultist(i.getId()) ? 'is-info' : ''" :disabled="i.getParty() && (i.getPartyId() != party.getId())" @click="setCultist(i)">{{i.getName()}}</button>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="partySelectorBottom">
                                        <div v-if="partyModal.selectedCultist">
                                            <div class="title is-5 mb-1 segment-title">{{partyModal.selectedCultist.getName()}}</div>
                                            <div>Stats:</div>
                                            <ul>
                                                <li v-for="key, value in partyModal.selectedCultist.getStatObj()">{{ key }} {{ value }}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </b-tab-item>
                            </b-tabs>
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
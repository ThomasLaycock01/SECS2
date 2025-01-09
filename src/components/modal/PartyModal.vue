<script setup>
import { reactive } from 'vue';

import { useModalsStore } from '@/stores/misc/modal';
import { usePartiesStore } from '@/stores/barracks/parties';

const modals = useModalsStore();
const parties = usePartiesStore();

const party = modals.getPartyObj;

const partyModal = reactive({selectedRole: null});

function setSelectedRole(roleObj) {
    partyModal.selectedRole = roleObj;
}
</script>


<template>

    <div class="modalBackdrop" @click="modals.closeParty()"></div>

    <div class="generalModal">
        <div class="modalHeader">
            <p>{{party.getName()}} - {{ party.getPartySize() }}/{{ party.getLimit() }}</p>
        </div>

        <div class="modalBody">
            
            <b-tabs v-model="activeTab">
                <!--Tab for assigning Roles-->
                <b-tab-item label="Roles">
                    <div class="columns">
                        <div class="column is-half">
                            <div class="title is-5 mb-1 segment-title">Roles</div>
                            <div class="cultistContainer">
                                <span v-for="i in parties.getRoles">
                                    <button  class="button is-dark is-info cultistGridItem" @click="setSelectedRole(i)">{{i.getName()}}</button>
                                </span>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div v-if="partyModal.selectedRole">
                                <div class="title is-5 mb-1 segment-title">{{ partyModal.selectedRole.getName() }}</div>
                                <div>{{ partyModal.selectedRole.getDesc() }}</div>
                                <br>
                                <div>
                                    Damange output:
                                    <ul>
                                        <li>{{ partyModal.selectedRole.getDmgGiven("phys") * 100 }}% Physical</li>
                                        <li>{{ partyModal.selectedRole.getDmgGiven("mag") * 100 }}% Magic</li>
                                    </ul>
                                </div>
                                <br>
                                <div>
                                    Damange taken:
                                    <ul>
                                        <li>{{ partyModal.selectedRole.getDmgTaken("phys") * 100 }}% Physical</li>
                                        <li>{{ partyModal.selectedRole.getDmgTaken("mag") * 100 }}% Magic</li>
                                    </ul>
                                </div>
                                <br>
                                <div>{{ partyModal.selectedRole.getModDesc() }}</div>
                            </div>
                            <div v-else>
                                No role selected
                            </div>
                        </div>
                    </div>
                </b-tab-item>

                <!--Tab for assigning cultists-->
                <b-tab-item label="Cultists">

                </b-tab-item>
            </b-tabs>
        </div>

        <div class="modalFooter">
            <button class="button is-dark">Confirm</button>
            <button class="button is-danger" @click="modals.closeParty()">Cancel</button>
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
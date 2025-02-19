<script setup>
import { reactive } from 'vue';

import { useModalsStore } from '@/stores/misc/modal';
import { useCultistsStore } from '@/stores/globalPinias/cultists';

import { addCultistToJob, removeCultistFromJob } from '@/functions';

const modals = useModalsStore();
const cultists = useCultistsStore();

const pinia = modals.getAssignmentPinia;
const job = modals.getAssignmentJob;

var assignmentModal = reactive({activeCultist: null});

function cultistButtonClick(cultist) {

    if (assignmentModal.activeCultist != cultist) {
        assignmentModal.activeCultist = cultist;
    }
    else {
        if (pinia.getJobArray(job).includes(cultist)) {
            removeCultistFromJob(pinia, job, cultist);
        }
        else {
            addCultistToJob(pinia, job, cultist);
        }
    }
}
</script>


<template>

    <div class="modalBackdrop" @click="modals.closeAssignment()"></div>

    <div class="generalModal">
        <div class="modalHeader">
            <p>Assign Workers - {{ pinia.getJobName(job) }} - {{ pinia.getJobArray(job).length }}/{{ pinia.getJobLimit(job) }}</p>
        </div>

        <div class="modalBody">
            <div class="columns">
                <div class="column is-half">
                    <!--Copied from the HR tab-->
                    <div class="title is-5 mb-1 segment-title">Cultists</div>
                    <div class="cultistContainer">
                        <span v-for="i in cultists.getCultists">
                            <span v-if="pinia.getJobArray(job).includes(i)">
                                <button  class="button is-info cultistGridItem" @click="cultistButtonClick(i)">{{i.getName()}}</button>
                            </span>
                            <span v-else-if="i.getJob()">
                                <button  class="button is-light cultistGridItem" @click="cultistButtonClick(i)">{{i.getName()}}</button>
                            </span>
                            <span v-else>
                                <button  class="button is-dark cultistGridItem" @click="cultistButtonClick(i)">{{i.getName()}}</button>
                            </span>
                        </span>
                    </div>
                    <!--Other half of the HR tab - different to usual-->
                </div>
                <div class="column is-half">
                    <div v-if="assignmentModal.activeCultist != null">
                        <div class="title is-5 mb-1 segment-title">{{ assignmentModal.activeCultist.getName() }}</div>
                        <b-tabs v-model="activeTab">
                            <!--Stats tab-->
                            <b-tab-item label="Stats">
                                <div>{{ assignmentModal.activeCultist.getRaceName() }}</div>
                                <div>{{assignmentModal.activeCultist.getJob() ? assignmentModal.activeCultist.getJob() : "Unemployed"}}</div>
                                <div>Level {{ assignmentModal.activeCultist.getLevel() }} / {{ assignmentModal.activeCultist.getLevelLimit() }}</div>
                                <div>{{ assignmentModal.activeCultist.getXp() }} / {{ assignmentModal.activeCultist.getXpNeeded() }}</div>
                                <br>
                                <ul>
                                    <li>{{ assignmentModal.activeCultist.getCurrentHP() }}/{{ assignmentModal.activeCultist.getStat("HP") }} HP</li>
                                    <li>{{ assignmentModal.activeCultist.getStat("atk") }} Atk</li>
                                    <li>{{ assignmentModal.activeCultist.getStat("def") }} Def</li>
                                    <li>{{ assignmentModal.activeCultist.getStat("spd") }} Spd</li>
                                </ul>
                                <br>
                                <div class="title is-6">Perks</div>
                                <!--Only display unlocked perks on modal-->
                                <div class="container">
                                    <span v-for="i in assignmentModal.activeCultist.getPerks()">
                                        <button  class="button is-outlined">{{i.name}}</button>
                                    </span>
                                </div>
                            </b-tab-item>
                            <!--Equipment tab-->
                            <b-tab-item label="Equipment" >
                                <div class="title is-6">Equipment</div>
                                <div>
                                    <div v-for="value, key in assignmentModal.activeCultist.getEquipment()">
                                        {{key}}:
                                        <button v-if="value" class="button is-info">{{ value.name }}</button>
                                        <button v-else class="button is-outlined">Empty</button>
                                    </div>
                                </div>
                            </b-tab-item>
                        </b-tabs>
                    </div>
                    <div v-else>Select a cultist!</div>
                </div>
            </div>
        </div>

        <div class="modalFooter">
            <button class="button is-dark" v-if="assignmentModal.activeCultist" @click="cultistButtonClick(assignmentModal.activeCultist)" :disabled="pinia.getJobArray(job).length == pinia.getJobLimit(job) && !pinia.getJobArray(job).includes(assignmentModal.activeCultist.getId())">{{pinia.getJobArray(job).includes(assignmentModal.activeCultist) ? "Unassign" : "Assign"}}</button>
            <button class="button is-danger" @click="modals.closeAssignment()">Close</button>
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
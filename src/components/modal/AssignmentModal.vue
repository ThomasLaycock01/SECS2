<script setup>
import { useModalsStore } from '@/stores/misc/modal';
import { useCultistsStore } from '@/stores/globalPinias/cultists';
import { useExpansionsStore } from '@/stores/globalPinias/expansions';

const modals = useModalsStore();
const cultists = useCultistsStore();
const expansions = useExpansionsStore();

const pinia = modals.getAssignmentPinia;
const job = modals.getAssignmentJob;

const jobArray = pinia.getJobArray(job);
</script>


<template>

    <div class="modalBackdrop" @click="modals.closeAssignment()"></div>

    <div class="assignmentModal">
        <div class="assignmentModalHeader">
            <p>Assign Workers - {{ pinia.getJobName(job) }}</p>
        </div>

        <div class="assignmentModalBody">
            <div class="columns">
                <div class="column is-half">
                    <!--Copied from the HR tab-->
                    <div class="title is-5 mb-1 segment-title">Cultists</div>
                    <div class="cultistContainer">
                        <span v-for="i in cultists.getRegularCultists">
                            <span v-if="jobArray.includes(i.getId())">
                                <button  class="button is-info cultistGridItem">{{i.getName()}}</button>
                            </span>
                            <span v-else>
                                <button  class="button is-dark cultistGridItem">{{i.getName()}}</button>
                            </span>
                        </span>
                    </div>
                    <div v-if="expansions.checkIfSummonAvailable">
                        <div class="title is-5 mb-1 segment-title">Summons</div>
                        <div class="cultistContainer">
                            <span v-if="jobArray.includes(i.getId())">
                                <button  class="button is-info cultistGridItem">{{i.getName()}}</button>
                            </span>
                            <span v-else>
                                <button  class="button is-dark cultistGridItem">{{i.getName()}}</button>
                            </span>
                        </div>
                    </div>
                    <!--Other half of the HR tab - different to usual-->
                </div>
                <div class="column is-half">col2</div>
            </div>
        </div>

        <div class="assignmentModalFooter">Footer</div>

    </div>


</template>
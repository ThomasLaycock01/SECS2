<script setup>
import { useBarracksStore } from '@/stores/barracks/barracks';
import { useCultistsStore } from '@/stores/globalPinias/cultists';
import { useModalsStore } from '@/stores/misc/modal';

const barracks = useBarracksStore();
const cultists = useCultistsStore();
const modals = useModalsStore();

function addRole(role) {
    barracks.addRole(role)
}
</script>


<template>

    <div>
        <!--Roles-->
        <div class="title is-5 mb-1 segment-title">Party - {{ barracks.getPartySize }} / {{ barracks.getPartyLimit }}</div>
        <div>
            <div v-if="barracks.checkIfPartySpace">
                <b-field label="Add Role">
                    <button class="button is-dark" @click="addRole('knight')">Knight</button>
                    <button class="button is-dark" @click="addRole('mage')">Mage</button>
                    <button class="button is-dark" @click="addRole('healer')">Healer</button>
                </b-field>
            </div>
        </div>
        <!--Cultists-->
        <br/>
        <div>
            <div v-for="i in barracks.getJobs">
                <div v-if="i.limit > 0">
                    <div>
                        <p>{{ i.name }} - {{ barracks.getJobArray(i.id).length }}/{{ barracks.getJobLimit(i.id) }}:</p> 
                        <div v-if="barracks.getJobArray(i.id).length > 0">
                            <div v-for="i in barracks.getJobArray(i.id)">
                                {{ cultists.getCultistById(i).getName() }}
                            </div>
                        </div>
                        <div v-else>Empty</div>
                    </div>
                    <button class="button is-dark" @click="modals.openAssignment(barracks, i.id)">Assign</button>
                </div>
            </div>
            <br>
        </div>
    </div>

</template>
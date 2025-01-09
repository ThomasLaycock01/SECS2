<script setup>
import { usePartiesStore } from '@/stores/barracks/parties';
import { useModalsStore } from '@/stores/misc/modal';

const parties = usePartiesStore();
const modals = useModalsStore();
</script>


<template>

    <div>
        <div class="title is-5 mb-1 segment-title">Parties</div>
        <button class="button is-dark" @click="modals.openParty()">Create Party</button>
        <br>
        <br>
        <div v-if="parties.getParties.length > 0">
            <div v-for="i in parties.getParties">
                {{ i }}
            </div>
        </div>
        <div v-else>
            No parties
        </div>
        <!--Roles
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
        <!--Cultists
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
                    <button class="button is-danger" :disabled="!(barracks.getJobArray(i.id).length < barracks.getJobLimit(i.id))" @click="removeRole(i.id)">-1</button>
                    <button class="button is-danger" :disabled="!barracks.getJobArray(i.id).length == 0" @click="removeAllRole(i.id)">-All</button>
                </div>
            </div>
            <br>
        </div>-->
    </div>

</template>